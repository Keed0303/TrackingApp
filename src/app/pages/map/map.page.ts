import { Component, OnDestroy, OnInit } from '@angular/core';
import { Feature } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import { Geometry, LineString, Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: false,
})
export class MapPage implements OnInit, OnDestroy {
  private map: Map | undefined;
  vectorSource= new VectorSource(); 
  lineString: LineString = new LineString([]); 
  currentPosition!: Feature; // Marker for current location

  constructor() {}

  ngOnInit() {
    this.initMap();
    this.startTracking();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = undefined;
    }
  }

  async initMap() {
    const { latitude, longitude } = (
      await Geolocation.getCurrentPosition({ enableHighAccuracy: true })
    ).coords;

    const initialPoint = fromLonLat([longitude, latitude]);

    // Add initial features
    this.lineString.appendCoordinate(initialPoint); // Add the initial point to the LineString
    this.currentPosition = new Feature(new Point(initialPoint));
    this.vectorSource.addFeature(new Feature(this.lineString)); // Add the line string to the vector source
    this.vectorSource.addFeature(this.currentPosition); // Add the current position marker to the vector source

    // Initialize the map
    setTimeout(() => {
      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            }),
          }),
          new VectorLayer({
            source: this.vectorSource, // Add the vector source to a vector layer
          }),
        ],
        view: new View({
          center: initialPoint,
          zoom: 15,
        }),
      });
    }, 500);
  }

  async startTracking() {
    if (Capacitor.getPlatform() !== 'web') {
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== 'granted') {
        alert('Location permission is required to track your path.');
        return;
      }
    }

    Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
      },
      (position, err) => {
        if (err || !position) {
          console.error('Geolocation error:', err);
          return;
        }

        const { latitude, longitude } = position.coords;
        const newPoint = fromLonLat([longitude, latitude]);

        // Update the current position marker
        const geometry = this.currentPosition.getGeometry();
        if (geometry) {
          (geometry as Point).setCoordinates(newPoint);
        }

        // Update the line string with the new point
        this.lineString.appendCoordinate(newPoint);

        // Center the map on the new point
        this.map?.getView().setCenter(newPoint);
      }
    );
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Feature } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import { LineString, Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
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
  vectorSource = new VectorSource(); // For dynamic path updates
  lineString = new LineString([]); // User's walking path
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

  initMap() {
    setTimeout(() => {
      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            }),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
  

    }, 500);
    this.vectorSource.addFeature(new Feature(this.lineString));
  
    this.currentPosition = new Feature(new Point(fromLonLat([0, 0])));
    this.vectorSource.addFeature(this.currentPosition);
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
  
        this.lineString.appendCoordinate(newPoint);
        this.map?.getView().setCenter(newPoint);
      }
    );
  }
  
}

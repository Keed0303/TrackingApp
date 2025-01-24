import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';

export type Coordinate = {
  timestamp: number;
  lat: number;
  lon: number;
};

@Injectable({
  providedIn: 'root'
})
export class CoordinateService {
  coordinates$: BehaviorSubject<Coordinate[]> = new BehaviorSubject<Coordinate[]>([]);
  coordinatesKey: string = 'coordinates';

  constructor(private _storageService: StorageService) { }

	async setCoordinate(coordinateData: Coordinate) {
		let coordinates: Coordinate[] = await this._storageService.get(this.coordinatesKey) || [];
		coordinates.push(coordinateData);

		await this._storageService.set(this.coordinatesKey, coordinates);
		this.coordinates$.next(coordinates);
	}
}

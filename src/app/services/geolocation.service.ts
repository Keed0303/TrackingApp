import { Injectable } from '@angular/core';
import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';
import { registerPlugin } from '@capacitor/core';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation'
);

export type BackgroundPositionGeolocation = {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  bearing: number;
  latitude: number;
  longitude: number;
  simulated: boolean;
  speed: number;
  time: number;
};

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {

  constructor() {}

  guessLocation(locationCallback: Function, distanceFilter: number = 0) {

    BackgroundGeolocation.addWatcher(
      {
       
        backgroundMessage: 'Cancel to prevent battery drain.',
        backgroundTitle: 'Tracking You.',
        requestPermissions: true,
        stale: false,
        distanceFilter: distanceFilter,
      },
      function callback(location, error) {
        if (error) {
          if (error.code === 'NOT_AUTHORIZED') {
            if (
              window.confirm(
                'This app needs your location, ' +
                  'but does not have permission.\n\n' +
                  'Open settings now?'
              )
            ) {
              BackgroundGeolocation.openSettings();
            }
          }
          return console.error(error);
        }
        
        locationCallback();

        return console.log(location);
      }
    ).then(function after_the_watcher_has_been_added(watcher_id) {
      BackgroundGeolocation.removeWatcher({
        id: watcher_id,
      });
    });
  }
  
}

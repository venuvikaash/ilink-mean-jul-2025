import { Pipe, PipeTransform } from '@angular/core';
import { ILocation } from '../../workshops/models/IWorkshop';

@Pipe({
  name: 'location'
})
export class LocationPipe implements PipeTransform {
  transform(value: ILocation, format : 'short' | 'long' = 'long'): string {
    console.log( 'pipe called');
    console.log( 'data = ', value );

    if ( format === 'short' ) {
      console.log('short');
      return `${value.address}, ${value.city}`;
    } else {
      console.log('long');
      return `${value.address}, ${value.city}, ${value.state}`;
    }
  }
}

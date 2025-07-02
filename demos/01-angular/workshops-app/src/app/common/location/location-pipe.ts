import { Pipe, PipeTransform } from '@angular/core';
import { ILocation } from '../../workshops/models/IWorkshop';

@Pipe({
  name: 'location'
})
export class LocationPipe implements PipeTransform {
  transform(value: ILocation, format : 'short' | 'long' = 'long'): string {
    if ( format === 'short' ) {
      return `${value.address}`;
    } else {
      return `${value.address}`;
    }

    return "";
  }
}

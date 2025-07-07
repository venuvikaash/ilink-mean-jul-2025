import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidatorsService {
  constructor() {}

  csv(maxValues: number) {
    return function (control: AbstractControl) {
      const value = control.value;

      const values = value.split(',');

      // take care of case of empty string (considered as passing the csv validation)
      if (value === '' || values.length <= maxValues) {
        return null;
      }

      // return the errors object
      return {
        csv: true,
        maxValues: maxValues,
        actualValues: values.length,
      };
    };
  }
}

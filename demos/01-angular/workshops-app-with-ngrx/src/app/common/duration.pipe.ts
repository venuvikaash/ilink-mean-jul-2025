import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  transform(durationInHours: number, ...args: unknown[]): unknown {
    return null;
  }

}

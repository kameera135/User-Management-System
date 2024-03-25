//FOR DESIRIALIZE THE JWT OUTPUT
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'json' })
export class JsonPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return JSON.parse(value);
  }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortContent'
})
export class ShortContentPipe implements PipeTransform {

  transform(value: string, endIndex: number): string {
    return value.length > endIndex ? value.slice(0, endIndex) + '...' : value;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray'
})
export class FilterArrayPipe implements PipeTransform {

  transform(value: any[], ...args: any[]): any {
    return value.filter(x => x.Visible);
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'role'
})

export class RolePipe implements PipeTransform {
  transform(value: any, arg: string): any {
    if (arg) {
      return _.filter(value, d => d.roles.indexOf(arg) !== -1);
    }

    return _.filter(value, d => !d.roles);
  }
}

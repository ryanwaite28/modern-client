import { Pipe, PipeTransform } from '@angular/core';
import { UtilityService } from '../services/utility.service';

@Pipe({
  name: 'deltaHtmlConvert'
})
export class DeltaHtmlConvertPipe implements PipeTransform {

  constructor(
    private utilityService: UtilityService
  ) {}

  transform(value: unknown, ...args: unknown[]): unknown {
    const converted = this.utilityService.quillGetHTML(value);
    return converted; 
  }

}

import { Pipe, PipeTransform } from '@angular/core';

//pipe decorator
@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  transform(value: string): number {
    const today = new Date();
    const dob = new Date(value);

    let age = today.getFullYear() - dob.getFullYear();
    let monthDiff = today.getMonth() - dob.getMonth();
    let dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }
}

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'finalCountdown',
  pure: false
})
export class FinalCountdownPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    let actualDate = new Date();
    let endDate = new Date(value);

    let secondsToGo = endDate.getTime() - actualDate.getTime();

    if (secondsToGo <= 0) {
      return 'Overdue!';
    }

    let res = '';

    let days = Math.floor(secondsToGo / (1000 * 60 * 60 * 24));
    let hours = Math.floor((secondsToGo % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((secondsToGo % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((secondsToGo % (1000 * 60)) / 1000);

    return `${days}days ${hours}h ${minutes}m ${seconds}s left.`;
  }

}

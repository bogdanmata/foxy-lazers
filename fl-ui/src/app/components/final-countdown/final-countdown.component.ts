import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-final-countdown',
  templateUrl: './final-countdown.component.html',
  styleUrls: ['./final-countdown.component.css']
})
export class FinalCountdownComponent implements OnInit {

  @Input()
  public endDate: string;

  public date = Date;

  constructor() {
  }

  ngOnInit() {
  }

  public getCountDown(): string {
    if (!this.endDate) {
      return '';
    }

    let actualDate = new Date();
    let endDate = new Date(this.endDate);

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

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fl-spinner',
  templateUrl: './fl-spinner.component.html',
  styleUrls: ['./fl-spinner.component.scss']
})
export class FlSpinnerComponent implements OnInit {
  @Input()
  showSpinner: boolean;

  constructor() { }

  ngOnInit() {
  }

}

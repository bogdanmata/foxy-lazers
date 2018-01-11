import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fl-header',
  templateUrl: './fl-header.component.html',
  styleUrls: ['./fl-header.component.scss']
})
export class FlHeaderComponent implements OnInit {
  @Input()
  appName: string;

  @Input()
  login: string;

  @Input()
  className: string;

  constructor() { }

  ngOnInit() {
  }

}

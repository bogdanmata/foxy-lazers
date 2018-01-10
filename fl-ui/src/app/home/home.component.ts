import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public hovered: string = '';

  constructor() { }

  ngOnInit() {
  }

  mouseOver(hovered: string): void {
    this.hovered = hovered;
  }

  mouseLeave(): void {
    this.hovered = '';
  }

  foxDouble(): void {
    this.hovered = '_x';
    setTimeout(() => {
      this.hovered = '';
    }, 700);

  }
}

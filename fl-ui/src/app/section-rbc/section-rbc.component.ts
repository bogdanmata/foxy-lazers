import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-section-rbc',
  templateUrl: './section-rbc.component.html',
  styleUrls: ['./section-rbc.component.css']
})
export class SectionRbcComponent implements OnInit {

  rbcComponentControl: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

  options = [
    'RBC',
    'Bank two',
    'Bank three'
   ];

}

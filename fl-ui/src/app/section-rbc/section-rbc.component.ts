import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-section-rbc',
  templateUrl: './section-rbc.component.html',
  styleUrls: ['./section-rbc.component.css']
})
export class SectionRbcComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  rbcComponentControl: FormControl = new FormControl();

  institutions = [
    'RBC',
    'Bank two',
    'Bank three'
  ]; // TODO obtain this from the block chain (the players declared as institutions)

  instruments = [
    'Sec 1',
    'Sec 2',
    'Sec 3',
    'Sec 4'
  ]; // TODO obtain this from block chain (the products)

}

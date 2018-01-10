import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';

const ELEMENT_DATA: Element[] = [
  {id: '1', name: 'Coca-Cola', isin: '123', quantity: 200},
  {id: '2', name: 'Helium', isin: '456', quantity: 100}
];

export interface Element {
  id: string;
  name: string;
  isin: string;
  quantity: number;
}

@Component({
  selector: 'app-section-borrower',
  templateUrl: './section-borrower.component.html',
  styleUrls: ['./section-borrower.component.scss']
})
export class SectionBorrowerComponent implements OnInit {
  displayedColumns = ['id', 'name', 'isin', 'quantity'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  instruments = [
    {value: 1, viewValue: 'Coca-Cola - ISIN US1912161007'},
    {value: 2, viewValue: 'Airbus - NL0000235190'}
  ];

  constructor() {
  }

  ngOnInit() {
  }
}

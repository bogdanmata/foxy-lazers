import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {
  FeesFrequency, SecurityLandingContract,
  ContractStatus
} from "../model/security-landing-contract.model";

const ELEMENT_DATA: Element[] = [
  {id: '1', name: 'Coca-Cola', isin: '123', quantity: 200},
  {id: '2', name: 'Helium', isin: '456', quantity: 100}
];

const ACTIVE_OFFERS: SecurityLandingContract[] = [
  {
    id: '1',
    startDate: '??',
    endDate: '??',
    quantity: 156,
    collateral: '?',
    status: ContractStatus.ACTIVE,
    fees: 50,
    feesFrequency: FeesFrequency.SEC_10
  }
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

  displayedColumnsActiveOffers = ['id', 'quantity'];
  dataSourceActiveOffers = new MatTableDataSource<SecurityLandingContract>(ACTIVE_OFFERS);

  instruments = [
    {value: 1, viewValue: 'Coca-Cola - ISIN US1912161007'},
    {value: 2, viewValue: 'Airbus - NL0000235190'}
  ];

  newOfferForm = new FormGroup({
    frequency: new FormControl()
  });

  constructor() {
  }

  ngOnInit() {
  }
}

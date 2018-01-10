import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { FormControl } from '@angular/forms';
import {
  FeesFrequency, SecurityLandingContract,
  ContractStatus
} from "../model/security-landing-contract.model";

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
  },
  {
    id: '2',
    startDate: '??',
    endDate: '??',
    quantity: 333,
    collateral: '?',
    status: ContractStatus.ACTIVE,
    fees: 1233,
    feesFrequency: FeesFrequency.AT_CONTRACT_END
  }
];

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

  displayedColumns = ['id', 'name', 'isin', 'quantity'];
  dataSource = new MatTableDataSource<SecurityLandingContract>(ACTIVE_OFFERS);

}

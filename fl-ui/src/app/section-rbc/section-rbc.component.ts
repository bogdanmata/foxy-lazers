import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { FormControl } from '@angular/forms';
import {
  FeesFrequency, SecurityLandingContract,
  ContractStatus, Collateral
} from "../model/security-landing-contract.model";
import {BusinessUser} from "../model/business-user.model";
import {CommonService} from "../common.service";

const ACTIVE_OFFERS: SecurityLandingContract[] = [
  {
    id: '1',
    startDate: '??',
    endDate: '??',
    quantity: 156,
    collateral: <Collateral> { id: '?' },
    status: ContractStatus.ACTIVE,
    fees: 50,
    feesFrequency: FeesFrequency.SEC_10,
    lastCollectedFeesTimestamp: '?',
    instrument: {
      isin: 'isin 01010',
      description: 'desc 74874747'
    },
    bank: {
      name: 'bank 12121',

    },
    borrower: {
      name: 'borrow 11212'
    }
  },
  {
    id: '2',
    startDate: '??',
    endDate: '??',
    quantity: 333,
    collateral: <Collateral> { id: '?' },
    status: ContractStatus.ACTIVE,
    fees: 1233,
    feesFrequency: FeesFrequency.AT_CONTRACT_END,
    lastCollectedFeesTimestamp: '?',
    instrument: {
      isin: 'isin 01010',
      description: 'desc 74874747'
    },
    bank: {
      name: 'bank 12121'
    },
    borrower: {
      name: 'borrow 11212'
    }
  }
];

@Component({
  selector: 'app-section-rbc',
  templateUrl: './section-rbc.component.html',
  styleUrls: ['./section-rbc.component.scss']
})
export class SectionRbcComponent implements OnInit {

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    // Get business user
    this.commonService.updateBusinessUser().subscribe(data => {
      this.businessUser = data;
    });
  }

  public businessUser: BusinessUser;
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

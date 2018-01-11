import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {
  Collateral, ContractStatus, FeesFrequency,
  SecurityLendingContract
} from "../model/security-landing-contract.model";
import {BusinessUser} from "../model/business-user.model";
import {CommonService} from "../common.service";
import {LendingOffer} from '../model/security-landing-offer.model';

const ACTIVE_OFFERS: SecurityLendingContract[] = [
  {
    id: '1',
    startDate: '??',
    endDate: '??',
    quantity: 156,
    collateral: <Collateral> {id: '?'},
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
    collateral: <Collateral> {id: '?'},
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

  public newOffer: FormGroup;
  public businessUser: BusinessUser;
  rbcComponentControl: FormControl = new FormControl();
  displayedColumns = ['id', 'name', 'isin', 'quantity'];
  displayedColumnsSecurityLandingContracts = ['borrower', 'instrument', 'quantity', 'startDate', 'endDate'];
  public securityLandingContracts: MatTableDataSource<SecurityLendingContract>;
  public selectedSecurityLandingContract: SecurityLendingContract;
  public creationInProgress: boolean;

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    // Get business user
    this.commonService.updateBusinessUser().subscribe(data => {
      this.businessUser = data;
    });

    this.commonService.getSecurityLendingContracts().subscribe((data) => {
      this.securityLandingContracts = new MatTableDataSource<SecurityLendingContract>(data);
    })
  }

  public selectSecurityLandingContracts(row: SecurityLendingContract): void {
    this.selectedSecurityLandingContract = row;

    this.newOffer = new FormGroup({
      expirationDate: new FormControl(),
      fees: new FormControl(),
      feesFrequency: new FormControl(),
    });
  }

  public submitOffer(newOffer: FormGroup): void {
    let offer: LendingOffer = {
      expirationDate: newOffer.get('expirationDate').value,
      fees: newOffer.get('fees').value,
      feesFrequency: newOffer.get('feesFrequency').value,
      bank: `com.rbc.hackathon.Bank#bank1`,
      securityLendingContract: `com.rbc.hackathon.SecurityLendingContract#${this.selectedSecurityLandingContract.id}`
    };

    this.creationInProgress = true;
    this.commonService.createLendingOffer(offer).subscribe(() => {
      this.creationInProgress = false;
      this.selectedSecurityLandingContract = undefined;

      this.ngOnInit();
    });
  }

}

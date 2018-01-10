import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {
  FeesFrequency, SecurityLandingContract,
  ContractStatus
} from "../model/security-landing-contract.model";
import {Instrument} from "../model/instrument.model";
import {BusinessUser} from "../model/business-user.model";
import {environment} from "../../environments/environment";

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

export interface Element {
  id: string;
  name: string;
  isin: string;
  quantity: number;
}

export interface FeesDue {
  perSecond: number,
  atContractEnd: number
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

  public instruments: Instrument[] = [];

  public newOfferForm = new FormGroup({
    frequency: new FormControl()
  });

  public businessUser: BusinessUser;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    // Retrieve available bonds
    this.updateBonds();

    // Get business user
    this.updateBusinessUser();
  }

  /**
   * Retrieve list of bonds
   */
  updateBonds(): void {
    this.http.get<Instrument[]>(environment.blockchain_api_path + 'com.rbc.hackathon.Bond').subscribe(data => {
      this.instruments = data;
    });
  }

  /**
   * Retrieve business user with its balance and portfolio
   */
  updateBusinessUser(): void {
    this.businessUser = {
      accountBalance: 2000,
      name: '??'
    };

    // TODO Retrieve from backend
    // this.http.get<Instrument[]>('?').subscribe(data => {
    // });
  }

  /**
   * Computes number of tokens per seconds that the borrower owes to the bank
   */
  feesDue(): FeesDue {
    let fees: FeesDue = {
      perSecond: 0,
      atContractEnd: 0
    };

    ACTIVE_OFFERS.forEach(contract => {
      let divisor = 0;
      switch (contract.feesFrequency) {
        case FeesFrequency.SEC_10:
          divisor = 10;
          break;
        case FeesFrequency.SEC_20:
          divisor = 20;
          break;
        case FeesFrequency.SEC_30:
          divisor = 30;
          break;
        case FeesFrequency.AT_CONTRACT_END:
          fees.atContractEnd += contract.fees;
          break;
      }
      if (divisor !== 0) {
        fees.perSecond += contract.fees / divisor;
      }
    });

    return fees;
  }
}

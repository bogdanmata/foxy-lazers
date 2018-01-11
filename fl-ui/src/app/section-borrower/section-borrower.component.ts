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
import {CommonService} from "../common.service";
import {LendingRequest} from "../model/lending-request.model";

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

export const REFRESH_INTERVAL = 4000;

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

  displayedColumnsAwaitingValidationOffers = ['fees', 'actions'];
  dataSourceAwaitingValidationOffers = new MatTableDataSource<SecurityLandingContract>(ACTIVE_OFFERS);

  public creationInProgress = false;
  public instruments: Instrument[] = [];
  public currentBorrower: string = "borrower1";

  // new Lending form values
  public newLendingForm = new FormGroup({
    instrument: new FormControl(),
    quantity: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl()
  });

  public businessUser: BusinessUser;
  private securityLendingContracts: SecurityLandingContract[];
  private requestedSecurityLendingContracts: SecurityLandingContract[];

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    // Retrieve available bonds
    this.commonService.getBonds().subscribe(data => {
      this.instruments = data;
    });

    // Get business user
    this.commonService.updateBusinessUser().subscribe(data => {
      this.businessUser = data;
    });

    // Retrieve lending contracts
    this.commonService.getSecurityLendingContracts().subscribe(data => {
      this.securityLendingContracts = data;
      this.requestedSecurityLendingContracts = this.securityLendingContracts
        .filter(contract => contract.status === ContractStatus.REQUESTED);
    });

    // Init form with default values
    let currentDate: Date = new Date();
    let currentDateStr: string = this.commonService.dateToISOString(currentDate);
    this.newLendingForm.get('startDate').setValue(currentDateStr);

    let endDate: Date = new Date(currentDate.getTime() + 2*60*1000); // +2 minutes;
    this.newLendingForm.get('endDate').setValue(this.commonService.dateToISOString(endDate));

    this.newLendingForm.get('quantity').setValue("100");

    // Setup automatic refresh
    setInterval(() => {
      this.commonService.updateBusinessUser().subscribe(data => {
        this.businessUser = data;
      });
    }, REFRESH_INTERVAL);
  }

  validateOffer(offer: SecurityLandingContract): void {
    console.log('Validating offer: ', offer);
  }

  rejectOffer(offer: SecurityLandingContract): void {
    console.log('Rejecting offer: ', offer);
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

  /**
   * Create a new lending request
   */
  createLendingRequest(): void {
    // Convert form to LendingRequest instance
    let lendingRequest: LendingRequest = new LendingRequest(
      this.newLendingForm.get('startDate').value,
      this.newLendingForm.get('endDate').value,
      this.newLendingForm.get('quantity').value,
      this.newLendingForm.get('instrument').value,
      this.currentBorrower
    );

    console.log(lendingRequest);
    this.creationInProgress = true;
    this.commonService.createLendingRequest(lendingRequest).subscribe(data => {
      this.creationInProgress = false;
    });
  }
}

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {
  Collateral, ContractStatus, FeesFrequency,
  SecurityLendingContract
} from "../model/security-landing-contract.model";
import {Instrument} from "../model/instrument.model";
import {Bank, Borrower, BusinessUser} from "../model/business-user.model";
import {CommonService} from "../common.service";
import {LendingRequest} from "../model/lending-request.model";
import {SecurityLendingOffer} from "../model/security-landing-offer.model";
import {LendingOfferAgreement} from "../model/lending-offer-agreement.model";

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
    instrument: <Instrument>{
      isin: 'isin 123',
      description: 'desc 456'
    },
    bank: <Bank>{
      name: 'bank 1'
    },
    borrower: <Borrower>{
      name: 'borrow 1'
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
    instrument: <Instrument>{
      isin: 'isin 01010',
      description: 'desc 74874747'
    },
    bank: <Bank>{
      name: 'bank 12121'
    },
    borrower: <Borrower>{
      name: 'borrow 11212'
    }
  }
];

export interface FeesDue {
  perSecond: number,
  atContractEnd: number
}

export const REFRESH_INTERVAL = 5000;

@Component({
  selector: 'app-section-borrower',
  templateUrl: './section-borrower.component.html',
  styleUrls: ['./section-borrower.component.scss']
})
export class SectionBorrowerComponent implements OnInit, AfterViewInit {
  displayedColumnsActiveOffers = ['id', 'quantity'];
  dataSourceActiveOffers = new MatTableDataSource<SecurityLendingContract>(ACTIVE_OFFERS);
  @ViewChild(MatSort) sort: MatSort;

  // Offers waiting validation
  private offersAwaitingValidation: SecurityLendingOffer[] = [];
  displayedColumnsAwaitingValidationOffers = ['bank', 'securityLendingContract', 'fees', 'feesFrequency', 'expirationDate', 'actions'];
  dataSourceAwaitingValidationOffers = new MatTableDataSource<SecurityLendingOffer>(this.offersAwaitingValidation);

  public creationInProgress = false;
  public instruments: Instrument[] = [];
  public currentBorrower: string = "borrower1";
  public loginList: string[] = [];
  public newLendingRequest: boolean = false;

  // new Lending form values
  public newLendingForm = new FormGroup({
    instrument: new FormControl(),
    quantity: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl()
  });

  public businessUser: BusinessUser;
  private securityLendingContracts: SecurityLendingContract[];

  // Contract
  private requestedSecurityLendingContracts: SecurityLendingContract[];
  displayedColumnsRequestsEmitted = ['instrument', 'quantity', 'startDate', 'endDate'];
  dataSourceRequestsEmitted = new MatTableDataSource<SecurityLendingContract>(this.requestedSecurityLendingContracts);

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    this.getDataFromServer();

    // Init form with default values
    let currentDate: Date = new Date();
    let currentDateStr: string = this.commonService.dateToISOString(currentDate);
    this.newLendingForm.get('startDate').setValue(currentDateStr);

    let endDate: Date = new Date(currentDate.getTime() + 2 * 60 * 1000); // +2 minutes;
    this.newLendingForm.get('endDate').setValue(this.commonService.dateToISOString(endDate));

    this.newLendingForm.get('quantity').setValue("100");

    // Init login list
    this.commonService.getBorrowers().subscribe(data => {
      this.loginList = data.map(borrower => borrower.name);
    });

    // Setup automatic refresh
    setInterval(() => {
      this.getDataFromServer();
    }, REFRESH_INTERVAL);
  }

  ngAfterViewInit() {
    this.dataSourceActiveOffers.sort = this.sort;
  }

  getDataFromServer(): void {
    // Retrieve available bonds
    this.commonService.getBonds().subscribe(data => {
      this.instruments = data;
    });

    // Get business user
    this.commonService.getBorrowers().subscribe(data => {
      this.businessUser = data.filter(borrower => borrower.name === this.currentBorrower)[0];
    });

    // Retrieve lending contracts
    this.commonService.getSecurityLendingContracts().subscribe(data => {
      this.securityLendingContracts = data;
      this.requestedSecurityLendingContracts = this.securityLendingContracts
        .filter(contract => contract.status === ContractStatus.REQUESTED);
      this.dataSourceRequestsEmitted = new MatTableDataSource<SecurityLendingContract>(this.requestedSecurityLendingContracts);
    });

    // Retrieve lending offers
    this.commonService.getSecurityLendingOffers().subscribe(data => {
      this.offersAwaitingValidation = data;
      this.dataSourceAwaitingValidationOffers = new MatTableDataSource<SecurityLendingOffer>(this.offersAwaitingValidation);
    });
  }

  loginUpdated(newLogin: string) {
    console.log("New login for Borrower: ", newLogin);
    this.currentBorrower = newLogin;
  }


  validateOffer(offer: SecurityLendingOffer): void {
    console.log('Validating offer: ', offer);
    this.commonService.updateLendingOffer(new LendingOfferAgreement(offer.id)).subscribe();
  }

  rejectOffer(offer: SecurityLendingContract): void {
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
      this.newLendingRequest = false;
      this.ngOnInit();
    });
  }

  /**
   * Translate fees frequency to text for UI
   */
  tranlateFeesFrequency(frequency: FeesFrequency): string {
    switch (frequency) {
      case FeesFrequency.SEC_10:
        return "Every 10s";
      case FeesFrequency.SEC_20:
        return "Every 20s";
      case FeesFrequency.SEC_30:
        return "Every 30s";
      case FeesFrequency.AT_CONTRACT_END:
        return "When contract ends";
    }
    return '?';
  }

  getInstrumentFromRelationship(relationship:string): Instrument {
    let instrumentId: string = relationship.split('#')[1];
    return this.instruments.filter(instrument => instrument.isin === instrumentId)[0];
  }
}

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {ContractStatus, FeesFrequency, SecurityLendingContract} from "../model/security-landing-contract.model";
import {Instrument} from "../model/instrument.model";
import {Account, BusinessUser} from "../model/business-user.model";
import {CommonService} from "../common.service";
import {LendingRequest} from "../model/lending-request.model";
import {SecurityLendingOffer} from "../model/security-landing-offer.model";
import {LendingOfferAgreement} from "../model/lending-offer-agreement.model";
import {Portfolio, PortfolioItem} from '../model/portfolio-item.model';

export interface FeesDue {
  perSecond: number,
  atContractEnd: number
}

export const REFRESH_INTERVAL = 30000;

@Component({
  selector: 'app-section-borrower',
  templateUrl: './section-borrower.component.html',
  styleUrls: ['./section-borrower.component.scss']
})
export class SectionBorrowerComponent implements OnInit, AfterViewInit {
  // Active offers
  public activeOffers: SecurityLendingContract[] = [];
  public dataSourceActiveOffers = new MatTableDataSource<SecurityLendingContract>(this.activeOffers);
  public displayedColumnsActiveOffers = ['bank', 'securityLendingContract', 'fees', 'feesFrequency', 'expirationDate'];

  @ViewChild(MatSort) sort: MatSort;

  // Offers waiting validation
  private offersAwaitingValidation: SecurityLendingOffer[] = [];
  public displayedColumnsAwaitingValidationOffers = ['bank', 'securityLendingContract', 'fees', 'feesFrequency', 'expirationDate', 'actions'];
  public dataSourceAwaitingValidationOffers = new MatTableDataSource<SecurityLendingOffer>(this.offersAwaitingValidation);

  public creationInProgress = false;
  public instruments: Instrument[] = [];
  public currentBorrower: string = "borrower1";
  public loginList: string[] = [];
  public newLendingRequest: boolean = false;

  public displayedColumnsPortfolios = ['instrument', 'quantity'];
  public portfolios: MatTableDataSource<PortfolioItem>;

  public account: Account;

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
      if (this.newLendingForm.get('instrument').value == null) {
        if (this.instruments[0] !== undefined) {
          this.newLendingForm.get('instrument').setValue(this.instruments[0].isin);
        }
      }
    });

    // Get business user
    this.commonService.getBorrowers().subscribe(data => {
      this.businessUser = data.filter(borrower => borrower.name === this.currentBorrower)[0];
      if (this.businessUser !== undefined) {
        this.commonService.getAccount(this.businessUser.account.split('#')[1]).subscribe((account: Account) => {
          this.account = account;
        });

        this.commonService.getPortfolio(this.businessUser.portfolio.split('#')[1]).subscribe((portfolio: Portfolio) => {
          this.portfolios = new MatTableDataSource<PortfolioItem>();

          for (let i = 0; i < portfolio.portfolio.length; i++) {
            this.commonService.getPortfolioItem(portfolio.portfolio[i].split('#')[1])
              .subscribe((portfolioItem: PortfolioItem) => {
                this.portfolios.data.push(portfolioItem);
                this.portfolios = new MatTableDataSource<PortfolioItem>(this.portfolios.data);
              })
          }
        })
      }
    });

    // Retrieve lending contracts
    this.commonService.getSecurityLendingContracts().subscribe(data => {
      this.securityLendingContracts = data;
      // Requested contracts
      this.requestedSecurityLendingContracts = this.securityLendingContracts
        .filter(contract => contract.status === ContractStatus.REQUESTED);
      this.dataSourceRequestsEmitted = new MatTableDataSource<SecurityLendingContract>(this.requestedSecurityLendingContracts);

      // Active contracts
      this.requestedSecurityLendingContracts = this.securityLendingContracts
        .filter(contract => contract.status === ContractStatus.ACTIVE);
      this.dataSourceActiveOffers = new MatTableDataSource<SecurityLendingContract>(this.activeOffers);
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
    this.commonService.updateLendingOffer(new LendingOfferAgreement(offer.id)).subscribe(data => {
      this.getDataFromServer();
    });
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

    this.activeOffers.forEach(contract => {
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

  getInstrumentFromRelationship(relationship: string): Instrument {
    let instrumentId: string = relationship.split('#')[1];
    let instrument: Instrument = this.instruments.filter(instrument => instrument.isin === instrumentId)[0];
    if (instrument === undefined) {
      return {isin: '?', description: '?'};
    } else {
      return instrument;
    }
  }
}

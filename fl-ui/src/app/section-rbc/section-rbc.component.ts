import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {SecurityLendingContract} from "../model/security-landing-contract.model";
import {Account, BusinessUser} from "../model/business-user.model";
import {CommonService} from "../common.service";
import {LendingOffer} from '../model/security-landing-offer.model';
import {REFRESH_INTERVAL} from "../section-borrower/section-borrower.component";
import {Portfolio, PortfolioItem} from '../model/portfolio-item.model';
import {Instrument} from "../model/instrument.model";

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

  public displayedColumnsPortfolios = ['instrument', 'quantity'];
  public portfolios: MatTableDataSource<PortfolioItem>;

  public selectedSecurityLandingContract: SecurityLendingContract;
  public creationInProgress: boolean;

  public currentBank: string = "bank1";
  public loginList: string[] = [];

  public instruments: Instrument[] = [];

  public account: Account;

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    this.getDataFromServer();

    // Init login list
    this.commonService.getBanks().subscribe(data => {
      this.loginList = data.map(bank => bank.name);
    });

    // Setup automatic refresh
    setInterval(() => {
      this.getDataFromServer();
    }, REFRESH_INTERVAL);
  }

  loginUpdated(newLogin: string) {
    console.log("New login for Bank: ", newLogin);
    this.currentBank = newLogin;
  }

  public getDataFromServer(): void {
    // Retrieve available bonds
    this.commonService.getBonds().subscribe(data => {
      this.instruments = data;
    });

    // Get business user
    this.commonService.getBanks().subscribe(data => {
      this.businessUser = data.filter(bank => bank.name === this.currentBank)[0];
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

    // Get lending contracts
    this.commonService.getSecurityLendingContracts().subscribe((data) => {
      this.securityLandingContracts = new MatTableDataSource<SecurityLendingContract>(data);
    })
  }

  public selectSecurityLandingContracts(row: SecurityLendingContract): void {
    this.selectedSecurityLandingContract = row;

    let expirationDate: Date = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 2);
    let expirationDateStr: string = this.commonService.dateToISOString(expirationDate);

    this.newOffer = new FormGroup({
      expirationDate: new FormControl(expirationDateStr),
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

      this.getDataFromServer();
    });
  }

  getInstrumentFromRelationship(relationship:string): Instrument {
    let instrumentId: string = relationship.split('#')[1];
    let instrument = this.instruments.filter(instrument => instrument.isin === instrumentId)[0];
    if (instrument === undefined) {
      return {isin: '?', description: '?'};
    } else {
      return instrument;
    }
  }
}

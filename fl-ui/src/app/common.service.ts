import {Bank, Borrower, BusinessUser} from "./model/business-user.model";
import {Instrument} from "./model/instrument.model";
import {environment} from "../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {LendingRequest} from "./model/lending-request.model";
import {SecurityLendingContract} from './model/security-landing-contract.model';
import {LendingOffer, SecurityLendingOffer} from './model/security-landing-offer.model';
import {LendingOfferAgreement} from "./model/lending-offer-agreement.model";

@Injectable()
export class CommonService {
  constructor(private http: HttpClient) {
  }

  /**
   * Execute contract (called regularly to update blockchain)
   */
  executeContracts(): Observable<any> {
    return this.http.post<any>(environment.blockchain_api_path + 'com.rbc.hackathon.ExecuteContracts', {
      $class: "com.rbc.hackathon.ExecuteContracts",
      bank: "bank1",
      borrower: "borrower1"
    });
  }

  /**
   * Retrieve list of bonds
   */
  getBonds(): Observable<Instrument[]> {
    return this.http.get<Instrument[]>(environment.blockchain_api_path + 'com.rbc.hackathon.Bond');
  }

  getSecurityLendingContracts(): Observable<SecurityLendingContract[]> {
    return this.http.get<SecurityLendingContract[]>(environment.blockchain_api_path + 'com.rbc.hackathon.SecurityLendingContract');
  }

  getSecurityLendingOffers(): Observable<SecurityLendingOffer[]> {
    return this.http.get<SecurityLendingOffer[]>(environment.blockchain_api_path + 'com.rbc.hackathon.SecurityLendingOffer');
  }

  /**
   * Create new lending request
   */
  createLendingRequest(lendingRequest: LendingRequest): Observable<LendingRequest> {
    return this.http.post<LendingRequest>(environment.blockchain_api_path + 'com.rbc.hackathon.LendingRequest', lendingRequest);
  }

  /**
   * Get lending offers (from banks)
   */
  getLendingOffers(): Observable<LendingOffer[]> {
    return this.http.get<LendingOffer[]>(environment.blockchain_api_path + 'com.rbc.hackathon.LendingOffer');
  }

  /**
   * Update lending offer to validate or reject
   */
  updateLendingOffer(lendingOfferAgreement: LendingOfferAgreement): Observable<LendingOffer> {
    return this.http.post<LendingOffer>(environment.blockchain_api_path + 'com.rbc.hackathon.LendingOfferAgreement', lendingOfferAgreement);
  }

  /**
   * Create new SecurityLendingOffer
   */
  createLendingOffer(lendingOffer: LendingOffer): Observable<LendingOffer> {
    return this.http.post<LendingOffer>(environment.blockchain_api_path + 'com.rbc.hackathon.LendingOffer', lendingOffer);
  }

  /**
   * Retrieve borrowers
   */
  getBorrowers(): Observable<Borrower[]> {
    return this.http.get<Borrower[]>(environment.blockchain_api_path + 'com.rbc.hackathon.Borrower');
  };

  /**
   * Retrieve banks
   */
  getBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(environment.blockchain_api_path + 'com.rbc.hackathon.Bank');
  };

  /**
   * Convert date to ISO String for input component or blockchain backend
   */
  dateToISOString(date: Date): string {
    return date.toISOString().split('.')[0];
  }
}

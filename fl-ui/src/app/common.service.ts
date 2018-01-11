import {BusinessUser} from "./model/business-user.model";
import {Instrument} from "./model/instrument.model";
import {environment} from "../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {LendingRequest} from "./model/lending-request.model";
import {SecurityLendingContract} from './model/security-landing-contract.model';
import {LendingOffer, SecurityLendingOffer} from './model/security-landing-offer.model';

@Injectable()
export class CommonService {
  constructor(private http: HttpClient) {
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

  // updateLendingOffer() {
  //   return this.http.post<LendingRequest>(environment.blockchain_api_path + 'com.rbc.hackathon.LendingOfferAgreement', lendingRequest);
  // }

  /**
   * Create new SecurityLendingOffer
   */
  createLendingOffer(lendingOffer: LendingOffer): Observable<LendingOffer> {
    return this.http.post<LendingOffer>(environment.blockchain_api_path + 'com.rbc.hackathon.LendingOffer', lendingOffer);
  }

  /**
   * Retrieve business user with its balance and portfolio
   */
  updateBusinessUser(): Observable<BusinessUser> {
    return Observable.create(observer => {
      observer.next({
        accountBalance: 2000,
        name: '??'
      });
      observer.complete();
    });

    // TODO Retrieve from backend
    // return this.http.get<BusinessUser>(environment.blockchain_api_path + '?');
  }

  /**
   * Convert date to ISO String for input component or blockchain backend
   */
  dateToISOString(date: Date): string {
    return date.toISOString().split('.')[0];
  }
}

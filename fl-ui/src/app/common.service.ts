import {BusinessUser} from "./model/business-user.model";
import {Instrument} from "./model/instrument.model";
import {environment} from "../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {SecurityLandingContract} from './model/security-landing-contract.model';
import {SecurityLendingOffer} from './model/security-landing-offer.model';

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

  getSecurityLendingContracts(): Observable<SecurityLandingContract[]> {
    return this.http.get<SecurityLandingContract[]>(environment.blockchain_api_path + 'com.rbc.hackathon.SecurityLendingContract');
  }

  getSecurityLendingOffers(): Observable<SecurityLendingOffer[]> {
    return this.http.get<SecurityLendingOffer[]>(environment.blockchain_api_path + 'com.rbc.hackathon.SecurityLendingOffer');
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
}

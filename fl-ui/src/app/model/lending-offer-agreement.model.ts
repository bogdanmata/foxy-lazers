import {SecurityLendingOffer} from "./security-landing-offer.model";

export class LendingOfferAgreement {
  static $class: "com.rbc.hackathon.LendingOfferAgreement";

  constructor(public securityLendingOffer: string) { // contract id
    this.securityLendingOffer = "resource:" + SecurityLendingOffer + "#" + securityLendingOffer;
  }
}

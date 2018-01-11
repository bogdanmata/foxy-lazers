import {LendingOffer, SecurityLendingOffer} from "./security-landing-offer.model";

export class LendingOfferAgreement {
  static $class: "com.rbc.hackathon.LendingOfferAgreement";

  constructor(public securityLendingOffer: string) {
    this.securityLendingOffer = "resource:" + SecurityLendingOffer.$class + "#" + securityLendingOffer;
  }
}

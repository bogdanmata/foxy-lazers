import {Instrument} from "./instrument.model";
import {Borrower} from "./business-user.model";

export class LendingRequest {
  public $class = "com.rbc.hackathon.LendingRequest";

  constructor(public startDate: string,
              public endDate: string,
              public quantity: number,
              public instrument: string,
              public borrower: string) {
    this.instrument = 'resource:' + Instrument.$class + "#" + instrument;
    this.borrower = 'resource:' + Borrower.$class + "#" + borrower;
  }
}

import {Instrument} from "./instrument.model";
import {BusinessUser} from "./business-user.model";

export class LendingRequest {
  public $class = "com.rbc.hackathon.LendingRequest";

  constructor(public startDate: string,
              public endDate: string,
              public quantity: number,
              public instrument: Instrument,
              public borrower: BusinessUser) {
  }
}

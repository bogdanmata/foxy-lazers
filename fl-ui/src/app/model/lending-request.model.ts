import {Instrument} from "./instrument.model";
import {BusinessUser} from "./business-user.model";

export class LendingRequest {
  constructor(startDate: string,
              endDate: string,
              quantity: number,
              instrument: Instrument,
              borrower: BusinessUser) {
  }
}

import {Instrument} from "./instrument.model";
import {Bank, Borrower} from "./business-user.model";

export interface SecurityLandingContract {
  id: string;
  startDate: string;
  endDate: string;
  quantity: number;
  collateral: Collateral;
  status: ContractStatus;
  fees: number;
  feesFrequency: FeesFrequency;
  lastCollectedFeesTimestamp: string,
  instrument: Instrument,
  bank: Bank,
  borrower: Borrower
}

export interface Collateral {
  id: string
}

export enum ContractStatus {
  REQUESTED,
  RESPONDED,
  ACCEPTED,
  REJECTED,
  EXPIRED,
  ACTIVE,
  ENDED
}

export enum FeesFrequency {
  AT_CONTRACT_END,
  SEC_10,
  SEC_20,
  SEC_30
}

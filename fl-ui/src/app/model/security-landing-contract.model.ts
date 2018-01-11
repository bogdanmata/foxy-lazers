import {Instrument} from "./instrument.model";
import {Bank, Borrower} from "./business-user.model";

export interface SecurityLendingContract {
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
  REQUESTED = "REQUESTED",
  RESPONDED = "RESPONDED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  ACTIVE = "ACTIVE",
  ENDED = "ENDED"
}

export enum FeesFrequency {
  AT_CONTRACT_END = "AT_CONTRACT_END",
  SEC_10 = "SEC_10",
  SEC_20 = "SEC_20",
  SEC_30 = "SEC_30"
}

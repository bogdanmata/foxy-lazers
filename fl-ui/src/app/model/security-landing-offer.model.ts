import {SecurityLendingContract} from './security-landing-contract.model';
import {Bank} from "./business-user.model";

export class SecurityLendingOffer {
  static $class = "com.rbc.hackathon.SecurityLendingOffer";

  id: string;
  expirationDate: string;
  fees: number;
  feesFrequency: FeesFrequency;
  securityLendingContract: SecurityLendingContract;
  bank: Bank;
}

export class LendingOffer {
  static $class: string = "com.rbc.hackathon.LendingOffer";
  expirationDate: string;
  fees: number;
  feesFrequency: FeesFrequency;
  securityLendingContract: string;
  bank: string;
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

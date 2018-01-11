import {SecurityLandingContract} from './security-landing-contract.model';
import {Bank} from "./business-user.model";

export class SecurityLendingOffer {
  id: string;
  expirationDate: string;
  fees: number;
  feesFrequency: FeesFrequency;
  securityLendingContract: SecurityLandingContract;
  bank: Bank;
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

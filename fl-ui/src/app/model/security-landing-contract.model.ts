export interface SecurityLandingContract {
  id: string;
  startDate: string;
  endDate: string;
  quantity: number;
  collateral: string;
  status: ContractStatus;
  fees: number;
  feesFrequency: FeesFrequency;
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

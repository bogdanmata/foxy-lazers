import {PortfolioItem} from './portfolio-item.model';

export interface Bank {
  $class: "com.rbc.hackathon.Bank";
  name: string;
  accountBalance: number;
  portfolio: PortfolioItem[];
}

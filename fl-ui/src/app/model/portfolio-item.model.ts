import {Instrument} from './instrument.model';

export interface PortfolioItem {
  $class: "com.rbc.hackathon.PortfolioItem";
  quantity: number;
  instrument: Instrument;
  id: string;
}

export class Portfolio {
  constructor(public owner: string,
              public portfolio: string[]/*PortfolioItem[]*/) {
  }
}

import {Instrument} from './instrument.model';

export interface PortfolioItem {
  $class: "com.rbc.hackathon.PortfolioItem";
  quantity: number;
  instrument: Instrument;
  id: string;
}

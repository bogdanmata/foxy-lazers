export class Instrument {
  public $class = "com.rbc.hackathon.Instrument";

  constructor(public isin: string,
              public description: string) {
  }
}

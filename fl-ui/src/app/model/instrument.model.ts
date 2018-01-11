export class Instrument {
  public static $class = "com.rbc.hackathon.Instrument";

  constructor(public isin: string,
              public description: string) {
  }
}

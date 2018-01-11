export class BusinessUser {
  public static $class = "com.rbc.hackathon.BusinessUser";

  constructor(public name: string,
              public accountBalance: number) {
  }

  //portfolio: PortfolioItem[]
}

export class Borrower extends BusinessUser {
  public static $class = "com.rbc.hackathon.Borrower";
}

export class Bank extends BusinessUser {
  public static $class = "com.rbc.hackathon.Bank";
}

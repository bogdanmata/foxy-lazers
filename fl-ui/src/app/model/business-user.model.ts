export class BusinessUser {
  public static $class = "com.rbc.hackathon.BusinessUser";

  constructor(public name: string,
              public account?: /*Account*/string,
              public portfolio?: string) {
  }

  //portfolio: PortfolioItem[]
}

export class Account {
  constructor(public owner: string,
              public accountBalance: number) {
  }
}

export class Borrower extends BusinessUser {
  public static $class = "com.rbc.hackathon.Borrower";
}

export class Bank extends BusinessUser {
  public static $class = "com.rbc.hackathon.Bank";
}

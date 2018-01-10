'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * A request for Sec lending has been received
 * @param {com.rbc.hackathon.LendingRequest} lendingRequest - the LendingRequest transaction
 * @transaction
 */
async function onSecurityLendingReception(lendingRequest) {  // eslint-disable-line no-unused-vars

    const instrument = lendingRequest.instrument;
    const borrower   = lendingRequest.borrower;

    console.log('Lending request received on instrument ' + instrument.isin + ' done by ' + borrower.name);
}

/**
 * An offer for Sec lending has been received
 * @param {com.rbc.hackathon.LendingOffer} lendingOffer - the lendingOffer transaction
 * @transaction
 */
async function onLendingOfferReception(lendingOffer) {  // eslint-disable-line no-unused-vars

    const bank   = lendingRequest.bank;

    console.log('Lending offer received from '  + bank.name);
}


/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {com.rbc.hackathon.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars

    const factory = getFactory();
    const NS = 'com.rbc.hackathon';

    console.log('Creating Borrowers');

    // create the borrowers
    const borrower1 = factory.newResource(NS, 'Borrower', 'borrower1');
    borrower1.accountBalance = 2000;

    const borrower2 = factory.newResource(NS, 'Borrower', 'borrower2');
    borrower2.accountBalance = 2000;

    console.log('Creating Bonds');

    const bond2  = factory.newResource(NS, 'Bond','GTDEM2Y:GOV');
    bond2.description='Germany Bund 2 Year Yield';
    const bond5  = factory.newResource(NS, 'Bond', 'GTDEM5Y:GOV');
    bond5.description = 'Germany Bund 5 Year Yield';
    const bond10 = factory.newResource(NS, 'GTDEM10Y:GOV');
    bond10.description = 'Germany Bund 10 Year Yield';


    console.log('Creating Banks');
    // create the banks
    const bank1 = factory.newResource(NS, 'bank' ,'RBC Investor and Treasuary Services');
    bank1.accountBalance = 2000;
    

    console.log('___Creating Porfolio bank1');
    // portfolio creation
    const portfolioItem_RBC1 = factory.newConcept(NS, 'PortfolioItem');
    portfolioItem_RBC1.instrument = factory.newRelationship(NS, 'Bond', 'GTDEM2Y:GOV');
    portfolioItem_RBC1.quantity = 200 ;

    const portfolioItem_RBC2 = factory.newConcept(NS, 'PortfolioItem');
    portfolioItem_RBC2.instrument = factory.newRelationship(NS, 'Bond', 'GTDEM5Y:GOV');
    portfolioItem_RBC2.quantity = 1000 ;


    console.log('___Attach Porfolio bank1');
    bank1.portfolio.push(portfolioItem_RBC1);
    bank1.portfolio.push(portfolioItem_RBC2);


    const bank2 = factory.newResource(NS, 'bank', 'bank2');
    bank2.accountBalance = 2000;
    const portfolioItem1 = factory.newConcept(NS, 'PortfolioItem');
    portfolioItem1.instrument = factory.newRelationship(NS, 'Bond', 'GTDEM2Y:GOV');
    portfolioItem1.quantity = 10 ;

    bank2.portfolio.push(portfolioItem1);

    console.log('-------Done--------');

}
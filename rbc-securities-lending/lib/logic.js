'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * A request for Sec lending has been received
 * @param {com.rbc.hackathon.LendingRequest} lendingRequest - the LendingRequest transaction
 * @transaction
 */
function onSecurityLendingReception(lendingRequest) {  // eslint-disable-line no-unused-vars

    var instrument = lendingRequest.instrument;
    var borrower   = lendingRequest.borrower;

    console.log('Lending request received on instrument ' + instrument.isin + ' done by ' + borrower.name);
}

/**
 * An offer for Sec lending has been received
 * @param {com.rbc.hackathon.LendingOffer} lendingOffer - the lendingOffer transaction
 * @transaction
 */
function onLendingOfferReception(lendingOffer) {  // eslint-disable-line no-unused-vars

    var bank   = lendingRequest.bank;

    console.log('Lending offer received from '  + bank.name);
}


/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {com.rbc.hackathon.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars

    var factory = getFactory();
    var NS = 'com.rbc.hackathon';

    console.log('Creating Borrowers');

    // create the borrowers
    var borrower1 = factory.newResource(NS, 'Borrower', 'borrower1');
    borrower1.accountBalance = 2000;

    var borrower2 = factory.newResource(NS, 'Borrower', 'borrower2');
    borrower2.accountBalance = 2000;

    console.log('Creating Bonds');

    var bond2  = factory.newResource(NS, 'Bond','GTDEM2YGOV');
    bond2.description='Germany Bund 2 Year Yield';
    var bond5  = factory.newResource(NS, 'Bond', 'GTDEM5YGOV');
    bond5.description = 'Germany Bund 5 Year Yield';
    var bond10 = factory.newResource(NS, 'GTDEM10YGOV');
    bond10.description = 'Germany Bund 10 Year Yield';


    console.log('Creating Banks');
    // create the banks
    var bank1 = factory.newResource(NS, 'bank' ,'RBC Investor and Treasuary Services');
    bank1.accountBalance = 2000;
    

    console.log('___Creating Porfolio bank1');
    // portfolio creation
    var portfolioItem_RBC1 = factory.newConcept(NS, 'PortfolioItem');
    portfolioItem_RBC1.instrument = factory.newRelationship(NS, 'Bond', 'GTDEM2YGOV');
    portfolioItem_RBC1.quantity = 200 ;

    var portfolioItem_RBC2 = factory.newConcept(NS, 'PortfolioItem');
    portfolioItem_RBC2.instrument = factory.newRelationship(NS, 'Bond', 'GTDEM5YGOV');
    portfolioItem_RBC2.quantity = 1000 ;


    console.log('___Attach Porfolio bank1');
    bank1.portfolio.push(portfolioItem_RBC1);
    bank1.portfolio.push(portfolioItem_RBC2);


    var bank2 = factory.newResource(NS, 'bank', 'bank2');
    bank2.accountBalance = 2000;
    var portfolioItem1 = factory.newConcept(NS, 'PortfolioItem');
    portfolioItem1.instrument = factory.newRelationship(NS, 'Bond', 'GTDEM2YGOV');
    portfolioItem1.quantity = 10 ;

    bank2.portfolio.push(portfolioItem1);

    console.log('-------Done--------');

}
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
 * A offer for Sec lending has been sent
 * @param {com.rbc.hackathon.LendingOffer} lendingOffer
 * @transaction
 */
function onChangeAssetValue(lendingOffer) {
    var assetRegistry;
    var id = changeAssetValue.relatedAsset.assetId;
    return getAssetRegistry('com.rbc.hackathon.SampleAsset')
        .then(function(ar) {
            assetRegistry = ar;
            return assetRegistry.get(id);
        })
        .then(function(asset) {
            asset.value = changeAssetValue.newValue;
            return assetRegistry.update(asset);
        });
}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {com.rbc.hackathon.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars

    const factory = getFactory();
    const NS = 'com.rbc.hackathon';

    // create the borrowers
    const borrower1 = factory.newConcept(NS, 'Borrower1');
    borrower1.accountBalance = 2000;

    const borrower = factory.newConcept(NS, 'Borrower2');
    borrower2.accountBalance = 2000;

    const Bond = factory.newConcept(NS, 'GTDEM2Y:GOV', 'Germany Bund 2 Year Yield');
    const Bond = factory.newConcept(NS, 'GTDEM5Y:GOV', 'Germany Bund 5 Year Yield');
    const Bond = factory.newConcept(NS, 'GTDEM10Y:GOV', 'Germany Bund 10 Year Yield');

    // create the bank
    const bank = factory.newResource(NS, 'RBC Investor and Treasuary Services');
 
    
    growerAddress.country = 'USA';
    grower.address = growerAddress; 
    grower.accountBalance = 0;
}
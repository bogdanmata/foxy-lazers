'use strict';
/**
 * Write your transction processor functions here
 */

 /**
 * A request for Sec lending will be created
 * @param {com.rbc.hackathon.LendingRequest} lendingRequest - the LendingRequest transaction
 * @transaction
 */
function requestLending(lendingRequest){
    
    var factory = getFactory();
    var NS = 'com.rbc.hackathon';

     getAssetRegistry(NS + '.SecurityLendingContract')
        .then(function (SLContractRegistry){
            var ContractColl = SLContractRegistry.getAll();
  /*          var idx = 1;
            if (ContractColl.length>0)
            {
                idx = (+ContractColl[ContractColl.length-1].id + 1);
            }
*/
            if (ContractColl==null){
                ContractColl = [];
              }
            var securityLendingContract = factory.newResource(NS, 'SecurityLendingContract', ContractColl.length.toString()); 
            securityLendingContract.startDate = lendingRequest.startDate ;
            securityLendingContract.endDate   = lendingRequest.endDate  ;
            securityLendingContract.quantity  = lendingRequest.quantity ;
            securityLendingContract.instrument = lendingRequest.instrument ;
            securityLendingContract.borrower  = lendingRequest.borrower ;

            securityLendingContract.status      = 'REQUESTED' ;
            securityLendingContract.collateral  = null ;
            securityLendingContract.fees        = null ;
            securityLendingContract.feesFrequency = null ;
            securityLendingContract.lastCollectedFeesTimestamp = null;
            securityLendingContract.bank = null ;
            
            SLContractRegistry.add(securityLendingContract);

            var eventCreated = factory.newEvent(NS, 'SecLendingCreated');
            emit(eventCreated);
        });
}

/**
 * An offer on lending will be created
 * @param {com.rbc.hackathon.LendingOffer} lendingOffer - the LendingRequest transaction
 * @transaction
 */
function offerLending(lendingOffer){
    var factory = getFactory();
    var NS = 'com.rbc.hackathon';
    // need to tested to know if this a relationship or the real object behind
     
    var securityLendingOffer = factory.newResource(NS, 'SecurityLendingOffer','1');

    securityLendingOffer.expirationDate = lendingOffer.expirationDate;
    securityLendingOffer.fees = lendingOffer.fees;
    securityLendingOffer.feesFrequency = lendingOffer.feesFrequency;
    securityLendingOffer.securityLendingContract = lendingOffer.securityLendingContract;
    securityLendingOffer.bank = lendingOffer.bank;

    return getAssetRegistry(NS + '.SecurityLendingOffer')
    .then(function (SLOfferRegistry){
        SLOfferRegistry.add(securityLendingOffer);
    });
}

/**
 * An offer on lending will be created
 * @param {com.rbc.hackathon.LendingOfferAgreement} lendingOfferAgreement - the lendingOfferAgreement transaction
 * @transaction
 */
function acceptOffer(lendingOfferAgreement) {
    var NS = 'com.rbc.hackathon';
    return getAssetRegistry(NS + '.SecurityLendingOffer')
    .then(function (SLOfferRegistry){
        relatedSecurityLendingOffer = SLOfferRegistry.get(lendingOfferAgreement.id);
        return getAssetRegistry(NS + '.SecurityLendingContract')})
    .then(function (SLContractRegistry){
        var CurrentContract = SLContractRegistry.get(relatedSecurityLendingOffer.securityLendingContract.id);
        CurrentContract.fees = relatedSecurityLendingOffer.fees
        CurrentContract.feesFrequency = relatedSecurityLendingOffer.feesFrequency
        CurrentContract.bank = relatedSecurityLendingOffer.bank
        CurrentContract.status = 'ACCEPTED'
        SLContractRegistry.update(CurrentContract)
    });
}

function changeOwnership(intrumentId, fromId, toId, quantityToTransfer)
{
    // No error handling...

    var NS = 'com.rbc.hackathon';
    return getAssetRegistry(NS +".BusinessUser")
    .then(function (businessUserRegistry){
        fromParticipant = businessUserRegistry.get(fromId);
        toParticipant = businessUserRegistry.get(toId);
        foreach (item in fromParticipant.portfolio)
        {
            if (item.instrument.id==instrumentId)
            {
                item.quantity -= quantityToTransfer;
            }
        }
        foreach (item in toParticipant.portfolio)
        {
            if (item.instrument.id==instrumentId)
            {
                item.quantity += quantityToTransfer;
            }
        }
        businessUserRegistry.updateAll([fromParticipant, toParticipant]);
    });
}

function updateContract(contract)
{
    return getAssetRegistry(NS + '.SecurityLendingContract')
    .then(function (SLContractRegistry){
         SLContractRegistry.update(contract)
    });
}

function collectFees(contract)
{
    if (date.now-contract.lastCollectedFeesTimestamp>=contrat.feesFrequency)
    {
        var NS = 'com.rbc.hackathon';
        return getAssetRegistry(NS +".BusinessUser")
        .then(function (businessUserRegistry){
            borrower = businessUserRegistry.get(contract.borrower.id);
            bank = businessUserRegistry.get(contract.bank.id);
            borrower.accountBalance -= contract.fees;
            bank.accountBalance += contract.fees;
            contract.lastCollectedFeesTimestamp=Date.now;
            businessUserRegistry.updateAll([bank, borrower]);
            updateContract(contract);
        });
    }   
}

function ExecuteContracts(executeContracts)
{
    var NS = 'com.rbc.hackathon';
    var queryContracts = buildQuery('SELECT '+NS+'.SecurityLendingContract WHERE (bank.id == _$bankId)');
    return query(queryContracts, { bankId: executeContracts.bank.id })
      .then(function (contracts) {
        contracts.forEach(function (contract) {
            switch (contract.status) {
                case 'ACCEPTED':
                // Accepted but not started, check if should be activated according to startDate
                    if (contract.startDate>=Date.now)
                    {
                        contract.status='ACTIVE';
                        contract.lastCollectedFeesTimestamp=Date.now;
                        changeOwnership(contract.instrument.id, contract.bank.id, contract.borrower.id, contract.quantity);
                        updateContract(contract);
                    }
                    break;
                case 'ACTIVE':
                // Active contract, check if it not expired then get fees, update status otherwise
                    if (contract.endDate>=Date.now)
                    {
                        contract.status='ENDED'
                        changeOwnership(contract.instrument.id, contract.borrower.id, contract.bank.id, contract.quantity);
                        updateContract(contract);
                    }
                    else
                    {
                        collectFees(contract);
                    }
                    break;
                case 'REQUESTED':
                // if startdate is overdue, then change status to EXPIRED
                    if (contract.startDate>=Date.now)
                    {
                        contract.status='EXPIRED';
                        updateContract(contract);
                    }
                    break;
            }

        });
    })
    

/*
    return getAssetRegistry(NS + '.SecurityLendingContract')
    .then(function (SLContractRegistry){
        SLContractRegistry.query()
    })
*/
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
    borrower1.portfolio = [];

    var borrower2 = factory.newResource(NS, 'Borrower', 'borrower2');
    borrower2.accountBalance = 2000;
    borrower2.portfolio = [];

    console.log('Creating Bonds');

    var bond2  = factory.newResource(NS, 'Bond','bond1');
    bond2.description='Germany Bund 2 Year Yield';
    var bond5  = factory.newResource(NS, 'Bond', 'bond2');
    bond5.description = 'Germany Bund 5 Year Yield';
    // var bond10 = factory.newResource(NS, 'GTDEM10Y:GOV');
    // bond10.description = 'Germany Bund 10 Year Yield';


    console.log('Creating Banks');
    // create the banks
    var bank1 = factory.newResource(NS, 'Bank' ,'bank1');
    bank1.accountBalance = 2000;
    

    console.log('___Creating Porfolio bank1');
    // portfolio creation
    var portfolioItem_RBC1 = factory.newConcept(NS, 'PortfolioItem');
    portfolioItem_RBC1.instrument = factory.newRelationship(NS, 'Bond', 'bond1');
    portfolioItem_RBC1.quantity = 200 ;

    var portfolioItem_RBC2 = factory.newConcept(NS, 'PortfolioItem');
    portfolioItem_RBC2.instrument = factory.newRelationship(NS, 'Bond', 'bond2');
    portfolioItem_RBC2.quantity = 1000 ;


    console.log('___Attach Porfolio bank1');
    bank1.portfolio=[];
    bank1.portfolio.push(portfolioItem_RBC1);
    bank1.portfolio.push(portfolioItem_RBC2);


    var bank2 = factory.newResource(NS, 'Bank', 'bank2');
    bank2.accountBalance = 2000;
    var portfolioItem1 = factory.newConcept(NS, 'PortfolioItem');
    portfolioItem1.instrument = factory.newRelationship(NS, 'Bond', 'GTDEM2Y:GOV');
    portfolioItem1.quantity = 10 ;

    bank2.portfolio=[];
    bank2.portfolio.push(portfolioItem1);

    console.log('-------Done--------');

    return getParticipantRegistry(NS + '.Borrower')
        .then(function (borrowerRegistry) {
            // add the borrowers
            return borrowerRegistry.addAll([borrower1, borrower2]);
        })
        .then(function() {
            return getParticipantRegistry(NS + '.Bank');
        })
        .then(function (bankRegistry) {
            // add the banks
            return bankRegistry.addAll([bank1, bank2]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Bond');
        })
        .then(function (bondRegistry) {
            // add the bonds
            return bondRegistry.addAll([bond2, bond5]);
        });
}
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
    logEvent('lending request'); 
    return getAssetRegistry(NS + '.SecurityLendingContract')
        .then(function (SLContractRegistry){
            SLContractRegistry.getAll().then(function(ContractColl){
              logEvent('Collection length = ' + ContractColl.length);              
              var id = (ContractColl.length | 0) + 1;
              logEvent('calculated id = ' + id);             
              var securityLendingContract = factory.newResource(NS, 'SecurityLendingContract', "" + id);

              securityLendingContract.startDate = lendingRequest.startDate ;
              securityLendingContract.endDate   = lendingRequest.endDate  ;
              securityLendingContract.quantity  = lendingRequest.quantity ;
              securityLendingContract.instrument  = lendingRequest.instrument ;
              securityLendingContract.borrower  = lendingRequest.borrower ;

              securityLendingContract.status      = 'REQUESTED' ;
              securityLendingContract.collateral  = null ;
              securityLendingContract.fees        = null ;
              securityLendingContract.feesFrequency = null ;
              securityLendingContract.bank = null ;

              SLContractRegistry.add(securityLendingContract);
            });
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

    return getAssetRegistry(NS + '.SecurityLendingOffer')
        .then(function (SLOfferRegistry){
            SLOfferRegistry.getAll().then(function(OfferColl){
              // var lend = lendingRequest;
            var id = (OfferColl.length | 0) + 1;

            var securityLendingOffer = factory.newResource(NS, 'SecurityLendingOffer',"" + id);
            securityLendingOffer.expirationDate = lendingOffer.expirationDate;
            securityLendingOffer.fees = lendingOffer.fees;
            securityLendingOffer.feesFrequency = lendingOffer.feesFrequency;
            securityLendingOffer.securityLendingContract = lendingOffer.securityLendingContract;
            securityLendingOffer.bank = lendingOffer.bank;

            SLOfferRegistry.add(securityLendingOffer);
        })
    });
}

/**
 * An offer on lending will be created
 * @param {com.rbc.hackathon.LendingOfferAgreement} lendingOfferAgreement - the lendingOfferAgreement transaction
 * @transaction
 */
 function acceptOffer(lendingOfferAgreement) {
   var _this = this;
   var NS = 'com.rbc.hackathon';
   return getAssetRegistry(NS + '.SecurityLendingOffer').
    then(function(SLOfferRegistry){
      return SLOfferRegistry.get(lendingOfferAgreement.securityLendingOffer.id);
    }).
    then(function(relatedSecurityLendingOffer){
      _this.relatedSecurityLendingOffer = relatedSecurityLendingOffer;
      return getAssetRegistry(NS + '.SecurityLendingContract');
    }).
    then(function(SLContractRegistry){
      _this.SLContractRegistry = SLContractRegistry;
      return SLContractRegistry.get(_this.relatedSecurityLendingOffer.securityLendingContract.getIdentifier());
    }).
    then(function(CurrentContract){
      return updateSecurityLendingContract(CurrentContract, _this.relatedSecurityLendingOffer, _this.SLContractRegistry);
    })
    ;
 }

function updateSecurityLendingContract(CurrentContract, relatedSecurityLendingOffer, SLContractRegistry){
  var NS = 'com.rbc.hackathon';
  CurrentContract.fees = relatedSecurityLendingOffer.fees;
  CurrentContract.feesFrequency = relatedSecurityLendingOffer.feesFrequency;
  CurrentContract.bank = relatedSecurityLendingOffer.bank;
  CurrentContract.status = 'ACCEPTED';
  return SLContractRegistry.update(CurrentContract)
    .then(function(updatedContract){
      var factory = getFactory();
      var eventOfferAccepted = factory.newEvent(NS, 'OfferAccepted');
      eventOfferAccepted.securityLendingContract = CurrentContract;
      emit(eventOfferAccepted);
    });
}

function changeOwnershipToBorrower1(intrumentId, fromId, toId, quantityToTransfer)
{
    // No error handling...
    logEvent(fromId + ' - ' + toId + ' - ' + quantityToTransfer);
    var NS = 'com.rbc.hackathon';
    return getParticipantRegistry(NS +".Borrower")
        .then(function (borrowerRegistry){
            return borrowerRegistry.get(toId).then(function (toParticipant) {
                logEvent(toParticipant.portfolio.length);
                foreach (item in toParticipant.portfolio)
                {
                    if (item.instrument.getIdentifier()==instrumentId)
                    {
                        item.quantity += quantityToTransfer;
                    }
                }
                borrowerRegistry.update(toParticipant);
        });

    });
}

function changeOwnershipToBorrower2(intrumentId, fromId, toId, quantityToTransfer)
{
    // No error handling...
    logEvent(fromId + ' - ' + toId + ' - ' + quantityToTransfer);
    var NS = 'com.rbc.hackathon';
    return getParticipantRegistry(NS +".Bank")
        .then(function (bankRegistry){
            return bankRegistry.get(fromId).then(function (fromParticipant) {
                logEvent(fromParticipant.portfolio.length);
                foreach (item in fromParticipant.portfolio)
                {
                    if (item.instrument.getIdentifier()==instrumentId)
                    {
                        item.quantity -= quantityToTransfer;
                    }
                }
                bankRegistry.update(fromParticipant);
        });

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
    var feesFrequency = -1;
    switch (contrat.feesFrequency) {
      case 'SEC_10':
        feesFrequency = 10;
        break;
      case 'SEC_20':
        feesFrequency = 20;
        break;
      case 'SEC_30':
        feesFrequency = 30;
        break;
    }
    if ((date.now - contract.lastCollectedFeesTimestamp >= feesFrequency * 1000) && (feesFrequency > 0)) // the timestamp is in milisec
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

 /**
 * A request for Sec lending will be created
 * @param {com.rbc.hackathon.ExecuteContracts} executeContracts - the LendingRequest transaction
 * @transaction
 */
function ExecuteContracts(executeContracts)
{
    var factory = getFactory();
    var NS = 'com.rbc.hackathon';

    getAssetRegistry(NS + '.SecurityLendingContract')
        .then(function (SLContractRegistry){
         SLContractRegistry.getAll().then(function(contracts) {

            logEvent('contracts found ' + contracts.length);

            contracts.forEach(function (contract) {
                if (contract.bank.getIdentifier() == executeContracts.bank.getIdentifier()) {
                    logEvent('contract found for bank1 ' + contract.getIdentifier() + ' with status ' + contract.status + ' - with condition ' + (contract.endDate.valueOf()>=new Date().valueOf()));
                    switch (contract.status) {
                        case 'ACCEPTED':
                        // Accepted but not started, check if should be activated according to startDate
                            if (contract.endDate.valueOf()>=new Date().valueOf())
                            {
                                logEvent('in accepted if');
                                contract.status='ACTIVE';
                                logEvent('1');
                                contract.lastCollectedFeesTimestamp=new Date();
                                logEvent('2');
                                changeOwnershipToBorrower1(contract.instrument.getIdentifier(), contract.bank.getIdentifier(), contract.borrower.getIdentifier(), contract.quantity);
                                changeOwnershipToBorrower2(contract.instrument.getIdentifier(), contract.bank.getIdentifier(), contract.borrower.getIdentifier(), contract.quantity);
                                logEvent('3');
                                updateContract(contract);
                                logEvent('4');
                            }
                            break;
                        case 'ACTIVE':
                        // Active contract, check if it not expired then get fees, update status otherwise
                            if (contract.endDate.valueOf()>=new Date().valueOf())
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
                            if (contract.endDate.valueOf()>=new Date().valueOf())
                            {
                                contract.status='EXPIRED';
                                updateContract(contract);
                            }
                            break;
                    }
                }    
            });
         })
    });


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

    var portfolioItemBorrower1 = factory.newConcept(NS, 'PortfolioItem');
    portfolioItemBorrower1.instrument = factory.newRelationship(NS, 'Bond', 'bond1');
    portfolioItemBorrower1.quantity = 0 ;

    var portfolioItemBorrower2 = factory.newConcept(NS, 'PortfolioItem');
    portfolioItemBorrower2.instrument = factory.newRelationship(NS, 'Bond', 'bond1');
    portfolioItemBorrower2.quantity = 0 ;

    // create the borrowers
    var borrower1 = factory.newResource(NS, 'Borrower', 'borrower1');
    borrower1.accountBalance = 2000;
    borrower1.portfolio = [portfolioItemBorrower1, portfolioItemBorrower2];

    var borrower2 = factory.newResource(NS, 'Borrower', 'borrower2');
    borrower2.accountBalance = 2000;
    borrower2.portfolio = [portfolioItemBorrower1, portfolioItemBorrower2];

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


function logEvent(message) {
    var NS = 'com.rbc.hackathon';
    var factory = getFactory();
    var NS = 'com.rbc.hackathon';
    var ev = factory.newEvent(NS, 'BasicEvent');
    ev.content = message;
    emit(ev);
}
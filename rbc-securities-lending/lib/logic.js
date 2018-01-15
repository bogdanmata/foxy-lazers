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

/**
 * An offer on lending will be created
 * @param {com.rbc.hackathon.ChangeOwnershipFromBank} changeOwnershipFromBank - the lendingOfferAgreement transaction
 * @transaction
 */
function changeOwnershipFromBank(changeOwnershipFromBank)
{
    // No error handling...
  //  logEvent(' ChangeOwner : ' + changeOwnershipFromBank.bank.getIdentifier() + ' - ' + changeOwnershipFromBank.borrower.getIdentifier() + ' - ' + changeOwnershipFromBank.quantityToTransfer);
    var NS = 'com.rbc.hackathon';
    return getParticipantRegistry(NS +".Bank")
        .then(function (bankRegistry){
            return bankRegistry.get(changeOwnershipFromBank.bank.getIdentifier()).then(function (bankParticipant) {
               // logEvent(' ChangeOwner : '+ bankParticipant +' : '+bankParticipant.portfolio +' : ' + bankParticipant.portfolio.length);  
                return getAssetRegistry(NS +".Portfolio").then(function(portfolioRegistry) {
                    return portfolioRegistry.get(bankParticipant.portfolio.getIdentifier()).then(function(p) {
                      //  logEvent(p.owner + ' : ' + p.portfolio);
                      return getAssetRegistry(NS +".PortfolioItem").then(function(portfolioItemRegistry) {
                            p.portfolio.forEach(function(item) {
                            return portfolioItemRegistry.get(item.getIdentifier()).then(function (ptfItem) {
                                logEvent(ptfItem.instrument + ' : ' + changeOwnershipFromBank.intrument)
                                if (ptfItem.instrument.getIdentifier() == changeOwnershipFromBank.intrument.getIdentifier()) {
                                    logEvent('in if');
                                    ptfItem.quantity -= changeOwnershipFromBank.quantityToTransfer;
                                        logEvent('update');
                                        portfolioItemRegistry.update(ptfItem).then(function(result) {
                                            logEvent(' ' + result);
                                        });
                                    }});
                            });
                            bankRegistry.update(bankParticipant);
                        });
                    });
                });
            });
    });
}

/**
 * An offer on lending will be created
 * @param {com.rbc.hackathon.ChangeOwnershipToBorrower} changeOwnershipToBorrower - the lendingOfferAgreement transaction
 * @transaction
 */
function changeOwnershipToBorrower(changeOwnershipToBorrower)
{
        // No error handling...
  //  logEvent(' ChangeOwner : ' + changeOwnershipToBorrower.bank.getIdentifier() + ' - ' + changeOwnershipToBorrower.borrower.getIdentifier() + ' - ' + changeOwnershipToBorrower.quantityToTransfer);
  var NS = 'com.rbc.hackathon';
  return getParticipantRegistry(NS +".Borrower")
      .then(function (borrowerRegistry){
          return borrowerRegistry.get(changeOwnershipToBorrower.borrower.getIdentifier()).then(function (borrowerParticipant) {
             // logEvent(' ChangeOwner : '+ borrowerParticipant +' : '+borrowerParticipant.portfolio +' : ' + borrowerParticipant.portfolio.length);  
              return getAssetRegistry(NS +".Portfolio").then(function(portfolioRegistry) {
                  return portfolioRegistry.get(borrowerParticipant.portfolio.getIdentifier()).then(function(p) {
                    //  logEvent(p.owner + ' : ' + p.portfolio);
                    return getAssetRegistry(NS +".PortfolioItem").then(function(portfolioItemRegistry) {
                          p.portfolio.forEach(function(item) {
                          return portfolioItemRegistry.get(item.getIdentifier()).then(function (ptfItem) {
                              logEvent(ptfItem.instrument + ' : ' + changeOwnershipToBorrower.intrument)
                              if (ptfItem.instrument.getIdentifier() == changeOwnershipToBorrower.intrument.getIdentifier()) {
                                  logEvent('in if');
                                  ptfItem.quantity += changeOwnershipToBorrower.quantityToTransfer;
                                      logEvent('update');
                                      portfolioItemRegistry.update(ptfItem).then(function(result) {
                                          logEvent(' ' + result);
                                      });
                                  }});
                          });
                          borrowerRegistry.update(borrowerParticipant);
                      });
                  });
              });
          });
  });

}

function changeOwnershipToBorrower1(intrumentId, fromId, toId, quantityToTransfer)
{
    // No error handling...
    logEvent(' ChangeOwner : ' + fromId + ' - ' + toId + ' - ' + quantityToTransfer);
    var NS = 'com.rbc.hackathon';
    return getParticipantRegistry(NS +".Borrower")
        .then(function (borrowerRegistry){
            return borrowerRegistry.get(toId).then(function (toParticipant) {
                logEvent(' ChangeOwner : '+ toParticipant.portfolio.length);
                
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
                logEvent(fromParticipant.portfolio);
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

                                logEvent('3');
                                SLContractRegistry.update(contract);
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

    console.log('Creating Bonds');

    var bond2  = factory.newResource(NS, 'Bond','bond1');
    bond2.description='Germany Bund 2 Year Yield';
    var bond5  = factory.newResource(NS, 'Bond', 'bond2');
    bond5.description = 'Germany Bund 5 Year Yield';
    // var bond10 = factory.newResource(NS, 'GTDEM10Y:GOV');
    // bond10.description = 'Germany Bund 10 Year Yield';

    console.log('Creating Borrowers');

    var portfolioItemBorrower1 = factory.newResource(NS, 'PortfolioItem', '1');
    portfolioItemBorrower1.instrument = factory.newRelationship(NS, 'Bond', 'bond1');
    portfolioItemBorrower1.quantity = 0 ;

  

    var portfolioItemBorrower2 = factory.newResource(NS, 'PortfolioItem', '2');
    portfolioItemBorrower2.instrument = factory.newRelationship(NS, 'Bond', 'bond2');
    portfolioItemBorrower2.quantity = 0 ;

      // create the portfolio
      var portfolio1 = factory.newResource(NS, 'Portfolio', 'PortfolioBorrower1');
      portfolio1.portfolio = [factory.newRelationship(NS, 'PortfolioItem', '1'), factory.newRelationship(NS, 'PortfolioItem', '2')];
      
      //var portfolio2 = factory.newResource(NS, 'Porfolio', 'borrower2');
      //portfolio2.portfolio = [portfolioItemBorrower1, portfolioItemBorrower2];

      // create the account
     var accountBorrower1 = factory.newResource(NS, 'Account', 'AccountBorrower1');
     var accountBank1 = factory.newResource(NS, 'Account', 'AccountBank1');
     accountBorrower1.accountBalance = 2000 ;
     accountBank1.accountBalance = 2000 ;

    // create the borrowers
    var borrower1 = factory.newResource(NS, 'Borrower', 'borrower1');
   ;
    borrower1.portfolio = factory.newRelationship(NS, 'Portfolio', 'PortfolioBorrower1');
    borrower1.account = factory.newRelationship(NS, 'Account', 'AccountBorrower1');

    //var borrower2 = factory.newResource(NS, 'Borrower', 'borrower2');
    //borrower2.accountBalance = 2000;
    //borrower2.portfolio = factory.newRelationship(NS, 'Porfolio', 'borrower1');

    console.log('Creating Banks');
    // create the banks
    var bank1 = factory.newResource(NS, 'Bank' ,'bank1');

    var portfolio2 = factory.newResource(NS, 'Portfolio', 'PortfolioBank1');
   

    console.log('___Creating Porfolio bank1');
    // portfolio creation
    var portfolioItem_RBC1 = factory.newResource(NS, 'PortfolioItem', '3');
    portfolioItem_RBC1.instrument = factory.newRelationship(NS, 'Bond', 'bond1');
    portfolioItem_RBC1.quantity = 200 ;

    var portfolioItem_RBC2 = factory.newResource(NS, 'PortfolioItem', '4');
    portfolioItem_RBC2.instrument = factory.newRelationship(NS, 'Bond', 'bond2');
    portfolioItem_RBC2.quantity = 1000 ;

    portfolio2.portfolio = [factory.newRelationship(NS, 'PortfolioItem', '3'), factory.newRelationship(NS, 'PortfolioItem', '4')];

    bank1.account = factory.newRelationship(NS, 'Account', 'AccountBank1');
    bank1.portfolio = factory.newRelationship(NS, 'Portfolio', 'PortfolioBank1');
    

    console.log('___Attach Portfolio bank1');

    //bank1.portfolio.push(portfolioItem_RBC1);
    //bank1.portfolio.push(portfolioItem_RBC2);


    //var bank2 = factory.newResource(NS, 'Bank', 'bank2');
    // bank2.accountBalance = 2000;
    // var portfolioItem1 = factory.newConcept(NS, 'PortfolioItem');
    //portfolioItem1.instrument = factory.newRelationship(NS, 'Bond', 'GTDEM2Y:GOV');
    // portfolioItem1.quantity = 10 ;

    // bank2.portfolio=[];
    //bank2.portfolio.push(portfolioItem1);

    console.log('-------Done--------');

    return getParticipantRegistry(NS + '.Borrower')
        .then(function (borrowerRegistry) {
            // add the borrowers
            return borrowerRegistry.addAll([borrower1]);
        })
        .then(function() {
            return getParticipantRegistry(NS + '.Bank');
        })
        .then(function (bankRegistry) {
            // add the banks
            return bankRegistry.addAll([bank1]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Bond');
        })
        .then(function (bondRegistry) {
            // add the bonds
            return bondRegistry.addAll([bond2, bond5]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.PortfolioItem');
        })
        .then(function (portfolioItemRegistry) {
            // add the bonds
            return portfolioItemRegistry.addAll([portfolioItem_RBC1, portfolioItem_RBC2, portfolioItemBorrower1, portfolioItemBorrower2]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Portfolio');
        })
        .then(function (portfolioRegistry) {
            // add the bonds
            return portfolioRegistry.addAll([portfolio1, portfolio2]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Account');
        })
        .then(function (accountRegistry) {
            // add the bonds
            return accountRegistry.addAll([accountBorrower1, accountBank1]);
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
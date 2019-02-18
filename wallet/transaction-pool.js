// store the unconfirmed transactions
const Transaction = require('../wallet/transaction');
const PropertyPool = require('../wallet/propertypool');

class TransactionPool {
  constructor() {
    this.transactions = [];
    this.properties =[];
    this.properties1 =[];
  }

  // addTransaction(transaction) {
  //   this.transactions.push(transaction);
  // }

  propertiez(){
    return this.properties;
  }

  propertiez1(){
    return this.properties1;
  }

  updateOrAddTransaction(transaction) {
    // if a transaction at the transaction index exists, replace it. Otherwise, push it
    let transactionWithId = this.transactions.find(t => t.id === transaction.id);

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

 addProperty(property) {
    
      this.properties.push(property);
      console.log("Property Added to pool!")
    
  }

  addProperty1(property) {
    
    this.properties1.push(property);
    console.log("Property Added to pool 2!",property)
  
}
/*
  updateProperty(property) {
    
   console.log("Updating propety sale details to other parties")
    let proppp = this.properties.find(t => t.id === property.id);

    if (proppp) {
      this.properties[this.properties.indexOf(proppp)].status = "sold";
    } 
    console.log('Property updated in other pools as well!');
  
}
*/

updateProperty(property,owner) {
    
  console.log("Updating propety sale details to other parties")
   let proppp = this.properties.find(t => t.id === property.id);

   if (proppp) {
     this.properties[this.properties.indexOf(proppp)].status = "sold";
     this.properties[this.properties.indexOf(proppp)].address = owner;
   } 
   console.log('Property updated in other pools as well!');
 
}

  // check if a transaction has already been performed by this address
  existingTransaction(address) {
    return this.transactions.find(transaction => transaction.input.address === address);
  }

  validTransactions() {
    console.log("IN VALID TRANSACTIONS");
    // make sure the input amount of each transaction is equal to the output amounts
    // const validTransactions = this.transactions.filter(transaction => {
    return this.transactions.filter(transaction => {
      const outputTotal = transaction.outputs.reduce((total, output) => {

        //return Math.round(total) + Math.round(output.amount);
        return parseInt(total)+parseInt(output.amount);
   
      }, 0);

      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}.`);
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}.`)
        return;
      };

      return transaction;
    });
    // return validTransactions;
  }

   static propChange(propid, address){

    let propertyWithId = this.properties.find(t => t.id === propid);

    
      this.properties[this.properties.indexOf(propertyWithId)].address = address;
      this.properties[this.properties.indexOf(propertyWithId)].status = "sold";

      console.log("Propert Status Changed Successfully!")

   
  }

   static propCheck(propid){

    console.log("In propcheck, properties are:-",this.properties);

    let propertyWithId = this.properties.find(t => t.id === propid);

  console.log("Property found in preprty check",propertyWithId);

      if(this.properties[this.properties.indexOf(propertyWithId)].status ==="sale"){
  console.log("This property is for sale. Starting Process");
   return true;
}
else{
  console.log("This property is not for sale!");
  return false;
}
       
  }


  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;

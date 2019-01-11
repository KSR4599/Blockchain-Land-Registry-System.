// store the unconfirmed transactions
const Transaction = require('../wallet/transaction');
const PropertyPool = require('../wallet/propertypool');

class TransactionPool {
  constructor() {
    this.transactions = [];
    this.properties =[];
  }

  // addTransaction(transaction) {
  //   this.transactions.push(transaction);
  // }

  updateOrAddTransaction(transaction) {
    // if a transaction at the transaction index exists, replace it. Otherwise, push it
    let transactionWithId = this.transactions.find(t => t.id === transaction.id);

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  updateOrAddProperty(property) {
    
      this.properties.push(property);
      console.log("added to pool!")
    
  }

  // check if a transaction has already been performed by this address
  existingTransaction(address) {
    return this.transactions.find(transaction => transaction.input.address === address);
  }

  validTransactions() {
    // make sure the input amount of each transaction is equal to the output amounts
    // const validTransactions = this.transactions.filter(transaction => {
    return this.transactions.filter(transaction => {
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
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

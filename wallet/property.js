
const TransactionPool = require('./transaction-pool');

const ChainUtil = require('../chain-util');
var properties = [];

var count = 0;
class Property{



    constructor() {
      this.id = ChainUtil.id();
      this.address= null;
      this.area = null;
      this.price = [];
      this.location=null;
      this.status=null;
    }

    static addProperty(walletaddress,area,price,location,transactionPool){
        var property = new this();
        property.id = ChainUtil.id();
        property.address=walletaddress;
        property.area=area;
        property.price=price;
        property.location=location;
        property.status= "sale"
        
        properties.push(property);

        transactionPool.addProperty(property);
        
       

        console.log('New property added to the properties');

        return property;

    }

    
}


    module.exports = Property;











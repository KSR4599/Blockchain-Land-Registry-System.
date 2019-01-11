

    var propies =[];
class PropertyPool {

    constructor() {
      this.properties = [];
    }


   static addProperties(property) {
       console.log("CAlled")
       
          //this.properties.push(property);
          propies.push(property)
        
      }

      static returnProps(){
        return propies;
    }
    }


    module.exports = PropertyPool;

    var propies =[];

    var propies1 =[];
    
class PropertyPool {

    constructor() {
      this.properties = [];
      this.properties1 =[];
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
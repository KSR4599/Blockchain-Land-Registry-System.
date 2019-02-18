var express = require('express');
var app = express()
var router = express.Router();
module.exports = router;
const bodyParser = require('body-parser');
const Blockchain = require('C:\\Users\\ksred\\Downloads\\Blockchain Files\\Hands on\\Blockchain\\landreg\\blockchain');
const Wallet = require('C:\\Users\\ksred\\Downloads\\Blockchain Files\\Hands on\\Blockchain\\landreg\\wallet');
const TransactionPool = require('C:\\Users\\ksred\\Downloads\\Blockchain Files\\Hands on\\Blockchain\\landreg\\wallet\\transaction-pool');
const P2pServer = require('C:\\Users\\ksred\\Downloads\\Blockchain Files\\Hands on\\Blockchain\\landreg\\app\\p2p-server.js');
const Miner = require('C:\\Users\\ksred\\Downloads\\Blockchain Files\\Hands on\\Blockchain\\landreg\\app\\miner.js');
var path = require('path')
var hbs = require('express-handlebars')
const shell = require('shelljs');

var sys = require('util')
var async = require("async");
var exec = require('child_process').exec;


const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();

const p2pServer = new P2pServer(bc, tp, wallet);
const miner = new Miner(bc, tp, wallet, p2pServer);

const Property = new require('C:\\Users\\ksred\\Downloads\\Blockchain Files\\Hands on\\Blockchain\\landreg\\wallet\\property.js');
const PropertyPool = require('C:\\Users\\ksred\\Downloads\\Blockchain Files\\Hands on\\Blockchain\\landreg\\wallet\\propertypool.js');


router.post('/buy', function(req, res){

    //const { recipient, amount, propid } = req.body;
    console.log("BUY CALLED");
    var recipient = req.body.recipient;
    var amount = req.body.amount;
    var propid = req.body.propid;

    console.log("Recipient :",recipient);
    console.log("Amount :",amount);
    console.log("PROP ID :",propid);

    
    let propp = tp.properties.find(t => t.id === propid);
  
    console.log("Property found in property check",propp);
  
    if(propp.price==amount){
      console.log("Amount matched!");
      if(propp.status ==="sale"){
        console.log("This property is for sale. Starting Process");
    
        propp.address = wallet.publicKey;
        propp.status = "sold";
    
        console.log("Propert Status Changed Successfully!")
    
        const transaction = wallet.createTransaction(recipient, amount, bc, tp);
        p2pServer.broadcastTransaction(transaction);
        p2pServer.updateProperty(propp);
        res.redirect('/transactions');
      }
      else{
        console.log("This property is not for sale!");
        res.json({Error: "This property is not for sale"})
    
      }
    } else{
      console.log("Amount not matching! Check amount once again!");
      res.json({Error: "Check amount one again!"})
    }
    
});


router.get('/buyprop1',(req,res) =>{
    res.render('buyprop');
   })
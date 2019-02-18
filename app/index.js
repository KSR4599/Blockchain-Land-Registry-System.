/*
HTTP_PORT=3001 P2P_PORT=5001 npm run dev
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
*/
const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const P2pServer = require('./p2p-server');
const Miner = require('./miner');
var path = require('path')
var hbs = require('express-handlebars')
const shell = require('shelljs');

var sys = require('util')
var async = require("async");
var exec = require('child_process').exec;
var child,child1,child2,child3,child4,child5,child6,child7;

var HTTP_PORT = process.env.HTTP_PORT || 3001;


const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const app = express();
const p2pServer = new P2pServer(bc, tp, wallet);
const miner = new Miner(bc, tp, wallet, p2pServer);

const Property = new require('../wallet/property');
const PropertyPool = require('../wallet/propertypool');

var routes = require('../api/routes')

var hbsHelpers = hbs.create({
  helpers: require("../views/js/a.js").helpers,
  defaultLayout: 'layout1',
  extname: '.hbs'
});




//the middleware use() function of express for serving static files.
app.use(express.static(path.join(__dirname,'views')))
app.get('/', (req, res) => {

  res.render('index',{ peerslen: p2pServer.sockets.length,port: listener.address().port });
});


app.get('*',function(req,res,next){

  res.locals.user=req.user||null;
  next();
})


//temp engine
app.engine('hbs',hbs({extname:'hbs',defaultLayout: 'layout1', layoutsDir: 'C:\\Users\\ksred\\Downloads\\Blockchain Files\\Hands on\\Blockchain\\landreg\\views\\layouts'}));
app.set('views', path.join('C:\\Users\\ksred\\Downloads\\Blockchain Files\\Hands on\\Blockchain\\landreg\\views'));
app.set('view engine','hbs');

//bodyparser for posting the form related Data
app.use(bodyParser.urlencoded({ extended : false}))

app.get('/prop', (req, res) =>{
  var prop = tp.properties;
  propid = prop[0].id;
  res.render('allprops1',{allprops:propid});
})

app.get('/prop1', (req, res) =>{
  var prop = tp.properties1;
  console.warn("PROP!!!!! :",prop);
  //prop= JSON.stringify(prop)

  res.render('allprops',{allprops:prop});
})


app.post('/buy', (req, res)=> {

  console.log("BUY CALLED");
  var recipient= req.body.recipient;
  var amount = req.body.amount;
  var propid = req.body.propid;
  var i=0;

  let proz = tp.properties;
  for(i=0;i<proz.length;i++){
    if(proz[i].id == propid){
      var propp = proz[i];
    }
  }
 

  if(propp.price==amount){
    console.log("Amount matched!");
    if(propp.status ==="sale"){
    

      propp.address = wallet.publicKey;
      propp.status = "sold";


      const transaction = wallet.createTransaction(recipient, amount, bc, tp);
      p2pServer.broadcastTransaction(transaction);
      p2pServer.updateProperty(propp);
      res.render('bought',{trans:transaction});
  
    }
    else{
      console.log("This property is not for sale!");
      res.render('error',{error: "This property is not for sale"})

    }
  } else{
    console.log("Amount not matching! Check amount once again!");
    res.render('error',{error: "Check amount one again!"})
  }

  

})

app.post('/addprop',(req, res)=> {
  var area = req.body.area;
  var price = req.body.price;
  var location = req.body.location;


  var property = Property.addProperty(wallet.publicKey, area, price, location,tp);

  
  p2pServer.broadcastProperty(property);
 



 var allpz = tp.properties;
 var poz =[];

 for(i=0;i<allpz.length;i++){
   var p = new Property;
   p.id = allpz[i].id;
   p.address = allpz[i].address;
   p.area = allpz[i].area;
   p.price = allpz[i].price;
   p.location = allpz[i].location;
   p.status = allpz[i].status;
  
   poz.push(p);
 }


 
 res.render('allprops',{allprops:poz})
 //res.json({allprops : allp});

})

app.get('/showprops',(req,res) =>{


  var allpz = tp.properties;
  var poz =[];

      for(i=0;i<allpz.length;i++){
        var p = new Property;
        p.id = allpz[i].id;
        p.address = allpz[i].address;
        p.area = allpz[i].area;
        p.price = allpz[i].price;
        p.location = allpz[i].location;
        p.status = allpz[i].status;
       
        poz.push(p);
      }

 // console.log("PROPSSS", allpz);

  //res.json({allprops : allp});

  res.render('allprops1',{allprops:poz})
})




app.get('/blocks', (req, res) => {
console.log("BLOCKCHAIN :-", bc.chain);
  res.render('blocks',{chain : bc.chain});
});

app.get('/peers', async (req, res) => {


  child = await exec(`set HTTP_PORT=3002 && set P2P_PORT=5002 && set PEERS=ws://localhost:5001 && npm run dev `);
  
 
  child1 = await exec(`set HTTP_PORT=3003 && set P2P_PORT=5003 && set PEERS=ws://localhost:5001,ws://localhost:5002 && npm run dev `);
  
  child2 = await exec(`set HTTP_PORT=3004 && set P2P_PORT=5004 && set PEERS=ws://localhost:5001,ws://localhost:5002,ws://localhost:5003 && npm run dev `);

  child3 = await exec(`set HTTP_PORT=3005 && set P2P_PORT=5005 && set PEERS=ws://localhost:5001,ws://localhost:5002,ws://localhost:5003,ws://localhost:5004 && npm run dev `);
  
  
  child4 = await exec(`set HTTP_PORT=3006 && set P2P_PORT=5006 && set PEERS=ws://localhost:5001,ws://localhost:5002,ws://localhost:5003,ws://localhost:5004,ws://localhost:5005 && npm run dev `);
 
  console.log("5 Peers Have Been Initialized!");

  res.render('index1',{ peerslen: p2pServer.sockets.length,port: listener.address().port });
});
  



app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);

  res.render('mined');
});

app.get('/balance', (req, res) => {
  res.json({ balance: wallet.calculateBalance(bc) });
});

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data);
  p2pServer.syncChains();
  console.log(`New block added: ${block.toString()}`);

  res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
  var trans= tp.transactions;
  //res.render('transactions',{trans: trans})
  res.json({trans: trans});
});



app.get('/addprop1',(req,res) =>{


  res.render('addprop');
  
})


app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);
  p2pServer.broadcastTransaction(transaction);

  res.redirect('/transactions');
});

app.get('/buyprop1',(req,res) =>{
  res.render('buyprop');
 })


app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.get('/peerslength', (req, res) => {
  // res.json({
  //   peers: p2pServer.sockets.map(socket => socket._socket.address())
  // });
  res.json({ peers: p2pServer.sockets.length });
});

app.get('/details',(req, res) =>{

  console.log("Details Route Called");
  res.render('details',{balance:wallet.calculateBalance(bc),publickey: wallet.publicKey});

})


app.get('/test',(req,res) => {
  var x = Property.testfunc();
  res.json({ Property : x })
})

// app.post('/addPeer');


app.use('/api',routes)


var listener = app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));
p2pServer.listen();

// module.exports = bc;
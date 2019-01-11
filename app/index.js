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

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const app = express();
const p2pServer = new P2pServer(bc, tp, wallet);
const miner = new Miner(bc, tp, wallet, p2pServer);

const Property = new require('../wallet/property');
const PropertyPool = require('../wallet/propertypool');


app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);

  res.redirect('/blocks');
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
  res.json(tp.transactions);
});

app.get('/showprops',(req,res) =>{
  res.json(tp.properties);
})

app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);

  // store transactions on the block itself.
  p2pServer.broadcastTransaction(transaction);

  res.redirect('/transactions');
});

app.get('/addprop',(req, res)=> {
  const { area, price, location } = req.body;
  var property = Property.addProperty(wallet.publicKey, area, price, location,tp);
  p2pServer.broadcastProperty(property);
  res.json({ Property : property });
})


app.post('/buy', (req, res) => {
  const { recipient, amount, propid } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);

  let propp = tp.properties.find(t => t.id === propid);

  console.log("Property found in property check",propp);
  console.log("########");
  console.log("Property Status",propp.status);

  if(propp.price===amount){
    console.log("Amount matched!");
    if(propp.status ==="sale"){
      console.log("This property is for sale. Starting Process");
  
      propp.address = wallet.publicKey;
      propp.status = "sold";
  
      console.log("Propert Status Changed Successfully!")
  
      p2pServer.broadcastTransaction(transaction);
      p2pServer.broadcastProperty(propp);
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



app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.get('/peers', (req, res) => {
  // res.json({
  //   peers: p2pServer.sockets.map(socket => socket._socket.address())
  // });
  res.json({ peers: p2pServer.sockets.length });
});



app.get('/test',(req,res) => {
  var x = Property.testfunc();
  res.json({ Property : x })
})

// app.post('/addPeer');

app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));
p2pServer.listen();

// module.exports = bc;
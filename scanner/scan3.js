'use strict'


const Web3 = require('web3');
const abi = require('./market_abi1.json');
const cliProgress = require('cli-progress');
const colors = require('ansi-colors');
const {retry} = require('./retry.js');


function generateFailableAPICall(fun) {

  return function () {
    return fun
  };
}

const typeArray = abi.find(o => o.name === 'createAuction');

const typeArraybatchCreateAuctions = abi.find(o => o.name === 'batchCreateAuctions');

// helper timer
const timer = ms => new Promise(res => setTimeout(res, ms))

// create new cli update container
const multibar = new cliProgress.MultiBar({
    clearOnComplete: false,
    format: '{kind} Progress|' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks {kind} {event} {block} - start: {time} .. Diff:{diff} queue:{queue} ||',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    noTTYOutput: true,

    // 10s update interval
    notTTYSchedule: 100000

}, cliProgress.Presets.shades_grey);


const dd = new Date();
let time1 = dd.getTime();


const { Marketplace_events_test, AuctionCreated,AuctionSuccessful,AuctionCancelled,Save_block, Listing_index, sequelize } = require('./database.js');


const rpcUrl = "https://0xventures-ronin.com/rpc";

var web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

const address = '0x213073989821f738a7ba3520c3d31a1f9ad31bbd';
var contract = new web3.eth.Contract(abi, address);

// Update or restart the Web3 http connection
const updateWeb3 = async () => {
  web3 = null;
  web3 = await new Web3(new Web3.providers.HttpProvider(rpcUrl))};

// Update or restart the Web3 contract connection
const updateWeb3Contract = async () =>{
  contract = null;
  contract = await new web3.eth.Contract(abi, address)};


async function updateConnection(){
  await updateWeb3()
  await updateWeb3Contract()

}

async function updateBlockNumber(to_,blockNumber ){

      if (to_ > blockNumber) {

        console.log(blockNumber);
        blockNumber = await web3.eth.getBlockNumber();
        console.log('update block');
        console.log(blockNumber);
                      }

}



async function pushData(event_){
  // commit data into each table

  var to=event_.to;

  var blockNumber = event_.blockNumber;
  var blockStart = event_.blockStart;
  var eventName = event_.eventName;
  var bar2 = event_.bar2;
  var events = event_.events;


  try {

      const result = await sequelize.transaction(async (t) => {

        if (eventName ==='AuctionCreated') {
          const user = await AuctionCreated.bulkCreate(events, {transaction: t})

          return user;

        }else if (eventName ==='AuctionSuccessful') {

          const user = await AuctionSuccessful.bulkCreate(events, {transaction: t})
          return user;

         }else if (eventName ==='AuctionCancelled') {

            const user = await AuctionCancelled.bulkCreate(events, {transaction: t})

            return user;

         }
      });

      // If the execution reaches this line, the transaction has been committed successfully
      // `result` is whatever was returned from the transaction callback (the `user`, in this case)
    }
   catch (err) {

      console.log(`getPastEvents process comitte `)
      console.log(err);
      // If the execution reaches this line, an error occurred.
      // The transaction has already been rolled back automatically by Sequelize!

      }
    finally{

        var ql = await event_.queue.length();

        await bar2.update((to-blockStart),{block: to, queue:ql });

      }
}

async function getTokenNumber(txnInfo){

    var blockNumber=txnInfo.blockNumber;
    var bar3 =txnInfo.bar3;
    var transactionIndex=txnInfo.transactionIndex;
    var blockStart = txnInfo.blockStart;

    var txn = await retry(generateFailableAPICall(web3.eth.getTransactionFromBlock(blockNumber, transactionIndex)),
                                                    async () => {console.log("onRetry called txn ...")
                                                            // await timer(2000)
                                                            await updateConnection()
                                                          },4);
        try{
            var decodedParameters = await retry(generateFailableAPICall(web3.eth.abi.decodeParameters(typeArray.inputs, txn.input.slice(10))),
                                                            async () => {console.log("Listing_index onRetry called...")
                                                                    // await timer(2000)
                                                                    await updateConnection()
                                                                  },3);
        } catch (error) {

            var decodedParameters = await retry(generateFailableAPICall(web3.eth.abi.decodeParameters(typeArraybatchCreateAuctions.inputs, txn.input.slice(10))),
                                                            async () => {console.log("Listing_index onRetry called...")
                                                                    // await timer(2000)
                                                                    await updateConnection()
                                                                  },3);
            }

            var queueTNlength = txnInfo.queueTN.length();

            await sequelize.transaction(t => {

      // chain all your queries here. make sure you return them.
              return Listing_index.create({tokenNumbers:decodedParameters['_tokenNumbers'],listingIndex:txnInfo.listingIndex }, {transaction: t}).catch(err => {
      // Transaction has been rolled back
      // err is whatever rejected the promise chain returned to the transaction callback
    });

        }).then(result => {
            bar3.update((blockNumber-global_blockStart ), {block:blockNumber, queue: queueTNlength })

          // Transaction has been committed
          // result is whatever the result of the promise chain returned to the transaction callback
        }).catch(err => {
          // Transaction has been rolled back
          // err is whatever rejected the promise chain returned to the transaction callback
        });


}

async function sendQueueTN(queueTN,txnInfo){

    await queueTN.push(txnInfo)

  }



async function process(ret,to,from_,bar1,bar2,blockStart,eventName,queue,blockNumber,queueS, queueTN,bar3){

  var events = [];


  for (let i=0; i<ret.length; i++) {

    var event_ = {}


    event_.address = ret[i]['address']
    event_.blockNumber= ret[i]['blockNumber']
    event_.transactionHash = ret[i]['transactionHash']
    event_.transactionIndex= ret[i]['transactionIndex']
    event_.logIndex= ret[i]['logIndex']
    event_.removed= ret[i]['removed']
    event_.id_from_block= ret[i]['id']

    event_.event= ret[i]['event']
    // event_.topics= null

    if (ret[i]['event']==="AuctionCreated") {



      event_.seller= ("_seller" in ret[i]['returnValues'])? ret[i]['returnValues']['_seller']: null;
      event_.listingIndex =("_listingIndex" in ret[i]['returnValues'])? ret[i]['returnValues']['_listingIndex']: null;
      event_.startingPrices = ("_startingPrices" in ret[i]['returnValues'])? ret[i]['returnValues']['_startingPrices']: null;
      event_.endingPrices= ("_endingPrices" in ret[i]['returnValues'])? ret[i]['returnValues']['_endingPrices']: null;
      event_.exchangeTokens= ("_exchangeTokens" in ret[i]['returnValues'])? ret[i]['returnValues']['_exchangeTokens']: null;
      event_.durations= ("_durations" in ret[i]['returnValues'])? ret[i]['returnValues']['_durations']: null;
      event_.startingTimestampsUnix= ("_startingTimestamps" in ret[i]['returnValues'])? Number(ret[i]['returnValues']['_startingTimestamps']): null;


      //don't delete
      // var txnInfo = {};
      // txnInfo.blockNumber = ret[i]['blockNumber']
      // txnInfo.transactionIndex = ret[i]['transactionIndex']
      // txnInfo.listingIndex = event_.listingIndex;
      // txnInfo.bar3 = bar3;
      // txnInfo.queueTN = queueTN;
      //
      // txnInfo.blockStart = blockStart;


      //don't delete
      // sendQueueTN(queueTN,txnInfo)


    }else if (ret[i]['event']==="AuctionSuccessful") {

      event_.seller= ("_seller" in ret[i]['returnValues'])? ret[i]['returnValues']['_seller']: null;
      event_.buyer= ("_buyer" in ret[i]['returnValues'])? ret[i]['returnValues']['_buyer']: null;
      event_.listingIndex =("_listingIndex" in ret[i]['returnValues'])? ret[i]['returnValues']['_listingIndex']: null;
      event_.token =("_token" in ret[i]['returnValues'])? ret[i]['returnValues']['_token']: null;
      event_.totalPrice =("_totalPrice" in ret[i]['returnValues'])? ret[i]['returnValues']['_totalPrice']: null;


      // event_.tokenNumbers= null

    }else if (ret[i]['event']==="AuctionCancelled") {



      event_.seller= ("_seller" in ret[i]['returnValues'])? ret[i]['returnValues']['_seller']: null;

      event_.listingIndex =("_listingIndex" in ret[i]['returnValues'])? ret[i]['returnValues']['_listingIndex']: null;

      // event_.tokenNumbers= null

    }

    events.push(event_)
  //
  }



    var e = {}
    e.to = to;
    e.queue = queue;
    e.blockNumber = blockNumber;
    e.blockStart = blockStart;
    e.eventName=eventName;
    e.bar2=bar2;
    e.events = events;

    await queueS.push(e)

}

async function queryRPC(info){


    var eventName = info.eventName
    var from_ = info.from_
    var to_ = info.to_
    var blockStart = info.blockStart
    var blockNumber = info.blockNumber
    var bar1 = info.bar1
    var bar2 = info.bar2

    var queue = info.queue


    const ret = await  contract.getPastEvents(eventName, {
      fromBlock: from_ ,
      toBlock: to_,
    }).catch(err => { console.log(`getPastEvents ${eventName}`); return console.log(err)});


    const result = await retry(generateFailableAPICall(ret),
    async () => {console.log("onRetry called...")
            // await timer(2000)
            await updateConnection()
          },20)

    return result;
    };


async function requestBlocks(blockNumber,blockCntPerRequest,blockStart,eventName,bar1,bar2,bar3){

  const queue = require('fastq').promise(queryRPC, 2);

  const queueS = require('fastq').promise(pushData, 5);

  const queueTN = require('fastq').promise(getTokenNumber, 1);

  const tasks1 = [];

      console.log('requestBlocks')

  for(let p = (blockStart /blockCntPerRequest); p < blockNumber / blockCntPerRequest; p++) {

        var from_ = p * blockCntPerRequest;
        var to_ = (p+1) * blockCntPerRequest;

        var info = {}
        info.eventName=eventName
        info.from_=from_
        info.to_=to_
        info.blockStart=blockStart
        info.blockNumber=blockNumber
        info.bar1=bar1
        info.bar2=bar2
        info.blockNumber=blockNumber

        info.queue=queue

          await queue.push(info).then((r) => {
                            return process(r,to_,from_,bar1,bar2,blockStart,eventName,queue,blockNumber,queueS,queueTN,bar3);
                          })
                          .catch((err) => {
                            console.log(err);
                            return null; // can be filtered out in Promise.all results
                            // or rethrow an error
                          })

        while(((p+1) >= blockNumber / blockCntPerRequest) ) {

                await timer(170000)

                var blockNumberNew = await web3.eth.getBlockNumber();

                if (((p+1) < (blockNumberNew/ blockCntPerRequest))) {

                  bar1.setTotal((blockNumberNew - blockStart))
                  bar2.setTotal((blockNumberNew - blockStart))

                  if (eventName === 'AuctionCreated') {
                    bar3.setTotal((blockNumberNew - blockStart))
                  }
                  blockNumber = blockNumberNew;
                }
          }

          if(((p+1) < blockNumber / blockCntPerRequest))  {

            var lenQueue = await queue.length();
            await bar1.update((to_-blockStart),{block:to_, queue:lenQueue})

          }
   }

}


async function main(blockNumber,start,cnt) {

  console.log(`new run from ${start} to ${blockNumber}`);

  var blockStart =  start;

  var blockCntPerRequest = cnt;

  console.log('block Number:', blockNumber);

  var bar1AuctionCreated = multibar.create((blockNumber - blockStart), 0,{event:"AuctionCreated",kind:'GET',time:time1,diff:0,queue:0} );

  var bar2AuctionCreated = multibar.create(((blockNumber - blockStart)), 0,{event:"AuctionCreated",kind:'PROCESS',time:time1,diff:0,queue:0 });
  var bar1AuctionCreatedTn = multibar.create((blockNumber - blockStart), 0,{event:"TokenNumber",kind:'GET',time:time1,diff:0,queue:0} );


  var bar1AuctionCancelled = multibar.create((blockNumber - blockStart), 0,{event:"AuctionCancelled",kind:'GET',time:time1,diff:0,queue:0} );
  var bar2AuctionCancelled = multibar.create((blockNumber - blockStart), 0,{event:"AuctionCancelled",kind:'PROCESS',time:time1,diff:0 });


  var bar1AuctionSuccessful = multibar.create((blockNumber - blockStart), 0,{event:"AuctionSuccessful",kind:'GET',time:time1,diff:0,queue:0} );
  var bar2AuctionSuccessful = multibar.create((blockNumber - blockStart), 0,{event:"AuctionSuccessful",kind:'PROCESS',time:time1,diff:0,queue:0 });



  //
  requestBlocks(blockNumber,blockCntPerRequest,blockStart,"AuctionCreated",bar1AuctionCreated,bar2AuctionCreated,bar1AuctionCreatedTn ).catch(console.error)
    .then(() => console.log('We do cleanup here2'));

  requestBlocks(blockNumber,blockCntPerRequest,blockStart,"AuctionCancelled",bar1AuctionCancelled,bar2AuctionCancelled,bar1AuctionCreatedTn ).catch(console.error)
    .then(() => console.log('We do cleanup here'));
  requestBlocks(blockNumber,blockCntPerRequest,blockStart,"AuctionSuccessful", bar1AuctionSuccessful,bar2AuctionSuccessful,bar1AuctionCreatedTn).catch(console.error)
    .then(() => console.log('We do cleanup here'));
}

//var global_blockStart = 2589000;

//var global_blockStart = 11018000;
// var global_blockStart = 8621750;
// var global_blockStart = 11326300;
var global_blockCntPerRequest = 50;


async function run(cnt){

  var start;
  var startCancelled;
  var startCreated;
  var startSuccessful;
  // start =11537875;

  // if(start){
  await sequelize.transaction(async (t) => {
    try{
      const maxCreated = await AuctionCreated.max("blockNumber",{
            transaction:t
          });

          console.log('maxCreated');
          console.log(maxCreated);
      startCreated = maxCreated;

      const maxSuccessful = await AuctionSuccessful.max("blockNumber",{
            transaction:t
          });
      startSuccessful = maxSuccessful;

      const maxCancelled= await AuctionCancelled.max("blockNumber",{
            transaction:t
          });
      startCancelled = maxCancelled;

    }
    catch (error) {
      console.log(error);
    }
  })

  // await sequelize.transaction(async (t) => {
  //   try{
  //     const maxSuccessful = await AuctionSuccessful.max("blockNumber",{
  //           transaction:t
  //         });
  //     startSuccessful = maxSuccessful;
  //
  //   }
  //   catch (error) {
  //     console.log(error);
  //   }
  // })
  //
  // await sequelize.transaction(async (t) => {
  //   try{
  //     const maxCancelled= await AuctionCancelled.max("blockNumber",{
  //           transaction:t
  //         });
  //     startCancelled = maxCancelled;
  //
  //   }
  //   catch (error) {
  //     console.log(error);
  //   }
  // })

  console.log('array dd');
  console.log([startCancelled,startCreated,startSuccessful]);
  start = Math.min(...[startCancelled,startCreated,startSuccessful]);
  // }else{
  // }

  console.log(start)

    var blockNumber = await web3.eth.getBlockNumber();
     console.log('run');
      console.log(blockNumber);
    main(blockNumber,start,cnt).catch(console.error).then(() => console.log('We do cleanup here3'));
// multibar.stop()
}

run(global_blockCntPerRequest)

const Web3 = require('web3')

const cron = require('node-cron');

// const axios = require('axios').default;

const CoinGecko = require('coingecko-api');
const BigNumber = require('bignumber.js');
const { Treasury,sequelize } = require('./database.js');
const {abiUSDC,abiUSDT,abiSENATE,abiPERION,abiSYNR} = require('./wallet-abis.js');



const rpcURL = 'https://mainnet.infura.io/v3/0343d39d42ca4dab92008505190a3cfc';

// const rpcURL ='https://cloudflare-eth.com/'
const web3 = new Web3(rpcURL)


let walletAddress1 = "0x12D73beE50F0b9E06B35Fdef93E563C965796482";

// The minimum ABI to get ERC20 Token balance


async function getBalance(abi,tokenAddress,ticker,walletAddress) {

  try {

    const CoinGeckoClient = new CoinGecko();

    let contract = new web3.eth.Contract(abi,tokenAddress);

    var blockNumber = await web3.eth.getBlockNumber();
    console.log(blockNumber);

    const balance = await contract.methods.balanceOf(walletAddress).call({},blockNumber);
    const decimals = await contract.methods.decimals().call()

    const bn = new BigNumber(balance + "e-" + decimals);
    console.log(bn);
    console.log(bn.toString());

    var tokens = bn.toString()

    var timestamp= Date.now();

    console.log(ticker);
    var tickerData = await CoinGeckoClient.coins.fetch(ticker);

    // console.log(tickerData['data']['name']);

    console.log(tickerData['data']['market_data']['current_price']['usd']);

    var value = tickerData['data']['market_data']['current_price']['usd'];

    //
    var treasuryData =[{block:blockNumber,
                       date:timestamp,
                       ticker:ticker,
                       value:value,
                       tokens:tokens,
                       wallet:walletAddress,
                       name:tickerData['data']['name']
                       }]

                       // console.log(treasuryData);

    const result = await sequelize.transaction(async (t) => {

        const user = await Treasury.bulkCreate(treasuryData, {transaction: t})

        return user;


    });


  } catch (error){ console.error(error) }
  finally{

    console.log('done');

  }

}

async function run(){

abis = [abiUSDC,abiUSDT,abiSENATE,abiPERION,abiSYNR]


for (var i = 0; i < abis.length; i++) {


  await getBalance(abis[i]['abi'],abis[i]['tokenAddress'],abis[i]['ticker'],walletAddress1);

}






}
run()
cron.schedule('0 0 * * *', () => {
  console.log('running a task every minute');
  run()
});

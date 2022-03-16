const Sequelize = require('sequelize');

var password= process.env.PASSWORD
var username=process.env.USERNAME
var database=process.env.DATABASE

const sequelize = new Sequelize(`postgresql://${username}:${password}@db:5432/${database}`,
{ logging: false,
  retry: {
    match: [
        Sequelize.ConnectionError,
        Sequelize.ConnectionTimedOutError,
        Sequelize.TimeoutError,
        /SequelizeConnectionAcquireTimeoutError/,
        Sequelize.SequelizeConnectionAcquireTimeoutError,
        Sequelize.ConnectionAcquireTimeoutError,
        Sequelize.DatabaseError,
        // /SequelizeDatabaseError/,
        /Deadlock/i,
        'SQLITE_BUSY'],
    max: 3
},

  // ,
  pool: {
    max: 5,
    min: 0,
    acquire: 120000,
    idle: 60000
  },
  dialectOptions: {
      keepAlive:true,
      idle_in_transaction_session_timeout:6000,
      statement_timeout:240000
    }

  });



const Save_block = sequelize.define('save_block', {
  id: {
    type: Sequelize.INTEGER,
    unique: false,
    autoIncrement: true,
    primaryKey: true
  },
  blockNumberSave: {
    type: Sequelize.BIGINT,
    unique: false
  }

})

const Listing_index = sequelize.define('listing_index', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  listingIndex: {
    type: Sequelize.BIGINT,
    unique: false
  },
  tokenNumbers: {
    type: Sequelize.JSON,
    unique: false
  }

})



const Marketplace_events_test1 = sequelize.define('marketplace_events_test', {
  id: {
    type: Sequelize.INTEGER,
    unique: false,
    autoIncrement: true,
    primaryKey: true
  },
  tokenNumbers: {
    type: Sequelize.JSON
  },
  // tokenAddressesInput: {
  //   type: Sequelize.JSON
  // },
  // tokenTypesInput: {
  //   type: Sequelize.JSON
  // },
  // startingPricesInput: {
  //   type: Sequelize.JSON
  // },
  // endingPricesInput: {
  //   type: Sequelize.JSON
  // },
  // exchangeTokensInput: {
  //   type: Sequelize.JSON
  // },
  // durationsInput: {
  //   type: Sequelize.JSON
  // },
  // listingIndexInput: {
  //   type: Sequelize.BIGINT
  // },
  // sellerInput: {
  //   type: Sequelize.STRING
  // },
  // tokenInput: {
  //   type: Sequelize.STRING
  // },
  // bidAmountInput: {
  //   type: Sequelize.BIGINT
  // },
  // listingIndexInput: {
  //   type: Sequelize.BIGINT
  // },
  // listingStateInput: {
  //   type: Sequelize.BIGINT
  // },
  // gas_Txn: {
  //   type: Sequelize.BIGINT
  // },
  // gasPrice_Txn: {
  //   type: Sequelize.BIGINT
  // },
  // hash_Txn: {
  //   type: Sequelize.STRING
  // },
  // nonce_Txn: {
  //   type: Sequelize.BIGINT
  // },
  // from_Txn: {
  //   type: Sequelize.STRING
  // },
  // to_Txn: {
  //   type: Sequelize.STRING
  // },
  // transactionIndex_Txn: {
  //   type: Sequelize.BIGINT
  // },
  // value_Txn: {
  //   type: Sequelize.BIGINT
  // },
  // type_Txn: {
  //   type: Sequelize.STRING
  // },
  // v_Txn: {
  //   type: Sequelize.BIGINT
  // },
  // _Txn: {
  //   type: Sequelize.STRING
  // },
  id_from_block:{
    type: Sequelize.STRING
  },
  removed:{
    type: Sequelize.BOOLEAN
  },
  logIndex: {
    type: Sequelize.INTEGER
  },
  blockNumber: {
    type: Sequelize.BIGINT
  },
  event: {
    type: Sequelize.STRING
  },
  txn: {
    type: Sequelize.STRING
  },
  transactionIndex: {
    type: Sequelize.BIGINT
  },
  timestamp: {
    type: Sequelize.STRING
  },
  seller: {
    type: Sequelize.STRING
  },
  buyer: {
    type: Sequelize.STRING
  },
  token: {
    type: Sequelize.STRING
  },
  totalPrice: {
    type: Sequelize.STRING
  },
  listingIndex: {
    type: Sequelize.BIGINT
  }
  ,
  startingPrices: {
    type: Sequelize.JSON
  },
  endingPrices: {
    type: Sequelize.JSON
  },
  exchangeTokens: {
    type: Sequelize.JSON
  },
  durations: {
    type: Sequelize.JSON
  },
  startingTimestampsUnix: {
    type: Sequelize.BIGINT
  },
  topics: {
    type: Sequelize.STRING
  }

});


const AuctionCreated = sequelize.define('auction_created', {
  id: {
    type: Sequelize.INTEGER,
    unique: false,
    autoIncrement: true,
    primaryKey: true
  },

  address:{
    type: Sequelize.STRING
  },
  blockNumber: {
    type: Sequelize.BIGINT
  },
  transactionHash: {
    type: Sequelize.STRING
  },
  transactionIndex: {
    type: Sequelize.INTEGER
  },
  logIndex: {
    type: Sequelize.INTEGER
  },
  removed:{
    type: Sequelize.BOOLEAN
  },
  id_from_block:{
    type: Sequelize.STRING
  },
  seller: {
    type: Sequelize.STRING
  },
  listingIndex: {
    type: Sequelize.STRING
  },
  startingPrices: {
    type: Sequelize.JSONB
  },
  endingPrices: {
    type: Sequelize.JSONB
  },
  exchangeTokens: {
    type: Sequelize.JSONB
  },
  durations: {
    type: Sequelize.JSONB
  },
  startingTimestampsUnix: {
    type: Sequelize.BIGINT
  },
  event: {
    type: Sequelize.STRING
  }
  // ,
  // topics: {
  //   type: Sequelize.STRING
  // }
  });

  const AuctionSuccessful = sequelize.define('auction_successful', {
    id: {
      type: Sequelize.INTEGER,
      unique: false,
      autoIncrement: true,
      primaryKey: true
    },

    address:{
      type: Sequelize.STRING
    },
    blockNumber: {
      type: Sequelize.BIGINT
    },
    transactionHash: {
      type: Sequelize.STRING
    },
    transactionIndex: {
      type: Sequelize.INTEGER
    },
    logIndex: {
      type: Sequelize.INTEGER
    },
    removed:{
      type: Sequelize.BOOLEAN
    },
    id_from_block:{
      type: Sequelize.STRING
    },
    seller: {
      type: Sequelize.STRING
    },
    buyer: {
      type: Sequelize.STRING
    },

    listingIndex: {
      type: Sequelize.STRING
    },
    token: {
      type: Sequelize.STRING
    },
    totalPrice: {
      type: Sequelize.STRING
    },
    event: {
      type: Sequelize.STRING
    }
    // ,
    // topics: {
    //   type: Sequelize.STRING
    // }
    });


    const AuctionCancelled = sequelize.define('auction_cancelled', {
      id: {
        type: Sequelize.INTEGER,
        unique: false,
        autoIncrement: true,
        primaryKey: true
      },

      address:{
        type: Sequelize.STRING
      },
      blockNumber: {
        type: Sequelize.BIGINT
      },
      transactionHash: {
        type: Sequelize.STRING
      },
      transactionIndex: {
        type: Sequelize.INTEGER
      },
      logIndex: {
        type: Sequelize.INTEGER
      },
      removed:{
        type: Sequelize.BOOLEAN
      },
      id_from_block:{
        type: Sequelize.STRING
      },
      seller: {
        type: Sequelize.STRING
      },
      listingIndex: {
        type: Sequelize.STRING
      },
      event: {
        type: Sequelize.STRING
      }
      // ,
      // topics: {
      //   type: Sequelize.STRING
      // }
      });



AuctionCreated.sync({alter:false})
AuctionSuccessful.sync({alter:false})
AuctionCancelled.sync({alter:false})
Save_block.sync({alter:false})


module.exports.Marketplace_events_test = Marketplace_events_test1
module.exports.Save_block = Save_block
module.exports.Listing_index = Listing_index

module.exports.AuctionCreated = AuctionCreated
module.exports.AuctionSuccessful = AuctionSuccessful
module.exports.AuctionCancelled = AuctionCancelled

module.exports.sequelize = sequelize

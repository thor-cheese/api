

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



const Treasury = sequelize.define('treasury', {
  id: {
    type: Sequelize.INTEGER,
    unique: false,
    autoIncrement: true,
    primaryKey: true
  },
  blockNumber: {
    type: Sequelize.INTEGER,
    unique: false
  },
  date: {
    type: Sequelize.BIGINT,
    unique: false
  },
  ticker: {
    type: Sequelize.STRING,
    unique: false
  },
  value: {
    type: Sequelize.DECIMAL,
    unique: false
  },
  tokens: {
    type: Sequelize.FLOAT,
    unique: false
  },
  wallet: {
    type: Sequelize.FLOAT,
    unique: false
  }

})




Treasury.sync({alter:true})


module.exports.Treasury = Treasury
module.exports.sequelize = sequelize

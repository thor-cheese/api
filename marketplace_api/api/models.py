from api import db
# SQLAlchemy' object has no attribute 'JSONb'

JSON = db.JSON
BigInteger = db.BigInteger
String = db.String
Integer = db.Integer
Boolean = db.Boolean
Float = db.Float
Column = db.Column

class auction_created(db.Model):

    _id = Column('id' ,Integer, primary_key=True)
    address = Column('address',String)
    blockNumber= Column('blockNumber',BigInteger)
    transactionHash = Column('transactionHash',String)
    transactionIndex = Column('transactionIndex',String)
    logIndex = Column('logIndex',Integer)
    removed = Column('removed',Boolean)
    id_from_block = Column('id_from_block',String)
    seller = Column('seller',String)
    listingIndex =Column('listingIndex',String)
    startingPrices =Column('startingPrices',JSON)
    endingPrices =Column('endingPrices',JSON)
    exchangeTokens =Column('exchangeTokens',JSON)
    durations =Column('durations',JSON)
    startingTimestamps =Column('startingTimestamps',BigInteger)
    event = Column('event',String)

    def to_dict(self):
        return {
            "id":self._id,
            "address":self.address,
            "blockNumber":self.blockNumber,
            "transactionHash":self.transactionHash,
            "transactionIndex":self.transactionIndex,
            "logIndex":self.logIndex,
            "removed":self.removed,
            "id_from_block":self.id_from_block,
            "seller":self.seller,
            "listingIndex":self.listingIndex,
            "startingPrices":self.startingPrices,
            "endingPrices":self.endingPrices,
            "durations":self.durations,
            "startingTimestamps":self.startingTimestamps,
            "event":self.event

        }



class treasuries(db.Model):

    _id = Column('id' ,Integer, primary_key=True)

    block= Column('block',Integer)
    date= Column('date',BigInteger)
    datestring= Column('datestring',String)
    ticker= Column('ticker',String)
    name= Column('name',String)
    value= Column('value',Float)
    tokens= Column('tokens',Float)
    symbol=Column('symbol',Float)


    def to_dict(self):
        return {
            "id":self._id,
            "block":self.block,
            "date":self.date,
            "ticker":self.ticker,
            "value":self.value,
            "tokens":self.tokens,
            "datestring":self.datestring,
            "name":self.name,
            "symbol":self.symbol
        }

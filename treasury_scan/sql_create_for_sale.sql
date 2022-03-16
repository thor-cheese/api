DROP TABLE IF EXISTS axies_for_sale_not_cancelled;
CREATE TABLE axies_for_sale_not_cancelled
AS
(SELECT "listingIndex"
FROM   auction_createds

EXCEPT ALL  -- "ALL" keeps duplicates and makes it faster
SELECT "listingIndex"
FROM   auction_cancelleds);

DROP TABLE IF EXISTS axies_for_sale;
CREATE TABLE axies_for_sale
AS
(SELECT "listingIndex"
FROM   axies_for_sale_not_cancelled

EXCEPT ALL  -- "ALL" keeps duplicates and makes it faster
SELECT "listingIndex"
FROM   auction_successfuls);


-- DROP TABLE IF EXISTS axies_for_sale_not_cancelled;
-- CREATE TABLE axies_for_sale_not_cancelled
-- AS( SELECT t1."listingIndex",t1."id" ,t1."address",t1."blockNumber",t1."transactionHash",t1."transactionIndex",t1."logIndex",t1."removed",t1."id_from_block",t1."seller",t1."startingPrices",t1."endingPrices",t1."exchangeTokens",t1."durations",t1."startingTimestampsUnix",t1."event"
-- FROM auction_createds t1
-- LEFT JOIN auction_cancelleds t2 on t1."listingIndex" = t2."listingIndex"
-- WHERE t2."listingIndex" IS NULL);



CREATE TABLE axies_for_sale_full
AS
(SELECT *
FROM   auction_createds
LEFT   JOIN axies_for_sale USING ("listingIndex"));

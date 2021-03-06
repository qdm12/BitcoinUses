use bitcoin_uses;

CREATE EXTERNAL TABLE IF NOT EXISTS blockchain (
    period TIMESTAMP,
    count_range1 INT,
    count_range2 INT,
    count_range3 INT,
    count_range4 INT,
    count_range5 INT,
    count_range6 INT,
    count_range7 INT,
    count_range8 INT,
    count_range9 INT,
    amount_range1 BIGINT,
    amount_range2 BIGINT,
    amount_range3 BIGINT,
    amount_range4 BIGINT,
    amount_range5 BIGINT,
    amount_range6 BIGINT,
    amount_range7 BIGINT,
    amount_range8 BIGINT,
    amount_range9 BIGINT
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
LOCATION '/user/qm301/bitcoin/output'
TBLPROPERTIES("skip.header.line.count"="2");

CREATE EXTERNAL TABLE IF NOT EXISTS blockchain_counts AS
SELECT period,
       count_range1 AS range1,
       count_range2 AS range2,
       count_range3 AS range3,
       count_range4 AS range4,
       count_range5 AS range5,
       count_range6 AS range6,
       count_range7 AS range7,
       count_range8 AS range8,
       count_range9 AS range9
FROM blockchain;

CREATE EXTERNAL TABLE IF NOT EXISTS blockchain_amounts AS
SELECT period,
       amount_range1 AS range1,
       amount_range2 AS range2,
       amount_range3 AS range3,
       amount_range4 AS range4,
       amount_range5 AS range5,
       amount_range6 AS range6,
       amount_range7 AS range7,
       amount_range8 AS range8,
       amount_range9 AS range9
FROM blockchain;

DROP TABLE blockchain;
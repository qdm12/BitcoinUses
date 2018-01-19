use bitcoin_uses;

CREATE EXTERNAL TABLE IF NOT EXISTS coinmap (
	category string, 
	city string, 
	country string, 
	created_on timestamp, 
	name string
) 
row format delimited fields terminated by ','
location '/user/sna219/coinmap/output/cleaner/';
	
DROP TABLE IF EXISTS reddit_table;
CREATE EXTERNAL TABLE reddit_table
(
   month STRING,
   word STRING,
   score INT,
   comments INT,
   count INT
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' 
LOCATION '/user/apg367/redditprofiler';

-- microtransaction, tip, art, diamond, betting, cafe, store, goods, atm, restaurant, grocery, hotel, travel, gold, salary, mixing
DROP TABLE IF EXISTS reddit_cat;
CREATE TABLE reddit_cat (month string, word string, category string, score int, comments int, count int);
INSERT INTO reddit_cat SELECT month, word, 'microtransaction', score, comments, count FROM reddit_table WHERE word IN ('microtransaction','microtransactions');
INSERT INTO reddit_cat SELECT month, word, 'tip', score, comments, count FROM reddit_table WHERE word IN ('tip','tips');
INSERT INTO reddit_cat SELECT month, word, 'art', score, comments, count FROM reddit_table WHERE word IN ('art','artwork');
INSERT INTO reddit_cat SELECT month, word, 'diamond', score, comments, count FROM reddit_table WHERE word IN ('diamond','diamonds');
INSERT INTO reddit_cat SELECT month, word, 'betting', score, comments, count FROM reddit_table WHERE word IN ('bet','betting');
INSERT INTO reddit_cat SELECT month, word, 'cafe', score, comments, count FROM reddit_table WHERE word IN ('cafe','cafes','cafeteria');
INSERT INTO reddit_cat SELECT month, word, 'store', score, comments, count FROM reddit_table WHERE word IN ('store','store');
INSERT INTO reddit_cat SELECT month, word, 'goods', score, comments, count FROM reddit_table WHERE word IN ('goods');
INSERT INTO reddit_cat SELECT month, word, 'atm', score, comments, count FROM reddit_table WHERE word IN ('atm','atms');
INSERT INTO reddit_cat SELECT month, word, 'restaurant', score, comments, count FROM reddit_table WHERE word IN ('restaurant','restaurants');
INSERT INTO reddit_cat SELECT month, word, 'grocery', score, comments, count FROM reddit_table WHERE word IN ('grocery','groceries');
INSERT INTO reddit_cat SELECT month, word, 'hotel', score, comments, count FROM reddit_table WHERE word IN ('hotel','hotels');
INSERT INTO reddit_cat SELECT month, word, 'travel', score, comments, count FROM reddit_table WHERE word IN ('travel','traveling');
INSERT INTO reddit_cat SELECT month, word, 'gold', score, comments, count FROM reddit_table WHERE word IN ('gold');
INSERT INTO reddit_cat SELECT month, word, 'salary', score, comments, count FROM reddit_table WHERE word IN ('salary','salaries');
INSERT INTO reddit_cat SELECT month, word, 'mixing', score, comments, count FROM reddit_table WHERE word IN ('mixing','mix');

DROP TABLE IF EXISTS reddit;
CREATE TABLE reddit AS 
SELECT from_unixtime(unix_timestamp(date_sub(add_months(cast(concat_ws('-',month,'01') as timestamp),1),1)), 'yyyy-MM-dd') as month, category, sum(score) as score, sum(comments) as comments, sum(count) as counts FROM reddit_cat GROUP BY month, category;

-- Top ten words modified from https://community.hortonworks.com/questions/24667/hive-top-n-records-within-a-group.html
SELECT from_unixtime(unix_timestamp(date_sub(add_months(cast(concat_ws('-',month,'01') as timestamp),1),1)), 'yyyy-MM-dd') as month, word, count, comments, score FROM (
SELECT month, word, count, score, comments, 
rank() over ( partition by month ORDER BY count DESC) AS rank 
FROM reddit_table ) t WHERE rank <= 10; --top ten words


select 
  category, 
	from_unixtime(unix_timestamp(trunc(created_on, 'MM')), 'yyyy-MM') as month_added, 
	count(category) as count 
from 
 	coinmap 
group by 
	category, 
	from_unixtime(unix_timestamp(trunc(created_on, 'MM')), 'yyyy-MM') 
order by 
	category, 
	from_unixtime(unix_timestamp(trunc(created_on, 'MM')), 'yyyy-MM');

# BitcoinUses
A big data analytics project on how bitcoins have been used since their launch in 2009

See the website at [**qdm12.github.io/BitcoinUses/results**](https://qdm12.github.io/BitcoinUses/results)

## Results
Refer to [*results/*](results) for website access and more information

## Data sources
- [Bitcoin blockchain](https://blockchain.info/)
- [Reddit](https://www.reddit.com/dev/api/)
- [CoinMap](https://coinmap.org/welcome/)

## Bitcoin blockchain

### Ingest the data
Refer to [*blockchain/readme*](blockchain/readme.md), section 1

### Profiling the data
Refer to [*blockchain/profiling/readme*](blockchain/profiling/readme.md)

### Analyzing the data
Refer to [*blockchain/analysis/readme*](blockchain/analysis/readme.md)

## CoinMap
### Ingest the data
### Profiling the data
### Analyzing the data

## Reddit
### Ingest the data
- Done with the Python script at [reddit/scrapping/reddit_import.py](reddit/scrapping/reddit_import.py)
- Uses the Reddit API
- Gets the following data:
	- Title of posts containing the keyword **bitcoin**
	- The date of the post
	- The score of the post
	- The number of comments of the post
	- The textual content of comments of the post
- This raw data is at [reddit/scrapping/](reddit/scrapping/)
	
### Profiling the data
- The data is cleaned and then profiled

### Analyzing the data

# Bitcoin Blockchain

## Data ingestion
1. Run the [**ingest1.sh**](ingest1.sh) script
    - Downloads and verifies the Bitcoin blockchain
    - The *dbcache* parameter in the script requires at least 2GB of RAM
    - On another terminal:
        1. Install jq with:
          ```bash
          sudo apt-get install -y jq
          ```
        1. Check the progress (from **0** to ~**1**) of *bitcoind*'s synchronization with:
          ```bash
          bitcoin-cli getblockchaininfo | jq -r ".verificationprogress"
          ```
    - This synchronization **never stops** and should be **manually stopped** in another terminal **when the progress reaches 0.99** with
      ```bash
      bitcoin-cli stop
      ```
1. Run the [**ingest2.sh**](ingest2.sh) script
    - Creates appropriate directories in HDFS
    - Copies the Bitcoin blocks data in HDFS
    
## Data profiling
- In the [**profiling**](profiling) directory
- MapReduce program written in Java 1.7
- Uses [maven](https://maven.apache.org) to install necessary dependencies and build the project
- Uses the [hadoopcryptoledger](https://github.com/ZuInnoTe/hadoopcryptoledger) library to parse the Bitcoin blocks binary data
- See [profiling/**readme.md**](profiling/readme.md) for more information

## Data analysis
- In the [**analysis**](analysis) directory
- MapReduce program written in Java 1.7
- Uses [maven](https://maven.apache.org) to install necessary dependencies and build the project
- Uses the [hadoopcryptoledger](https://github.com/ZuInnoTe/hadoopcryptoledger) library to parse the Bitcoin blocks binary data
- See [analysis/**readme.md**](analysis/readme.md) for more information

## Results
- Raw results from the analysis are stored in an [Impala](https://impala.apache.org/) database
- This is done using the script [analysis/resultsToImpala.sql](analysis/resultsToImpala.sql) provided with:
  ```bash
  impala-shell --quiet -i compute-1-1 -f resultsToImpala.sql
  ```
- The raw results are also on this repository at [analysis/results.csv](analysis/results.csv)
- These are fetched by our [**website**](https://qdm12.github.io/BitcoinUses/results) to display them
    
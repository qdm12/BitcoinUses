# Bitcoin Blockchain Analysis

## Results
- The following is a stacked column chart made with Excel from the raw data:

[![Chart of results](images/results.png)]()

- Raw results are in [**results.csv**](results.csv)

## Procedure
- The following diagram illustrates the whole process

[![Diagram](images/diagram.png)]()

**Note that coinbase transactions, change outputs and transaction with a single output are ignored**

1. Each mapper starts by obtaining historical bitcoin price information
    - Information is obtained from [blockchain.info](https://www.blockchain.info)
    - A weekly average price is computed from the data, since 3 January 2009
2. Each bitcoin block is fed to one of the mappers
    - The mapper outputs the week number matching the timestamp of the block as the key
    - The mapper outputs a map of the counts of outputs for different ranges of money (USD) in the block as the value
        - Coinbase transactions are ignored
        - Transactions with a single output are ignored
        - Change output (largest one in transaction with multiple outputs) is ignored for every transaction
3. The key, value pairs from the mappers are fed to the reducer
    - The reducer simply sums all the values for each week
    - The final output is the key - value pair where
        - key: week number since 3 January 2009
        - value: counts of outputs per USD value range

## Run it
1. HDFS setup
    - Run the script [../**ingest.sh**](../ingest.sh) to download, verify and put the Bitcoin blockchain in your HDFS.
        - You might want to modify target directories in the script before running it
    - You can check the progress (percentage) of the Bitcoin blockchain installation with:
        ```bash
        bitcoin-cli getblockchaininfo | jq -r ".verificationprogress"
        ```
2. Program build
    - Make sure you have at least [Java JDK 1.7](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) installed; check with:
        ```bash
        java -version
        ```
    - Make sure you have [Maven](https://maven.apache.org/download.cgi) installed; check with:
        ```bash
        mvn -version
        ```
    - In this directory, enter this command to build the program
        ```bash
        mvn clean install
        ```
    
3. Program run
    - In your hadoop environment, enter:
        ```bash
        hadoop jar target/blockchain-1.jar /user/cloudera/bitcoin/input /user/cloudera/bitcoin/output
        ```
    - Check the results with:
        ```bash
        hdfs dfs -cat /user/cloudera/bitcoin/output/part-r-00000
        ```
# Bitcoin Blockchain Profiling

## HDFS setup
Run the script ../**ingest.sh** to download, verify and put the Bitcoin blockchain in your HDFS.

You can check the progress (percentage) of the Bitcoin blockchain installation with:
```bash
bitcoin-cli getblockchaininfo | jq -r ".verificationprogress"
```

## Program build
Make sure you have [Maven](https://maven.apache.org/download.cgi) installed and enter in this directory this command:
```bash
mvn install
```
    
## Program run
In your hadoop environment, enter the following command:
```bash
hadoop jar target/blockchain-1.jar /user/cloudera/bitcoin/input /user/qm301/bitcoin/output
```

Check the results with:
```bash
hdfs dfs -cat /user/cloudera/bitcoin/output/part-r-00000
```
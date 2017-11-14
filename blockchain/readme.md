# Bitcoin Blockchain

## Content
1. Data ingestion
    1. Run the [**ingest1.sh**](ingest1.sh) script
        - Downloads and verifies the Bitcoin blockchain
        - Requires at least 2GB of RAM (or change the *dbcache* parameter)
        - On another terminal, install jq with `sudo apt-get install -y jq`
        - On another termina, you can check the progress (from 0 to 1) of *bitcoind*:
          ```bash
          bitcoin-cli getblockchaininfo | jq -r ".verificationprogress"
          ```
        - This **will not stop** and should be **manually stopped** in another terminal when **the progress reaches 0.99**:
          ```bash
          bitcoin-cli stop
          ```
    2. Run the [**ingest2.sh**](ingest2.sh) script
        - Creates appropriate directories in HDFS
        - Copies the Bitcoin blocks data in HDFS
2. Data profiling and cleaning
    - In the [**profiling**](profiling) directory
    - MapReduce written in Java 1.7
    - Uses the hadoopcryptoledger library to parse the Bitcoin blocks binary data
    - Uses maven to install necessary dependencies
    - See [profiling/**readme.md**](profiling/readme.md) for more information
3. Data analysis
    - In the [**analysis**](analysis) directory
    - MapReduce written in Java 1.7
    - Uses the hadoopcryptoledger library to parse the Bitcoin blocks binary data
    - Uses maven to install necessary dependencies
    - See [analysis/**readme.md**](analysis/readme.md) for more information
4. Import results to a database with Impala
    - Execute the [analysis/resultsToImpala.sql](analysis/resultsToImpala.sql) script:
    ```bash
    impala-shell --quiet -i compute-1-1 -f resultsToImpala.sql
    ```
    
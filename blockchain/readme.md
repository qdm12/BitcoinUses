# Bitcoin Blockchain

## Content
1. Data ingestion
    - [**ingest.sh**](ingest.sh) script
        - Downloads and verifies the Bitcoin blockchain
        - Requires at least 2GB of RAM
        - Creates appropriate directories in HDFS
        - Copies the Bitcoin blocks data in HDFS
2. Data profiling and cleaning
    - In the [**profiling**](profiling) directory
    - MapReduce written in Java
    - Uses the hadoopcryptoledger library to parse the Bitcoin blocks binary data
    - Uses maven to install necessary dependencies
    - See [profiling/**readme.md**](profiling/readme.md) for more information
3. Data analysis
    - In the [**analysis**](analysis) directory
    - MapReduce written in Java
    - Uses the hadoopcryptoledger library to parse the Bitcoin blocks binary data
    - Uses maven to install necessary dependencies
    - See [analysis/**readme.md**](analysis/readme.md) for more information
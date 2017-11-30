# Bitcoin Blockchain Profiling

## Results

The results in November 2017 are:
|           Key                    | Value               |
| -------------------------------- | ------------------- |
| Maximum outputs per transaction  | 9223372036854775807 |
| Maximum transaction value        | 50000000000000      |
| Minimum outputs per transaction  | 1                   |
| Minimum transaction value        | 0                   |
| Minimum Time                     | 1231006505          |
| Maximum Time                     | 1510022605          |
| Total number of blocks           | 493409              |

In raw form, there are:
```
Maximum outputs per transaction 9223372036854775807
Maximum transaction value       50000000000000
Minimum outputs per transaction 1
Minimum transaction value       0
Time    Minimum: 1231006505; Maximum: 1510022605
Total number of blocks  493409
```

## Run it
1. HDFS setup: Refer to the [**Data ingestion** section](../#Data ingestion)
1. Program build
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
1. Program run
    - In your hadoop environment, enter:
        ```bash
        hadoop jar target/blockchain-1.jar /user/cloudera/bitcoin/input /user/cloudera/bitcoin/output
        ```
    - Check the results with:
        ```bash
        hdfs dfs -cat /user/cloudera/bitcoin/output/part-r-00000
        ```
sudo apt-add-repository ppa:bitcoin/bitcoin
sudo apt-get update
sudo apt-get install bitcoind
bitcoind -dbcache=4096 -daemon


bitcoin-cli getblockchaininfo | jq -r '.verificationprogress'
# hdfs dfs -mkdir -p /user/cloudera/bitcoin/input
# hdfs dfs -put ~./.bitcoin/blocks/blk*.dat /user/cloudera/bitcoin/input
hadoop fs -mkdir -p /user/spark/bitcoin/input
hadoop fs -put ~./.bitcoin/blocks/blk*.dat /user/spark/bitcoin/input
# rm -fr ~./.bitcoin
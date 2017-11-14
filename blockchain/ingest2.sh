echo "Make sure you ran ingest1.sh before"
# Once download and verification are complete (above 99%)
hdfs dfs -mkdir -p /user/cloudera/bitcoin/input
hdfs dfs -put ~/.bitcoin/blocks/blk*.dat /user/cloudera/bitcoin/input
# hdfs dfs -mkdir -p /user/qm301/bitcoin/input
# hdfs dfs -put ~/.bitcoin/blocks/blk*.dat /user/qm301/bitcoin/input
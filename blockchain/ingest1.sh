sudo apt-add-repository ppa:bitcoin/bitcoin
sudo apt-get update
sudo apt-get install -y bitcoind jq
echo "Please manually stop bitcoind when the verification reaches 0.99 or more (see script commments)"
bitcoind -dbcache=2048
# This requires 2GB of ram, for faster sync
# Wait several hours for the blockchain to be downloaded and verified
# You can check the progress with:
# bitcoin-cli getblockchaininfo | jq -r ".verificationprogress"
# When the progress is above 0.99, manually stop bitcoind with:
# bitcoin-cli stop
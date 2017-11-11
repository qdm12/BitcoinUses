package analyzer;

import java.util.List;
import java.util.ArrayList;
import java.io.IOException;
import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.MapWritable;
import org.apache.hadoop.mapreduce.*;
import org.zuinnote.hadoop.bitcoin.format.common.BitcoinBlock;
import org.zuinnote.hadoop.bitcoin.format.common.BitcoinTransaction;
import org.zuinnote.hadoop.bitcoin.format.common.BitcoinTransactionOutput;

import analyzer.Parameters;

public  class BitcoinAnalyzerMapper  extends Mapper<BytesWritable, BitcoinBlock, IntWritable, MapWritable> {
    private Parameters params = new Parameters();
    int thresholds[] = params.getThresholds();
    
    @Override
    public void setup(Context context) throws IOException, InterruptedException {
        params.downloadPrices();
    }
    
    private double currentPricePerSatoshi(int periodNumber) {
        double bitcoinPrice = params.getPriceAtPeriod(periodNumber);
        return bitcoinPrice * 0.00000001;
    }
    
    private boolean looksCoinbase(List<Long> amounts, long epochTime) {
        if (amounts.size() == 1) { 
            long coinbaseReward;
            if (epochTime < 1320175479) { // before 2012-11-28 at 15:24:38 UTC
                coinbaseReward = 5000000000L;
            } else if (epochTime < 1467405973) { // before 2016-07-09 16:46:13
                coinbaseReward = 2500000000L;
            } else if (epochTime < 1591029000) { // approximation for 2020-06-12
                coinbaseReward = 1250000000L;
            } else {
                coinbaseReward = 625000000L;
            }
            if (amounts.get(0) > coinbaseReward * 0.95 && 
                amounts.get(0) < coinbaseReward * 1.05) {
                return true;
            }
        }
        return false;
    }
    
    private int epochToBitcoinPeriod(long epochTime) {
        float time = epochTime - 1230940800;
        float period = this.params.getPeriod();
        int periodNumber = (int)(time / period);
        return periodNumber;
    }
    
    @Override
    public void map(BytesWritable key, BitcoinBlock value, Context context) throws IOException, InterruptedException {
        // First Bitcoin block epoch time: 1231006505 seconds
        // Every week is: 604800 seconds
        int period = epochToBitcoinPeriod(value.getTime());
   
        int[] counts = new int[thresholds.length+1]; //+1 for > $1M
        MapWritable map = new MapWritable();
        
        List<BitcoinTransaction> transactions = value.getTransactions();
        List<Long> blockAmounts = new ArrayList<Long>();
        for (BitcoinTransaction tx : transactions) {
            List<Long> txAmounts = new ArrayList<Long>();
            for (BitcoinTransactionOutput output : tx.getListOfOutputs()) {
                txAmounts.add(output.getValue());
            }
            if (txAmounts.size() == 0) {
                // no outputs in transaction
                System.out.println("No Outputs in transaction ! =====");
                continue; // that does not happen
            } else if (looksCoinbase(txAmounts, value.getTime())) {
                // we ignore coinbase transactions
                continue;
            } else if (txAmounts.size() == 1) {
                // one input to one output and no coinbase
                // must be a transfer of wallet, this is ignored
                continue;
            }
            // more than 1 output
            // we ignore the largest output as being the change
            Long maxAmount = -1L;
            for(Long amount : txAmounts) {
                if (amount > maxAmount) {
                    maxAmount = amount;
                }
            }
            txAmounts.remove(maxAmount);
            blockAmounts.addAll(txAmounts);
        }
        double price = currentPricePerSatoshi(period); 
        for (Long blockAmount : blockAmounts) {
            boolean found = false;
            for (int i = 0; i < thresholds.length; i++) {
                if (blockAmount * price < thresholds[i]) {
                    counts[i]++;
                    found = true;
                    break;
                }
            }
            if (!found) {
                counts[counts.length - 1]++; // huge amount
            }
        }
        for (int bucket = 0; bucket < counts.length; bucket++) {
            map.put(new IntWritable(bucket),
                    new IntWritable(counts[bucket]));
        }
        // Key : Week where block was found
        // Value : Map of amount ranges counts of transactions 
    	context.write(new IntWritable(period), map);
    }
}
	 

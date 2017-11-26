package analyzer;

import java.util.List;
import java.util.ArrayList;
import java.io.IOException;
import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.MapWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.*;
import org.zuinnote.hadoop.bitcoin.format.common.BitcoinBlock;
import org.zuinnote.hadoop.bitcoin.format.common.BitcoinTransaction;
import org.zuinnote.hadoop.bitcoin.format.common.BitcoinTransactionOutput;

import analyzer.Parameters;

public  class BitcoinAnalyzerMapper  extends Mapper<BytesWritable, BitcoinBlock, IntWritable, MapWritable> {
    private Parameters params = new Parameters();
    double thresholds[] = params.getThresholds();
    
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
        double[] amounts = new double[thresholds.length+1];
        
        List<BitcoinTransaction> transactions = value.getTransactions();
        List<Long> blockAmounts = new ArrayList<Long>();
        for (BitcoinTransaction tx : transactions) {
            List<Long> txAmounts = new ArrayList<Long>();
            for (BitcoinTransactionOutput output : tx.getListOfOutputs()) {
                txAmounts.add(output.getValue());
            }
            if (looksCoinbase(txAmounts, value.getTime())) {
                // ignore coinbase transactions
                continue;
            } else if (txAmounts.size() == 1) {
                // ignore 1-input -> 1-output transactions
                // likely to be a transfer of wallet, this is ignored
                continue;
            }
            // > 1 output
            // ignore the largest output as being the change
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
            double dollarAmount = blockAmount * price;
            boolean found = false;
            for (int i = 0; i < thresholds.length; i++) {
                if (dollarAmount < thresholds[i]) {
                    counts[i]++;
                    amounts[i] += dollarAmount;
                    found = true;
                    break;
                }
            }
            if (!found) { // huge amount
                counts[counts.length - 1]++;
                amounts[counts.length - 1] += dollarAmount;
            }
        }
        MapWritable mapCounts = new MapWritable();
        MapWritable mapAmounts = new MapWritable();
        for (int bucket = 0; bucket < counts.length; bucket++) {
            mapCounts.put(new IntWritable(bucket),
                          new IntWritable(counts[bucket]));
            mapAmounts.put(new IntWritable(bucket),
                           new DoubleWritable(amounts[bucket]));
        }
        MapWritable map = new MapWritable();
        map.put(new Text("Counts"), mapCounts);
        map.put(new Text("Amounts"), mapAmounts);
        // Key : Period of block
        // Value : Map of mapCounts and mapAmounts
    	context.write(new IntWritable(period), map);
    }
}
	 

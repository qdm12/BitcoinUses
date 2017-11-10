package org.zuinnote.hadoop.bitcoin.example.tasks;
import java.io.IOException;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.*;
import org.zuinnote.hadoop.bitcoin.format.common.*;

import org.zuinnote.hadoop.bitcoin.format.mapreduce.*;


import java.util.*;

public  class BitcoinBlockMap  extends Mapper<BytesWritable, BitcoinBlock, IntWritable, MapWritable> {

@Override
public void setup(Context context) throws IOException, InterruptedException {
 // nothing to set up
}

@Override
public void map(BytesWritable key, BitcoinBlock value, Context context) throws IOException, InterruptedException {
    // First bitcoin block epoch (day): 1230940800
    // Every week is: 604800
    IntWritable week = new IntWritable(
            (int) Math.floorDiv(value.getTime() - 1230940800, 604800)
            );

    // Number of transactions for each range of satoshis per block
    // 10 = 1$ today (November 2017)
    // Today ($): 1, 5, 10, 30, 100, 500, 1000, 5 000, 20 000, 50 000, 100 000, 500 000
    long thresholds[] = {10, 50, 100, 300, 1000, 5000, 10000, 50000, 200000, 500000, 1000000, 5000000};
    int[] counts = new int[thresholds.length+1]; //+1 for > 0.5M$
    MapWritable map = new MapWritable();
    
    List<BitcoinTransaction> transactions = value.getTransactions();
    List<Long> blockAmounts = new ArrayList<Long>();
    for (BitcoinTransaction tx : transactions) {
        List<BitcoinTransactionOutput> outputs = tx.getListOfOutputs();
        List<Long> txAmounts = new ArrayList<Long>();
        for (BitcoinTransactionOutput output : outputs) {
            txAmounts.add(output.getValue());
        }
        if (txAmounts.size() == 0) {
            continue;
        }
        if (txAmounts.size() > 1) {
            // we ignore the largest output as being the change
            Long maxAmount = -1L;
            for(Long amount : txAmounts) {
                if (amount > maxAmount) {
                    maxAmount = amount;
                }
            }
            txAmounts.remove(maxAmount);
            // TODO: Ignore coinbase?
        }
        blockAmounts.addAll(txAmounts);
    }
    for (Long blockAmount : blockAmounts) {
        for (int i = 0; i < thresholds.length; i++) {
            if (blockAmount < thresholds[i]) {
                counts[i]++;
                break;
            }
            counts[counts.length - 1]++; // huge amount
        }
    }
    for (int i = 0; i < counts.length; i++) {
        map.put(new IntWritable(i), new IntWritable(counts[i]));
    }
    // Key : Week where block was found
    // Value : Map of amount ranges counts of transactions 
	context.write(week, map);
}

@Override
public void cleanup(Context context) {
 // nothing to cleanup
}	    

}
	 

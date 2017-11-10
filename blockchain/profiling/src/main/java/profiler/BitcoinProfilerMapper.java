package profiler;

import java.util.List;
import java.io.IOException;
import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.mapreduce.*;
import org.zuinnote.hadoop.bitcoin.format.common.BitcoinBlock;
import org.zuinnote.hadoop.bitcoin.format.common.BitcoinTransaction;
import org.zuinnote.hadoop.bitcoin.format.common.BitcoinTransactionOutput;

public class BitcoinProfilerMapper  extends Mapper<BytesWritable, BitcoinBlock, Text, LongWritable> {

@Override
public void setup(Context context) throws IOException, InterruptedException {
    // nothing to set up
}

@Override
public void map(BytesWritable key, BitcoinBlock value, Context context) throws IOException, InterruptedException {
    /* Profiling the value
     * We are interested in the time of the BitcoinBlock
     * and the value of the BitcoinTransactionOutputs of 
     * the BitcoinTransaction of the BitcoinBlock
    */   
    List<BitcoinTransaction> transactions = value.getTransactions();
    long minimumValue = Long.MAX_VALUE, maximumValue = -1;
    int minOutputsPerTx = Integer.MAX_VALUE, maxOutputsPerTx = -1;
    for (BitcoinTransaction tx : transactions) {
        int outputsCount = tx.getListOfOutputs().size();
        if (outputsCount > maxOutputsPerTx) {
            maxOutputsPerTx = outputsCount;
        }
        if (outputsCount < minOutputsPerTx) {
            minOutputsPerTx = outputsCount;
        }
        for (BitcoinTransactionOutput output : tx.getListOfOutputs()) {
            if (output.getValue() > maximumValue) {
                maximumValue = output.getValue();
            }
            if (output.getValue() < minimumValue) {
                minimumValue = output.getValue();
            }
        }
    }
    context.write(new Text("Time"), new LongWritable(value.getTime()));
    context.write(new Text("Minimum transaction value"), new LongWritable(minimumValue));
    context.write(new Text("Maximum transaction value"), new LongWritable(maximumValue));
    context.write(new Text("Minimum outputs per transaction"), new LongWritable(minOutputsPerTx));
    context.write(new Text("Maximum outputs per transaction"), new LongWritable(maxOutputsPerTx));
}

@Override
public void cleanup(Context context) {
    // nothing to cleanup
}	    

}
	 

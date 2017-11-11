package profiler;

import java.io.IOException;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.LongWritable;

public class BitcoinProfilerReducer extends Reducer<Text, LongWritable, Text, Text> {
    @Override
    public void reduce(Text key, Iterable<LongWritable> values, Context context)
         throws IOException, InterruptedException {
        long minTime = Long.MAX_VALUE;
        long maxTime = -1;
        long minTxValue = Long.MAX_VALUE;
        long maxTxValue = -1;
        long minOutputsPerTx = Long.MAX_VALUE;
        long maxOutputsPerTx = -1;
        int totalBlocks = 0;
        String key_str = key.toString();
        switch (key_str) {
        case "Time":
            for (LongWritable value : values) {
                totalBlocks++;
                minTime = Math.min(minTime, value.get());
                maxTime = Math.max(maxTime, value.get());
            }
            context.write(
                    new Text(key_str),
                    new Text("Minimum: "+Long.toString(minTime)+"; Maximum: "+Long.toString(maxTime))
                    );
            context.write(
                    new Text("Total number of blocks"),
                    new Text(Integer.toString(totalBlocks))
                    );
            break;
        case "Minimum transaction value":
            for (LongWritable value : values) {
                minTxValue = Math.min(minTxValue, value.get());
            }
            context.write(
                    new Text(key_str),
                    new Text(Long.toString(minTxValue))
                    );
            break;
        case "Maximum transaction value":
            for (LongWritable value : values) {
                maxTxValue = Math.max(maxTxValue, value.get());
            }
            context.write(
                    new Text(key_str),
                    new Text(Long.toString(maxTxValue))
                    );
            break;
        case "Minimum outputs per transaction":
            for (LongWritable value : values) {
                minOutputsPerTx = Math.min(minOutputsPerTx, value.get());
            }
            context.write(
                    new Text(key_str),
                    new Text(Long.toString(minOutputsPerTx))
                    );
            break;
        case "Maximum outputs per transaction":
            for (LongWritable value : values) {
                maxOutputsPerTx = Math.max(maxOutputsPerTx, value.get());
            }
            context.write(
                    new Text(key_str),
                    new Text(Long.toString(minOutputsPerTx))
                    );
            break;
        default:
            for (LongWritable value : values) {
                context.write(
                        new Text("Unknown key ("+key_str+")"),
                        new Text(Long.toString(value.get()))
                        );
            }
        }
    }
}



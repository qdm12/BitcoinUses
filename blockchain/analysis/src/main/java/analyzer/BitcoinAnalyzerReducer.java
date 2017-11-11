package analyzer;

import java.io.IOException;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.MapWritable;
import org.apache.hadoop.io.Text;

public class BitcoinAnalyzerReducer extends Reducer<IntWritable, MapWritable, Text, Text> {
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        Parameters param = new Parameters();
        String key = "Period ("+
                     Integer.toString(param.getPeriodDays())+
                     ")";
        int[] thresholds = param.getThresholds();
        String value = "< $"+Integer.toString(thresholds[0])+",";
        if (thresholds.length > 2) {
            for (int i = 1; i < thresholds.length; i++) {
                value += "$"+Integer.toString(thresholds[i-1])+
                        " - $"+Integer.toString(thresholds[i])+",";
            }
        }
        value += "> $"+Integer.toString(thresholds[thresholds.length-1]);
        
        
        context.write(new Text(key), new Text(value));
    }
    
    @Override
    public void reduce(IntWritable key, Iterable<MapWritable> values, Context context)
         throws IOException, InterruptedException {
        int L = values.iterator().next().size();
        int[] totalCounts = new int[L];
        for (MapWritable counts : values) {
            for (int i = 0; i < L; i++) {
                IntWritable valueCount = (IntWritable) counts.get(new IntWritable(i));
                totalCounts[i] += valueCount.get();
            }
        }
        String resultKey = key.toString();
        String resultValue = "";
        for (int i = 0; i < L; i++) {
            resultValue += Integer.toString(totalCounts[i]) + ",";
        }
        resultValue = resultValue.substring(0, resultValue.length() - 1);
        context.write(new Text(resultKey), new Text(resultValue));
    }
}



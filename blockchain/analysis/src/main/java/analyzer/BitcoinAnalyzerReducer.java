package analyzer;

import java.io.IOException;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.MapWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.Text;

public class BitcoinAnalyzerReducer extends Reducer<IntWritable, MapWritable, Text, Text> {
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        Parameters param = new Parameters();
        double[] thresholds = param.getThresholds();
        
        // First line legend
        String key = "Period ("+
                Integer.toString(param.getPeriodDays())+
                ")";
        String value = "Counts of outputs per USD range,";
        for (int i = 1; i < thresholds.length+1; i++) {
            value += ",";
        }
        value += "Cumulative USD amount of outputs per USD range,";
        for (int i = 1; i < thresholds.length+1; i++) {
            value += ",";
        }
        value = value.substring(0, value.length() - 1);
        context.write(new Text(key), new Text(value));
        
        // Second line legend
        value = "< $"+Double.toString(thresholds[0])+",";
        for (int i = 1; i < thresholds.length; i++) {
            value += "$"+Double.toString(thresholds[i-1])+
                    " - $"+Double.toString(thresholds[i])+",";
        }
        value += "> $"+Double.toString(thresholds[thresholds.length-1]);
        value += ",";
        value += "< $"+Double.toString(thresholds[0])+",";
        for (int i = 1; i < thresholds.length; i++) {
            value += "$"+Double.toString(thresholds[i-1])+
                    " - $"+Double.toString(thresholds[i])+",";
        }
        value += "> $"+Double.toString(thresholds[thresholds.length-1]);
        context.write(new Text(key), new Text(value));
    }
    
    @Override
    public void reduce(IntWritable key, Iterable<MapWritable> values, Context context)
         throws IOException, InterruptedException {
        MapWritable mapCounts = (MapWritable) values.iterator().next().get(new Text("Counts"));
        MapWritable mapAmounts;
        int L = mapCounts.size();
        int[] totalCounts = new int[L];
        double[] totalAmounts = new double[L];
        for (MapWritable map : values) {
            mapCounts = (MapWritable) map.get(new Text("Counts"));
            mapAmounts = (MapWritable) map.get(new Text("Amounts"));
            for (int i = 0; i < L; i++) {
                IntWritable count = (IntWritable) mapCounts.get(new IntWritable(i));
                totalCounts[i] += count.get();
                DoubleWritable amount = (DoubleWritable) mapAmounts.get(new IntWritable(i));
                totalAmounts[i] += amount.get();
            }
        }
        String resultKey = key.toString();
        String resultValue = "";
        for (int i = 0; i < L; i++) {
            resultValue += Integer.toString(totalCounts[i]) + ",";
        }
        for (int i = 0; i < L; i++) {
            resultValue += Integer.toString((int) totalAmounts[i]) + ",";
        }
        resultValue = resultValue.substring(0, resultValue.length() - 1);        
        context.write(new Text(resultKey), new Text(resultValue));
    }
}



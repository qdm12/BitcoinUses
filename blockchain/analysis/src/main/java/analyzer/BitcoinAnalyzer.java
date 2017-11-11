package analyzer;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.MapWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;
import org.zuinnote.hadoop.bitcoin.format.mapreduce.BitcoinBlockFileInputFormat;

import analyzer.BitcoinAnalyzerMapper;
import analyzer.BitcoinAnalyzerReducer;
   
public class BitcoinAnalyzer extends Configured implements Tool {    
    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        // See more options at https://github.com/ZuInnoTe/hadoopcryptoledger/wiki/Hadoop-File-Format
        conf.set("hadoopcryptoledger.bitcoinblockinputformat.filter.magic","F9BEB4D9");
        // Let ToolRunner handle generic command-line options
        int res = ToolRunner.run(conf, new BitcoinAnalyzer(), args); 
        System.exit(res);
    }
  
    public int run(String[] args) throws Exception {
        Job job = new Job();
        job.setNumReduceTasks(1);
        job.setJarByClass(BitcoinAnalyzer.class);
        job.setJobName("Bitcoin amounts counter");
        job.setMapOutputKeyClass(IntWritable.class);
        job.setMapOutputValueClass(MapWritable.class);
        job.setOutputKeyClass(IntWritable.class);
        job.setOutputValueClass(Text.class);
        
        job.setMapperClass(BitcoinAnalyzerMapper.class);
        job.setReducerClass(BitcoinAnalyzerReducer.class);
        
        job.setInputFormatClass(BitcoinBlockFileInputFormat.class);
        job.setOutputFormatClass(TextOutputFormat.class);
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));
        
        return job.waitForCompletion(true) ? 0 : 1;
    }  
}

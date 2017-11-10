package profiler;

// import java.util.*;
        
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.*;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.lib.input.*;
import org.apache.hadoop.mapreduce.lib.output.*;
import org.apache.hadoop.util.*;
import profiler.BitcoinProfilerMapper;
import profiler.BitcoinProfilerReducer;
   
import org.zuinnote.hadoop.bitcoin.format.mapreduce.*;
   
public class BitcoinProfiler extends Configured implements Tool {
    
    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        /** Set as an example some of the options to configure the Bitcoin fileformat **/
        /** Find here all configuration options: https://github.com/ZuInnoTe/hadoopcryptoledger/wiki/Hadoop-File-Format **/
        conf.set("hadoopcryptoledger.bitcoinblockinputformat.filter.magic","F9BEB4D9");
        // Let ToolRunner handle generic command-line options 
        int res = ToolRunner.run(conf, new BitcoinProfiler(), args); 
        System.exit(res);
    }
    public BitcoinProfiler() {
        // nothing needed here
    }
      
    public int run(String[] args) throws Exception {
        Job job = new Job(); //Job.getInstance(getConf(),"example-hadoop-bitcoin-transactioncounter-job");
        job.setNumReduceTasks(1); // NEW
        job.setJarByClass(BitcoinProfiler.class);
        job.setJobName("Bitcoin profiler");
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(LongWritable.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        
        job.setMapperClass(BitcoinProfilerMapper.class);
        job.setReducerClass(BitcoinProfilerReducer.class);
        
        job.setInputFormatClass(BitcoinBlockFileInputFormat.class);
        job.setOutputFormatClass(TextOutputFormat.class);
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));
        
        return job.waitForCompletion(true) ? 0 : 1;
    }
}

package org.zuinnote.hadoop.bitcoin.example.tasks;

import java.io.IOException;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.*;
import java.util.*;

public class BitcoinBlockReducer extends Reducer<IntWritable, MapWritable, IntWritable, MapWritable> {

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
    MapWritable mw = new MapWritable();
    for (int i = 0; i < L; i++) {
        mw.put(new IntWritable(i), new IntWritable(totalCounts[i]));
    }
    context.write(key, mw);
}
}



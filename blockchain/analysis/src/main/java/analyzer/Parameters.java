package analyzer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Parameters {
    private static final int periodDays = 30;
    // Number of transactions for each range of USD per block
    private double thresholds[] = {0.05, 1, 5, 30, 100, 300, 1000, 10000};
    
    private static List<Double> pricePerPeriod = new ArrayList<Double>();
    private static HashMap<Integer, List<Double>> pricesPerPeriod = new HashMap<Integer, List<Double>>();    

    public int getPeriodDays() {
        return periodDays;
    }
    
    public int getPeriod() {
        return periodDays * 86400;
    }
    
    public double getPriceAtPeriod(int periodNumber) {
        return pricePerPeriod.get(periodNumber);
    }
    
    public double[] getThresholds() {
        return thresholds;
    }    
       
    private void processPriceLine(String line) {
        String[] data = line.split("\\s+");
        double price = Double.parseDouble(data[1].split(",")[1]);        
        long epochTime = -1L;
        try {
            epochTime = new SimpleDateFormat("yyyy-MM-dd").parse(data[0]).getTime() / 1000;
        } catch (ParseException e) {
            e.printStackTrace();
        }       
        float time = epochTime - 1230940800;
        float period = periodDays * 86400;
        int periodNumber = (int)(time / period);
        if (!pricesPerPeriod.containsKey(periodNumber)) {
            pricesPerPeriod.put(periodNumber, new ArrayList<Double>());
        }
        pricesPerPeriod.get(periodNumber).add(price);
    }
    
    public void downloadPrices() { // executed in setup of mapper
        try {
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(
                            new URL("https://api.blockchain.info/charts/market-price?timespan=all&format=csv").openStream()
                            )
                    );
            String line = reader.readLine();
            while(line != null) {
                processPriceLine(line);
                line = reader.readLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        for (int i = 0; i < pricesPerPeriod.size(); i++) {
            pricePerPeriod.add(0.00);
        }        
        for (int period : pricesPerPeriod.keySet()) {
            List<Double> prices = pricesPerPeriod.get(period); 
            double sum = 0;
            for (Double price : prices) {
                sum += price;
            }
            pricePerPeriod.set(period, sum / prices.size());            
        }
    }
}

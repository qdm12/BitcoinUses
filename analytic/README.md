This is the analytic code for Coinmap and Reddit data. It imports the results from MapReduce into impala and generates counts of the results. The following command will output the analytic to a CSV file. 

To use on NYU HPC Dumbo:

``impala-shell -i compute-1-1 -f impala.sql -B -o output.csv --print_header --output_delimiter=,``

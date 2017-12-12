var Data = {
    blockchain: {
        ranges: [],
        periods: [],
        counts: [], // per period
        amounts: [], // per period
    },
    reddit: {
        keywords: [],
        periods: [],
        counts: [], // per period
    },
    coinmap: {
        types: [],
        periods: [],
        counts: [], // per period
    }
};

var Charts = {
    blockchain: {
        counts: {
            chart: null,
            data: null,
            options: null,
        },
        countspercent: {
            chart: null,
            data: null,
            options: null,
        },
        amounts: {
            chart: null,
            data: null,
            options: null,
        },
        amountspercent: {
            chart: null,
            data: null,
            options: null,
        },
        countssmall: {
            chart: null,
            data: null,
            options: null,
        },
        amountssmall: {
            chart: null,
            data: null,
            options: null,
        },
    },
    reddit: {
        counts: {
            chart: null,
            data: null,
            options: null,
        },
        countspercent: {
            chart: null,
            data: null,
            options: null,
        },
        countssmall: {
            chart: null,
            data: null,
            options: null,
        },
    },
    coinmap: {
        counts: {
            chart: null,
            data: null,
            options: null,
        },
        countspercent: {
            chart: null,
            data: null,
            options: null,
        },
    },
};

function intToMonth(integer) {
    switch(integer) {
        case 1, "01":
            return "Jan";
        case 2, "02":
            return "Feb";
        case 3, "03":
            return "Mar";
        case 4, "04":
            return "Apr";
        case 5, "05":
            return "May";
        case 6, "06":
            return "Jun";
        case 7, "07":
            return "Jul";
        case 8, "08":
            return "Aug";
        case 9, "09":
            return "Sep";
        case 10, "10":
            return "Oct";
        case 11, "11":
            return "Nov";
        case 12, "12":
            return "Dec";
        default:
            return "???";
    }
}

function getBlockchainResults() {
    return $.ajax({
        url: 'https://raw.githubusercontent.com/qdm12/BitcoinUses/master/blockchain/analysis/results.csv',
        dataType: 'text',
    })
    .done(function(data) {
        parseBlockchainResults(data);
        configureBlockchainCharts();
    })
    .fail(function(data) {
        alert("Blockchain raw results were not found !");
    });
}

function getRedditResults() {
    return $.ajax({
        url: 'https://raw.githubusercontent.com/acpg/Reddit/master/output/reddit_counts.csv',
        dataType: 'text',
    })
    .done(function(data) {
        parseRedditResults(data);
        configureRedditCharts();
    })
    .fail(function(data) {
        alert("Reddit raw results were not found !");
    });
}

function getCoinmapResults() {
    return $.ajax({
        url: 'https://raw.githubusercontent.com/sadam0930/coinmap-etl/master/coinmap-counts.csv',
        dataType: 'text',
    })
    .done(function(data) {
        parseCoinmapResults(data);
        configureCoinmapCharts();
    })
    .fail(function(data) {
        alert("Coinmap raw results were not found !");
    });
}

function transpose(array2D) {
    return array2D[0].map(function (_, c) { return array2D.map(function (r) { return r[c]; }); });
}

function parseBlockchainResults(data) {
    var i, j;
    var rows = data.split(/\r?\n|\r/);
    legend1 = rows[0].split(',');
    legend2 = rows[1].split(',');
    rows.shift();
    rows.shift();
    for (i = 1; i < 1+(legend2.length - 1)/2; i++) {
        Data.blockchain.ranges.push(legend2[i]);
    }
    for (i = 0; i < rows.length - 1; i++) { // skips uncomplete last period
        row = rows[i].split(',');
        period = row[0].split('-');
        period = intToMonth(period[1]) + ' ' + period[0];
        Data.blockchain.periods.push(period);
        Data.blockchain.counts.push([period]);
        Data.blockchain.amounts.push([period]);
        for (j = 1; j < Data.blockchain.ranges.length + 1; j++) {
            Data.blockchain.counts[i].push(Number(row[j]));
            Data.blockchain.amounts[i].push(Number(row[j + Data.blockchain.ranges.length]));
        }
    }
}

function parseRedditResults(data) {
    var i, j, k;
    var rows = data.split(/\r?\n|\r/);
    legend = rows[0].split(',');
    rows.shift();
    for (i = 1; i < legend.length - 1; i++) { // ignores grand total
        Data.reddit.keywords.push(legend[i]);
    }
    for (i = 0; i < rows.length - 1; i++) { // ignores grand total
        row = rows[i].split(',');
        period = row[0].split('-');
        period = intToMonth(period[1]) + ' ' + period[0];
        Data.reddit.periods.push(period);
        Data.reddit.counts.push([period]);
        for (j = 1; j < Data.reddit.keywords.length+1; j++) { // ignores grand total
            Data.reddit.counts[i].push(Number(row[j]));
        }
    }
}

function parseCoinmapResults(data) {
    var i, j, k;
    var rows = data.split(/\r?\n|\r/);
    legend = rows[0].split(',');
    rows.shift();
    for (i = 1; i < legend.length - 1; i++) { // ignores grand total
        Data.coinmap.types.push(legend[i]);
    }
    for (i = 0; i < rows.length - 1; i++) { // ignores grand total
        row = rows[i].split(',');
        period = row[0].split('-');
        period = intToMonth(period[1]) + ' ' + period[0];
        Data.coinmap.periods.push(period);
        Data.coinmap.counts.push([period]);
        for (j = 1; j < Data.coinmap.types.length+1; j++) { // ignores grand total
            Data.coinmap.counts[i].push(Number(row[j]));
        }
    }

    // Make the counts cumulative
    for (i = 1; i < Data.coinmap.counts.length; i++) {
        for (j = 1; j < Data.coinmap.types.length; j++) {
            Data.coinmap.counts[i][j] += Data.coinmap.counts[i-1][j];
        }
    }
}

function drawSectionCharts(sections) {
    for (var i = 0; i < sections.length; i++) {
        for(var chartName in Charts[sections[i]]) {
            if (Charts[sections[i]][chartName].chart != null) {
                Charts[sections[i]][chartName].chart.draw(
                    Charts[sections[i]][chartName].data,
                    Charts[sections[i]][chartName].options
                );
            }
        }
    }
}

function configureBlockchainCharts() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawGoogleCharts);
    function drawGoogleCharts() {
        // Monthly number of outputs per USD range
        Charts.blockchain.counts.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('blockchainCounts')
        );
        Charts.blockchain.counts.data = google.visualization.arrayToDataTable(
            [['Period'].concat(Data.blockchain.ranges)] // legend
            .concat(Data.blockchain.counts) // data
        );
        Charts.blockchain.counts.options = {
            title:'Monthly number of outputs per USD range',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Number of outputs'},
            isStacked: 'absolute'
        };

        // Monthly percentage of outputs per USD range
        Charts.blockchain.countspercent.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('blockchainCountspercent')
        );
        Charts.blockchain.countspercent.data = Charts.blockchain.counts.data;
        Charts.blockchain.countspercent.options = {
            title:'Monthly percentage of outputs per USD range',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Percentage of number of outputs'},
            isStacked: 'percent'
        };

        // Monthly USD transferred per output USD range
        Charts.blockchain.amounts.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('blockchainAmounts')
        );
        Charts.blockchain.amounts.data = google.visualization.arrayToDataTable(
            [['Period'].concat(Data.blockchain.ranges)] // legend
            .concat(Data.blockchain.amounts) // data
        );
        Charts.blockchain.amounts.options = {
            title:'Monthly USD transferred per output USD range',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'USD amounts'},
            isStacked: 'absolute'
        };

        // Monthly percentage of USD transferred per output USD range
        Charts.blockchain.amountspercent.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('blockchainAmountspercent')
        );
        Charts.blockchain.amountspercent.data = Charts.blockchain.amounts.data;
        Charts.blockchain.amountspercent.options = {
            title:'Monthly percentage of USD transferred per output USD range',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Percentage of total USD transferred'},
            isStacked: 'percent'
        };

        // Ranges and periods of interest
        N_RANGES = 6; // up to USD 300
        // Monthly number of outputs per USD range since January 2013
        Charts.blockchain.countssmall.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('blockchainCountssmall')
        );

        var i, temp;
        var smallRanges = Data.blockchain.ranges.slice(0,N_RANGES);
        var smallCounts = [];
        var reached = false;
        for (i = 0; i < Data.blockchain.counts.length; i++) {
            if (Data.blockchain.periods[i] == "Jan 2013") {
                reached = true;
            }
            if (reached) {
                temp = Data.blockchain.counts[i];
                smallCounts.push(temp.splice(0,N_RANGES + 1));
            }
        }

        Charts.blockchain.countssmall.data = google.visualization.arrayToDataTable(
            [['Period'].concat(smallRanges)] // legend
            .concat(smallCounts) // data
        );
        Charts.blockchain.countssmall.options = {
            title:'Monthly number of outputs per USD range, only for small USD ranges and since 2013',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Number of outputs'},
            isStacked: 'absolute'
        };

        // Monthly USD transferred per output USD range, up to range 6
        Charts.blockchain.amountssmall.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('blockchainAmountssmall')
        );
        var smallAmounts = [];
        reached = false;
        for (i = 0; i < Data.blockchain.amounts.length; i++) {
            if (Data.blockchain.periods[i] == "Jan 2013") {
                reached = true;
            }
            if (reached) {
                temp = Data.blockchain.amounts[i];
                smallAmounts.push(temp.splice(0,N_RANGES + 1));
            }
        }

        Charts.blockchain.amountssmall.data = google.visualization.arrayToDataTable(
            [['Period'].concat(smallRanges)] // legend
            .concat(smallAmounts) // data
        );
        Charts.blockchain.amountssmall.options = {
            title:'Monthly USD transferred per output USD range, only for small USD ranges and since 2013',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Number of outputs'},
            isStacked: 'absolute'
        };

        drawSectionCharts(["blockchain"]);
    }
}

function configureRedditCharts() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawGoogleCharts);
    function drawGoogleCharts() {
        // Monthly counts of keywords
        Charts.reddit.counts.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('redditCounts')
        );
        Charts.reddit.counts.data = google.visualization.arrayToDataTable(
            [['Period'].concat(Data.reddit.keywords)] // legend
            .concat(Data.reddit.counts) // data
        );
        Charts.reddit.counts.options = {
            title:'Monthly counts of Bitcoin related keywords on Reddit',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Number of occurrences'},
            isStacked: 'absolute'
        };

        // Monthly percentage of counts of keywords
        Charts.reddit.countspercent.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('redditCountspercent')
        );
        Charts.reddit.countspercent.data = Charts.reddit.counts.data;
        Charts.reddit.countspercent.options = {
            title:'Monthly relative percentage of Bitcoin related keywords on Reddit',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Percentage of number of occurrences'},
            isStacked: 'percent'
        };

        // From 2013 only
        // Monthly counts of keywords since January 2013
        Charts.reddit.countssmall.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('redditCountssmall')
        );

        var i, temp;
        var smallCounts = [];
        var reached = false;
        for (i = 0; i < Data.reddit.counts.length; i++) {
            if (Data.reddit.periods[i] == "Jan 2013") {
                reached = true;
            }
            if (reached) {
                smallCounts.push(Data.reddit.counts[i]);
            }
        }

        Charts.reddit.countssmall.data = google.visualization.arrayToDataTable(
            [['Period'].concat(Data.reddit.keywords)] // legend
            .concat(smallCounts) // data
        );
        Charts.reddit.countssmall.options = {
            title:'Monthly counts of Bitcoin related keywords on Reddit since 2013 only',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Number of occurrences'},
            isStacked: 'absolute'
        };

        drawSectionCharts(["reddit"]);
    }
}

function configureCoinmapCharts() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawGoogleCharts);
    function drawGoogleCharts() {
        // Monthly number of venues per venue type
        Charts.coinmap.counts.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('coinmapCounts')
        );
        Charts.coinmap.counts.data = google.visualization.arrayToDataTable(
            [['Period'].concat(Data.coinmap.types)] // legend
            .concat(Data.coinmap.counts) // data
        );
        Charts.coinmap.counts.options = {
            title:'Monthly cumulative number of venues per venue type',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Number of venues'},
            isStacked: 'absolute'
        };

        // Monthly percentage of venues per venue type
        Charts.coinmap.countspercent.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('coinmapCountspercent')
        );
        var reducedTypes = Data.coinmap.types;
        var reducedCounts = Data.coinmap.counts;
        var index = reducedTypes.indexOf("default");
        if (index > -1) {
            reducedTypes.splice(index,1);
            for (var i = 0; i < reducedCounts.length; i++) {
                reducedCounts[i].splice(index+1,1);
            }
        }
        Charts.coinmap.countspercent.data = google.visualization.arrayToDataTable(
            [['Period'].concat(reducedTypes)] // legend
            .concat(reducedCounts) // data
        );
        Charts.coinmap.countspercent.options = {
            title:'Monthly percentage cumulative venues per venue type',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Percentage of number of venues'},
            isStacked: 'percent'
        };

        drawSectionCharts(["coinmap"]);
    }
}

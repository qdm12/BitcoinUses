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
        procedure: {
            chart: null,
            data: null,
            options: null,
        },
    },
    reddit: {
        procedure: {
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
        procedure: {
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

function getBlockchainResults() { // execute first
    return $.ajax({
        url: 'https://raw.githubusercontent.com/qdm12/BitcoinUses/master/blockchain/analysis/results.csv',
        dataType: 'text',
    })
    .done(function(data) {
        resizeBlockchainCharts();
        parseBlockchainResults(data);
        configureBlockchainCharts();
    })
    .fail(function(data) {
        alert("Blockchain raw results were not found !");
    });
}

function getCoinmapResults() {
    return $.ajax({
        url: 'https://raw.githubusercontent.com/sadam0930/coinmap-etl/master/coinmap-counts.csv',
        dataType: 'text',
    })
    .done(function(data) {
        resizeCoinmapCharts();
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

function percentToPx(percent, dimension) {
    percent = percent / 100;
    ret = 0;
    if (dimension == "w") {
        if (percent > 0.99) { percent = 0.99; }
        ret = Math.floor(percent*$(window).width());
    } else {
        ret = Math.floor(percent*$(window).height());
    }
    return ret.toString() + "px";
}

function resizeBlockchainCharts() {
    $("#blockchainCounts,#blockchainCountspercent,#blockchainAmounts,#blockchainAmountspercent,#blockchainAmountssmall,#blockchainCountssmall").css({
        width: percentToPx(100, "w"),
        height: percentToPx(50, "h"),
    });
    $("#blockchainProcedure").css({
        width: percentToPx(100, "w"),
        height: percentToPx(50, "h"),
    });
}

function resizeCoinmapCharts() {
    $("#coinmapCounts,#coinmapCountspercent").css({
        width: percentToPx(100, "w"),
        height: percentToPx(50, "h"),
    });
    $("#coinmapProcedure").css({
        width: percentToPx(100, "w"),
        height: percentToPx(50, "h"),
    });
}

function drawSectionCharts(section) {
    for(var chartName in Charts[section]) {
        if (Charts[section][chartName].chart != null) {
            Charts[section][chartName].chart.draw(
                Charts[section][chartName].data,
                Charts[section][chartName].options
            );
        }
    }
}

function configureBlockchainCharts() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawCharts);
    function drawCharts() {
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

        N_RANGES = 6;
        // Monthly number of outputs per USD range, up to range 6
        Charts.blockchain.countssmall.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('blockchainCountssmall')
        );
        var smallRanges = Data.blockchain.ranges.slice(0,N_RANGES);
        var smallCounts = [];
        for (var i = 0; i < Data.blockchain.counts.length; i++) {
            smallCounts.push(Data.blockchain.counts[i].splice(0,N_RANGES + 1));
        }
        Charts.blockchain.countssmall.data = google.visualization.arrayToDataTable(
            [['Period'].concat(smallRanges)] // legend
            .concat(smallCounts) // data
        );
        Charts.blockchain.countssmall.options = {
            title:'Monthly number of outputs per USD range (small USD ranges)',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Number of outputs'},
            isStacked: 'absolute'
        };

        // Monthly USD transferred per output USD range, up to range 6
        Charts.blockchain.amountssmall.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('blockchainAmountssmall')
        );
        var smallAmounts = [];
        for (var i = 0; i < Data.blockchain.amounts.length; i++) {
            smallAmounts.push(Data.blockchain.amounts[i].splice(0,N_RANGES + 1));
        }
        Charts.blockchain.amountssmall.data = google.visualization.arrayToDataTable(
            [['Period'].concat(smallRanges)] // legend
            .concat(smallAmounts) // data
        );
        Charts.blockchain.amountssmall.options = {
            title:'Monthly USD transferred per output USD range (small USD ranges)',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Number of outputs'},
            isStacked: 'absolute'
        };

        // Procedure
        // TODO

        drawSectionCharts("blockchain");
    }
}

function configureCoinmapCharts() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawCharts);
    function drawCharts() {
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
        Charts.coinmap.countspercent.data = Charts.coinmap.counts.data;
        Charts.coinmap.countspercent.options = {
            title:'Monthly percentage cumulative venues per venue type',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Percentage of number of venues'},
            isStacked: 'percent'
        };

        // Procedure
        // TODO

        drawSectionCharts("coinmap");
    }
}

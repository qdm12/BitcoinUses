var blockchainCounts = []; // per period
var blockchainAmounts = []; // per period
var blockchainPeriods = [];
var blockchainRanges = [];

var Charts = {
    "blockchain": {
        "counts": {
            chart: null,
            data: null,
            options: null,
        },
        "countspercent": {
            chart: null,
            data: null,
            options: null,
        },
        "amounts": {
            chart: null,
            data: null,
            options: null,
        },
        "amountspercent": {
            chart: null,
            data: null,
            options: null,
        },
        "procedure": {
            chart: null,
            data: null,
            options: null,
        },
    },
    "reddit": {
        "procedure": {
            chart: null,
            data: null,
            options: null,
        },        "procedure":null,
    },
    "coinmap": {
        "procedure": {
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
        parseBlockchainResults(data);
        configureBlockchainCharts();
    })
    .fail(function(data) {
        alert("Blockchain raw results were not found !");
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
    for (i = 0; i < (legend2.length - 1)/2; i++) {
        blockchainRanges.push(legend2[i+1]); // skips period
    }
    for (i = 0; i < rows.length - 1; i++) {
        row = rows[i].split(',');
        period = row[0].split('-');
        period = intToMonth(period[1]) + ' ' + period[0];
        blockchainPeriods.push(period);
        blockchainCounts.push([period]);
        blockchainAmounts.push([period]);
        for (j = 1; j < blockchainRanges.length + 1; j++) {
            blockchainCounts[i].push(Number(row[j]));
            blockchainAmounts[i].push(Number(row[j + blockchainRanges.length]));
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
    $("#blockchain #counts").css({
        'margin-top': $(navigation_bar).height()
    });
    $("#blockchain #counts,#countspercent,#amounts,#amountspercent").css({
        width: percentToPx(100, "w"),
        height: percentToPx(50, "h"),
    });
    $("#blockchain #procedure").css({
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
    resizeBlockchainCharts();
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawCharts);
    function drawCharts() {
        // Monthly number of outputs per USD range
        Charts.blockchain.counts.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('counts')
        );
        Charts.blockchain.counts.data = google.visualization.arrayToDataTable(
            [['Period'].concat(blockchainRanges)] // legend
            .concat(blockchainCounts) // data
        );
        Charts.blockchain.counts.options = {
            title:'Monthly number of outputs per USD range',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Number of outputs'},
            isStacked: 'absolute'
        };

        // Monthly percentage of outputs per USD range
        Charts.blockchain.countspercent.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('countspercent')
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
            document.getElementById('amounts')
        );
        Charts.blockchain.amounts.data = google.visualization.arrayToDataTable(
            [['Period'].concat(blockchainRanges)] // legend
            .concat(blockchainAmounts) // data
        );
        Charts.blockchain.amounts.options = {
            title:'Monthly USD transferred per output USD range',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'USD amounts'},
            isStacked: 'absolute'
        };

        // Monthly percentage of USD transferred per output USD range
        Charts.blockchain.amountspercent.chart = new google.visualization.SteppedAreaChart(
            document.getElementById('amountspercent')
        );
        Charts.blockchain.amountspercent.data = Charts.blockchain.amounts.data;
        Charts.blockchain.amountspercent.options = {
            title:'Monthly percentage of USD transferred per output USD range',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Percentage of total USD transferred'},
            isStacked: 'percent'
        };

        // Procedure
        var $ = go.GraphObject.make;
        var myDiagram = $(go.Diagram, "procedure");

        drawSectionCharts("blockchain");
    }
}

function renderReddit() {

}

function renderCoinmap() {

}






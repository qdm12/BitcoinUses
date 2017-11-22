var blockchainCounts = []; // per period
var blockchainAmounts = []; // per period
var blockchainPeriods = [];
var blockchainRanges = [];

function getBlockchainResults() { // execute first
    return $.ajax({
        url: 'https://raw.githubusercontent.com/qdm12/BitcoinUses/master/blockchain/analysis/results.csv',
        dataType: 'text',
    })
    .done(function(data) {
        parseBlockchainResults(data);
        renderBlockchain();
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
        blockchainPeriods.push(row[0]);
        blockchainCounts.push([row[0]]);
        blockchainAmounts.push([row[0]]);
        for (j = 1; j < blockchainRanges.length + 1; j++) {
            blockchainCounts[i].push(Number(row[j]));
            blockchainAmounts[i].push(Number(row[j + blockchainRanges.length]));
        }
    }
}

function renderMixed() {

}

function renderBlockchain() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawCharts);
    function drawCharts() {
        var data = google.visualization.arrayToDataTable(
            [['Period'].concat(blockchainRanges)] // legend
            .concat(blockchainCounts) // data
        );
        var options = {
            title:'Number of outputs per $ ranges per month since 2009',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Number of outputs'},
            isStacked: 'absolute'
        };
        var chartCounts = new google.visualization.SteppedAreaChart(document.getElementById('blockchainCounts'));
        chartCounts.draw(data, options);
        options = {
            title:'Percentage of outputs per $ ranges per month since 2009',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Percentage of number of outputs'},
            isStacked: 'percent'
        };
        var chartCountsPercents = new google.visualization.SteppedAreaChart(document.getElementById('blockchainCountsPercent'));
        chartCountsPercents.draw(data, options); 

        data = google.visualization.arrayToDataTable(
            [['Period'].concat(blockchainRanges)] // legend
            .concat(blockchainAmounts) // data
        );
        var options = {
            title:'$ transferred for each output $ range per month since 2009',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'USD amounts'},
            isStacked: 'absolute'
        };
        var chartAmounts = new google.visualization.SteppedAreaChart(document.getElementById('blockchainAmounts'));
        chartAmounts.draw(data, options);
        options = {
            title:'Percentage of $ transferred for each output $ range per month since 2009',
            backgroundColor: {fill:'transparent'},
            vAxis: {title: 'Percentage of total USD transferred'},
            isStacked: 'percent'
        };
        var chartAmountsPercents = new google.visualization.SteppedAreaChart(document.getElementById('blockchainAmountsPercent'));
        chartAmountsPercents.draw(data, options); 
    }
}

function renderReddit() {

}

function renderCoinmap() {

}






var blockchainCounts = [];
var blockchainAmounts = [];
var blockchainPeriods = ["x"]; // x for x axis
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

function parseBlockchainResults(data) {
    var i;
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
    }

    for (j = 0; j < blockchainRanges.length; j++) { // skips the date
        blockchainCounts.push([legend2[j+1]]);
        blockchainAmounts.push([legend2[j+1]]);
        for (i = 0; i < rows.length - 1; i++) {
            row = rows[i].split(',');
            blockchainCounts[j].push(Number(row[j + 1]));
            blockchainAmounts[j].push(Number(row[j + blockchainRanges.length]));
        }
    }
}

function renderMixed() {
    var chart = bb.generate({
        bindto: "#mixedChart",
        data: {
            type: "bar",
            columns: [
                ["data1", 30, 200, 100, 170, 150, 250],
                ["data2", 130, 100, 140, 35, 110, 50]
            ]
        }
    });
}

function renderBlockchain() {
    var counts = bb.generate({
        bindto: "#blockchainCounts",
        data: {
            type: "bar",
            columns: blockchainCounts,
            groups: [blockchainRanges]
        },
        legend: {
            position: "right"
        },
        axis: {
            x: {
                label: "Period"
            },
            y: {
                label: "Number of outputs"
            },
        },
        tooltip: {
            grouped: false,
            format: {
                title: function (d) { return 'Data for month ' + d + ' since 2009'; },
                value: function (value, ratio, id) {
                  return value;
              }
            }
        },
    });
    var amounts = bb.generate({
        bindto: "#blockchainAmounts",
        data: {
            type: "bar",
            columns: blockchainAmounts,
            groups: [blockchainRanges]
        },
        legend: {
            position: "right"
        },
        axis: {
            x: {
                label: "Period"
            },
            y: {
                label: "Number of outputs"
            },
        },
        tooltip: {
            grouped: false,
            format: {
                title: function (d) { return 'Data for month ' + d + ' since 2009'; },
                value: function (value, ratio, id) {
                  return value;
              }
            }
        },
    });
}

function renderReddit() {
    var chart = bb.generate({
        bindto: "#redditChart",
        data: {
            type: "bar",
            columns: [
                ["x", "www.site1.com", "www.site2.com", "www.site3.com", "www.site4.com"],
                ["download", 30, 200, 100, 400],
                ["loading", 90, 100, 140, 200]
            ], //blockchainAmounts,
            groups: [
                [
                  "download",
                  "loading"
                ]
              ],
        }
    });
}

function renderCoinmap() {
    var chart = bb.generate({
        bindto: "#coinmapChart",
        data: {
            type: "bar",
            columns: [
                ["data1", 30, 200, 100, 170, 150, 250],
                ["data2", 130, 100, 140, 35, 110, 50]
            ]
        }
    });
}






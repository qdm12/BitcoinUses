var isMobile = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
}

function resizeText() {
    var size = 0;
    if (isMobile) {
        size = $(window).width() * 0.01;
    } else {
        size = $(window).width() * 0.014;
    }
    $(".text").css({
        "font-size":size + "px",
    });
}

function smoothScrolling() {
    $('a').click(function(){
        $('html, body').animate({
            scrollTop: $( $(this).attr('href') ).offset().top
        }, 500);
        return false;
    });
}

window.onload = function() { /* executes first */
    resizeText();
    smoothScrolling();
    if(isMobile){
        console.log('Mobile detected');
    } else {
        console.log('Desktop detected');
    }
};

$(document).ready(function() { /* executes secondly */
    setTimeout(function(){getBlockchainResults();}, 400);
    setTimeout(function(){getRedditResults();}, 700);
    setTimeout(function(){getCoinmapResults();}, 1100);
});



$(window).resize(function() {
    resizeText();
    drawSectionCharts(["blockchain", "reddit", "coinmap"]);
});
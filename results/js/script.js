var isMobile = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
}

function smoothScrolling() {
    $('a').click(function(){
        $('html, body').animate({
            scrollTop: $( $(this).attr('href') ).offset().top
        }, 500);
        return false;
    });
}

function animateTitleWord(parent, wordIndex, period) {
    // parent is title or subtitle
    $("#introduction #" + parent + " #word" + wordIndex.toString())
    .animate({
        "opacity": "1.00",
    }, period / 2, function() {
        $("#introduction #" + parent + " #word" + wordIndex.toString()).animate({
            "opacity": "0.75",
        }, period * 10);
    });
}

function animateTitle(period) {
    for (i = 1; i <= 3; i++) {
        setTimeout(function(index, period){
            animateTitleWord("title", index, period);
        }, i*period, i, period);
    }
    for (i = 1; i <= 6; i++) {
        setTimeout(function(index, period){
            animateTitleWord("subtitle", index, period);
        }, 3*period + i*0.5*period, i, period);
    }
}

function animateTitleRepeat(period) {
    animateTitle(period);
    setInterval(function(){
        animateTitle(period);
    }, 11*period);
}



function bannerOpacity() {
    var banner_opacity_mouseover = 0.93;
    var banner_opacity_mouseout = 0.66;
    var banner = $('#navigation_bar');
    banner.mouseover(function(){
        banner.css("opacity", banner_opacity_mouseover);
    });
    banner.mouseout(function(){
        banner.css("opacity", banner_opacity_mouseout);
    });
    var b_pos = banner.offset().top;
    $(window).scroll(function (){ // binds the following to when the user scrolls
        var y = $(this).scrollTop();
        if(y == 0){
            banner_opacity_mouseover = 0.93;
            banner_opacity_mouseout = 0.66;
        } else {
            banner_opacity_mouseover = 0.70;
            banner_opacity_mouseout = 0.5;
        }
        banner.stop().animate({
                        'opacity':banner_opacity_mouseout                
                        },400);
    });
}

$(document).ready( function() { /* executes first */
    bannerOpacity();
    if(isMobile){
        console.log('Mobile detected');
    } else {
        console.log('Desktop detected.');
    }
});

window.onload = function(){ /* executes secondly */
    getBlockchainResults();
    smoothScrolling();
    animateTitleRepeat(800);
};

$(window).resize(function() {
    resizeBlockchainCharts();
    drawSectionCharts("blockchain");
});
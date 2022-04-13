// click to show copy success message
function copyToClipboard(str) {
    // copyt to clipboard
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // show copy success message
    document.getElementById("custom-tooltip").style.display = "inline-block";
    setTimeout( function() {
        document.getElementById("custom-tooltip").style.display = "none";
    }, 1000);
};

// remove name style
function window_check() {
    window.addEventListener("resize", function(){
        helper()
    }, true);

    function helper () {
        if (window.innerWidth < 440) {
            $('.headshot > p').removeClass("rotated-text-upright rotated-text-mixed");
            $('#main').removeClass("main-layout").addClass("main-layout-small");
        } else {
            $('.headshot > .name-cn').addClass("rotated-text-upright");
            $('.headshot > .name-en').addClass("rotated-text-mixed");
            $('#main').removeClass("main-layout-small").addClass("main-layout");
        }
    }

    helper()
}

window_check();

$('#main > .project').bind('click', () => {
    $('#main').removeClass('main-layout').addClass('hidden');
    $('#more').removeClass('hidden');
    $('#more').addClass('high');
})
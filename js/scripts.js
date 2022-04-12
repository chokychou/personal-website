// includes jquerry
var script = document.createElement('script');
script.src = '//code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

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



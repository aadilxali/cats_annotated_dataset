/* List of all items in the dataset. To be filled asynchronously. */
var listing = null;

/* Get the points for item n. */
function getPoints(n, callback) {
    $.get(listing[n] + '.jpg.cat', function(text) {
        var points = [];
        var numbers = text.split(/ +/).slice(1, -1).map(parseFloat);
        for (var i = 0; i < numbers.length; i += 2) {
            points.push([numbers[i], numbers[i + 1]]);
        }
        callback(points);
    }, 'text');
}

/* Get the drawing context. */
function getContext() {
    return $('#cat').get(0).getContext('2d');
}

/* Set the currently displayed image. */
function setImage(cat) {
    var ctx = getContext();
    ctx.canvas.width = cat.width;
    ctx.canvas.height = cat.height;
    ctx.drawImage(cat, 0, 0);
}

/* Adjust the display to indicate a new image is loading. */
function showLoading() {
    var ctx = getContext();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = 'Black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/* Set the display to view item n from listing. */
function view(n) {
    showLoading();
    location.hash = n;
    var cat = new Image();
    cat.src = listing[n] + '.jpg';
    cat.onload = function() {
        setImage(cat);
        getPoints(n, function(points) {
            var ctx = getContext();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            for (var t = 0; t < points.length; t += 3) {
                ctx.beginPath();
                ctx.moveTo(points[t + 0][0], points[t + 0][1]);
                ctx.lineTo(points[t + 1][0], points[t + 1][1]);
                ctx.lineTo(points[t + 2][0], points[t + 2][1]);
                ctx.lineTo(points[t + 0][0], points[t + 0][1]);
                ctx.stroke();
            }
            ctx.fillStyle = 'red';
            for (var i = 0; i < points.length; i++) {
                ctx.beginPath();
                ctx.arc(points[i][0], points[i][1], 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    };
}

/* Get the item listing. */
$.getJSON('listing.json', function(result) {
    listing = result;
    if (location.hash) {
        var start = parseFloat(location.hash.slice(1));
        view(start);
        $('#current').val(start);
    } else {
        view(0);
    }
});

$(document).ready(function() {
    function current() {
        return parseFloat($('#current').val());
    }
    $('#current').bind('input', function() {
        view(current());
    });
    $('#prev').bind('click', function() {
        $('#current').val(current() - 1);
        view(current());
    });
    $('#next').bind('click', function() {
        $('#current').val(current() + 1);
        view(current());
    });
    $('form').bind('submit', function() {
        return false;
    });
});

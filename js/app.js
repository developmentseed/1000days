var m;
var legend;
var mm = com.modestmaps;
var activeLayer = 'djohnson.stunting_orange';
var activeData = 'djohnson.country_points2';
var activeData2= 'djohnson.admin_points';
var borders = 'mapbox.world-borders-light';
var baselayer ='mapbox.world-blank-bright';

// TODO: Change this
$(document).ready(function () {
    $('a.share').click(function(e){
        e.preventDefault();

        var shareContent = $('.share-content');
        var twitter = 'http://twitter.com/intent/tweet?status=' +
        'MobileActive Mobile Data ' + encodeURIComponent(window.location);
        var facebook = 'https://www.facebook.com/sharer.php?t=MobileActive%20Mobile%20Data%20Data&u=' +
        encodeURIComponent(window.location);

        document.getElementById('twitter').href = twitter;
        document.getElementById('facebook').href = facebook;

        var center = m.pointLocation(new mm.Point(m.dimensions.x/2,m.dimensions.y/2));
        var embedUrl = 'http://api.tiles.mapbox.com/v2/' + layers + '/mm/zoompan,tooltips,legend,bwdetect.html#' + m.coordinate.zoom +
                        '/' + center.lat + '/' + center.lon;
        $('#embed-code-field textarea').attr('value', '<iframe src="' + embedUrl +
            '" frameborder="0" width="650" height="500"></iframe>');

        $('#embed-code')[0].tabindex = 0;
        $('#embed-code')[0].select();
    });
});
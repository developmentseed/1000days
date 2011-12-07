var m,
1	legend,
    mm = com.modestmaps,
    activeData = '',
    activeLayer = 'mix-africa-gdp',
    layers = [
    	'mapbox.world-blank-bright',
        'world-urban-areas',
        activeLayer,
        'mapbox.world-borders-dark',
        activeData].join(','),
    url = 'http://a.tiles.mapbox.com/djohnson/1.0.0/' + layers + '/layer.json';

	function getTiles() { 
	  return [
	            "http://a.tiles.mapbox.com/djohnson/1.0.0/"+layers+"/{z}/{x}/{y}.jpg",
	            "http://b.tiles.mapbox.com/djohnson/1.0.0/"+layers+"/{z}/{x}/{y}.jpg",
	            "http://c.tiles.mapbox.com/djohnson/1.0.0/"+layers+"/{z}/{x}/{y}.jpg",
	            "http://d.tiles.mapbox.com/djohnson/1.0.0/"+layers+"/{z}/{x}/{y}.jpg"
	         ]
	};
	
	function getGrids() { 
	  return [
	            "http://a.tiles.mapbox.com/djohnson/1.0.0/"+layers+"/{z}/{x}/{y}.grid.json",
	            "http://b.tiles.mapbox.com/djohnson/1.0.0/"+layers+"/{z}/{x}/{y}.grid.json",
	            "http://c.tiles.mapbox.com/djohnson/1.0.0/"+layers+"/{z}/{x}/{y}.grid.json",
	            "http://d.tiles.mapbox.com/djohnson/1.0.0/"+layers+"/{z}/{x}/{y}.grid.json"
	         ]
	};
	
	function refreshMap() {
		url = 'http://a.tiles.mapbox.com/mix/1.0.0/' + layers + '/layer.json';
  		wax.tilejson(url, function(tilejson) {
  			tilejson.minzoom = 5;
	      	tilejson.maxzoom = 7;
	      	tilejson.tiles = getTiles();
	      	tilejson.grids = getGrids();
	      	m.setProvider(new wax.mm.connector(tilejson));
		    $('.wax-legends').remove(); 
		    legend = wax.mm.legend(m, tilejson).appendTo(m.parent);
		    interaction.remove();
		    interaction = wax.mm.interaction(m, tilejson);
		});
	}
	
	$(function (){
		//build map
		$('a#mix-africa-gdp').addClass('active');
	    wax.tilejson(url, function(tilejson) {
	      tilejson.minzoom = 4;
	      tilejson.maxzoom = 6;
	      tilejson.tiles = getTiles();
	      tilejson.grids = getGrids();
	      
	      m = new mm.Map('map',
	        new wax.mm.connector(tilejson),
	        null,
	        [
	          new mm.DragHandler,
	          new mm.DoubleClickHandler,
	          new mm.TouchHandler
	        ]);
	      interaction = wax.mm.interaction(m, tilejson);
	      wax.mm.zoomer(m, tilejson).appendTo(m.parent);
	      legend = wax.mm.legend(m, tilejson).appendTo(m.parent);
	      wax.mm.zoombox(m, tilejson);
	      
	      m.setCenterZoom(new mm.Location(5, 33), 4);
	      
	      // Bandwidth detection control and switch element
		  var detector = wax.mm.bwdetect(m, {
		    auto: true,
		    png: '.png32?'
		  });
		  m.addCallback('drawn', function lqDetect(modestmap, e) {
		    if (!detector.bw()) {
		      $('#bwtoggle').removeClass('active');
		    }
		    m.removeCallback(lqDetect);
		  });
		  $('a#bwtoggle').click(function(e) {
		      e.preventDefault();
		      $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
		      detector.bw(!detector.bw());
		  });
	      
	    });
	    
	    //contextual layer switching
	    $('.layers li a').click(function() {
	    	activeLayer = this.id;
	    	$('.layers li a').removeClass('active');
      		$(this).addClass('active');
	    	layers = [
            	'mapbox.world-blank-bright',
		        'world-urban-areas',
		        activeLayer,
		        'mapbox.world-borders-dark',
		        activeData
            ].join(',');
            
            refreshMap();
        });
        
        //point data selector
        $('#data-select').change(function() {
        	activeData = $('#data-select option:selected')[0].id;
        	layers = [
            	'mapbox.world-blank-bright',
		        'world-urban-areas',
		        activeLayer,
		        'mapbox.world-borders-dark',
		        activeData
            ].join(',');
            
            refreshMap();
        });
	});
	
	// Update and show embed script
	$(function (){
	  $('a.embed').click(function (e) {
	    e.preventDefault();
	
	    var splitLayers = layers.split(','),
	        embedlayers = '',
	        center = m.pointLocation(new mm.Point(m.dimensions.x/2,m.dimensions.y/2));
	
	    $.each(splitLayers, function(num, key) {
	      embedlayers += '&amp;layers%5B%5D=' + key;
	    });
	
	    var embedId = 'ts-embed-' + (+new Date());
	    var url = '&amp;size=700'
	            + '&amp;size%5B%5D=550'
	            + '&amp;center%5B%5D=' + center.lon
	            + '&amp;center%5B%5D=' + center.lat
	            + '&amp;center%5B%5D=' + 6
	            + embedlayers
	            + '&amp;options%5B%5D=zoomwheel'
	            + '&amp;options%5B%5D=legend'
	            + '&amp;options%5B%5D=tooltips'
	            + '&amp;options%5B%5D=zoombox'
	            + '&amp;options%5B%5D=zoompan'
	            + '&amp;options%5B%5D=attribution'
	            + '&amp;el=' + embedId;
	
	    $('.tip input').attr('value', "<div id='"
	      + embedId
	      + "-script'><script src='http://tiles.mapbox.com/mix/api/v1/embed.js?api=mm"
	      + url
	      + "'></script></div>");
	
	    if ($('#embed').hasClass('active')) {
	      $('#embed').removeClass('active');
	    } else {
	      $('#embed').addClass('active');
	      $('#embed-code')[0].tabindex = 0;
	      $('#embed-code')[0].focus();
	      $('#embed-code')[0].select();
	    }
	  });
	});
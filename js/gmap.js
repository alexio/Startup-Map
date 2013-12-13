var map = null;
var markers = null;
var mcoptions = {
  maxZoom: 14,
  gridSize: 50
};
var markerCluster = null;

function initialize() {
    var infowindow = new google.maps.InfoWindow({
        size: new google.maps.Size(150,50)
    });

   var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(39.8282, -98.5795)
    };
    markers = [];
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    var param = '/mappedinUSA/crunch.php?url=198.211.114.151:443/cl';
    console.log(param);
    console.log('before');
    $.ajax({
        url: param,
        type: 'GET',
        success: function(data) {
            console.log('success');
            console.log(data);
	    data.forEach(function(item) {
		      if(item===undefined || item.name===undefined){
		        console.log('nothing here');
		      }
		      else{
			      var lat = item.offices[0].lat;
			      var lon = item.offices[0].lon;
			      var loc = new google.maps.LatLng(lat,lon);
			      var marker = new google.maps.Marker({
				position: loc,
				map: map,
				title: item.name,
				twitter: item.twitter_handle,
				site: item.homepage
			      });
			      google.maps.event.addListener(marker,'click',function(){
				infowindow.setContent(item.homepage);
				infowindow.open(map,marker);
				var send = {
				  query: marker.twitter
				};
				$.ajax({
				  url: '198.211.114.151:443/t',
				  type: 'GET',
				  data: send,
				  dataType: 'json',
				  success: function(res) {
				    alert('success');
				  },
				  error: function(){
				    alert('error');
				  }
				});
			      });
			      google.maps.event.addListener(map, 'click', function() {
       			        infowindow.close();
    			      });
			      markers.push(marker);
		      }
	      });
    	    markerCluster = new MarkerClusterer(map,markers,mcoptions);
    	    markerCluster.addMarkers(markers,true);
    	    console.log(markers);
            console.log('done'); 
        },
        error: function() {
            console.log("error");
        }
    });
    var myLatlng = new google.maps.LatLng(39.8282,-98.5795);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: "Center of the USA"
    });
}

//setTimeout(function() {
//    markerCluster = new MarkerClusterer(map,markers, mcoptions);
//    markerCluster.addMarkers(markers,true);
//    console.log(markers);
//}, 2000);

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&key=AIzaSyDIXB9n24ZzLKJH4zzJM4B_UOcAfFhtR5Q&' +
        'callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;

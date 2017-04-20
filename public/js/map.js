var map;
var request;
var service;
var drawn_shape;
var infowindow;
var searchBox;
var pricing;
var rating;
var free_polygon;
var price_filter = false;
var rate_filter = false;
var side_bar_out = false;
var markers = [];
var places_array = [];
var earthRadius = 6378137.0;
var initLat;
var initLng;
var marker;

//intialize the map
function initialize() {
  initLat = readCookie('lat');
  initLng = readCookie('lng');
  infowindow = new google.maps.InfoWindow();

  map = create_map(new google.maps.LatLng(initLat,initLng));
  marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(initLat,initLng),
    icon: 'images/point.png'
  });

  initAutocomplete();

}

function initAutocomplete() {

  var input = document.getElementById('place-input');
  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    console.log(place);
    // If user entered invalid input, display message of no available info
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    // Otherwise, zoom to desired place
    map.setCenter(place.geometry.location);
    map.setZoom(13);
    marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: 'images/point.png'
    });
    document.getElementById('showWeather').style.display = 'none';
  });

} // end initAutocomplete()




function create_map(center){
    return new google.maps.Map(document.getElementById('map'),{
        center: center,zoom:13,
        scrollwheel: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });
}


function createSchoolsCtrl() {
  var schoolsCtrl = document.getElementById("m-schools");

    // clear markers if user has clicked on schools control again.
    // this makes sure that old markers are removed in case map bounds have changed
    if (markers.length != 0)
      clearMarkers();

    var service = new google.maps.places.PlacesService(map);

    // icon to display: school
    var icon = {
      url: 'images/school.png',
      anchor: new google.maps.Point(20, 20),
      scaledSize: new google.maps.Size(20, 20)
    }

    service.nearbySearch({
      location: map.getCenter(),
      radius: 8000,
      type: ['school']
    }, function(results, status) {
      // if successful, create marker for each result
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i], icon);
        }
      }
    });

    map.setZoom(13);

}


function createMarker(place, icon) {
  // Create a marker for each place.
  console.log(place);
  var marker = new google.maps.Marker({
    map: map,
    icon: icon,
    title: place.name,
    position: place.geometry.location
  });

  // display related info when user clicks on marker
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.vicinity + '</div>');
    infowindow.open(map, this);
  });

  markers.push(marker);
}

function clearMarkers() {
  // Clear out the old markers.
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);

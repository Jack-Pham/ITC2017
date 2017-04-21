var map;
var request;
var service;
var infowindow;
var searchBox;
var pricing;
var rating;
var price_filter = false;
var rate_filter = false;
var side_bar_out = false;
var places_array = [];
var earthRadius = 6378137.0;
var initLat;
var initLng;
var marker;
var crimeMarkers = [];
var crimeMarker;

//intialize the map
function initialize() {
  initLat = readCookie('lat');
  initLng = readCookie('lng');
  infowindow = new google.maps.InfoWindow({
    content: '',
    maxWidth: 400
  });

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
    place = autocomplete.getPlace();
    console.log(place);
    // If user entered invalid input, display message of no available info
    createCookie('location',$("#place-input").val(),4);
    createCookie('lat',place.geometry['location'].lat(),4);
    createCookie('lng',place.geometry['location'].lng(),4);
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
    document.getElementById('showCrime').style.display = 'none';
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

function createCrime(){

  if (crimeMarkers.length != 0)
  {
    clearCrimeMarkers();
  }
  else {
    var address = map.getCenter();
    $.ajax({
      url: '/crime',
      type: 'POST',
      data: {"lat":address.lat(), "lng":address.lng()},
      dataType: "json",
      success: function(data){
        for (var i = 0; i < data.length; i++){
          createCrimeMarker(data[i]);
        };
      }
    });
      map.setZoom(13);
  }
}

function createCrimeMarker(crime){
  console.log(crime);
  var crimeIcon = {
    url: imageForType(crime.type),
    anchor: new google.maps.Point(20, 20),
    scaledSize: new google.maps.Size(20, 20)
  }

  var crimeMarker = new google.maps.Marker({
    map: map,
    icon: crimeIcon,
    title: crime.type,
    position: new google.maps.LatLng(crime.lat,crime.lon)
  });

  google.maps.event.addListener(crimeMarker, 'click', function() {
    infowindow.setContent('<div style="color: #000;"><strong>' + crime.type + '</strong><br><p>'
                                          + crime.address + '</p><br><p>' + crime.date + '</p></div>');
    infowindow.open(map, this);
  });

  crimeMarkers.push(crimeMarker);
}

function clearCrimeMarkers() {
  // Clear out the old markers.
  crimeMarkers.forEach(function(marker) {
    marker.setMap(null);
  });
  crimeMarkers = [];
}

function imageForType(type) {
  var root = "http://s3.mylocalcrime.com.s3.amazonaws.com/images/icons/spotcrime_info/";
  return root + {
    "Theft": 'theft',
    "Robbery": 'robbery',
    "Burglary": 'burglary',
    "Vandalism": 'vandalism',
    "Shooting": 'shooting',
    "Arson": 'arson',
    "Arrest": 'arrest',
    "Assault": 'assault',
    "Other": 'other'
  }[type] + '.png';
}

google.maps.event.addDomListener(window, 'load', initialize);

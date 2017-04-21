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
var transportationMarkers = [];

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

function createSchoolsCtrl() {

    // clear markers if user has clicked on schools control again.
    // this makes sure that old markers are removed in case map bounds have changed
    if (markers.length != 0)
    {
      clearMarkers();
    }
    else
    {
      var service = new google.maps.places.PlacesService(map);

      // icon to display: school
      var icon = {
        url: 'images/school.png',
        anchor: new google.maps.Point(20, 20),
        scaledSize: new google.maps.Size(20, 20)
      };

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
}

function createMarker(place, icon) {
  // Create a marker for each place.

  var marker = new google.maps.Marker({
    map: map,
    icon: icon,
    title: place.name,
    position: place.geometry.location
  });

  // display related info when user clicks on marker
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div><strong>' + place.name + '</strong><br><p>' + place.vicinity + '</p></div>');
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
  };

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

function toggleTransportation() {
  if (transportationMarkers.length == 0) {
    createTransportation();
  } else {
    clearTransportationMarkers();
  }
}

function createTransportation() {
  var request = {
    location: map.getCenter(),
    radius: '40233.6', // 25 miles
    types: ['airport', 'subway_station', 'train_station', 'transit_station']
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, transportCallback);
}

function transportCallback(results, status) {
  var icons = {
    airport: {
      url: 'images/airplane.png',
      anchor: new google.maps.Point(30, 30),
      scaledSize: new google.maps.Size(30, 30)
    },
    subway_station: {
      url: 'images/subway.png',
      anchor: new google.maps.Point(30, 30),
      scaledSize: new google.maps.Size(30, 30)
    },
    train_station: {
      url: 'images/train.png',
      anchor: new google.maps.Point(30, 30),
      scaledSize: new google.maps.Size(30, 30)
    },
    transit_station: {
      url: 'images/bus.png',
      anchor: new google.maps.Point(30, 30),
      scaledSize: new google.maps.Size(30, 30)
    },
    default_trans: {
      url: 'images/default-transport.png',
      anchor: new google.maps.Point(40, 20),
      scaledSize: new google.maps.Size(40, 20)
    }
  };

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createTransportMarker(results[i], icons);
    }
  }
}

function createTransportMarker(place, icons) {
  var type = place.types[0];
  if (type != 'airport' && type != 'subway_station' && type != 'train_station' && type != 'transit_station') {
    type = 'default_trans';
  }
  console.log(type);
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: icons[type]
  });
  transportationMarkers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

function clearTransportationMarkers() {
  // Clear out the old markers.
  transportationMarkers.forEach(function(marker) {
    marker.setMap(null);
  });
  transportationMarkers = [];
}
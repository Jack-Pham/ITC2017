/* map.js */

var map;
var infowindow;
var origin;
var markers = [];

function initMap() {
  origin = new google.maps.LatLng(34.0565, -117.8215);
  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById('map'), {
    center: origin,
    zoom: 10,
    mapTypeControl: false
  });

  initAutocomplete(); // Search bar
  initControls();     // Controls menu on map
}


/* ====== Search Bar ====== */
function initAutocomplete() {
  var input = document.getElementById('addressField');
  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();

    // If user entered invalid input, display message of no available info 
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // Otherwise, zoom to desired place
    map.setCenter(place.geometry.location);
    map.setZoom(17);
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
  });

} // end initAutocomplete()


/* ====== Controls menu ====== */
function initControls() {
  // Use menu div container and call MenuControl() to create a control
  var menuCard = document.getElementById("menu-card");
  var menuControl = new MenuControl(menuCard, map);

  menuCard.index = 1;
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(menuCard); 
}

function MenuControl(controlDiv, map) {
  // Setup the click event listeners
  createSchoolsCtrl();
}


function createSchoolsCtrl() {
  var schoolsCtrl = document.getElementById("m-schools");

  schoolsCtrl.addEventListener('click', function() {
    // clear markers if user has clicked on schools control again.
    // this makes sure that old markers are removed in case map bounds have changed
    if (markers.length != 0)
      clearMarkers();

    var service = new google.maps.places.PlacesService(map);

    // icon to display: school
    var icon = {
      url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    }

    service.nearbySearch({
      location: map.getCenter(),
      radius: 4000,
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
  });
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
    infowindow.setContent(place.name);
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
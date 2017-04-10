/* map.js */

var map;
var origin;
var marker;

function initMap() {
  origin = new google.maps.LatLng(34.0565, -117.8215);

  map = new google.maps.Map(document.getElementById('map'), {
    center: origin,
    zoom: 10
  });

  // Initialize autocomplete search bar
  initAutocomplete();
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
    marker = new google.maps.Marker({ // display marker
      map: map,
      position: place.geometry.location
    });
  })

} // end initAutocomplete()


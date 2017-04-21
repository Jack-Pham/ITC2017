var markers = [];
var infowindow;

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
      }

      service.nearbySearch({
        location: map.getCenter(),
        radius: 8000,
        type: ['school', 'university']
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
      infowindow.setContent('<div style="color: #000;"><strong>' + place.name + '</strong><br><p>' + place.vicinity + '</p></div>');
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

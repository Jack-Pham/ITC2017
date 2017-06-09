var transMarker;
var transportationMarkers = [];

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
    radius: 40233.6, // 25 miles
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
  console.log(place);
  transMarker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: icons[type]
  });
  transportationMarkers.push(transMarker);

  google.maps.event.addListener(transMarker, 'click', function() {
    infowindow.setContent("<div style='color: #000;'><h5>"+place.name+"</h5><p>"+place.vicinity+"</p><p>Rating: "
                            +place.rating+"</p></div>");
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

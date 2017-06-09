var amenitiesMarkers = [];
//var domain = "http://localhost:3000";
$(document).ready(function(){
  $("#textInputModal").keyup(function(){
        getAutoComplete()
  });

  $("#submitModal").click(function(){
      var searchCategory = $("#autoCompleteHeader").text();
      createAmenitiesCtrl(searchCategory);
  })

});



function createAmenitiesCtrl(category) {

     var address = document.getElementById("place-input");
     var url = "/yelp_amenities/" +address.value + "/" + category;
     $.get(url,processData);
}

function getAutoComplete(){
    var textBox = document.getElementById("textInputModal");
    var url = "/yelp_amenities/" +textBox.value;
    $.get(url,manipulateAmenityModal)
}

function manipulateAmenityModal(res, status, xhr){
    $("#autoCompleteHeader").text(res);

}
function processData(data,status,xhr){
    var json = data.body;
    var data = JSON.parse(json);
    var data = data.businesses;
    var results = 15;
    var markers = [];
    var latLng;
    var marker;

    clearAmenitiesMarkers();

    if(data.length < 15){
        results = data.length;
    }

    for (var x = 0; x < results; x++){
        latLng = {lat: data[x].coordinates.latitude, lng: data[x].coordinates.longitude};

        makeMarker(latLng, data[x].name, data[x].distance, data[x].rating, data[x].location, data[x].url);

    }

}

function makeMarker(coordinates, title, distance, rating, location, yelpUrl){
    var distance = distance / 1609.34;
    var distance = distance.toFixed(2);
    var content = '<div style="color: #000000;" ><strong>' + title + '</strong><br>' + location.address1 + '<br>' + location.city +', '+ location.state +
                  '<br> Distance: ' + distance + ' miles' +
                  '<br> Rating: ' + rating +
                  '<br> View on <a href=' + yelpUrl +' target=_blank> yelp</a> </div>'

    marker = new google.maps.Marker({
            position: coordinates,
            content: content,
            map: map
        })

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.content);
            infowindow.open(map, this);
        });
        amenitiesMarkers.push(marker);
}
function clearAmenitiesMarkers(){
    if(amenitiesMarkers != null){
        while(amenitiesMarkers.length > 0){
            amenitiesMarkers[0].setMap(null);
            amenitiesMarkers.shift();
        }
    }
}

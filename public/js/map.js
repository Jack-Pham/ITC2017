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
  var drawingManager = create_draw_manager();
  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event){
      if(drawn_shape != null){
          drawn_shape.overlay.setMap(null);
          drawn_shape = null;
      }
      else if(free_polygon != null){
          free_polygon.setMap(null);
          free_polygon = null;
      }
      drawn_shape = event;
      drawingManager.setDrawingMode(null);
      //trigger a places changed event
      if(markers.length != 0) google.maps.event.trigger(searchBox, 'places_changed');
  });

  //creates custom control of free hand drawing on drawing manager
  create_free_button();

  //creates prototype for free drawing(Got it from DouglasPeuckers Algorithm)
  google.maps.Polygon.prototype.douglasPeucker = function(tolerance){
      var res = null;
      //adjust tolerance depending on the zoom level
      tolerance = tolerance * Math.pow(2, 20 - map.getZoom());
      if(this.getPath() && this.getPath().getLength()){
          var points = this.getPath().getArray();
          var Line = function(p1, p2){
              this.p1 = p1;
              this.p2 = p2;

              this.distanceToPoint = function(point){
                  //calculate slope
                  var m = (this.p2.lat() - this.p1.lat()) / (this.p2.lng() - this.p1.lng());
                  var b = this.p1.lat() - (m * this.p1.lng()), d = [];
                  // distance to the linear equation
                  d.push(Math.abs(point.lat() - (m * point.lng()) - b) / Math.sqrt(Math.pow(m, 2) + 1));
                  // distance to p1
                  d.push(Math.sqrt(Math.pow((point.lng() - this.p1.lng()), 2) + Math.pow((point.lat() - this.p1.lat()), 2)));
                  // distance to p2
                  d.push(Math.sqrt(Math.pow((point.lng() - this.p2.lng()), 2) + Math.pow((point.lat() - this.p2.lat()), 2)));
                  // return the smallest distance
                  return d.sort(function(a, b){
                      return (a - b); //causes an array to be sorted numerically and ascending
                  })[0];
              };
          };

          var douglasPeucker = function(points, tolerance){
              if(points.length <= 2) return [points[0]];
              var returnPoints = [],
                  // make line from start to end
                  line = new Line(points[0], points[points.length - 1]),
                  // find the largest distance from intermediate poitns to this line
                  maxDistance = 0,
                  maxDistanceIndex = 0,
                  p;
              for(var i = 1; i <= points.length - 2; i++){
                  var distance = line.distanceToPoint(points[i]);
                  if(distance > maxDistance){
                      maxDistance = distance;
                      maxDistanceIndex = i;
                  }
              }
              // check if the max distance is greater than our tollerance allows
              if(maxDistance >= tolerance){
                  p = points[maxDistanceIndex];
                  line.distanceToPoint(p, true);
                  // include this point in the output
                  returnPoints = returnPoints.concat(douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
                  // returnPoints.push( points[maxDistanceIndex] );
                  returnPoints = returnPoints.concat(douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
              } else {
                  // ditching this point
                  p = points[maxDistanceIndex];
                  line.distanceToPoint(p, true);
                  returnPoints = [points[0]];
              }
              return returnPoints;
          };
          res = douglasPeucker(points, tolerance);
          // always have to push the very last point on so it doesn't get left off
          res.push(points[points.length - 1]);
          this.setPath(res);
      }
      return this;
  };

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

function create_free_button(){
    var customControlDiv = document.createElement('div');
    CustomControl(customControlDiv, map);
    customControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(customControlDiv);
}

function CustomControl(controlDiv, map) {
    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#ffffff';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.borderColor = '#ccc';
    controlUI.style.height = '25px';
    controlUI.style.marginTop = '4px';
    controlUI.style.marginLeft = '-6px';
    controlUI.style.paddingTop = '1px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to set the map to Home';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '10px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.style.marginTop = '4px';
    controlText.style.fontWeight = 'bold';
    controlText.innerHTML = 'Free';
    controlUI.appendChild(controlText);

    // Setup the click event listeners
    google.maps.event.addDomListener(controlUI, 'click', function () {
        //Free Drawing Listener
        var overlay = new google.maps.OverlayView();
        overlay.draw = function () {};
        overlay.setMap(map);
        var isDrawing = false;
        var polyLine;
        var polygon_array = Array();
        var overlay;
        map.setOptions({draggable: false});
        //listener for mouse down
        google.maps.event.addListenerOnce(map, 'mousedown', function () {
            overlay = new google.maps.OverlayView();
            overlay.draw = function () {};
            overlay.setMap(map);
            isDrawing=true;
            polyLine = new google.maps.Polyline({
                map: map,
                clickable: false
            });
            $("#map").mousemove(function (e) {
                if(isDrawing == true)
                {
                    var pageX = e.pageX;
                    var pageY = e.pageY;
                    if(side_bar_out) pageX -= 300;
                    var point = new google.maps.Point(parseInt(pageX), parseInt(pageY));

                    var latLng = overlay.getProjection().fromContainerPixelToLatLng(point);

                    polyLine.getPath().push(latLng);

                    latLng = String(latLng);
                    latLng=latLng.replace("(","");
                    latLng=latLng.replace(")","");

                    var array_lng =  latLng.split(',');
                    polygon_array.push(new google.maps.LatLng(array_lng[0],array_lng[1])) ;
                }
            });

        });

        //listener for mouse up
        var map_listener = google.maps.event.addListenerOnce(map, 'mouseup', function () {
            isDrawing=false;
            //console.log(polygon_array);
            if(free_polygon != null){
                free_polygon.setMap(null);
                free_polygon = null;
            }
            else if(drawn_shape != null){
                drawn_shape.overlay.setMap(null);
                drawn_shape = null;
            }
            free_polygon = new google.maps.Polygon({
                paths: polygon_array,
                strokeColor: "#0FF000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#0FF000",
                fillOpacity: 0.35,
                editable:true,
                clickable: false,
                geodesic: false

            });

            //simplify polygon
            var douglasPeuckerThreshold = 3; // in meters
            free_polygon.douglasPeucker(360.0 / (2.0 * Math.PI * earthRadius));

            polygon_array=Array();
            free_polygon.setMap(map);
            if(polyLine != null) polyLine.setMap(null);
            map.setOptions({draggable: true});
            if(markers.length != 0) google.maps.event.trigger(searchBox, 'places_changed');
        });
    });

}
// MARKERS
/****************************************************************/

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

/********************Drawing Manager*******************/
function create_draw_manager(){
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.RECTANGLE
            ]
        },
        circleOptions: {
            fillColor: '#0FF000',
            fillOpacity: .2,
            strokeWeight: .1,
            clickable: true,
            editable: true,
            zIndex: 1
        },
        rectangleOptions:{
            fillColor: '#0FF000',
            fillOpacity: .2,
            strokeWeight: .1,
            clickable: true,
            editable: true,
            zIndex: 1
        },
        polygonOptions:{
            fillColor: '#0FF000',
            fillOpacity: .2,
            strokeWeight: .5,
            clickable: true,
            editable: true,
            zIndex: 1
        }
    });
    return drawingManager;
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

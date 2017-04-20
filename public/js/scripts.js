var map;
var request;
var service;
var drawn_shape;
var infoWindow;
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



/********************Map Creator*******************/
function create_map(center){
    return new google.maps.Map(document.getElementById('map'),{
        center: center,zoom:13,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });
}


function push_place_sidebar(place, icon, bounds, side_bar_html){
    places_array.push(place);
    push_marker(place, icon);
    side_bar_html += '<a href="javascript:myclick(' + (markers.length-1) + ')">' + place.name + '<\/a><br>';
    return side_bar_html
}



/********************General*******************/
//Clears markers
function clear_markers(){
    for(var marks in markers){
        markers[marks].setMap(null)
    }
    markers = [];
}

function myclick(i){
    google.maps.event.trigger(markers[i], 'click');
}

/********************SideBar*******************/
function toggle_sidebar(){
    side_bar_out = true;
    document.getElementById("side_bar").style.display="inline";
    document.getElementById("map").style.left="300px";
    document.getElementById("map").style.width="calc(100% - 300px)";
}

/********************Sorting*******************/
function sort_by_price(price){
    if(price == 0) price_filter = false;
    else{
        price_filter = true;
        pricing = price;
    }
    if(rate_filter) sort_by_both(price, rating);
    else price_loop(price);
}

function price_loop(price){
    var side_bar_html = "";
    clear_markers();
    places_array.forEach(function(place){
        var icon = create_icon(place);
        if(price != 0){
            if(place.price_level == price){
                side_bar_html = sort_pusher(place, icon, side_bar_html);
            }
        }
        else{
            side_bar_html = sort_pusher(place, icon, side_bar_html);
        }
    });
    document.getElementById("places").innerHTML = side_bar_html;
}

function sort_by_rating(rate){
    if(rate == 0) rate_filter = false;
    else{
        rate_filter = true;
        rating = rate;
    }
    if(price_filter) sort_by_both(pricing, rate);
    else rating_loop(rate);
}

function rating_loop(rate){
    var side_bar_html = "";
    clear_markers();
    places_array.forEach(function(place){
        var icon = create_icon(place);
        if(rate != 0){
            if(place.rating >= rate){
                side_bar_html = sort_pusher(place, icon, side_bar_html);
            }
        }
        else{
            side_bar_html = sort_pusher(place, icon, side_bar_html);
        }
    });
    document.getElementById("places").innerHTML = side_bar_html;
}

function sort_by_both(price, rate){
    var side_bar_html = "";
    clear_markers();
    places_array.forEach(function(place){
        var icon = create_icon(place);
        if(price != 0 && rate != 0){
            if(place.price_level == price && place.rating >= rate){
                side_bar_html = sort_pusher(place, icon, side_bar_html);
            }
        }
        else if(price == 0){
            if(place.rating >= rate){
                side_bar_html = sort_pusher(place, icon, side_bar_html);
            }
        }
        else if(rate == 0){
            if(place.price_level == price){
                side_bar_html = sort_pusher(place, icon, side_bar_html);
            }
        }
        else side_bar_html = sort_pusher(place, icon, side_bar_html);
    });
    document.getElementById("places").innerHTML = side_bar_html;
}



$(document).ready(function(){
    var x = document.getElementById('showWeather');
    x.style.display = 'none';
    var place = readCookie('location');
    $("#place-input").val(place);
    getWeather();
    $('#submitWeather').click(function(){
      getWeather();
      if (x.style.display === 'none') {
        x.style.display = '';
      } else {
          x.style.display = 'none';
      }
    })
});

function getWeather(){
    var city = $("#place-input").val();
    createCookie('location',city,4);
    if (city != ''){
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + "&cnt=6" + "&units=imperial"
            + "&APPID=2916cc1ba04525c0b8623bc99bdadc30",
            type: "GET",
            dataType: "json",
            success: function(data){
                console.log(data);
                var widgetTitle = showTitle(data);
                $("#showTitle").html(widgetTitle);

                var day1 = showday1(data);
                $("#showday1").html(day1);
                var widget1 = show1(data);
                $("#show1").html(widget1);

                var day2 = showday2(data);
                $("#showday2").html(day2);
                var widget2 = show2(data);
                $("#show2").html(widget2);

                var day3 = showday3(data);
                $("#showday3").html(day3);
                var widget3 = show3(data);
                $("#show3").html(widget3);

                var day4 = showday4(data);
                $("#showday4").html(day4);
                var widget4 = show4(data);
                $("#show4").html(widget4);
                //$("#place-input").val('');
            }
        });
    }
    else{
        $("#error").hmtl('Field cannot be empty');
    }
}

function showTitle1(data){
  return '<div class="container">' +
         '<div class="module-header"> ' +
         '<h2><strong>Weather Forecast</strong></h2>' +
         '<img src="images/divider.png" alt="" /> ' +
         '<p>Current weather for ' + data.city.name + ', ' + data.city.country + '</p></div></div>' +

        '<div class="slider-nav slider-nav-properties-featured">' +
        '<span class="slider-prev"><i class="fa fa-angle-left"></i></span>' +
        '<span class="slider-next"><i class="fa fa-angle-right"></i></span></div>';
}

function showTitle(data){
  return '<h5 style="color: #F0FFFF">Weather Forecast</h5>';
}

function showday1(data){
  return timeConverter(data.list[0].dt);
}
function showday2(data){
  return timeConverter(data.list[1].dt);
}
function showday3(data){
  return timeConverter(data.list[2].dt);
}
function showday4(data){
  return timeConverter(data.list[3].dt);
}

function show1(data){
  return "<p><strong>Weather</strong>: <img src='http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png'>"
         + data.list[0].weather[0].main + "</p>" +
         "<p><strong>Description</strong>: " + data.list[0].weather[0].description + "</p>" +
         "<p><strong>Day Temperature</strong>: " + Math.round(data.list[0].temp.day) + "&deg;F</p>" +
         "<p><strong>Pressure</strong>: " + data.list[0].pressure + " hPa</p>" +
         "<p><strong>Humidity</strong>: " + data.list[0].humidity + "%</p>" +
         "<p><strong>Minimum Temperature</strong>: " + Math.round(data.list[0].temp.min) + "&deg;F</p>" +
         "<p><strong>Maximum Temperature</strong>: " + Math.round(data.list[0].temp.max) + "&deg;F</p>" +
         "<p><strong>Wind Speed</strong>: " + data.list[0].speed + " m/h</p>" +
         "<p><strong>Wind Direction</strong>: " + data.list[0].deg + "&deg;</p>";
}

function show2(data){
  return "<p><strong>Weather</strong>: <img src='http://openweathermap.org/img/w/" + data.list[1].weather[0].icon + ".png'>"
         + data.list[1].weather[0].main + "</p>" +
         "<p><strong>Description</strong>: " + data.list[1].weather[0].description + "</p>" +
         "<p><strong>Day Temperature</strong>: " + data.list[1].temp.day + "&deg;F</p>" +
         "<p><strong>Pressure</strong>: " + data.list[1].pressure + " hPa</p>" +
         "<p><strong>Humidity</strong>: " + data.list[1].humidity + "%</p>" +
         "<p><strong>Minimum Temperature</strong>: " + data.list[1].temp.min + "&deg;F</p>" +
         "<p><strong>Maximum Temperature</strong>: " + data.list[1].temp.max+ "&deg;F</p>" +
         "<p><strong>Wind Speed</strong>: " + data.list[1].speed + " m/h</p>" +
         "<p><strong>Wind Direction</strong>: " + data.list[1].deg + "&deg;</p>";
}

function show3(data){
  return "<p><strong>Weather</strong>: <img src='http://openweathermap.org/img/w/" + data.list[2].weather[0].icon + ".png'>"
         + data.list[2].weather[0].main + "</p>" +
         "<p><strong>Description</strong>: " + data.list[2].weather[0].description + "</p>" +
         "<p><strong>Day Temperature</strong>: " + data.list[2].temp.day + "&deg;F</p>" +
         "<p><strong>Pressure</strong>: " + data.list[2].pressure + " hPa</p>" +
         "<p><strong>Humidity</strong>: " + data.list[2].humidity + "%</p>" +
         "<p><strong>Minimum Temperature</strong>: " + data.list[2].temp.min + "&deg;F</p>" +
         "<p><strong>Maximum Temperature</strong>: " + data.list[2].temp.max+ "&deg;F</p>" +
         "<p><strong>Wind Speed</strong>: " + data.list[2].speed + " m/h</p>" +
         "<p><strong>Wind Direction</strong>: " + data.list[2].deg + "&deg;</p>";
}

function show4(data){
  return "<p><strong>Weather</strong>: <img src='http://openweathermap.org/img/w/" + data.list[3].weather[0].icon + ".png'>"
         + data.list[3].weather[0].main + "</p>" +
         "<p><strong>Description</strong>: " + data.list[3].weather[0].description + "</p>" +
         "<p><strong>Day Temperature</strong>: " + data.list[3].temp.day + "&deg;F</p>" +
         "<p><strong>Pressure</strong>: " + data.list[3].pressure + " hPa</p>" +
         "<p><strong>Humidity</strong>: " + data.list[3].humidity + "%</p>" +
         "<p><strong>Minimum Temperature</strong>: " + data.list[3].temp.min + "&deg;F</p>" +
         "<p><strong>Maximum Temperature</strong>: " + data.list[3].temp.max+ "&deg;F</p>" +
         "<p><strong>Wind Speed</strong>: " + data.list[3].speed + " m/h</p>" +
         "<p><strong>Wind Direction</strong>: " + data.list[3].deg + "&deg;</p>";
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = month + ' ' + date + ', ' + year;
  return time;
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

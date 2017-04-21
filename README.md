Trullow (ITC 2017)
========

## First Time Installation
1) Download and install node.js [https://nodejs.org/en/]
- You can check if the installation was successful with the commands `node -v` and `npm -v`
- The commands print the version number
2) Install Bower with `npm install -g bower`

## Daily Workflow
1) `git pull`
2) `npm install`
3) `bower install`
4) Run server

## How to Run Server
- Through IDE: Run > Run [If this doesn't work, try 'Edit Configurations' > JavaScript file: bin/www]
- Through Command Line: `node bin/www`
- App will be running on port '3000'. Check out app at: 'localhost:3000' in the browser

## Features

### Weather
Utilized Openweathermap API, and created `weather.js` to make Ajax request to the server and return data to the front end.
The map in the front end uses a Bootstrap Carrousel modal to display weather information for the next following days, including:
- weather
- description
- day temperature
- pressure
- humidity
- minimum temperature
- maximum temperature
- wind speed
- wind direction

### School
`school.js` contains the createSchoolsCtrl() function called from the home page to display the places labeled as "school" or "university" on the map. The Places library from the Google Maps API is used to make a search for the nearby places within 8000 meters from the given current map's viewpoint. 

```js
var service = new google.maps.places.PlacesService(map);

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
```

### Crime

### Amenities
`yelp.js` created to expose a REST interface used to simplify calls to the Yelp API from the front end `amenities.js`. Used information returned from the API call such as ratings, distance, and address to populate map. An user is prompted a pop up modal to input the desired amenity to search for. The application automatically displays a suggested amenity option based on the user's input, and displays appropriates markers on the map with given results. When marker is clicked, it displays the following information of the given location:
- title
- address
- distance (from input address)
- rating (range 1-5)
- an external url to Yelp

### Transportation
Google Maps API 

## Technologies Used
Open sources used so far:
* [Google Maps API](https://developers.google.com/maps/documentation/javascript/) - Customize maps with your own content and imagery
* [Open Weather Map](http://openweathermap.org/api) - A simple, clear and free weather API
* [Spot Crime](https://github.com/contra/spotcrime) - API client for crime statistics 
* [Yelp Fusion](https://www.yelp.com/developers) - Yelp API to unlock a wealth of content and data from over 50 million businesses
* [Bower](https://bower.io/) - A package manager for the web

## Contributors
* [Cesar Gonzalez](https://github.com/gonzalez2) 
* [Nelly Liu Peng](https://github.com/nliupeng)
* [Oscar Nevarez](https://github.com/OscarNevarez)
* [Christine Nguyen](https://github.com/c-nguyen)
* [Thong Pham](https://github.com/Jack-Pham)

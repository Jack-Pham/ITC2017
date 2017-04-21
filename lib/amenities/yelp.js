'use strict';


// Place holders for Yelp Fusion's OAuth 2.0 credentials. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const clientId = 'jnPs_ncntrzz_3hAV6ejtA';
const clientSecret = 'PCKbHUrjYNm3dIyztZU2Xv0UItjqmS03uNvcNPDDx8AMEPRgQbEdY1Xom07l8rFk';
const yelp = require('yelp-fusion');
var express = require("express");
var fs = require("fs");

var categoryToAliasDict = {};

var app = express();
var client;


setClient();
setDictionary();

app.get('/yelp_amenities/:location/:category', function(req, res){
    var response = search(req.params.location, req.params.category, function(response){
        res.setHeader('Content-Type', 'application/json');
        res.send(response);
    });
});

app.get('/yelp_amenities/:text', function(req, res){
    var response = autoComplete(req.params.text, function(response){
        res.send(response);
    });
});


function setClient() {
    yelp.accessToken(clientId, clientSecret).then(response => {
        console.log('retrieved access token: ' + response.jsonBody.access_token);
        client = yelp.client(response.jsonBody.access_token);
        console.log(client);
        }).catch(e => {
            console.log(e);
        });
}

function setDictionary(){
    var categoriesToAliasArray = JSON.parse(fs.readFileSync('./lib/amenities/categories.json','utf8'));

    for(var x = 0; x < categoriesToAliasArray.length; x++){
        categoryToAliasDict[categoriesToAliasArray[x].title] = categoriesToAliasArray[x].alias;
    }
    
    console.log("Yelp.js => setDictionary => JSON Processed");
}

function categoryToAlias(category){
    return categoryToAliasDict[category]
}

function autoComplete(text, callback) {
    client.autocomplete({
        text: text
    }).then(response => {
        callback(response.jsonBody.categories[0].title);
    }).catch(e => {
        console.log(e);
    })
}

//feed location as address and term for search results,
function search(location, category, callback){
    var alias = categoryToAlias(category);

    if(alias == null){
        callback(Error);
    }

    console.log("Yelp.js => search => yelp get: params location: " + location + " and category: " + alias);
    client.search({
        location: location,
        term: alias,
        category: alias
    }).then(response => {
        callback(response);
}).catch(e => {
        console.log(e);
});
}

module.exports = app;

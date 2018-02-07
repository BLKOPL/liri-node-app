
//packages
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//save command line actions
var argv = process.argv;
var action = argv[2];

var input = "";

for (var i = 3; i < argv.length; i++) {
  input = input + "+" + argv[i];
}

switch (action) {
  case "my-tweets":
    Tweets();
    break;
  case "spotify-this-song":
    Song();
    break;
  case "movie-this":
    Movie();
    break;
  case "do-what-it-says":
    Random();
    break;
  case undefined:
    Directions();
}

// function definitions

function Song() {
  if (input === "") {
    spotify.search({
      type: 'track',
      query: "The Sign"
    }, function(err, data) {
      if (err) {
        return console.log("Error: " + err);
      }
      // console.log(JSON.stringify(data, null, 2));
      console.log("===========================")
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song name: " + data.tracks.items[0].name);
      console.log("Preview: " + data.tracks.items[0].artists[0].external_urls.spotify);
      console.log("Album name: " + data.tracks.items[0].album.name);
      console.log("===========================");
    });
  } else {
    spotify.search({
      type: 'track',
      query: input
    }, function(err, data) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      // console.log(JSON.stringify(data, null, 2));
      console.log("===========================")
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song name: " + data.tracks.items[0].name);
      console.log("Preview: " + data.tracks.items[0].artists[0].external_urls.spotify);
      console.log("Album name: " + data.tracks.items[0].album.name);
      console.log("===========================");
    });
  };
};

function Tweets() {
  client.get('statuses/user_timeline', {
    count: 20
  }, function(error, tweets) {
    if (error) throw error;
    for (var i = 0; i < tweets.length; i++) {
      console.log(tweets[i].text);
      console.log("===========================");
    }
  });
};

function Movie() {
  if (input === "") {
    var queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";
  } else {
    queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";
  }
  // console.log(queryUrl);
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("===========================");
      console.log("Movie title: " + JSON.parse(body).Title);
      console.log("Date released: " + JSON.parse(body).Year);
      // check if IMDB rating is available
      if (JSON.parse(body).Ratings[0] === undefined) {
        console.log("IMDB Rating: N/A")
      } else {
        console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
      }
      // check if Rotten Tomatoes rating is available
      if (JSON.parse(body).Ratings[1] === undefined) {
        console.log("Rotten Tomatoes Rating: N/A")
      } else {
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      }
      console.log("Production Locations: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("===========================");
    } else {
      console.log('error:', error);
    }
  });
}

function Random() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    console.log(dataArr);
    action = dataArr[0];
    input = dataArr[1];
    switch (action) {
      case "spotify-this-song":
        showSong();
        break;
      case "movie-this":
        showMovie();
        break;
    }
  });
}

function Directions() {
  console.log("****** Use node.js to acess twitter, OMDB and spotify functions");
  console.log("****** Use keywords: 'movie-this <movie name here>', 'spotify-this-song <movie name here>', 'my-tweets', 'do-what-it-says' to get started!");
}

fs.appendFile("log.txt", action + input + "\n", function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Query added to log!");
  }
});

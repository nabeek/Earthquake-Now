//add event listener for search button to capture input value
//assign to variable

//make api call to get geocode lat & lon

//use lat & lon to make new api call to USGS API
var startTime = moment().format("YYYY-MM-DD");
var endTime = moment().add(1, "days").format("YYYY-MM-DD");
var longitude = "-112"; //get lon from geocode
var latitude = "40"; //get lat from geocode
var maxRadius = "180";
var magnitude = "";
var minMag = 3;
var limit = 10;
var queryURL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"
+"&starttime="+startTime
+"&endtime="+endTime
+"&longitude="+longitude
+"&latitude="+latitude
+"&maxradius="+maxRadius
+"&orderby=time"
+"&minmagnitude="+minMag
+"&limit="+limit;

$.ajax({
    url : queryURL,
    method : "GET"
}).then(function(response){
    //set mag variable
    magnitude = response.features[0].properties.mag;
    //set actual date & time
    console.log(response);
}).catch();

//define parameters we'll use for distance from searched area 
//maybe use a dropdown selector with distance options

//color code magnitude based on severity


//format date & time with moment.js

//use input or lat & lon to make api call for News Articles

//print seismic activity to related boxes
//print news data to related news boxes
//icons for siesmic activity

//add "read more" functionality / link to source or expand

//save recent searches to localStorage 

//if no recent siesmic activity
//then show a no activity box


//add footer
//add News API attribution
//link project members name's & githubs
//copyright with a moment date

//final styling


let searchInputTerm = ""

// Event listener on Search Button
$('#search-button').on('click', function () {
    searchInputTerm = $('#search-input').val()
    console.log(searchInputTerm)
})

function getCoordinates() {

    searchInputTerm = searchInputTerm.split(" ").join("+");

    var queryURL = "https://us1.locationiq.com/v1/search.php?key=5506fbb5d84090&q=" + searchInputTerm + "&format=json";

    $.ajax ({
        url: queryURL,
        method: "GET"
        }).then(function(response) {

            console.log(response)
     
            var response = response[0];         // Pull top response in the API response
            var lat = response.lat;
            var lon = response.lon;

            console.log(lat);
            console.log(lon);
        })
};
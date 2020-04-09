//add event listener for search button to capture input value
//assign to variable

//make api call to get geocode lat & lon

let searchInputTerm = ""
let lat = ""
let lon = ""

// Event listener on Search Button
$('#search-button').on('click', function () {
    searchInputTerm = $('#search-input').val().trim()
    console.log(searchInputTerm)

    getCoordinates()
    // printSeismicElements()
})

function getCoordinates() {

    // ssearchInputTerm = searchInputTerm.split(" ").join("+");

    var queryURLGeo = "https://us1.locationiq.com/v1/search.php?key=5506fbb5d84090&q=" + searchInputTerm + "&format=json";

    $.ajax({
        url: queryURLGeo,
        method: "GET"
    }).then(function (response) {

        var response = response[0];         // Pull top response in the API response
        lat = response.lat;
        lon = response.lon;

        getSeismicData(lat, lon)
    }).catch(function (error) {
        console.log(error)
    })
};

function getSeismicData(lat, lon) {
    //get lon from geocode
    var longitude = lon;
    //get lat from geocode
    var latitude = lat;

    var maxRadiuskm = 180;
    var magnitude = "";
    var minMag = 3;
    var limit = 5;

    var queryURLUSGS = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"
        + "&longitude=" + longitude
        + "&latitude=" + latitude
        + "&maxradiuskm=" + maxRadiuskm
        + "&orderby=time"
        + "&minmagnitude=" + minMag
        + "&limit=" + limit;

    console.log(queryURLUSGS)

    $.ajax({
        url: queryURLUSGS,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        //set mag variable
        magnitude = response.features[0].properties.mag;
        //set actual date & time
        console.log(response);




    }).catch(function (error) {
        console.log(error)
    });
}

// Print seismic activity boxes
function printSeismicElements() {
    // reset seismic boxes
    resetSeismicBoxes()

    let newSeismicDiv = $('<div>').addClass('box activity-box activity-high is-flex')
    let newSeismicSubDiv = $('<div>').addClass('seismic-info')
    let newSeismicH4 = $('<h4>').addClass('city-name title is-4')
    let newSeismicPLoc = $('<p>').addClass('date content is-size-6')
    let newSeismicPDate = $('<p>').addClass('date content is-size-6')
    let newSeismicH5 = $('<h5>').addClass('magnitude content is-size-2')

    // *** add search tem location
    newSeismicH4.text('Salt Lake City')
    newSeismicSubDiv.append(newSeismicH4)
    // *** add event location
    newSeismicPLoc.text('72km WSW of Challis, Idaho')
    newSeismicSubDiv.append(newSeismicPLoc)
    // *** add event date & time
    newSeismicPDate.text('3/31/2020 12:35 PM')
    newSeismicSubDiv.append(newSeismicPDate)

    newSeismicDiv.append(newSeismicSubDiv)

    // *** add magnitude rating
    newSeismicH5.text('5.8')
    newSeismicDiv.append(newSeismicH5)

    $('#seismic-container').append(newSeismicDiv)
}

// Reset seismic activity boxes
function resetSeismicBoxes() {
    if ($('#seismic-container').has('div')) {
        $('#seismic-container > div').remove()
    }
}


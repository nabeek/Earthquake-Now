//add event listener for search button to capture input value
//assign to variable

//make api call to get geocode lat & lon

let searchInputTerm = ""
let lat = ""
let lon = ""

// Event listener on Search Button
$('#search-button').on('click', function () {
    searchInputTerm = $('#search-input').val().trim().toLowerCase()
    console.log(searchInputTerm)

    getCoordinates()
})

function getCoordinates() {

    var queryURLGeo = "https://us1.locationiq.com/v1/search.php?key=5506fbb5d84090&q=" + searchInputTerm + "&format=json";

    $.ajax({
        url: queryURLGeo,
        method: "GET"
    }).then(function (response) {

        // Pull top response in the API response
        var response = response[0];
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

    $.ajax({
        url: queryURLUSGS,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        // reset seismic boxes
        resetSeismicBoxes()

        $('#near').html('<p>Near ' + searchInputTerm + '</p>')

        let dataArray = response.features

        for (let i = 0; i < dataArray.length; i++) {

            let newSeismicDiv = $('<div>').addClass('box activity-box activity-high is-flex')
            let newSeismicSubDiv = $('<div>').addClass('seismic-info')
            let newSeismicH4 = $('<h4>').addClass('city-name title is-4')
            let newSeismicPDate = $('<p>').addClass('date content is-size-6')
            let newSeismicH5 = $('<h5>').addClass('magnitude content is-size-2')
            let eventTime = moment(response.features[i].properties.time).format('MMMM Do, YYYY h:mm a')

            // Color code event box based on magnitude value
            if (response.features[i].properties.mag >= 7.0) {
                newSeismicDiv.addClass("activity-high");
            } else if (response.features[i].properties.mag >= 5.0 && response.features[i].properties.mag < 7.0) {
                newSeismicDiv.addClass("activity-med");
            } else if (response.features[i].properties.mag < 5.0) {
                newSeismicDiv.addClass("activity-low");
            };

            newSeismicH4.text(response.features[i].properties.place)
            newSeismicSubDiv.append(newSeismicH4)

            newSeismicPDate.text(eventTime)
            newSeismicSubDiv.append(newSeismicPDate)

            newSeismicDiv.append(newSeismicSubDiv)


            newSeismicH5.text(response.features[i].properties.mag)
            newSeismicDiv.append(newSeismicH5)

            $('#seismic-container').append(newSeismicDiv)
        }
    }).catch(function (error) {
        console.log(error)
    });
}

// Reset seismic activity boxes
function resetSeismicBoxes() {
    if ($('#seismic-container').has('div')) {
        $('#seismic-container > div').remove()
        $('#near > p').remove()
    }
}


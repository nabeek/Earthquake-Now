let searchInputTerm = ""
let stateInput = ""
let searchLocation = ""

init()

// Event listener on Search Button
$('#search-button').on('click', function () {

    if ($('#search-input').val() === "" || $('#state-input option:selected').val() === "") {
        $('#search-field').effect('shake')
        return
    } else {
        searchInputTerm = $('#search-input').val().trim().toLowerCase()
        stateInput = $('#state-input option:selected').val()
    }

    getCoordinates()
    getNewsArticles();
    storeLocation()

})

// Search with ENTER
$("#search-input").on("keyup", function(event) {
    if (event.keyCode === 13) {
        $("#search-button").click();
    }
})

$("#state-input").on("keyup", function(event) {
    if (event.keyCode === 13) {
        $("#search-button").click();
    }
})

function getCoordinates() {

    var queryURLGeo = "https://us1.locationiq.com/v1/search.php?key=5506fbb5d84090"
        + "&city=" + searchInputTerm
        + "&state=" + stateInput
        + "&format=json"

    $.ajax({
        url: queryURLGeo,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        // Pull top response in the API response
        var response = response[0];
        let lat = response.lat;
        let lon = response.lon;

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

        $('#near').html('<p>Search Results for ' + searchInputTerm + '</p>')

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

            let seismicDistance = parseInt((response.features[i].properties.place).split("km")[0]) * 0.621371          // Calculates km to miles
            let seismicLocation = ((response.features[i].properties.place).split("km")[1])          // Stores cardinal direction
            newSeismicH4.text(seismicDistance.toFixed(1) + " mi " + seismicLocation)
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

// retreive previous search from local storage
function init() {
    let storedLocation = localStorage.getItem('searchLocation')
    let parsedLocation = JSON.parse(storedLocation)

    if (parsedLocation != null) {
        searchInputTerm = parsedLocation
        getCoordinates()
        getNewsArticles()
    } else {
        searchInputTerm = ""
    }
}

// save search to local storage
function storeLocation() {
    localStorage.setItem('searchLocation', JSON.stringify(searchInputTerm))
}

// Reset seismic activity boxes
function resetSeismicBoxes() {
    if ($('#seismic-container').has('div')) {
        $('#seismic-container > div').remove()
        $('#near > p').remove()
    }
}

//get news articles API
function getNewsArticles() {
    var apikey = "471254efa5b94cdd9aa11434a2d472f4";
    var countryCode = "us"; //get country code from USGS response
    var searchTerm = searchInputTerm.replace(/ /g, "+");
    var queryURLNewsAPI = "https://newsapi.org/v2/everything"
        + "?q=earthquake+" + searchTerm
        + "&apiKey=" + apikey;

    console.log(queryURLNewsAPI)
    console.log(searchTerm)


    $.ajax({
        url: queryURLNewsAPI,
        method: "GET"
    }).then(function (response) {
        console.log("NewsAPI :");
        console.log(response);

        //print articles to HTML
        for (var i = 0; i < 3; i++) {
            var headline = response.articles[i].title;
            var date = moment(response.articles[i].publishedAt).calendar();
            var source = response.articles[i].source.name;
            var content = response.articles[i].description;

            $("#title" + i).text(headline);
            $("#date" + i).text(date + " - " + source);
            $("#content" + i).text(content);
        }

    }).catch(function (error) {
        console.log(error)
    });
}

// Auto-update copyright year

$("#copyright-year").text(moment().format("YYYY"))
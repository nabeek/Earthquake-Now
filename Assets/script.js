let searchInputTerm = ""
let searchLocation = ""

init()

// Event listener on Search Button
$('#search-button').on('click', function () {

    if ($('#search-input').val() === "") {
        return
    } else {
        searchInputTerm = $('#search-input').val().trim().toLowerCase()
    }

    getCoordinates()
    getNewsArticles();
    storeLocation()

})

function getCoordinates() {

    var queryURLGeo = "https://us1.locationiq.com/v1/search.php?key=5506fbb5d84090&q=" + searchInputTerm + "&format=json";

    $.ajax({
        url: queryURLGeo,
        method: "GET"
    }).then(function (response) {

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
        // reset seismic boxes
        resetSeismicBoxes()

        $('#near').html('<p>Near ' + searchInputTerm + '</p>')

        let dataArray = response.features

        let newSeismicDiv = $('<div>').addClass('box activity-box activity-high is-flex')
        let newSeismicSubDiv = $('<div>').addClass('seismic-info')
        let newSeismicH4 = $('<h4>').addClass('city-name title is-4')
        let newSeismicPDate = $('<p>').addClass('date content is-size-6')
        let newSeismicH5 = $('<h5>').addClass('magnitude content is-size-2')

        if (dataArray.length > 0) {

            for (let i = 0; i < dataArray.length; i++) {
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
        } else {
            newSeismicH4.text('No Recent Activity Found')
            newSeismicSubDiv.append(newSeismicH4)
            newSeismicH5.text('-.--')

            newSeismicDiv.append(newSeismicSubDiv)
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

    console.log(searchTerm)


    $.ajax({
        url: queryURLNewsAPI,
        method: "GET"
    }).then(function (response) {
        console.log("NewsAPI :");
        console.log(response);

        //print articles to HTML
        for (var i = 0; i < 3; i++) {
            console.log(response.articles[i])
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

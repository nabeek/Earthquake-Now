let cityInput = ""
let stateInput = ""
let searchLocation = ""

init()

// Event listener on Search Button
$('#search-button').on('click', function () {

    if ($('#search-input').val() === "" || $('#state-input option:selected').val() === "") {
        $('#search-field').effect('shake')
        return
    } else {
        cityInput = $('#search-input').val().trim().toLowerCase()
        stateInput = $('#state-input option:selected').val()
    }

    changeLayout()
    getCoordinates()
    getNewsArticles();
    storeLocation()

})

// Search with ENTER
$("#search-input").on("keyup", function (event) {
    if (event.keyCode === 13) {
        $("#search-button").click();
    }
})

$("#state-input").on("keyup", function (event) {
    if (event.keyCode === 13) {
        $("#search-button").click();
    }
})

function getCoordinates() {

    var queryURLGeo = "https://us1.locationiq.com/v1/search.php?key=5506fbb5d84090"
        + "&city=" + cityInput
        + "&state=" + stateInput
        + "&format=json"

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

    var maxRadiuskm = 160;
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

        $('#near').html('<p>Search Results for ' + cityInput + ', ' + stateInput + '</p>')

        let dataArray = response.features

        let newSeismicDiv
        let newSeismicSubDiv
        let newSeismicH4
        let newSeismicPDate
        let newSeismicH5

        if (dataArray.length > 0) {

            for (let i = 0; i < dataArray.length; i++) {
                newSeismicDiv = $('<div>').addClass('box activity-box activity-high is-flex')
                newSeismicSubDiv = $('<div>').addClass('seismic-info')
                newSeismicH4 = $('<h4>').addClass('city-name title is-4')
                newSeismicPDate = $('<p>').addClass('date content is-size-6')
                newSeismicH5 = $('<h5>').addClass('magnitude content is-size-2')
                eventTime = moment(response.features[i].properties.time).format('MMMM Do, YYYY h:mm a')

                // Color code event box based on magnitude value
                if (response.features[i].properties.mag >= 7.0) {
                    newSeismicDiv.addClass("activity-high");
                } else if (response.features[i].properties.mag >= 5.0 && response.features[i].properties.mag < 7.0) {
                    newSeismicDiv.addClass("activity-med");
                } else if (response.features[i].properties.mag < 5.0) {
                    newSeismicDiv.addClass("activity-low");
                };

                // Update content & append elements
                newSeismicH4.text(response.features[i].properties.place)
                newSeismicSubDiv.append(newSeismicH4)

                newSeismicPDate.text(eventTime)
                newSeismicSubDiv.append(newSeismicPDate)

                newSeismicDiv.append(newSeismicSubDiv)

                newSeismicH5.text(response.features[i].properties.mag)
                newSeismicDiv.append(newSeismicH5)

                $('#seismic-container').append(newSeismicDiv)

                // Calculates km to miles
                let seismicDistance = parseInt((response.features[i].properties.place).split("km")[0]) * 0.621371
                // Stores cardinal direction       
                let seismicLocation = ((response.features[i].properties.place).split("km")[1])
                newSeismicH4.text(seismicDistance.toFixed(1) + "mi " + seismicLocation)
                newSeismicSubDiv.prepend(newSeismicH4)

            }
        } else {
            newSeismicDiv = $('<div>').addClass('box activity-box activity-high is-flex')
            newSeismicSubDiv = $('<div>').addClass('seismic-info')
            newSeismicH4 = $('<h4>').addClass('city-name title is-4')
            newSeismicH5 = $('<h5>').addClass('magnitude content is-size-2')

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

function hide(el) {
    $(el).addClass("hide");
}

function show(el) {
    $(el).removeClass("hide");
}

//get news articles API
function getNewsArticles() {
    var apikey = "471254efa5b94cdd9aa11434a2d472f4";
    var countryCode = "us"; //get country code from USGS response
    var searchTerm = cityInput.replace(/ /g, "+") +",+"+ stateInput.replace(/ /g, "+");
    var queryURLNewsAPI = "https://newsapi.org/v2/everything"
        + "?q='earthquake'+AND+" + searchTerm
        + "&language=en"
        + "&apiKey=" + apikey;

    $.ajax({
        url: queryURLNewsAPI,
        method: "GET"
    }).then(function (response) {
        resetNewsBoxes()
        
        if (response.totalResults != 0) {

            for (i = 0; i < 3; i++) {
                var headline = response.articles[i].title;
                var date = moment(response.articles[i].publishedAt).calendar();
                var source = response.articles[i].source.name;
                var content = response.articles[i].description;
                var readMore = response.articles[i].url;
                                
                newNewsDiv = $('<div>').addClass("box news-box").attr("id", "news-box-"+i)
                newNewsTitle = $('<h5>').addClass("title is-5").attr("id", "title"+i)
                newNewsDate = $('<h6>').addClass("date is-size-7").attr("id", "date"+i)
                newNewsContent = $("<span>").addClass("content").attr("id", "content"+i)
                newNewsLink = $("<span>").addClass("is-italic has-text-link").attr("id", "read-more-"+i)
                newNewsReadMore = $("<a>").attr("href", readMore).attr("target", "_blank")

                newNewsTitle.text(headline)
                newNewsDiv.append(newNewsTitle)

                newNewsDate.text(date + " - " + source)
                newNewsDiv.append(newNewsDate)

                newNewsContent.text(content)
                newNewsDiv.append(newNewsContent)

                newNewsReadMore.text(" Read more")
                newNewsLink.append(newNewsReadMore)
                newNewsDiv.append(newNewsLink)

                $('#news-container').append(newNewsDiv)
            }
        } else {
                newNewsDiv = $('<div>').addClass("box news-box").attr("id", "news-box-0")
                newNewsTitle = $('<h5>').addClass("title is-5").attr("id", "title0")

                newNewsTitle.text("There is no recent news for this location")
                newNewsDiv.append(newNewsTitle)

                $('#news-container').append(newNewsDiv)                
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
        cityInput = parsedLocation[0]
        stateInput = parsedLocation[1]
        changeLayout()
        getCoordinates()
        getNewsArticles()
    } else {
        cityInput = ""
    }
}

// save search to local storage
function storeLocation() {
    let cityState = new Array(cityInput, stateInput)
    localStorage.setItem('searchLocation', JSON.stringify(cityState))
}

function changeLayout() {
    $('#welcome').addClass('hide')
    $('#initialState').removeClass('hide')
}

// Reset seismic activity boxes
function resetSeismicBoxes() {
    if ($('#seismic-container').has('div')) {
        $('#seismic-container > div').remove()
        $('#near > p').remove()
    }
}
// Reset news activity boxes
function resetNewsBoxes() {
    if ($('#news-container').has('div')) {
        $('#news-container > div').remove()
    }
}

// Auto-update copyright year
$("#copyright-year").text(moment().format("YYYY"))


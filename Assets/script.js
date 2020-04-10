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

function getCoordinates() {

    var queryURLGeo = "https://us1.locationiq.com/v1/search.php?key=5506fbb5d84090"
        + "&city=" + searchInputTerm
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


// Convert state intials to full state names
// convertRegion("UT",TO_NAME);    // Returns 'Utah'

const TO_NAME = 1;
const TO_ABBREVIATED = 2;

function convertRegion(input, to) {
    var states = [
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['American Samoa', 'AS'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['District Of Columbia', 'DC'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Guam', 'GU'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Marshall Islands', 'MH'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Puerto Rico', 'PR'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['US Virgin Islands', 'VI'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == TO_ABBREVIATED) {
        input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        for (state of states) {
            if (state[0] == input) {
                return (state[1]);
            }
        }
    } else if (to == TO_NAME) {
        input = input.toUpperCase();
        for (state of states) {
            if (state[1] == input) {
                return (state[0]);
            }
        }
    }
};
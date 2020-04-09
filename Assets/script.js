//add event listener for search button to capture input value
//assign to variable

//make api call to get geocode lat & lon
//use lat & lon to make new api call to USGS API
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
    searchInputTerm = $('#search-input').val().trim()
    console.log(searchInputTerm)

    getCoordinates()
    // printSeismicElements()
})

function getCoordinates() {

    // ssearchInputTerm = searchInputTerm.split(" ").join("+");

    var queryURL = "https://us1.locationiq.com/v1/search.php?key=5506fbb5d84090&q=" + searchInputTerm + "&format=json";
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        console.log(response)

        var response = response[0];         // Pull top response in the API response
        var lat = response.lat;
        var lon = response.lon;

        console.log(lat);
        console.log(lon);
    })
};

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


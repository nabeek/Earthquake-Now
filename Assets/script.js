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
    searchInputTerm = $('#search-input').val()
    console.log(searchInputTerm)
})
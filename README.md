### Project Name

# Earthquake Now

<img src="./Assets/img/Earthquake Now.png" alt="Earthquake Now Image" width="600px">

> This application allows the user to quickly find up-to-date seismic data and related news articles for a specified location. This provides the user with valuable information to make informed decisions.

- [View Site](https://nabeek.github.io/Earthquake-Now/)

---

### Table of Contents

Your section headers will be used to reference location of destination.

- [Description](#description)
- [How To Use](#how-to-use)
- [Installation](#installation)
- [Technologies](#technologies)
- [Roadmap](#roadmap)
- [Code Samples](#code-samples)
- [References](#references)
- [License](#license)
- [Contributors](#contributors)

---

## Description

This responsive application allows the user to view up-to-date seismic data and related news articles for a specified location that is defined by the user. 

Seismic data that is returned includes the epicenter with it's distance from the user defined search location, the magnitude and the date and time of the event. The application also provides visual feedback by color coding the display based on the magnitude.

The recent news articles returned specifically search earthquake related news in the user defined location.  The user is able to view an article preview and there is also a link to the full news article should the user desire to read the full story.

---

## How To Use

Simply open the application in any browser.  Once the page is loaded, enter the desired location to search by entering the city and state. Upon clicking the search button you will be provided the available data for your search location.

Seismic Data Color Codes
- Magnitude 7.0 + => Red
- Magnitude 5.0 - 7.0 => Orange
- Magnitude 3.0 - 5.0 => Yellow

---

#### Installation

Click this link to view Earthquake Now.

- [View Site](https://nabeek.github.io/Earthquake-Now/)

---

#### Technologies

- LocationIQ
- USGS
- Powered by NewsAPI
- moment.js
- jQuery UI
- jQuery
- Javascript
- Bulma Framework
- HTML 5
- CSS 3

---

### Roadmap

Future improvements for the application.
- Select the number of results to display
- Utilize the user's location based on their device upon appliction initialization
- City & state validation
- Incorporate Google Maps to display recent activity
- Add additional news or related information (ex. Twitter and other social media)
- Instructions or link to 'what to do in the event of an earthquake'
- Historic or average earthquake data for searched location (ex. Number of events per year or month)
- Main event vs aftershock indicator

---

#### Code Samples

```javascript
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
```

```html
<!-- Wrapper to create columns on desktop -->
        <div id="initialState" class="hide">
            <div class="columns is-desktop">
                <!-- Recent Seismic Section -->
                <section id="seismic-activity" class="section column">
                    <h3 class="title is-4 has-text-centered">Recent Seismic Activity</h3>

                    <div id="seismic-container" class="box-container"></div>
                </section>
                <!-- Recent News Section -->
                <section class="section column" id="related-news">
                    <h4 class="title is-4 has-text-white has-text-centered" id="news-section-header">Related News</h4>
                    
                    <div class="box-container" id="news-container"></div>
                </section>
            </div>
        </div>
```

```css
/* Search Input Styling */
#search-button {
    border-radius: 4px;
    margin-left: 14px;
}

.city-input {
    background-color: #ebebeb;
}

#state-input {
    background-color: #ebebeb;
    border-color: #3298dc;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
}
```

[Back To The Top](#project-name)

---

## References

- [LocationIQ](https://locationiq.com/)
- [NewsAPI](https://newsapi.org)
- [USGS API](https://earthquake.usgs.gov/fdsnws/event/1/)
- [jQuery UI](https://jqueryui.com/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [W3Schools](https://www.w3schools.com/)
- [Google](https://www.google.com) 

[Back To The Top](#project-name)

---

## License

Copyright (c) 2020

[Back To The Top](#project-name)

---

## Contributors

| Developer | GitHub | Contribution |
| ------ | ------ | ------ |
| Mitch Henderson | [shiftymitch](https://github.com/shiftymitch) | Suggested project idea. Created news api & usgs api calls. Styled input section. Worked with Nick to print news articles. Collaborated on numerous components throughout the project. |
| Nate Valline | [nvalline](https://github.com/nvalline) | Created functionality to print seismic boxes. Styled seismic activity section. Add local storage functionality. Designed UI/UX. Collaborated on numerous components throughout project. |
| Nick Beekhuizen | [nabeek](https://github.com/nabeek) | Created locationIQ api call. Styled news articles section. Designed and implemented the footer. Worked with Mitch to print news articles. Collaborated on numerous components throughout project. |

[Back To The Top](#project-name)


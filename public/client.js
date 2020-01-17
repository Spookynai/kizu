/**
 *gets the cached anime data api
 */

var raw;

function getAnimeFromCache(coords) {
  if (!("caches" in window)) {
    return null;
  }
  const url = `${window.location.origin}/anime/$coords`;
  return caches
    .match(url)
    .then(response => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .catch(err => {
      console.error("Error getting data from cache", err);
      return null;
    });
}

const url_base =
  "https://kitsu.io/api/edge/anime?page[limit]=20&page[offset]=0&filter[text]=";
let fetchData = {
  Accept: "application/vnd.api+json",
  "Content-Type": "application/vnd.api+json"
};

getJSONData("little sister");
document.getElementById("search-button").addEventListener("click", search);

function getJSONData(searchTerm) {
  console.log("getting " + searchTerm);
  let url = url_base + searchTerm;
  fetch(url, fetchData)
    .then(resp => resp.json()) // Transform the data into json
    .then(function(data) {
      getImageData(data);
    })
    .catch(function(error) {
      document.getElementById("box-main").innerHTML +=
        "Error with Kitsu Api: " + error;
    });
}

function getImageData(data) {
  document.getElementById("box-main").innerHTML = "";
  for (var i = 0; i < data.data.length; i++) {
    var output = "";
    output = "<div class='card'>";
    output +=
      "<div class='box' id='img" +
      i +
      "' style='background-image:url(\"" +
      data.data[i].attributes.posterImage.medium +
      "\")'>";
    output += "<div class='dat'>" + "<h2 class='title'>";

    var str = data.data[i].attributes.titles.en_jp;
    console.log(i + " value is " + str);
    if (str == undefined) {
      output += data.data[i].attributes.canonicalTitle;
    } else {
      output += str;
    }
    output += "</h2>";

    output += "<h3>";

    var str = data.data[i].attributes.ageRating;
    console.log(i + " value is " + str);
    if (str == null) {
      output += "UNRATED";
    } else {
      output += str;
    }
    var str = data.data[i].attributes.ageRatingGuide;
    console.log(i + " value is " + str);
    if (str == " ") {
      output += " ";
    } else {
      output += " " + str;
    }

    output += "</h3>";

    output += "<h3>";

    var str = data.data[i].attributes.showType;
    console.log(i + " value is " + str);
    if (str == "movie") {
      output += "Movie";
    } else if (str == "special") {
      output += "Special";
    } else if (str == "music") {
      output += "Music";
    } else {
      output += str;
    }
    output += "</h3>" + "</div>";
    output += "</div>";
    output += "<div class='box2'>";
    output +=
      "<div class='underline'>" + "<div class='box3'>" + "<h3 class='col'>";

    var str = data.data[i].attributes.averageRating;
    console.log(i + " value is " + str);
    if (str == null) {
      output += "No Rating";
    } else {
      output += str + "% Rating";
    }

    output += "</h3>";

    output +=
      "<h3>" +
      "Rank: " +
      data.data[i].attributes.popularityRank +
      "</h3>" +
      "</div>";
    output += "<hr>";
    output += "<h4>" + "Synopsis" + "</h4>";
    output += "<p>" + data.data[i].attributes.synopsis + "</p>" + "</div>";
    output += "</div>";
    output += "</div>";

    document.getElementById("box-main").innerHTML += output;
  }
}

function search() {
  let searchTerm = document.getElementById("search-input").value;
  console.log("searching " + searchTerm);
  //perform search
  //update inner HTML of Foo
  getJSONData(searchTerm);
}

var input = document.getElementById("search-input");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
  }
});

function myFunction() {
  var x = document.getElementById("Drop");
  if (x.className.indexOf("show") == -1) {
    x.className += "show";
  } else {
    x.className = x.className.replace("show", "");
  }
}

const url_genre = "https://kitsu.io/api/edge/anime?page[limit]=20&page[offset]=0&filter[genres]=";

function buttonSearch(searchTerm) {
  getJSONData2(searchTerm);
  document.getElementById("myNav").style.width = "0%";
}

function getJSONData2(searchTerm) {
  console.log("getting " + searchTerm);
  let url = url_genre + searchTerm;
  fetch(url, fetchData)
    .then(resp => resp.json()) // Transform the data into json
    .then(function(data) {
      getImageData(data);
    })
    .catch(function(error) {
      document.getElementById("box-main").innerHTML +=
        "Error with Kitsu Api: " + error;
    });
}

/* Open when someone clicks on the span element */
function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}



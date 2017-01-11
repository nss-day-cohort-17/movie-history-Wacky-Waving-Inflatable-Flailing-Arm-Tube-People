
var currentMovie;


$("#new-movies").click(function () {
  $(".movieDB-view").addClass("hide");
  $(".search-result").removeClass("hide");
});


$("#movie-db").click(function () {
  $(".movieDB-view").removeClass("hide");
  $(".search-result").addClass("hide");
});

function nothing(data) {}

function addListener() {

  $("#addToWatched").click(function () {
    console.log("it worked")
    ajaxCall("https://movie-history-2c05c.firebaseio.com/watched.json", "json", "POST", nothing, JSON.stringify(currentMovie, ["Title", "Year", "Actors", "Plot", "Poster"]))

  });
}

function getMovieData(data) {
  currentMovie = data;
  $("#userInput").val("");
  $(".search-result").html(`
                                <img src="${data.Poster}" alt="movie cover image">
                                <h2>${data.Title}</h2>
                                <h3>${data.Year}</h3>
                                <h4>${data.Actors}</h4>
                                <h5>IMDB Rating: ${data.imdbRating}</h5>
                                <p>${data.Plot}</p>
                                <button class="btn btn-info" id="addToWatched">Add to watched movies </button>
                                <button class="btn btn-success addToWatchlist">Add to movie watchlist</button>
                              `)
      addListener();
    }
  });
  $(".search-view").removeClass("hide");
});



$('#movie-db').click(function(){
    console.log("hey");
    $.ajax({
        url: "https://movie-history-2c05c.firebaseio.com/.json",
        dataType: 'json',

        success: function(data) {
            console.log(data);
            var appendYourMovies = "";
            for (var i = 0; i < data.yourMovies.length; i++) {
                appendYourMovies += `<div class="card" style="width: 20rem;">
                                      <img class="card-img-top" src="${data.yourMovies[i].Poster}" alt="${data.yourMovies[i].Title}">
                                      <div class="card-block">
                                        <h4 class="card-title">${data.yourMovies[i].Title}</h4>
                                        <p class="card-text">${data.yourMovies[i].Year}</p>
                                        <p class="card-text">${data.yourMovies[i].Actors}</p>
                                        <a href="#" class="btn btn-primary">Read Plot</a>
                                      </div>
                                    </div>`
            }
            console.log(appendYourMovies);
            $('.movieDB-view').html(appendYourMovies);
        }

    })
})

function addListener() {

  console.log("works");
  $("#addToWatched").click(function () {
    ajaxCall("https://movie-history-2c05c.firebaseio.com/watched.json", "POST", JSON.stringify(currentMovie, ["Title", "Year", "Actors", "Plot"]))

  });
}

function ajaxCall(url, type, data) {
  $.ajax({
    url    : url,
    type   : type,
    data   : data,
    success: function (data) {
      console.log("works");
      console.log(data);
    }
  })
};

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

$("#searchBtn").click(function() {
  ajaxCall(`http://www.omdbapi.com/?t=${$("#userInput").val()}&y=&plot=full&r=json`, "json", "GET", getMovieData);
    });


function yourMovies(data) {
    //console.log(data);
  $('.movieDB-view').empty();
    Object.keys(data).forEach(function (id) {
      //console.log(data[id]);

      $('.movieDB-view').append(`<div class="card" style="width: 20rem;">
                                      <img class="card-img-top" src="${data[id].Poster}" alt="${data[id].Title}">
                                      <div class="card-block">
                                        <h4 class="card-title">${data[id].Title}</h4>
                                        <p class="card-text">${data[id].Year}</p>
                                        <p class="card-text">${data[id].Actors}</p>
                                        <a href="#" class="btn btn-primary">Read Plot</a>
                                      </div>
                                    </div>`);
    });
}

$('#movie-db').click(function(){
  ajaxCall("https://movie-history-2c05c.firebaseio.com/watched.json", "json", "GET", yourMovies);
});





function ajaxCall(url, dType, type, fn, sendData) {
  $.ajax({
    url    : url,
    datatype   : dType,
    type: type,
    data   : sendData,
    success: function (data) {
      console.log("works");
      console.log(data);
      fn(data);
    }
  })
}

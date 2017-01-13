
var currentMovie;
var flag;



$("#home").click(function () {
  $(".home").removeClass("hide");
  $(".myList-view").addClass("hide");
  $(".recentlyWatched-view").addClass("hide");
  $(".search-view").addClass("hide");
});

$("#new-movies").click(function () {
  $(".myList-view").addClass("hide");
  $(".recentlyWatched-view").addClass("hide");
  $(".home").addClass("hide");
  $(".search-view").removeClass("hide");
});


$("#myList").click(function () {
    ajaxCall("https://movie-history-2c05c.firebaseio.com/my-list.json", "json", "GET", yourMovies);
  $(".myList-view").removeClass("hide");
  $(".search-view").addClass("hide");
  $(".home").addClass("hide");
  $(".recentlyWatched-view").addClass("hide");
  flag = true;
});

$('#recentlyWatched').click(function(){
  ajaxCall("https://movie-history-2c05c.firebaseio.com/recently-watched.json", "json", "GET", yourMovies);
  $(".myList-view").addClass("hide");
  $(".search-view").addClass("hide");
  $(".home").addClass("hide");
  $(".recentlyWatched-view").removeClass("hide");
  flag = false;
});


function nothing(data) {}

function addListenersToSearchView() {

  $("#addToMyList").click(function () {
    console.log("it worked");
    ajaxCall("https://movie-history-2c05c.firebaseio.com/my-list.json", "json", "POST", nothing, JSON.stringify(currentMovie, ["Title", "Year", "Actors", "Plot", "Poster"]));
  });

    $("#addToRecentlyWatched").click(function () {
      console.log("it worked recently watched");
      ajaxCall("https://movie-history-2c05c.firebaseio.com/recently-watched.json", "json", "POST", nothing, JSON.stringify(currentMovie, ["Title", "Year", "Actors", "Plot", "Poster"]));
  });
}

function addListenersToListViews() {

  //$("#readPlot").click(function () {
  //  console.log("it worked plot");
  //  //ajaxCall("https://movie-history-2c05c.firebaseio.com/my-list.json", "json", "POST", nothing, JSON.stringify(currentMovie, ["Title", "Year", "Actors", "Plot", "Poster"]));
  //});

  $("#removeMovie").click(function () {
    console.log("it worked remove");
    //ajaxCall("https://movie-history-2c05c.firebaseio.com/recently-watched.json", "json", "POST", nothing, JSON.stringify(currentMovie, ["Title", "Year", "Actors", "Plot", "Poster"]));
  });
}


function getMovieData(data) {
  currentMovie = data;
  $("#userInput").val("");
  $(".search-result-view").html(`
                                <img src="${data.Poster}" alt="movie cover image">
                                <h2>${data.Title}</h2>
                                <h3>${data.Year}</h3>
                                <h4>${data.Actors}</h4>
                                <h5>IMDB Rating: ${data.imdbRating}</h5>
                                <p>${data.Plot}</p>
                                <button class="btn btn-info" id="addToMyList">+ My List</button>
                                <button class="btn btn-success" id="addToRecentlyWatched">+ Recently Watched</button>
                              `);
  addListenersToSearchView();
}



function yourMovies(data) {
  var currentView;
  if (flag) {
    currentView = ".myList-view";
  } else {
    currentView = ".recentlyWatched-view";
  }
    //console.log(data);
    $(currentView).empty();
    Object.keys(data).forEach(function (id, i) {
        //console.log(data[id]);


        $(currentView).append(`<div class="card col-md-4 col-lg-3">
                                    <img class="img-responsive card-img-top center-block" src="${data[id].Poster}" alt="${data[id].Title}">
                                    <div class="card-block">
                                    <h3 class="card-title">${data[id].Title}</h4>
                <button type="button" class="btn-list btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg${i}">More Info</button>

                <div class="modal fade bs-example-modal-lg${i}" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
                    <div class="modal-dialog modal-lg" id="${i}" role="document">
                        <div class="modal-content">
                            <img src="${data[id].Poster}" class="img-responsive center-block" alt="">
                            <h4 class="text-center">${data[id].Title}</h4>
                            <p class="text-center">${data[id].Year}</p>
                             <p class="text-center">${data[id].Actors}</p>
                           <p>${data[id].Plot}</p>
                        </div>
                     </div>
                </div>
                <button type="button" class="btn-list btn-danger removeMovie">Remove</button>
            </div>
        </div>
        `);


    });

  addListenersToListViews()
}
// <p class="card-text">${data[id].Year}</p>
// <p class="card-text">${data[id].Actors}</p>

$("#searchBtn").click(function() {
  ajaxCall(`http://www.omdbapi.com/?t=${$("#userInput").val()}&y=&plot=full&r=json`, "json", "GET", getMovieData);
  $(".carousel").addClass("hide");
  $(".search-result-view").removeClass("hide");
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

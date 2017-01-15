
var currentMovie;
var currentView;
var flag;
var dbSnapshot;

// ---------- NAV EVENTLISTENERS --------------

$(".logout").click(homeView);

$("#home").click(homeView);


$("#new-movies").click(function () {
  $(".myList-view").addClass("hide");
  $(".recentlyWatched-view").addClass("hide");
  $(".home-view").addClass("hide");
  $(".search-view").removeClass("hide");
  $(".heading h1").html("Search Movies")
});


$("#myList").click(function () {
  $.getJSON(`https://movie-history-2c05c.firebaseio.com/${userID}/myList-view.json`).then(yourMovies);
  $(".myList-view").removeClass("hide");
  $(".search-view").addClass("hide");
  $(".home-view").addClass("hide");
  $(".recentlyWatched-view").addClass("hide");
  $(".heading h1").html("My List");
  flag = true;
});

$('#recentlyWatched').click(function(){
  $.getJSON(`https://movie-history-2c05c.firebaseio.com/${userID}/recentlyWatched-view.json`).then(yourMovies);
  $(".myList-view").addClass("hide");
  $(".search-view").addClass("hide");
  $(".home-view").addClass("hide");
  $(".recentlyWatched-view").removeClass("hide");
  $(".heading h1").html("Recently Watched");
  flag = false;
});



// ---------- HELPER FUNCTIONS --------------


function homeView () {
  $(".home").removeClass("hide");
  $(".myList-view").addClass("hide");
  $(".recentlyWatched-view").addClass("hide");
  $(".search-view").addClass("hide");
  $(".heading h1").html("Movie History")
}

function addListenersToSearchView() {

  $("#addToMyList").click(function () {
    console.log("it worked");
    $.post(`https://movie-history-2c05c.firebaseio.com/${userID}/myList-view.json`, JSON.stringify(currentMovie, ["Title", "Year", "Actors", "Plot", "Poster"]));
    $(".search-result-view #addToMyList").addClass(" btn-success")
  });

    $("#addToRecentlyWatched").click(function () {
      console.log("it worked recently watched");
      $.post(`https://movie-history-2c05c.firebaseio.com/${userID}/recentlyWatched-view.json`, JSON.stringify(currentMovie, ["Title", "Year", "Actors", "Plot", "Poster"]));

    });
};

function getData() {
  $.getJSON(`http://www.omdbapi.com/?t=${$("#userInput").val()}&y=&plot=full&r=json`)
   .then(displayMovieData)
   .then(() => {
     $(".search-result-view").removeClass("hide");
   });
  $.getJSON(`http://www.omdbapi.com/?s=${$("#userInput").val()}`)
    .then(displayRelatedResults)
    .then(clickOnRelated);
}

function displayRelatedResults(data) {
  console.log(data);
  var relatedString = "<h4>Related:</h4><ul>";

  for (var i = 0; i < data.Search.length; i++) {
    relatedString += `<li><a  href="#" class="related-btn">${data.Search[i].Title}</a></li>`
  }
    relatedString += "</ul>";
  $(".related-results").html(relatedString);
}

function clickOnRelated() {
  $(".related-results").click(function (e) {
    if (e.target.tagName === "A") {
      var newSearch = e.target.innerHTML;
    }
      $.getJSON(`http://www.omdbapi.com/?t=${newSearch}&y=&plot=full&r=json`)
       .then(displayMovieData)
       .then(() => {
         $(".search-result-view").removeClass("hide");
       });
      $.getJSON(`http://www.omdbapi.com/?s=${newSearch}`)
       .then(displayRelatedResults)
       .then(clickOnRelated);
  })
};

function displayMovieData(data) {
  currentMovie = data;
  $("#userInput").val("");
  $(".search-result-view").html(`
                                <img src="${data.Poster}" alt="movie cover image">
                                <h2>${data.Title}</h2>
                                <h3>${data.Year}</h3>
                                <h4>${data.Actors}</h4>
                                <h5>IMDB Rating: ${data.imdbRating}</h5>
                                <p>${data.Plot}</p>
                                <button class="btn-list btn-add" id="addToMyList">+ My List</button>
                                <button class="btn-list btn-add" id="addToRecentlyWatched">+ Recently Watched</button>
                              `);
  addListenersToSearchView();
}


function yourMovies(data) {
  dbSnapshot = data;
  if (flag) {
    currentView = "myList-view";
  } else {
    currentView = "recentlyWatched-view";
  }
    //console.log(data);
    $(`.${currentView}`).empty();
    Object.keys(data).forEach(function (id, i) {
        //console.log(data[id]);

        $(`.${currentView}`).append(`<div class="card col-md-4 col-lg-3">
                                       <img class="img-responsive card-img-top center-block" src="${data[id].Poster}" alt="${data[id].Title}">
                                       <div class="card-block">
                                         <h3 class="card-title">${data[id].Title}</h4>
                                         <button type="button" class="btn-list" data-toggle="modal" data-target=".bs-example-modal-lg${i}">More Info</button>

                                         <div class="modal fade bs-example-modal-lg${i}" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
                                           <div class="modal-dialog modal-lg" id="${i}" role="document">
                                             <div class="modal-content">
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                               <h4 class="text-center">${data[id].Title}</h4>
                                               <img src="${data[id].Poster}" class="img-responsive center-block" alt="">
                                               <p class="text-center">${data[id].Year}</p>
                                               <p class="text-center">${data[id].Actors}</p>
                                               <p>${data[id].Plot}</p>
                                             </div>
                                           </div>
                                         </div>
                                         <button type="button" class="btn-list removeMovie">Remove</button>
                                         <button type="button" class="btn-list onlyMyList moveMovie">Watched</button>
                                       </div>
                                     </div>
                                   `);


    });
    if ($(".myList-view").hasClass("hide")) {
      $(".onlyMyList").addClass("hide");
    } else {
      $(".onlyMyList").removeClass("hide");
    }
  $('.removeMovie').click(removeCard);
  $('.moveMovie').click(moveCard);
}


// ---------- CARD FUNCTIONS --------------


$("#searchBtn").click(getData);
//$('.removeMovie').click(removeCard);


function removeCard(e){
    var keyToDelete;
        var divToRemove = e.target.closest(".card")
        var titleTarget = $(divToRemove).find('.card-title')[0].innerHTML
        console.log(titleTarget, divToRemove);
        divToRemove.remove();
        keyToDelete = _.findKey(dbSnapshot, ["Title", titleTarget]);
        console.log(keyToDelete);

        $.ajax({
        url        : `https://movie-history-2c05c.firebaseio.com/${userID}/${currentView}/${keyToDelete}/.json`,
        datatype   : "json",
        type       : "DELETE",

      });
};

function moveCard(e) {

  var divToRemove = e.target.closest(".card")
  var titleTarget = $(divToRemove).find('.card-title')[0].innerHTML
  keyToMove = _.findKey(dbSnapshot, ["Title", titleTarget]);
  $.getJSON(`https://movie-history-2c05c.firebaseio.com/${userID}/myList-view/${keyToMove}.json`)
    .then(function (data) {
      removeCard(e);
      divToRemove.remove();
      $.post(`https://movie-history-2c05c.firebaseio.com/${userID}/recentlyWatched-view.json`, JSON.stringify(data, ["Title", "Year", "Actors", "Plot", "Poster"]))
      })
        .then(function () {
      console.log("Moved");
      })
}


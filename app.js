
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
  console.log(data);
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

  console.log(data);
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
                                        <section class='rating-widget'>
                                          <div class='rating-stars text-center'>
                                            <ul id='stars'>
                                              <li class='star' title='Poor' data-value='1'>
                                                <i class='fa fa-star fa-fw'></i>
                                              </li>
                                              <li class='star' title='Fair' data-value='2'>
                                                <i class='fa fa-star fa-fw'></i>
                                              </li>
                                              <li class='star' title='Good' data-value='3'>
                                                <i class='fa fa-star fa-fw'></i>
                                              </li>
                                              <li class='star' title='Excellent' data-value='4'>
                                                <i class='fa fa-star fa-fw'></i>
                                              </li>
                                              <li class='star' title='WOW!!!' data-value='5'>
                                                <i class='fa fa-star fa-fw'></i>
                                              </li>
                                            </ul>
                                          </div>
                                        </section>

                <button type="button" class="btn-list btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg${i}">More Info</button>

                <div class="modal fade bs-example-modal-lg${i}" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
                    <div class="modal-dialog modal-lg" id="${i}" role="document">
                        <div class="modal-content">
                            <h4 class="text-center">${data[id].Title}</h4>
                            <img src="${data[id].Poster}" class="img-responsive center-block" alt="">
                            <p class="text-center">${data[id].Year}</p>
                             <p class="text-center">${data[id].Actors}</p>
                           <p>${data[id].Plot}</p>
                        </div>
                     </div>
                </div>
                <button type="button" class="btn-list btn-danger removeMovie">Remove</button>
                <button type="button" class="btn-list btn-danger moveMovie">Watched</button>
            </div>
        </div>
        `);


    });

    if($(".myList-view").hasClass("hide")) {
      $(".onlyMyList").addClass("hide");
      }else{
          $(".onlyMyList").removeClass("hide");
    }

  $('.removeMovie').click(removeCard);
  $('.moveMovie').click(moveCard);
  rate(data)

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
        datatype   : "JSON",
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




function rate(data){
    // response.addHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
  /* 1. Visualizing things on Hover - See next part for action on click */
  $('#stars li').on('mouseover', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

    // Now highlight all the stars that's not after the current hovered star
    $(this).parent().children('li.star').each(function(e){
      if (e < onStar) {
        $(this).addClass('hover');
      }
      else {
        $(this).removeClass('hover');
      }
    });

  }).on('mouseout', function(){
    $(this).parent().children('li.star').each(function(e){
      $(this).removeClass('hover');
    });
  });


  /* 2. Action to perform on click */
  $('#stars li').on('click', function(e){
    var onStar = parseInt($(this).data('value'), 10); // The star currently selected
    var stars = $(this).parent().children('li.star');
    var card = e.target.closest(".card")
    var titleTarget = $(card).find('.card-title')[0].innerHTML
    var key = _.findKey(data, ['Title', titleTarget]);
    console.log(key);

    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }

    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass('selected');
    }

    // JUST RESPONSE (Not needed)
    var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
    console.log(ratingValue);

    $.ajax({
      url : `https://movie-history-2c05c.firebaseio.com/${userID}/${currentView}/${key}/.json`,
      datatype : 'JSON',
      type : 'PATCH',
      data : JSON.stringify( { "Rating" : `${ratingValue}` })

    }).then(function () {
      console.log()
    })


    //$.post(`https://movie-history-2c05c.firebaseio.com/${userID}/${userID}/${key}/.json`, JSON.stringify( { "Rating" : `${ratingValue}` } ));

    var msg = "You rated this " + ratingValue + " stars.";
    // responseMessage(msg);
    console.log(msg);
  })

};

// function responseMessage(msg) {
//     alert(msg)
//   // $('.success-box').fadeIn(200);
//   // $('.success-box div.text-message').html("<span>" + msg + "</span>");
// }






var currentMovie;


$("#new-movies").click(function () {
  $(".movieDB-view").addClass("hide");
  $(".search-result").removeClass("hide");
});


$("#movie-db").click(function () {
  $(".movieDB-view").removeClass("hide");
  $(".search-result").addClass("hide");
});


$("#searchBtn").click(function() {
  //console.log("it works");
  $.ajax({
    url: `http://www.omdbapi.com/?t=${$("#userInput").val()}&y=&plot=full&r=json`,
    dataType: 'json',
    success: function(data) {
      console.log(data);
      //currentMovie = data;
      $("#userInput").val("");
      $(".search-result").html(`
                                <img src="${data.Poster}" alt="movie cover image">
                                <h2>${data.Title}</h2>
                                <h3>${data.Year}</h3>
                                <h4>${data.Actors}</h4>
                                <h5>IMDB Rating: ${data.imdbRating}</h5>
                                <p>${data.Plot}</p>
                              `)
    }
  });
  $(".search-view").removeClass("hide");
});


$('#addToWatchlist').click(function(){
    console.log("hey");
})

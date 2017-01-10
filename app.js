


$("#searchBtn").click(function() {
  console.log("it works");
  $.ajax({
    url: `http://www.omdbapi.com/?t=${$("#userInput").val()}&y=&plot=full&r=json`,
    dataType: 'json',
    success: function(data) {
      console.log(data);
      $(".search-result").html(`
                                <img src="${data.Poster}" alt="movie cover image">
                                <h2>${data.Title}</h2>
                                <h3>${data.Year}</h3>
                                <h4>${data.Actors}</h4>
                                <h5>IMDB Rating: ${data.imdbRating}</h5>
                                <p>${data.Plot}</p>
                                <button class="btn btn-info">Add to watched movies </button>
                                <button class="btn btn-success">Add to movie watchlist</button>
                              `)
    }
  });
});

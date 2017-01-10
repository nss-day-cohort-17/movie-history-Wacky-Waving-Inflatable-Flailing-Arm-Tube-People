


$("#searchBtn").click(function() {
  console.log("it works");
  $.ajax({
    url: `http://www.omdbapi.com/?t=${$("#userInput").val()}&y=&plot=short&r=json`,
    dataType: 'json',
    success: function(data) {
      console.log(data);
    }
  });
});

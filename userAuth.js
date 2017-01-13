var target;


firebase.initializeApp({
  apiKey: "AIzaSyDy-m7zSm8n2VvqQpDcH4g2YpbgkaYNoPc",
  authDomain: "test-351e3.firebaseapp.com",
  databaseURL: "https://test-351e3.firebaseio.com",
  storageBucket: "test-351e3.appspot.com",
  messagingSenderId: "117618747620"
});


firebase.auth().onAuthStateChanged(() => {
  if(firebase.auth().currentUser) {
    console.log("logged in");
    $(".register").addClass("hidden")
    $(".login").addClass("hidden")
               .delay(1000)
               .fadeIn(function () {
                 $(".logout").removeClass("hidden");
               });
  } else {
    console.log("logged out");
    $(".logout").addClass("hidden")
                .delay(1000)
                .fadeIn(function () {
                  $(".register").removeClass("hidden");
                  $(".login").removeClass("hidden");
                });
  }
});


function doAuth() {
  var email = $("#uLogin").val();
  var password = $("#uPassword").val();

  if (target === "register") {
    firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(clearlogin)
            .then(authSuccess)
            .catch(handleAuthErrors);
  } else {
    firebase.auth().signInWithEmailAndPassword(email, password)
            .then(clearlogin)
            .then(authSuccess)
            .catch(handleAuthErrors);
  }
};


function doLogout () {
  firebase.auth().signOut()
}


function clearlogin() {
  $("#loginForm").trigger("reset");
}


function handleAuthErrors(error) {
  //alert(error.message)

  var button = $('.modal-footer button');
  var title = $('.modal-title');
  var progress = $('.progress');
  var progressBar = $('.progress-bar');

  button.hide();

  progress.show();

  progressBar.animate({ width: "100%" }, 100);
  progressBar.css("background-color", "red");

  progress.delay(800)
          .fadeOut(400);

  button.text("Try Again!")
        .removeClass("btn-primary")
        .addClass("btn-danger")
        .blur()
        .delay(1200)
        .fadeIn(function () {
          title.text(error.message);
          //button.attr("data-dismiss", "modal");
          progressBar.css({ "width": "0%" });

        })
  button
    .delay(1000)
    .fadeIn(500)
    .removeClass("btn-danger")
    .addClass("btn-primary")

};




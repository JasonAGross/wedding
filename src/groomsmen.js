// Initialize Firebase
var config = {
  apiKey: "AIzaSyALeetWuhCLsQTFOevQfsvAzbXj_GgvPQs",
  authDomain: "wedding-website-6cc9e.firebaseapp.com",
  databaseURL: "https://wedding-website-6cc9e.firebaseio.com",
  storageBucket: "wedding-website-6cc9e.appspot.com",
  messagingSenderId: "851671845395"
};
var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.database()

new Vue({
  el: '#groomsmen-container',
  firebase: {
    groomsmen: db.ref('groomsmen')
  },
  methods: {
  	confirmSpot: function (event) {
	  console.log(getParameterByName('user'))
  	}
  }
})

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
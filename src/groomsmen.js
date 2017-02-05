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

var app = new Vue({
	el: '#app',
	firebase: {
		groomsman: {
			source: db.ref('groomsmen/' + getParameterByName('user')),
			asObject: true
		},
		groomsmen: db.ref('groomsmen')
	},
	methods: {
		confirmSpot: function (event) {
			db.ref('groomsmen/' + getParameterByName('user')).update({
				status: true,
				viewed: true
			})
		},
		declineSpot: function (event) {
			db.ref('groomsmen/' + getParameterByName('user')).update({
				status: false,
				viewed: true
			})
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

function getUser(user) {
	var fullName = null;
	switch (user) {
		case 'ryan':
			fullName = 'Ryan Strouse';
			break;
		case 'dan':
			fullName = 'Dan Gaines';
			break;
		case 'erik':
			fullName = 'Erik Gross';
			break;
	}
	return fullName;
}
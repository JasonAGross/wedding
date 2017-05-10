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
		guests: db.ref('guestlist')
	},
	data: {
		searchValue: '',
		searchResults: []
	},
	computed: {
		filteredResults: function() {
			var filteredSet = [];
			for (var i = 0; i < this.searchResults.length; i++) {
				if (this.searchResults[i].score === 0) { // We have a perfect match, assume we don't need any more
					filteredSet.push(this.searchResults[i]);
					break;
				} else if (i > 0 && this.searchResults[i].score - this.searchResults[i-1].score >= 0.075) { // If the next match is more than 7.5% less correct, assume we don't want anymore
					break;
				} else {
					filteredSet.push(this.searchResults[i]);
				}
			}
			return filteredSet;
		}
	},
	methods: {
		searchRSVP: function() {
			var searchKeys = [{
				name: "Name",
				weight: 0.67
			},{
				name: "Spouse",
				weight: 0.33
			}];
			var options = {
				shouldSort: true,
				includeScore: true,
				threshold: 0.3,
				location: 0,
				distance: 100,
				maxPatternLength: 32,
				minMatchCharLength: 1,
				keys: searchKeys
			};
			var fuse = new Fuse(this.guests, options);
			var fuseSearch = fuse.search(this.searchValue);
			this.searchResults = fuse.results;
		}
	}
})
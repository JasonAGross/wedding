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
		step: 0,
		searchConducted: false,
		searchValue: '',
		searchResults: [],
		activeGuest: [],
		primaryAttending: false,
		SOAttending: false,
		guestAttending: false
	},
	computed: {
		filteredResults: function() {
			var filteredSet = [];
			for (var i = 0; i < this.searchResults.length; i++) {
				if (this.searchResults[i].score === 0) { // We have a perfect match, assume we don't need any more
					filteredSet.push(this.searchResults[i].item);
					this.activeGuest = this.searchResults[i].item;
					break;
				} else if (i > 0 && this.searchResults[i].score - this.searchResults[i-1].score >= 0.075) { // If the next match is more than 7.5% less correct, assume we don't want anymore
					break;
				} else {
					filteredSet.push(this.searchResults[i].item);
				}
			}
			return filteredSet;
		}
	},
	methods: {
		searchRSVP: function() {
			this.searchConducted = true;
			if (/\d/.test(this.searchValue)) { // If our search has number in it, we can safely assume it is an address search
				var options = {
					shouldSort: true,
					includeScore: true,
					threshold: 0.3,
					location: 0,
					distance: 100,
					maxPatternLength: 32,
					minMatchCharLength: 1,
					keys: ["Address"]
				};
				var fuse = new Fuse(this.guests, options);
				var fuseSearch = fuse.search(this.searchValue);
				this.searchResults = fuse.results;
			} else { // No numbers, name search. Be sure to check on the spouse as well
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
		},
		selectResult: function(i) {
			this.activeGuest = this.filteredResults[i];
		},
		confirmPrimary: function() {
			this.primaryAttending = true;
			// This person doesn't have a listed SO or guest
			if (this.activeGuest.Guests === 0 && this.activeGuest.Spouse.length === 0) {
				this.processRSVP();
				this.step++;
			} else {
				this.step++;
			}
		}, 
		denyPrimary: function() {
			this.primaryAttending = false;
			if (this.activeGuest.Guests === 0 && this.activeGuest.Spouse.length === 0) {
				this.processRSVP();
				this.step++;
			} else {
				this.step++;
			}
		},
		confirmSO: function() {
			this.SOAttending = true;
			this.processRSVP();
			this.step++;
		},
		denySO: function() {
			this.SOAttending = false;
			this.processRSVP();
			this.step++;
		},
		confirmGuest: function() {
			this.guestAttending = true;
			this.processRSVP();
			this.step++;
		},
		denyGuest: function() {
			this.guestAttending = false;
			this.processRSVP();
			this.step++;
		},
		processRSVP: function() {
			var count = 0;

			if (this.primaryAttending) {
				count++
			}
			if (this.SOAttending) {
				count++
			}
			if (this.guestAttending) {
				count++
			}

			if (count < 0) {
				count = 0;
			}

			db.ref('guestlist/' + this.activeGuest['.key']).update({
				RSVP: 'Yes',
				RSVPCount: count
			})
		}
	}
})
// Initialize Firebase
var config = {
  apiKey: "AIzaSyALeetWuhCLsQTFOevQfsvAzbXj_GgvPQs",
  authDomain: "wedding-website-6cc9e.firebaseapp.com",
  databaseURL: "https://wedding-website-6cc9e.firebaseio.com",
  storageBucket: "wedding-website-6cc9e.appspot.com",
  messagingSenderId: "851671845395"
};
var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.database();
var dbRef = db.ref('guestlist');

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
		guestAttending: false,
		child1Attending: false,
		child2Attending: false,
		child3Attending: false,
		phoneSubmitted: false,
		guestSubmitted: false,
		guestName: '',
		phone: '',
		adminUser: ''
	},
	computed: {
		filteredResults: function() {
			var filteredSet = [];
			for (var i = 0; i < this.searchResults.length; i++) {
				if (this.searchResults[i].score === 0) { // We have a perfect match, assume we don't need any more
					filteredSet.push(this.searchResults[i].item);
					this.activeGuest = this.searchResults[i].item;
					// Check to see if who we have listed as the spouse is actually filling out the RSVP
					if (this.activeGuest.Spouse == this.searchValue) {
						// If the spouse/SO is doing the search then let's just switch their spots with the primary listee
						this.activeGuest.Spouse = this.activeGuest.Name;
						this.activeGuest.Name = this.searchValue;
					}
					break;
				} else if (i > 0 && this.searchResults[i].score - this.searchResults[i-1].score >= 0.075) { // If the next match is more than 7.5% less correct, assume we don't want anymore
					break;
				} else {
					filteredSet.push(this.searchResults[i].item);
				}
			}
			return filteredSet;
		},
		isAdminUser: function() {
			if (this.adminUser === 'jasongross86@gmail.com' || this.adminUser === 'jason@jasonagross.com' || this.adminUser == 'awhitt2010@gmail.com') {
				return true;
			} else {
				return false;
			}
		},
		guestCount: function() {
			var guestCount = 0;
			for (var i = this.guests.length - 1; i >= 0; i--) {
				if (this.guests[i].RSVPCount) {
					guestCount = guestCount+Number(this.guests[i].RSVPCount);
				}
			}
			return guestCount;
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
			// Check to see if who we have listed as the spouse is actually filling out the RSVP
			if (this.activeGuest.Spouse == this.searchValue) {
				// If the spouse/SO is doing the search then let's just switch their spots with the primary listee
				this.activeGuest.Spouse = this.activeGuest.Name;
				this.activeGuest.Name = this.searchValue;
			}
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
		finishFamily: function() {
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
			if (this.child1Attending) {
				count++
			}
			if (this.child2Attending) {
				count++
			}

			if (count < 0) {
				count = 0;
			}

			if (this.guestAttending) {
				db.ref('guestlist/' + this.activeGuest['.key']).update({
					RSVP: 'Yes',
					RSVPCount: count,
					Spouse: this.guestName
				});
			} else {
				db.ref('guestlist/' + this.activeGuest['.key']).update({
					RSVP: 'Yes',
					RSVPCount: count
				});
			}
		},
		addPhone: function() {
			this.phoneSubmitted = true;
			db.ref('guestlist/' + this.activeGuest['.key']).update({
				Phone: this.phone
			});
		},
		addGuest: function() {
			this.guestSubmitted = true;
			this.processRSVP();
		},
		onSuccess: function(googleUser) {
			var user = googleUser.getBasicProfile()
			this.adminUser = user.getEmail();
		},
		onFailure: function(error) {
			console.log(error);
		},
		adminUpdateData: function(guest, field, value) {
			dbRef.child(guest['.key']).child(field).set(value);
		}
	}
});

function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': app.onSuccess,
    'onfailure': app.onFailure
  });
}
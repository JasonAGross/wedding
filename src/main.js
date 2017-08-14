Vue.component('navigation-item', {
	props: ['links'],
	template: '<li><a :href="links.address" :class="{ active: links.active }">{{ links.title }}</a></li>'
})

var app = new Vue({
  el: '#pageHeader',
  data: {
    links: [
      { title: 'Our Story', address: "index.html", active: true },
      { title: 'Our Wedding', address: "wdding.html", active: false },
      { title: 'RSVP', address: "rsvp.html", active: false },
      { title: 'Guest Info', address: "info.html", active: false }
    ]
  }
})
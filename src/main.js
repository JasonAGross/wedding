Vue.component('navigation-item', {
	props: ['links'],
	template: '<li><a :href="links.address">{{ links.title }}</a></li>'
})

new Vue({
  el: '#pageHeader',
  data: {
    links: [
      { title: 'Our Story', address: "index.html" },
      { title: 'Our Wedding', address: "wdding.html" },
      { title: 'RSVP', address: "rsvp.html" },
      { title: 'Guest Info', address: "info.html" }
    ],
    showMenu: false
  }
})
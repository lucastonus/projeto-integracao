var App = {
	map: null,

	processContributors: function(contributors) {
		$.each(contributors, function() {
			$.get(this.url + '?client_id=867563d42e4c9d5fda03&client_secret=43f406c798f11c2b6c7dd77a041839d21c3a4db4', function(user) {
				App.markUser(user);
			});
		});
	},

	markUser: function(user) {
		if (user.location != null) {
			GMaps.geocode({
				address: user.location,
				callback: function(results, status) {
					if (status == 'OK') {
						var latlng = results[0].geometry.location;

						var marker = {
							lat: latlng.lat(),
							lng: latlng.lng(),
							icon: {
								url: user.avatar_url,
								anchor: new google.maps.Point(7.5, 47),
								scaledSize: {height: 15, width: 15}
							},
							infoWindow: {
								content: $('<div>').append(
									$('<b>').text(user.name),
									$('<br/>'),
									$('<img>', {height: 200, width: 200, src: user.avatar_url, alt: user.login})
								).prop('outerHTML')
							}
						}

						App.map.addMarker(marker);

						marker.icon = {url: 'images/marker.png'};
						App.map.addMarker(marker);
					}
				}
			});
		}
	},

	search: function() {
		$('#map').css('height', $(window).height() - 124 + 'px');
		$('.descricao-busca').remove();

		App.map = new GMaps({
			el: '#map',
			lat: 0,
			lng: 0,
			zoom: 2
		});

		GitAPI.getRepo($('#repository-address').val().trim());
	},

	linkEvents: function() {
		$('#repository-address').focus();

		$('.search-button').on('click', function() {
			App.search();
		});

		$('#repository-address').on('keypress', function(event) {
			if (event.which == 13) {
				App.search();
			}
		});

		$('.box-search h1').on('click', function() {
			window.open('https://github.com/lucastonus/projeto-integracao');
		});
	}
};

var GitAPI = {
	getRepo: function(path) {
		$.get(GitAPI.getURI('/repos/' + path + '/contributors'), function(contributors) {
			App.processContributors(contributors);
		});
	},

	getURI: function(path) {
		return 'https://api.github.com' + path + '?client_id=867563d42e4c9d5fda03&client_secret=43f406c798f11c2b6c7dd77a041839d21c3a4db4';
	}
};

$(function() {
	App.linkEvents();
});
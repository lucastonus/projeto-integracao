var App = {
	map: null,
	semUsers: 0,

	processContributors: function(contributors) {
		App.semUsers = contributors.length;
		$.each(contributors, function() {
			$.ajax({
				url: this.url + '?' + GitAPI.getAuth(),
				async: false,
				success: function(user) {
					App.markUser(user);
				},
				error: function(jqXHR, error) {
					if (jqXHR.status == 404) {
						App.fail('Alguns usuários não foram encontrados.');
					} else {
						App.fail('Falha ao obter alguns usuários.');
					}

					App.closeWait();
				}
			})
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
								anchor: new google.maps.Point(10, 51),
								scaledSize: {height: 20, width: 20}
							},
							infoWindow: {
								content: $('<div>').append(
									$('<b class="user-name">').text(user.name),
									$('<br/>'),
									$('<img>', {height: 200, width: 200, src: user.avatar_url, alt: user.login})
								).prop('outerHTML')
							},
							zIndex: 1
						}

						App.map.addMarker(marker);
						marker.icon = {url: 'images/marker.png'};
						marker.zIndex = 2;
						App.map.addMarker(marker);
					}
				}
			});
		}

		App.semUsers--;
		if (App.semUsers <= 0) {
			App.closeWait();
		}
	},

	clear: function() {
		$('#map').css('height', $(window).height() - 124 + 'px');
		$('.descricao-busca').remove();
		$('.error-msg').hide();
	},

	fail: function(msg) {
		$('.error-msg').show();
		$('.error-msg span').text(msg);
	},

	search: function() {
		App.clear();

		App.map = new GMaps({
			el: '#map',
			lat: 0,
			lng: 0,
			zoom: 3
		});

		GitAPI.getRepo($('#repository-address').val().trim());
	},

	linkEvents: function() {
		$('#repository-address').focus();

		$('.search-button').on('click', function() {
			App.search();
			App.displayWait();
		});

		$('#repository-address').on('keypress', function(event) {
			if (event.which == 13) {
				App.search();
			}
		});

		$('.box-search h1').on('click', function() {
			window.open('https://github.com/lucastonus/projeto-integracao');
		});
	},

	displayWait: function() {
		$('#displayWait').show();
		$('body').append(
			$('<div>', {'class': 'wait'})
		);
	},

	closeWait: function() {
		$('#displayWait').hide();
		$('div.wait').remove();
	}
};

var GitAPI = {
	CLIENT_ID: '867563d42e4c9d5fda03',
	CLIENT_SECRET: '43f406c798f11c2b6c7dd77a041839d21c3a4db4',

	getRepo: function(path) {
		$.get(GitAPI.getURI('/repos/' + path + '/contributors'), function(contributors) {
			App.processContributors(contributors);
			return true;
		}).fail(function(response) {
			if (response.status == 404) {
				App.fail('Repositório não encontrado.');
				App.closeWait();
			} else {
				App.fail('Falha ao obter o repositório.');
				App.closeWait();
			}
		});
	},

	getURI: function(path) {
		return 'https://api.github.com' + path + '?' + this.getAuth();
	},

	getAuth: function() {
		return 'client_id=' + this.CLIENT_ID + '&client_secret=' + this.CLIENT_SECRET;
	}
};

$(function() {
	App.linkEvents();
});
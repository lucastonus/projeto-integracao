$(document).ready(function() {
	vincularEventos();
});

function ajustarAlturaMapa() {
	var windowHeight = $(window).height();
	var mapHeight = windowHeight - 124;
	$('#map').css('height', mapHeight+'px');
}

function vincularEventos() {
	$('.search-button').on('click', function(){
		ajustarAlturaMapa();
		$('.descricao-busca').remove();
		var repository = $('#repository-address').val();

		App.map = new GMaps({
			el: '#map',
			lat: 0,
			lng: 0,
			zoom: 2
		});

		GitAPI.getRepo(repository);
	});

	$('.box-search h1').on('click', function() {
		location.reload();
	})
}

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
						App.map.addMarker({
							lat: latlng.lat(),
							lng: latlng.lng(),
							icon: {
								'url': user.avatar_url,
								'scaledSize': {'height': 20, 'width': 20}
							},
							infoWindow: {
								content: '<p><img src="' + user.avatar_url + '"></img></p><p><b>' + user.name + '</b></p>'
							}
						});
					}
				}
			});
		}
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
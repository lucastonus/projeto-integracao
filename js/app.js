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
						//App.map.setCenter(latlng.lat(), latlng.lng());
						App.map.addMarker({
							lat: latlng.lat(),
							lng: latlng.lng(),
							icon: 'https://hydra-media.cursecdn.com/wow.gamepedia.com/7/7a/Rep_unknown_icon_18x18.png?version=19089546ac3ebfa844febfcd49ac5cad'
						});
						App.map.addMarker({
							lat: latlng.lat() - 20,
							lng: latlng.lng() - 20,
							icon: 'https://hydra-media.cursecdn.com/wow.gamepedia.com/7/7a/Rep_unknown_icon_18x18.png?version=19089546ac3ebfa844febfcd49ac5cad'
						});

						console.log(user.location);
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

$(function() {
	App.map = new GMaps({
		el: '#map',
		lat: 0,
		lng: 0,
		zoom: 2
	});

	GitAPI.getRepo('lucastonus/projeto-integracao');
});
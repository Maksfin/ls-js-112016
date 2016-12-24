module.exports = {
    login: function(appId, perms) {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: appId
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, perms);
        });
    },
    callApi: function(method, params) {
        return new Promise(function(resolve, reject) {
            VK.api(method, params, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    resolve(response.response);
                }
            });
        });
    },
    getUser: function() {
        return this.callApi('users.get', {});
    },
    getMusic: function() {
        return this.callApi('audio.get', {});
    },
    getFriends: function() {
        return this.callApi('friends.get', { fields: 'photo_100' });
    },
    getNews: function() {
        return this.callApi('newsfeed.get', { filters: 'post', count: 20 });
    },
		getGroups: function() {
        return this.callApi('groups.get', { extended:1, fields: 'photo_50', name});
    },
		getAllPhotos: function() {
			return this.callApi('photos.getAll', { extended: 1 });
    },
		getAllComents: function() {
			return this.callApi('photos.getAllComments', { extended: 1 });
    },
		getPhotos: function() {
			return  Promise.all([this.getAllPhotos(), this.getAllComents()])
				.then((results) => {
					for (let el of results[0]) {
                        el['comments'] = 0;
						for (let el2 of results[1]) {
							if (el.pid === el2.pid) {
								el['comments'] += 1;
							}
						}
					}
				return results[0];
			})
		}
};

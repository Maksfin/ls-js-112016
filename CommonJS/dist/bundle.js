/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Model = __webpack_require__(1);
	const View = __webpack_require__(2);
	const Route = __webpack_require__(3);

	module.exports = new Promise(function (resolve) {
	    window.onload = resolve;
	}).then(function () {
	    return Model.login(5757774, 2 | 8 | 4 | 8192);
	}).then(function () {
	    Model.getUser().then(function (users) {
	        header.innerHTML = View.render('header', users[0]);
	    });
	    Model.getMusic().then(function (music) {
	        results.innerHTML = View.render('music', { list: music });
	    });
	}).then(function () {
	    document.addEventListener('click', function (e) {
	        let targetData = e.target.dataset.route;
	        if (targetData) {
	            Route.handle(targetData);
	        }
	    });
	}).catch(function (e) {
	    console.error(e);
	    alert('Ошибка: ' + e.message);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
	    login: function (appId, perms) {
	        return new Promise(function (resolve, reject) {
	            VK.init({
	                apiId: appId
	            });

	            VK.Auth.login(function (response) {
	                if (response.session) {
	                    resolve(response);
	                } else {
	                    reject(new Error('Не удалось авторизоваться'));
	                }
	            }, perms);
	        });
	    },
	    callApi: function (method, params) {
	        return new Promise(function (resolve, reject) {
	            VK.api(method, params, function (response) {
	                if (response.error) {
	                    reject(new Error(response.error.error_msg));
	                } else {
	                    resolve(response.response);
	                }
	            });
	        });
	    },
	    getUser: function () {
	        return this.callApi('users.get', {});
	    },
	    getMusic: function () {
	        return this.callApi('audio.get', {});
	    },
	    getFriends: function () {
	        return this.callApi('friends.get', { fields: 'photo_100' });
	    },
	    getNews: function () {
	        return this.callApi('newsfeed.get', { filters: 'post', count: 20 });
	    },
	    getGroups: function () {
	        return this.callApi('groups.get', { extended: 1, fields: 'photo_50', name });
	    },
	    getAllPhotos: function () {
	        return this.callApi('photos.getAll', { extended: 1 });
	    },
	    getAllComents: function () {
	        return this.callApi('photos.getAllComments', { extended: 1 });
	    },
	    getPhotos: function () {
	        return Promise.all([this.getAllPhotos(), this.getAllComents()]).then(results => {
	            for (let el of results[0]) {
	                el['comments'] = 0;
	                for (let el2 of results[1]) {
	                    if (el.pid === el2.pid) {
	                        el['comments'] += 1;
	                    }
	                }
	            }
	            return results[0];
	        });
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
		render: function (templateName, model) {
			templateName = templateName + 'Template';

			var templateElement = document.getElementById(templateName),
			    templateSource = templateElement.innerHTML,
			    renderFn = Handlebars.compile(templateSource);

			return renderFn(model);
		}
	};
	Handlebars.registerHelper('formatTime', function (time) {
		var minutes = parseInt(time / 60),
		    seconds = time - minutes * 60;

		minutes = minutes.toString().length === 1 ? '0' + minutes : minutes;
		seconds = seconds.toString().length === 1 ? '0' + seconds : seconds;

		return minutes + ':' + seconds;
	});

	Handlebars.registerHelper('formatDate', function (ts) {
		return new Date(ts * 1000).toLocaleString();
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Controller = __webpack_require__(4);

	module.exports = {
	    handle: function (route) {
	        var routeName = route + 'Route';

	        Controller[routeName]();
	    }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Model = __webpack_require__(1);
	const View = __webpack_require__(2);

	module.exports = {
	    musicRoute: function () {
	        return Model.getMusic().then(function (music) {
	            results.innerHTML = View.render('music', { list: music });
	        });
	    },
	    friendsRoute: function () {
	        return Model.getFriends().then(function (friends) {
	            results.innerHTML = View.render('friends', { list: friends });
	        });
	    },
	    newsRoute: function () {
	        return Model.getNews().then(function (news) {
	            results.innerHTML = View.render('news', { list: news.items });
	        });
	    },
	    groupsRoute: function () {
	        return Model.getGroups().then(function (groups) {
	            results.innerHTML = View.render('groups', { list: groups });
	        });
	    },
	    photosRoute: function () {
	        return Model.getPhotos().then(function (photos) {
	            results.innerHTML = View.render('photos', { list: photos });
	        });
	    }
	};

/***/ }
/******/ ]);
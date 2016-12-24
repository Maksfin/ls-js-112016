const Model = require('./model.js');
const View = require('./view.js');
const Route = require('./router.js');

module.exports = 
     new Promise(function(resolve) {
        window.onload = resolve;
    }).then(function() {
        return Model.login(5757774, 2 | 8 | 4 | 8192);
    }).then(function() {
        Model.getUser().then(function(users) {
            header.innerHTML = View.render('header', users[0]);
    		})
    		Model.getMusic().then(function(music) {
    			results.innerHTML = View.render('music', {list: music});
    		})
    }).then(function() {
        document.addEventListener('click', function(e) {
            let targetData = e.target.dataset.route;
            if (targetData) {
               Route.handle(targetData);
            }
        })
    }).catch(function(e) {
        console.error(e);
        alert('Ошибка: ' + e.message);
    });
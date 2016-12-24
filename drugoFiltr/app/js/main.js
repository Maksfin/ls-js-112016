let resLeft = [];
let resRight = [];
let userId;
let isAreaDrop;
let storage = localStorage;

/**************** Ждем загрузки документа ***************/
new Promise(resolve  => {
	if(document.readyState == 'complete') {
		window.onload = resolve;
	}	else {
		window.onload = resolve;
	}
}).then(() => {
	return new Promise((resolve, reject) => {
		signIn.addEventListener('click', function(e) { // Войти
			e.target.classList.add('hide');
			mainApp.classList.remove('hide');
			document.body.classList.add('overlay');
			resolve();
		});
	})
}).then(() => {	// Проверям хранилище, берем оттуда данные
	if(storage.length) {
		resLeft = JSON.parse(storage.dataLeft);
		resRight = JSON.parse(storage.dataRight);
		render(resLeft, listLeft);
		render(resRight, listRight);
		filter(resLeft, inpSearchLeft, listLeft);
		filter(resRight, inpSearchRight, listRight);
	} else {
		return new Promise((resolve, reject) => { // Если хранилище пустое, то запрашиваем данные с сервера
				VK.init({
				apiId: 5757774
			});
		
			VK.Auth.login((response) => {
				if (response.session) {
				 	resolve();
				} else {
					reject(new Error('Ошибка авторизации'));
				}
			})	
		}).then(() => {
			return new Promise((resolve, reject) => {
				VK.api('friends.get', {'fields': 'city, bdate, photo_50'}, response => {
					
				 if (response.error) {
						reject(new Error(response.error.error_msg));
				 } else {
					 resolve(response.response);
				 }
			 });

			})	
		}).then((response) => {
			resLeft = response;
			render(resLeft, listLeft);
			filter(resLeft, inpSearchLeft, listLeft);
			filter(resRight, inpSearchRight, listRight);
		}).catch((e) => alert(`Ошибка ${e.message}`));
	}
});


/************ Фильтрует данные и выводит результат в шаблон *************/
function filter(data, targetId, temp) {
	targetId.addEventListener('input', function() {
		let val = this.value;

		let resFilter = data.filter(function(item) {
			let elem = `${item.first_name.toLowerCase()} ${item.last_name.toLowerCase()}`;
			return elem.search(val.toLowerCase()) != -1
		})

	 	render(resFilter, temp);
	});
};


/********************* Перемещаем друзей между списками(Кнопки) *****************/
listLeft.addEventListener('click', function(e) {
	let target = e.target;

	if(target.tagName === 'BUTTON') {
		let item = target.closest('.drugo-main__item');
		userId = item.querySelector('#id').textContent;

		changeDataList(resLeft, resRight);
		render(resRight, listRight)
		render(resLeft, listLeft)
	}
});

listRight.addEventListener('click', function(e) {
	let target = e.target;

	if(target.tagName === 'BUTTON') {
		let item = target.closest('.drugo-main__item');
		userId = item.querySelector('#id').textContent;

		changeDataList(resRight, resLeft);
		render(resRight, listRight)
		render(resLeft, listLeft)
	}
});


/********************* Перемещаем друзей между списками(Drag & Drop) *****************/
mainApp.addEventListener('dragstart', function(e) {
	let target = e.target;

	if (target.classList.contains('drugo-main__item')) {
		userId = target.querySelector('#id').textContent;
	}
});

mainApp.addEventListener('dragover', function(e) {
	e.preventDefault();
});

mainApp.addEventListener('dragenter', function(e) {
	e.preventDefault();

	if (e.target.closest('.drugo-main__right')) {
		isAreaDrop = true;
	} else {
		isAreaDrop = false;
	}
});

mainApp.addEventListener('drop', function(e) {
	e.stopPropagation();

	if(isAreaDrop) {
		changeDataList(resLeft, resRight);
	} else {
		changeDataList(resRight, resLeft);
	}
	
	render(resRight, listRight)
	render(resLeft, listLeft)
});


/********************* Сохраняет данные *****************/
saveData.addEventListener('click', function() {
	storage.dataLeft = JSON.stringify(resLeft);
	storage.dataRight = JSON.stringify(resRight);
})


/********************* Изменяет данные в списках *****************/
function changeDataList(dataDel, dataAdd) {
	for(let i = 0; i < dataDel.length; i++) {
		if (dataDel[i].uid === parseInt(userId)) {
			dataAdd.push(dataDel[i]);
			dataDel.splice(i, 1);
		}
	}
}


/********************* Выводит данные *****************/
function render(data, outRes) {
	let makeTemplate = Handlebars.compile(template.innerHTML);
	outRes.innerHTML = makeTemplate({ list: data });
}


/********************* Закрыть приложение *****************/
logOut.addEventListener('click', function(e) {
	mainApp.classList.add('hide');
	document.body.classList.remove('overlay');
	signIn.classList.remove('hide');
});






























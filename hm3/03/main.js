let array = [1, 2, 3, 4, 5, 6, 28, 35]
 

// ForEach 
function forEach(source, callBack) {
	for (let el of source) {
		callBack(el);
	}
}

forEach(array, item => console.log(item));



// Filter
function filter(source, callBack) {
	let arr = [];
	for (let el of source) {
		if (callBack(el)) {
			arr[arr.length] = el;
		}
	}
	return arr; 
}

let greaterThan4  = filter(array, item => item > 4);
console.log(greaterThan4);




// Map
function map(source, callBack) {
	let arr = [];
	for (let el of source) {
		arr[arr.length] = callBack(el);
	}
	return arr; 
}

let square = map(array, item => item * item);
console.log(square);




// Slice
function slice(source, begin = 0, end = source.length) {
	let arr = [];
	
	if (begin < 0) {
		let startElem = source.length + begin;
		for (let i = startElem; i < end; i++) {
			arr[arr.length] = source[i];
		}
		return arr;
	}
	if (end < 0) {
		let endElem = source.length + end;
		for (let i = begin; i < endElem; i++) {
			arr[arr.length] = source[i];
		}
		return arr;
	} else  {
		for (let i = begin; i < end; i++) {
			arr[arr.length] = source[i];
		}
		return arr;
	}
}

let result = slice(array, 2, -3);
console.log(result);





// Reduce
function reduce(source, callBack, initVal) {
	var rest = 0;

	for (let el of source) {
		rest = callBack(rest, el);
	}
	return rest;
}

let resultReduce = reduce(array, (prev,current) => prev + current);
console.log(resultReduce);
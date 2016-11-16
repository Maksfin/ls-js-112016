var allNumbers = [1, 2, 4, 5, 6, 7, 8],
someNumbers = [1, 2, 'привет', 4, 5, 'loftschool', 6, 7, 8],
noNumbers = ['это', 'массив', 'без', 'чисел'],    
emptyArr = [];

function isAllTrue(arr, filteFn) {
  if (!arr.length) {
    throw new Error('ошибка - пустой массив!');
  } else {
    for (var item of arr) {
      if(!filteFn(item)) {
        return false;
      }
    }
  }
  return true;
}

function filteFn(val) {
   return typeof val === 'number';
}

try {
  console.log(isAllTrue(allNumbers, filteFn));
  console.log(isAllTrue(someNumbers, filteFn));
  console.log(isAllTrue(noNumbers, filteFn));
  console.log(isAllTrue(emptyArr, filteFn));
} catch(e) {
  console.log(e.message);
}
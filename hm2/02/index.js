var allNumbers = [1, 2, 4, 5, 6, 7, 8],
someNumbers = [1, 2, 'привет', 4, 5, 'loftschool', 6, 7, 8],
noNumbers = ['это', 'массив', 'без', 'чисел'],
emptyArr = [];

function isSomeTrue(arr, filteFn) {
  if (!arr.length) {
    throw new Error('ошибка - пустой массив!');
  } else {
    for (var item of arr) {
      if(filteFn(item)) {
        return true;
      }
    }
  }
  return false;
}

function filteFn(val) {
   return typeof val === 'number';
}

try {
  console.log(isSomeTrue(allNumbers, filteFn));
  console.log(isSomeTrue(someNumbers, filteFn));
  console.log(isSomeTrue(noNumbers, filteFn));
  console.log(isSomeTrue(emptyArr, filteFn));
} catch(e) {
  console.log(e.message);
}
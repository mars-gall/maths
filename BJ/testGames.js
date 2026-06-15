// Source - https://stackoverflow.com/a/45920086
// Posted by Arg0n, modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-15, License - CC BY-SA 3.0

var array1 = [5, 4, 3, 2, 1];
var array2 = [];

const number = array1[1]
const index = array1.indexOf(4)


if (index > -1){
array2.push(number)
array1.splice(1, 1)
}


console.log(array1); //[2, 4]
console.log(array2); //[1, 3, 5]
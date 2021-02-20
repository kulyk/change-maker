const {makeChange} = require('./makeChange')

console.log(makeChange(6, [1,5,10,25]))
console.log(makeChange(6, [3,4]))
console.log(makeChange(6, [1,3,4]))

try {
	console.log(makeChange(6, [5,7]))
} catch (err) {
	console.log(err.message)
}

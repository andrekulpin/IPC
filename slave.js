const http = require('http');
const IPC = require('./index');
const P = require('bluebird');

const parent = IPC( process );

console.log('asdasdasda')


parent.on('fuckyou', function(){
	return 'fuckYou!!!';
})

setInterval(function(){
	console.log('all_good')
}, 1000)



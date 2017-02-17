const http = require('http');
const IPC = require('./index');
const P = require('bluebird');

const parent = IPC( process );


http.createServer(function(req, res){
	res.end('boyyyy');
}).listen(1234);


parent.emit('getSalary', function(){

});


// function getMoney(){
// 	return new P(function(resolve, reject){
// 		setTimeout(function(){
// 			resolve(~~(Math.random() * 1000));
// 		}, 100)
// 	});
// }
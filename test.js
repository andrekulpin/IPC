const IPC = require('./index');
const { spawn }  = require('child_process');
const { join } = require('path');
const path = join( __dirname, 'child.js' );
const P = require('bluebird')

const proc = spawn('node', [ path ]);

const child = IPC( proc )


// proc.stdout.on('data', function(data){
// 	console.log(data.toString())
// })

proc.stderr.on('data', function(data){
	console.log(data.toString())
})

// child.on('getSalary', function(){
// 	console.log(12312)
// 	return 555;
// })

//child.on('getSalary', getMoney)

child.emit('getSalary', function( data, das ){
	console.log(12312)
	console.log(das + '')
	console.log(data)
})

// child.on( 'getMoney', function( data ){
// 	console.log( data );
// });

function getMoney(){
	return new P(function(resolve, reject){
		setTimeout(function(){
			resolve(~~(Math.random() * 1000));
		}, 100)
	});
}
const IPC = require('./index');
const { spawn }  = require('child_process');
const { join } = require('path');
const path = join( __dirname, 'child.js' );

const proc = spawn('node', [ path ]);

const child = IPC( proc )


proc.stderr.on('data', function(data){
	console.log(data.toString())
})

// child.on('getSalary', function(){
// 	console.log(12312)
// 	return 555;
// })

// child.emit( 'getMoney', function( data ){
// 	console.log( data );
// });
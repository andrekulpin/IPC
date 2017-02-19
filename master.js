const IPC = require('./index');
const { spawn }  = require('child_process');
const { join } = require('path');
const path = join( __dirname, 'slave.js' );
const P = require('bluebird')

const child = spawn( 'node', [ path ] );

const slave = IPC( child );

slave.emit('fuckyou', function*(err, data){
	console.log(data)
})


function wait(){

}
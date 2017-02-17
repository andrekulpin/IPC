const uuid = require('uuid-v4');
const isJson = require('is-json');

function IPC( process ){
	this.stdout = process.stdout;
	this.stdin = stdin.stdin;
	this.methods = {};
	this.calls = {}
}

IPC.prototype.register = function( name, handler ){
	this.methods[ name ] = handler;
	this.stdout.on( 'data', function( message ){
		message = message.toString().trim();
		if(isJson( message )){
			var json = JSON.parse( message );
			if( json['ipc'] ){
				let id = json['id'];
				let callback = this.calls[ id ];
				if( callback ){

				}
				
				json['id']
			}
		}
		
	});
}

IPC.prototype.send = function( method, params, callback ){
	let id = callback ? uuid() : void 0; //no null, cause JSON.stringify keeps a property around
	var message = JSON.stringify({
		ipc: '1.0',
		id: uuid,
		method: method,
		params: params
	});
	this.registerCall( id, callback );
	this.stdin.write( message );
}


IPC.prototype.__registerCall = function( id, callback ){
	this.calls[ id ] = callback || true;
}

module.exports = function(){



}

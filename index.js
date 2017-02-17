const uuid = require('uuid-v4');
const isJson = require('is-json');
const assert = require('assert');
const _ = require('lodash');
const EventEmitter = require('events').EventEmitter;//delete
const co = require('co');

function IPC( process ){
	if(!(this instanceof IPC)) return new IPC( process );
	EventEmitter.call( this );//delete
	this.stdout = process.stdout;
	this.stdin = process.stdin;
	this.methods = {};
	this.calls = {};
}


IPC.prototype.init = function(){

	const self = this;

	var handler = co.wrap(function * ( message ){
		let json = getJSON( message );
		if( !json ) return;
		let { id, result, error } = json;
		if( result || error ){

			let callback = self.calls[ id ];
			if( callback ){
				return yield callback( ...[ err, res ] );
			}
		}
		let { method: name, params } = json;
		let method = self.methods[ name ];
		if( method ){
			var res, err;
			try{
				res = method();
			} catch(e){
				err = e;
			}
			//self.emitResponse(id, res, err);
		}
	});

	self.stdout.on('data', handler);


	return this;
}

function getJSON( message ){
	message = message.toString().trim();
	if(!isJson( message )) return;
	let json = JSON.parse( message );
	if(!json['ipc']) return;
	return json;
}

IPC.prototype.on = function( name, handler ){
	this.methods[ name ] = handler;

}

IPC.prototype.emitResponse = function( id, result, error ){
	var message = JSON.stringify({
		ipc: '1.0',
		id: id,
		result: result,
		error: error
	});
	this.stdin.write( message );
}

IPC.prototype.emit = function( method, ...args ){
	let [ callback, params ] = _.isFunction( args[0] )
		? args 
		: _.reverse( args );
	let id = uuid();
	var message = JSON.stringify({
		ipc: '1.0',
		id: id,
		method: method,
		params: params
	});
	callback && this.__registerCall( uuid, callback );
	this.stdin.write( 'message' );
}

// IPC.prototype.sendResponse = function( id, result, error ){
// 	let id = callback ? uuid() : void 0; //no null, cause JSON.stringify keeps a property around
// 	var message = JSON.stringify({
// 		ipc: '1.0',
// 		id: uuid,
// 		method: method,
// 		params: params
// 	});
// 	this.registerCall( id, callback );
// 	this.stdin.write( message );
// }

function sendResponse(){

}

function sendRequest(){
	
}


IPC.prototype.__registerCall = function( id, callback ){
	this.calls[ id ] = callback;
}


module.exports = function( process ){
	assert( process );
	return IPC( process ).init();
}

// function isGenerator( obj ){
// 	const constructor = obj.constructor;
// 	if( !constructor ) return false;
// 	return 'GeneratorFunction' === constructor.name
// }

// co(function * (){

// 	var boy = yield (function * (boy){
// 		var y = yield foo()
// 		return y;
// 	})('sdsds');
// 	console.log(boy)

// })
// .catch(function(err){
// 	console.log(err)
// })

// function *foo(){
// 	return 123;
// }



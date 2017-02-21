const uuid = require('uuid-v4');
const utils = require('./lib/utils');
const co = require('co');
const carrier = require('carrier');

function IPC( proc ){
	if(!(this instanceof IPC)) return new IPC( proc );
	this.process = proc;
	this.emitter = proc.stdout;
	this.listener = proc.stdin;
	this.methods = {};
	this.calls = {};
}

IPC.prototype.init = function(){
	const self = this;
	if( self.process !== process ){
		self.emitter = self.listener;
		self.listener = self.process.stdout;
	}
	var handler = co.wrap(function * ( message ){
		let json = utils.getJSON( message );
		if( !json ) return;
		let { id, result, error } = json;
		if( result || error ){
			let callback = self.calls[ id ];
			if( callback ){
				return yield utils.callFunction( callback, error, result );
			}
		}
		let { method: name, params } = json;
		let method = self.methods[ name ];
		if( method ){
			let { res, err } = yield utils.callFunction( method, params );
			__emitResponse.call( self, id, res, err );
		}
	});
	carrier.carry( self.listener, handler );
	return this;
}

IPC.prototype.on = function( name, handler ){
	this.methods[ name ] = handler;
}

IPC.prototype.once = function( name, handler ){
	const self = this;
	this.methods[ name ] = function*( ...args ){
		delete self.methods[ name ];
		return yield handler( ...args );
	};
}

IPC.prototype.emitResponse = function( id, result, error ){

}

IPC.prototype.emit = function( method, ...args ){
	let callback;
	let params;
	if(args.length){
		callback = typeof args[args.length - 1] === 'function'
			? args.pop() 
			: void 0;
		params = args;
	}
	let id = callback && uuid();
	var message = JSON.stringify({
		ipc: '1.0',
		id: id,
		method: method,
		params: params
	});
	id && __registerCall.call( this, id, callback );
	this.emitter.write( message + '\n' );
}

function __emitResponse( id, result, error ){
	var message = JSON.stringify({
		ipc: '1.0',
		id: id,
		result: result,
		error: error
	});
	this.emitter.write( message );
}

function __registerCall( id, callback  ){
	this.calls[ id ] = callback;
}

module.exports = function( proc ){
	return IPC( proc ).init();
}
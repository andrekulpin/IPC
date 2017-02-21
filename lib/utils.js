const isJson = require('is-json');

exports.isGenerator = isGenerator;

function isGenerator( obj ){
	const constructor = obj.constructor;
	if( !constructor ) return false;
	return 'GeneratorFunction' === constructor.name
}

exports.callFunction = callFunction;

function *callFunction( fn, ...args ){
	let res, err;
	try{
		if(isGenerator( fn )){
			res = yield fn( ...args );
		} else {
			res = fn( ...args );
			if(res && res.then){
				res = yield res;
			}
		}
	} catch(e){
		err = e;
	}
	return {
		err, res
	}
}

exports.getJSON = getJSON;

function getJSON( data ){
	if( !data ) return;
	data = data.toString().trim();
	if( !isJson( data )) return;
	let json = JSON.parse( data );
	if( !json['ipc']) return;
	return json;
}
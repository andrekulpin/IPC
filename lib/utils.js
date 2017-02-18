exports.isGenerator = isGenerator;

function isGenerator( obj ){
	const constructor = obj.constructor;
	if( !constructor ) return false;
	return 'GeneratorFunction' === constructor.name
}

exports.callFunction = callFunction;

function *callFunction( fn, params ){
	let res, err;
	try{
		if(isGenerator( fn )){
			res = yield fn(...[ params ]);
		} else {
			res = method(...[ params ]);
			if(res.then){
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
	if( !isJson( data )) return;
	let json = JSON.parse( data );
	if( !json['ipc']) return;
	return json;
}
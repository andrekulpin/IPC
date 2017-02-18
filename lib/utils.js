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
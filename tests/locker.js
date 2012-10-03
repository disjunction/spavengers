var t = (new Date()).getTime();

function dooo() {
	var z = 1;
	for (var i=0; i<100000000; i++) {
		z += Math.sin(Math.random());
	}
	console.log('done');
	
	t2 = (new Date()).getTime();
	console.log('t: ' + (t2 - t));
	
	t = t2;
}

setInterval(dooo, 10000);
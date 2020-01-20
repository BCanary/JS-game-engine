function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rgba(r,g,b,a) {
	return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function toDeg(value) {
	return value * Math.PI / 180
}

function toRad(value) {
	return value * Math.PI / 180
}

function sqrt(val) {
	return Math.sqrt(val)
}

function pow(val) {
	return Math.pow(val, 2);
}

function scaleWorld(x,y,scale) {
	eParseLayers(function(e,i) {
		e.scale.x=scale
		e.scale.y=scale
	});
	camera.x=x
	camera.y=y
}

function scaleWorldto(obj,scale) {
	x = scale*obj.x - canvas.width/2 
	y = scale*obj.y - canvas.height/2
	scaleWorld(x,y,scale)
}

function saveMemory(save) {
	this.save = save

	this.restore = function(object, destroy) {
		for(key in save) {
			object[key] = this.save[key]
		}
		if(destroy) {
			delete this
		}
	}

}


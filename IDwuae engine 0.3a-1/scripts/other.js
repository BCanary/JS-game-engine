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

function saveObj(obj) {
	this.obj = obj
	for(key in obj) {
		this[key] = this.obj[key];
	}

	this.restore = function() {
		for(key in this) {
			this.obj[key] = this[key];
		}
		delete this;	
	}
}


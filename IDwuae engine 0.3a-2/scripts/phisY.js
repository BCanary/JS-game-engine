function Collision(obj1, obj2) {
	if(obj1.x + obj1.w + obj1.velocity.x>= obj2.x &&
	   obj2.x + obj2.w + obj2.velocity.x>= obj1.x &&
	   obj1.y + obj1.h + obj1.velocity.y>= obj2.y &&
	   obj2.y + obj2.h + obj2.velocity.y>= obj1.y) {
		return true
	} 
	else {
		return false	
	}
}

function CollisionLeft(obj1, obj2) {
	if(obj1.x + obj1.w + obj1.velocity.x>= obj2.x) {
		return true
	} 
	else {
		return false	
	}
}

function CollisionRight(obj1, obj2) {
	if(obj2.x + obj2.w + obj2.velocity.x>= obj1.x) {
		return true
	} 
	else {
		return false	
	}
}

function CollisionTop(obj1, obj2) {
	if( obj1.y + obj1.h + obj1.velocity.y>= obj2.y) {
		return true
	} 
	else {
		return false	
	}
}

function CollisionBottom(obj1, obj2) {
	if( obj2.y + obj2.h + obj2.velocity.y>= obj1.y) {
		return true
	} 
	else {
		return false	
	}
}

function Vector2D(x,y) {
	this.vector = [x,y];
}

world = {
	'gravity': 0.1,
	'air_friction': 1
}

//fps = 15


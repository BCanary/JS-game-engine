function Collision(obj1, obj2) {
	if(obj1.x + obj1.w + obj1.vx >= obj2.x &&
	   obj2.x + obj2.w + obj2.vx >= obj1.x &&
	   obj1.y + obj1.h + obj1.vy >= obj2.y &&
	   obj2.y + obj2.h + obj2.vy >= obj1.y) {
		return true
	} 
	else {
		return false	
	}
}

function Vector2D(x,y) {
	this.vector = [x,y];
}
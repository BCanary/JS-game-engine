WaitLoad(function(){

	eResizeCanvas();
	box = new eObject({
		'x': 2000,
		'y': 100,
		'w': 100,
		'h': 100,
		'mass': 10,
		'axis_x': 0,
		'axis_y': 0,
		'phisic': true,
		'draw': function() {
			
			ctx.fillStyle = "black"
			ctx.fillRect(this.x,this.y,this.w,this.h);

			ctx.fillStyle = "blue"
			ctx.fillRect(this.x + this.w + this.vx, this.y, 3, this.h)
			ctx.fillStyle = "blue"
			ctx.fillRect(this.x, this.y + this.h + this.vy, this.w, 3)
		}
	});

	box2 = new eObject({
		'x': 2600,
		'y': 100,
		'w': 100,
		'h': 100,
		'mass': 10,
		'axis_x': 0,
		'axis_y': 0,
		'phisic': true,
		'vx': 0,
		'draw': function() {
			ctx.fillStyle = "red"
			
			ctx.fillRect(this.x,this.y,this.w,this.h);	
			ctx.fillStyle = "blue"
			ctx.fillRect(this.x + this.vx, this.y, 3, this.h)
			ctx.fillStyle = "blue"
			ctx.fillRect(this.y + this.vy, this.y, 3, this.h)
		}
	});

	fps = 60


	ground = new eObject({
		'x': 0,
		'y': canvas.height-100,
		'w': 10000,
		'h': 100,
		'mass': 1000000,
		'axis_x': 0,
		'axis_y': 0,
		'draw': function() {
			ctx.fillStyle = "green"
			ctx.fillRect(this.x,this.y,this.w,this.h);
		},
		'update_object': function() {
			this.vx = 0;
			this.vy = 0;
		}
	});
	setup(function(){
		eResizeCanvas();
	});

	layers.forEach(function(e){
		e.scale_x = 1
		e.scale_y = 1
	});
	collision = false
	box.vx = 15;

	loop(function(){
		dt = delta_time;
		eClearCanvas();

		camera.x = box.x-canvas.width/2
		camera.y = box.y-canvas.height/4
		parseCollisions(function(e,e2) {
			if(Math.abs(e.vy) < 2) {
				e.vy = 0
			}
			e.vy = e2.vy
			e.vy = -e.vy
			

			e2.vx = e.vx
			e.vx = -e.vx
		});

		
		//console.log(box.vy)
	});

});

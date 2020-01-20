WaitLoad(function(){
	eResizeCanvas();
	/*for(var i = 0; i < 10; i++) {
		box = new eObject({
			'x': canvas.width/4+i*60,
			'y': canvas.height/2-100,
			'w': 30,
			'h': 30,
			'color': rgba(random(0,255),random(0,255),random(0,255),1),
			'text': i,
			'rigid': new rigid2D(this),
			'draw': function() {
				ctx.fillStyle = this.color
				ctx.fillRect(this.x, this.y, this.w, this.h);
				ctx.fillStyle = "white"
				ctx.fillText(this.text,this.x+7,this.y+13)
			},
			'logic': function() {
				this.rigid.update();
				this.y+=this.rigid.velocitys.y
				this.x+=this.rigid.velocitys.x
			}
		});
	}*/

	player = new eObject({
			'x': 100,
			'y': canvas.height/2-130,
			'w': 30,
			'h': 30,
			'color': rgba(random(0,255),random(0,255),random(0,255),1),
			'text': "player",
			'vy': 0,
			'draw': function() {
				ctx.fillStyle = this.color
				ctx.fillRect(this.x, this.y, this.w, this.h);
				ctx.fillStyle = "white"
				ctx.fillText(this.text,this.x+7,this.y+13)
			},
			'logic': function() {
				this.y += this.velocity.y;
			}
		});
	ground = new eObject({
			'x': -100,
			'y': canvas.height-100,
			'w': 2000,
			'h': 100,
			'color': rgba(random(0,255),random(0,255),random(0,255),1),
			'text': "ground",
			'draw': function() {
				ctx.fillStyle = this.color
				ctx.fillRect(this.x, this.y, this.w, this.h);
				ctx.fillStyle = "white"
				ctx.fillText(this.text,this.x+7,this.y+13)
			}
		});

	trigger = new eObject({
			'x': -1000,
			'y': canvas.height+100,
			'w': 6000,
			'h': 100,
			'color': rgba(random(0,255),random(0,255),random(0,255),0.1),
			'text': "death",
			'draw': function() {
				ctx.fillStyle = this.color
				ctx.fillRect(this.x, this.y, this.w, this.h);
				ctx.fillStyle = "white"
				ctx.fillText(this.text,this.x+7,this.y+13)
			}
		});

	box = new eObject({
			'x': 100,
			'y': canvas.height-200,
			'w': 100,
			'h': 100,
			'color': rgba(random(0,255),random(0,255),random(0,255),1),
			'text': "box",
			'draw': function() {
				ctx.fillStyle = this.color
				ctx.fillRect(this.x, this.y, this.w, this.h);
				ctx.fillStyle = "white"
				ctx.fillText(this.text,this.x+7,this.y+13)
			}
		});
	box2 = new eObject({
			'x': 100,
			'y': canvas.height-300,
			'w': 100,
			'h': 100,
			'color': rgba(random(0,255),random(0,255),random(0,255),1),
			'text': "box",
			'draw': function() {
				ctx.fillStyle = this.color
				ctx.fillRect(this.x, this.y, this.w, this.h);
				ctx.fillStyle = "white"
				ctx.fillText(this.text,this.x+7,this.y+13)
			}
		});

	grounded = false
	function playerControl() {
		var pv = player.velocity
		if(grounded && 87 in keys_down) {
			pv.y-=5;
		}
		/*if(83 in keys_down) {
			pv.y++;
		}*/
		if(65 in keys_down) {
			player.x--;
		}
		if(68 in keys_down) {
			player.x++;
		}
	}

	function playerGravity() {
		player.velocity.y+=0.1;
	}

	setup(function(){
		eResizeCanvas();
	});
	loop(function(){
		dt = delta_time;
		eClearCanvas();
		scaleWorldto(player,1);
		playerControl();
		eParseLayers(function(e,i) {
			if(e != player && Collision(player, e)) {
				if(e.text == "death") {
					player.x = 100
					player.y = 100
				}

					var pc = {'x': player.x + player.w/2,
							 'y': player.y + player.h/2}
					var ec = {'x': e.x + e.w/2,
							 'y': e.y + e.h/2}
					var d = {'x': pc.x-e.x, 'y': pc.y-e.y};

					if(d.y < 0) {
						player.y-=player.y+player.h-e.y
					}
					//if(d.x < 0) {
					//	player.x-=player.x+player.w-e.x
					//}
					//if(d.y > 0) {
					//	player.x-=player.x-e.x+e.h
					//}
					if(d.x > 0 && d.x < 0) {
						player.x-=player.x-e.x+e.w
					}
 					player.y += player.velocity.y
					player.velocity.y = 0
					grounded = true
			} else if (e != player) {
				grounded = false
			}
		});
		if(!grounded) {
			playerGravity();
		}

	});
});

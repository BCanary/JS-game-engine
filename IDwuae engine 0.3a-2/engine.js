

canvas_id = "game_canvas"
canvas = document.getElementById(canvas_id);
ctx = canvas.getContext("2d");

/*
	ПАМЯТКА
	Базовый канвас игры имеет ID - game_canvas

	Создать игровой цикл можно с помощью

	my_cycle = new eGameLoop(loop, 60);
	loop - первый аргумент в нем dt!!! Обязателен!!!
	60 - кол-во FPS

	Рисовать что-то можно с помощью eDrawLayers();

	Все что должно быть нарисовано находится в массиве
	layers

	eDrawLayers принимает обязательный аргумент dt!!!

	Он вызывает у объекта функцию draw которая тоже должна
	обязательно принимать dt!!!

	кординаты мыши - mouseX, mouseY

	Random(min,max) - рандомайзер

	Клавиши устроены очень просто, если хочется сделать
	проверку нажатия на клавишу то нужно написать так -

	if(68 in keys_down) {
		player.move()
	}
	if(68 in keys_down && 16 in keys_down) {
		player.move_fast()
	}

	Спрайт листы - создание спрайт листа, разрубка его на
	части, которые можно будет после индексировать

	heroSL = new eSpriteList(ПУТЬ_К_КАРТИНКЕ.png, ширина фото, высота фото,
											ширина спрайта, высота спрайта)
	
	Разрубается спрайт лист слева направо, сверху вниз
	просмотреть спрайт можно с помощью - heroSL.drawSprite(индекс, x, y)

	Изображение - img = new eImage(ПУТЬ_К_КАРТИНКЕ.png)

	img.image - картинка img.image.src - путь к ней

	img.draw(x,y)

	img.drawSize(x,y,w,h) - задать размер

	img.srawCut(x,y,w,h,cx,cy,cw,ch) - нарисовать только кусочек
	c - обрезанная часть

	Анимации - anim = new eAnimation(eSpriteList, 
									[индексы, в, порядке, анимации],
									скорость анимации)

	anim.speed - скорость анимации

	anim.a - ускорение анимации

	anim.play(x,y,сколько раз повторить) - повторять бесконечно = -1
	anim.stop() - остановить анимацию

*/

// CANVAS BLOCK BEGIN
layers = []
function eResizeCanvas() { // Переделать разрешение под окно
	canvas.width = window.innerWidth-5;
	canvas.height = window.innerHeight-5;
}

function eClearCanvas() { // Очистить холст
	ctx.clearRect(0,0,canvas.width, canvas.height)
}

function eDrawLayers() { // Отрисовка слоев
	layers.forEach(function(e,i){
		e.update();
	});
}

function eParseLayers(func) {
	for(var i = 0; i < layers.length; i++) {
		let e = layers[i];
	    func(e, i)
	}
}

function eGroup(objects) { // Objects - Array
	this.objects = objects

	this.update = function() {
		this.objects.forEach( function(object) {
			object.draw();
		});
	}

	layers.push(this)
}

camera = {
	'x': 0,
	'y': 0
}

function eObject(params, params2) {
	// STANDART VARS
	this.x = 0
	this.y = 0

	this.velocity = {
		'x': 0,
		'y': 0
	}

	this.w = 0
	this.h = 0

	this.center_axis = {
		x: 0,
		y: 0
	}
	this.angle = 0
	this.scaleble = true
	this.scale = {
		x: 1,
		y: 1
	}

	this.camera_pushing = true

	this.collision_points = []
	// STANDART FUNCTIONS
	this.draw = function() {
		ctx.fillRect(this.x,this.y,this.w,this.h)
	};
	this.logic = function() {}; 
	// CUSTOM VARS
	for(key in params) {
		this[key] = params[key];
	}
	for(key in params2) {
		this[key] = params[key];
	}
	// UPDATE FUNCTION
	this.update = function() {
		// SCALE CHECK
		if(!this.scaleble) {
			this.scale = {
				x: 1,
				y: 1
			}
		}
		// CAMERA CHECK
		var cam_x = camera.x
		var cam_y = camera.y

		if(!this.camera_pushing) {
			cam_x = 0
			cam_y = 0
		}
		// LOGIC
		this.logic();

		//POLYGONS
		// DRAW
		let cx = (this.x*this.scale.x+this.center_axis.x-cam_x)
		let cy = (this.y*this.scale.y+this.center_axis.y-cam_y)
		//SAVE CONTEXT SETTINGS
		ctx.save();
		let mem = new saveMemory({'x':this.x,'y':this.y,'w':this.w,'h':this.h}); // Save some variables

		ctx.translate(cx,cy);
		ctx.rotate(this.angle); // Rotate to angle by radians

		this.x = -this.center_axis.x
		this.y = -this.center_axis.y

		this.w *= this.scale.x
		this.h *= this.scale.y

		this.draw();

		// RESTORE CANVAS SETTINGS
		ctx.restore();
		mem.restore(this, true); // Restore object variables
	}
	layers.push(this);
}
// AUDIO BEGIN
audio_stram = []
function eAudioInStream(audio) {
	this.new_audio = new Audio();
	this.new_audio.src = audio.src
	this.stop = function() {
		this.new_audio.pause();
		delete this;
	}
	this.play = function() {
		this.new_audio.play();
	}
	
}
function eAudio(audio) {
	this.audio = new Audio();
	this.audio.src = audio
	this.play = function() {
		this.new_audio = new eAudioInStream(this.audio);
		this.new_audio.play();
		//this.play_now_count++;
	}
	this.stop = function() {
		this.audio.stop()
	}
}
// IMAGE BEGIN

function eImage(image) {
	if(typeof(image) == 'string') {
		this.image = new Image();
		this.image.src = image
	} else if (typeof(image) == 'object') {
		this.image = image
		this.image.src = image.src
	}

	this.w = this.image.width
	this.h = this.image.height 


	this.draw = function(x,y) {
		ctx.drawImage(this.image, x, y);
	}

	this.drawSize = function(x,y,w,h) {
		ctx.drawImage(this.image, x, y, w, h);
	}

	this.drawCut = function(x,y,w,h,cx,cy,cw,ch){
		ctx.drawImage(this.image, x, y, w, h, cx,cy,cw,ch);
	}
}

function eCutter(sprite,x,y,w,h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.s = sprite;

	this.draw = function(x,y) {
		this.s.drawCut(this.x,this.y,this.w,this.h,x,y,this.w,this.h);
	}

	this.drawSize = function(x,y,w,h) {
		this.s.drawCut(this.x,this.y,this.w,this.h,x,y,w,h);
	}
}

// IMAGE END

// CANVAS BLOCK END


// SPRITE WORK {
function eSpriteList(src, w, h) {
	this.sprite_list = new eImage(src)
	this.w = w // sprite
	this.h = h // sprite

	this.sprites = []


	this.loaded = false
	
	var sl = this.sprite_list
	var sp = this.sprites
	var w = this.w
	var h = this.h

	var t = this

	sl.image.onload = function() {
		for(var i = 0; i*h < sl.image.height; i++) {
			for(var j = 0; j*h < sl.image.width; j++) {
				sp.push({'x':j*w, 'y': i*h});
			}
		}
		t.loaded = true
	}

	this.drawSprite = function(x,y,w,h,i) {
		s = this.sprites
		if(this.loaded && s != undefined) {
			this.sprite_list.drawCut(s[i].x,s[i].y,this.w,this.h,x,y,w,h);
		}
	}
}

function eAnimation(sprite_list, animation, speed) {
	this.sprite_list = sprite_list
	this.animation = animation

	this.playing_now = 0
	this.repeat_count_now = 0

	this.repeat_count = 0

	this.playing = false

	this.speed = speed

	this.a = 1

	this.x = 0
	this.y = 0

	this.playNext = function() {
		if (this.repeat_count_now >= this.repeat_count && this.repeat_count != -1) {
			this.stop();
		}
		else if(this.playing_now < this.animation.length-1) {
			this.playing_now++;
		}
		else {
			this.repeat_count_now++;
			this.playing_now = 0
		}
	}

	this.play = function(x,y,w,h,repeat_count) {
		this.x = x
		this.y = y

		this.sprite_list.drawSprite(this.x,this.y,this.w,this.h,this.animation[this.playing_now])
		if(!this.playing) {
			this.repeat_count = repeat_count
			if(repeat_count == -1) {
				this.animation_loop = setInterval(function(parent) {parent.playNext()}, 1000/this.speed*this.a, this)
			}
			else if(repeat_count >= 1) {
				this.animation_loop = setInterval(function(parent) {parent.playNext()}, 1000/this.speed*this.a,this)
			}
			this.playing = true
		} //else return true // END OF ANIM = TRUE
	}

	this.stop = function() {
		if(this.playing) {
			clearInterval(this.animation_loop);
			this.playing = false

			this.playing_now = 0
			this.repeat_count_now = 0

			this.repeat_count = 0
		}
	}
}
// SPRITE WORK }



// GAME LOOP BEGIN
delta_time = 0
function eGameLoop(main_func, fps) { // func - функция для повторения
	this.dt = 0
	this.fps = 1000/fps
	this.time_point = Date.now()
	this.loop = setInterval(function(){},1000);

	this.main_func = function(dt) {
		dt = Date.now() - this.time_point;
		delta_time = dt;
		main_func(dt);
		this.time_point = Date.now();
	}

	this.reboot = function() { // Нужна перезагрузка для обновления фпс или функции
		this.fps = 1000/fps
		clearInterval(this.loop);
		this.time_point = Date.now()
		this.loop = setInterval(function(par)
			{
				par.main_func(par.dt);
			}, 
			this.fps,this);
	}
	this.reboot()
}


    

// GAME LOOP END

// KEYS AND MOUSE BEGIN

var mouseX = 0;
var mouseY = 0;

canvas.onmousemove = function(evt) {
    var rect = this.getBoundingClientRect();
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
}

// KEYBOARD
keys_down = []
//keys_command = []
addEventListener('keydown', function(e) {
	keys_down[e.keyCode] = e.keyCode;
});
addEventListener('keyup', function(e) {
	keys_down.splice(e.keyCode);
});

mousedown = false
addEventListener('mousedown', function(e) {
	mousedown = true
});
addEventListener('mouseup', function(e) {
	mousedown = false
});
function eKey(code) {
	this.code = code;
	this.pressed = false

	this.press = function() {
		if(this.code in keys_down && !this.pressed) {
			this.pressed = true
			return true
		} else if (!(this.code in keys_down)) {
			this.pressed = false
			return false
		}
	}

	this.hold = function() {
		if(this.code in keys_down) {
			this.pressed = true
			return true
		} else {
			this.pressed = false
			return false
		}
	}
}
//---------
//setInterval(function(e){console.log(keys_down)}, 1000)
// KEYS AND MOUSE END

// VIRTUAL THINGS

function eButton(x,y,w,h,args) {
	this.x = x
	this.y = y
	this.w = w
	this.h = h
	// STANDART ARGS
	
	this.text = "Press";
	this.font_size = this.w/8;
	this.font = this.font_size + "px Arial";
	this.pressed = false;
	this.btn_color = rgba(0,0,255,1);
	this.text_color = rgba(255,255,255,1);
	this.btn_press_color = rgba(100,100,255,1)
	this.text_press_color = rgba(255,255,255,1);
	this.command = function(inst) {
		console.log("\"" + inst.text + "\" button is pressed");
	};

	// Custom args
	for(var arg in args) {
		this[arg] = args[arg];
	}

	this.on_state = function() {
		ctx.save();
		ctx.fillStyle = this.btn_color;
		ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.fillStyle = this.text_color;
		ctx.font = this.font
		ctx.fillText(this.text, this.x+this.w/2-(this.text.length*this.font_size/4), this.y+this.h/2);
		ctx.restore();
	}
	this.on_press = function() {
		ctx.save();
		ctx.fillStyle = this.btn_press_color;
		ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.fillStyle = this.text_press_color;
		ctx.font = this.font
		ctx.fillText(this.text, this.x+this.w/2-(this.text.length*this.font_size/4), this.y+this.h/2);
		ctx.restore();
	}
	this.draw_status = this.on_state
	this.draw = function() {
		this.draw_status();
	}
	this.update_object = function() {
		if(mousedown && eCollision({
			'x':mouseX, 'y':mouseY, 'w':0, 'h':0
		},this)) {
			if(!this.hold) {
				this.pressed = true
			} else this.pressed = false	
			this.hold = true		
			this.draw_status = this.on_press
			this.command(this);
		} else {
			this.draw_status = this.on_state
			this.hold = false
		}
	}
}


// Initialize
var _startLoading = Date.now()

function _addElement(type,name,src,func) {
	this.s = document.createElement(type);
	this.name = name
	var var_name = type + "_" + this.name
	window[var_name] = this.s;
	s.onload = function() {
		func()
	}
	this.s.src = src
	if(type == "script") {
		document.body.appendChild( this.s );
	}
}

function _obj_len(obj) {
	var len = 0
	for(k in obj) {
		len++
	}
	return len
}

setup_functions = []
loop_functions = []
function setup(func) {
	setup_functions.push(func)
}
function loop(func) {
	loop_functions.push(func)
}
function parseSetupFunctions() {
	setup_functions.forEach(function(e){
		e();
	});
}
function parseLoopFunctions() {
	loop_functions.forEach(function(e){
		e();
	});
}

_loaded_count = 0
cfg_sc_len = 0
fps = 60

function WaitLoad(func) {
	cfg_sc_len++;
	func();
	_loaded_count++;
}

_addElement("script","config","config.js", function() {
	for(key in config) {
		cfg_sc_len += _obj_len(config[key])
		for(key2 in config[key]) {
			e = config[key]
			
			_addElement(key, key2 ,e[key2], function() {
				//console.log(key, key2, e[key2])
				_loaded_count++;
			});
		}
	}
});

_do_draw_layers = true

wait_loading = setInterval(function() {
	//console.log(_loaded_count, "/", cfg_sc_len);
	if(_loaded_count == cfg_sc_len) {
		console.log('All elements is loaded')

		parseSetupFunctions();

		game_loop = new eGameLoop(function(){
			parseLoopFunctions();
			if(_do_draw_layers) {
				eDrawLayers();
			}
		}, fps);
		clearInterval(wait_loading);
	}
},50);

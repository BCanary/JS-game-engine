function Random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

canvas_id
canvas = document.getElementById("game_canvas");
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
function eDrawLayers(dt) { // Отрисовка слоев
	layers.forEach(function(e,i){
		e.draw(dt);
	});
}
eResizeCanvas();

// IMAGE BEGIN

function eImage(src) {
	this.image = new Image();
	this.image.src = src

	var w = 0;
	var h = 0;

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
function eSpriteList(src, slw, slh, w, h) {
	this.sprite_list = new eImage(src)
	this.w = w // sprite
	this.h = h // sprite

	this.slw = slw // sprite list
	this.slh = slh // sprite list
	this.sprites = []
	
	for(var i = 0; i*h < this.slh; i++) {
		for(var j = 0; j*w < this.slw; j++) {
			this.sprites.push({'x':j*w, 'y': i*h});
		}
	}

	this.drawSprite = function(x,y,i) {
			s = this.sprites
			console.log()
			this.sprite_list.drawCut(s[i].x,s[i].y,this.w,this.h,x,y,this.w,this.h);
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

	this.play = function(x,y,repeat_count) {
		this.x = x
		this.y = y

		this.sprite_list.drawSprite(this.x,this.y,this.animation[this.playing_now])
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
function eGameLoop(main_func, fps) { // func - функция для повторения
	this.dt = 0
	this.fps = 1000/fps
	this.time_point = Date.now()
	this.loop = setInterval(function(){},1000);

	this.main_func = function(dt) {
		dt = Date.now() - this.time_point;
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
//---------
//setInterval(function(e){console.log(keys_down)}, 1000)
// KEYS AND MOUSE END


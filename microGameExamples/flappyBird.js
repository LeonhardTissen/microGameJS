loadSound('Flap', 'microGame/assets/flap.mp3');
loadSound('Death', 'microGame/assets/punch.mp3');
loadSound('Score', 'microGame/assets/flappyscore.mp3');
loadImage('Player', 'microGame/assets/flappybird.png');
loadImage('Pipe', 'microGame/assets/pipe.png')

microGame({
	width: 1000,
	height: 700,
	noscaling: false,
	pixelated: false,
	bodybackground: '#4D97FF',
	gamebackground: '#FFFFFF',
	debug: true
});

function spawnPipe(y, flipped) {
	new GameElement({
		name: "Pipe",
		type: "Image",
		src: "Pipe",
		x: 1050,
		y: y,
		width: 96,
		height: 800,
		mirroredy: flipped,
		continuousx: -5
	});
};
function gameOver() {
	playSound('Death');
	player.yvel = 0;
	alive = false;
	setTimeout(restart, 1000)
};
function start() {
	alive = true;
	in_the_air = false
	counter = new GameElement({
		type: "Number",
		width: 50,
		prefix: 'Score: ',
		x: 10,
		y: 10
	});
	player = new GameElement({
		name: "Player",
		type: "Image",
		src: "Player",
		x: 100,
		y: 600,
		width: 85,
		height: 60,
		frames: 3,
		frametime: 10,
		bounciness: 0,
		physics: true,
		collidewalls: true,
		gravityy: 0.5,
		continuousr: 0.03
	});
};
restart();

function draw() {
	if (!alive) {
		player.rotation = Math.PI;
		return;
	}
	if (in_the_air) {
		if (player.rotation > 0.8) {
			player.rotation = 0.8;
		}
		if (player.y >= 670) {
			gameOver();
		}
	} else {
		player.y = 400;
		time = 0;
		player.rotation = 0;
	}
    if (keyPress('ArrowUp')) {
        player.yvel = -10;
		playSound('Flap');
		in_the_air = true;
		player.rotation = -0.8;
    }
	if (everyNthTick(80)) {
		const pipeHeight = randomNumberBetween(100, 500);
		spawnPipe(pipeHeight - 500, true)
		spawnPipe(pipeHeight + 600 - counter.value * 5, false)
	}
	everyGameElementWithTheName('Pipe').forEach((pipe) => {
		if (pipe.collideWith(player)) {
			gameOver();
		}
		if (pipe.x < -50) {
			pipe.delete()
			playSound('Score');
			counter.increaseNumber(0.5);
		}
	})
};
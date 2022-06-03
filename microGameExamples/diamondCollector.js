// All necessary assets are preloaded
loadSound('Collect', 'microGame/assets/collect.mp3')
loadSound('Tada', 'microGame/assets/tada.mp3')
loadImage('Player', 'microGame/assets/redblockeyes.png')
loadImage('Diamond', 'microGame/assets/diamond.png')
loadFont('Signika', 'microGame/assets/SignikaNegative-VariableFont_wght.ttf')

// Creation of the game window
microGame({
	width: 1000,
	height: 700,
	noscaling: true,
	pixelated: false,
	bodybackground: '#4D97FF',
	debug: true
})

// Counter in the top left
const diamondsleft = new GameElement({
	name: "Counter",
	type: "Number",
	value: 0,
	prefix: "Diamonds left: ",
	font: "Signika",
	parallax: 0,
	x: 10,
	y: 10,
	width: 80
})

// Playable character
const player = new GameElement({
	name: "Player",
	type: "Image",
	src: "Player",
	x: 500,
	y: 600,
	bounciness: 0,
	friction: 1,
	width: 100,
	height: 100,
	physics: true,
	collidewalls: true,
	gravityy: 0.5
})

// Callable function for spawning x diamonds
function spawnDiamonds(amount) {
	for (i = 0; i < amount; i ++) {
		new GameElement({
			name: "Diamond",
			type: "Image",
			src: "Diamond",
			width: 64,
			height: 55,
		})
	}
}

var level = 0;
// custom function for going to the next level
function nextLevel() {
	level += 1;
	diamondsleft.setNumber(level);
	spawnDiamonds(level);
	playSound('Tada')
}
// Immediately ascend to level 1
nextLevel();

function draw() {
	// Set the y velocity when pressing up
	if (keyPress('ArrowUp')) {
		player.yvel = -15;
	}
	// Change the x velocity when holding left or right
	if (keyHeld('ArrowRight')) {
		player.xvel += 0.5;
	}
	if (keyHeld('ArrowLeft')) {
		player.xvel -= 0.5;
	}
	// For every diamond
	everyGameElementWithTheName("Diamond").forEach((diamond) => {
		// Check if colliding with player
		if (diamond.collideWith(player)) {
			playSound('Collect');
			diamond.delete();
			diamondsleft.decreaseNumber(1);
		};
	});

	// If all diamonds were collected, go to next level
	if (diamondsleft.value === 0) {
		nextLevel();
	};
}
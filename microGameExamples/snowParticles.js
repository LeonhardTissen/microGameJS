// Creation of the game window
microGame({
	width: 1000,
	height: 700,
	bodybackground: '#141414',
	gamebackground: '#020202',
	debug: true
});

function start() {}

function draw() {
	const size = randomNumberBetween(3, 15);
	const speed = 10 / size;
	new GameElement({
		name: 'Snow',
		type: 'Circle',
		color: '#d7e7ec',
		x: randomNumberBetween(0, cvs.width + cvs.height / 2),
		y: 0,
		width: size,
		yvel: randomNumberBetween(4,7) / speed,
		xvel: randomNumberBetween(-5,-3) / speed,
		physics: true,
		opacity: size / 15,
		collidewalls: false,
		gravityy: 0.01
	});
	everyGameElementWithTheName('Snow').forEach((snow) => {
		if (snow.y > 700 || snow.x < 0) {
			snow.delete();
		}
	})
}
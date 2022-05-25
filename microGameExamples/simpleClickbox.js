// Creation of the game window
microGame({
	width: 1000,
	height: 1000,
	noscaling: true,
	pixelated: true,
	bodybackground: '#4D97FF',
	gamebackground: '#FFFFFF',
	debug: true
})

clickbox = new GameElement({
	name: "Test",
	type: "Clickbox",
	x: 200,
	y: 300,
	width: 200,
	height: 200,
	onmouseover: function() {
		clickbox.opacity = 0.5
	},
	onmouseout: function() {
		clickbox.opacity = 1
	},
	color: 'blue'
})

function draw() {
	clickbox.x = Math.sin(time / 40) * 400 + 500;
	clickbox.y = Math.cos(time / 40) * 400 + 500;
}



loadSound('Flap', 'microGame/assets/flap.mp3');
loadSound('Death', 'microGame/assets/punch.mp3');
loadSound('Score', 'microGame/assets/flappyscore.mp3');
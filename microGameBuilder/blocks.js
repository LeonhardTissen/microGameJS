const leftsidebar = document.getElementById('leftsidebar')
const blocks = [
{
	name: "Basics",
	color: "#4D97FF",
	blocks: {
"Create MicroGame": [
`
// Creation of the game window
microGame({
	width: 1000,
	height: 700,
	noscaling: true,
	pixelated: false,
	bodybackground: '#4d97ff',
	gamebackground: '#ffffff',
	debug: true
});

// This runs at the start of the game
function start() {
	
}
start();

// This runs every frame
function draw() {

}



`, ``, ``]
	}
},
{
	name: "Objects",
	color: "#6F4FFF",
	blocks: {
		"Create Image": [
`loadImage('Redblockeyes', 'microGame/assets/redblockeyes.png')
`, `
	const my_image = new GameElement({
		name: 'MyImage',
		type: 'Image',
		src: 'Redblockeyes',
		x: 100,
		y: 100,
		width: 100,
		height: 100
	})
`, ``],
		"Create Image with Gravity": [
`loadImage('Redblockeyes', 'microGame/assets/redblockeyes.png')
`, `
	my_image_gravity = new GameElement({
		name: 'MyImageGravity',
		type: 'Image',
		src: 'Redblockeyes',
		x: 100,
		y: 100,
		bounciness: 0,
		friction: 1,
		width: 100,
		height: 100,
		physics: true,
		collidewalls: true,
		gravityy: 0.5
	})`, ``]
	}
},
{
	name: "Sounds",
	color: "#C14FFF",
	blocks: {
		"Load Sound": [`loadSound('Whoosh', 'microGame/assets/flap.mp3');
`,`
	playSound('Whoosh');
		`,``]
	}
},
{
	name: "Interactions",
	color: "#FF4FC1",
	blocks: {
		"Test": [``,``,``]
	}
},
{
	name: "Logic",
	color: "#FF4F4F",
	blocks: {
		"Test": [``,``,``]
	}
},
{
	name: "Variables",
	color: "#FF6F4F",
	blocks: {
		"Test": [``,``,``]
	}
},
{
	name: "Functions",
	color: "#FFCD4F",
	blocks: {
		"Test": [``,``,``]
	}
}
]

for (var b = 0; b < blocks.length; b ++) {
	const name = blocks[b].name;
	const color = blocks[b].color;
	leftsidebar.innerHTML += `
	<div class="toolboxcontainer" onclick="openBlocks(${b});">
		<div class="toolboxcircle" style="background-color: ${color}">
		</div>
		<h1 class="toolboxtitle" style="color:${color}">${name}</h1>
	</div>`
}

function openBlocks(id) {
	const block = blocks[id];
	document.body.classList.add('codeblocksopened');
	document.getElementById('codeblockstitle').innerText = block.name;
	document.getElementById('codeblocks').style.backgroundColor = block.color;
	const contents = document.getElementById('codeblockscontents');
	contents.innerHTML = "";
	for (const [key, value] of Object.entries(block.blocks)) {
		contents.innerHTML += `
		<div class="singlebox" onclick="prependCode(\`${value[0]}\`);insideStartCode(\`${value[1]}\`);insideDrawCode(\`${value[2]}\`);" style="background-color:${block.color}">
			<textarea spellcheck="false" class="singleboxcode">${value[0]}${value[1]}${value[2]}</textarea>
			<h1 class="singleboxtitle">${key}</h1>
		</div>`
	}
	closeMenu();
}
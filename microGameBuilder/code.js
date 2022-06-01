const codecolors = {
	'Default': {
		'default': '#FFFFFF',
		'backgnd': '#000000',
		'boolean': '#00CCFF',
		'classes': '#FF8800',
		'numbers': '#00FF00',
		'special': '#9999FF',
		'strings': '#FF77FF',
		'comment': '#999999',
		'tcursor': '#FFFFFF',
		'tselect': '#444444'
	},
	'Ice': {
		'default': '#FFFFFF',
		'backgnd': '#0c0c18',
		'boolean': '#0dfff3',
		'classes': '#0060ff',
		'numbers': '#59c9ff',
		'special': '#9999FF',
		'strings': '#7785ff',
		'comment': '#999999',
		'tcursor': '#00fbfb',
		'tselect': '#12506d'
	},
	'Strawberry': {
		'default': '#FFFFFF',
		'backgnd': '#000000',
		'boolean': '#ff1515',
		'classes': '#ff9393',
		'numbers': '#d96868',
		'special': '#df0081',
		'strings': '#ff77cf',
		'comment': '#8e6666',
		'tcursor': '#FFFFFF',
		'tselect': '#444444'
	},
	'Tree': {
		'default': '#FFFFFF',
		'backgnd': '#000000',
		'boolean': '#4aff15',
		'classes': '#bf6500',
		'numbers': '#8fff6a',
		'special': '#9b5e00',
		'strings': '#a4ffaf',
		'comment': '#386a20',
		'tcursor': '#a4ff97',
		'tselect': '#4b3e25'
	},
	'Blues': {
		'default': '#6f85b8',
		'backgnd': '#0c1527',
		'boolean': '#75bcff',
		'classes': '#00ff08',
		'numbers': '#00ffee',
		'special': '#47ff6c',
		'strings': '#007e94',
		'comment': '#ff7b00',
		'tcursor': '#FFFFFF',
		'tselect': '#444444'
	},
	'Gameboy': {
		'default': '#c4ec37',
		'backgnd': '#0f380f',
		'boolean': '#8bac0f',
		'classes': '#4e7629',
		'numbers': '#9bbc0f',
		'special': '#8bac0f',
		'strings': '#8bac0f',
		'comment': '#306230',
		'tcursor': '#9bbc0f',
		'tselect': '#0a230a',
	},
	'Crystal': {
		'default': '#ffffff',
		'backgnd': '#05021a',
		'boolean': '#37f5ff',
		'classes': '#ff2466',
		'numbers': '#fff204',
		'special': '#ff7a2b',
		'strings': '#db2fff',
		'comment': '#0e7c8f',
		'tcursor': '#9bbc0f',
		'tselect': '#0a230a',
	},
	'Monochrome': {
		'default': '#ffffff',
		'backgnd': '#000000',
		'boolean': '#868686',
		'classes': '#ffffff',
		'numbers': '#c5c5c5',
		'special': '#8a8a8a',
		'strings': '#dbdbdb',
		'comment': '#494949',
		'tcursor': '#ffffff',
		'tselect': '#161616',
	},
}

function updateCodeColors() {
	const keys = Object.keys(codecolors['Default'])
	keys.forEach((key) => {
		value = localStorage.getItem('microGameCodeColor' + key);
		value = (value === null ? codecolors['Default'][key] : value);
		document.documentElement.style.setProperty('--' + key, value);
		try {
			document.getElementById('codecolor' + key).value = value;
		} catch (err) {}
	})
}

function resetCodeColors() {
	const keys = Object.keys(codecolors['Default'])
	keys.forEach((key) => {
		localStorage.removeItem('microGameCodeColor' + key);
	})
	updateCodeColors();
}

function setCodeColor(key, value) {
	document.documentElement.style.setProperty('--' + key, value);
	localStorage.setItem('microGameCodeColor' + key, value);
}

function importCodeColors(preset = 'Default') {
	resetCodeColors();
	const keys = Object.keys(codecolors[preset]);
	keys.forEach((key) => {
		setCodeColor(key, codecolors[preset][key]);
	})
	updateCodeColors();
}

function exportCodeColors(preset = 'sample') {
	const keys = Object.keys(codecolors['Default']);
	var output = `'${preset}': {\n`
	keys.forEach((key) => {
		output += `'${key}': '${localStorage.getItem('microGameCodeColor' + key)}',\n`;
	})
	output += '},';
	return output;
}

document.body.onload = updateCodeColors;
let code = ""

const inputcode = document.getElementById('inputcode');
const outputcode = document.getElementById('outputcode');
const gamewindow = document.getElementById('gamewindow');
let iframe;
inputcode.oninput = updateCode;
inputcode.onscroll = scrollCode;
inputcode.onkeydown = saveCode;

function saveCode() {
	if (event.key === "s") {
		if (event.ctrlKey) {
			event.preventDefault();
			runCode();
		}
	}
}

function runCode() {
	gamewindow.innerHTML = `<iframe width="100" height="100" src="emulation.html"></iframe>`
	iframe = document.querySelector('#gamewindow iframe')
	iframe.onload = function() {
		const script = document.createElement('script');
		const sourcecode = inputcode.innerHTML.replaceAll('&lt;','<').replaceAll('&gt;','>');
		script.innerHTML = sourcecode;
		iframe.contentDocument.body.appendChild(script);
	}
}
runCode();

function scrollCode() {
	outputcode.scrollLeft = inputcode.scrollLeft;
	outputcode.scrollTop = inputcode.scrollTop;
}

function updateCode() {
	outputcode.classList.remove('prettyprinted')
	outputcode.innerHTML = inputcode.innerHTML;
	PR.prettyPrint()
}
updateCode();
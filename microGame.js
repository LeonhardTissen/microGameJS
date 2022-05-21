function microGame(width, height, gamebackground, pagebackground) {
	// Initialize
	const cvs = document.createElement('canvas');
	const ctx = cvs.getContext('2d');

	// Styling for the canvas
	cvs.width = width;
	cvs.height = height;
	cvs.style.maxHeight = 'min(100vw, 100vh)'
	cvs.style.maxWidth = 'min(100vw, 100vh)'
	cvs.style.backgroundColor = gamebackground;
	document.body.appendChild(cvs)

	// Styling for the body
	document.body.style.display = 'flex';
	document.body.style.flexDirection = 'column';
	document.body.style.justifyContent = 'center';
	document.body.style.minHeight = '100vh';
	document.body.style.margin = 0;
	document.body.style.overflow = 'hidden';
	document.body.style.background = pagebackground;
	return ctx;
}
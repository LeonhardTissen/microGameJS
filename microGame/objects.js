class GameElement {
	constructor(params) {
		this.name = (params.name ? params.name : "Unnamed");
		this.width = (params.width ? params.width : 32);
		this.height = (params.height ? params.height : this.width);
		this.type = (params.type ? params.type : 'Rectangle');
		switch (this.type) {
			case 'Image':
				this.img = images[(params.src ? params.src : 'Player')];
				this.frames = (params.frames !== undefined ? params.frames : 1);
				this.frametime = (params.frametime !== undefined ? params.frametime : 1);
				break;
			case 'Text':
				this.value = (params.text !== undefined ? params.text : 'Hello World!');
				this.font = (params.font !== undefined ? params.font : 'Arial');
				break;
			case 'Number':
				this.value = (params.number !== undefined ? params.number : 0);
				this.prefix = (params.prefix !== undefined ? params.prefix : '');
				this.font = (params.font !== undefined ? params.font : 'Arial');
				break;
			case 'Clickbox':
				this.onclick = (params.onclick !== undefined ? params.onclick : function() {});
				this.onmousedown = (params.onmousedown !== undefined ? params.onmousedown : function() {});
				this.onmouseup = (params.onmouseup !== undefined ? params.onmouseup : function() {});
				this.onmouseover = (params.onmouseover !== undefined ? params.onmouseover : function() {});
				this.onmouseout = (params.onmouseout !== undefined ? params.onmouseout : function() {});
				clickable_objects.push(this);
				break;
		}

		this.x = (params.x !== undefined ? params.x : Math.random() * (cvs.width - this.width) + this.width / 2 + camerax);
		this.y = (params.y !== undefined ? params.y : Math.random() * (cvs.height - this.height) + this.height / 2 + cameray);
		this.parallax = (params.parallax !== undefined ? params.parallax : 1);
		this.rotation = (params.rotation !== undefined ? params.rotation : 0);
		this.scalex = (params.scalex !== undefined ? params.scalex : 1);
		this.scaley = (params.scaley !== undefined ? params.scaley : 1);
		this.opacity = (params.opacity !== undefined ? params.opacity : 1);
		this.physics = (params.physics !== undefined ? params.physics : false);
		this.gravityy = (params.gravityy !== undefined ? params.gravityy : 0);
		this.gravityx = (params.gravityx !== undefined ? params.gravityx : 0);
		this.static = (params.static !== undefined ? params.static : false);
		this.visible = (params.visible !== undefined ? params.visible : true);
		this.continuousy = (params.continuousy !== undefined ? params.continuousy : 0);
		this.continuousx = (params.continuousx !== undefined ? params.continuousx : 0);
		this.continuousr = (params.continuousr !== undefined ? params.continuousr : 0);
		this.collidewalls = (params.collidewalls !== undefined ? params.collidewalls : false);
		this.bounciness = (params.bounciness !== undefined ? params.bounciness : 0.75);
		this.friction = (params.friction !== undefined ? params.friction : 0.75);
		this.yvel = (params.yvel ? params.yvel : 0);
		this.xvel = (params.xvel ? params.xvel : 0);
		this.color = (params.color !== undefined ? params.color : 'black');
		objects.push(this);
	}

	// general functions
	draw() {
		if (!this.visible || this.opacity <= 0) {
			return;
		}
		if (this.rotation !== 0 || this.scalex !== 1 || this.scaley !== 1) {
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.scale(this.scalex, this.scaley);
			ctx.rotate(this.rotation * Math.PI / 180);
			ctx.translate(-this.x, -this.y);
		}
		ctx.globalAlpha = this.opacity;
		const x = this.x - camerax * this.parallax;
		const y = this.y - cameray * this.parallax;
		switch (this.type) {
			case "Circle":
				ctx.beginPath();
				ctx.fillStyle = this.color;
				ctx.ellipse(x, y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
				ctx.fill();
				break;
			case "Rectangle":
				ctx.fillStyle = this.color;
				ctx.fillRect(x - this.width / 2, y - this.height / 2, this.width, this.height);
				break;
			case "Image":
				ctx.imageSmoothingEnabled = false;
				ctx.drawImage(this.img, 
					(Math.floor(time / this.frametime) % this.frames) * this.img.width / this.frames, 
					0, 
					this.img.width / this.frames, 
					this.img.height,
					x - this.width / 2,
					y - this.height / 2, 
					this.width, 
					this.height);
				break;
			case "Text":
			case "Number":
				ctx.fillStyle = this.color;
				ctx.font = this.width + "px " + this.font;
				ctx.fillText(this.prefix + this.value, x, y + this.width);
				break;
			case "Clickbox":
				if (this.color !== undefined) {
					ctx.fillStyle = this.color;
					ctx.fillRect(x - this.width / 2, y - this.height / 2, this.width, this.height);
				} else if (debug_mode) {
					ctx.globalAlpha = 0.5;
					ctx.strokeStyle = 'black';
					ctx.setLineDash([10, 8]);
					ctx.lineWidth = 1;
					ctx.strokeRect(x - this.width / 2, y - this.height / 2, this.width, this.height);
				}
				break;
		}
		ctx.globalAlpha = 1;
		if (this.rotation !== 0 || this.scalex !== 1 || this.scaley !== 1) {
			ctx.restore();
		}
		if (this.physics) {
			this.emulateVelocities();
		}
		if (!this.static) {
			this.emulateMovement();
		}
		if (this.collidewalls) {
			this.collideWalls();
		}
	}

	// Delete the object
	delete() {
		this.deleted = true;
	}
	remove() {
		this.deleted = true;
	}

	// number functions
	setNumber(value) {
		if (this.type === 'Number') {
			this.value = value;
		} else {
			log("You can't set the number for a non-number object.");
		}
	}
	increaseNumber(value = 1) {
		if (this.type === 'Number') {
			this.value += value;
		} else {
			log("You can't increase the number for a non-number object.");
		}
	}
	decreaseNumber(value = 1) {
		if (this.type === 'Number') {
			this.value -= value;
		} else {
			log("You can't decrease the number for a non-number object.");
		}
	}
	// number functions
	setText(text) {
		if (this.type === 'Text') {
			this.value = text;
		} else {
			log("You can't set text for a non-text object.");
		}
	}
	addText(text) {
		if (this.type === 'Text') {
			this.value += text;
		} else {
			log("You can't add text for a non-text object.");
		}
	}

	// constant movement
	emulateMovement() {
		if (this.continuousx !== 0) {
			this.x += this.continuousx * deltay;
		}
		if (this.continuousy !== 0) {
			this.y += this.continuousy * deltay;
		}
		if (this.continuousr !== 0) {
			this.rotation += this.continuousr * deltay;
		}
	}

	// physics functions
	emulateVelocities() {
		this.yvel += this.gravityy * deltay;
		this.x += this.xvel * deltay;
		this.y += this.yvel * deltay;
	}

	// collision functions
	collideWalls() {
		const x = this.x - camerax * this.parallax;
		const y = this.y - cameray * this.parallax;
		if (x + this.width / 2 > cvs.width) {
			this.xvel *= -this.bounciness;
			this.x = cvs.width - this.width / 2 + camerax;
			this.yvel *= Math.min(this.friction, 1);
		} else if (x - this.width / 2 < 0) {
			this.xvel *= -this.bounciness;
			this.x = this.width / 2 + camerax;
			this.yvel *= Math.min(this.friction, 1);
		}
		if (y + this.height / 2 > cvs.height) {
			this.yvel *= -this.bounciness;
			this.y = cvs.height - this.height / 2 + cameray;
			this.xvel *= Math.min(this.friction, 1);
		} else if (y - this.height / 2 < 0) {
			this.yvel *= -this.bounciness;
			this.y = this.height / 2 + cameray;
			this.xvel *= Math.min(this.friction, 1);
		}
	}
	collideWith(obj) {
		if (this.x + this.width / 2 > obj.x - obj.width / 2 &&
			this.y + this.height/ 2 > obj.y - obj.height/ 2 &&
			this.x - this.width / 2 < obj.x + obj.width / 2 &&
			this.y - this.height/ 2 < obj.y + obj.height/ 2) {
			return true;
		} else {
			return false;
		}
	}

	// rotation functions
	rotateClockwise(degrees) {
		this.rotation += degrees;
	}
	rotateCounterClockwise(degrees) {
		this.rotation -= degrees;
	}
	setRotation(degrees) {
		this.rotation = degrees;
	}
}

function everyGameElementWithTheName(targetName) {
	const outputArray = [];
	objects.forEach((object) => {
		if (object.name === targetName) {
			outputArray.push(object);
		}
	})
	return outputArray;
}
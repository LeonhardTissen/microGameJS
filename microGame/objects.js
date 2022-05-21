class GameElement {
	constructor(params) {
		this.name = (params.name ? params.name : "Unnamed");
		this.width = (params.width ? params.width : 32);
		this.height = (params.height ? params.height : 32);
		this.type = (params.type ? params.type : 'Rectangle');
		switch (this.type) {
			case 'Image':
				this.img = images[(params.src ? params.src : 'Player')];
				break;
			case 'Text':
				this.value = (params.text !== undefined ? params.text : 'Hello World!');
				break;
			case 'Number':
				this.value = (params.number !== undefined ? params.number : 0);
				this.prefix = (params.prefix !== undefined ? params.prefix : '')
				break;
		}

		this.x = (params.x !== undefined ? params.x : Math.random() * (cvs.width - this.width) + this.width / 2);
		this.y = (params.y !== undefined ? params.y : Math.random() * (cvs.height - this.height) + this.height / 2);
		this.rotation = (params.rotation !== undefined ? params.rotation : 0);
		this.opacity = (params.opacity !== undefined ? params.opacity : 1);
		this.physics = (params.physics !== undefined ? params.physics : false);
		this.gravityy = (params.gravityy !== undefined ? params.gravityy : 0);
		this.gravityx = (params.gravityx !== undefined ? params.gravityx : 0);
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
		if (this.rotation !== 0) {
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.rotation);
			ctx.translate(-this.x, -this.y);
		}
		ctx.globalAlpha = this.opacity;
		switch (this.type) {
			case "Circle":
				ctx.beginPath();
				ctx.fillStyle = this.color;
				ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
				ctx.fill()
				break;
			case "Rectangle":
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
				break;
			case "Image":
				ctx.drawImage(this.img, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
				break;
			case "Text":
			case "Number":
				ctx.font = this.width + "px Arial"
				ctx.fillText(this.prefix + this.value, this.x, this.y + this.width)
				break;
		}
		ctx.globalAlpha = 1;
		if (this.rotation !== 0) {
			ctx.restore();
		}
		if (this.physics) {
			this.emulateVelocities()
		}
		if (this.collidewalls) {
			this.collideWalls();
		}
	}

	delete() {
		this.deleted = true;
	}

	// number functions
	setNumber(value) {
		if (this.type === 'Number') {
			this.value = value;
		}
	}
	increaseNumber(value) {
		if (this.type === 'Number') {
			this.value += value;
		}
	}
	decreaseNumber(value) {
		if (this.type === 'Number') {
			this.value -= value;
		}
	}
	// number functions
	setText(text) {
		if (this.type === 'Text') {
			this.value = text;
		}
	}
	addText(text) {
		if (this.type === 'Text') {
			this.value += text;
		}
	}


	// physics functions
	emulateVelocities() {
		this.yvel += this.gravityy
		this.x += this.xvel;
		this.y += this.yvel;
	}

	// collision functions
	collideWalls() {
		if (this.x + this.width / 2 > cvs.width) {
			this.xvel *= -this.bounciness;
			this.x = cvs.width - this.width / 2;
			this.yvel *= Math.min(this.friction, 1);
		} else if (this.x - this.width / 2 < 0) {
			this.xvel *= -this.bounciness;
			this.x = this.width / 2;
			this.yvel *= Math.min(this.friction, 1);
		}
		if (this.y + this.height / 2 > cvs.height) {
			this.yvel *= -this.bounciness;
			this.y = cvs.height - this.height / 2;
			this.xvel *= Math.min(this.friction, 1);
		} else if (this.y - this.height / 2 < 0) {
			this.yvel *= -this.bounciness;
			this.y = this.height / 2;
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

	// position functions
	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	// rotation functions
	rotateClockwise(degrees) {
		this.rotation += degrees;
	}
	rotateCounterClosewise(degrees) {
		this.rotation -= degrees;
	}
	rotateSet(degrees) {
		this.rotation = degrees;
	}
}
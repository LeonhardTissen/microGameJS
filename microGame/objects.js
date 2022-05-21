class GameElement {
	constructor(params) {
		this.type = (params.type ? params.type : 'Rectangle')
		if (this.type === 'Image') {
			this.src = (params.src ? params.src : 'microGame/assets/redblockeyes.png');
			this.img = new Image();
			this.img.src = this.src;
		}
		this.width = (params.width ? params.width : 10);
		this.height = (params.height ? params.height : 10);
		this.x = (params.x !== undefined ? params.x : this.width / 2);
		this.y = (params.y !== undefined ? params.y : this.height / 2);
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
	emulateVelocities() {
		this.yvel += this.gravityy
		this.x += this.xvel;
		this.y += this.yvel;
	}
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
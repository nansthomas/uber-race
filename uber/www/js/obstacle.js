//(function () {
	function Obstacle () {};
	Obstacle.prototype = {
		init: function (position, grille, color, context) { //type = voiture ? bus ?, speed = vitesse (en ms), position = colonne 1, 2 ou 3
			this.coord = [];
			this.position = position;
			this.color = color;
			this.taille = 3;
			this.images();
			this.create(grille, context);
			this.etat = 1;
		},
		create: function (grille, context) {
			for (var i = 0; i < this.taille; i++) {
				var coord = {
					x:this.position,
					y:i
				}
				this.coord.push(coord);
				if (i == 0) {
					grille[this.position][i] = 3; //derrière
					context.drawImage(this.Img3, (coord.x*192)+60, coord.y*38);
				}
				else if (i == this.taille - 1) {
					grille[this.position][i] = 1; //devant
				}
				else {
					grille[this.position][i] = 2; //corps
					context.drawImage(this.Img2, (coord.x*192)+60, coord.y*38);
				}
			}
			context.drawImage(this.Img1, (this.coord[this.taille-1].x*192)+60, this.coord[this.taille-1].y*38);
		},
		images: function () {
			this.Img1 = document.getElementById('Car'+this.color+'1');
			this.Img2 = document.getElementById('Car'+this.color+'2');
			this.Img3 = document.getElementById('Car'+this.color+'3');
		},
		move: function (grille, context) {
			if(!this.verifMove(grille)) this.collision(grille);
			else {
				this.reset(grille);
				this.moveObstacle(grille, context);
			}
		},
		verifMove: function (grille) {
			if(this.coord.length > 1) {
				if (grille[this.coord[this.coord.length-1].x][this.coord[this.coord.length-1].y+1] && grille[this.coord[this.coord.length-1].x][this.coord[this.coord.length-1].y+1] != 0) return 0;
				else return 1;
			}
			else return 1;
		},
		moveObstacle: function (grille, context) {		
			for (var i = 0; i < this.coord.length; i++) {
				if (this.coord[i].y + 1 < grille[this.coord[i].x].length) this.coord[i].y += 1;
				else this.coord.pop();
				if (i == 0) {
					grille[this.position][i] = 3; //derrière
					if (this.coord.length > 0) context.drawImage(this.Img3, (this.coord[i].x*192)+60, this.coord[i].y*38);
				}
				else if (i == this.taille - 1) {
					grille[this.position][i] = 1; //devant
				}
				else {
					grille[this.position][i] = 2; //corps
					if (this.coord.length > 1) context.drawImage(this.Img2, (this.coord[i].x*192)+60, this.coord[i].y*38);
				}
			}
			if(this.coord.length > 2) context.drawImage(this.Img1, (this.coord[this.taille-1].x*192)+60, this.coord[this.taille-1].y*38);
		},
		reset: function (grille) {
			for (var i = 0; i < this.coord.length; i++) {
				grille[this.coord[i].x][this.coord[i].y] = 0;
			}
		},
		collision: function () {
			this.endGame();
		},
		endGame: function () {
			this.etat = 0;
		},
		get: function(key) {
			return this[key];
		}
	};
//}) ();
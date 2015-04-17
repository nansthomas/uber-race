//(function () {
	function Uber() {};
	Uber.prototype = {
		init: function (grille, context) {
			this.taille = 3; //taille du Uber
			this.coord = []; //tableau dans lequel on va mettre les coordonnées du Uber
			this.position = 0; //position sur la route, de 0 à 3
			this.positionNew = this.position;
			this.images();
			this.create(grille, context);
			this.etat = 1; //uber actif
			this.dir = "";
			this.touch = "";
			this.xDown = null;                                                        
			this.yDown = null;   
			this.touchTime = null;
			this.singleTap = 10;
			this.grilleLength = grille.length;
		},
		create: function(grille, context) {
			for (var i = 0; i < this.taille; i++) {
				var coord = {
					x: this.position,
					y: grille[this.position].length - 1 - i
				}
				this.coord.push(coord);
				if (i == 0) {
					grille[coord.x][coord.y] = 3; //derrière = 60*38
					context.drawImage(this.Uber3, (coord.x*192)+60, coord.y*38);
				}
				else if (i == this.taille - 1) {
					grille[coord.x][coord.y] = 1; //devant = 60*47 (1 cellule = 60*38)
					context.drawImage(this.Uber1, (coord.x*192)+60, coord.y*38);
				}
				else {
					grille[coord.x][coord.y] = 2; //milieu = 60*29
					context.drawImage(this.Uber2, (coord.x*192)+60, coord.y*38);
				}
			}
		},
		images: function () {
			this.Uber1 = document.getElementById('CarUber1');
			this.Uber2 = document.getElementById('CarUber2');
			this.Uber3 = document.getElementById('CarUber3');
			this.fire = document.getElementById('fire');
		},
		move: function(grille, context) {
			this.listenTouch = 1;
			if (window.navigator.msPointerEnabled) {
				window.addEventListener('MSPointerDown', this.handleTouchStart.bind(this), false);
				window.addEventListener('MSPointerMove', this.handleTouchMove.bind(this), false);
				window.addEventListener('MSPointerUp', this.handleTouchEnd.bind(this), false);
			}
			window.addEventListener('touchstart', this.handleTouchStart.bind(this), false);        
			window.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
			window.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
			this.moveKey(grille);
			this.reset(grille);
			if (!this.verifMove(grille)) this.collision();
			else {
				this.position = this.positionNew;
				this.moveUber(grille, context);
			}
		},
		moveKey: function (grille) {
			var self=this;
			window.onkeydown = function (e) {
				"use strict";
				var key = e.keypress || e.which;
				switch (key) {
					case 37: //bouger à gauche
						if (self.position - 1 >= 0) {
							self.positionNew = self.position - 1; //positionNew = nouvelle position
						}
						break;
					case 39: //bouger à droite
						if (self.position + 1 < grille.length) {
							self.positionNew = self.position + 1;
						}
						break;
					default: 
						self.positionNew = self.position;
						break;
					}
			}
		},
		moveUber: function (grille, context) {
			for (var i = 0; i < this.taille; i++) {
				var coord = {
					x: this.position,
					y: grille[this.position].length - 1 - i
				}
				this.coord[i] = coord;
				if (i == 0) {
					grille[coord.x][coord.y] = 3; //derrière = 60*38
					context.drawImage(this.Uber3, (coord.x*192)+60, coord.y*38);
				}
				else if (i == this.taille - 1) {
					grille[coord.x][coord.y] = 1; //devant = 60*47 (1 cellule = 60*38)
					context.drawImage(this.Uber1, (coord.x*192)+60, coord.y*38);
				}
				else {
					grille[coord.x][coord.y] = 2; //milieu = 60*29
					context.drawImage(this.Uber2, (coord.x*192)+60, coord.y*38);
				}
			}
		},
		verifMove: function (grille) { // !!!!!!!!!!!!!!!!!!!!!!!! A FINIR !!!!!!!!!!!!!!!!!!!!!!!
			for (var i = 0; i < this.taille; i++) {
				if (grille[this.positionNew][this.coord[i].y] != 0) {
					return 0;
				}
			}
			return 1;
		},
		collision: function () {
			this.endGame();
		},
		reset: function (grille) {
			for (var i = 0; i < this.coord.length; i++) {
				grille[this.coord[i].x][this.coord[i].y] = 0;
			}
		},
		endGame: function () {
			this.etat = 0;
		},
		explosion: function (context) {
			function drawFire() {
				context.drawImage(this.fire, 0, 0);
			}
			
		},
		get: function(key) {
			return this[key];
		},
		setListenTouch: function(nb) {
			this.listenTouch = nb;
		},
		handleTouchStart: function(evt) {                                         
			if (window.navigator.msPointerEnabled) {
				this.xDown = evt.clientX;                                      
				this.yDown = evt.clientY; 
			} else {
				this.xDown = evt.touches[0].clientX;                                      
				this.yDown = evt.touches[0].clientY; 
			}
			this.touchTime = new Date().getTime();
		},
		handleTouchMove: function(evt) {
			if (window.navigator.msPointerEnabled) {
				var xUp = evt.clientX;                                    
				var yUp = evt.clientY;
			} else {
				var xUp = evt.touches[0].clientX;                                    
				var yUp = evt.touches[0].clientY;
			}
			var yDiff = this.yDown - yUp;
			var xDiff = this.xDown - xUp;

			/* Avoid problems with non-linear swipe */
			if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
				if ( xDiff > 0 ) {
					if(this.listenTouch) this.dir = "left";
				} else {
					if(this.listenTouch) this.dir = "right";
				}                       
			} else {
				if ( yDiff > 0 ) {
					if(this.listenTouch) this.dir = "up";
				} else { 
					if(this.listenTouch) this.dir = "down";
				}                                                                 
			}
		},
		handleTouchEnd: function(evt) {
			var self = this;
			var actualTime = new Date().getTime();
			var timeDiff = actualTime-this.touchTime;
			if(timeDiff > this.singleTap) {
				if(this.listenTouch) switch(this.dir) {
						case "left":
							if (self.position - 1 >= 0) {
								self.positionNew = self.position - 1; //positionNew = nouvelle position
							}
							break;
						case "right":
							if (self.position + 1 < this.grilleLength) {
								self.positionNew = self.position + 1; //positionNew = nouvelle position
							}
							break;
				}
			}
		}
	};
//}) ();
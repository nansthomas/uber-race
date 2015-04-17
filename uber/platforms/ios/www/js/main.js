//(function () {
	var longueur = 40,
		largeur = 4,
		grille = [],
		bgColor = "0a0e34", // couleur du fond
		lineColor = "ffffff", // couleur des lignes (qui séparent la route)
		canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		pause = document.getElementById("pause"),
		play = document.getElementById("play"),
		divScore = document.getElementById("score"),
		divCanvas = document.getElementById("divCanvas"),
		divEnd = document.getElementById("divEnd"),
		speed = 50, //vitesse du jeu en ms
		speedLimit = 20, //vitesse maximale (ici 20ms)
		speedIncrGame = 5, // augmentation de la vitesse du jeu
		speedObstSpawn = 900, //délai d'attente de création des voitures en ms
		speedIncrObstSpawn = 100, // diminution du délai d'attente de création des voitures
		speedObstSpawnLimit = 300, //vitesse maximale à laquelle les voitures arrivent (ici 300ms)
		speedIncrInt = 15000, //vitesse à laquelle le niveau augmente (les voitures accélèrent et apparaissent plus rapidement)
		nbObstMaxScreen = 10, //
		nbObstMaxLine = 2,
		obstaclesArray = [],
		compteurObst = 0,
		stateGame = 1,
		score = [],
		speedScore = 5000,
		speedIncrScore = 10, //100 = +1 so 10 = +0.10 each second
		scoreDecimal = 1, //0 if you wanna see the numbers after the "," or 1 if you don't
		currency = "€",
		uber = new Uber(),
		scoreInt = "",
		uberInt = "",
		obstSpawnInt = "",
		colors = ["Blue", "Green", "Orange", "Pink", "Purple", "Red"];
		divCanvas.style.width = window.innerWidth + "px";
		divCanvas.style.height = window.innerHeight + "px";
		divScore.innerHTML = score;

	function init () {
		for (var i = 0; i < largeur; i++) {
			grille[i] = [];
			for (var j = 0; j < longueur; j++) {
				grille[i][j] = 0;
			}
		}
		for (var i = 0; i < nbObstMaxScreen; i++) {
			obstaclesArray[i] = new Obstacle();
		}
		uber.init(grille, context);
		for (var i = 0; i < 2; i++) {
			score[i] = 0;
		}
		divScore.innerHTML="0 "+currency;
	}

	function background () {
		context.fillStyle = "#" + bgColor;
		context.globalAlpha = 1;
		context.fillRect(0,0,canvas.width,canvas.height); //taille colonnes : 180 +2+ 192 +2+ 192 +2+ 180
		context.fillStyle = "#" + lineColor;
		for (var i = 0; i < largeur; i++) {
			context.globalAlpha = 0.15;
			context.fillRect(192 + (i*192), 200, 2, 1300);
		}
		context.globalAlpha = 1;
	}

	function endGame () {
		stateGame = 0;
		clearInterval(increaseSpeedInt);
		clearInterval(uberInt);
		clearInterval(obstSpawnInt);
		clearInterval(scoreInt);
		setTimeout(endScreen(), 100);
	}

	function pauseGame () {
		if (stateGame == 1) {
			stateGame = 2;
			clearInterval(increaseSpeedInt);
			clearInterval(uberInt);
			clearInterval(obstSpawnInt);
			clearInterval(scoreInt);
			pause.style.display = "none";
			play.style.display = "block";
			uber.listenTouch = 0;
		}
	}

	function endScreen () {
		document.getElementById('prix').innerHTML = score[1]+"."+score[0]+" €";
		divEnd.classList.add('transit');
		divEnd.classList.remove('divEnd');
	}

	function newObst () {
		var positionArray = [];
		for (var i = 0; i < nbObstMaxLine; i++) {
			var position = Math.floor(Math.random()*largeur);
			if (positionArray.lastIndexOf(position) == -1) positionArray.push(position);
		}
		for (var i = 0; i < positionArray.length; i++) {
			obstaclesArray[(i + compteurObst) % nbObstMaxScreen].init(positionArray[i], grille, randomColors(), context);
		}
		compteurObst += positionArray.length;
	}

	function obstMove () {
		for (var i = 0; i < compteurObst && i < nbObstMaxScreen; i++) {
			obstaclesArray[i].move(grille, context);
		}
	}

	function randomColors () {
		return colors[Math.floor(Math.random()*colors.length)];
	}

	function verifEndGame () {
		if(!uber.get("etat")) endGame();
		for (var i = 0; i < compteurObst && i < nbObstMaxScreen; i++) {
			if(!obstaclesArray[i].get("etat")) endGame();
		}
	}

	function increaseSpeedGame () {
		clearInterval(uberInt);
		if (speed - speedIncrGame >= speedLimit) speed -= speedIncrGame;
		else speed = speedLimit;
		uberInt = setInterval(function () {
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.beginPath();
			background();
			uber.move(grille, context);
			obstMove();
			verifEndGame();
		}, speed);
	}

	function increaseSpeedObstSpawn () {
		clearInterval(obstSpawnInt);
		if (speedObstSpawn - speedIncrObstSpawn >= speedObstSpawnLimit) speedObstSpawn -= speedIncrObstSpawn;
		else speedObstSpawn = speedObstSpawnLimit;
		obstSpawnInt = setInterval(function () {
			newObst();
		}, speedObstSpawn);
	}

	function increaseScore () {
		if (score[0] + speedIncrScore > 99) {
			score[1] += parseInt((score[0] + speedIncrScore)/100);
		}
		score[0] = (score[0] + speedIncrScore) % 100;
		if (scoreDecimal) return score[1]+"."+score[0]+" "+currency;
		else return score[1]+" "+currency;
	}

	function startGame () {
//		obstaclesArray[0].init(0, grille, 'Blue', context);
		if (stateGame != 0) {
			increaseSpeedInt = setInterval(function () {
				increaseSpeedGame();
				increaseSpeedObstSpawn();
			}, speedIncrInt);
			obstSpawnInt = setInterval(function () {
				newObst();
			}, speedObstSpawn);
			uberInt = setInterval(function () {
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.beginPath();
				background();
				uber.move(grille, context);
				obstMove();
				verifEndGame();
			}, speed);
			scoreInt = setInterval (function () {
				divScore.innerHTML = increaseScore();
			}, speedScore);
			stateGame = 1;
			play.style.display = "none";
			pause.style.display = "block";
		}
	}

	init();
	background();
	startGame();
//}) ();

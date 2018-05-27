var characters = [ //playable characters/enemies
	{
		name: "Orpheus",
		hp: 60,
		attack: 10,
		counter: 12,
		image: "assets/images/orpheus.jpg",
		music: "assets/audio/orpheus.mp3",
	},
	{
		name: "Izanagi",
		hp: 80,
		attack: 7,
		counter: 8,
		image: "assets/images/izanagi.jpg",
		music: "assets/audio/izanagi.mp3",
	},
	{
		name: "Arsene",
		hp: 70,
		attack: 8,
		counter: 10,
		image: "assets/images/arsene.jpg",
		music: "assets/audio/arsene.mp3",
	},
	{
		name: "Nyx Avatar",
		hp: 150,
		attack: 2,
		counter: 3,
		image: "assets/images/nyx.jpg",
		music: "assets/audio/nyx.mp3",
	},
	{
		name: "Izanami",
		hp: 120,
		attack: 4,
		counter: 4,
		image: "assets/images/izanami.jpg",
		music: "assets/audio/izanami.mp3",
	},
	{
		name: "Yaldabaoth",
		hp: 100,
		attack: 5,
		counter: 5,
		image: "assets/images/yaldabaoth.jpg",
		music: "assets/audio/yaldabaoth.mp3",
	}
];
//vars to hold changing values
var playerHp;
var playerAttack;
var enemyHp;
var enemyAttack;
var playerId;
var enemyId;
var themeMusic;
var enemiesLeft = characters.length-1;
var inCombat = false;

function gameInit() { //set up game
	for (var i = 0; i < characters.length; i++) { //for each character in array
		var characterDiv = $(document.createElement("div")); //create new div to house character info
		characterDiv.attr("class", "character-div");
		characterDiv.attr("data-index", i); //attaches "ID" to div to distinguish characters from each other

		characterDiv.append("<img src=" +characters[i].image +" class='character-image'/>"); //add character image

		var stats = $(document.createElement("div")); //create new div for character stats
		stats.attr("class", "character-stats");
		stats.append("<span class='character-name'>" +characters[i].name +"</span>") //add name span
		stats.append("<span class='character-attack'>Atk: " +characters[i].attack +"</span>") //add attack span
		stats.append("<span class='character-hp'>HP: " +characters[i].hp +"</span>") //add HP span
		characterDiv.append(stats); //place stats inside character div

		$("#player-select").append(characterDiv); //attach character div to character selection area
	}
}

function updateDisplay() { //update stats and battle info
	$(".player-character .character-attack").text("Atk: " +playerAttack);
	$(".player-character .character-hp").text("HP: " +playerHp);
	$(".current-enemy .character-hp").text("HP: " +enemyHp);
	$("#battle-info").html("<p>You took " +enemyAttack +" damage.</p><p>"
		+characters[enemyId].name +" took " +(playerAttack-characters[playerId].attack) +" damage.</p>");
}

function progressGame() { //check win/loss, remove defeated enemies
	if (playerHp <= 0) { //if player HP is 0 or below
		$("#attack-button").prop("disabled", true); //diable attack button
		$("#battle-info").append("<p>You have been defeated! Game Over.</p>"); //display game over message
		$("#reset-button").attr("class", ""); //unhide reset button
	}
	else if (enemyHp <= 0) { //if enemy HP is 0 or below
		$(".current-enemy").remove(); //remove enemy character div from DOM
		inCombat = false;
		enemiesLeft--; //reduce counter of enemies remaining
		if (enemiesLeft == 0) { //if no enemies remain
			$("#battle-info").append("<p>You have defeated all enemies! You Win!</p>"); //display victory message
			$("#reset-button").attr("class", ""); //unhide reset button
		}
		else { //if there are still enemies left
			//display won battle message
			$("#battle-info").append("<p>You have defeated " +characters[enemyId].name +"! Please select a new opponent.</p>");
		}
	}
}

$(document).ready(function() {
	themeMusic = document.getElementById("#theme-music")
	gameInit();

	//CHARACTER SELECTION
	$("#player-select").on("click", ".character-div", function() {
		playerId = parseInt($(this).attr("data-index")); //extract index number of selected character
		playerHp = characters[playerId].hp; //set player HP
		playerAttack = characters[playerId].attack; //set player Attack

		var playerDiv = $("div[data-index=" +playerId +"]"); //store location of player character div
		playerDiv.attr("class", "character-div player-character"); //change class of PC div
		$(playerDiv).detach().prependTo("#player-card"); //move PC to player area

		for (var i = 0; i < characters.length; i++) { //change all other characters to enemies
			if (i !== playerId) {
				var currentDiv = $("div[data-index=" +i +"]"); //select div that matches current index
				currentDiv.attr("class", "character-div enemy-character"); //change class to enemy
				$(currentDiv).detach().appendTo("#enemy-select"); //move to enemy select area
				$("div[data-index=" +i +"] .character-stats .character-attack").text("Atk: " +characters[i].counter); //change attack stat to counter-attack stat
			}
		}
		
		$("#player-select").attr("class", "hidden"); //hide character select
		$("#player-area").attr("class", ""); //unhide player area
		$("#defender-area").attr("class", ""); //unhide defender area
		$("#defender-area h2").attr("class", ""); //unhide defender area title
		$("#attack-button").attr("class", ""); //unhide attack button
		$("#enemy-select").attr("class", ""); //unhide enemy select

		themeMusic.setAttribute("src", characters[playerId].music); //set theme music
		themeMusic.volume = 0.5;
		themeMusic.play();
	});
	
	//ENEMY SELECTION
	$("#enemy-select").on("click", ".enemy-character", function() {
		if (!inCombat) {
			enemyId = parseInt($(this).attr("data-index")); //extract index number of selected character
			enemyHp = characters[enemyId].hp; //set enemy HP
			enemyAttack = characters[enemyId].counter; //set enemy Attack

			var enemyDiv = $("div[data-index=" +enemyId +"]"); //store location of enemy character div
			enemyDiv.attr("class", "character-div enemy-character current-enemy"); //adds current-enemy class
			$(enemyDiv).detach().prependTo("#combat-area"); //move PC to defender area
			inCombat = true;
			$("#battle-info").empty();
		}
	});

	//ATTACKING
	$("#defender-area").on("click", "#attack-button", function() {
		if (inCombat) {
			playerHp -= enemyAttack; //player takes damage from enemy
			enemyHp -= playerAttack; //enemy takes damage from player
			playerAttack += characters[playerId].attack; //player attack increases by base attack value
			updateDisplay();
			progressGame();
		}
	});
	
	//RESET GAME
	$("#defender-area").on("click", "#reset-button", function() {
		//reset all variables
		playerHp = null;
		playerAttack = null;
		enemyHp = null;
		enemyAttack = null;
		playerId = null;
		enemyId = null;
		enemiesLeft = characters.length-1;
		inCombat = false;
		$(".player-character").remove() //remove player div
		$(".enemy-character").remove() //remove current enemy div
		$("#battle-info").text(""); //reset battle text

		$("#player-select").attr("class", ""); //unhide character select
		$("#player-area").attr("class", "hidden"); //hide player area
		$("#defender-area").attr("class", "hidden"); //hide defender area
		$("#defender-area h2").attr("class", "hidden"); //hide defender area title
		$("#attack-button").attr("class", "hidden"); //hide attack button
		$("#reset-button").attr("class", "hidden"); //hide reset button
		$("#enemy-select").attr("class", "hidden"); //hide enemy select

		$("#attack-button").prop("disabled", false); //re-enable attack button

		themeMusic.pause();

		gameInit(); //re-initialize game
	});
});
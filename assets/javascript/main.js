var characters = [ //playable characters/enemies
	{
		name: "Orpheus",
		hp: 100,
		attack: 5,
		counter: 5,
		image: "assets/images/orpheus.jpg",
		music: "",
	},
	{
		name: "Izanagi",
		hp: 100,
		attack: 5,
		counter: 5,
		image: "assets/images/izanagi.jpg",
		music: "",
	},
	{
		name: "Arsene",
		hp: 100,
		attack: 5,
		counter: 5,
		image: "assets/images/arsene.jpg",
		music: "",
	},
	{
		name: "Nyx Avatar",
		hp: 100,
		attack: 5,
		counter: 5,
		image: "assets/images/nyx.jpg",
		music: "",
	},
	{
		name: "Izanami no Okami",
		hp: 100,
		attack: 5,
		counter: 5,
		image: "assets/images/izanami.jpg",
		music: "",
	},
	{
		name: "Yaldabaoth",
		hp: 100,
		attack: 5,
		counter: 5,
		image: "assets/images/yaldabaoth.jpg",
		music: "",
	}
];
//vars to hold changing values
var playerHp;
var playerAttack;
var enemyHp;
var enemyAttack;
var playerId;
var enemyId;
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
		stats.append("<span class='character-attack'>Atk: " +characters[i].attack +"</span>") //add attack span
		stats.append("<span class='character-hp'>HP: " +characters[i].hp +"</span>") //add HP span
		characterDiv.append(stats); //place stats inside character div

		$("#player-select").append(characterDiv);
	}
}

function updateDisplay() { //update stats and battle info
	$(".player-character .character-attack").text("Atk: " +playerAttack);
	$(".player-character .character-hp").text("HP: " +playerHp);
	$(".current-enemy .character-hp").text("HP: " +enemyHp);
	$("#battle-info").text("You took " +enemyAttack +" damage."
		+characters[enemyId].name +" took " +(playerAttack-characters[playerId].attack) +" damage.");
}

function progressGame() { //check win/loss, remove defeated enemies
	if (playerHp <= 0) { //if player HP is 0 or below
		$("#attack-button").prop("disabled", true); //diable attack button
		$("#battle-info").append("<p>You have been defeated! Game Over.</p>"); //display game over message
	}
	else if (enemyHp <= 0) { //if enemy HP is 0 or below
		$(".current-enemy").remove(); //remove enemy character div from DOM
		inCombat = false;
		enemiesLeft--; //reduce counter of enemies remaining
		if (enemiesLeft == 0) { //if no enemies remain
			$("#battle-info").text("You have defeated all enemies! You Win!"); //display victory message
		}
		else { //if there are still enemies left
			//display won battle message
			$("#battle-info").text("You have defeated " +characters[enemyId].name +"! Please select a new opponent.");
		}
	}
}

$(document).ready(function() {
	gameInit();

	//CHARACTER SELECTION
	$("#player-select").on("click", ".character-div", function() {
		playerId = parseInt($(this).attr("data-index")); //extract index number of selected character
		playerHp = characters[playerId].hp; //set player HP
		playerAttack = characters[playerId].attack; //set player Attack

		var playerDiv = $("div[data-index=" +playerId +"]"); //store location of player character div
		playerDiv.attr("class", "character-div player-character"); //change class of PC div
		$(playerDiv).detach().appendTo("#player-area"); //move PC to player area

		for (var i = 0; i < characters.length; i++) { //change all other characters to enemies
			if (i !== playerId) {
				var currentDiv = $("div[data-index=" +i +"]"); //select div that matches current index
				currentDiv.attr("class", "character-div enemy-character"); //change class to enemy
				$(currentDiv).detach().appendTo("#enemy-select");
			}
		}
	});
	
	//ENEMY SELECTION
	$("#enemy-select").on("click", ".enemy-character", function() {
		if (!inCombat) {
			enemyId = parseInt($(this).attr("data-index")); //extract index number of selected character
			enemyHp = characters[enemyId].hp; //set enemy HP
			enemyAttack = characters[enemyId].counter; //set enemy Attack

			var enemyDiv = $("div[data-index=" +enemyId +"]"); //store location of enemy character div
			enemyDiv.attr("class", "character-div enemy-character current-enemy"); //adds current-enemy class
			$(enemyDiv).detach().appendTo("#defender-area"); //move PC to defender area
			inCombat = true;
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
});
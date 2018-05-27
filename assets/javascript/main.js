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
var playerHp = 0;
var playerAttack = 0;
var enemyHp = 0;
var playerId;
var enemyId;
var playerDiv;

function gameInit() { //set up game
	for (var i = 0; i < characters.length; i++) { //for each character in array
		var characterDiv = $(document.createElement("div")); //create new div to house character info
		characterDiv.attr("class", "character-div select-player-character");
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

$(document).ready(function() {
	gameInit();

	$(document).on("click", ".select-player-character", function() { //CHARACTER SELECTION
		playerId = parseInt($(this).attr("data-index")); //extract index number of selected character
		playerHp = characters[playerId].hp; //set player HP
		playerAttack = characters[playerId].attack; //set player Attack

		playerDiv = $("div[data-index=" +playerId +"]"); //store location of player character div
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
});
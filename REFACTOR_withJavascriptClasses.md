CLASSES:



1\. GameBoardPiece // per <player/npc> on board



2\. GameBoardHelper // static class



3\. GameManager // "singleton" \~MAIN STATE\~



4\. MathHelper // static class



5\. GameBoardTile // per unique i, j combo



6\. GameBoardTileStatus // per unique status, "flyweight"



7\. GameBoardPieceAbility // class functions = per ability per player



8\. Team





DATA\_FILES:

&#x09;- hard-coded MAP\_TILES (eg. PENINSULA\_TILE\_LOOKUP)

&#x09;- DEFAULT\_ABILITY\_DATA

&#x09;- PLAYER\_CLASSES\_LOOKUP // display element names in order of highlighted buttons on UI (use sorted lookup string behind the scenes...)

&#x09;	- TO-DO: add 'water' element classes



&#x09;- TO-DO: default GameBoard scale, move max cols/rows, TILE\_DIRS, TILE\_DIR\_NORM\_VECS, TILE\_DIR\_ROTATIONS\_IN\_DEGREES into GameBoardHelper

&#x09;- TO-DO: getAbilityPickerDescription hard-coded data into DEFAULT\_ABILITY\_DATA

&#x09;- TO-DO: add default spinner fa icon to correct data file





\- - - - - - - -





1\. GameBoardPiece // subclassed: (1) Player, (2) Non-Player: (2a) Kaiju, (2b) Kaiju-Warrior



FIELDS:

&#x20; isHealed: false,

&#x20; isTeleported: false,

&#x20; shouldTeleport: true/false, // replaces 'teleportData'(?)

&#x20; color: "#55AAff",

&#x20; dir: "idle",

&#x20; isThere: true,

&#x20; lives: 4,

&#x20; moveSpeed: 7,

&#x20; isOnTiles: true,

&#x20; ~~isKaiju: false,~~ // REMOVE??

&#x20; isGoingToSpewFire: false, // Kaiju-only

&#x20; isDead: false,

&#x20; lastDmg: 0, // accTime for last dmg taken

&#x20; lastDmgAccTimeInterval: 0, // accTime interval between dmg is applied (or removed). staggers dmg and heals.

&#x20; maxLives: 4, // maxLives the player can have

&#x20; storedPassive: undefined, // used for all pieces.

&#x20; livesModifier: 0, // used for all pieces.

&#x20; numTilesModifier: 0, // used for all pieces.

&#x20; tileCountModifier: 0, // used for all pieces.

&#x20; moveSpeedModifier: 0, // used for all pieces.

&#x20; playerClass: "",  // used for all pieces. hover over avatar UI image to see(?)

&#x20; playerClassDescription: "",  // used for all pieces. hover over avatar UI image to see(?)

&#x20; elements: "", // elements of player abilities // used for all pieces.

&#x20; isMovementKeyInput: false // for player-only

&#x20; avatar: "guy" / "girl" / "punk" / "kaiju", // (OLD: 'gender')

&#x20; charLocation: { x, y },

&#x20; moveFromLocation: { x, y },

&#x20; moveToLocation: { x, y },

&#x20; moveToTiles: \[], // array of tiles: { i, j }

&#x20; tile: { i, j },

&#x20; i // index of piece into array of all pieces

&#x20; team // integer. same integer = same team. cannot damage teammates (no friendly fire)

&#x20; abilities: \[], // array of abilities

&#x20; isPlayer: true/false,



METHODS:

&#x20; movePiece // sub-classed. 3 types: player, kaiju, teammate/human opponent. contains AI-logic

&#x20; 	moveTo // basic "calculate new xy-location based on desired direction and moveSpeed". // used for all pieces

&#x20; 	usePowers // for non-players

&#x20; 	moveCloserToEnemy, // for non-players

&#x20; 	moveFartherAwayFromEnemy, // for non-players

&#x20; 	followPlayerWithinNumTiles // for non-players, param: 'numTiles'

&#x09;dmgEnemyOnSameTile // Kaiju-only. dmg any non-Kaiju enemy on the same tile. called every tick of movement.

&#x20; handlePlayerKeyInput // wrapper for all logic related to setting correct movement data from player-pressed keys. player-only

&#x20; 	getDirFromPlayerInput // player-only

&#x20; 	convertWasdDirToAnimationDir // player-only

&#x09;isPlayerInputUpdate // player-only

&#x20; isDamageable // used for all pieces

&#x20; decrementHealth // includes healing (negative decrement = heal) // used for all pieces

&#x09;handleDeath // used for all pieces

&#x20; getNumTilesInPath // basic utility wrapper that wraps a .length call to an array of tiles in a path

&#x20; spawnDeathPiece // pieceAdded to the board on piece's death. representation varies per piece. (example: 'Exploding Kaiju' sprite anim.)

&#x20; getIdealRangeInTilesFromEnemyGivenPlayerAbilitiesNotOnCooldown // default to 10 if all abilities are on cooldown. override between player/non-player





5\. GameBoardHelper // static(?) helper class that manages pieces in relation to board tiles. has methods like:

&#x09;   'getClosestEnemy',

&#x09;   'getClosestEnemyTileAndIndexFromOriginTile', // getClosestEntityTileAndIndexFromOriginTile

&#x09;					  	// used for tile statuses ('shootPower'), used by Kaiju

&#x09;   'getEnemyTiles', // returns an array of tiles with opponent pieces

&#x20;          'getPathToClosestEnemy',

&#x09;   'getIsPieceInDanger'

&#x20;          'getPathToSafeTile',

&#x20;          'getPathToSafeTileAndAvoidEnemies',

&#x20;          'getSafeTile',

&#x20;          '~~findPath~~', // private method

&#x20;          '~~findPathAroundEnemies~~' // private method

&#x09;   'getTileOffsetFromDir'

&#x09;   'isTileOnGameBoard' // OLD

&#x09;   'isTileVisible' // NEW

&#x09;   'resetHightlightedTiles'

&#x09;   'getRandomTileOnBoard'

&#x09;   'getRandAdjacentTile'

&#x09;   'getAdjacentTiles'

&#x09;   'getAdjacentAdjacentTiles'

&#x09;   'areTilesAdjacent'

&#x09;   'getAnimDirFromNormVec' // replaces: 'getMonsterSwimAnimDirFromNormVec'

&#x09;   'getDistanceBetweenTiles' // replaces: 'getDistance'

&#x09;   'getTileXAndY' // params: i, j, scale // use for tiles

&#x09;   'getCharXAndY' //  params: i, j, scale // use for pieces ('getTileXAndY' and 'getCharXAndY' are different)

&#x09;   'getPieceOnTile' // called by TileStatus(?) when TileStatus is applied to new tile.

&#x09;		    // if piece on tile and TileStatus isDmgStatus (includes 'Love' status)

&#x09;		    // and piece 'lastDmgAccTimeInterval' is past, call piece's 'decrementHealth' method



&#x09;NEED: way of passing optional boundaries in the form of a lookup or i, j, high/low...

&#x09;	ideally this is stored on GameBoardManager class and can be optioned into when calling a method w/o passing crazy data params...

&#x09;	maybe call public class method by wrapping the method in another public class call that has desired bounds.

&#x09;	EXAMPLE:

&#x09;		const adjTiles = boundByBridgeTilesLookup(getAdjacentTiles(tileParam));

&#x09;		const adjAdjTiles = boundByPeninsulaTilesLookup(getAdjacentAdjacentTiles(tileParam));

&#x09;		const safeTile = boundByIJ(getSafeTile(<pieceIndex/teamIndex>), i\_high, j\_high, optional: {  i\_low, j\_low });

&#x09;		const safeTile = boundByVisibleTiles(isTileOnGameBoard(tileParam));





6\. GameManager // reference to game manager class that manages game state. holds all game state(?)

&#x09;FIELDS:

&#x09;   'pieces' // array

&#x09;   'tiles' // 2D array

&#x09;   'numTileColumns' // integer

&#x09;   'numTileRows' // integer

&#x09;   'abilities' // array (ensure to copy abilities when assigning...)

&#x09;   'tileStatuses' // "flyweight" pattern. shared data instances between tiles.

&#x09;   'score' // lookup<string, +int>(?) per-team death count. (what if multiple teams?)

&#x09;   'highlightedTiles' // tile path, array of tiles. based on player input

&#x09;   'isTutorial' // boolean

&#x09;   'isGame' // boolean

&#x09;   'isSettings' // boolean

&#x09;   'tutorialIndex' // integer. currently viewed tutorial screen

&#x09;   'pauseAccTime' // integer. accTime the game was paused at.

&#x09;   'timoutRefLookup' // clear timeoutRefs on pause and restart at correct times on unpause

&#x09;   'isRenderTiles' // global boolean for all tiles

&#x09;   'isRenderMap' // global boolean to show city map

&#x09;   'scale' // scale of gameboard: map + pieces + tiles

&#x09;   'gameMode' // Enum

&#x09;   'zoomLvl' // enum, 3 values: no-zoom, zoomLvl1, zoomLvl2. dictates: Kaiju piece size, map scale and position, tile visibility, player piece movement (move tiles vs move pieces)

&#x09;   'timeoutHandler' // a class for handling all setIntervals and setTimeouts...





&#x09;METHODS:

&#x09;   'updateDifficulty'

&#x09;   'updatePlayerAvatar'

&#x09;   'updateGameMode' // enum

&#x09;   'determineKaijuDetailsFromDifficulty' // replaces: 'determineKaijuQuantity'

&#x09;   'updateScore' // accepts team num. called when GameBoardPiece's 'decrementHealth' results in death.

&#x09;   'getIsGameOver' // boolean

&#x09;   'getIsSpawnNewKaiju' // private method

&#x09;   'spawnNewKaiju' // private method

&#x09;   'respawnKaiju'// private method

&#x09;   'updateTileState'

&#x09;	'solveForStatusWithNoCounts'

&#x09;	'solveForNextTile'

&#x09;	'solveForWallReflectionStatus'

&#x09;	'solveForCurrentTile'

&#x09;	'applyDmg'

&#x09;	'solveForStatus'

&#x09;   'redrawTiles'

&#x09;   'initGameBoard'

&#x09;   'updateAbility' // Ability Editor

&#x09;   'movePieces'

&#x09;   'goToTutorialPage(tutorialIndex)'

&#x09;   'goToMainMenu'

&#x09;   'goToSettings'

&#x09;   'togglePauseGame' // needs to handle all setTimeouts and setIntervals...

&#x09;   'zoomInToTile(zoomTile, desiredZoomOutInNumTilesFromZoomTile)'

&#x09;	'updateScale'

&#x09;   'resetZoom'

&#x09;



7\. MathHelper // static(?) helper class that handles random math operations

&#x09;'getRandomIntInRange'

&#x09;'shouldUpdate'





3\. GameBoardTile // per unique i, j

&#x09;FIELDS:

&#x09;  - tileIndex: { i, j } // i = col, j = row

&#x09;  - isVisible // cached on init

&#x09;  - tileLocation // cached on init 'getTileXAndY'

&#x09;  - zIndex // = i + j + rowLength // cached on init

&#x09;  - scale // cached, but can be updated(?) an automatic "zoom" feature would be great...

&#x09;  - isHighlighted // replaces: 'isHighlighted0'

&#x09;  - tileStatus // 'GameBoardTileStatus,' shared "flyweight" instance

&#x09;

&#x09;  // tile-unique tileStatus values:

&#x09;  - currCount

&#x09;  - targetIndex

&#x09;  - teamIndex // replaces 'isKaiju'

&#x09;  - dirs

&#x09;  - updateKey // stored accTime of last tileStatus update

&#x09;  - dmgModifier





&#x09;  // - - - - - - - - - - - - - - -

&#x09;



&#x09;METHODS:

&#x09;  'updateIsVisible'

&#x09;  'updateTileLocation'

&#x09;  'updateZIndex' // if rowLength of board changes

&#x09;  'updateScale'

&#x09;  'updateIsHighlighted'

&#x09;  'getIsDmgTile'



&#x09;REACT COMPONENT:

&#x09;  'key'

&#x09;  'setClickedTile'





4\. GameBoardTileStatus // per unique status, "flyweight"



&#x09;FIELDS:

&#x09;	- key, examples:

&#x09;		'isTeleportTile'

&#x09;		'isHealing'

&#x09;		'isBubble'

&#x09;		'isGhosted'

&#x09;		'isElectrified'

&#x09;		'isCold'

&#x09;		'isShielded'

&#x09;		'isOnFire'

&#x09;		'isOnKaijuFire'

&#x09;		'isWet'

&#x09;		'isWooded'

&#x09;	- priority // integer, higher beats lower

&#x09;	- totalCount // total count in tiles that status can travel. decrements each new tile status travels to.

&#x09;	- bounceCountResetVal // if bouncy and count is greater than 'bounceCountResetVal',

&#x09;					'GameBoardTile''s 'tileCount' is reset to 'bounceCountResetVal'

&#x09;	- isPersistent // do not erase if count = 0

&#x09;	- dmgAmt // 'isHealing' = -1, all other isDmgTile = true tiles are +1 for dmgAmt

&#x09;	- isBouncy: true/false // reflect status back onto gameboard if status moves out of boundaries of gameboard

&#x09;	- bounceLogic // custom logic on how to reflect

&#x09;			// (eg. fire should float upward, water should drip down, lightning should reflect, wood should do something cool...)

&#x09;	- isLeaveTrail // currentTile status is left behind on tile with a count of 0 after solving and setting the status on the next tile(s)



&#x09;	- isRotating // RANGE

&#x09;	- isConserveDirections // RANGE

&#x09;	- isTracking // RANGE

&#x09;	- isSpread(numDirsToIncreaseDecrease) // EVENT, caps at 6 and 1

&#x09;	- isReverseDirection // EVENT



&#x09;METHODS:

&#x09;	- updatePriority(integer)

&#x09;	- updateTotalCount(integer) // ie. startCount

&#x09;	- updateIsPersistent(boolean)

&#x09;	- updateIsDmgTile(boolean)

&#x09;	- updateIsBouncy(boolean)

&#x09;	- updateIsLeaveTrail(boolean)

&#x09;	- updateIsRotating(\[\[countTo,countFrom]...]) // exclusive (to, from), not \[to, from]

&#x09;	- updateConserveDirections(\[\[countTo,countFrom]...]) // exclusive (to, from), not \[to, from]

&#x09;	- updateIsTracking(\[\[countTo,countFrom]...]) // exclusive (to, from), not \[to, from]

&#x09;	- updateIsSpread(\[countToTriggerEvent1, countToTriggerEvent2, ...])

&#x09;	- updateIsReverseDirection(\[countToTriggerEvent1, countToTriggerEvent2, ...])

&#x09;	- updateDmgAmt

&#x09;	- getDmgAmt





/\*



key = isOnFire



solver = { 'isWooded': -1,  }



&#x09;		'isTeleportTile'

&#x09;		'isHealing'

&#x09;		'isBubble'

&#x09;		'isGhosted'

&#x09;		'isElectrified'

&#x09;		'isCold'

&#x09;		'isShielded'

&#x09;		'isOnFire'

&#x09;		'isOnKaijuFire'

&#x09;		'isWet'

&#x09;		'isWooded'







\*/





2\. GameBoardPieceAbility



&#x09;FIELDS:

&#x09;	- color

&#x09;	- passiveName

&#x09;	- activeName

&#x09;	- passiveIcon

&#x09;	- activeIcon

&#x09;	- passiveDesc

&#x09;	- activeDesc

&#x09;	- passiveEffect1

&#x09;	- passiveEffect2

&#x09;	- activeEffect1

&#x09;	- activeEffect2

&#x09;	- desiredAIRange // replaces "range" on existing object

&#x09;	- range // "start count" / "total count" / "count" / "tileCount"

&#x09;	- area // "numTiles" / "spread"

&#x09;	- type // array \[] of enums: offensive, defensive, heal, escape

&#x09;	- displayLookup // eg. 'abilityGlass'

&#x09;	- element // "ice"

&#x09;	- accTime // last game time power was used. starts at 0

&#x09;	- cooldownTimeAI // for non-player-only: stops ability from being cast again until current accTime >= ability accTime + cooldownTimeAI

&#x09;	- cooldownTimePlayer // for player-only: stops ability from being cast again until current accTime >= ability accTime + cooldownTimeAI

&#x09;	- passiveDurationTime // how long the passive stat modifier should be applied to ability user. can be longer or shorter than cooldown

&#x09;				// passive stat modifier can be positive or negative so a longer effect time can be good or bad

&#x09;	- statusApplied // eg. "isWet," "isOnFire"

&#x09;	- isTriggerPassiveImmediately: true/false

&#x09;	- modifierVal // integer. the modifier value to apply

&#x09;	- fieldToModify // string, eg. "range"

&#x09;	- toggleOffPassiveTimeoutRef // integer

&#x09;	- isPassiveApplied // true/false

&#x09;	- isOnCooldown





&#x09;METHODS:

&#x09;

&#x09;	- getElementUppercase

&#x09;	- useAbility

&#x09;	- togglePassive // <- COPY. ability instances(?) need to be unique between characters so they do not trigger each other's abilities.

&#x09;		- modifyStats

&#x09;			- PARAMS:

&#x09;				- userOfAbilityDataObject // object, has fields to modify

&#x09;				- toggleOff // boolean, apply effect = false, undo apply effect = true.

&#x09;				- fieldToModify // string, eg. "range"

&#x09;				- value to add // integer, eg. 1 or -1, "toggleOff" inverts this value by multiplying by -1

&#x09;	- activateActive // <- COPY. ability instances(?) need to be unique between characters so they do not trigger each other's abilities.

&#x09;		- shootPower

&#x09;			- PARAMS:

&#x20;       				- playData,

&#x20;       				- playerIndexInPlayerDataArray

&#x20;       				- enemyData

&#x09;				- scale // of game board

&#x20;       				- count // integer, <start / total> count

&#x20;       				- statusKey // status applied, eg. "isHealing"

&#x09;				- numTiles // integer, "range", "spread of effect" in desired direction (one side of current hexagon tile)

&#x09;						// at each update



&#x09;- TO-DO: look into IIFE's to see if methods can be copied per ability user and still reference the shared, static data (ie. FIELDS)


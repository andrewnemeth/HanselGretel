const WITCH_PLANE = 10
const WITCH_COLOR = PS.COLOR_GREEN
const WITCH_ID = 7
var hutLevel = ( function () {

    function onWin(){
        PS.timerStop( _id_timer ); // stop movement timer
        _won = true;
        timeSpentOnPlanning = PS.elapsed()/1000

        loadLevel(levelNum+1)
    }

    var followerID ;

    var STARTING_ROCKS = 3
    var rockCount = STARTING_ROCKS;

    var _id_sprite; // actor sprite id
    var _id_path; // pathmap id for pathfinder
    var _id_timer; // timer id

    var _gold_count = 0; // initial number of gold pieces in map
    var _gold_found = 0; // gold pieces collected
    var _won = false; // true on win

    var _exit_ready = false; // true when exit is opened

    var _path; // path to follow, null if none
    var witchPath; // path to follow, null if none
    var _step; // current step on path
    var witchStep; // current step on path

    var _actor_x; // initial x-pos of actor sprite
    var _actor_y; // initial y-pos of actor sprite
    "use strict";
    var witch =  {x: null, y: null, sprite: null, path: null, step: null}
    var _exit_x; // x-pos of exit
    var _exit_y; // y-pos of exit


    function determinePath() {
        var line;

        // Do nothing if game over

        if ( _won ) {
            return;
        }

        // Use pathfinder to calculate a line from current actor position
        // to touched position
        if(keyDown[D_KEY]){//d
            line = PS.pathFind( _id_path, _actor_x, _actor_y, _actor_x+1, _actor_y );
        }else if(keyDown[S_KEY]){//s
            line = PS.pathFind( _id_path, _actor_x, _actor_y, _actor_x, _actor_y+1 );
        }else if(keyDown[W_KEY]){//s
            line = PS.pathFind( _id_path, _actor_x, _actor_y, _actor_x, _actor_y-1 );
        }else if(keyDown[A_KEY]){//s
            line = PS.pathFind( _id_path, _actor_x, _actor_y, _actor_x-1, _actor_y );
        }else{
            line = []
        }

        // If line is not empty, it's valid,
        // so make it the new path
        // Otherwise hoot at the player

        if ( line.length > 0 ) {
            _path = line;
            _step = 0; // start at beginning

        }

    }
    var playerHasMoved = false;
    var candyEaten
    function movePlayerEvalVictory() {
        var p, nx, ny, ptr, val;

        if ( !_path ) { // path invalid (null)?
            return; // just exit
        }

        // Get next point on path

        p = _path[ _step ];
        nx = p[ 0 ]; // next x-pos
        ny = p[ 1 ]; // next y-pos

        // If actor already at next pos,
        // path is exhausted, so nuke it

        if ( ( _actor_x === nx ) && ( _actor_y === ny ) ) {
            _path = null;
            return;
        }

        if(!playerHasMoved){
            setText("Place/Pickup stones with space")
            playerHasMoved = true

        }


        //MOVE FOLLOWER
        PS.spriteMove( followerID,_actor_x, _actor_y);



        // Move sprite to next position
        PS.audioPlay( _SOUND_FLOOR );
        PS.spriteMove( _id_sprite, nx, ny );
        _actor_x = nx; // update actor's xpos
        _actor_y = ny; // and ypos



        // If actor has reached a gold piece, take it

        ptr = ( _actor_y * maze.height ) + _actor_x; // pointer to map data under actor
        val = maze.data[ ptr ]; // get map data

        //eat candy
        if(maze.data[xyToIndex(_actor_x,_actor_y,maze.width)] == CANDY_ID && !candyEaten[xyToIndex(_actor_x,_actor_y,maze.width)]){
            eatCandy(_actor_x,_actor_y)
        }

        // If exit is ready and actor has reached it, end game

        if ( _exit_ready && ( _actor_x === _exit_x ) && ( _actor_y === _exit_y ) ) {

            onWin()
            return;
        }



        _step += 1; // point to next step

        // If no more steps, nuke path

        if ( _step >= _path.length ) {
            _path = null;
        }

        PS.timerStop(moveTimer)
        moveTimer = PS.timerStart(speed,movePlayerEvalVictory)
    }

    var speed = TIMER_INTERVAL

    function eatCandy(x,y) {
        PS.color(x,y,FLOOR_COLOR)
        speed+=CANDY_SLOW
        PS.audioPlay(EAT_CANDY_SOUND)
        candyEaten[xyToIndex(x,y,maze.width)] = true
    }

    var _tick = function () {
        determinePath()
        //movePlayerEvalVictory()

    }

    function setText(text) {
        if(!hasCrows){
            PS.statusText(text)
        }else{
            PS.statusText("You only have breadcrumbs now...")
        }
    }

    function initMapAndPlayer() {

        var x, y, val;
        // Establish grid size
        // This should always be done FIRST, before any other initialization!

        PS.gridSize( maze.width, maze.height );
        PS.gridColor( GRID_DAY_COLOR ); // grid background color
        PS.border( PS.ALL, PS.ALL, 0 ); // no bead borders

        // Locate positions of actor and exit, count gold pieces, draw map

        _gold_count = 0;
        _actor_x = _exit_x = -1; // mark as not found
        for (y = 0; y < maze.height; y += 1 ) {
            for (x = 0; x < maze.width; x += 1 ) {
                val = maze.data[ ( y * maze.height ) + x ]; // get map data
                if ( val === WALL_ID ) {
                    PS.color( x, y, _COLOR_WALL );
                }
                else if ( val === FLOOR_ID ) {
                    PS.color( x, y, FLOOR_COLOR );
                }else if ( val === CANDY_ID ) {
                    PS.color( x, y, CANDY_COLOR );
                }

                else if ( val === ENTRANCE_ID ) {
                    if ( _actor_x >= 0 ) {
                        PS.debug( "WARNING: More than one actor!\n" );
                        PS.audioPlay( _SOUND_ERROR );
                        return;
                    }
                    _actor_x = x;
                    _actor_y = y;
                    //maze.data[ ( y * maze.height ) + x ] = FLOOR_ID; // change actor to floor
                    PS.color( x, y, ENTRANCE_COLOR );
                }
                else if ( val === EXIT_ID ) {
                    if ( _exit_x >= 0 ) {
                        PS.debug( "WARNING: More than one exit!\n" );
                        PS.audioPlay( _SOUND_ERROR );
                        return;
                    }
                    _exit_x = x;
                    _exit_y = y;
                    //maze.data[ ( y * maze.height ) + x ] = FLOOR_ID; // change exit to floor
                    PS.color( x, y, _COLOR_EXIT );
                }else if (val == WITCH_ID){
                    witch.x = x
                    witch.y = y
                    PS.color( x, y, FLOOR_COLOR );

                }
            }
        }


        // Create 1x1 solid sprite for actor
        // Place on actor plane in initial actor position

        _id_sprite = PS.spriteSolid( 1, 1 );
        PS.spriteSolidColor( _id_sprite, _COLOR_ACTOR );
        PS.spritePlane( _id_sprite, _PLANE_ACTOR );
        PS.spriteMove( _id_sprite, _actor_x, _actor_y );

        followerID =  PS.spriteSolid( 1, 1 );
        PS.spriteSolidColor( followerID, FOLLOWER_COLOR );
        PS.spritePlane( followerID, FOLLOWER_PLANE );

        PS.spriteMove( followerID, _actor_x, _actor_y -1);


        // Create pathmap from our imageMap
        // for use by pathfinder

        _id_path = PS.pathMap( maze );

        // Start the timer function that moves the actor
        // Run at 10 frames/sec (every 6 ticks)

        _path = null; // start with no path
        _step = 0;
        _id_timer = PS.timerStart( TIMER_INTERVAL, _tick );


        _exit_ready = true;
        PS.color( _exit_x, _exit_y, _COLOR_EXIT ); // show the exit
        PS.glyphColor( _exit_x, _exit_y, PS.COLOR_WHITE ); // mark with white X
        PS.glyph( _exit_x, _exit_y, "X" );
        //PS.audioPlay( _SOUND_OPEN );
    }




    // Public functions are exposed in the global G object, which is returned here.
    // Only two functions need to be exposed; everything else is encapsulated!
    // So safe. So elegant.

    var maze
    var levelNum
    var hasCrows
    var DROP_COLOR
    var moveTimer
    return {
        // Initialize the game
        // Called once at startup

        init : function (withmaze, doesHaveCrows, onlevel) {
            speed = HUT_START_SPEED
            hasCrows = doesHaveCrows
            candyEaten = []
            playerHasMoved = false
            setText("Follow father with WASD")

            if(hasCrows){
                DROP_COLOR = BREAD_COLOR
            }else{
                DROP_COLOR = ROCK_COLOR
            }
            levelNum = onlevel
            maze = withmaze
            _won = false
            rockPos = []
            rockCount = STARTING_ROCKS
            moveTimer = PS.timerStart(speed,movePlayerEvalVictory)
            initMapAndPlayer()
            initWitch()
        },

        keyDown : function (key, shift, ctrl, options ) {
            keyDown[key] = true
            determinePath()
            if(key == SPACE_KEY){
                dropRockCommand(_actor_x,_actor_y)
            }
        },

        keyUp : function (key, shift, ctrl, options ){
            keyDown[key] = false
        }

    };

    //==================== WITCH FUNCTIONS
    var witch =  {x: null, y: null, sprite: null, path: null, step: null}
    var witchTimer
    var witchTickSpeed = 12

    function witchTick() {
        moveWitch()

    }
    function moveWitch(){
        var p, nx, ny, ptr, val;


        if ( !witch.path ) { // path invalid (null)?
            return; // just exit
        }

        // Get next point on path

        p = witch.path[ witch.step ];
        nx = p[ 0 ]; // next x-pos
        ny = p[ 1 ]; // next y-pos

        // If actor already at next pos,
        // path is exhausted, so nuke it

        if ( ( witch.x === nx ) && ( witch.y === ny ) ) {
            _path = null;
            return;
        }


        // Move sprite to next position
        PS.spriteMove( witch.sprite, nx, ny );
        witch.x = nx; // update actor's xpos
        witch.y = ny; // and ypos

        witch.step += 1; // point to next step

        // If no more steps, nuke path

        if ( witch.step >= witch.path.length ) {
            witch.path = null;
        }

        updateWitchPath()
    }

    function initWitch() {
        witchTickSpeed = 12
        witch.sprite = PS.spriteSolid( 1, 1 );

        PS.spriteSolidColor( witch.sprite, WITCH_COLOR );
        PS.spritePlane( witch.sprite, WITCH_PLANE );
        PS.spriteMove( witch.sprite, _actor_x, _actor_y );

        witchTimer = PS.timerStart(witchTickSpeed,witchTick)

        updateWitchPath()

    }
    function updateWitchPath() {
        witch.path = PS.pathFind( _id_path, witch.x, witch.y, _actor_x,_actor_y);
        witch.step = 0;
        if ( witch.step >= witch.path.length ) {
            witch.path = null;
        }
    }
} () ); // end of IIFE

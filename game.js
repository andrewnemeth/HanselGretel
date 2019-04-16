// game.js for Perlenspiel 3.3.x
// The following comment lines are for JSHint. Don't remove them!

/* jshint browser : true, devel : true, esversion : 5, freeze : true */
/* globals PS : true */

// The G variable encapsulates all app constants, variables and functions, public and private.
// It is initialized on file load with an immediately-invoked function expression (IIFE).
var NIGHT_GRID_SIZE = 5;//must be odd
var GRID_DAY_COLOR = PS.COLOR_WHITE; // background color
var GRID_NIGHT_COLOR = PS.COLOR_GRAY_DARK; // background color
var _COLOR_WALL = [55,50,24]; // wall color
var _COLOR_FLOOR = PS.COLOR_GRAY; // floor color
var _COLOR_GOLD = PS.COLOR_YELLOW; // gold color
var _COLOR_ACTOR = [91,110,225]; // actor color
var OOB_COLOR = [55,50,24]
var TIMER_COLOR = PS.COLOR_RED
const GUIDE_COLOR = [217,87,99]; // actor color
var _COLOR_EXIT = [172,50,50]; // exit color
const ROCK_COLOR = [182,224,241]
var MARK_COLOR = [217,160,102]
var ENTRANCE_COLOR = PS.COLOR_YELLOW


var maze1 = {
    width : 32, height : 32, pixelSize : 1,
    data : [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 1, 1, 0, 1, 1, 0, 3, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0,
        0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 4, 0, 1, 0, 1, 1, 0, 0,
        0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0,
        0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0,
        0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
        0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0,
        0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
        0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0,
        0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0,
        0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0,
        0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0,
        0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0,
        0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0,
        0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
};

// const maze1 = {
//     width : 23, height : 23, pixelSize : 1,
//     data : [
//         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//         0, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0,
//         0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0,
//         0, 1, 1, 1, 0, 1, 4, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0,
//         0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
//         0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
//         0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0,
//         0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
//         0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0,
//         0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0,
//         0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0,
//         0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
//         0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
//         0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0,
//         0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
//         0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0,
//         0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
//         0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
//         0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0,
//         0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0,
//         0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0,
//         0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0,
//         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
//     ]
// };

var maze1DayData = {width: maze1.width,height: maze1.height,pixelSize: maze1.pixelSize,data: maze1.data}

const SPACE_KEY = 32;

// Private constants are all upper-case, with underscore prefix

var _PLANE_FLOOR = 0; // z-plane of floor
var _PLANE_ACTOR = 3; // z-plane of actor
const GUIDE_PLANE = 4;
var MARK_PLANE = 1;
const ROCK_PLANE = 2;





var _SOUND_FLOOR = "fx_click"; // touch floor sound
var _SOUND_WALL = "fx_hoot"; // touch wall sound
var _SOUND_GOLD = "fx_coin1"; // take coin sound
var _SOUND_OPEN = "fx_powerup8"; // open exit sound
var _SOUND_WIN = "fx_tada"; // win sound
var _SOUND_ERROR = "fx_uhoh"; // error sound
var LOSE_SOUND = "fx_wilhelm"

var WALL_ID = 0; // wall
var FLOOR_ID = 1; // floor
var _MAP_GOLD = 2; // floor + gold
var ENTRANCE_ID = 3; // floor + actor
var _MAP_EXIT = 4; // floor + exit
var ROCK_ID = 5


var _GOLD_MAX = 10; // maximum gold

var guide =  {x: null, y: null, sprite: null, path: null, step: null}

var MARK_ALPHA = 100

var rockPos = [] //stores rock locations in form {x,y}

var rockCount = 3;

const TIMER_INTERVAL = 6

var timeSpentOnPlanning = -1;

// This imageMap is used for map drawing and pathfinder logic
// All properties MUST be present!
// The map.data array controls the layout of the maze,
// the location of the gold pieces, the actor and the exit
// 0 = wall, 1 = floor, 2 = floor + gold, 3 = floor + actor, 4 = floor + exit
// To move a gold piece, swap a 2 with a 1
// To move the actor's initial position, swap the 3 and a 1
// To move the exit's position, swap the 4 and a 1
// You cannot have more than one actor/exit, or more than _GOLD_MAX (10) gold pieces!



// Private constants are all lower-case, with underscore prefix
// Many JS programmers prefer camelCase for variables, but I think underscores are more readable
// The compiler doesn't care. Use whatever works for you ... or what your employer demands.

var _id_sprite; // actor sprite id
var _id_path; // pathmap id for pathfinder
var _id_timer; // timer id

var _gold_count = 0; // initial number of gold pieces in map
var _gold_found = 0; // gold pieces collected
var _won = false; // true on win

// These two variables control the initial location of the actor

var _actor_x; // initial x-pos of actor sprite
var _actor_y; // initial y-pos of actor sprite

// These two variables control the location of the exit

var _exit_x; // x-pos of exit
var _exit_y; // y-pos of exit

var _exit_ready = false; // true when exit is opened

// Timer function, called every 1/10th sec
// This moves the actor along paths

var _path; // path to follow, null if none
var guidePath; // path to follow, null if none
var _step; // current step on path
var guideStep; // current step on path

// This timer function moves the actor
var keyDown = []

const D_KEY = 100
const S_KEY = 115
const A_KEY = 97
const W_KEY = 119

PS.shutdown = function ( options ) {
    PS.dbEvent( "winRecordsV1", "shutdown", true ,"timeSpentPlanning",timeSpentOnPlanning);
    PS.dbSend( "winRecordsV1", "aenemeth" );
};

function xyToIndex(x,y,w) {
    return (x+(y*w))
}

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

    // Move sprite to next position
    PS.audioPlay( _SOUND_FLOOR );
    PS.spriteMove( _id_sprite, nx, ny );
    _actor_x = nx; // update actor's xpos
    _actor_y = ny; // and ypos

    // If actor has reached a gold piece, take it

    ptr = ( _actor_y * maze1DayData.height ) + _actor_x; // pointer to map data under actor
    val = maze1DayData.data[ ptr ]; // get map data







    // If exit is ready and actor has reached it, end game

    if ( _exit_ready && ( _actor_x === _exit_x ) && ( _actor_y === _exit_y ) ) {
        PS.timerStop( _id_timer ); // stop movement timer
        _won = true;
        timeSpentOnPlanning = PS.elapsed()/1000
        maze1DayWon()
        return;
    }

    _step += 1; // point to next step

    // If no more steps, nuke path

    if ( _step >= _path.length ) {
        _path = null;
    }
}

var maze1Day = ( function () {
	"use strict";



    function markPath(x,y) {
        let newMark = PS.spriteSolid(1,1)
        PS.spriteSolidColor(newMark,MARK_COLOR)
        PS.spritePlane(newMark, MARK_PLANE)
        PS.spriteSolidAlpha(newMark,MARK_ALPHA)
        PS.spriteMove(newMark,x,y)
    }

    function moveGuide(){
        var p, nx, ny, ptr, val;


        if ( !guide.path ) { // path invalid (null)?
            return; // just exit
        }

        // Get next point on path

        p = guide.path[ guide.step ];
        nx = p[ 0 ]; // next x-pos
        ny = p[ 1 ]; // next y-pos

        // If actor already at next pos,
        // path is exhausted, so nuke it

        if ( ( guide.x === nx ) && ( guide.y === ny ) ) {
            _path = null;
            return;
        }
        //mark old location
        markPath(guide.x,guide.y)

        // Move sprite to next position
        PS.spriteMove( guide.sprite, nx, ny );
        guide.x = nx; // update actor's xpos
        guide.y = ny; // and ypos

        guide.step += 1; // point to next step

        // If no more steps, nuke path

        if ( guide.step >= guide.path.length ) {
            guide.path = null;
        }
	}

	var _tick = function () {
		determinePath()
		moveGuide();
		movePlayerEvalVictory()

	};

	function initMapAndPlayer() {

        var x, y, val;
        // Establish grid size
        // This should always be done FIRST, before any other initialization!

        PS.gridSize( maze1DayData.width, maze1DayData.height );
        PS.gridColor( GRID_DAY_COLOR ); // grid background color
        PS.border( PS.ALL, PS.ALL, 0 ); // no bead borders

        // Locate positions of actor and exit, count gold pieces, draw map

        _gold_count = 0;
        _actor_x = _exit_x = -1; // mark as not found
        for (y = 0; y < maze1DayData.height; y += 1 ) {
            for (x = 0; x < maze1DayData.width; x += 1 ) {
                val = maze1DayData.data[ ( y * maze1DayData.height ) + x ]; // get map data
                if ( val === WALL_ID ) {
                    PS.color( x, y, _COLOR_WALL );
                }
                else if ( val === FLOOR_ID ) {
                    PS.color( x, y, _COLOR_FLOOR );
                }

                else if ( val === ENTRANCE_ID ) {
                    if ( _actor_x >= 0 ) {
                        PS.debug( "WARNING: More than one actor!\n" );
                        PS.audioPlay( _SOUND_ERROR );
                        return;
                    }
                    _actor_x = x;
                    _actor_y = y;
                    //maze1DayData.data[ ( y * maze1DayData.height ) + x ] = FLOOR_ID; // change actor to floor
                    PS.color( x, y, ENTRANCE_COLOR );
                }
                else if ( val === _MAP_EXIT ) {
                    if ( _exit_x >= 0 ) {
                        PS.debug( "WARNING: More than one exit!\n" );
                        PS.audioPlay( _SOUND_ERROR );
                        return;
                    }
                    _exit_x = x;
                    _exit_y = y;
                    //maze1DayData.data[ ( y * maze1DayData.height ) + x ] = FLOOR_ID; // change exit to floor
                    PS.color( x, y, _COLOR_EXIT );
                }
            }
        }


        // Create 1x1 solid sprite for actor
        // Place on actor plane in initial actor position

        _id_sprite = PS.spriteSolid( 1, 1 );
        PS.spriteSolidColor( _id_sprite, _COLOR_ACTOR );
        PS.spritePlane( _id_sprite, _PLANE_ACTOR );
        PS.spriteMove( _id_sprite, _actor_x, _actor_y );

        // Create pathmap from our imageMap
        // for use by pathfinder

        _id_path = PS.pathMap( maze1DayData );

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
    
    function initGuide() {
        guide.sprite = PS.spriteSolid( 1, 1 );

        PS.spriteSolidColor( guide.sprite, GUIDE_COLOR );
        PS.spritePlane( guide.sprite, GUIDE_PLANE );
        PS.spriteMove( guide.sprite, _actor_x, _actor_y );

        guide.x = _actor_x
		guide.y = _actor_y

        guide.path = PS.pathFind( _id_path, _actor_x, _actor_y, _exit_x,_exit_y );
		guide.step = 0;
    }

    function dropRock(x,y) {
        let rockSprite = PS.spriteSolid(1,1)
        PS.spriteSolidColor(rockSprite,ROCK_COLOR)
        PS.spritePlane(rockSprite, ROCK_PLANE)
        PS.spriteMove(rockSprite,x,y)
        rockPos[x+(y*maze1DayData.width)] = rockSprite
    }
    function pickUpRock(x,y) {
	    PS.spriteDelete(rockPos[xyToIndex(x,y,maze1DayData.width)])
        rockPos[xyToIndex(x,y,maze1DayData.width)] = null
        rockCount+=1

    }

    function dropRockCommand(x,y) {
	    if(rockPos[xyToIndex(x,y,maze1DayData.width)]){
            pickUpRock(x,y)

        }else if(rockCount>0){
            dropRock(x,y)
            rockCount-=1
        }
    }

	// Public functions are exposed in the global G object, which is returned here.
	// Only two functions need to be exposed; everything else is encapsulated!
	// So safe. So elegant.

    
	return {
		// Initialize the game
		// Called once at startup

		init : function () {
            initMapAndPlayer()
			initGuide();
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

		// move( x, y )
		// Set up new path for the actor to follow

		// touch : function ( x, y ) {
		// 	var line;
		//
		// 	// Do nothing if game over
		//
		// 	if ( _won ) {
		// 		return;
		// 	}
		//
		// 	// Use pathfinder to calculate a line from current actor position
		// 	// to touched position
		//
		// 	line = PS.pathFind( _id_path, _actor_x, _actor_y, x, y );
		//
		// 	// If line is not empty, it's valid,
		// 	// so make it the new path
		// 	// Otherwise hoot at the player
		//
		// 	if ( line.length > 0 ) {
		// 		_path = line;
		// 		_step = 0; // start at beginning
		// 		PS.audioPlay( _SOUND_FLOOR );
		// 	}
		// 	else {
		// 		PS.audioPlay( _SOUND_WALL );
		// 	}
		// }

		
	};
} () ); // end of IIFE

var maze1Night =(function (){

    var MAZE_TIMER_START = 2000
    var mazeTimer = MAZE_TIMER_START
    var nightMap

    function renderMap() {
        console.log("map at start of render:",nightMap)
        for(let i = 0; i < NIGHT_GRID_SIZE; i+=1){
            for(let j = 0; j < NIGHT_GRID_SIZE; j+=1) {
                var mapX = _actor_x-Math.floor(NIGHT_GRID_SIZE/2)+i
                var mapY = _actor_y-Math.floor(NIGHT_GRID_SIZE/2)+j
                if(mapX<0 || mapY<0 || mapX>nightMap.width || mapY>nightMap.height){
                    PS.color(i,j,OOB_COLOR)

                }else{
                    console.log("data at:",mapX+(mapY*nightMap.width))
                    let val = nightMap.data[mapX+(mapY*nightMap.width)]
                    console.log("is val:",val)

                    if ( val === WALL_ID ) {
                        PS.color( i, j, _COLOR_WALL );
                    }
                    else if ( val === FLOOR_ID ) {
                        PS.color( i, j, _COLOR_FLOOR );
                    }
                    else if ( val === ENTRANCE_ID ) {

                        PS.color( i, j, ENTRANCE_COLOR );
                    }
                    else if ( val === _MAP_EXIT ) {

                        _exit_x = i;
                        _exit_y = j;
                        //maze1DayData.data[ ( y * maze1DayData.height ) + x ] = FLOOR_ID; // change exit to floor
                        PS.color( i, j, _COLOR_EXIT );
                    }
                    //Then, ovverwrite with rock
                    if(rockPos[mapX+(mapY*nightMap.width)]){
                        PS.color(i,j,ROCK_COLOR)
                    }
                }
            }
        }
        PS.color(Math.floor(NIGHT_GRID_SIZE/2),Math.floor(NIGHT_GRID_SIZE/2),_COLOR_ACTOR)

        console.log("map at end of render:",nightMap)
    }
    
    function renderTimer() {

        var percentTimer = mazeTimer/MAZE_TIMER_START
        var numberOfBeads = Math.ceil(NIGHT_GRID_SIZE*percentTimer)

        for(let x = 0; x < NIGHT_GRID_SIZE; x+=1) {
            if(x<numberOfBeads){
                PS.alpha(x,NIGHT_GRID_SIZE+1,255)
                PS.color(x,NIGHT_GRID_SIZE+1,TIMER_COLOR)
            }else{
                PS.alpha(x,NIGHT_GRID_SIZE+1,0)
            }
        }
    }

    function renderView() {
        renderMap()
        renderTimer()

    }

    var timerID
    function tick() {
        mazeTimer -= TIMER_INTERVAL
        //determine move direction from key (move nowhere if 2 keys held)
        //TODO: handle when player holds multiples keys down
        let newPos = null
        if(keyDown[D_KEY]){//d
            newPos =  {x: _actor_x+1, y: _actor_y };
        }else if(keyDown[S_KEY]){//s
            newPos =  {x: _actor_x, y: _actor_y+1 };
        }else if(keyDown[W_KEY]){
            newPos =  {x: _actor_x, y: _actor_y-1 };
        }else if(keyDown[A_KEY]){//s
            newPos =  {x: _actor_x-1, y: _actor_y };
        }

        if(newPos!=null && newPos.x >= 0 && newPos.y >=0 && newPos.x < nightMap.width && newPos.y< nightMap.height){
            //if !wall, move there
            if(nightMap.data[newPos.x+(newPos.y*nightMap.width)] != WALL_ID){
                _actor_x = newPos.x
                _actor_y = newPos.y
            }
        }
        //rendeView
        renderView()
        //if on exit, end game
        if(nightMap.data[xyToIndex(_actor_x,_actor_y,nightMap.width)]== _MAP_EXIT){
            onWin()
        }else if(mazeTimer<0){
            onLose()
        }
    }

    function onLose() {
        PS.audioPlay(LOSE_SOUND)
        PS.timerStop(timerID)
        PS.statusText("You starved in the woods...")
        let x = Math.floor(NIGHT_GRID_SIZE/2)
        let y = Math.floor(NIGHT_GRID_SIZE/2)
        if(rockPos[x+(y*nightMap.width)]){
            PS.color(x,y,ROCK_COLOR)
        }else{
            PS.color(x,y,_COLOR_FLOOR)

        }
        PS.dbEvent( "winRecordsV1","didWin",false,"timerPercent",(mazeTimer/MAZE_TIMER_START),"timeSpentPlanning",timeSpentOnPlanning);
        PS.dbSend( "winRecordsV1","aenemeth",{discard:true});

    }
    function onWin() {
        PS.audioPlay(_SOUND_WIN)
        PS.timerStop(timerID)
        PS.statusText("You made it out!")
        PS.dbEvent( "winRecordsV1","didWin",true,"timerPercent",(mazeTimer/MAZE_TIMER_START),"timeSpentPlanning",timeSpentOnPlanning);
        PS.dbSend( "winRecordsV1","aenemeth",{discard:true});

    }
    function initMapAndPlayer(){
        timerID = PS.timerStart( TIMER_INTERVAL, tick );

        nightMap = maze1
        console.log(maze1,nightMap)

        //rotate maze
        //nightMap.data.reverse()
        //TODO: also rotate the pebble positions
        //switch exit and entrance
        let entrancePos = {}
        let exitPos = {}
        for (let y = 0; y < nightMap.height; y += 1 ) {
            for (let x = 0; x < nightMap.width; x += 1 ) {
                if(nightMap.data[ ( y * maze1DayData.width ) + x ] == 4){//exit
                    exitPos = {x:x,y:y}
                }
                if(nightMap.data[ ( y * maze1DayData.width ) + x ] == 3){//entrance
                    entrancePos = {x:x,y:y}
                }
            }
        }
        nightMap.data[ ( entrancePos.y * nightMap.height ) + entrancePos.x ] = 4
        nightMap.data[ ( exitPos.y * nightMap.height ) + exitPos.x ] = 3


        //place player at entrance
        _actor_x = exitPos.x
        _actor_y = exitPos.y
        //init grid size
        PS.gridSize(NIGHT_GRID_SIZE, NIGHT_GRID_SIZE+2)
        PS.border(PS.ALL,PS.ALL,0)
        PS.gridColor(GRID_NIGHT_COLOR)

        for(let x = 0; x<NIGHT_GRID_SIZE;x+=1){
            PS.alpha(x,NIGHT_GRID_SIZE,0)
        }
        //render the small night view
        renderView()
    }

    return {
    // Initialize the game
    // Called once at startup

    init : function () {
        PS.statusColor([255,255,255])

        PS.statusText("Find your way back out!")
        initMapAndPlayer()
    },

    keyDown : function (key, shift, ctrl, options ) {
        keyDown[key] = true
        determinePath()

    },

    keyUp : function (key, shift, ctrl, options ){
        keyDown[key] = false
    }



};
} () ); // end of IIFE



function setPSFunctions(level) {
    PS.touch = level.touch;
    PS.keyDown = level.keyDown;
    PS.keyUp = level.keyUp;
}
function maze1DayWon(){
    setPSFunctions(maze1Night)
    maze1Night.init()
}




// The G event handlers take the same parameters as Perlenspiel's event handlers,
// so they can be assigned to those handlers directly.
// Note the LACK of parentheses after G.init and G.move!
// We want to assign the functions themselves, NOT the values returned by calling them!
PS.init = function (){
    var gotname = function ( id, name ) {
        PS.statusText( "Press space to drop stones" );

        // Game startup code goes here
    };

    // Establish database with login prompt
    PS.dbInit( "winRecordsV1", { login : gotname } );

    // PS.imageLoad( "map1.png", onLoad, 1);

    maze1Day.init();
}

// function onLoad(img){
//     PS.imageDump(img)
// }
setPSFunctions(maze1Day)


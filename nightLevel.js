
var nightLevel =(function (){
    var eatenCandy = []
    var onLevel
    var lost = false
    var MAZE_TIMER_START = 3000
    // var MAZE_TIMER_START = 2000
    var mazeTimer = MAZE_TIMER_START
    var maze
    var _actor_x; // initial x-pos of actor sprite
    var _actor_y; // initial y-pos of actor sprite
    var _exit_x; // x-pos of exit
    var _exit_y; // y-pos of exit
    var followerDelta; //x,y
    var DROP_COLOR
    var dropSprites = []
    var actorSprite
    var followerSprite
    var hasSeenBread = false
    var firstCandy
    function renderMap() {
        PS.spriteShow(actorSprite,true)
        PS.spriteShow(followerSprite,true)
        dropSprites.forEach((sprite)=>{
            PS.spriteShow(sprite, false)
        })
        let onDropSprite = 0;

        for(let i = 0; i < NIGHT_GRID_SIZE; i+=1){
            for(let j = 0; j < NIGHT_GRID_SIZE; j+=1) {
                var mapX = _actor_x-Math.floor(NIGHT_GRID_SIZE/2)+i
                var mapY = _actor_y-Math.floor(NIGHT_GRID_SIZE/2)+j
                if(mapX<0 || mapY<0 || mapX>maze.width || mapY>maze.height){
                    PS.color(i,j,OOB_COLOR)

                }else{
                    let val = maze.data[mapX+(mapY*maze.width)]

                    if ( val === WALL_ID ) {
                        PS.color( i, j, _COLOR_WALL );
                    }
                    else if ( val === FLOOR_ID ) {
                        PS.color( i, j, FLOOR_COLOR );
                    }
                    else if ( val === ENTRANCE_ID ) {//IF EXIT, HANDLE LIKE ENTRANCE

                        PS.color( i, j, ENTRANCE_COLOR );
                    }
                    else if ( val ===  EXIT_ID) {

                        _exit_x = i;
                        _exit_y = j;
                        //maze.data[ ( y * maze.height ) + x ] = FLOOR_ID; // change exit to floor
                        PS.color( i, j, _COLOR_EXIT );
                    } else if ( val ===  CANDY_ID) {
                        if(!eatenCandy[xyToIndex(mapX,mapY,maze.width)]) {
                            PS.color(i, j, CANDY_COLOR);

                        }else{
                            PS.color( i, j, FLOOR_COLOR );
                        }


                    } else if ( val ===  HUT_ID) {
                        PS.color( i, j, HUT_COLOR );
                    }
                    //Then, place rock sprite, make visible and give alpha
                    if(rockPos[mapX+(mapY*maze.width)]){

                        var drop = dropSprites[onDropSprite]
                        PS.spriteMove(drop,i,j)
                        PS.spriteShow(drop,true)
                        if(hasCrows){
                            PS.spriteSolidAlpha(drop,breadDecay)
                            if(!hasSeenBread){
                                hasSeenBread = true
                                PS.statusText("The breadcrumbs are being eaten!")
                            }
                        }else{
                            PS.spriteSolidAlpha(drop,255)

                        }
                        onDropSprite++
                    }

                }
            }
        }
        //coler ovverides
        // PS.color(Math.floor(NIGHT_GRID_SIZE/2),Math.floor(NIGHT_GRID_SIZE/2),_COLOR_ACTOR)
        //
        //     PS.color(Math.floor(NIGHT_GRID_SIZE/2)+followerDelta.x,Math.floor(NIGHT_GRID_SIZE/2)+followerDelta.y,FOLLOWER_COLOR)

        PS.spriteMove(actorSprite,Math.floor(NIGHT_GRID_SIZE/2),Math.floor(NIGHT_GRID_SIZE/2))
        PS.spriteMove(followerSprite,Math.floor(NIGHT_GRID_SIZE/2)+followerDelta.x,Math.floor(NIGHT_GRID_SIZE/2)+followerDelta.y)


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
        decayBread()
        mazeTimer -= TIMER_INTERVAL
        //determine move direction from key (move nowhere if 2 keys held)
        //TODO: handle when player holds multiples keys down
        let newPos = null
        let potentialFollowerDelta
        if(keyDown[D_KEY]){//d
            newPos =  {x: _actor_x+1, y: _actor_y };
            potentialFollowerDelta = {x:-1,y:0}
        }else if(keyDown[S_KEY]){//s
            newPos =  {x: _actor_x, y: _actor_y+1 };
            potentialFollowerDelta = {x:0,y:-1}
        }else if(keyDown[W_KEY]){
            newPos =  {x: _actor_x, y: _actor_y-1 };
            potentialFollowerDelta = {x:0,y:1}
        }else if(keyDown[A_KEY]){//s
            newPos =  {x: _actor_x-1, y: _actor_y };
            potentialFollowerDelta = {x:1,y:0}
        }

        if(newPos!=null && newPos.x >= 0 && newPos.y >=0 && newPos.x < maze.width && newPos.y< maze.height){
            //if !wall, move there
            if(maze.data[newPos.x+(newPos.y*maze.width)] != WALL_ID){
                _actor_x = newPos.x
                _actor_y = newPos.y

                followerDelta = potentialFollowerDelta
            }
        }
        //rendeView
        renderView()

        console.log(maze.data[xyToIndex(_actor_x,_actor_y,maze.width)])
        //if on exit, end game
        if(maze.data[xyToIndex(_actor_x,_actor_y,maze.width)]== EXIT_ID){
            onWin()
        }else if(maze.data[xyToIndex(_actor_x,_actor_y,maze.width)]== CANDY_ID && !eatenCandy[xyToIndex(_actor_x,_actor_y,maze.width)]){//eat candy
            eatCandy(_actor_x,_actor_y)
        }else if(mazeTimer<0){
            onLose()
        }
    }
    function decayBread() {
        breadDecay -= BREAD_DECAY_RATE
        if(breadDecay<0) breadDecay = 0;
    }

    function eatCandy(x,y) {
        if(firstCandy){
            PS.dbEvent( "hungerOnCandyV2","hunger%",mazeTimer/MAZE_TIMER_START);
            firstCandy = false
        }
        PS.statusText("mmmmmm, candy!")
        eatenCandy[xyToIndex(_actor_x,_actor_y,maze.width)] = true
        mazeTimer += CANDY_REFILL
        if(mazeTimer>MAZE_TIMER_START){
            mazeTimer = MAZE_TIMER_START
        }
        PS.audioPlay(EAT_CANDY_SOUND)

    }

    var textChangeTimer

    function changeLoseText() {
        PS.statusText("Touch to retry")
        PS.timerStop(textChangeTimer)
    }

    function onLose() {
        textChangeTimer = PS.timerStart(LOSE_TEXT_CHANGE_TIME,changeLoseText)
        PS.audioPlay(LOSE_SOUND)
        PS.timerStop(timerID)
        PS.statusText("You starved in the woods...")
        let x = Math.floor(NIGHT_GRID_SIZE/2)
        let y = Math.floor(NIGHT_GRID_SIZE/2)
        if(rockPos[x+(y*maze.width)]){
            PS.color(x,y,DROP_COLOR)
        }else{
            PS.color(x,y,FLOOR_COLOR)
        }

        let fx = Math.floor(NIGHT_GRID_SIZE/2)+followerDelta.x
        let fy = Math.floor(NIGHT_GRID_SIZE/2)+followerDelta.y
        if(rockPos[fx+(fy*maze.width)]){
            PS.color(fx,fy,DROP_COLOR)
        }else{
            PS.color(fx,fy,FLOOR_COLOR)
        }

        PS.spriteShow(followerSprite,false)
        PS.spriteShow(actorSprite,false)
        reportLoss(onLevel)
        //PS.dbSend( "winRecordsV1","aenemeth",{discard:true});
        lost = true
    }
    function onWin() {
        //PS.audioPlay(_SOUND_WIN)
        PS.timerStop(timerID)
        PS.statusText("You made it out!")
        calcTimeToWin(onLevel)
       loadLevel(onLevel+1)

    }

    function toHut() {
        PS.audioPlay(_SOUND_WIN)
        PS.timerStop(timerID)
    }

    function initMapAndPlayer(){
        timerID = PS.timerStart( TIMER_INTERVAL, tick );


        //rotate maze

        //switch exit and entrance
        let entrancePos = {}
        let exitPos = {}
        for (let y = 0; y < maze.height; y += 1 ) {
            for (let x = 0; x < maze.width; x += 1 ) {
                if(maze.data[ ( y * maze.width ) + x ] == 4){//exit
                    exitPos = {x:x,y:y}
                }
                if(maze.data[ ( y * maze.width ) + x ] == 3){//entrance
                    entrancePos = {x:x,y:y}
                }
            }
        }
        // maze.data[ ( entrancePos.y * maze.height ) + entrancePos.x ] = 4
        // maze.data[ ( exitPos.y * maze.height ) + exitPos.x ] = 3


        //place player at entrance
        _actor_x = entrancePos.x
        _actor_y = entrancePos.y
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

    function restartLevel() {
        loadLevel(onLevel-1)
    }

    function makeDropSprites() {
        // if(dropSprites.length==0){
        //     for(var i = 0; i < 9; i++){
        //         dropSprites.push(makeOneDropSprite())
        //     }
        // }
        dropSprites = []
        for(var i = 0; i < 9; i++){
            dropSprites.push(makeOneDropSprite())
        }

    }
    function makeOneDropSprite() {
        let rockSprite = PS.spriteSolid(1,1)
        console.log(DROP_COLOR,hasCrows)
        PS.spriteSolidColor(rockSprite,DROP_COLOR)
        PS.spritePlane(rockSprite, ROCK_PLANE)
        PS.spriteShow(rockSprite,false)

        return rockSprite
    }

    var hasCrows;
    var breadDecay = 255;
    return {
        // Initialize the game
        // Called once at startup

        init : function (withmaze, doesHaveCrows, thisLevelNum) {
            hasSeenBread = false
            eatenCandy = []
            firstCandy = true
            //if(!actorSprite){
            actorSprite =  PS.spriteSolid( 1, 1 );
            PS.spriteSolidColor( actorSprite, _COLOR_ACTOR );
            PS.spritePlane( actorSprite, _PLANE_ACTOR );
            //}
            //if(!followerSprite){
            followerSprite =  PS.spriteSolid( 1, 1 );
            PS.spriteSolidColor( followerSprite, FOLLOWER_COLOR );
            PS.spritePlane( followerSprite, FOLLOWER_PLANE );
            //}

            PS.spriteShow(followerSprite,true)
            PS.spriteShow(actorSprite,true)

            breadDecay = 255;
            hasCrows = doesHaveCrows
            console.log(hasCrows)

            if(hasCrows){
                DROP_COLOR = BREAD_COLOR
            }else{
                DROP_COLOR = ROCK_COLOR
            }

            makeDropSprites()

            onLevel = thisLevelNum
            followerDelta = {x:1,y:0}
            lost = false
            maze = withmaze
            mazeTimer = MAZE_TIMER_START
            PS.statusColor([255,255,255])

            PS.statusText("Find your way back out!")
            initMapAndPlayer()
        },

        keyDown : function (key, shift, ctrl, options ) {
            keyDown[key] = true
            // determinePath()

        },

        keyUp : function (key, shift, ctrl, options ){
            keyDown[key] = false
        },

        touch : function (x,y ){
            if(lost){
                restartLevel()
            }
        }



    };
} () ); // end of IIFE

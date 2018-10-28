//extension javascript
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
var visible={
    width:600,
    height:800
}
var _enemyAI=EnemyAI.getInstance();
var _BG;
var _BG2;
var _EG;
var _plane;
var _creatorLabel;
var keyDownState={
    "left":false,
    "up":false,
    "right":false,
    "down":false,
};
var planeState={
    hp:0,
    bullet:100,
    AnimationState:1,
    lastTimeStamp:0,
    const_moveSpeed:4,
    bulletInterval:200,
};
var bulletState={
    bullets:[],
    moveSpeed:4,
    lastTimeStamp:0,
    isLock:false,
    isShoot:false,
}

window.onload=()=>{
    document.onkeydown=function(e){ 
        keyDownState[const_keyMap[e.which]] = true;  
    };
    document.onkeyup=function(e){
        keyDownState[const_keyMap[e.which]] = false;
    };
    var KeyEventCallBack = function() {
        if(keyDownState["right"] && keyDownState["up"])
        {
            _plane.x+=planeState.const_moveSpeed/2;
            _plane.y-=planeState.const_moveSpeed/2;
        }
        else if(keyDownState["left"] && keyDownState["up"])
        {
            _plane.x-=planeState.const_moveSpeed/2;
            _plane.y-=planeState.const_moveSpeed/2;
        }
        else if(keyDownState["left"] && keyDownState["down"])
        {
            _plane.x-=planeState.const_moveSpeed/2;
            _plane.y+=planeState.const_moveSpeed/2;
        }
        else if(keyDownState["right"] && keyDownState["down"])
        {
            _plane.x+=planeState.const_moveSpeed/2;
            _plane.y+=planeState.const_moveSpeed/2;
        }
        else if(keyDownState['up'])
            _plane.y-=planeState.const_moveSpeed;
        else if (keyDownState['down'])
            _plane.y+=planeState.const_moveSpeed;
        else if (keyDownState['left'])
            _plane.x-=planeState.const_moveSpeed;
        else if (keyDownState['right'])
            _plane.x+=planeState.const_moveSpeed;
        if(keyDownState['space'])
        {
            shot();
        }

        setTimeout(KeyEventCallBack, const_KeyCheckRate);
    };
    KeyEventCallBack();

    _EG=new Director(60,visible.width,visible.height,'canvasID',updateFunction,window);
    _BG=new Sprite("image/BG.png",0,visible.height,600,1638,_EG.Canvas);
    _BG2=new Sprite("image/BG.png",0,visible.height-1638,600,1638,_EG.Canvas);
    _plane=new Sprite("image/plane1.png",300,750,256,256,_EG.Canvas);
    _enemyAI.addEnemy(new Sprite("image/Enemy1.png",300,500,256,256,_EG.Canvas));
    _plane.setScale(0.7);
    _plane.setAnchorPoint(0.5,0.5);
    _BG.setAnchorPoint(0,1);
    _BG2.setAnchorPoint(0,1);
    _creatorLabel=new Label("Created By Majitoo",200,50,"Arial",24,"White",_EG.Canvas);

    // _EG.addIntervalEvent("MapScroll",0.016,()=>
    // {
    //     _BG.y+=6;
    // });
}

var updateFunction=function(timestamp)
{
    if(document.getElementById('canvasID')!=null)
    {
        //add image to memory
        let t=new Image();
        let t2=new Image();
        let t3=new Image();
        t.crossOrigin = '';
        t2.crossOrigin = '';
        t3.crossOrigin = '';
        t.src = 'image/plane1.png';
        t2.src = 'image/plane2.png';
        t3.src = 'image/plane3.png';
        
       
        // new Image().src = 'image/Enemy1.png';
        // new Image().src = 'image/Enemy2.png';
        // new Image().src = 'image/Enemy3.png';

        //do SomeThing logic
        doMapScroll();
        doPlaneAnimation(timestamp);
        processBullet();
        processLockBullet(timestamp);
        _enemyAI.updateFunction(timestamp);

        testCollision(_plane,_enemyAI.getEnemy(0).sprite);

        //addSpriteToScene
        _EG.addChild(_BG,0);
        _EG.addChild(_BG2,0);
        _EG.addChild(_plane,1);
        _EG.addChild(_creatorLabel,2);
        _enemyAI.addAllEnemyToScene(_EG);
        for(let i=0;i<bulletState.bullets.length;i++)
            _EG.addChild(bulletState.bullets[i],3);
    }
};

var detectIntersection=function(sprite1,sprite2)
{
    if((Math.abs(sprite2.x - sprite1.x) < sprite1.width / 2 + sprite2.width / 2) &&
        Math.abs(sprite2.y - sprite1.y) < sprite1.height / 2 + sprite2.height / 2)
      return true
    else
      return false
}

CollisionJudge=function(sprite1,sprite2)
{
    let rect1Right = sprite1.x + sprite1.width,
    rect1Bottom = sprite1.y + sprite1.height,
    rect2Right = sprite2.x + sprite2.width,
    rect2Bottom = sprite2.y + sprite2.height;

    let rect3Left = Math.max(sprite1.x, sprite2.x),
    rect3Top = Math.max(sprite1.y, sprite2.y),
    rect3Right = Math.min(rect1Right, rect2Right),
    rect3Bottom = Math.min(rect1Bottom, rect2Bottom);

    let rect={
        left: rect3Left,
        top: rect3Top,
        width: rect3Right - rect3Left,
        height: rect3Bottom - rect3Top
    }
    let imgData1 = _EG.Canvas.getImageData(rect.left, rect.top, rect.width, rect.height),
        imgData2 = _EG.Canvas.getImageData(rect.left, rect.top, rect.width, rect.height);
    let imgData1Data = imgData1.data;
    let imgData2Data = imgData2.data;

    for(var i = 3, len = imgData1Data.length; i < len; i += 4) {
        if(imgData1Data[i] > 0 && imgData2Data[i] > 0)
            return true;
    }
    return false;
}

var testCollision=function(plane,enemy)
{
    // console.log(plane,enemy);
    if(detectIntersection(plane, enemy)) {
        // var intersectionRect = getIntersectionRect(panda, bamboo)
        // isCollisions = handleEgdeCollisions(intersectionRect)
        let isCollision=CollisionJudge(plane, enemy);
        if(isCollision)
            console.log("detect");
    }
    else
        console.log("not detect");
}

var doMapScroll=function(){
    _BG.y+=_MapSpeed;
    _BG2.y+=_MapSpeed;
    if(_BG.y>=_BG.height+visible.height ||_BG2.y>=_BG.height+visible.height)
    {
        if(_BG.y>_BG2.y)
            _BG.y-=_BG.height+visible.height;
        else
            _BG2.y-=_BG.height+visible.height;
    }
}

var doPlaneAnimation=function(timestamp){
    // if(timestamp-planeState.lastTimeStamp >50)
    // {
    //     planeState.AnimationState++;
    //     if(planeState.AnimationState==4)
    //         planeState.AnimationState=1;
    //     _plane.setImage(`image/plane${planeState.AnimationState}.png`);
    //     planeState.lastTimeStamp=timestamp;
    // }
}

var shot=function(){
    if(bulletState.isLock)
        return;
    let bullet=new Sprite("image/bullet.png",_plane.x-5,_plane.y-70,10,11,_EG.Canvas)
    bulletState.bullets.push(bullet);
    bulletState.isShoot=true;
    bulletState.isLock=true;
}

var processBullet=function(){
    for(let i=0;i<bulletState.bullets.length;i++)
    {
        bulletState.bullets[i].y-=bulletState.moveSpeed;
        if(bulletState.bullets[i].y<-10)
            bulletState.bullets.remove(bulletState.bullets[i])
    }
}

var processLockBullet=function(timestamp){
    if(bulletState.isShoot)
    {
        bulletState.lastTimeStamp=timestamp;
        bulletState.isShoot=false;
    }
    
    if(timestamp-bulletState.lastTimeStamp>planeState.bulletInterval)
        bulletState.isLock=false;
    
}
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
var _enemyAI;
var _BG;
var _BG2;
var _EG;
var _plane;
var _creatorLabel;
var _pauseBtn;
var keyDownState={
    "left":false,
    "up":false,
    "right":false,
    "down":false,
};
var planeState={
    hp:0,
    bullet:100,
    const_moveSpeed:4,
    bulletInterval:200,
};
var bulletState={
    bullets:[],
    moveSpeed:8,
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
    _enemyAI=EnemyAI.getInstance(_EG);
    _BG=new Sprite("image/BG.png",0,visible.height,600,1638);
    _BG2=new Sprite("image/BG.png",0,visible.height-1638,600,1638);
    _pauseBtn=new Sprite("image/pause.png",0,0,100,100);
    _pauseBtn.setAnchorPoint(0.5,0.5);
    _pauseBtn.setScale(0.5);
    _pauseBtn.setPosition(
        visible.width-_pauseBtn.width/2,
        _pauseBtn.height/2);
    _pauseBtn.on("pointerdown",()=>{
        console.log("設定按鈕被點擊");
    });
    _BG.setAnchorPoint(0,1);
    _BG2.setAnchorPoint(0,1);
    _plane=new Sprite("image/plane1.png",300,750,243,158);
    _plane.setAnimation("image/plane",".png",50,1,3);
    _plane.play();
    _plane.setScale(0.7);
    _plane.setAnchorPoint(0.5,0.5);
    _creatorLabel=new Label("Created By Majitoo",200,50,"Arial",24,"White");
}

var updateFunction=function(timestamp)
{
    if(document.getElementById('canvasID')!=null)
    {
        //do SomeThing logic
        doMapScroll();
        processBullet();
        processLockBullet(timestamp);
        _enemyAI.updateFunction(timestamp);
        BulletCollisionUpdate(bulletState.bullets,_enemyAI.getAllEnemy());
        if(_enemyAI.getAllEnemy().length<=1)
            _enemyAI.addEnemy(new Sprite("image/Enemy1.png",Math.floor(Math.random()*500+50),-50,173,150));
        //addSpriteToScene
        _EG.addChild(_BG,0);
        _EG.addChild(_BG2,0);
        _EG.addChild(_plane,1);
        _EG.addChild(_creatorLabel,2);
        _EG.addChild(_pauseBtn,5);
        _enemyAI.addAllElementToScene();
        for(let i=0;i<bulletState.bullets.length;i++)
            _EG.addChild(bulletState.bullets[i],3);
    }
};

// var newImageToMemory=function()
// {
//     //add image to memory
//     new Image().src='image/plane1.png';
//     new Image().src='image/plane2.png';
//     new Image().src='image/plane3.png';
//     new Image().src = 'image/Enemy1.png';
//     new Image().src = 'image/Enemy2.png';
//     new Image().src = 'image/Enemy3.png';
//     new Image().src = 'image/explosion001.png';
//     new Image().src = 'image/explosion002.png';
//     new Image().src = 'image/explosion003.png';
//     new Image().src = 'image/explosion004.png';
//     new Image().src = 'image/explosion005.png';
//     new Image().src = 'image/explosion006.png';
//     new Image().src = 'image/explosion007.png';
//     new Image().src = 'image/explosion008.png';
//     new Image().src = 'image/explosion009.png';
//     new Image().src = 'image/explosion010.png';
//     new Image().src = 'image/explosion011.png';
//     new Image().src = 'image/explosion012.png';
//     new Image().src = 'image/explosion013.png';
//     new Image().src = 'image/explosion014.png';
//     new Image().src = 'image/explosion015.png';
// }

var BulletCollisionUpdate=function(bullets,enemys)
{
    for(let i=0;i<bullets.length;i++)
    {
        for(let j=0;j<enemys.length;j++)
        {
            if(_EG.isCollision(bullets[i], enemys[j].sprite))
            {//hit
                enemys[j].state.hp-=20;
                bulletState.bullets.remove(bullets[i])
            }
        }
    }
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

var shot=function(){
    if(bulletState.isLock)
        return;
    let bullet=new Sprite("image/bullet.png",_plane.x-5,_plane.y-70,10,11)
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
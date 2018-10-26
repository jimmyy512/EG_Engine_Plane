var visible={
    width:600,
    height:800
}
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
};

const const_MapSpeed=3;
const const_KeyCheckRate = 15;
const const_keyMap = {
    37:"left",
    65:"left",
    87:"up",
    38:"up",
    68:"right",
    39:"right",
    83:"down",
    40:"down",
};
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

        setTimeout(KeyEventCallBack, const_KeyCheckRate);
    };
    KeyEventCallBack();

    _EG=new Director(60,visible.width,visible.height,'canvasID',updateFunction,window);
    _BG=new Sprite("image/BG2.png",0,visible.height,600,1638,_EG.Canvas);
    _BG2=new Sprite("image/BG2.png",0,visible.height-1638,600,1638,_EG.Canvas);
    _plane=new Sprite("image/plane1.png",300,750,256,256,_EG.Canvas);
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
        new Image().src = 'image/plane1.png';
        new Image().src = 'image/plane2.png';
        new Image().src = 'image/plane3.png';

        doMapScroll();
        doPlaneAnimation(timestamp);

        _EG.addChild(_BG,0);
        _EG.addChild(_BG2,0);
        _EG.addChild(_plane,1);
        _EG.addChild(_creatorLabel,2);
    }
};

var doMapScroll=function(){
    _BG.y+=const_MapSpeed;
    _BG2.y+=const_MapSpeed;
    if(_BG.y>=_BG.height+visible.height ||_BG2.y>=_BG.height+visible.height)
    {
        if(_BG.y>_BG2.y)
            _BG.y-=1638+visible.height;
        else
            _BG2.y-=1638+visible.height;
    }
}
var doPlaneAnimation=function(timestamp){
    if(timestamp-planeState.lastTimeStamp >50)
    {
        planeState.AnimationState++;
        if(planeState.AnimationState==4)
            planeState.AnimationState=1;
        _plane.setImage(`image/plane${planeState.AnimationState}.png`);
        planeState.lastTimeStamp=timestamp;
    }
}


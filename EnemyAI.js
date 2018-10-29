var EnemyAI=(function(){
    var instance;
    var _EG;
    function init(){
        //private
        //*飛機狀態
        function PlaneState()
        {
            this.lastStamp=0;
            this.AnimationState=1;
            this.hp=100;
            return this;
        }
        function ExplosionState()
        {
            this.lastStamp=0;
            this.AnimationState=1;
            return this;
        }
        var _enemys=[];
        var _explosion=[];
        var generateExplosion=function(x,y)
        {
            let explos=new Sprite("image/explosion001.png",x,y,160,160,_EG.Canvas);
            explos.setScale(0.7);
            explos.setAnchorPoint(0.5,0.5);
            let obj={
                "sprite":explos,
                "state":new ExplosionState(),
            }
            _explosion.push(obj);
        }
        return{
            //public
            getEnemy:function(index)
            {
                let res=null;
                for(let i=0;i<_enemys.length;i++)
                {
                    if(i==index)
                        res=_enemys[i];
                }
                return res;
            },
            getAllEnemy:function()
            {
                return _enemys;
            },
            addAllElementToScene:function()
            {
                for(let i=0;i<_enemys.length;i++)
                    _EG.addChild(_enemys[i].sprite,5);
                for(let i=0;i<_explosion.length;i++)
                    _EG.addChild(_explosion[i].sprite,5);
            },
            addEnemy:function(enemySprite){
                enemySprite.setScale(0.7);
                enemySprite.setRotation(180);
                enemySprite.setAnchorPoint(0.5,0.5);
                let obj={
                    "sprite":enemySprite,
                    "state":new PlaneState(),
                }
                _enemys.push(obj);
            },
            updateFunction(timeStamp=0)
            {
                for(let i=0;i<_enemys.length;i++)
                {
                    if(_enemys[i].state.hp<=0)
                    {
                        generateExplosion(_enemys[i].sprite.x,_enemys[i].sprite.y);
                        _enemys.remove(_enemys[i]);
                        continue;
                    }

                    _enemys[i].sprite.y+=4;
                    if(_enemys[i].sprite.y>900)
                    {
                        _enemys.remove(_enemys[i]);
                        continue;
                    }

                    if(parseInt(timeStamp-_enemys[i].state.lastStamp)>ENEMY_PLANE_ANIMATION_INTERVAL)
                    {
                        _enemys[i].state.AnimationState++;
                        if(_enemys[i].state.AnimationState==4)
                            _enemys[i].state.AnimationState=1;
                        _enemys[i].sprite.setImage(`image/Enemy${ _enemys[i].state.AnimationState}.png`);
                        _enemys[i].state.lastStamp=timeStamp;
                    }
                }
                for(let i=0;i<_explosion.length;i++)
                {
                    if(parseInt(timeStamp-_explosion[i].state.lastStamp)>EXPLOSION_ANIMATION_INTERVAL)
                    {
                        _explosion[i].state.AnimationState++;
                        if(_explosion[i].state.AnimationState==16)
                        {
                            _explosion.remove(_explosion[i]);
                            continue;
                        }
                        if( _explosion[i].state.AnimationState<10)
                            _explosion[i].sprite.setImage(`image/explosion00${ _explosion[i].state.AnimationState}.png`);
                        else
                        _explosion[i].sprite.setImage(`image/explosion0${ _explosion[i].state.AnimationState}.png`);
                        _explosion[i].state.lastStamp=timeStamp;
                    }
                }
            },
        }
    }
    return {
        getInstance:function(EG_Instance){
            if(!instance)
            {
                instance=init();
                _EG=EG_Instance;
            }
            return instance;
        }
    }
})();
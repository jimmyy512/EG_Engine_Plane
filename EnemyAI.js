var EnemyAI=(function(){
    var instance;
    function init(){
        //private
        //*飛機狀態
        function PlaneState()
        {
            this.lastStamp=0;
            this.AnimationState=1;
            return this;
        }
        var _enemys=[];
        function private(){

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
            addAllEnemyToScene:function(EngineInstance)
            {
                for(let i=0;i<_enemys.length;i++)
                {
                    EngineInstance.addChild(_enemys[i].sprite,5);
                }
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
                // for(let i=0;i<_enemys.length;i++)
                // {
                //     if(parseInt(timeStamp-_enemys[i].state.lastStamp)>ENEMY_PLANE_ANIMATION_INTERVAL)
                //     {
                //         _enemys[i].state.AnimationState++;
                //         if(_enemys[i].state.AnimationState==4)
                //             _enemys[i].state.AnimationState=1;
                //         _enemys[i].sprite.setImage(`image/Enemy${ _enemys[i].state.AnimationState}.png`);
                //         _enemys[i].state.lastStamp=timeStamp;

                //     }
                // }
            },
        }
    }
    return {
        getInstance:function(){
            if(!instance)
                instance=init();
            return instance;
        }
    }
})();
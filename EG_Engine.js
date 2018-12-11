//EG Engine簡單遊戲引擎,基於Html5 Canvas
//代碼中變數或是函數function前面有加上'_'底線，代表為私有變量，私有函數
//或無底線為公開函數,使用者可以任意調用
//By Majitoo

var throwException =function(content)
{ 
    throw "[MyEngine warn]: " + content;
}

//Director 導演類別:引擎主要核心
/**
 * @param  {Number} maxFPS  
 * 最大FPS限制
 * @param  {Number} CanvasWidth 
 * Canvas寬度
 * @param  {Number} CanvasHeight
 * Canvas高度
 * @param  {Ｓtring} CanvasID
 * Canvas ID tag名稱
 * @param  {Function} UpdateCallFunc
 * 刷新回調函數
 * 渲染一個Frame前,固定調用的Function
 * @param {window} window
 * 傳入window實例
 */
var Director = function (maxFPS,CanvasWidth, CanvasHeight, CanvasID,UpdateCallFunc,window) {
    this.visible = {
        width: CanvasWidth,
        height: CanvasHeight
    }
    //private
    this._then = Date.now();
    this._now = 0;
    this._elapsed = 0;
    this._maxFPS = maxFPS;
    this._fpsInterval = 1000 / this._maxFPS;
    this._Scheduler = new Scheduler();
    this._children = [];
    this._UpdateCallFunc = UpdateCallFunc;
    this._TimeStamp = 0;
    this._CacheCanvasElement=window.document.createElement('canvas');
    this._CacheCanvasElement.width=CanvasWidth;
    this._CacheCanvasElement.height=CanvasHeight;
    this._CacheCanvas=this._CacheCanvasElement.getContext('2d');
    this._CacheCanvas.globalCompositeOperation = "source-over";
    var _this = this;
    this._Update = (timestamp)=> {
        _this.window.requestAnimationFrame(_this._Update);
        _this._now = Date.now();
        _this._elapsed = _this._now - _this._then;
        if (_this._elapsed > _this._fpsInterval) {
            this._TimeStamp = timestamp;
            _this._then = _this._now - (_this._elapsed % _this._fpsInterval);
            //draw stuff
            _this._UpdateCallFunc(timestamp);
            _this._Scheduler._ListenCallBacks(timestamp);
            _this._DrawALL(timestamp);
            _this.CacheCanvasToScene();
        }
    }
    this._Canvas = document.getElementById(CanvasID).getContext('2d');
    this._Canvas.globalCompositeOperation = "source-over";
    this.window=window;
    this.window.requestAnimationFrame(this._Update);
}

//必須在Director刷新回調函數UpdateCallFunc中,把元素加到場景上,
//Canvas就會渲染那個元素
/**
 * @param  {Ｓprtie,Label....} child  
 * EG Engine元素類別 像是Sprite圖片精靈 Label標籤 都是場景元素
 * @param  {Number} index 
 * z-order 數字越高圖層在越上面
 */
Director.prototype.addChild = function (child, index) {
    if (this._children[index] == undefined)
        this._children[index] = [child];
    else
        this._children[index].unshift(child);
}

Director.prototype.CacheCanvasToScene=function(){
    this._Canvas.clearRect(0, 0, this.visible.width, this.visible.height);
    this._Canvas.drawImage(this._CacheCanvasElement,0,0,this.visible.width, this.visible.height);
}

Director.prototype.isCollision=function (el1,el2)
{
    if((Math.abs(el2.x - el1.x) < el1.width / 2 + el2.width / 2) &&
    Math.abs(el2.y - el1.y) < el1.height / 2 + el2.height / 2)
        return true;
    else
        return false;
}

Director.prototype.getScheduler=function()
{
    return this._Scheduler;
}
Director.prototype.addEvent=function(key,sec,CallBackFunc)
{
    this._Scheduler._addCallBack(this._TimeStamp, key, sec, CallBackFunc, false)
}
Director.prototype.addIntervalEvent = function (key, sec, CallBackFunc)
{
    this._Scheduler._addIntervalCallBack(this._TimeStamp, key, sec, CallBackFunc);
}
Director.prototype._addAnimationEvent = function (key, sec, CallBackFunc) {
    this._Scheduler._addCallBack(this._TimeStamp, key, sec, CallBackFunc, true)
}
Director.prototype.removeEventFromKey=function(key)
{
    if(!this._Scheduler._removeCallBackFromKey(key))
        throwException("Director removeEventFromKey remove Event Fail!");
}
Director.prototype._DrawALL = function (timestamp) {
    this._CacheCanvas.clearRect(0, 0, this.visible.width, this.visible.height);
    for (let i = 0; i < Object.keys(this._children).length; i++) {
        let index = Object.keys(this._children)[i];
        for (let j = 0; j < this._children[index].length; j++) {
            let child = this._children[index][j];
            if (child._Name== "Sprite") {
                child._ProcessPositionToDrawPosition();
                if(child._AS.animations.length!=0)
                    child._processSpriteAnimation(timestamp);
                if (child._degress == 0)
                    child.DrawOnCanvas(this._CacheCanvas);
                else
                    child.DrawOnCanvasWithRotation(this._CacheCanvas);
            }
            else if (child._Name == "Label") {
                child.Draw(this._CacheCanvas);
            }
        }
    }
    this._children.length = 0;
}

//Sprite圖片精靈
//EG_Engine元素之一,能透過Director.addChild加入元素到場景上
/**
 * @param {String} ImagePath 
 * 圖片路徑
 * @param {Number} x 
 * 元素x點座標
 * @param {Number} y 
 * 元素y點座標
 * @param {Number} width
 * 圖片原始寬度
 * @param {Number} height 
 * 圖片原始高度
 */
var Sprite = function (ImagePath, x, y, width, height) {
    //private
    this._Name="Sprite";
    this._originX = x;
    this._originY = y;
    this._drawX=x;
    this._drawY=y;
    this._originWidth = width;
    this._originHeight = height;
    this._OriginImagePath = ImagePath;
    this._Image = new Image();
    this._Image.src = ImagePath;
    this._degress = 0;
    this._scale=1;
    this._AS={
        animations:[],
        animationState:0,
        isPlay:false,
        lastTimeStamp:0,
        interval:50,
    }
    //public
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.anchor = {
        point1: 0,
        point2: 0
    };
}

/**
 * @param {String}  AS_path
 * 圖片名稱路徑
 * @param {String}  AS_fileExt
 * 圖片副檔名
 * @param {Number}  AS_Interval
 * 動畫間距毫秒
 * @param {Number}  AS_StartIndex
 * 起始圖片數字
 * @param {Number}  AS_EndIndex
 * 結束圖片數字 
 */
Sprite.prototype.setAnimation = function (AS_path,AS_fileExt,AS_Interval,AS_StartIndex,AS_EndIndex) {
    this._AS.animations.length=0;
    this._AS.animationState=0;
    this._AS.interval=AS_Interval;
    for(let i=AS_StartIndex;i<=AS_EndIndex;i++)
    {
        let imgPath=AS_path+i+AS_fileExt;
        let newImg=new Image();
        newImg.src=imgPath;
        this._AS.animations.push(newImg);
    }
}

Sprite.prototype.play=function(){
    this._AS.isPlay=true;
}

Sprite.prototype.stop=function(){
    this._AS.isPlay=false;
}

//設置圖片精靈茅點 也可以說圖片中心點
//目前支援參數有
// (0,0);
// (0,0.5);
// (0.5,0);
// (0.5,0.5);
// (0,1);
// (1,0);
// (1,1);
//已x為例子
//0 最左邊 0.5中間 1為最右邊
//已y為例子
//0 最上邊 0.5中間 1為最下邊
/**
 * @param {Number} point1 
 * 元素x點座標
 * @param {Number} point2 
 * 元素y點座標
 */
Sprite.prototype.setAnchorPoint = function (point1, point2) {
    this.anchor.point1 = point1;
    this.anchor.point2 = point2;
}
Sprite.prototype.setImage=function(newImagePath)
{
    this._Image.src = newImagePath;
}
//*將精靈圖片設置為初始化時的圖片
Sprite.prototype.ResetImage=function()
{
    this._Image.src=this._OriginImagePath;
}
Sprite.prototype.setScale = function (scale) {
    this._scale=scale;
}
Sprite.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
}
Sprite.prototype.getPosition=function()
{
    return {
        x:this.x,
        y:this.y
    }
}
Sprite.prototype.setRotation = function (degress) {
    this._degress = degress;
}
Sprite.prototype.getOriginPosition=function()
{
    return [this._originX,this._originY];
}
Sprite.prototype.getOriginX = function()
{
    return this._originX;
}
Sprite.prototype.getOriginY = function()
{
    return this._originY;
}
Sprite.prototype.getOriginSize = function () {
    return [this._originWidth, this._originHeight];
}
Sprite.prototype.getOriginWidth = function () {
    return this._originWidth;
}
Sprite.prototype.getOriginHeight = function () {
    return this._originHeight;
}
Sprite.prototype.DrawOnCanvasWithRotation = function (canvas) {
    if(!this._AS.isPlay)
    {
        canvas.save();
        canvas.translate(this._drawX + this.width / 2, this._drawY + this.height / 2);
        canvas.rotate(this._degress * Math.PI / 180);
        canvas.drawImage(this._Image, -this.width / 2, -this.height / 2,
            this.width,this.height);
        canvas.restore();
    }
    else
    {
        canvas.save();
        canvas.translate(this._drawX + this.width / 2, this._drawY + this.height / 2);
        canvas.rotate(this._degress * Math.PI / 180);
        canvas.drawImage(this._AS.animations[this._AS.animationState], -this.width / 2, -this.height / 2,
            this.width,this.height);
        canvas.restore();
    }
}
Sprite.prototype.DrawOnCanvas = function (canvas) {
    if(!this._AS.isPlay)
    {
        canvas.drawImage(
            this._Image,
            this._drawX,
            this._drawY,
            this.width,
            this.height
        );
    }
    else
    {
        canvas.drawImage(
            this._AS.animations[this._AS.animationState],
            this._drawX,
            this._drawY,
            this.width,
            this.height
        );
    }
}
//*準備廢棄
Sprite.prototype.runAction=function(key,actions,Director)
{
    let sumInterval=0;
    for(let i=0;i<actions.length;i++)
    {
        let tmp=actions[i];
        sumInterval += tmp["interval"];
        Director._addAnimationEvent(`#${key}${i}`, sumInterval ,
        ()=>{
            this._Image.src=tmp["path"];
        },true);
    }
}

Sprite.prototype._processSpriteAnimation=function(timestamp){
    if(timestamp-parseInt(this._AS.lastTimeStamp)>this._AS.interval)
    {
        this._AS.lastTimeStamp=timestamp;
        this._AS.animationState++;
        if(this._AS.animationState>=this._AS.animations.length)
            this._AS.animationState=0;
    }
}

Sprite.prototype._ProcessPositionToDrawPosition=function()
{
    //anchor point
    if(this.anchor.point1==0)
        this._drawX=this.x;
    else if(this.anchor.point1==0.5)
        this._drawX=this.x-this._originWidth/2;
    else //anchor.point == 1
        this._drawX = this.x - this._originWidth;

    if (this.anchor.point2 == 0)
        this._drawY = this.y;
    else if (this.anchor.point2 == 0.5)
        this._drawY = this.y - this._originHeight / 2;
    else //anchor.point == 1
        this._drawY = this.y - this._originHeight;

    //scale
    if(this._scale!=1)
    {
        let posOffset = (1 - this._scale)/2;
        if (this.anchor.point1 == 0.5)
            this._drawX+= this._originWidth * posOffset;
        if (this.anchor.point1 == 1)
            this._drawX += this._originWidth;
        if (this.anchor.point2 == 0.5)
            this._drawY += this._originHeight * posOffset;
        if (this.anchor.point2 == 1)
            this._drawY += this._originHeight;
        this.width = this._originWidth * this._scale;
        this.height = this._originHeight * this._scale;
    }
}

//Label
var Label = function (LabelString, x, y, FontName, FontSize, color) {
    this._Name="Label";
    this.LabelString = LabelString;
    this.FontSize = FontSize;
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.FontName = FontName;
    this.Color=color;
}
Label.prototype.Draw = function(canvas)
{
    canvas.font=this.FontSize+"px "+this.FontName;
    canvas.fillStyle=this.Color;
    canvas.fillText(this.LabelString,this.x,this.y);
}

//Scheduler
var Scheduler = function () {
    this.callbacks = [];
    this.EventObject = function (timestamp,key,sec,callBackFunc,isLoop)
    {
        this.timestamp = timestamp;
        this.key = key;
        this.sec = sec;
        this.callBackFunc = callBackFunc;
        this.isLoop = isLoop;
    }
}
Scheduler.prototype._addCallBack = function (timestamp, key, sec, callBackFunc,isAnimation) {
    if(!isAnimation)
        this._isKeyVaild(key);
    this._IsKeyRepeat(key);    
    let event = new this.EventObject(timestamp,key,sec,callBackFunc,false);
    this.callbacks.push(event);
}
Scheduler.prototype._addIntervalCallBack = function (timestamp, key, sec, callBackFunc)
{
    this._isKeyVaild(key);
    this._IsKeyRepeat(key);    
    let event = new this.EventObject(timestamp, key, sec, callBackFunc, true);
    this.callbacks.push(event);
}
Scheduler.prototype._isKeyVaild = function(keyName)
{
    if(keyName.indexOf("#")!=-1)
        throwException(`Scheduler key: ${keyName} is not Vaild, "#" is KeyWord!`);
}
Scheduler.prototype._IsKeyRepeat = function (keyName) {
    let isKeyRepeat=false;
    for (let i = 0; i < this.callbacks.length; i++) {
        if (this.callbacks[i].key==keyName)
            isKeyRepeat=true;
    }
    if (isKeyRepeat)
        throwException(`Scheduler _IsKeyRepeat error,event key: "${keyName}" is repeat`);
}
Scheduler.prototype._ListenCallBacks = function (timestamp) {
    for (let i = 0; i < this.callbacks.length; i++) {
        let paraTime = parseInt(timestamp / 100) / 10;
        let eventTime = parseInt(this.callbacks[i].timestamp / 100) / 10;
        if ((eventTime + this.callbacks[i].sec) < paraTime) {
            if(this.callbacks[i].isLoop==false)
            {//remove callback
                let removeElement = this.callbacks.splice(i, 1);
                removeElement[0].callBackFunc();
                i--;
            }
            else
            {//interval callback add time
                this.callbacks[i].callBackFunc();
                this.callbacks[i].timestamp=timestamp+(this.callbacks[i].sec*100);
            }
        }
    }
}
Scheduler.prototype._removeCallBackFromKey=function(keyName)
{
    let isRemove=false;
    for (let i = 0; i < this.callbacks.length; i++) {
        if (this.callbacks[i].key == keyName)
        {
            isRemove=true;
            let removeElement = this.callbacks.splice(i, 1);
        }
    }
    return isRemove===true?true:false;
}
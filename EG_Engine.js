var throwException =function(content)
{ 
    throw "[MyEngine warn]: " + content;
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
    // console.log(timestamp);
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

//Director
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
    this._Update = function (timestamp) {
        _this.window.requestAnimationFrame(_this._Update);
        _this._now = Date.now();
        _this._elapsed = _this._now - _this._then;
        if (_this._elapsed > _this._fpsInterval) {
            _this._then = _this._now - (_this._elapsed % _this._fpsInterval);
            //draw stuff
            _this._preRenderInit(timestamp);
            _this._UpdateCallFunc(timestamp);
            _this._DrawALL();
            _this._Scheduler._ListenCallBacks(_this._TimeStamp);
        }
    }
    var _this = this;
    //public
    this.Canvas = document.getElementById(CanvasID).getContext('2d');
    this.Canvas.globalCompositeOperation = "source-over";
    this.window=window;
    this.window.requestAnimationFrame(this._Update);
}
Director.prototype.addChild = function (child, index) {
    if (this._children[index] == undefined)
        this._children[index] = [child];
    else
        this._children[index].unshift(child);
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
Director.prototype._preRenderInit = function (TimeStamp) {
    this._TimeStamp = TimeStamp;
    this.Canvas.clearRect(0, 0, this.visible.width, this.visible.height);
}
Director.prototype._DrawALL = function () {
    for (let i = 0; i < Object.keys(this._children).length; i++) {
        let index = Object.keys(this._children)[i];
        for (let j = 0; j < this._children[index].length; j++) {
            let child = this._children[index][j];
            if (child._Name== "Sprite") {
                child._ProcessPositionToDrawPosition();
                if (child._degress == 0)
                    child.DrawOnCanvas();
                else
                    child.DrawOnCanvasWithRotation();
            }
            else if (child._Name == "Label") {
                child.Draw();
            }
        }
    }
    this._children.length = 0;
}

//Sprite
var Sprite = function (ImagePath, x, y, width, height, canvas) {
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
    //public
    this.Canvas = canvas;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.anchor = {
        point1: 0,
        point2: 0
    };
}
Sprite.prototype.setAnchorPoint = function (point1, point2) {
    this.anchor.point1 = point1;
    this.anchor.point2 = point2;
}
Sprite.prototype.setImage=function(newImagePath)
{
    this._Image.src = newImagePath;
}
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
Sprite.prototype.DrawOnCanvasWithRotation = function () {
    this.Canvas.save();
    this.Canvas.translate(this._drawX + this.width / 2, this._drawY + this.height / 2);
    this.Canvas.rotate(this._degress * Math.PI / 180);
    this.Canvas.drawImage(this._Image, -this.width / 2, -this.height / 2,
        this.width,this.height);
    this.Canvas.restore();
}
Sprite.prototype.DrawOnCanvas = function () {
    this.Canvas.drawImage(
        this._Image,
        this._drawX,
        this._drawY,
        this.width,
        this.height
    );
}
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
var Label = function (LabelString, x, y, FontName, FontSize, color, canvas) {
    this._Name="Label";
    this.Canvas = canvas;
    this.LabelString = LabelString;
    this.FontSize = FontSize;
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.FontName = FontName;
    this.Color=color;
}
Label.prototype.Draw = function()
{
    this.Canvas.font=this.FontSize+"px "+this.FontName;
    this.Canvas.fillStyle=this.Color;
    this.Canvas.fillText(this.LabelString,this.x,this.y);
}
"use strict";
var ctx = {}, dblTime = 300 , longPressTime = 500, buttonBounceTime = 150, scrollFuncEvent,allText = [],scaleData = [],textIpt,aaa;
/*得到实际的scale*/
function getSpriteActData(sprite){
    GLOBAL.stage.updateTransform();
    var actX,actY,actWidth,actHeight;
    if(sprite.worldTransform.b == 0){
        actWidth = sprite.worldTransform.a;
    }else{
        actWidth = sprite.worldTransform.b;
    }
    if(sprite.worldTransform.c == 0){
        actHeight = sprite.worldTransform.d;
    }else{
        actHeight = -sprite.worldTransform.c;
    }
    actX = sprite.worldTransform.tx;
    actY = sprite.worldTransform.ty;
    return [actX,actY,actWidth,actHeight];
}
/*添加scaleData的数据*/
function pushScaleData(element,pos){
    if(!pos){
        pos = {width:1,height:1}
    }
    scaleData.push({element:element,pos:pos});
}
/*刷新scale的数据，控制缩放的比例*/
function fixedScale(){
    ctx.stage.updateTransform();
    for(var i=0,len=scaleData.length;i<len;i++){
        if(scaleData[i].element instanceof PIXI.Sprite){
            setWorldTransform(scaleData[i].element,scaleData[i].pos);
        }else{
            setTransform(scaleData[i].element,scaleData[i].pos);
        }
    }
    function setTransform(element,data){
        if(data.x){
            element.transform.worldTransform.tx = data.x;
        }
        if(data.y){
            element.transform.worldTransform.ty = data.y;
        }
        if(data.width){
            element.transform.worldTransform.a = data.width;
        }
        if(data.height){
            element.transform.worldTransform.d = data.height;
        }
    }
    function setWorldTransform(element,data){
        if(data.x){
            element.transform.worldTransform.tx = data.x;
        }
        if(data.y){
            element.transform.worldTransform.ty = data.y;
        }
        if(data.width){
            element.transform.worldTransform.a = data.width;
        }
        if(data.height){
            element.transform.worldTransform.d = data.height;
        }
    }
}

var setFontSizeResolute = function(font){
    var num = font.replace(/[^0-9]/ig,"");
    var fontSize = font.replace(num, num/resolute);
    return fontSize;
};
/*通过计算得到实际的字体大小*/
function setFontSize(fontSize){
    var text = fontSize,scale = 1;
    var num = text.replace(/[^0-9]/ig,"");
    var attr = text.split(num);
    var unit = attr[1].split(' ')[0];
    if(unit == 'px' && num < 12){
        text = text.replace(num, "12");
        scale = num/12;
    }else if(unit == 'pt' && num < 9){
        text = text.replace(num, "9");
        scale = num/9;
    }
    return [text,scale];
}
/*判断是否是图片，如是图片就返回texture*/
function stringImg(string){
    if(typeof string == 'string'){
        return PIXI.Texture.fromImage(string);
    }else{
        return string;
    }
}
/*合并对象，将第二个对象合并到第一个对象并返回*/
function mergeObj(obj1,obj2){
    for(var tem in obj2){
        obj1[tem] = obj2[tem];
    }
    return obj1;
}
/*判断值是否为undefined
 * 为undefined则返回第二个参数:data1；
 * 反之则返回第一个参数:data1;*/
function setAttrData(data1,data2){
    if(data1 != undefined){
        return data1;
    }else{
        return data2;
    }
}
/*判断元素是否在一个数组内*/
function inArray(attr,element){
    for(var i= 0,len=attr.length;i<len;i++){
        if(element == attr[i]){
            return true;
        }
    }
    return false;
}
/*判断两个数组的元素是否相等*/
function equalArray(attr1,attr2){
    var flag = true;
    if(attr1.length != attr2.length){
        flag = false;
    }else{
        for(var i= 0,len=attr1.length;i<len;i++){
            if(attr1[i] != attr2[i]){
                flag = false;
                break;
            }
        }
    }
    return flag;
}
/*判断两个简单的，没有嵌套的对象是否相等*/
function equalObj(obj1,obj2){
    var obj1Len = obj1 == undefined ? 0 : Object.getOwnPropertyNames(obj1).length;
    var obj2Len = Object.getOwnPropertyNames(obj2).length;
    if(obj1Len != obj2Len){
        return false;
    }else{
        for(var v in obj1){
            if(obj1[v] != obj2[v]){
                return false;
            }
        }
        return true;
    }
}
/*判断两个比较复杂的对象是否相等*/
function equals( x, y ) {
    var in1 = x instanceof Object;
    var in2 = y instanceof Object;
    if(!in1||!in2){
        return x===y;
    }
    if(Object.keys(x).length!==Object.keys(y).length){
        return false;
    }
    for(var p in x){
        var a = x[p] instanceof Object;
        var b = y[p] instanceof Object;
        if(a&&b){
            if(!equals( x[p], y[p])){
                return false;
            }
        }else if(x[p]!==y[p]){
            return false;
        }
    }
    return true;
}
/*克隆对象，用于接触对象的引用*/
function objClone(obj){
    var o,i,j,k;
    if(typeof(obj)!="object" || obj===null)return obj;
    if(obj instanceof(Array)){
        o=[];
        i=0;j=obj.length;
        for(;i<j;i++){
            if(typeof(obj[i])=="object" && obj[i]!=null){
                o[i]=objClone(obj[i]);
            }else{
                o[i]=obj[i];
            }
        }
    }else{
        o={};
        for(i in obj){
            if(typeof(obj[i])=="object" && obj[i]!=null){
                o[i]=objClone(obj[i]);
            }else{
                o[i]=obj[i];
            }
        }
    }
    return o;
}
/*将布尔值转化为0或1*/
function boolean2number(val){
    if(val){
        return 1;
    }else{
        return 0;
    }
}
/*创建发送数据的PKT的头部*/
function createPktHeader(magic,rw,type,isAck,needAck,dlen){
    this.magic = magic;
    this.rw = rw;
    this.type = type;
    this.isAck = isAck;
    this.needAck = needAck;
    this.dlen = dlen;
}
/*创建发送数据的PARA的头部*/
function createParaHeader(mode,type,ch,hl,index,group,dlen){
    this.mode = mode;
    this.type = type;
    this.ch = ch;
    this.hl = hl;
    this.pf = 0;
    this.index = index;
    this.group = group;
    this.dlen = dlen;
}
/*替换指定位置的字符串*/
function replaceString(string,index,char){
    var str = string.split('');
    str.splice(index,1,char);
    return str.join('');
}
/*保留指定位数的小数，返回的为number类型*/
function RetainDecimal(num,digit){
    var Multiple = Math.pow(10,digit);
    return Math.round(num*Multiple)/Multiple;
}
/*绘制窗口的title部分*/
function popupTitleGraphics(titleHeight,titleColor,radius,parent){
    var graphics = new PIXI.Graphics();
    graphics.beginFill(titleColor);
    graphics.moveTo(radius,0);
    graphics.lineTo(1-radius,0);
    graphics.arcTo(1,0,1,radius,radius/2);
    graphics.lineTo(1,titleHeight);
    graphics.lineTo(0,titleHeight);
    graphics.lineTo(0,radius);
    graphics.arcTo(0,0,radius,0,radius/2);
    graphics.endFill();
    parent.addChild(graphics);
    return graphics;
}
/*绘制渐变色的canvas*/
function drawLinearGradient(linearGradient,colorStop,ctx) {
    if(!ctx){
        var canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
    }
    ctx.beginPath();
    /* 指定渐变区域 */
    var grad  = ctx.createLinearGradient(linearGradient.x1,linearGradient.y1,linearGradient.x2,linearGradient.y2);
    /* 指定几个颜色 */
    var len = colorStop.length;
    for(var i=0;i<len;i++){
        grad.addColorStop(colorStop[i].pos,colorStop[i].color);
    }
    /* 将这个渐变设置为fillStyle */
    ctx.fillStyle = grad;
    if(canvas){
        return canvas;
    }else{
        return ctx;
    }
}
/*添加事件*/
function addEvent(obj,type,func){
    try{
        obj.addEventListener(type,func,false);
    }catch(e){
        try{
            obj.attachEvent('on' + type,func);
        }catch(e){
            obj['on' + type] = func;
        }
    }
}
/*将16进制的颜色转为带#号的*/
var color10hex210 = function(data){
    if(typeof data == 'number'){
        return '#'+data.toString(16);
    }else if(typeof data == 'string'){
        return data;
    }

};
/*控制鼠标滑轮的滚动*/
var scrollFunc = function(e){
    e=e || window.event;
    var t;
    if(e.wheelDelta){//IE/Opera/Chrome
        t=-e.wheelDelta/120;
    }else if(e.detail){//Firefox
        t=-e.detail/-3;
    }
    if(scrollFuncEvent){
        scrollFuncEvent(t);
    }
};
addEvent(document,'DOMMouseScroll',scrollFunc);//firefox
addEvent(document,'mousewheel',scrollFunc);//IE/Opera/Chrome
/*创建绑定键盘事件的对象*/
var kbKeyEvent = function(){
    var keyDownArray = [],keyUpArray = [];
    addEvent(document,'keydown',keyDown);
    addEvent(document,'keyup',keyUp);
    function keyDown(e){
        var currKey = e.keyCode || e.which || e.charCode;
        for(var i= 0,len=keyDownArray.length;i<len;i++){
            if(keyDownArray[i].disable && currKey == keyDownArray[i].key){
                keyDownArray[i].func();
            }
        }
    }

    function keyUp(e){
        var currKey = e.keyCode || e.which || e.charCode;
        for(var i= 0,len=keyUpArray.length;i<len;i++){
            if(keyUpArray[i].disable && currKey == keyUpArray[i].key){
                keyUpArray[i].func();
            }
        }
    }

    function addKeyDown(data){
        data.disable = true;
        keyDownArray.push(data);
    }

    function removeKeyDown(key){
        for(var i= 0,len=keyDownArray.length;i<len;i++){
            if(keyDownArray[i].key == key){
                keyDownArray[i].disable = false;
            }
        }
    }

    function addKeyUp(data){
        data.disable = true;
        keyUpArray.push(data);
    }

    function removeKeyUp(key){
        for(var i= 0,len=keyUpArray.length;i<len;i++){
            if(keyUpArray[i].key == key){
                keyUpArray[i].disable = false;
            }
        }
    }

    return {
        addKeyDown : addKeyDown,
        removeKeyDown : removeKeyDown,
        addKeyUp : addKeyUp,
        removeKeyUp : removeKeyUp
    }
}();

var sliderBgCanvas = function(){
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    var context = canvas.getContext('2d');
    context.beginPath();
    context.fillStyle = staticDataColor.slider.color;
    context.fillRect(0,0,1,1);
    context.fill();
    return canvas;
}();

var onBlurEvent = function(){
    if(!textIpt || textIpt.input.style.display == 'none')return;
    textIpt.input.style.display = 'none';
    textIpt.visible(true);
    textIpt.render();
    var val = textIpt.input.value;
    if(val == '' || !val)return;
    textIpt.iptFunc && textIpt.iptFunc(parseFloat(val),textIpt);
    textIpt.render();
};

var createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor, protoProps);
        if (staticProps) defineProperties(staticProps, protoProps);
        return Constructor;
    };
}();

/*公共的基类*/
function widget(e){
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.scale = null;
    this.ratio = null;
    this.rect  = null;
    this.sprite = null;
    this.element = e;
    this.disable = true;
}

widget.prototype.setPos = function(x,y){
    this.x = x;
    this.y = y;
};

widget.prototype.resize = function(x,y,width,height){
    var flag = 0;
    if(x != this.x && x != undefined){
        this.x = x;
        flag = 1;
    }if(y != this.y && y != undefined){
        this.y = y;
        flag = 1;
    }if(width != this.width && width != undefined){
        this.width = width;
        flag = 1;
    }if(height != this.height && height != undefined){
        this.height = height;
        flag = 1;
    }
    if(flag == 1){
        this.paint();
    }
};

widget.prototype.scaleStyle = function(xy){
    this.fixedScale = false;
    this.xScale = false;
    this.yScale = false;
    this.xyScale = false;
    if(xy = 'x'){
        this.xScale = true;
    }else if(xy = 'y'){
        this.yScale = true;
    }else if(xy = 'xy'){
        this.xyScale = true;
    }else if(xy = 'fixed'){
        this.fixedScale = true;
    }
};

widget.prototype.setRefresh = function(flag){};

widget.prototype.setRefresh = function(flag){
    if(flag){
        this.paint();
    }
};

widget.prototype.xScale = function(x,y,width,height){
    /*this.act为实际的坐标*/
    var act = getSpriteActData(this.element);
    var actParent = getSpriteActData(this.element.parent);
    this.y = act[1]/actParent[3];
    this.width = act[2]/actParent[2];
    this.height = act[3]/actParent[3];
    this.paint();
};

widget.prototype.yScale = function(){
    var act = getSpriteActData(this.element);
    var actParent = getSpriteActData(this.element.parent);
    this.y = act[1]/actParent[3];
    this.width = act[2]/actParent[2];
    this.height = act[3]/actParent[3];
    this.paint();
};

widget.prototype.ratioScale = function(){

};

widget.prototype.fixedScale = function(a,b){
    var element,pos,actW,actH,tmp;
    if(arguments.length == 1){
        element = this.element;
        pos = a;
        getActParent();
    }else if(arguments.length == 2 && b.length == undefined){
        element = a;
        pos = b;
        getActParent();
    }else if(arguments.length == 2 && b.length != undefined){
        element = this.element;
        pos = a;
        actW = b[0];
        actH = b[1];
    }

    if(pos.x){
        element.x = pos.x/actW;
    }
    if(pos.y){
        element.y = pos.y/actH;
    }
    if(pos.width){
        element.width = pos.width/actW;
    }
    if(pos.height){
        element.height = pos.height/actH;
    }
    function getActParent(){
        tmp = getSpriteActData(element.parent);
        actW = tmp[2];
        actH = tmp[3];
    }
};

widget.prototype.clear = function(){};

widget.prototype.renderable = function(flag){
    this.element.renderable = flag;
    this.element.interactiveChildren = flag;
};

widget.prototype.visible = function(flag){
    this.element.visible = flag;
};

widget.prototype.interactive = function(flag){
    this.element.interactive = flag;
    this.element.buttonMode = flag;
};

widget.prototype.onEvent = function(event,func){
    this.element.on(event,func);
};

widget.prototype.onDblEvent = function(event,func){
    this.element.on(event,oneEvent);
    var startTime = 0;
    var endTime = 0;
    function oneEvent(){
        endTime = Date.now();
        var dis = endTime-startTime;
        if(dis < dblTime){
            func();
            startTime = 0;
        }else{
            startTime = endTime;
        }
    }
};

widget.prototype.onLongEvent = function(func){
    var longTimer,his = this;
    this.element.on('mousedown',longMousedownEvent);
    this.element.on('touchstart',longMousedownEvent);

    this.element.on('mouseup',longMouseupEvent);
    this.element.on('touchend',longMouseupEvent);
    function longMousedownEvent(){
        longTimer = setTimeout(function(){
            func(his);
        },longPressTime);
    }
    function longMouseupEvent(){
        clearTimeout(longTimer);
    }
};

widget.prototype.removeEvent = function(event){
    this.element.removeListener(event);
};

widget.prototype.relation = function(attr){
    this.relate = attr;
};

widget.prototype.removeRelation = function(){
    this.relate = null;
};

widget.prototype.setAnchor = function(anchor1,anchor2){
    this.anchor1 = anchor1;
    this.anchor2 = anchor2 == undefined ? anchor1 : anchor2;
    this.element.anchor.set(this.anchor1,this.anchor2);
};

widget.prototype.setData = function(data,attr,formula){
    this.data = data;
    this.dataAttr = attr;
    this.formula = formula;
    this.updateDataFlag = data != undefined && attr != undefined ? true : false;
    if(this.updateDataFlag)this.sendOldData = this.data[this.dataAttr];
};

widget.prototype.setSendHeader = function(header){
    this.pktHeader = header.pkt;
    this.paraHeader = header.para;
};

widget.prototype.setHeaderGroup = function(group){
    if(this.paraHeader)this.paraHeader.group = group;
};

widget.prototype.setSendData = function(data){
    this.sendBaseData = data;
    this.sendFlag = data != undefined ? true : false;
};

widget.prototype.sendData = function(){
    if(this.sendFlag){
        if(this.updateDataFlag){
            if(parseFloat(this.sendOldData) != parseFloat(this.data[this.dataAttr])){
                sendData({pktHeader : this.pktHeader,paraHeader : this.paraHeader,data : this.sendBaseData});
                this.sendOldData = this.data[this.dataAttr];
            }
        }else{
            if(!equals(this.sendOldData,this.sendBaseData)){
                sendData({pktHeader : this.pktHeader,paraHeader : this.paraHeader,data : this.sendBaseData});
                this.sendOldData = objClone(this.sendBaseData);
            }
        }
    }
};

widget.prototype.setEventDealy = function(time){
    this.eventDealy = time;
};

widget.prototype.dealyEvent = function(){
    if(!this.eventDealy){
        return;
    }
    var his = this;
    this.element.interactive = false;
    setTimeout(function(){
        his.element.interactive = true;
    },this.eventDealy);
};

widget.prototype.setDisable = function(flag){
    if(this.disable != flag){
        this.disable = flag;
        this.interactive(flag);
        var alpha = flag ? 1 : .6;
        this.element.alpha = alpha;
    }
};

widget.prototype.setRenderClearRect = function(sprite,color,func){
    this.clearSprite = sprite ? sprite : this.element;
    window.GLOBAL.clearElement.push(this);
    this.clearColor = color10hex210(color);
    this.renderFunc = func;
    this.clearRect = getSpriteActData(this.clearSprite);
    this.renderFlag = true;
};

widget.prototype.clearChangePos = function(){
    if(!this.renderFlag)return;
    this.clearRect = getSpriteActData(this.clearSprite);
};

widget.prototype.render = function(noRender){
    if(!this.renderFlag || !this.renderVisible(this.clearSprite))return;
        var context = ctx.app.renderer.context;
        var clearRect = this.clearRect;
        if(this.clearColor){
            context.beginPath();
            context.fillStyle = this.clearColor;
            context.globalAlpha = 1;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.fillRect(clearRect[0],clearRect[1],clearRect[2],clearRect[3]);
            context.fill();
        }else{
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(clearRect[0],clearRect[1],clearRect[2],clearRect[3]);
        }
    !noRender && fixedScale();
    this.clearSprite.renderCanvas(ctx.app.renderer);
    this.renderFunc && this.renderFunc();
};

widget.prototype.renderVisible = function(element){
    if(!element.visible){
        return false;
    }
    var ele = element;
    while(true){
        if(!ele.visible || !ele.renderable){
            return false;
        }else{
            if(!ele.parent){
                return true;
            }else{
                ele = ele.parent;
            }
        }
    }
};

var kbSkip = function(x,y,width,height,twinkleCanvas,parent,renderColor,noInstruct,initH){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.twinkleCanvas = twinkleCanvas;
    this.parent = parent;
    this.noInstruct = noInstruct;
    this.noInstruct = true;
    this.cutX = 0;
    this.cutY = 1;
    this.renderColor = renderColor;
    this.instructFlag = false;
    this.init();
    initH = initH ? initH : 0;
    this.cut(0,initH);
};

kbSkip.prototype = mergeObj(kbSkip.prototype,widget.prototype);

kbSkip.prototype.init = function(){
    this.sprite = new kbSprite(this.x,this.y,this.width,this.height,this.parent);
    this.element = this.sprite.sprite;
    this.setRenderClearRect(this.sprite.sprite,this.renderColor);
    if(typeof this.twinkleCanvas == 'number'){
        var bg = new kbBoxBg(.15,0,.7,1,0x101015,this.sprite.sprite,true);
        bg.setRadius(.5);
        this.frequency = new kbBoxBg(.15,.005,.7,.99,this.twinkleCanvas,this.sprite.sprite,true);
        this.frequency.setRadius(.5);
    }else{
        this.canvasW = this.twinkleCanvas.width;
        this.canvasH = this.twinkleCanvas.height;
        this.img = this.twinkleCanvas.cutImg;
        this.ctx = this.twinkleCanvas.getContext('2d');
        this.frequency = new kbCanvasBg(.15,.005,.8,.99,this.twinkleCanvas,this.sprite.sprite);
    }

    if(!this.noInstruct){
        this.instruct = new kbBoxBg(0,0,1,.01,0xffffff,this.sprite.sprite);
        this.instructY = 0;
    }
};

kbSkip.prototype.switchTexture = function(skipCanvas){
    if(typeof skipCanvas == 'number'){
        this.frequency.setColor(skipCanvas);
    }else{
        var texture = PIXI.Texture.fromCanvas(skipCanvas);
        if(texture != this.frequency.sprite.texture){
            this.frequency.sprite.texture = texture;
            this.twinkleCanvas = skipCanvas;
            this.canvasW = this.twinkleCanvas.width;
            this.canvasH = this.twinkleCanvas.height;
            this.img = this.twinkleCanvas.cutImg;
            this.ctx = this.twinkleCanvas.getContext('2d');
        }
    }
    if(this.cutX != 0 || this.cutY != 1){
        this.cut(this.cutX,this.cutY,null,null,true);
    }
};

kbSkip.prototype.cut = function(x,y,width,height,update){
    height = height != undefined ? height : 1-y;
    if(this.cutHeight == height && this.cutY == y && !update)return;
    this.cutHeight = height;
    var his = this,space = .01;
    this.cutX = x;
    this.cutY = y;
    if(!this.instructFlag && this.instruct)instructMove();
    if(typeof this.twinkleCanvas == 'number'){
        this.frequency.setHeight(y);
        this.frequency.setY(this.cutHeight);
    }else{
        this.ctx.clearRect(0,0,this.canvasW,this.canvasH);
        this.ctx.fillStyle = '#101015';
        this.ctx.fillRoundRect(0,0,this.canvasW,this.canvasH,this.canvasW/2);
        this.ctx.fill();
        this.ctx.drawImage(this.img,0,this.canvasH*this.cutHeight,this.canvasW,this.canvasH*this.cutY,0,this.canvasH*this.cutHeight,this.canvasW,this.canvasH*this.cutY);
    }
    if(this.instruct){
        if(this.cutHeight < this.instruct.y){
            this.instruct.setY(this.cutHeight);
            this.instructY = this.instruct.y;
            clearTimeout(this.timerStaty);
            clearInterval(this.timerMove);
            this.timerStaty = setTimeout(instructMove,GLOBAL.clipHold);
        }
    }
    this.render(true);
    function instructMove(){
        his.instructFlag = true;
        clearInterval(his.timerMove);
        his.timerMove = setInterval(function(){
            his.instructY += space;
            if(his.instructY > his.cutHeight){
                his.instructY = his.cutHeight;
            }
            his.instruct.setY(his.instructY);
        },100);
    }
};

function kbBandData(){
    widget.call(this);
}

kbBandData.prototype = mergeObj(kbBandData.prototype,widget.prototype);

/*创建sprite*/
function kbSprite(x,y,width,height,parent,texture){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.parent = parent;
    this.texture = texture;
    this.sprite = new PIXI.Sprite(this.texture);
    this.element = this.sprite;
    this.parent && this.parent.addChild(this.sprite);
    this.paint();
}

kbSprite.prototype.paint = function(){
    this.sprite.position.x = this.x;
    this.sprite.position.y = this.y;
    this.sprite.width = this.width;
    this.sprite.height = this.height;
};

kbSprite.prototype.setAttr = function(data){
    this.x = setAttrData(data.x,this.x);
    this.y = setAttrData(data.y,this.y);
    this.width = setAttrData(data.width,this.width);
    this.height = setAttrData(data.height,this.height);
    this.paint();
};

kbSprite.prototype.setX = function(x){
    this.x = x;
    this.sprite.x = this.x;
};

kbSprite.prototype.setY = function(y){
    this.y = y;
    this.sprite.y = this.y;
};

kbSprite.prototype.setWidth = function(width){
    this.width = width;
    this.sprite.width = this.width;
};

kbSprite.prototype.setHeight = function(height){
    this.height = height;
    this.sprite.height = this.height;
};

kbSprite.prototype = mergeObj(kbSprite.prototype,widget.prototype);

/*创建背景*/
function kbBoxBg(x,y,width,height,backGroundColor,parent,alpha,flag){
    widget.call(this);
    GLOBAL.graphicsResize.push(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.parent = parent;
    this.backGroundColor = backGroundColor;
    this.alpha = alpha!=undefined && alpha !== false && alpha !==true ? alpha : 1;
    this.graphics = new PIXI.Graphics();
    this.parent.addChild(this.graphics);
    this.element = this.graphics;
    pushScaleData(this.graphics);
    this.getActeData();
    if(typeof alpha == 'number' && !flag){
        this.paint();
    }else if(alpha == undefined || alpha === false){
        this.paint();
    }
    //this.visible(false);
}

kbBoxBg.prototype.getActeData = function(){
        if(!this.parentActW){
            var tmp = getSpriteActData(this.parent);
            this.parentActW = tmp[2];
            this.parentActH = tmp[3];
        }
        this.actX = Math.ceil(this.parentActW*this.x);
        this.actY = Math.ceil(this.parentActH*this.y);
        this.actW = Math.ceil(this.parentActW*this.width);
        this.actH = Math.ceil(this.parentActH*this.height);
};

kbBoxBg.prototype.paint = function(){
    this.graphics.clear();
    this.graphics.beginFill(this.backGroundColor,this.alpha);
    if(this.borderWidth){
        this.graphics.lineStyle(this.borderWidth,this.borderColor,this.borderAlpha);
    }
    if(this.radius){
        var radius = Math.min(this.actW,this.actH)*this.radius;
        this.graphics.drawRoundedRect(this.actX,this.actY,this.actW,this.actH,radius);
    }else{
        this.graphics.drawRect(this.actX,this.actY,this.actW,this.actH);
    }
    this.graphics.endFill();
};

kbBoxBg.prototype.setBorder = function(borderWidth,borderColor,borderAlpha,flag){
    this.borderWidth = borderWidth;
    this.borderColor = borderColor !=undefined? borderColor : 0xFFFFFF;
    this.borderAlpha = borderAlpha !=undefined ? borderAlpha : 1;
    this.getActeData();
    if(borderColor !== true && borderAlpha !== true && flag !== true){
        this.paint();
    }
};

kbBoxBg.prototype.setRadius = function(radius){
    this.radius = radius;
    this.getActeData();
    this.paint();
};

kbBoxBg.prototype.setShowDown = function(){

};

kbBoxBg.prototype.setWidth = function(width){
    this.width = width;
    this.getActeData();
    this.paint();
};

kbBoxBg.prototype.setHeight = function(height){
    this.height = height;
    this.getActeData();
    this.paint();
};

kbBoxBg.prototype.setX = function(x){
    this.x = x;
    this.getActeData();
    this.paint();
};

kbBoxBg.prototype.setY = function(y){
    this.y = y;
    this.getActeData();
    this.paint();
};

kbBoxBg.prototype.setColor = function(color){
    this.backGroundColor = color;
    this.paint();
};

kbBoxBg.prototype.setAlpha = function(alpha){
    this.alpha = alpha;
    this.paint();
};

kbBoxBg.prototype.setAttr = function(data){
    this.x = setAttrData(data.x,this.x);
    this.y = setAttrData(data.y,this.y);
    this.width = setAttrData(data.width,this.width);
    this.height = setAttrData(data.height,this.height);
    this.backGroundColor = setAttrData(data.backGroundColor,this.backGroundColor);
    this.alpha = setAttrData(data.alpha,this.alpha);
    this.borderWidth = setAttrData(data.borderWidth,this.borderWidth);
    this.borderColor = setAttrData(data.borderColor,this.borderColor);
    this.borderAlpha = setAttrData(data.borderAlpha,this.borderAlpha);
    this.paint();
};

kbBoxBg.prototype = mergeObj(kbBoxBg.prototype,widget.prototype);

kbBoxBg.prototype.resize = function(){
    if(arguments.length == 0){
        this.parentActW = null;
        this.getActeData();
        this.paint();
    }
};

/*创建button的控件*/
function kbButton(x,y,width,height,background,content,color,font,parent,alpha,borderWidth,borderColor,borderAlpha){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.imgButton = 0;
    this.eventFlag = 0;
    if(typeof background[0] != 'number'){
        this.imageDef = background[0];
        this.imageRep = background[1];
        if(typeof background[0] == 'string'){
            this.textureDef = PIXI.Texture.fromImage(this.imageDef);
            this.textureRep = PIXI.Texture.fromImage(this.imageRep);
        }else{
            this.textureDef = PIXI.Texture.fromCanvas(this.imageDef);
            this.textureRep = PIXI.Texture.fromCanvas(this.imageRep);
        }
        this.imgButton = true;
    }else{
        this.colorDef = background[0];
        this.colorRep = background[1];
    }
    this.content = content;
    if(typeof color == 'number' || typeof color == 'string'){
        this.color = color;
    }else{
        this.color = color[0];
        this.colorSwitch = color[1];
    }
    this.font = font;
    this.parent = parent;
    this.alpha = setAttrData(alpha,1);
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.borderAlpha = borderAlpha;
    this.init();
}

kbButton.prototype.init = function(){
    var sprite = new kbSprite(this.x,this.y,this.width,this.height,this.parent);
    this.box = sprite;
    this.sprite = sprite.sprite;
    this.paint = sprite.paint;
    this.element = this.sprite;
    if(!this.imgButton){
        this.boxBg = new kbBoxBg(0,0,1,1,this.colorDef,this.sprite,this.alpha,true);
        this.boxBg.setBorder(this.borderWidth,this.borderColor,this.borderAlpha);
    }
    if(this.imgButton){
        this.backgroundImage = new kbSprite(0,0,1,1,this.sprite,this.textureDef);
    }
    if(this.content){
        var tmp = getSpriteActData(this.sprite);
        this.actW = tmp[2];
        this.actH = tmp[3];
        this.paintText();
    }
};

kbButton.prototype.paintText = function(){
    var x, y,his = this;
    if(this.imgButton){
        x = .5/this.sprite.scale.x*this.width;
        y = .5/this.sprite.scale.y*this.height;
    }else{
        x = y = .5;
    }
    this.text = new kbBoxText(x,y,this.content,this.color,this.font,this.sprite,.5,.5);
    this.text.ellipsis(this.actW);
    if(this.imgButton){
        this.backgroundImage.sprite.texture.baseTexture.on('loaded',function(){
            his.sprite.setChildIndex(his.backgroundImage.sprite,0);
            his.sprite.setChildIndex(his.text.text,1);
        });
    }
};

kbButton.prototype.setText = function(content){
    this.content = content;
    this.text.setText(this.content);
};

kbButton.prototype.switchColor = function(a,b,c){
    this.removeEvent('mousedown');
    this.removeEvent('touchstart');
    var color,color1,color2;
    a = stringImg(a);
    b = stringImg(b);
    c = stringImg(c);
    if(!this.imgButton){
        color1 = this.colorDef;
        color2 = this.colorRep;
    }else{
        color1 = this.textureDef;
        color2 = this.textureRep;
    }
    switch(arguments.length){
        case 1 :
            this.func = a;
            break;
        case 2 :
            color1 = a;
            color2 = b;
            break;
        case 3 :
            color1 = a;
            color2 = b;
            this.func = c;
            break;
    }
    var len;
    if(this.bntRadioArray){
        this.changeColorFunc = changeColorRadio;
        len = this.bntRadioArray.length;
    }else if(this.relate){
        this.changeColorFunc = changeColorLinkage;
        len = this.relate.length;
    }else if(this.bounceButton){
        this.changeColorFunc = changeColorBounce;
    }else{
        this.changeColorFunc = changeColor;
    }

    this.interactive(true);
    this.onEvent('mousedown',mousedownfunc);
    this.onEvent('touchstart',mousedownfunc);
    var his = this;
    function mousedownfunc(){
        his.dealyEvent();
        his.changeColorFunc();
        his.func && his.func(his);
        his.sendData();
        window.appRender();
    }

    this.mousedownfunc = mousedownfunc;

    function changeColor(){
        color = his.eventFlag ? color1 : color2;
        his.setColor(color);
        if(his.colorSwitch){
            color = his.eventFlag ? his.color : his.colorSwitch;
            his.text.setColor(color);
        }
        his.eventFlag = !his.eventFlag;
        if(his.updateDataFlag)his.data[his.dataAttr] = boolean2number(!his.data[his.dataAttr]);
    }

    function changeColorRadio(){
        for(var i=0;i<len;i++){
            if(his.imgButton)color1 = his.bntRadioArray[i].imageDef;
            if(his.colorSwitch)his.bntRadioArray[i].text.setColor(his.color);
            his.bntRadioArray[i].setColor(color1);
            if(his.bntRadioArray[i].eventFlag){
                his.bntRadioArray[i].eventFlag = 0;
                if(his.bntRadioArray[i].updateDataFlag)his.bntRadioArray[i].data[his.bntRadioArray[i].dataAttr] = 0;
            }
        }
        his.setColor(color2);
        his.eventFlag = 1;
        if(his.colorSwitch)his.text.setColor(his.colorSwitch);
        if(his.updateDataFlag)his.data[his.dataAttr] = 1;
        for(i=0;i<len;i++){
            his.bntRadioArray[i].sendData();
        }
    }

    function changeColorLinkage(){
        var color = his.eventFlag ? color1 : color2,
            textColor = his.eventFlag ? his.color: his.colorSwitch;
        var eventFlag = !his.eventFlag;
        for(var i=0;i<len;i++){
            his.relate[i].setColor(color);
            if(his.colorSwitch){
                his.relate[i].text.setColor(textColor);
            }
            his.relate[i].eventFlag = eventFlag;
            if(his.relate[i].updateDataFlag)his.relate[i].data[his.relate[i].dataAttr] = boolean2number(!his.relate[i].data[his.relate[i].dataAttr]);
        }
    }

    function changeColorBounce(){
        changeColor();
        setTimeout(function(){
            changeColor();
        },buttonBounceTime)
    }
};

kbButton.prototype.setColor = function(color){
    color = stringImg(color);
    if(this.imgButton){
        this.backgroundImage.sprite.texture = color;
    }else{
        this.boxBg.setColor(color);
    }
};

kbButton.prototype.actionEvent = function(){
    this.mousedownfunc();
};

kbButton.prototype.radio = function(bntArray){
    this.bntRadioArray = bntArray;
};

kbButton.prototype.chooseColor = function(flag){
    var color,color1,color2;
    var flag = flag ? flag : this.eventFlag;
    if(!this.imgButton){
        color1 = this.colorDef;
        color2 = this.colorRep;
    }else{
        color1 = this.textureDef;
        color2 = this.textureRep;
    }
    color = !flag ? color1 : color2;
    this.setColor(color);
    if(this.colorSwitch){
        color = !flag ? this.color: this.colorSwitch;
        this.text.setColor(color);
    }
};

kbButton.prototype.update = function(){
    if(this.updateDataFlag){
        var data = this.data[this.dataAttr];
        this.sendOldData = data;
        this.eventFlag = data ? true : false;
        this.chooseColor();
        if(this.updateFunc)this.updateFunc(this);
    }
};

kbButton.prototype.bounce = function(){
    this.bounceButton = true;
};

kbButton.prototype.lock = function(flag){
    this.sprite.interactive = flag;
};

kbButton.prototype = mergeObj(kbButton.prototype,widget.prototype);

function switchLanguage(flag){
    for(var i= 0,len=allText.length;i<len;i++){
        allText[i].switchLanguage(flag);
    }
}
/*创建文本的控件*/
function kbBoxText(x,y,content,color,font,parent,anchor1,anchor2){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.color = color;
    this.font = font;
    this.parent = parent;
    this.anchor1 = anchor1 ? anchor1 : 0;
    this.anchor2 = anchor2||anchor2==0 ? anchor2 : this.anchor1;
    if(typeof content == 'object'){
        this.content = content[GLOBAL.language];
        this.contentEn = content.en;
        this.contentCn = content.cn;
    }else{
        this.content = content;
    }
    var fontSplit = this.font.split(' ');
    switch(fontSplit.length){
        case 1 :
            this.fontSize = fontSplit[0];
            this.fontFamily = 'Arial';
            break;
        case 2 :
            if(parseInt(fontSplit[0]) > 0){
                this.fontSize = fontSplit[0];
                this.fontFamily = fontSplit[1];
            }else{
                this.fontWeight = fontSplit[0];
                this.fontSize = fontSplit[1];
                this.fontFamily = 'Arial';
            }
            break;
        case 3 :
            this.fontWeight = fontSplit[0];
            this.fontSize = fontSplit[1];
            this.fontFamily = fontSplit[2];
    }
    this.box();
}

kbBoxText.prototype.box = function(){
    this.text = new PIXI.Text();
    this.element = this.text;
    this.parent.addChild(this.text);
    var fontTmp = setFontSize(this.fontSize);
    this.fontSize = fontTmp[0];
    this.paint();
    pushScaleData(this.text,{width:1,height:1});
    allText.push(this);
};

kbBoxText.prototype.paint = function(){
    this.text.text = this.content;
    if(this.fontWeight){
        this.text.style.fontWeight = this.fontWeight;
    }
    if(this.fontSize){
        this.text.style.fontSize = this.fontSize;
    }
    if(this.fontFamily){
        this.text.style.fontFamily = this.fontFamily;
    }
    this.text.style.fill = this.color;
    this.text.position.x = this.x;
    this.text.position.y = this.y;
    this.text.anchor.set(this.anchor1,this.anchor2);
};

kbBoxText.prototype.switchLanguage = function(flag){
      switch(flag){
          case 'en' :
              this.contentEn && this.setText(this.contentEn);
              break;
          case 'cn' :
              this.contentCn && this.setText(this.contentCn);
              break;
      }
};

kbBoxText.prototype.setText = function(content){
    if(content != this.content){
        if(typeof content == 'object'){
            this.content = content[GLOBAL.language];
            this.contentEn = content.en;
            this.contentCn = content.cn;
        }else{
            this.content = content;
        }
        this.text.text = this.content;
        if(this.ellipsisFlag){
            //this.ellipsis();
        }
        this.render();
    }
};

kbBoxText.prototype.setColor = function(color){
    this.color = color;
    this.text.style.fill = this.color;
};

kbBoxText.prototype.setFont = function(fontSize){
    this.fontSize = fontSize;
    this.text.style.fontSize = this.fontSize;
    if(this.ellipsisFlag){
        this.ellipsis();
    }
};

kbBoxText.prototype.setX = function(x){
    this.x = x;
    this.text.position.x = this.x;
};

kbBoxText.prototype.setY = function(y){
    this.y = y;
    this.text.position.y = this.y;
};

kbBoxText.prototype.setAttr = function(data){
    this.content = setAttrData(data.text,this.content);
    this.fontSize = setAttrData(data.font,this.fontSize);
    this.fontWeight = setAttrData(data.fontWeight,this.fontWeight);
    this.color = setAttrData(data.color,this.color);
    this.fontFamily = setAttrData(data.fontFamily,this.fontFamily);
    this.anchor1 = setAttrData(data.anchor1,this.anchor1);
    this.anchor2 = setAttrData(data.anchor2,this.anchor2);
    this.x = setAttrData(data.x,this.x);
    this.y = setAttrData(data.y,this.y);
    this.paint();
    if(this.ellipsisFlag){
        this.ellipsis();
    }
};

kbBoxText.prototype.ellipsis = function(actW){
    this.ellipsisFlag = true;
    this.ellipsisActW = actW ? actW : this.ellipsisActW;
    var textWidth = this.text.width;
    if(textWidth > this.ellipsisActW){
        var m = this.ellipsisActW/textWidth;
        var len = Math.floor(this.content.length*m)-2;
        var string = '';
        for(var i=0;i<len;i++){
            string += this.content[i];
        }
        string += '...';
        this.setText(string);
    }
};

kbBoxText.prototype.setInput = function(input,box,func){
    this.input = input;
    this.iptFunc = func;
    var boxPos = [];
    if(box instanceof Array){
        var tmp = getSpriteActData(this.text);
        boxPos[0] = tmp[0]-box[0];
        boxPos[1] = tmp[1]-box[1];
        boxPos[2] = box[0]*2;
        boxPos[3] = box[1]*2;
    }else{
        boxPos = getSpriteActData(box);
    }

    this.text.interactive = true;
    this.text.on('mousedown',onclickEvent);
    this.text.on('touchstart',onclickEvent);
    var his = this;
    function onclickEvent(){
        onBlurEvent();
        textIpt = his;
        his.visible(false);
        his.input.clicked = true;
        his.input.style.display = 'block';
        his.input.style.fontSize = setFontSizeResolute(his.fontSize);
        his.input.style.color = color10hex210(his.color);
        his.input.style.lineHeight = boxPos[3]/resolute + 'px';
        his.input.style.left = boxPos[0]/resolute + 'px';
        his.input.style.top = boxPos[1]/resolute + 'px';
        his.input.style.width = boxPos[2]/resolute + 'px';
        his.input.style.height = boxPos[3]/resolute + 'px';
        his.input.value = '';
        his.input.focus();
        his.render();
    }
};

kbBoxText.prototype = mergeObj(kbBoxText.prototype,widget.prototype);

/*根据attr的坐标来画的任意的图形*/
function kbPolygon(attr,backGroundColor,aph,parent,borderWidth,borderColor,borderAlpha){
    widget.call(this);
    this.attr = attr;
    this.backGroundColor = backGroundColor;
    this.aph = aph;
    this.parent = parent;
    this.borderWidth = borderWidth;
    this.borderColor = setAttrData(borderColor,0xFFFFFF);
    this.borderAlpha = setAttrData(borderAlpha,1);
    this.graphics = new PIXI.Graphics();
    this.parent.addChild(this.graphics);
    this.element = this.graphics;
    if(this.attr.length > 0){
        this.paint();
    }
}

kbPolygon.prototype.paint = function(){
    this.graphics.clear();
    this.graphics.beginFill(this.backGroundColor,this.aph);
    if(this.borderWidth != undefined){
        this.graphics.lineStyle(this.borderWidth,this.borderColor,this.borderAlpha);
    }
    this.graphics.moveTo(this.attr[0].x,this.attr[0].y);
    for(var i=1;i<this.attr.length;i++){
        this.graphics.lineTo(this.attr[i].x,this.attr[i].y);
    }
    this.graphics.endFill();
};

kbPolygon.prototype.setText = function(x,y,text,color,size){
    new kbBoxText(x,y,text,color,size,this.graphics,.5,.5);
};

kbPolygon.prototype.setColor = function(color){
    this.backGroundColor = color;
    this.paint();
};

kbPolygon.prototype = mergeObj(kbPolygon.prototype,widget.prototype);

/*
 * 画一个圆的控件
 * this.m表示父元素长宽的比例，以便设置圆的scale
 * */
function Circle(x,y,r,color,parent,alpha,borderWidth,borderColor,borderAlpha){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.parent = parent;
    this.alpha = setAttrData(alpha,1);
    this.borderWidth = borderWidth;
    this.borderColor = borderColor ? borderColor : 0xFFFFFF;
    this.borderAlpha = borderAlpha ? borderAlpha : 1;
    this.init();
}

Circle.prototype.init = function(){
    this.graphics = new PIXI.Graphics();
    this.element = this.graphics;
    this.parent.addChild(this.graphics);
    this.graphics.position.x = this.x;
    this.graphics.position.y = this.y;
    var tmp = getSpriteActData(this.parent);
    if(this.xy == 'y'){
        this.scaleX = tmp[3]/tmp[2];
        this.graphics.scale.x = this.scaleX;
    }else{
        this.scaleY = tmp[2]/tmp[3];
        this.graphics.scale.y = this.scaleY;
    }
    this.paint();
};

Circle.prototype.paint = function(){
    this.graphics.clear();
    this.graphics.beginFill(this.color,this.alpha);
    this.borderWidth && this.graphics.lineStyle(this.borderWidth,this.borderColor,this.borderAlpha);
    this.graphics.drawCircle(0,0,this.r);
    this.graphics.endFill();
};

Circle.prototype.setAttr = function(setData){
    this.color = setAttrData(setData.color,this.color);
    this.alpha = setAttrData(setData.alpha,this.alpha);
    this.borderWidth = setAttrData(setData.borderWidth,this.borderWidth);
    this.borderColor = setAttrData(setData.borderColor,this.borderColor);
    this.borderAlpha = setAttrData(setData.borderAlpha,this.borderAlpha);
    this.r = setAttrData(setData.r,this.r);
    this.paint();
};

Circle.prototype.setX = function(x){
    this.x = x;
    this.graphics.position.x = this.x;
};

Circle.prototype.setY = function(y){
    this.y = y;
    this.graphics.position.y = this.y;
};

Circle.prototype = mergeObj(Circle.prototype,widget.prototype);

/*创建线的控件*/
function kbLine(x,y,x1,y1,color,parent,lineWidth){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.x1 = x1;
    this.y1 = y1;
    this.color = color;
    this.parent = parent;
    this.lineWidth = lineWidth;
    this.graphics = new PIXI.Graphics();
    this.parent.addChild(this.graphics);
    this.element = this.graphics;
    this.paint();
}

kbLine.prototype.paint = function(){
    this.graphics.clear();
    this.graphics.beginFill();
    this.graphics.lineStyle(this.lineWidth,this.color);
    this.graphics.moveTo (this.x,this.y);
    this.graphics.lineTo(this.x1,this.y1);
    this.graphics.endFill();
};

kbLine.prototype.setWidth = function(width){
    this.lineWidth = width;
    this.paint();
};

kbLine.prototype.setX = function(x1,x2){
    if(arguments.length == 1){
        this.x = x1;
        this.x1 = x1;
    }else if(arguments.length == 2){
        this.x = x1;
        this.x1 = x2;
    }
    this.paint();
};

kbLine.prototype.set = function(data){
    if(data.width >= 0){
        this.lineWidth = data.width;
    }else if(data.color){
        this.color = data.color;
    }
    this.paint();
};

kbLine.prototype = mergeObj(kbLine.prototype,widget.prototype);

/*创建下拉框*/
function kbSelet(x,y,width,height,backColor,buttonColor,color,content,selt){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.backgroundColor = backColor;
    this.buttonColor = buttonColor;
    this.content = content;
    this.color = color;
    this.selt = selt;
    this.createSprite();
    this.createButton();
    this.dispear();
}

kbSelet.prototype.createSprite = function(){
    this.sprite = new kbSprite(this.x,this.y,this.width,this.height,this.selt.sprite);
    new kbBoxBg(0,0,1,1,0x000000,this.sprite.sprite,0,true).setBorder(1,this.backgroundColor,1);
    this.element = this.sprite.sprite;
    this.selt.interactive(true);
    this.selt.onEvent('mousedown',seleClickEvent);
    this.selt.onEvent('touchstart',seleClickEvent);
    var his = this,flag = true;
    function seleClickEvent(){
        if(flag){
            his.display();
        }else{
            his.dispear();
        }
        flag = !flag;
    }
};

kbSelet.prototype.createButton = function(){
    var his = this,x = 0,y = 0,width = 1;
    var len = this.content.length,height = 1/len,obutton;
    this.bntArray = [];
    for(var i=0;i<len;i++){
        this.color = "black";
        obutton = new kbButton(x,y,width,height,this.buttonColor,this.content[i],0xFFFFFF,'12pt',this.sprite.sprite,len);
        var line = new kbLine(x,y,1,y,this.backgroundColor,this.sprite.sprite,.005);
        y += height;
        obutton.interactive(true);
        (function(){
            var p = i;
            obutton.onEvent('mousedown', onDragStart);
            obutton.onEvent('touchstart', onDragStart);
            function onDragStart(event){
                his.selt.setText(his.content[p]);
                event.stopPropagation();
            }
        }());
        this.bntArray.push(obutton);
    }
};

kbSelet.prototype.display = function(){
    this.sprite.visible(true)
};

kbSelet.prototype.dispear = function(){
    this.sprite.visible(false);
};

kbSelet.prototype = mergeObj(kbSelet.prototype,widget.prototype);

/*创建三角形*/
function kbTriangle(x,y,width,height,lineWidth,lineColor,fillColor,parent){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.fillColor = fillColor;
    this.parent = parent;
    this.graphics = new PIXI.Graphics();
    this.parent.addChild(this.graphics);
    this.element = this.graphics;
    this.create = function(){
        this.graphics.beginFill(this.fillColor);
        this.graphics.lineStyle(this.lineWidth,this.lineColor);
        this.graphics.moveTo(this.x,this.y);
        this.graphics.lineTo(this.x+this.width,this.y);
        this.graphics.lineTo(this.x+this.width/2,this.y+this.height);
        this.graphics.lineTo(this.x,this.y);
        this.graphics.endFill();
    };
    this.create();
}

kbTriangle.prototype = mergeObj(kbTriangle.prototype,widget.prototype);

/*创建环形控件*/
var Ring = function(x,y,r1,r2,color1,color2,parent,alpha1,alpha2,borderWidth1,borderWidth2,borderColor1,borderColor2,borderAlpha1,borderAlpha2){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.r1 = r1;
    this.r2 = r2;
    this.color1 = color1;
    this.color2 = color2;
    this.alpha1 = setAttrData(alpha1,1);
    this.alpha2 = setAttrData(alpha2,1);
    this.borderWidth1 = borderWidth1;
    this.borderWidth2 = borderWidth2;
    this.borderColor1 = borderColor1!=undefined ? borderColor1 : 0xFFFFFF;
    this.borderColor2 = borderColor2!=undefined ? borderColor2 : 0xFFFFFF;
    this.borderAlpha1 = borderAlpha1!=undefined ? borderAlpha1 : 1;
    this.borderAlpha2 = borderAlpha2!=undefined ? borderAlpha2 : 1;
    this.parent = parent;
    this.getActParent();
};

Ring.prototype.getActParent = function() {
    this.graphics = new PIXI.Graphics();
    this.parent.addChild(this.graphics);
    this.element = this.graphics;
    pushScaleData(this.graphics,{width:1,height:1});
    this.createSprite();
};

Ring.prototype.createSprite = function(){
    this.graphics.position.x = this.x;
    this.graphics.position.y = this.y;
    //this.sprite.width = (1/this.actW);
    //this.sprite.height = (1/this.actH);
    this.paint();
};

Ring.prototype.paint = function(){
    this.graphics.clear();
    this.graphics.beginFill(this.color1,this.alpha1);
    if(this.borderWidth1 != undefined && this.borderWidth1){
        this.graphics.lineStyle(this.borderWidth1,this.borderColor1,this.borderAlpha1);
    }else{
        this.graphics.lineStyle(0,0,0);
    }
    this.graphics.drawCircle(0,0,this.r1);
    this.graphics.endFill();
    this.graphics.beginFill(this.color2,this.alpha2);
    if(this.borderWidth2 != undefined && this.borderWidth2){
        this.graphics.lineStyle(this.borderWidth2,this.borderColor2,this.borderAlpha2);
    }else{
        this.graphics.lineStyle(0,0,0);
    }
    this.graphics.drawCircle(0,0,this.r2);
    this.graphics.endFill();
};

Ring.prototype.paintText = function(content,color,font){
    this.textContent = content;
    this.textColor = color;
    this.textFont = font;
    this.text = new kbBoxText(.5,.5,this.textContent,this.textColor,this.textFont,this.graphics,.5,.5);
};

Ring.prototype.setRing = function(setData){
    this.r1 = setAttrData(setData.r1,this.r1);
    this.r2 = setAttrData(setData.r2,this.r2);
    this.color1 = setAttrData(setData.color1,this.color1);
    this.color2 = setAttrData(setData.color2,this.color2);
    this.alpha1 = setAttrData(setData.alpha1,this.alpha1);
    this.alpha2 = setAttrData(setData.alpha2,this.alpha2);
    this.borderColor1 = setAttrData(setData.borderColor1,this.borderColor1);
    this.borderColor2 = setAttrData(setData.borderColor2,this.borderColor2);
    this.borderWidth1 = setAttrData(setData.borderWidth1,this.borderWidth1);
    this.borderWidth2 = setAttrData(setData.borderWidth2,this.borderWidth2);
    this.borderAlpha1 = setAttrData(setData.borderAlpha1,this.borderAlpha1);
    this.borderAlpha2 = setAttrData(setData.borderAlpha2,this.borderAlpha2);
    if(setData.x || setData.y){
        this.x = setAttrData(setData.x,this.x);
        this.y = setAttrData(setData.y,this.y);
        this.createSprite();
    }else{
        this.paint();
    }
};

Ring.prototype.setX = function(x){
    this.x = x;
    this.graphics.position.x = this.x;
};

Ring.prototype.setY = function(y){
    this.y = y;
    this.graphics.position.y = this.y;
};

Ring.prototype.setText = function(setData){
    this.text.setAttr(setData);
};

Ring.prototype.fixed = function(actW,actH){
    //if(arguments.length != 0){
    //    this.actW = actW;
    //    this.actH = actH;
    //}else{
    //    var tmp = getSpriteActData(this.parent);
    //    this.actW = tmp[2];
    //    this.actH = tmp[3];
    //}
    //this.sprite.width = 1/this.actW;
    //this.sprite.height = 1/this.actH;
};

Ring.prototype = mergeObj(Ring.prototype,widget.prototype);

/*创建弧形控件*/
var Arc = function(x,y,r,startAngle,endAngle,color,alpha,parent,borderColor,borderWidth,borderAlpha){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.r = r;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.color = color;
    this.alpha = alpha;
    this.parent = parent;
    this.borderColor = borderColor ? borderColor : '';
    this.borderWidth = borderWidth ? borderWidth : '';
    this.borderAlpha = borderAlpha ? borderAlpha : '';
    this.getActParent();
};

Arc.prototype.getActParent = function(){
    this.sprite = new PIXI.Sprite();
    this.graphics = new PIXI.Graphics();
    this.sprite.addChild(this.graphics);
    this.parent.addChild(this.sprite);
    this.element = this.sprite;
    var tmp = getSpriteActData(this.parent);
    this.actX = tmp[0];
    this.actY = tmp[1];
    this.actW = tmp[2];
    this.actH = tmp[3];
    this.Paint();
};

Arc.prototype.Paint = function(){
    this.sprite.position.x = this.x;
    this.sprite.position.y = this.y;
    this.sprite.width = (2/this.actW);
    this.sprite.height = (2/this.actH);
    this.paintArc();
};

Arc.prototype.paintArc = function(){
    this.graphics.clear();
    this.graphics.beginFill(this.color,this.alpha);
    this.graphics.lineStyle(this.borderWidth,this.borderColor,this.borderAlpha);
    this.graphics.moveTo(0,0);
    this.graphics.arc(0,0,this.r/2,this.startAngle,this.endAngle,false);
    this.graphics.endFill();
};

Arc.prototype.setArc = function(setData){
    this.r = setAttrData(setData.r,this.r);
    this.startAngle = setAttrData(setData.startAngle,this.startAngle);
    this.endAngle = setAttrData(setData.endAngle,this.endAngle);
    this.color = setAttrData(setData.color,this.color);
    this.alpha = setAttrData(setData.alpha,this.alpha);
    this.parent = setAttrData(setData.parent,this.parent);
    this.borderColor = setAttrData(setData.borderColor,this.borderColor);
    this.borderWidth = setAttrData(setData.borderWidth,this.borderWidth);
    this.borderAlpha = setAttrData(setData.borderAlpha,this.borderAlpha);
    if(setData.x || setData.y){
        this.x = setAttrData(setData.x,this.x);
        this.y = setAttrData(setData.y,this.y);
        this.Paint();
    }else{
        this.paintArc();
    }
};

Arc.prototype = mergeObj(Arc.prototype,widget.prototype);

/*
 * 创建input的控件，sprite是把input放在那框的位子，input是绝对定位
 * style为input的样式
 * parent为input在html中的dom父节点
 * 默认input有5px的padding
 * */
function kbInput(sprite,parent,style,type){
    this.sprite = sprite;
    this.style = style;
    this.parent = parent;
    this.type = type;
    this.init();
}

kbInput.prototype.init = function(){
    if(this.type){
        this.ipt = document.createElement(this.type);
    }else{
        this.ipt = document.createElement('input');
    }
    this.parent.appendChild(this.ipt);
    this.setStyle(this.style);
    this.updateSize();
};

kbInput.prototype.updateSize = function(){
    var tmp = getSpriteActData(this.sprite);
    this.set('left',(tmp[0])/resolute+'px');
    this.set('top',(tmp[1])/resolute+'px');
    this.set('width',tmp[2]/resolute-10+'px');
    this.set('height',tmp[3]/resolute-10+'px');
};

kbInput.prototype.setStyle = function(data){
    this.set('position',data.position);
    this.set('top',data.top);
    this.set('left',data.left);
    this.set('width',data.width);
    this.set('height',data.height);
    this.set('backgroundColor',data.backgroundColor);
    this.set('background',data.background);
    this.set('textAlign',data.textAlign);
    this.set('value',data.value);
    this.set('display',data.display);
    this.set('border',data.border);
    this.set('outline',data.outline);
    this.set('color',data.color);
    this.set('opacity',data.opacity);
    this.set('fontSize',data.fontSize);
    this.set('textAlign',data.textAlign);
    this.set('cursor',data.cursor);
};

kbInput.prototype.set = function(attr,data){
    if(data != undefined){
        this.ipt.style[attr] = data;
        this.style[attr] = data;
    }
};

kbInput.prototype.visible = function(flag){
    var display = flag ? 'block' : 'none';
    this.ipt.style.display = display;
};

kbInput.prototype.setRegex = function(regex,icon,parent){
    parent = parent ? parent : this.sprite;
    this.regexFunc = regex;
    this.trueIcon = new kbCanvasBg(1,.5,1,1,icon[0],parent);
    this.falseIcon = new kbCanvasBg(1,.5,1,1,icon[1],parent);
    pushScaleData(this.trueIcon.sprite);
    pushScaleData(this.falseIcon.sprite);
    this.trueIcon.sprite.anchor.set(0,.5);
    this.falseIcon.sprite.anchor.set(0,.5);
    this.trueIcon.visible(false);
    this.falseIcon.visible(false);
    var his = this;
    this.ipt.onblur = function(){
        his.actionRegex();
    }
};

kbInput.prototype.actionRegex = function(){
    var value = this.ipt.value;
    var flag = this.regexFunc(value);
    this.trueIcon.visible(flag);
    this.falseIcon.visible(!flag);
    return flag;
};
/*锁定input当flag为false时input不能输入，当flag为true时允许input输入*/
kbInput.prototype.lock = function(flag){
    this.ipt.disabled = !flag;
};

/*创建图片的控件*/
var imageParent = function(x,y,width,height,url,parent,flag){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.url = url;
    this.parent = parent;
    if(flag == 'img'){
        this.texture = new PIXI.Texture.fromImage(this.url);
    }else if(flag == 'canvas'){
        this.texture = new PIXI.Texture.fromCanvas(this.url);
    }
    this.baseTexture = new kbSprite(this.x,this.y,this.width,this.height,this.parent,this.texture);
    this.sprite = this.baseTexture.sprite;
    this.element = this.sprite;
    this.actW = this.texture.frame.width;
    this.actH = this.texture.frame.height;
    this.setX = this.baseTexture.setX;
    this.setY = this.baseTexture.setY;
    this.setWidth = this.baseTexture.setWidth;
    this.setHeight = this.baseTexture.setHeight;
};

imageParent.prototype.cut = function(x,y,width,height){
    var newY = y*this.height+this.y;
    var newX = x+this.x;
    var cutX = x*this.actW;
    var cutY = y*this.actH;
    var cutW = width*this.actW;
    var cutH = height*this.actH;
    this.sprite.texture.frame = new PIXI.Rectangle(cutX,cutY,cutW,cutH);
    this.sprite.position.x = newX;
    this.sprite.position.y = newY;
};

imageParent.prototype.resize = function(x,y,width,height){
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.width = width;
    this.sprite.height = height;
};

function kbImg(x,y,width,height,url,parent){
    widget.call(this);
    imageParent.call(this,x,y,width,height,url,parent,'img');
    this.element = this.sprite;
}

kbImg.prototype = mergeObj(kbImg.prototype,widget.prototype);

kbImg.prototype = mergeObj(kbImg.prototype,imageParent.prototype);

function kbCanvasBg(x,y,width,height,url,parent){
    widget.call(this);
    imageParent.call(this,x,y,width,height,url,parent,'canvas');
    this.element = this.sprite;
}

kbCanvasBg.prototype = mergeObj(kbCanvasBg.prototype,widget.prototype);

kbCanvasBg.prototype = mergeObj(kbCanvasBg.prototype,imageParent.prototype);

/*滑动按钮的控件*/
function kbSlider(x,y,width,height,color,func,parent,xy,xx,yy,url){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.func = func;
    this.parent = parent;

    /*
     xy用来判断是平行于X轴还是Y轴
     默认值为x轴，
     当参数为x,时为x轴；
     反之当参数为xy是为Y轴
     */
    this.xy = xy ? xy : 'x';

    /*
     xx和yy是滑动按钮的位置
     */
    this.xx = xx ? xx : 0;
    this.yy = yy ? yy : 0;

    /*
     * this.url用来判断是绘制按钮，还是用图片代替按钮
     * */
    this.url = url;
    this.createBg();
}

kbSlider.prototype = mergeObj(kbSlider.prototype,widget.prototype);

kbSlider.prototype.createBg = function(){
    var his = this;
    var sprite = new kbSprite(this.x,this.y,this.width,this.height,this.parent);
    this.sprite = sprite.sprite;
    this.element = this.sprite;
    if(this.xy == 'x'){
        boxBg();
        this.Bg = new kbBoxBg(this.xx,0,0,1,0x2d3521,this.sprite);
    }else if(this.xy == 'y' && !this.url){
        this.Bg = new kbBoxBg(this.xx,this.yy,1,0,0x2d3521,this.sprite);
    }else if(this.xy == 'y' && this.url){
        boxBg();
        this.Bg = new kbBoxBg(this.xx,this.yy,1,1-this.yy,0x2d3521,this.sprite);
        this.Bg.setRadius(.5);
    }
    this.paintButton();
    function boxBg(){
        if(typeof his.color == 'number'){
            his.boxBg = new kbBoxBg(0,0,1,1,his.color,his.sprite,true);
            his.boxBg.setRadius(.5);
        }else if(typeof his.color == 'string'){
            his.boxBg = new kbImg(0,0,1,1,his.color,his.sprite);
        }
    }
};

kbSlider.prototype.paintButton = function(){
    var his = this;
    if(this.xy == 'x' && !this.url){
        this.button = new kbRingButton(this.xx,.5,staticDataColor.slider.buttonColor1,staticDataColor.slider.buttonColor2,this.sprite);
    }else if(this.xy == 'x' && typeof this.url == 'string'){
        buttonImage(1.3);
        his.button.sprite.anchor.set(.5);
        this.boxBg.sprite.rotate = Math.PI/2;
    }else if(this.xy == 'x' && typeof(this.url) == 'object'){
        buttonImage(1.3);
        his.button.sprite.anchor.set(.5);
        this.boxBg.sprite.rotate = Math.PI/2;
    } else if(this.xy == 'y' && !this.url){
        this.button = new kbRingButton(.5,this.yy,staticDataColor.slider.buttonColor1,staticDataColor.slider.buttonColor2,this.sprite);
    }else if(this.xy == 'y' && this.url instanceof kbSprite){
        this.sprite.addChild(this.url.sprite);
        this.button = this.url;
    }else if(this.xy == 'y' && typeof(this.url) == 'string'){
        buttonImage(1.35);
        his.button.sprite.anchor.set(.5,.45);
    }else if(this.xy == 'y' && typeof(this.url) == 'object'){
        buttonImage(1.35);
        his.button.sprite.anchor.set(.5);
    }

    if(this.button.eventElement){
        this.move(this.button.eventElement);
    }else{
        this.move(this.button.sprite);
    }


    function buttonImage(scale){
        his.button = new kbImg(.5,his.yy,1,1,his.url,his.sprite);
        pushScaleData(his.button.sprite,{width:1/scale,height:1/scale});
    }
};

kbSlider.prototype.move = function(eventElement){
    eventElement.interactive = true;
    eventElement.buttonMode = true;
    if(this.xy == 'x'){
        eventElement.on('mousedown', onDragStartX);
        eventElement.on('touchstart', onDragStartX);
        eventElement.on('mousemove', onDragMoveX);
        eventElement.on('touchmove', onDragMoveX);
    }else if(this.xy == 'y'){
        eventElement.on('mousedown', onDragStartY);
        eventElement.on('touchstart', onDragStartY);
        eventElement.on('mousemove', onDragMoveY);
        eventElement.on('touchmove', onDragMoveY);
    }

    eventElement.on('mouseup', onDragEnd);
    eventElement.on('mouseupoutside', onDragEnd);
    eventElement.on('touchend', onDragEnd);
    eventElement.on('touchendoutside', onDragEnd);

    var his = this;
    function onDragStartX(event){
        his.dragFlag = true;
        if(his.stopProp)event.stopPropagation();
        his.startFunc && his.startFunc(his);
        his.event = event.data;
        his.startX = his.event.getLocalPosition(his.sprite).x;
        his.styleX = his.button.sprite.position.x;
        his.timer = setInterval(function(){
            if(his.old != his.newX){
                his.sendData();
            }
            his.old = his.newX;
        },GLOBAL.setIntervalTime);
    }
    function onDragEnd(){
        his.dragFlag = false;
        clearInterval(his.timer);
        his.endFunc && his.endFunc(his);
    }
    function onDragMoveX(){
        if(his.dragFlag){
            var newXPer = his.event.getLocalPosition(his.sprite).x;
            newXPer = newXPer-his.startX+his.styleX;
            newXPer = boundaryValue(newXPer,0,1);
            if(his.newX && his.step && Math.abs(his.newY-newXPer) < his.step && newXPer > his.stepMin && newXPer < his.stepMax){
                return;
            }
            his.newX = newXPer;
            if(his.range)his.newX = boundaryValue(his.newX,his.range.min,his.range.max);
            if(his.relate && his.relate.length > 1){
                var len = his.relate.length;
                for(var i=0;i<len;i++){
                    his.relate[i].setX(his.newX);
                }
            }else{
                his.setX(his.newX);
            }
            his.updateData(his.newX);
        }
    }
    function onDragStartY(event){
        his.dragFlag = true;
        if(his.stopProp)event.stopPropagation();
        his.startFunc && his.startFunc(his);
        his.event = event.data;
        his.startY = his.event.getLocalPosition(his.sprite).y;
        his.styleY = his.button.sprite.position.y;
        his.timer = setInterval(function(){
            if(his.old != his.newY){
                his.sendData();
            }
            his.old = his.newY;
        },GLOBAL.setIntervalTime);
    }
    function onDragMoveY(){
        if(his.dragFlag){
            var newYPer = his.event.getLocalPosition(his.sprite).y;
            newYPer = newYPer-his.startY+his.styleY;
            newYPer = boundaryValue(newYPer,0,1);
            if(his.newY && his.step && Math.abs(his.newY-newYPer) < his.step && newYPer > his.stepMin && newYPer < his.stepMax){
                return;
            }
            his.newY = newYPer;
            if(his.range)his.newY = boundaryValue(his.newY,his.range.min,his.range.max);
            if(his.relate && his.relate.length > 1){
                var len = his.relate.length;
                for(var i=0;i<len;i++){
                    his.relate[i].setY(his.newY);
                }
            }else{
                his.setY(his.newY);
            }
            his.updateData(his.newY);

        }
    }
};

kbSlider.prototype.setStep = function(step,min,max){
    this.step = step;
    this.stepMin = min ? min : 0;
    this.stepMax = max ? max : 1;
};

kbSlider.prototype.setStartFunc = function(func){
    this.startFunc = func;
};

kbSlider.prototype.setEndFunc = function(func){
    this.endFunc = func;
};

kbSlider.prototype.updateData = function(data){
    if(this.updateDataFlag)this.data[this.dataAttr] = this.formula(data);
    if(this.func){
        this.updateDataFlag ? this.func(data,this.data[this.dataAttr],this) : this.func(data,this);
    }
};

kbSlider.prototype.setRange = function(range){
    this.range = range;
};

kbSlider.prototype.setX = function(per){
    this.button.sprite.position.x = per;
    if(this.Bg){
        this.Bg.setWidth(per-this.xx);
    }
    this.render();
};

kbSlider.prototype.setY = function(per){
    if(this.buttonY != per){
        this.buttonY = per;
        this.button.sprite.position.y = per;
    }
    if(this.Bg) {
        this.Bg.setHeight(1 - per - this.yy);
        this.Bg.setY(per);
    }
    this.render();
};

kbSlider.prototype.update = function(noFuncFlag,noSetSend){
    if(this.updateDataFlag){
        var data = this.formula(this.data[this.dataAttr],true);
        if(!noSetSend)this.sendOldData = this.data[this.dataAttr];
        this.xy == 'x' && this.setX(data);
        this.xy == 'y' && this.setY(data);
        if(!noFuncFlag && this.func)this.func(data,this.data[this.dataAttr],this);
    }
};

kbSlider.prototype.setBgAlpha = function(alpha){
    this.boxBg.setAlpha(alpha);
};
/*阻止冒泡事件*/
kbSlider.prototype.stopPropagation = function(){
    this.stopProp = true;
};
/*允许冒泡事件*/
kbSlider.prototype.startPropagation = function(){
    this.stopProp = false;
};

kbSlider.prototype.onScroll = function(sprite){
    var his = this;
    sprite.interactive = true;
    sprite.on('mouseover',function(){
        setTimeout(function(){
            scrollFuncEvent = onScrollEvent;
        },5)
    });
    sprite.on('mouseout',function(){
        scrollFuncEvent = undefined;
    });
    function onScrollEvent(t){
        if(his.xy == 'y'){
            his.newY = his.button.sprite.position.y+t*.03;
            his.newY = boundaryValue(his.newY,0,1);
            if(his.relate && his.relate.length > 1){
                var len = his.relate.length;
                for(var i=0;i<len;i++){
                    his.relate[i].setY(his.newY);
                }
            }else{
                his.setY(his.newY);
            }
            his.updateData(his.newY);
            if(his.old != his.newY){
                his.sendData();
                his.old = his.newY;
            }
        }else if(his.xy == 'x'){
            his.newX = his.button.sprite.position.x-t*.03;
            his.newX = boundaryValue(his.newX,0,1);
            if(his.relate && his.relate.length > 1){
                var len = his.relate.length;
                for(var i=0;i<len;i++){
                    his.relate[i].setX(his.newX);
                }
            }else{
                his.setX(his.newX);
            }
            his.updateData(his.newX);
            if(his.old != his.newX){
                his.sendData();
                his.old = his.newX;
            }
        }
    }
};
/*slider锁*/
kbSlider.prototype.lock = function(flag){
    this.button.sprite.interactive = flag;
};

/*slider按钮的控件，
 color1为内圆的颜色，
 color2为外圆的颜色
 * */
function kbRingButton(x,y,color1,color2,parent,r1,r2,alpha1,alpha2){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.color1 = color1;
    this.color2 = color2;
    this.parent = parent;
    this.alpha1 = setAttrData(alpha1,1);
    this.alpha2 = setAttrData(alpha2,1);
    /*
     r1位内圆的半径，r2位外圆的半径
     如果没有设置内圆或者外圆的半径，那么内圆的半径就为parent小的那一边的半径，外圆的半径就为parent小的那一边的直径
     */
    var tmp = getSpriteActData(this.parent);
    var min;
    if(tmp[2] > tmp[3]){
        min = tmp[3];
    }else{
        min = tmp[2];
    }
    if(!r1 || !r2){
        this.r1 = min/2;
        this.r2 = min;
    }else{
        this.r1 = r1;
        this.r2 = r2;
    }
    this.createSprite(tmp[2],tmp[3]);
}

kbRingButton.prototype.createSprite = function(W,H){
    //this.sprite = new kbSprite(this.x,this.y,1/W,1/H,this.parent);
    this.graphics = new PIXI.Graphics();
    this.graphics.x = this.x;
    this.graphics.y = this.y;
    //this.sprite.sprite.addChild(this.graphics);
    this.element = this.graphics;
    this.paint();
    this.parent.addChild(this.graphics);
    pushScaleData(this.graphics,{width:1,height:1});
};

kbRingButton.prototype.paint = function(){
    this.graphics.beginFill(this.color2,this.alpha2);
    this.graphics.drawCircle(0,0,this.r2);
    this.graphics.beginFill(this.color1,this.alpha1);
    this.graphics.drawCircle(0,0,this.r1);
    this.graphics.endFill();
};

kbRingButton.prototype.setBorder = function(r,width,color,alpha){
    this.graphics.beginFill();
    this.graphics.lineStyle(width,color,alpha);
    this.graphics.fillAlpha = 0;
    this.graphics.drawCircle(0,0,r);
    this.graphics.endFill();
};

kbRingButton.prototype.setX = function(x){
    this.x = x;
    this.graphics.x = this.x;
};

kbRingButton.prototype.setY = function(y){
    this.y = y;
    this.sprite.y = this.y;
};

kbRingButton.prototype = mergeObj(kbRingButton.prototype,widget.prototype);

/*选项卡的控件
 * title为选项卡的按钮，是一个数组，里面是按钮内容，如：titleText = ['dot1','dot2','dot3','dot4'];，
 * titleStyle为选项卡按钮的样式，包括按钮里面文字的样式，如：
 *  titleStyle = {width :.1,height :.1,color : 0xFFFFFF,lineColor : 0x000000,fontColor : 'green',fontSize : '8pt'};
 * contentFunc为创建content的函数
 * */
function kbTab(title,titleStyle,parent,content,func){
    this.parent = parent;
    this.title = title;
    this.titleStyle = titleStyle;
    this.content = content;
    this._content = content;
    this.func = func;
    this.init();
}

kbTab.prototype.init = function(){
    this.titleButton();
    this.setContent();
};

kbTab.prototype.titleButton = function(){
    var his = this,button;
    var len = this.title.length;
    this.tabButton = new Array(len);
    var x = this.titleStyle.x;
    var width = this.titleStyle.width;
    var height = this.titleStyle.height;
    var images = this.titleStyle.images;

    var buttonWidth = this.titleStyle.buttonWidth;
    this.sprite = new kbSprite(x,-height,width,height,this.parent);

    var tmp = getSpriteActData(this.sprite.sprite),actW = tmp[2],actH = tmp[3];
    this.tabBottomLine = new kbBoxBg(-x/width,1,1/width,5/tmp[3],0x185221,this.sprite.sprite);
    var buttonActSpace = this.titleStyle.buttonSpace ? this.titleStyle.buttonSpace : 16,
        buttonSpace = buttonActSpace/actW;
    var space = this.titleStyle.space ? this.titleStyle.space : 5/actW;
    var buttonY = 2/actH,buttonH = 1-buttonY;
    if(!buttonWidth) {
        buttonWidth = new Array(len);
        for (var i = 0; i < len; i++) {
            buttonWidth[i] = (1 - space * len) / len;
        }
    }

    var backgroup = new PIXI.Graphics();
    his.sprite.sprite.addChild(backgroup);
    pushScaleData(backgroup);
    paintBackground(actW);

    paintButton(his.title);

    function paintBackground(width){
        backgroup.clear();
        backgroup.beginFill(0x121216);
        backgroup.moveTo(0,actH);
        backgroup.arcTo(0,0,actH,0,7);
        backgroup.arcTo(width-buttonActSpace,0,width,actH,8);
        backgroup.lineTo(width+1,actH);
        backgroup.endFill();
    }

    function paintButton(text){
        his.tabButton = [];
        var buttonX = space/2;
        for(var i= 0,len=text.length;i<len;i++){
            if(i == 0){
                button = new kbButton(buttonX,buttonY,buttonWidth[i],buttonH,[images[0],images[1]],text[i],['#b1b1b1','#FFFFFF'],'18px',his.sprite.sprite);
                drawButtonLeft(0,i,button);
            }else{
                button = new kbButton(buttonX-buttonSpace,buttonY,buttonWidth[i]+buttonSpace,buttonH,[images[2],images[3]],text[i],['#b1b1b1','#FFFFFF'],'18px',his.sprite.sprite);
                drawButtonLeft(.17,i,button);
            }
            buttonX += buttonWidth[i]+space;
            his.tabButton[i] = button;
        }
    }

    function drawButtonLeft(xx,i,parent){
        var g = new PIXI.Graphics();
        g.beginFill(0x123123,0);
        g.moveTo(xx,1);
        g.lineTo(0,.1);
        g.arcTo(0,0,.1,0,.1);
        g.lineTo(.5,0);
        g.arcTo(.85,0,.85,.3,.1);
        g.lineTo(1,1);
        g.lineTo(0,1);
        g.endFill();
        parent.sprite.addChild(g);
        g.interactive = true;
        g.buttonMode = true;
        g.on('mousedown',gEvent);
        g.on('touchstart',gEvent);
        function gEvent(){
            his.switchBg(i);
            window.appRender();
        }
    }

    this.dispearTab = [];
    this.setTabDispear = function(attr,switchText){
        attr instanceof Array ? attr : attr = [attr];
        if(!equalArray(this.dispearTab,attr)){
            this.dispearTab = attr;
            this.content = [];
            var backW = 0,text = [],count = 0;
            for(var i= 0,len=this.title.length;i<len;i++){
                if(inArray(attr,i)){
                    this._content[i].visible = false;
                }else{
                    text.push(his.title[i]);
                    backW = backW + buttonWidth[count]+space;
                    this.content.push(this._content[i]);
                    count ++;
                }
            }
            backW *= actW;
            paintBackground(backW);
            for(i=0,len=his.tabButton.length;i<len;i++){
                his.sprite.sprite.removeChild(his.tabButton[i].sprite);
            }
            text = switchText ? switchText : text;
            paintButton(text);
        }
    }
};

kbTab.prototype.switchBg = function(i){
    for(var j= 0,len=this.tabButton.length;j<len;j++){
        if(j == i){
            this.tabButton[j].setColor(this.tabButton[j].textureRep);
            this.tabButton[j].text.setColor('#FFFFFF');
            this.contentDisplay(j);
            this.func && this.func(j);
        }else{
            this.tabButton[j].setColor(this.tabButton[j].textureDef);
            this.tabButton[j].text.setColor('#b1b1b1');
            this.contentDispear(j);
        }
    }
};

kbTab.prototype.setContent = function(){
    var len = this.content.length;
    for(var i=0;i<len;i++){
        if(i==0){
            this.contentDisplay(i);
        }else{
            this.contentDispear(i);
        }
    }
};

kbTab.prototype.contentDispear = function(i){
    this.content[i].visible = false;
};

kbTab.prototype.contentDisplay = function(i){
    this.content[i].visible = true;
};

kbTab.prototype.resize = function(x,y,width,height){
    this.sprite.resize(x,y,width,height);
    this.tabBottomLine.setWidth(1/width);
};

/*
 * 创建开关的控件，
 * backGround为背景，button为开关上的按钮
 *new switcher(0,0,1,1,0x123123,1,0xFFFFFF,1,sp.sprite,.1,2,0xFFFFFF,1);
 * */
function switcher(x,y,width,height,backGroundColor,backGroundAlpha,buttonColor,buttonAlpha,parent,radius,borderWidth,borderColor,borderAlpha){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.background = backGroundColor;
    this.backgroundAlpha = backGroundAlpha;
    this.buttonColor = buttonColor;
    this.buttonAlpha = buttonAlpha ? buttonAlpha : 1;
    this.parent = parent;
    this.radius = radius;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.borderAlpha = borderAlpha;
    this.paint();
}

switcher.prototype.setBackground = function(background,alpha,radius,borderWidth,borderColor,borderAlpha){
    if(typeof background == 'string'){
        this.backgroundImg = PIXI.Texture.fromImage(background);
    }else{
        this.background = background;
        this.backgroundAlpha = alpha;
        this.radius = radius;
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;
        this.borderAlpha = borderAlpha;
    }
};

switcher.prototype.setButton = function(background,alpha){
    if(typeof background == 'string'){
        this.buttonBackground = PIXI.Texture.fromImage(background);
    }else{
        this.buttonBackground = background;
        this.buttonAlpha = alpha;
    }
};

switcher.prototype.paint = function(){
    this.sprite = new kbSprite(this.x,this.y,this.width,this.height,this.parent);
    this.boxBg = new kbBoxBg(0,0,1,1,this.background,this.sprite.sprite,this.backgroundAlpha);
    this.boxBg.setBorder(this.borderWidth,this.borderColor,this.borderAlpha,true);
    this.boxBg.setRadius(this.radius);
    this.element = this.boxBg.graphics;
    this.paintButton();
};

switcher.prototype.paintButton = function(){
    var tmp = getSpriteActData(this.sprite.sprite);
    var actW = tmp[2];
    var actH = tmp[3];
    this.buttonR = .5;
    var m = actH/actW;
    this.buttonRightX = 1-m/2;
    this.buttonLeftX = m/2;
    this.buttonY = .5;
    this.button = new Circle(this.buttonRightX,this.buttonY,this.buttonR,this.buttonBackground,this.sprite.sprite,this.buttonAlpha,'y');
};

switcher.prototype.switch = function(colorDown,alphaDown){
    if(typeof colorDown == 'string'){
        this.backgroundImgDown = PIXI.Texture.fromImage(colorDown);
    }else{
        this.backgroundDown = colorDown;
        this.backgroundAlphaDown = alphaDown;
    }
    this.boxBg.interactive(true);
    this.onEvent('mousedown',buttonClick);
    this.onEvent('touchstart',buttonClick);
    var his = this;
    this.status = true;
    function buttonClick(){
        his.switchStatus();
    }
};

switcher.prototype.switchStatus = function(flag){
    this.status = arguments.length !=0 ? flag : !this.status;
    var bgAttr = {},x;
    if(!this.status){
        x = this.buttonLeftX;
        if(this.backgroundImgDown){
            this.sprite.texture = this.backgroundImgDown;
        }
        bgAttr.backGroundColor = this.backgroundDown;
        bgAttr.alpha = this.backgroundAlphaDown;
    }else{
        x = this.buttonRightX;
        if(this.backgroundImg){
            this.sprite.texture = this.backgroundImg;
        }
        bgAttr.backGroundColor = this.background;
        bgAttr.alpha = this.backgroundAlpha;
    }
    if(this.colorDown){
        this.boxBg.setAttr(bgAttr);
    }
    this.button.setX(x);
};

switcher.prototype.resize = function(){
    this.button.resize('y');
};

switcher.prototype = mergeObj(switcher.prototype,widget.prototype);

/*
 * 创建滚动条的控件，boxBg为滚动条背景的数据，scroll时滚动条的数据
 * 通过设置setX或者setY来控制滚动的位置，0位原点，1为最末尾
 * */
function kbScrollBar(boxBg,parent,scroll){
    widget.call(this);
    this.boxBg = boxBg;
    this.parent = parent;
    this.scrollData = scroll;
    this.paintBox();
}

kbScrollBar.prototype.paintBox = function(){
    this.sprite = new kbSprite(this.boxBg.x,this.boxBg.y,this.boxBg.width,this.boxBg.height,this.parent);
    this.element = this.sprite.sprite;
    this.spriteBg = new kbBoxBg(0,0,1,1,this.boxBg.color,this.sprite.sprite,this.boxBg.alpha,true);
    this.spriteBg.setBorder(this.boxBg.borderWidth,this.boxBg.borderColor,this.boxBg.borderAlpha,true);
    this.spriteBg.setRadius(this.boxBg.radius);
    this.paintScrollBar();
};

kbScrollBar.prototype.paintScrollBar = function(){
    this.scrollBar = new kbSprite(this.scrollData.x,this.scrollData.y,this.scrollData.width,this.scrollData.height,this.sprite.sprite);
    this.scrollBarBg = new kbBoxBg(0,0,1,1,this.scrollData.color,this.scrollBar.sprite,this.scrollData.alpha,true);
    this.scrollBarBg.setBorder(this.scrollData.borderWidth,this.scrollData.borderColor,this.scrollData.borderAlpha,true);
    this.scrollBarBg.setRadius(this.scrollData.radius);
    var tmp = getSpriteActData(this.scrollBar.sprite);
    var lineW = 1/tmp[2],
        lineSpace = 10/tmp[2];
    this.lineArray = new Array(3);
    var line = new kbLine(.5-lineSpace,0,.5-lineSpace,1,0xFFFFFF,this.scrollBar.sprite,lineW);
    this.lineArray[0] = line;
    line = new kbLine(.5,0,.5,1,0xFFFFFF,this.scrollBar.sprite,lineW);
    this.lineArray[1] = line;
    line = new kbLine(.5+lineSpace,0,.5+lineSpace,1,0xFFFFFF,this.scrollBar.sprite,lineW);
    this.lineArray[2] = line;
};

kbScrollBar.prototype.setX = function(x){
    this.scrollData.x = x;
    var x = (1 - this.scrollData.width)*x;
    this.scrollBar.setX(x);
};

kbScrollBar.prototype.setY = function(y){
    this.scrollData.y = y;
    var y = (1 - this.scrollData.height)*y;
    this.scrollBar.setY(y);
};

kbScrollBar.prototype.setWidth = function(width){
    this.scrollData.width = width;
    this.scrollBar.setWidth(width);
    var tmp = getSpriteActData(this.scrollBar.sprite);
    var lineWidth = 1/tmp[2],
        lineSpace = 10/tmp[2];
    for(var i = 0,len = this.lineArray.length;i<len;i++){
        this.lineArray[i].setWidth(lineWidth);
        this.lineArray[i].setX(.5-lineSpace+lineSpace*i);
    }
    if(this.scrollData.radius){
        this.scrollBarBg.parentActW = null;
        this.scrollBarBg.setRadius(this.scrollData.radius);
    }
};

kbScrollBar.prototype.setHeight = function(height){
    this.scrollData.height = height;
    this.scrollBar.setHeight(height);
};

kbScrollBar.prototype.display = function(){
    this.sprite.renderable(true);
};

kbScrollBar.prototype.dispear = function(){
    this.sprite.renderable(false);
};

kbScrollBar.prototype = mergeObj(kbScrollBar.prototype,widget.prototype);

/*
 * 创建播放按钮player,当调用switch函数的时候就可以实现点击切换模式
 * func是外部调用烦人函数，将返回一个布尔值，true表示播放，false表示暂停
 * */
function playButton(x,y,width,height,backGroundColor,color,parent,alpha1,alpha2){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.backGroundColor = backGroundColor;
    this.color = color;
    this.parent = parent;
    this.alpha1 = setAttrData(alpha1,0);
    this.alpha2 = setAttrData(alpha2,1);
    this.paintBox();
}

playButton.prototype.paintBox = function(){
    this.sprite = new kbSprite(this.x,this.y,this.width,this.height,this.parent);
    new Circle(.5,.5,.5,this.backGroundColor,this.sprite.sprite,this.alpha1);
    this.element = this.sprite.sprite;
    this.paintPlayer();
};

playButton.prototype.paintPlayer = function(){
    this.line1 = new kbLine(.4,.2,.4,.8,this.color,this.sprite.sprite,.1);
    this.line2 = new kbLine(.6,.2,.6,.8,this.color,this.sprite.sprite,.1);
    var attr = [{x:.3,y:.2},{x:.7,y:.5},{x:.3,y:.8}];
    this.stopBnt = new kbPolygon(attr,this.color,this.color,this.alpha2,this.sprite.sprite);
    this.play(false);
};

playButton.prototype.play = function(flag){
    this.line1.renderable(flag);
    this.line2.renderable(flag);
    this.stopBnt.renderable(!flag);
};

playButton.prototype.switch = function(func){
    var flag = true;
    this.interactive(true);
    this.onEvent('mousedown',switchPlyerFunc);
    this.onEvent('touchstart',switchPlyerFunc);
    var his = this;
    function switchPlyerFunc(){
        his.play(flag);
        if(func){
            func(flag);
        }
        flag = !flag;
    }
};

playButton.prototype = mergeObj(playButton.prototype,widget.prototype);

/*
 * lineMove是一个水平方向移动的动画，
 * obj是移动的对象，一般为一个sprite或者graphics,
 * time为移动到目的的时间，以毫秒为单位，
 * freq是刷新的频率，不得超过页面的刷新频率
 * startStatus，endStatus分别为开始和结束时的状态；
 * */
function lineMove(obj,time,xy){
    this.obj = obj;
    this.time = time;
    this.xy = xy;
    this.loopTime = 60
    if(this.xy == 'y'){
        this.move = this.moveY;
    }else{
        this.move = this.moveX;
    }
}

lineMove.prototype.action = function(startStatus,endStatus){
    this.startStatus = startStatus;
    this.endStatus = endStatus;
    this.space = (this.endStatus-this.startStatus)/(this.time/this.loopTime);
    this.status = this.startStatus;
    var his = this;
    clearInterval(this.timer);
    this.timer = setInterval(function(){
        his.move();
    },this.loopTime);
};

lineMove.prototype.moveX = function(){
    this.status += this.space;
    if(this.startStatus <= this.endStatus && this.status >= this.endStatus){
        this.status = this.endStatus;
        clearInterval(this.timer);
    }else if(this.startStatus >= this.endStatus && this.status <= this.endStatus){
        this.status = this.endStatus;
        clearInterval(this.timer);
    }
    this.obj.position.x = this.status;
};

lineMove.prototype.moveY = function(){
    this.status += this.space;
    if(this.startStatus <= this.endStatus && this.status >= this.endStatus){
        this.status = this.endStatus;
        clearInterval(this.timer);
    }else  if(this.startStatus >= this.endStatus && this.status <= this.endStatus){
        this.status = this.startStatus;
        clearInterval(this.timer);
    }
    this.obj.position.y = this.status;
};

/*
 * switchArraw是一个创建箭头的函数，count表示箭头旋转的角度，
 * 当count=0是表示箭头朝上，依次为1，2，3，右，下，左
 * */
function switchArraw(x,y,width,height,parent,count,lineWidth,lineColor,lineAlpha,img){
    widget.call(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.parent = parent;
    this.lineWidth = setAttrData(lineWidth,1);
    this.lineColor = setAttrData(lineColor,0x000000);
    this.lineAlpha = setAttrData(lineAlpha,1);
    this.rotate = count*Math.PI/2;
    this.buttonOpenImage = PIXI.Texture.fromImage(img[0]);
    this.buttonCloseImage = PIXI.Texture.fromImage(img[1]);
    this.status = true;
    this.init();
}

switchArraw.prototype.init = function(){
    this.sprite = new kbSprite(this.x,this.y,this.width,this.height,this.parent,this.buttonOpenImage);
    //if(this.backgroundImage && this.buttonImage){
        //new kbImg(0,0,1,1,this.backgroundImage,this.sprite.sprite);
    //}
    //this.graphics = new PIXI.Graphics();
    //this.sprite.sprite.addChild(this.graphics);
    this.element = this.sprite.sprite;
    this.paint();
};

switchArraw.prototype.paint = function(){
    //this.graphics.beginFill(0x000000,0);
    //this.graphics.lineStyle(this.lineWidth,this.lineColor,this.lineAlpha);
    //this.graphics.moveTo(-.2, .2);
    //this.graphics.lineTo(0, -.3);
    //this.graphics.moveTo(0, -.3);
    //this.graphics.lineTo(.2,.2);
    //this.graphics.endFill();
    //this.graphics.position.x = .5;
    //this.graphics.position.y = .5;
    //this.graphics.rotation = this.rotate;
    //this.button = new kbImg(.05,0,.9,1,this.buttonImage,this.sprite.sprite);
};

switchArraw.prototype.switch = function(i){
    //this.rotate = i*Math.PI/2;
    //this.graphics.rotation = this.rotate;
    if(this.status){
        this.sprite.sprite.texture = this.buttonCloseImage;
    }else{
        this.sprite.sprite.texture = this.buttonOpenImage;
    }
    this.status = ! this.status;
};

switchArraw.prototype = mergeObj(switchArraw.prototype,widget.prototype);

function kbWifiSignal(x,y,width,height,parent,strength){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.parent = parent;
    this.strength = strength;
    this.paint();
}

kbWifiSignal.prototype.paint = function(){
    this.sprite = new kbSprite(this.x,this.y,this.width,this.height,this.parent);
    this.element = this.sprite.sprite;
    this.graphics = new PIXI.Graphics();
    this.sprite.sprite.addChild(this.graphics);
    this.paintGraphics();
};

kbWifiSignal.prototype.paintGraphics = function(){
    this.graphics.clear();
    this.graphics.beginFill(0xFFFFFF);
    this.graphics.lineStyle(0xFFFFFF,2,1);
    this.graphics.drawCircle(.5,1,.1);
    for(var i=1;i<=3;i++){
        if(i >= this.strength){
            this.graphics.lineStyle(0xFFFFFF,2,.5);
        }
        this.graphics.moveTo(0,1);
        this.graphics.arc(.5,1,.5, Math.PI, 0, false);
        this.graphics.lineTo(1,1);
    }
    this.graphics.endFill();

};

kbWifiSignal.prototype = mergeObj(kbWifiSignal.prototype,widget.prototype);

function kbWiteIcon(scale,parent,lineCount){
    this.scale = scale;
    this.parent = parent;
    this.lineCount = lineCount ? lineCount : 8;
    this.selected = -1;
    this.init();
    this.paint();
}

kbWiteIcon.prototype.init = function(){
    this.graphics = [];
    for(var i=0;i<this.lineCount;i++){
        this.graphics[i] = new PIXI.Graphics();
        this.parent.addChild(this.graphics[i])
    }
};

kbWiteIcon.prototype.paint = function(){
    for(var i=0;i<this.lineCount;i++){
        this.graphics[i].clear();
        this.graphics[i].beginFill();
        var alpha = this.selected == i ? .3 : 1;
        this.graphics[i].lineStyle(1,0xFFFFFF,alpha);
        this.graphics[i].moveTo(0,-1.5*this.scale);
        this.graphics[i].lineTo(0,-3*this.scale);
        this.graphics[i].endFill();
        this.graphics[i].rotation = i*Math.PI/4;
    }
};

kbWiteIcon.prototype.setEvent = function(){
    var his = this;
    this.timer = setInterval(function(){
        his.selected += 1;
        if(his.selected == his.lineCount){
            his.selected = 0;
        }
        his.paint();
    },100);
};

kbWiteIcon.prototype.display = function(){
    var his = this;
    this.parent.visible = true;
    clearInterval(this.timer);
    this.timer = setInterval(function(){
        his.selected += 1;
        if(his.selected == his.lineCount){
            his.selected = 0;
        }
        his.paint();
    },100);
};

kbWiteIcon.prototype.dispear = function(){
    this.parent.visible = false;
    clearInterval(this.timer);
};

kbWiteIcon.prototype.removeEvent = function(){
    clearInterval(this.timer);
    this.selected = -1;
};

function kbMessage(data){
    this.data = data ? data : {};
    this.paintBox();
    this.paintTitle();
    !this.data.noContent && this.paintContent();
    !this.data.noButton &&　this.paintButton();
    this.Dispear();
}

kbMessage.prototype.paintBox = function(){
    var boxPos = staticDataLocal.message.box;
    this.box = new kbSprite(boxPos.x,boxPos.y,boxPos.width,boxPos.height,ctx.stage);
    !this.data.noAutoClose && GLOBAL.dispearPopup.push(this.box);
    this.bg = new kbBoxBg(0,0,1,1,0x373740,this.box.sprite,true);
    this.bg.setBorder(1,0x000000,1,true);
    this.bg.setRadius(.04);
};

kbMessage.prototype.paintTitle = function(){
    var titleHeight = staticDataLocal.message.titleHeight,textTitle = this.data.title ? this.data.title : '提示';
    popupTitleGraphics(titleHeight,0x22222b,.05,this.box.sprite);
    this.title = new kbBoxText(.5,titleHeight/2,textTitle,'#b1b1b1','16px',this.box.sprite,.5);
};

kbMessage.prototype.paintContent = function(){
    var content = this.data.content ? this.data.contnet : '';
    this.content = new kbBoxText(.5,.5,content,'#b1b1b1','14px',this.box.sprite,.5);
    this.content.ellipsis(staticDataLocal.message.box.width)
};

kbMessage.prototype.paintButton = function(){
    var buttonImg = GLOBAL.sureButtonImg,his = this,len = this.data.buttonLen ? this.data.buttonLen : 1,
        width,space,text = this.data.content ? this.data.content : [{ch : '确定',en : 'OK'}];
    switch(len){
        case 0 :
            return;
        case 1 :
            space = .3;
            break;
        case 2 :
            space = .15;
            break;
        case 3 :
            space = .1;
            break;
    }
    width = (1-(len+1)*space)/len;
    this.buttonArray = [];
    for(var i=0;i<len;i++){
        var button = new kbButton(space,.65,width,.25,buttonImg,text[i],['#a8a8a8','#ebf8ed'],'16px',this.box.sprite);
        button.bounce();
        button.switchColor(surEvent);
        button.index = i;
        this.buttonArray[i] = button;
        space += width+space;
    }

    function surEvent(button){
        var index = button.index;
        if(!his.eventFunc)return;
        if(his.eventFunc[index])his.eventFunc[index](button);
    }
};

kbMessage.prototype.Display = function(noRender){
    this.box.visible(true);
    if(!noRender && window.appRender)window.appRender();
};

kbMessage.prototype.Dispear = function(noRender){
    this.box.visible(false);
    if(!noRender && window.appRender)window.appRender();
};

kbMessage.prototype.setContent = function(data){
    data.text && this.content.setText(data.text);
    data.title && this.title.setText(data.title);
};

kbMessage.prototype.setEvent = function(func){
    this.eventFunc = func instanceof Array ? func : [func];
};
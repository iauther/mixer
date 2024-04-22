/*创建messageBox控件*/
var messageBox = function(initData){
    this.x = initData.x;
    this.y = initData.y;
    this.width = initData.width;
    this.height = initData.height;
    this.color = initData.color;
    this.alpha = initData.alpha;
    this.parent = initData.parent;
    this.borderColor = initData.borderColor;
    this.borderWidth = initData.borderWidth;
    this.borderAlpha = initData.borderAlpha;
    this.autoOpen = initData.autoOpen;
    this.closeOnEscpe = initData.closeOnEscpe;
    this.diaggable = initData.diaggable;
    this.modal = initData.modal;
    this.buttonArray = [];
    if(this.modal){
        this.setMode();
    }
    this.Paint();
};

messageBox.prototype.setMode = function(){
    this.modalBox = new kbSprite(0,0,this.parent.width,this.parent.height,this.parent);
    new kbBoxBg(0,0,1,1,0x000000,this.modalBox.sprite,.5);
};

messageBox.prototype.Paint = function(){
    this.box = new kbSprite(this.x,this.y,this.width,this.height,this.parent);
    this.boxBg = new kbBoxBg(0,0,1,1,this.color,this.box.sprite,this.alpha);
    this.boxBg.setBorder(this.borderWidth,this.borderColor,this.borderAlpha);
    if(this.autoOpen == true){
        this.Display();
    }else{
        this.Dispear();
    }
    if(this.closeOnEscpe == true){
        this.Esc();
    }
};

messageBox.prototype.setBoxAttr = function(setData){
    this.box.setAttr(setData);
};

messageBox.prototype.Esc = function(){
    var his = this;
    document.onkeydown  = function(){
        var currKey=0,e=e||event;
        currKey=e.keyCode||e.which||e.charCode;
        if(currKey == 27){
            his.Dispear();
        }
    };
};

messageBox.prototype.paintTitle = function(titleData){
    this.titleBox = new kbSprite(0,0,1,titleData.height,this.box.sprite);
    this.titleBg = new kbBoxBg(0,0,1,1,titleData.color,this.titleBox.sprite,titleData.alpha);
    this.titleBg.setBorder(titleData.borderWidth,titleData.borderColor,titleData.borderAlpha);
    this.titleText = new kbBoxText(.5,.5,titleData.text,titleData.textColor,titleData.textFont,this.titleBox.sprite,.5,.5);
};

messageBox.prototype.setTitle = function(setData){
    this.titleBox.setAttr(setData);
    this.titleText.setAttr(setData);
};

messageBox.prototype.paintContent = function(contentData){
    this.contentText = new kbBoxText(.5,contentData.textY,contentData.text,contentData.textColor,contentData.textFont,this.box.sprite,.5,.5);
};

messageBox.prototype.setContent = function(setData){
    this.contentText.setAttr(setData);
};

messageBox.prototype.paintButton = function(x,y,width,height,color,fontColor,textContent,fontSize,borderColor,borderWidth,borderAlpha){
    this.button = new kbButton(x,y,width,height,[color],textContent,fontColor,fontSize,this.box.sprite,1,borderWidth,borderColor,borderAlpha);
    this.buttonArray.push(this.button);
};

messageBox.prototype.Display = function(){
    this.box.sprite.renderable = true;
    this.box.sprite.interactiveChildren = true;
    if(this.modalBox){
        this.modalBox.sprite.renderable = true;
    }
};

messageBox.prototype.Dispear = function(){
    this.box.sprite.renderable = false;
    this.box.sprite.interactiveChildren = false;
    if(this.modalBox){
        this.modalBox.sprite.renderable = false;
    }
};

messageBox.prototype.Move = function(){
    this.box.sprite.interactive = true;
};

messageBox.prototype.Clear = function(){
    this.parent.removeChild(this.box.sprite);
};

messageBox.prototype.setHideTime = function(time){
    var his = this;
    setTimeout(function(){
        his.Dispear();
    },time);
};

messageBox.prototype.getButton = function(count){
    return this.buttonArray[count];
};

messageBox.prototype.resize = function(){};


/*创建进度条*/
var progressBar = function(initData){
    this.x = initData.x;
    this.y = initData.y;
    this.width = initData.width;
    this.height = initData.height;
    this.backGroungColor = initData.backgroundColor;
    this.backGroungAlpha = initData.backgroundAlpha;
    this.borderWidth = initData.borderWidth;
    this.borderColor = initData.borderColor;
    this.borderAlpha = initData.borderAlpha;
    this.color = initData.color;
    this.alpha = initData.alpha;
    this.radius = initData.radius;
    this.parent = initData.parent;
    this.Paint();
};

progressBar.prototype.Paint = function(){
    this.box = new kbSprite(this.x,this.y,this.width,this.height,this.parent);
    this.boxBg = new kbBoxBg(0,0,1,1,this.backGroungColor,this.box.sprite,this.backGroungAlpha,true);
    this.boxBg.setBorder(this.borderWidth,this.borderColor,this.borderAlpha);
    this.boxBg.setRadius(this.radius);
    if(typeof this.color == 'number'){
        this.progress = new kbBoxBg(0,0,0,1,this.color,this.box.sprite,this.alpha,true);
        this.progress.setRadius(0);
    }else if(typeof this.color == 'string'){
        this.progress = new kbImg(0,.15,.2,.7,this.color,this.box.sprite).baseTexture;
    }else if(typeof this.color == 'object'){
        this.progress = new kbCanvasBg(0,.15,.2,.7,this.color,this.box.sprite).baseTexture;
    }

};

progressBar.prototype.getBox = function(){
    return this.box.sprite;
};

progressBar.prototype.setCursor = function(setData){
    this.progress.setAttr(setData);
};


/*创建上传的窗口控件*/
var Uploader = function(initData){
    this.x = initData.x;
    this.y = initData.y;
    this.width = initData.width;
    this.height = initData.height;
    this.parent = initData.parent;
    this.readFunc = initData.readFunc;
    this.sendFunc = initData.sendFunc;
    this.progressFunc = initData.progressFunc;
    this.noList = initData.noList;
    this.noMessage = initData.noMessage;
    this.paragraph = 1024*100;
    this.inputElement = [];
    this.nodeFunc = [];
    this.header = [];
    this.fileData = [];
    this.fileArray = [];
    this.indexArray = [];
    this.progressArray = [];
    this.progressText = [];
    this.unloadCount = 0;
    this.startSize = 0;
    this.endSize = this.paragraph;
    this.addNode(initData.id,initData.onChangeFunc,initData.header,initData.fileData);
    if(!this.noList)this.PaintList();
    if(!this.noMessage)this.paintMessage();
};

Uploader.prototype.addNode = function(nodeId,func,header,fileData){
    var his = this,node;
    var nodeLen = this.inputElement.length;
    for(var i= 0,len = nodeId.length;i<len;i++){
        node = document.getElementById(nodeId[i]);
        this.inputElement.push(node);
        func ? this.nodeFunc.push(func[i]) : this.nodeFunc.push('');
        header ? this.header.push(header[i]) : this.header.push('');
        fileData ? this.fileData.push(fileData[i]) : this.fileData.push('');
    }
    for(i=nodeLen,len=this.inputElement.length;i<len;i++){
        node = this.inputElement[i];
        node.i = i;
        node.onchange = function(){
            his.off = false;
            his.startSize = 0;
            his.endSize = his.paragraph;
            his.uploadFlag = true;
            his.nodeFunc[this.i] != '' && his.nodeFunc[this.i]();
            his.getFile(his.inputElement[this.i].files,this.i);
        }
    }
};

Uploader.prototype.PaintList = function(){
    var listInit = {
        position:{
            x:this.x,
            y:this.y
        },
        size:{
            width:this.width,
            height:this.height
        }
    };
    var borderInit = {
        position:{
            x:0,
            y:0
        },
        size:{
            width:1,
            height:1
        },
        border:{
            color:0X123123,
            type:'line',
            width:3,
            img:'./images/150x85.png',
            alpha:1,
            backGroundColor:0x000000,
            borderWidth:2,
            borderColor:0x123123
        },
        color:{
            backGroundColor:0xFFFFFF,
            alpha:.5
        }
    };
    var titleInit = {
        position:{
            x:0,
            y:0
        },
        size:{
            width:1,
            height:.1
        },
        border:{
            color:0X123123,
            width:2,
            alpha:1
        },
        color:{
            backGroundColor:0x123123,
            alpha:.5
        },
        content:{
            text : '上传文件',
            font : '12pt',
            color : 'black'
        }
    };
    var bodyInit = {
        position : {
            x :.05,
            y:.1
        },
        size : {
            width :.9,
            height:.9
        }
    };
    var bodyListInit = {
        position:{
            x:0,
            y:.1
        },
        size:{
            width:1,
            height:.7
        },
        border:{
            color:0xFFFFFF,
            width:2,
            alpha:1
        },
        //color:{
        //    backGroundColor:0x123123,
        //    alpha:.5
        //}
    };
    var rollInit = {
        position : {
            x : 1,
            y : 0
        },
        size : {
            width : .05,
            height : 1
        }
    };
    var listItemBoxStyle = {
        margin:{
            top:.02,
            left:.01
        },
        size:{
            width:.98,
            height:.18
        },
        border:{
            color:0x123123,
            width:1,
            alpha:1
        },
        color:{
            backGroundColor:0xFFFFFF,
            alpha:.5
        },
        count : {
            pageCount : 5
        }
    };
    var listItemStyle = {
        size : {
            width :.7,
            height :.6
        },
        margin : {
            top :.35,
            left :.02
        },
        //border : {
        //    width : 1,
        //    color : 0x123123,
        //    alpha :1
        //},
        //color : {
        //    backGroundColor : 0xFFFFFF,
        //    alpha :1
        //},
        //content : {
        //    font : '12pt',
        //    color : 'white'
        //}
    };
    var selectData = {
        color : {
            backGroundColor : 0x123123,
            alpha:.5
        }
    };
    var listItemBoxStyles = [listItemBoxStyle];
    var listItemStyles = [listItemStyle];
    var list = listBox();
    this.list = new list.box(this.parent,listInit);
    this.listBorder = new list.Border(borderInit);
    var listTitle = new list.Title(titleInit);
    this.listBody = new list.Body(bodyInit);
    this.listList = new list.Body.List(bodyListInit);
    this.listList.setScrollbar(rollInit);
    this.listItem = new list.Body.List.Item(listItemBoxStyles,listItemStyles,[]);
    this.listItem.select(selectData,function(){});
};

Uploader.prototype.paintMessage = function(){
    var messageData = {
        x : (this.parent.width-400)/2,
        y : (this.parent.height-300)/2,
        width :400,
        height :300,
        color : 0xFFFFFF,
        alpha:.5,
        parent : this.parent,
        borderColor : 0xFFFFFFF,
        borderWidth : 2,
        borderAlpha : 1,
        autoOpen : false,
        closeOnEscpe : true,
        diaggable : false,
        modal : false
    };
    var titleData = {
        height :.2,
        color : 0xFFFFFF,
        alpha:.5,
        borderColor : 0xFFFFFFF,
        borderWidth : 2,
        borderAlpha : 1,
        text : '上传提示',
        textColor : 'black',
        textFont : '12pt'
    };
    var contentData = {
        textY :.5,
        text : 'upload',
        textColor : 0x000000,
        textFont : '10pt'
    };
    this.message = new messageBox(messageData);
    this.message.paintTitle(titleData);
    this.message.paintContent(contentData);
    this.message.paintButton(.35,.7,.3,.2,0x000000,'white','确定','12pt',0xFFFFFF,1,1);
    var messageBnt = this.message.getButton(0);
    messageBnt.interactive(true);
    messageBnt.onEvent('mousedown',onClickEvent);
    messageBnt.onEvent('touchstart',onClickEvent);
    var his = this;
    function onClickEvent(){
        his.message.Dispear();
    }
};

Uploader.prototype.paintProgressBar = function(file){
    /*创建进度条*/
    var fileSize = this.ratio(file.size);
    var sprite = new PIXI.Sprite();
    this.listItem.Add([{sprite : sprite}]);
    var progressBarData = {
        x : 0,
        y : 0,
        width : 1,
        height : 1,
        backgroungColor : 0x3e3e3e,
        backgroungAlpha :　1,
        borderWidth : 1,
        borderColor : 0xFFFFFF,
        borderAlpha : 1,
        color : 0x64a928,
        alpha : 1,
        parent : sprite
    };
    this.progress = new progressBar(progressBarData);
    this.progressArray.push(this.progress);
    var progressSprite = this.progress.getBox();
    var name = new kbBoxText(0,0,'name: '+file.name,'red','8pt',sprite,0,1);
    var size = new kbBoxText(.3,0,'0/'+fileSize,'red','8pt',sprite,0,1);
    var speed = new kbBoxText(1,0,'0/s','red','8pt',sprite,1,1);
    var per = new kbBoxText(1,.5,'0%','red','10pt',sprite,0,.5);
    var wait = new kbBoxText(1.2,.5,'等待上传','red','10pt',sprite,0,.5);
    this.progressText.push({size : size,speed : speed,per : per,wait : wait});
};

Uploader.prototype.setSize = function(size){
    if(this.progressText.length > 0){
        var tmp = this.ratio(size);
        var content = this.progressText[this.unloadCount].size.content;
        var allSize = content.split('/')[1];
        var text = tmp+'/'+allSize;
        this.progressText[this.unloadCount].size.setAttr({text : text});
    }
};

Uploader.prototype.setPer = function(per){
    if(this.progressText.length > 0){
        this.progressText[this.unloadCount].per.setAttr({text : per+'%'});
    }
};

Uploader.prototype.ratio = function(data){
    if(data/1024/1024 >= 1){
        return (data/1024/1024).toFixed(2)+'MB';
    }else if(data/1024 >= 1){
        return (data/1024).toFixed(1) + 'kB';
    }else{
        return data.toFixed(0) + 'B';
    }
};

Uploader.prototype.setWait = function(data){
    if(this.progressText.length > 0){
        this.progressText[this.unloadCount].wait.setAttr({text : data});
    }
};

Uploader.prototype.getFile = function(files,index){
    var file = files;
    var lenFile = file.length;
    for(var j=0;j<lenFile;j++){
        this.fileArray.push(file[j]);
        this.indexArray.push(index);
        this.list && this.paintProgressBar(file[j]);
    }
    this.iptIndex = index;
    if(this.uploadFlag){
        this.sliceFile();
    }
};

Uploader.prototype.sliceFile = function(index){
    this.uploadFlag = false;
    var file = this.fileArray[this.unloadCount];
    if(index){
        this.startSize = index*this.paragraph;
        this.endSize = (index+1)*this.paragraph;
    }
    this.setWait('正在上传');
    var blob;
    var reader = new FileReader();
    if(this.endSize > file.size){
        this.endSize = file.size;
        if(this.fileData[this.iptIndex] != '')this.fileData[this.iptIndex].last = 1;
    }
    //console.log(this)
    if (file.webkitSlice) {
        blob = file.webkitSlice(this.startSize, this.endSize);
    } else if (file.mozSlice) {
        blob = file.mozSlice(this.startSize, this.endSize);
    }else if (file.slice) {
        blob = file.slice(this.startSize, this.endSize);
    }
    this.sendFile(reader,blob,index);
};

Uploader.prototype.sendFile = function(reader,blob,index){
    //以二进制形式读取文件
    reader.readAsArrayBuffer(blob);
    //文件读取完毕后该函数响应
    var his = this;
    reader.onload = function loaded(evt) {
        var binaryString = evt.target.result;
        //发送文件
        his.sendTime = Date.now();
        his.sendData(binaryString,index);
    }
};

Uploader.prototype.getCurLen = function(per){
    if(this.progressArray.length > 0){
        this.progressArray[this.unloadCount].setCursor({width : per});
    }
    this.progressFunc && this.progressFunc(per);
};

Uploader.prototype.setRing = function(per){
    if(this.ring){
        var ringPer = this.arc.startAngle+(per*Math.PI*2);
        var per = (per*100).toFixed(1)+'%';
        this.arc.setArc({endAngle : ringPer});
        this.ring.setText({text : per})
    }
};

Uploader.prototype.getTotalLen = function(){

};

Uploader.prototype.Display = function(){
    this.list.sprite.sprite.visible = true;
};

Uploader.prototype.Dispear = function(){
    this.list.sprite.sprite.visible = false;
};

Uploader.prototype.setSpeed = function(data){
    if(this.progressText.length > 0){
        var speed = this.ratio(data);
        speed += '/s';
        this.progressText[this.unloadCount].speed.setAttr({text : speed});
    }
};

Uploader.prototype.readData = function(){
    if(this.resendFlag){
        this.resendFlag = false;
        this.startSize = 0;
        this.endSize = this.paragraph;
        this.iptIndex = this.indexArray[this.unloadCount];
        this.fileData[this.iptIndex].index = 0;
        this.sliceFile();
        return;
    }
    var readTime = Date.now();
    var perTime = 1000*this.paragraph/(readTime-this.sendTime);
    var per = this.endSize/this.fileArray[this.unloadCount].size;
    this.setSpeed(perTime);
    this.setPer((per*100).toFixed(1));
    this.getCurLen(per);
    this.setRing(per);
    this.setSize(this.endSize);
    if(per == 1){
        var his = this;
        this.startSize = 0;
        this.endSize = this.paragraph;
        this.setWait('上传完成');
        if(this.message){
            this.message.setContent({text : this.fileArray[this.unloadCount].name+'上传完成'});
            this.message.Display();
            setTimeout(function(){
                his.message.Dispear();
            },2000);
        }
        this.fileData[this.iptIndex].index = 0;
        this.fileData[this.iptIndex].last = 0;
        this.unloadCount += 1;
    }
    if(this.unloadCount <= (this.fileArray.length-1)){
        this.startSize += this.paragraph;
        this.endSize += this.paragraph;
        this.iptIndex = this.indexArray[this.unloadCount];
        this.sliceFile();
    }else{
        this.uploadFlag = true;
    }
};

Uploader.prototype.resend = function(file){
    this.resendFlag = true;
    if(file){
        for(var i= 0,len=this.fileArray.length;i<len;i++){
            if(this.fileArray[i] == file){
                this.unloadCount = i;
                break;
            }
            if(i == len-1){
                this.fileArray.push(file);
                this.unloadCount = len;
            }
        }
    }
};

Uploader.prototype.sendData = function(data,index){
    var fileIndex = this.iptIndex;
    var obj = {data : objClone(this.fileData[fileIndex]),buffer : data};
    if(index){
        obj.data.index = index;
    }
    if(this.header[fileIndex] != ''){
        obj.pktHeader = this.header[fileIndex].pkt;
        obj.pktHeader.dlen = this.paragraph+10;
    }
    this.sendFunc(obj);
    if(!index){
        this.fileData[fileIndex].index += 1;
        if(!this.off){
            this.readData();
        }
    }
};
/*绘制一个圆环显示进度*/
Uploader.prototype.paintRing = function(x,y,r1,r2,startAngle,endAngle,color1,color2,alpha1,alpha2,borderColor1,borderColor2,borderWidth1,borderWidth2,borderAlpha1,borderAlpha2){
    this.arc = new Arc(x,y,r1,startAngle,endAngle,color1,alpha1,this.parent);
    this.ring = new Ring(x,y,r1,r2,color1,color2,this.parent,0,alpha2,borderWidth1,borderWidth2,borderColor1,borderColor2,borderAlpha1,borderAlpha2);
    this.ring.paintText('0%','red','12pt');
};

Uploader.prototype.dragUpload = function(element){
    var uuz = element,his = this;
    uuz.ondragenter = function(e){
        e.preventDefault();
    };

    uuz.ondragover = function(e){
        e.preventDefault();
    };

    uuz.ondragleave = function(e){
        e.preventDefault();
    };

    uuz.ondrop = function(e){
        e.preventDefault();
        var upfile = e.dataTransfer.files; //获取上传的文件
        his.getFile(upfile);
    }
};
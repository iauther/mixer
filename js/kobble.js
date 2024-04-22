window.GLOBAL = {
    version : '1.0.14',
    setIntervalTime : 100,
    scanTime : 2000,
    loginTime : 500,
    soloEventDealy : 250,
    mainPopupButtonLightTime :  200,
    mainPopupDispearTime : 200,
    faderResetDisplayTime : 2500,
    netUpdateTime : 2000,
    loginFlag : false,
    solo_mode : 0,
    iptScale : true,
    setRescale : parseFloat(getLocalStorage('setRescale',1)),
    language : getLocalStorage('setLanguage','en'),
    fps : parseFloat(getLocalStorage('setFps',60)),
    clipHold : parseFloat(getLocalStorage('setClipHold',2000)),
    setSafes : getLocalStorage('setSafes','00000000000000000000000000000000'),
    linkData : [0,0,0,0,0,0,0,0,0,0,0,0],
    dispearPopup : [],
    graphicsResize : [],
    disNetMessage : '',
    sureButtonImg : '',
    soloFlag : 0,
    user : 'root',
    hl : 1,
    masterMode : 0,
    setLevelSkip : '',
    initStart : '',
    updateWidget : '',
    clearElement : []
};
var init;
function getLocalStorage(item,def){
     return  localStorage.getItem(item) != undefined ? localStorage.getItem(item) : def;
}
//对字符串进行加密
function compileStr(code){
    var c=String.fromCharCode(code.charCodeAt(0)+code.length);
    for(var i=1;i<code.length;i++)
    {
        c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
    }
    return escape(c);
}
//对字符串进行解密
function uncompileStr(code){
    code=unescape(code);
    var c=String.fromCharCode(code.charCodeAt(0)-code.length);
    for(var i=1;i<code.length;i++)
    {
        c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
    }
    return c;
}
/*将字符串保存为文件*/
function saveAsFile(data, filename) {
    var str = JSON.stringify(data);
    str = compileStr(str);
    var blob = new Blob([str], {type: "text/plain;base64"});
    var type = blob.type;
    var force_saveable_type = 'application/octet-stream';
    if (type && type != force_saveable_type) { // 强制下载，而非在浏览器中打开
        var slice = blob.slice || blob.webkitSlice || blob.mozSlice;
        blob = slice.call(blob, 0, blob.size, force_saveable_type);
    }
    var url = URL.createObjectURL(blob);
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = url;
    save_link.download = filename;

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
    URL.revokeObjectURL(url);
}

function pageInteractive(flag){
    ctx.stage.interactiveChildren = flag;
}
/*增加canvas绘制圆角矩形的方法*/
CanvasRenderingContext2D.prototype.fillRoundRect = function (x, y, w, h, r) {
    if (w < 2 * r) {r = w / 2;}
    if (h < 2 * r){ r = h / 2;}
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y, x+w, y+h, r);
    this.arcTo(x+w, y+h, x, y+h, r);
    this.arcTo(x, y+h, x, y, r);
    this.arcTo(x, y, x+w, y, r);
    this.closePath();
    return this;
};

(function(){
    var iptArray = [],menuButton = [],messageArray = [],updateWidgetArray = [],windowResize = false;
    var images = new Array(imgID.img_num);
    var table = new Table();
    var tableCh = table.ch;
    var canvasCache;
    var textInput = function(){
        var input = document.createElement('input');
        input.style.position = 'absolute';
        input.style.display = 'none';
        input.style.background = 'none';
        input.style.border = 'none';
        input.style.textAlign = 'center';
        input.id = 'textInput';
        input.type = 'number';
        document.body.appendChild(input);
        return input;
    }();

    var wifiCanvas = function(){
        var drawWifiCanvas = function(signal){
            var pi = Math.PI,r = 2;
            var canvas = document.createElement('canvas');
            canvas.width = 24;
            canvas.height = 20;
            var context = canvas.getContext('2d');
            for(var i=3;i>=0;i--){
                context.beginPath();
                context.lineWidth = 2;
                if(signal < i){
                    context.strokeStyle = '#5c5c5c';
                }else{
                    context.strokeStyle = '#000000';
                }
                context.arc(12,20,r + 5*i,pi*1.25,pi*1.75,false);
                context.stroke();
                context.closePath();
            }
            return canvas;
        };
        return {
            signal0 : drawWifiCanvas(0),
            signal1 : drawWifiCanvas(1),
            signal2 : drawWifiCanvas(2),
            signal3 : drawWifiCanvas(3)
        }
    }();

    var rightWrongCanvas = function(){
        var width = 30,height = 30,grayColor = '#24242a',redColor = "#e41506";
        var drawRightWrongCanvas = function(width,height,color,flag){
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = 2;
            context.arc(width/2, height/2, width/2-1, 0, Math.PI * 2, true);
            context.closePath();
            if(!flag){
                context.moveTo(7,7);
                context.lineTo(width-7,height-7);
                context.moveTo(width-7,7);
                context.lineTo(7,height-7);
            }else{
                context.moveTo(5,14);
                context.lineTo(12,height-7);
                context.lineTo(width-7,10);
            }
            context.stroke();
            return canvas;
        };
        return {
            grayRight : drawRightWrongCanvas(width,height,grayColor,true),
            redRight : drawRightWrongCanvas(width,height,redColor,true),
            grayWrong : drawRightWrongCanvas(width,height,grayColor,false),
            redWrong : drawRightWrongCanvas(width,height,redColor,false)
        }
    }();

    var regex = {
        user_name : function(str){//字母或下划线打头，不小于4位
            var re = /^[a-zA-z]\w{3,15}$/;
            if(re.test(str)){
                return true;
            }else{
                return false;
            }
        },
        user_password : function(password) {//必须为字母加数字且长度不小于8位
            var str = password;
            if (str == null || str.length <8) {
                return false;
            }
            var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
            if (!reg1.test(str)) {
                return false;
            }
            var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
            if (reg.test(str)) {
                return true;
            } else {
                return false;
            }
        },
        url : function(url){
            var re = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
            if(re.test(url)){
                return true;
            }else{
                return false;
            }
        }
    };
    /*绘制fader的刻度*/
    var scaleCanvas = function(canvas,x,y,content,space,line){
        var attrP = content;
        var textCvs = canvas;
        var len = space.length;
        var lineLen = line ? line.length : 0;
        var a = 0;
        for(var i=0;i<len;i++){
            for(var j=0;j<space[i].len;j++){
                if(attrP[a] != undefined){
                    textCvs.fillText(attrP[a],x,y);
                }
                for(var k=0;k<lineLen;k++){
                    textCvs.moveTo(line[k].x,y);
                    textCvs.lineTo(line[k].x+line[k].len,y);
                }
                a ++;
                y += space[i].space;
            }
        }
        textCvs.stroke();
    };
    /*canvas绘制圆角矩形*/
    var drawRoundRec = function(ctx,x, y, w, h, r) {
        ctx.moveTo(x+r, y);
        ctx.arcTo(x+w, y, x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x, y+h, r);
        ctx.arcTo(x, y+h, x, y, r);
        ctx.arcTo(x, y, x+w, y, r);
        ctx.closePath();
    };

    var kbSetUpgradeProgress = function(width,height,color){
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx = drawLinearGradient({x1:0,y1:0,x2:0,y2:height},color,ctx);
        drawRoundRec(ctx,0,0,width,height,height/2);
        ctx.fill();
        return canvas;
    };

    var kbTitleBgCanvas = function(width,height){
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx = drawLinearGradient({x1:0,y1:0,x2:0,y2:height},[{pos:0,color:'#23232a'},{pos:.5,color:'#3a3a49'},{pos:1,color:'#24242b'}],ctx);
        ctx.fillRect(0,0,width,height);
        return canvas;
    };

    var kbSkipCanvas = function(flag){
        var width = 10,height = staticDataLocal.main.main.height *.5;
        var lineColor = flag == 'light' ? staticDataColor.fader.skipLight : staticDataColor.fader.skip;
        var canvas = document.createElement('canvas');
        canvas.width = width+1;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx = drawLinearGradient({x1:0,y1:0,x2:0,y2:height},lineColor,ctx);
        drawRoundRec(ctx,1,1,width-2,height-2,width/2);
        ctx.fill();
        var canvasAll = document.createElement('canvas');
        canvasAll.width = width+1;
        canvasAll.height = height;
        var ctxAll = canvasAll.getContext('2d');
        ctxAll.fillStyle = '#101015';
        ctxAll.fillRoundRect(0,0,width,height,width/2);
        ctxAll.fill();
        ctxAll.drawImage(canvas,0,0,width,height);
        canvasAll.cutImg = canvas;
        return canvasAll;
    };

    var kbSkipTopCanvas = function(flag){
        var width = 10,height = 58;
        var color = flag == 'light' ? staticDataColor.fader.skipTopLight : staticDataColor.fader.skipTop;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        ctx.fillRoundRect(0,0,width,height,width/2);
        ctx.fill();
        for(var i=0;i<2;i++){
            ctx.moveTo(0,height/3*(i+1));
            ctx.lineTo(width,height/3*(i+1));
        }
        ctx.stroke();
        ctx.closePath();
        var canvasAll = document.createElement('canvas');
        canvasAll.width = width;
        canvasAll.height = height;
        var ctxAll = canvasAll.getContext('2d');
        ctxAll.fillStyle = '#101015';
        ctxAll.fillRoundRect(0,0,width,height,width/2);
        ctxAll.fill();
        ctxAll.drawImage(canvas,0,0,width,height);
        canvasAll.cutImg = canvas;
        return canvasAll;
    };

    var kbFaderFlute = function(width,height,fillColor,shadowColor){
        var fluteLinerColor = staticDataColor.fader.flute;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = fillColor;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 1;
        ctx.shadowColor = shadowColor;
        ctx.beginPath();
        ctx.fillRect(1,1,width-2,height-2);
        ctx.fill();
        return canvas;
    };

    var kbFaderScale = function(width,height,flag){
        width = width*1.2;
        height = height*1.2;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var textCvs = canvas.getContext('2d');
        var canvasH = height-16,attr,space;
        if(flag == 'sends' || flag == 'editSends'){
            var formulaSends = formula.sends;
            attr = [parseInt(formulaSends(0)),parseInt(formulaSends(1/6)),parseInt(formulaSends(2/6)),parseInt(formulaSends(3/6)),parseInt(formulaSends(4/6)),parseInt(formulaSends(5/6)),'-∞'];
            space = [{len:7,space:canvasH*1/6}];
        }else{
            attr = [20,12,6,'U',6,12,24,36,60,'∞'];
            space = [{len:1,space:canvasH*8/100},{len:4,space:canvasH*6/100},{len:2,space:canvasH*12/100},{len:1,space:canvasH*24/100},{len:2,space:canvasH*20/100}];
        }

        var line = [{x:0,len:width *.3},{x:width*.7,len:width *.3}];
        textCvs.lineWidth = 1;
        textCvs.strokeStyle = staticDataColor.fader.line;
        textCvs.fillStyle = staticDataColor.fader.text.num;
        textCvs.font = staticDataFont.fader.scale;
        textCvs.textAlign = 'center';
        textCvs.textBaseline = 'middle';
        scaleCanvas(textCvs,width *.5,8,attr,space,line);
        return canvas;
    };

    var kbMainFaderBgCanvas = function(width,height,flag){
        var spaceW = 6,spaceH = 5,widgetH = 41,panH = 24,color = staticDataColor.fader;
        var x = spaceW, y = spaceH,w = width-spaceW* 2,h = widgetH;
        var scaleTop = ['5','10','20'];
        var disImg = new Image();
        disImg.src = images[imgID.main_Display];
        var flute = new Image();
        flute.src = images[imgID.main_flute];
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        function drawBackground(flag){
            var bgColor = !flag ? color10hex210(color.backGroundColor) : color10hex210(color.backGroundColorDown);
            var borderColor = color10hex210(color.border);
            context.clearRect(0,0,width,height);
            context.beginPath();
            context.strokeStyle = borderColor;
            context.fillStyle = bgColor;
            context.font = staticDataFont.fader.num;
            context.fillRect(0,0,width,height);
            context.moveTo(0,0);
            context.lineTo(0,height);
            context.moveTo(width,0);
            context.lineTo(width,height);
            context.stroke();
            context.fill();
        }
        drawBackground(flag);
        return canvas;
    };

    var kbFaderPortDelayScale = function(width,height){
        width = width*1.1;
        height = height*1.1;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var textCvs = canvas.getContext('2d');
        var attr = [500,400,300,200,150,100,60,40,20,0];
        var canvasH = height-16;
        var space = [{len:10,space:canvasH/9}];
        var line = [{x:width*.6,len:width *.4}];
        textCvs.lineWidth = 1;
        textCvs.strokeStyle = staticDataColor.fader.line;
        textCvs.fillStyle = staticDataColor.fader.text.num;
        textCvs.font = staticDataFont.fader.scale;
        textCvs.textAlign = 'center';
        textCvs.textBaseline = 'middle';
        scaleCanvas(textCvs,12,8,attr,space,line);
        return canvas;
    };

    var kbFaderEqSliderScale = function(width,height){
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var textCvs = canvas.getContext('2d');
        var attr = [];
        var canvasH = height-12;
        var space = [{len:10,space:canvasH/9}];
        var line = [{x:0,len:width *.2},{x:width*.8,len:width *.2}];
        textCvs.lineWidth = 1;
        textCvs.strokeStyle = staticDataColor.editEq.sliderScaleLine;
        textCvs.textAlign = 'center';
        textCvs.textBaseline = 'middle';
        scaleCanvas(textCvs,10,6,attr,space,line);
        return canvas;
    };

    var kbEqMatrixBg = function(width,height,flag){
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var lineX = 0,lineY = 0,lineW = width,lineH = height;
        var context = canvas.getContext('2d');
        context.beginPath();
        context.strokeStyle = staticDataColor.editEq.line;
        context.lineWidth = 1;
        for(var i=0;i<7;i++){
            context.moveTo(lineX,i/6*lineH+lineY);
            context.lineTo(lineW+lineX,i/6*lineH+lineY);
        }
        if(flag == 'eq'){
            var attr = [20,30,40,50,60,70,80,90,100,200,300,400,500,600,700,800,900,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,20000];
            for(i=0;i<attr.length;i++){
                var x = CalcXPos6(lineW,20,20000,attr[i])+lineX;
                context.moveTo(x,lineY);
                context.lineTo(x,lineY+lineH);
            }
        }else if(flag == 'geq'){
            for(i=0;i<16;i++){
                context.moveTo(i/15*lineW+lineX,lineY);
                context.lineTo(i/15*lineW+lineX,lineY+lineH);
            }
        }
        context.stroke();
        return canvas;
    };

    var kbBoxBgCanvas = function(color){
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        var context = canvas.getContext('2d');
        context.beginPath();
        context.fillStyle = color;
        context.fillRect(0,0,2,2);
        context.fill();
        context.closePath();
        return canvas;
    };

    var canvasCacheObj = function(){
        var eqSliderPos = staticDataLocal.eq,faderHeight = staticDataLocal.main.main.height-8,faderWidth = staticDataLocal.fader.actW,
            setUpgradeProgressColor = staticDataColor.setUpgrade.progress;
        var eqMatrixW = staticDataLocal.eq.lineBoxW,eqMatrixH = staticDataLocal.eq.lineBoxH;
        var geqMatrixW = staticDataLocal.geq.lineBoxW,geqMatrixH = staticDataLocal.geq.lineBoxH;
        var faderScale = kbFaderScale(52,boundaryValue(faderHeight-365,0));
        var boxBgColor = staticDataColor.main.backGroundColor;
        return {
            titleBg : kbTitleBgCanvas(staticDataLocal.title.title.width,staticDataLocal.title.title.height),
            faderSkip : kbSkipCanvas,
            faderSkipTop : kbSkipTopCanvas,
            faderFlute : kbFaderFlute(10,10,'#222227','rgba(255, 255, 255,.2)'),
            faderScale : faderScale,
            mainFaderMono : kbMainFaderBgCanvas(faderWidth,faderHeight),
            mainFaderMonoLight : kbMainFaderBgCanvas(faderWidth,faderHeight,true),
            mainFaderStereo : kbMainFaderBgCanvas(faderWidth,faderHeight),
            portTrimScale : kbFaderScale(60,350),
            portDelayScale : kbFaderPortDelayScale(500 *.1 *.9,320),
            eqSliderScale : kbFaderEqSliderScale(eqSliderPos.sliderWidth*.2,eqSliderPos.sliderHeight*.6),
            setUpgradeProgress : kbSetUpgradeProgress(0,10,setUpgradeProgressColor),
            eqMatrixBg : kbEqMatrixBg(eqMatrixW,eqMatrixH,'eq'),
            geqMatrixBg : kbEqMatrixBg(geqMatrixW,geqMatrixH,'geq'),
            boxBg : kbBoxBgCanvas(boxBgColor)
        }
    };

    var baseHeader = function(ch,pktLen,adspType,group){
        group  = group ? group : 0;
        this.pkt = new createPktHeader(0xAAFF,1,Type.TYPE_USER_PARA,0,0,pktLen);
        this.para = new createParaHeader(emModeID.MODE_TYPE,adspType,ch,0,0,group,pktLen-11);
        var hl = ch == chID.CH_MASTER ? GLOBAL.hl : 0;
        this.para.hl = hl;
    };

    var basePktHeader = function(type,pktLen){
        this.pkt = new createPktHeader(0xAAFF,1,type,0,0,pktLen);
    };

    var sendHeader = {
        adsp_gain : function(ch,group){
             var adspType = (ch >=chID.CH_USER && ch<= chID.CH_MASTER) ? sendTypeID.TYPE_DSP_GAIN_STEREO : sendTypeID.TYPE_DSP_GAIN_MONO;
             baseHeader.call(this,ch,31,adspType,group);
        },
        adsp_delay : function(ch,group){
             var adspType = sendTypeID.TYPE_DSP_DELAY;
             baseHeader.call(this,ch,37,adspType,group);
        },
        adsp_ppower : function(ch,group){
            var adspType = sendTypeID.TYPE_DSP_PPOWER;
            baseHeader.call(this,ch,27,adspType,group);
        },
        adsp_mixerpan : function(ch,group){
            baseHeader.call(this,ch,45,sendTypeID.TYPE_DSP_MIXERPAN,group);
        },
        adsp_panGain : function(ch,group){
            baseHeader.call(this,ch,33,sendTypeID.TYPE_DSP_PANGAIN,group);
        },
        adsp_solo : function(ch,group){
            baseHeader.call(this,ch,26+chID.CH_IN_NUM+chID.CH_FX_NUM,sendTypeID.TYPE_DSP_SOLO,group);
        },
        adsp_iir : function(ch,index,group){
            var adspType = (ch >=chID.CH_USER && ch<= chID.CH_MASTER) ? sendTypeID.TYPE_DSP_IIR_STEREO : sendTypeID.TYPE_DSP_IIR_MONO;
            baseHeader.call(this,ch,39,adspType,group);
            this.para.index = index;
        },
        adsp_xo : function(ch,group,pf){
            var adspType = (ch >=chID.CH_USER && ch<= chID.CH_MASTER) ? sendTypeID.TYPE_DSP_XO_STEREO : sendTypeID.TYPE_DSP_XO_MONO;
            baseHeader.call(this,ch,37,adspType,group);
            pf = pf ? pf : 0;
            this.para.pf = pf;
        },
        adsp_gatecps : function(ch,group){
            var adspType;
            if(ch >=chID.CH_USER && ch< chID.CH_MASTER){
                adspType = sendTypeID.TYPE_DSP_GATECPS_STEREO;
            }else if(ch == chID.CH_MASTER){
                adspType = sendTypeID.TYPE_DSP_LIMITER;
            }else{
                adspType = sendTypeID.TYPE_DSP_GATECPS_MONO;
            }
            baseHeader.call(this,ch,58,adspType,group);
        },
        adsp_echo : function(){
            var adspType = sendTypeID.TYPE_DSP_ECHO;
            baseHeader.call(this,chID.CH_ECHO,37,adspType,0);
        },
        adsp_reverb : function(){
            var adspType = sendTypeID.TYPE_DSP_REVERB;
            baseHeader.call(this,chID.CH_REVERB,35,adspType,0);
        },
        ch_name : function(ch){
            baseHeader.call(this,ch,58,sendTypeID.TYPE_DSP_NAME,0);
        },
        setup_group : function(group){
            baseHeader.call(this,0,12*chID.DSP_CH_NUM+26,sendTypeID.TYPE_SETUP_GROUP,group);
        },
        setup_sett : function(){
            baseHeader.call(this,chID.CH_SETUP,34,sendTypeID.TYPE_SETUP_SETT);
        },
        misc_mixerMode : function(){
            baseHeader.call(this,chID.CH_MISC,27,sendTypeID.TYPE_DSP_MIXERMODE);
        },
        setup_user : function(index){
            baseHeader.call(this,chID.CH_SETUP,118,sendTypeID.TYPE_USER);
            this.para.index = index;
        },
        trim : function(ch,group){
            baseHeader.call(this,ch,31,sendTypeID.TYPE_DSP_PORT,group);
        },
        fdbk : function(ch,group){
            baseHeader.call(this,ch,27,sendTypeID.TYPE_DSP_FDBK,group);
        },
        send : function(ch,group){
            baseHeader.call(this,ch,37,sendTypeID.TYPE_DSP_SEND,group);
            this.para.index = ch;
        },
        scene : function(){
            baseHeader.call(this,chID.CH_SETUP,379,sendTypeID.TYPE_SCENE);
        },
        sign : function(){
            baseHeader.call(this,chID.CH_SETUP,91,sendTypeID.TYPE_USER);
            this.pkt.needAck = 1;
        },
        network : function(){
            baseHeader.call(this,chID.CH_SETUP,166,sendTypeID.TYPE_SETUP_NETWORK);
        },
        upgrade : function(){
            basePktHeader.call(this,Type.TYPE_USER_FILE,21);
            this.pkt.needAck = 1;
        },
        network_ap_scan : function(){
            basePktHeader.call(this,Type.TYPE_USER_NET,13);
            this.pkt.needAck = 1;
        },
        network_ap_connect : function(len){
            basePktHeader.call(this,Type.TYPE_USER_NET,len);
            this.pkt.needAck = 1;
        }
    };

    var setHeaderGroup = function(idArray){
        var string = '00000000000000000000000000000000';
        for(var i= 0,len=idArray.length;i<len;i++){
            string = replaceString(string,31-idArray[i],1);
        }
        return parseInt(string,2);
    };

    var formulaLineMax = function(data,flag,range,decimal){
        decimal = decimal != undefined ? decimal : 1;
        if(!flag){
            return RetainDecimal((range.max-(range.max-range.min)*data),decimal);
        }else{
            return division((range.max-data),(range.max-range.min));
        }
    };

    var formulaLineMin = function(data,flag,range,decimal){
        decimal = decimal != undefined ? decimal : 1;
        if(!flag){
            return RetainDecimal((range.min+(range.max-range.min)*data),decimal);
        }else{
            return division((data-range.min),(range.max-range.min));
        }
    };

    var formula = {
        main_slider : function(data,flag){
            var range = {max : 200,min : -800};
            return formulaLineMax(data,flag,range,0);
        },
        port_delay : function(data,flag){
            var range = {max : 500,min : 0};
            return formulaLineMax(data,flag,range);
        },
        eq_gain : function(y,flag){
            if(!flag){
                return RetainDecimal((300-600*y),0);
            }else{
                return (300-y)/600;
            }
        },
        eq_freq : function(y,flag){
            if(!flag){
                return Math.round(CalcFreq6(1,1-y,20,20000));
            }else{
                return 1-CalcXPos6(1,20,20000,y);
            }
        },
        reverb_fdbk_freq : function(y,flag){
            if(!flag){
                return Math.round(CalcFreq6(1,1-y,500,20000));
            }else{
                return 1-CalcXPos6(1,500,20000,y);
            }
        },
        eq_hpf_freq0 : function(y,flag){
            if(!flag){
                return Math.round(CalcFreq6(1,1-y,20,1000));
            }else{
                return 1-CalcXPos6(1,20,1000,y);
            }
        },
        eq_hpf_freq13_range : {max : 10000,min : 40},
        eq_hpf_freq14_range : {max : 20000,min : 10000},
        eq_hpf_freq13 : function(y,flag){
            var range = formula.eq_hpf_freq13_range;
            if(!flag){
                return Math.round(CalcFreq6(1,1-y,range.min,range.max));
            }else{
                return 1-CalcXPos6(1,range.min,range.max,y);
            }
        },
        eq_hpf_freq14 : function(y,flag){
            var range = formula.eq_hpf_freq14_range;
            if(!flag){
                return Math.round(CalcFreq6(1,1-y,range.min,range.max));
            }else{
                return 1-CalcXPos6(1,range.min,range.max,y);
            }
        },
        eq_Q : function(data,flag){
            if(!flag){
                return RetainDecimal(CalcQPos(1-data),1);
            }else{
                return 1-CalcQ(data);
            }
        },
        gate_threshold : function(data,flag){
            var range = {min:-800,max:200};
            return formulaLineMax(data,flag,range,0);
        },
        gate_depth : function(data,flag){
            var range = {min : 0,max : 600};
            return formulaLineMax(data,flag,range,0);
        },
        gate_attck : function(data,flag){
            var range = {min : 10,max : 5000};
            return formulaLineMax(data,flag,range,0);
        },
        gate_hold : function(data,flag) {
            var range = {min : 0,max : 5000};
            return formulaLineMax(data,flag,range,0);
        },
        gate_release : function(data,flag){
            var range = {min : 100,max : 30000};
            return formulaLineMax(data,flag,range,0);
        },
        cps_threshold : function(data,flag){
            var range = {min:-800,max:200};
            return formulaLineMax(data,flag,range,0);
        },
        cps_ratio : function(data,flag){
            if(!flag){
                return RetainDecimal(cpsRatioY2val(1-data,10),0);
            }else{
                return 1-cpsRatioVal2y(data,10);
            }
        },
        cps_attck : function(data,flag){
            var range = {min : 10,max : 5000};
            return formulaLineMax(data,flag,range,0);
        },
        cps_hold : function(data,flag){
            var range = {min : 0,max : 5000};
            return formulaLineMax(data,flag,range,0);
        },
        cps_release : function(data,flag){
            var range = {min : 100,max : 30000};
            return formulaLineMax(data,flag,range,0);
        },
        ch_pan : function(data,flag){
            var range = {max : 100,min : -100};
            return formulaLineMin(data,flag,range,0);
        },
        leves : function(data,flag){
            var range = {max : 200,min : -1500};
            data = boundaryValue(data,range.min,range.max);
            return formulaLineMin(data,flag,range,1);
        },
        sendsSlider : function(data,flag){
            if(!flag){
                return RetainDecimal(1-data,1);
            }else {
                return RetainDecimal(1-data,1);
            }
        },
        sends : function(data,flag){
            if(flag){
                if(data == -800){
                    return 1;
                }
                return RetainDecimal(Math.pow(10,data/20),2);
            }else{
                var log10 = Math.log10 != undefined ? Math.log10 : mathLog10;
                var result = log10((1-data))*20;
                if(result == -Infinity){
                    return -800;
                }
                return RetainDecimal(result,1);
            }
        },
        echo_delay : function(data,flag){
            var range = {max : 500,min : 0};
            return formulaLineMax(data,flag,range,0);
        },
        adsp_delay : function(data,flag){
            var range = {max : 1500,min : 0};
            return formulaLineMin(data,flag,range,0);
        },
        echo_ratio : function(data,flag){
            var range = {max : 90,min : 0};
            return formulaLineMax(data,flag,range,0);
        },
        reverb_pre_delay : function(data,flag){
            var range = {max : 200,min : 0};
            return formulaLineMax(data,flag,range,0);
        },
        reverb_time : function(data,flag){
            var range = {max : 2000,min : 0};
            return formulaLineMax(data,flag,range,0);
        }
    };

    var clearElementChangePos = function(){
        var clearElement = window.GLOBAL.clearElement;
        for(var i=0,len=clearElement.length;i<len;i++){
            clearElement[i].clearChangePos();
        }
    };

    var resize = function(last){
        if(!ctx.resize || !GLOBAL.setRescale || !GLOBAL.iptScale || !init)return;
        if(last){
            var displayArray = mapVisible(ctx.stage);
        }
        RefreshLocal();
        canvasCache = canvasCacheObj();
        ctx.resize();
        init.title.resize();
        init.nav.resize();
        init.page.resize();
        GLOBAL.mainPopup.resize();
        var geaphicsArray = GLOBAL.graphicsResize;
        for(var i= 0,len=geaphicsArray.length;i<len;i++){
            geaphicsArray[i].resize();
        }
        resizeAllInput();
        if(last){
            for(i=0,len=displayArray.length;i<len;i++){
                displayArray[i].visible = false;
            }
        }
        window.appRender();
        clearElementChangePos();
    };

    function mapVisible(parent){
        var displayArray = [];
        checkVisible(parent);
        mapChild(parent);
        function mapChild(element){
            var children = element.children;
            for(var i=0,len=children.length;i<len;i++){
                checkVisible(children[i]);
                mapChild(children[i]);
            }
        }
        function checkVisible(element){
            if(!element.visible){
                displayArray.push(element);
                element.visible = true;
            }
        }
        return displayArray;
    }
    /*检测woindow窗口的变化*/
    if(isPc){
        window.onresize = function(){
            resize();
            windowResize = true;
            setTimeout(function(){
                if(!windowResize){
                    resize(true);
                }else{
                    windowResize = false;
                }
            },1000);
        };
    }else{
        window.addEventListener('orientationchange',function(){
            setTimeout(function(){
                resize(true);
            },500);
        },false);
    }
    /*当点击input之外的区域时取消input的选中焦点状态,为了在移动设备中点击其他地方弹出键盘*/
    var unBlur = function(sprite){
        var mainPopupDispearTime = GLOBAL.mainPopupDispearTime;
        sprite.onmousedown = sprite.ontouchstart = function(){
            var dispearPopup = GLOBAL.dispearPopup;
            for(var i=0;i<iptArray.length;i++){
                iptArray[i].ipt.blur();
            }
            if(textInput.style.display == 'block'){
                if(!textInput.clicked){
                    onBlurEvent();
                }else{
                    textInput.clicked = false;
                }
            }
            setTimeout(function(){
                for(var i= 0,len=dispearPopup.length;i<len;i++){
                    if(!dispearPopup[i].clicked){
                        dispearPopup[i].visible(false);
                        window.appRender();
                    }else if(dispearPopup[i].clicked){
                        dispearPopup[i].clicked = false;
                    }
                }
            },mainPopupDispearTime);
        };
        sprite.onmouseup = sprite.ontouchend = function(){
            //window.appRender();
        }
    };
    /*设置所有的输入框的display属性为none*/
    var dispearAllInput = function(){
        for(var i=0;i<iptArray.length;i++){
            iptArray[i].set('display','none')
        }
    };
    /*input的公共类*/
    var inputClass = function(){

        this.iptOpen = function(){
            for(var i= 0,len=this.iptArray.length;i<len;i++){
                this.iptArray[i].setStyle({display : 'block'});
                this.iptArray[i].updateSize();
            }
        };

        this.iptClose = function(){
            for(var i= 0,len=this.iptArray.length;i<len;i++){
                this.iptArray[i].setStyle({display : 'none'});
            }
        };
    };
    /*刷新所有input的位置*/
    var resizeAllInput = function(){
        for(var i=0;i<iptArray.length;i++){
            iptArray[i].updateSize();
        }
    };
    /*隐藏指定的页面而隐藏其余的所有的页面*/
    var displayPage = function(page){
        var boxArray = ctx.boxArray;
        for(var i= 0,len=boxArray.length;i<len;i++){
            if(boxArray[i] == page){
                boxArray[i].visible(true);
            }else{
                boxArray[i].visible(false);
            }
        }
    };
    /*重置main页面的样式*/
    var resizeMain = function(){
        var fader = init.page.main.faderArray,
            len = fader.length- 1,
            faderBox = init.page.main.faderBox,
            scrollBar = init.page.main.boxTraverse.scrollBar;
        for(var i=0;i<len;i++){
            fader[i].sprite.visible(fader[i].visible);
            fader[i].sprite.setX(fader[i].x);
            fader[i].openEdit(false);
            fader[i].moveStart = false;
            fader[i].ch.interactive(true);
        }
        displayPage(ctx.main);
        dispearAllInput();
        resetMenuButton(5);
        faderBox.sprite.interactive = true;
        faderBox.visible(true);
        scrollBar.sprite.visible(true);
        init.page.main.resize();
        clearElementChangePos();
    };
    /*设置radio button*/
    var kbSetRadioButton = function(attr,a,b,c){
        var len = attr.length;
        switch(arguments.length){
            case 1 :
                for(var i=0;i<len;i++){
                    attr[i].radio(attr);
                    attr[i].switchColor();
                }
                break;
            case 2 :
                for(var i=0;i<len;i++){
                    attr[i].radio(attr);
                    attr[i].switchColor(a);
                }
                break;
            case 3 :
                for(var i=0;i<len;i++){
                    attr[i].radio(attr);
                    attr[i].switchColor(a,b);
                }
                break;
            case 4 :
                for(var i=0;i<len;i++){
                    attr[i].radio(attr);
                    attr[i].switchColor(a,b,c);
                }
                break;
        }
    };
    /*当被除数为0时返回0*/
    var division = function(a,b){
        if(b == 0){
            return 0;
        }else{
            return a/b;
        }
    };
    /*创建set页面的单元按钮*/
    var kbRadioButton = function(x,y,buttonW,buttonH,space,strButton,textColor,textFont,parent,func){
        var buttonImgLeft = [images[imgID.main_smallbutton_left],images[imgID.set_radiobutton_left_light]],
            buttonImgMiddle = [images[imgID.main_smallbutton_middle],images[imgID.set_radioButton_middle_light]],
            buttonImgRight = [images[imgID.main_smallbutton_right],images[imgID.set_radioButton_right_light]],
            buttonImgCenter = [images[imgID.set_button],images[imgID.set_button_light]],
            button,buttonArray = [],len = strButton.length;
        var sprite = new kbSprite(x,y,buttonW*len+space*(len+1),buttonH,parent);
        var bgY = .04,bgH = 1-bgY*2;
        new kbBoxBg(0,bgY,1,bgH,0x121216,sprite.sprite,true).setRadius(.18);
        var tmp = getSpriteActData(sprite.sprite);
        space = 1.52/tmp[2];
        buttonW = (1-space*len-space)/len;y = -.02;buttonH = 1.02;
        var buttonX = space,text,attrText = [];
        if(len == 1){
            button = new kbButton(0, -.05,1,1.1,buttonImgCenter,strButton[0],textColor,textFont,sprite.sprite);
            buttonArray.push(button);
        }else{
            for(var j= 0;j<len;j++){
                text = strButton[j];
                typeof text == 'string' ? attrText = text.split('\n') : attrText[0] = text;
                if(j == 0){
                    button = new kbButton(buttonX,y,buttonW,buttonH,buttonImgLeft,attrText[0],textColor,textFont,sprite.sprite);
                }else if(j == len-1){
                    button = new kbButton(buttonX,y,buttonW,buttonH,buttonImgRight,attrText[0],textColor,textFont,sprite.sprite);
                }else{
                    button = new kbButton(buttonX,y,buttonW,buttonH,buttonImgMiddle,attrText[0],textColor,textFont,sprite.sprite);
                }
                if(attrText.length >= 2){
                    button.text.setAnchor(.5,1);
                    button.text1 = new kbBoxText(.5,.5,attrText[1],textColor[0],'12px',button.sprite,.5, -.1);
                }
                buttonArray.push(button);
                buttonX += buttonW+space;
            }
            if(func != true){
                kbSetRadioButton(buttonArray,buttonEventTextColor);
            }
        }
        function buttonEventTextColor(button){
            for(var i= 0,len=buttonArray.length;i<len;i++){
                if(buttonArray[i].text1){
                    buttonArray[i].text1.setColor(textColor[0])
                }
                if(button.text1){
                    button.text1.setColor(textColor[1]);
                }
                if(func && button == buttonArray[i]){
                    if(func instanceof Array){
                        func[i]();
                    }else{
                        func(i);
                    }

                }
            }
        }
        return buttonArray;
    };
    /*去掉字符串中间和两头的空格*/
    var trim = function(str){
        return str.replace(/(^\s*)|(\s*$)/g,"");
    };
    /*对大于1000的数除以1000并加上单位K*/
    var kbKUnit = function(data){
        if(data >= 1000){
            return (data/1000).toFixed(1)+'k';
        }
        return data;
    };

    var setNO = function(num){
        var string = num+'';
        for(var i= 0,len=3-string.length;i<len;i++){
            string = 0+string;
        }
        return string;
    };
    /*libox的属性值*/
    var listSize = function(width,height){
        this.width = width;
        this.height = height;
    };

    var listMargin = function(top,left){
        this.top = top;
        this.left = left;
    };

    var listContent = function(text,color,font,align){
        this.text = text;
        this.color = color;
        this.font = font;
        this.align = align;
    };

    var listBorder = function(width,color,alpha){
        this.width = width;
        this.color = color;
        this.alpha = alpha;
    };

    var listColor = function(color,alpha){
        this.backGroundColor = color;
        this.alpha = alpha;
    };

    var listPosition = function(x,y){
        this.x = x;
        this.y = y;
    };
    /*根据值来判断按钮的背景0or1*/
    var kbChangeButtonColor = function(button,data){
        if(data == 1){
            button.eventFlag = true;
        }else{
            button.eventFlag = false;
        }
        button.chooseColor();
    };
    /*根据值来判断radio button的背景0or1*/
    var kbChangeRadioButtonColor = function(button,flag){
        if(button && flag){
            button.setColor(button.textureRep);
            button.text.setColor(button.colorSwitch);
        }else if(button && !flag){
            button.setColor(button.textureDef);
            button.text.setColor(button.color);
        }
        button.eventFlag = flag;
    };

    var kbChangeRadioButtonArrayColor = function(button,data){
        var flag;
        for(var i= 0,len=button.length;i<len;i++){
            if(button[i] instanceof Array){
                for(var j= 0,olen=button[i].length;j<olen;j++){
                    flag = j == data[i] ? 1 : 0;
                    kbChangeRadioButtonColor(button[i][j],flag)
                }
            }else{
                flag = i == data ? 1 : 0;
                kbChangeRadioButtonColor(button[i],flag)
            }
        }
    };

    var kbGroupChangeButtonColor = function(button,data){
        if(data == 1){
            button.eventFlag = true;
        }else{
            button.eventFlag = button.defEventFlag;
        }
        button.chooseColor();
    };
    /*设置fader的背景*/
    var faderSwitchBg = function(id){
        var faderArray = getFaderArray();
        for(var i= 0,len=faderArray.length;i<len;i++)forFunc(faderArray[i]);
        function forFunc(faderArray){
            for(var i = 0,len = faderArray.length;i<len;i++){
                if(i == id){
                    faderArray[i].switchBg(true);
                }else{
                    faderArray[i].switchBg(false);
                }
            }
        }
    };

    var elementResize = function(element,pos){
        element.resize(pos.x,pos.y,pos.width,pos.height);
    };
    /*选择edit左边显示的通道*/
    var chooseEditFader = function(onEdit){
        var fader = init.page.main.faderArray,len = fader.length,faderBox = init.page.main.faderBox,
            scrollBar = init.page.main.boxTraverse.scrollBar,edit = init.page.edit;
        for(var i=0;i<len;i++){
            if(fader[i].selected){
                fader[i].sprite.visible(true);
                if(i != len-1)fader[i].sprite.setX(-faderBox.sprite.position.x);
                fader[i].moveStart = true;
                fader[i].resize();
                //fader[i].sprite.clearChangePos();
                if(!onEdit){
                    edit.setLock(fader[i].lock);
                    edit.updateData(i);
                }
            }else{
                fader[i].sprite.visible(false);
            }
            if(i != len-1)fader[i].ch.interactive(false);
            fader[i].openEdit(true);
        }
        fader[len-1].sprite.visible(true);
        faderBox.interactive(false);
        faderBox.visible(true);
        scrollBar.sprite.visible(false);
        clearElementChangePos();
    };
    /*获取faderArray*/
    var getFaderArray = function(){
        return [init.page.main.faderArray,init.page.ports.faderArray,init.page.sends.reverb.faderArray,init.page.sends.echo.faderArray]
    };
    /*设置菜单按钮的状态*/
    var resetMenuButton = function(id){
        for(var i=0,len=menuButton.length;i<len;i++){
            if(id != i){
                menuButton[i].setColor(menuButton[i].imageDef);
                menuButton[i].color && menuButton[i].text.setColor(menuButton[i].color);
            }else{
                menuButton[i].setColor(menuButton[i].imageRep);
                menuButton[i].colorSwitch && menuButton[i].text.setColor(menuButton[i].colorSwitch);
            }
        }
    };
    /*获取系统当前的时间*/
    var getNewDate = function(){
        var date = new Date();
        var year = date.getFullYear(),
            mouth = date.getMonth()+1,
            day = date.getDate(),
            hour = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();
        return {
            year : year,
            mouth : mouth,
            day : day,
            hour : hour,
            minutes : minutes,
            seconds : seconds
        }
    };

    var sliderInputEvent = function(slider,val,multiple){
        multiple = multiple ? multiple : 1;
        slider.data[slider.dataAttr] = val*multiple;
        slider.update(false,true);
        slider.sendData();
    };
    /*方便设置数据到控件中*/
    var setItemData = function(button,header,data,attr,formula,sendData){
        var setSendData = sendData ? sendData : data;
        var type = header.para.type;
        var ch = header.para.ch;
        var index = header.para.index;
        var pf = header.para.pf;
        var hl = header.para.hl;
        button.setSendHeader(header);
        button.setSendData(setSendData);
        button.setData(data,attr,formula);
        for(var i= 0,len=updateWidgetArray.length;i<len;i++){
            var bnt = updateWidgetArray[i];
            if(bnt.button == button && bnt.type == type && bnt.ch == ch && bnt.index == index && bnt.hl == hl){
                return;
            }
        }
        updateWidgetArray.push({button : button,type : type,ch : ch,index : index,pf : pf,data : data,attr : attr,hl : hl});
    };

    window.GLOBAL.updateWidget = function(type,ch,index,pf,data,hl){
        var buttonData,button;
        for(var i= 0,len=updateWidgetArray.length;i<len;i++){
            buttonData = updateWidgetArray[i];
            button = updateWidgetArray[i].button;
            if(buttonData.type == type && buttonData.ch == ch && buttonData.index == index && buttonData.pf == pf && buttonData.hl == hl){
                buttonData.data[buttonData.attr] = data[buttonData.attr];
                if(typeof button === "function"){
                    button(buttonData);
                    return;
                }
                if(button.paraHeader.ch == ch && data[buttonData.attr] != button.sendOldData && button.update){

                    button.update();
                }
            }
        }
    };
    /*创建stage*/
    var kbStage = function(){
        this.boxArray = [];
        this.createRender();
        this.createNav();
        this.createMain();
        this.createEdit();
        this.createPorts();
        this.createSends();
        this.createGroup();
        this.createScene();
        this.createSet();
        this.createTitle();
        this.createPopup();
        this.createLogin();
        this.createLoad();
    };

    kbStage.prototype.createRender = function(){
        var options = {
            width : staticDataLocal.render.width,
            height : staticDataLocal.render.height,
            view : false,
            transparent : true,
            antialias : true,
            preserveDrawingBuffer : true,
            resolution : 1,
            forceCanvas : true,
            legacy : true,
            sharedTicker : false,
            sharedLoader : false,
            clearBeforeRender : true,
            autoSize : true
        };
        this.app = new PIXI.Application(options);
        this.renderer = this.app.renderer;
        this.app.view.id = 'render';
        document.body.appendChild(this.app.view);
        this.stage = new PIXI.Container();
        this.stage.interactiveChildren = false;
        GLOBAL.stage = this.stage;
        unBlur(this.app.view);
        this.app.ticker.add(fixedScale);
        //this.app.ticker.add(testTime);
        this.app.stage.addChild(this.stage);
        var startTime = Date.now(),now,count = 0;
        function testTime(){
            if(count == 100){
                count = 0;
                now = Date.now();
                //console.log("____ render interval:"+(now-startTime));
                if(isPc)return;
                alert("____ render interval: %d ms:"+(now-startTime));
                startTime = Date.now();
            }
            count ++;
        }
    };

    kbStage.prototype.createTitle = function(){
        var titlePos = staticDataLocal.title.title;
        this.title = new kbSprite(titlePos.x,titlePos.y,titlePos.width,titlePos.height,this.stage);
        new kbCanvasBg(0,0,1,1,canvasCache.titleBg,this.title.sprite);
    };

    kbStage.prototype.createSet = function(){
        var setPos = staticDataLocal.set.set;
        this.set = new kbSprite(setPos.x,setPos.y,setPos.width,setPos.height,this.stage);
        this.boxArray.push(this.set);
    };

    kbStage.prototype.createMain = function(){
        var mainPos = staticDataLocal.main.main;
        this.main = new kbSprite(mainPos.x,mainPos.y,mainPos.width,mainPos.height,this.stage);
        new kbCanvasBg(0,0,1,1,canvasCache.boxBg,this.main.sprite);
    };

    kbStage.prototype.createScene = function(){
        var scenePos = staticDataLocal.scene.scene;
        this.scene = new kbSprite(scenePos.x,scenePos.y,scenePos.width,scenePos.height,this.stage);
        //new kbBoxBg(0,0,1,1,staticDataColor.scene.background,this.scene.sprite);
        this.boxArray.push(this.scene);
    };

    kbStage.prototype.createNav = function(){
        var navPos = staticDataLocal.nav.nav;
        this.nav = new kbSprite(navPos.x,navPos.y,navPos.width,navPos.height,this.stage);
        new kbCanvasBg(0,0,1,1,canvasCache.boxBg,this.nav.sprite);
        new kbLine(0,1,1,1,0x000000,this.nav.sprite,2/navPos.height);
    };

    kbStage.prototype.createEdit = function(){
        var editPos = staticDataLocal.edit.edit;
        this.edit = new kbSprite(editPos.x,editPos.y,editPos.width,editPos.height,this.stage);
        this.boxArray.push(this.edit);
    };

    kbStage.prototype.createPorts = function(){
        var portsPos = staticDataLocal.ports.ports,boxColor = staticDataColor.ports.box;
        this.ports = new kbSprite(portsPos.x,portsPos.y,portsPos.width,portsPos.height,this.stage);
        var mask = new kbBoxBg(0,0,1,1,boxColor,this.ports.sprite);
        this.ports.sprite.mask = mask.graphics;
        this.boxArray.push(this.ports);
    };

    kbStage.prototype.createSends = function(){
        var sendsPos = staticDataLocal.sends.sends,boxColor = staticDataColor.sends.box;
        this.sends = new kbSprite(sendsPos.x,sendsPos.y,sendsPos.width,sendsPos.height,this.stage);
        new kbBoxBg(0,0,1,1,boxColor,this.sends.sprite);
        this.boxArray.push(this.sends);
    };

    kbStage.prototype.createGroup = function(){
        var groupPos = staticDataLocal.group.group,boxColor = staticDataColor.group.box;
        this.group = new kbSprite(groupPos.x,groupPos.y,groupPos.width,groupPos.height,this.stage);
        //new kbBoxBg(0,0,1,1,boxColor,this.group.sprite);
        this.boxArray.push(this.group);
    };

    kbStage.prototype.createPopup = function(){
        var popupPos = staticDataLocal.popup.popup;
        this.popup = new kbSprite(popupPos.x,popupPos.y,popupPos.width,popupPos.height,this.stage);
    };

    kbStage.prototype.createLogin = function(){
        var mask = staticDataLocal.mask.box,color = staticDataColor.mask.box;
        this.mask = new kbSprite(mask.x,mask.y,mask.width,mask.height,this.stage);
        new kbBoxBg(0,0,1,1,color,this.mask.sprite,.5);
        this.mask.visible(false);
        this.mask.sprite.interactive = true;
        this.mask.onEvent('mousedown',stopEvent);
        this.mask.onEvent('touchstart',stopEvent);
        function stopEvent(event){
            event.stopPropagation();
        }
    };

    kbStage.prototype.createLoad = function(){
        var loadContentPos = staticDataLocal.load.content;
        this.loadPage = new kbSprite(0,0,staticDataLocal.render.width,staticDataLocal.render.height,this.stage);
        new kbCanvasBg(0,0,1,1,canvasCache.titleBg,this.loadPage.sprite);
        this.loadContent = new kbSprite(loadContentPos.x,loadContentPos.y,loadContentPos.width,loadContentPos.height,this.loadPage.sprite);
        new kbImg(.25,0,.5,.5,'../images/logo.png',this.loadContent.sprite);
        new kbBoxText(.5,.7,'LOAD.....','0xFFFFFF','30px',this.loadContent.sprite,.5);
        var progressData = {
            x:0,
            y :.9,
            width :1,
            height:.08,
            backgroundColor : staticDataColor.setUpgrade.progressBackground,
            backgroundAlpha : 1,
            color : canvasCache.setUpgradeProgress,
            radius:.5,
            parent : this.loadContent.sprite
        };
        this.loadPage.progress = new progressBar(progressData);
    };

    kbStage.prototype.resize = function(){
        var mainPos = staticDataLocal.main.main,posEdit = staticDataLocal.edit.edit,portsPos = staticDataLocal.ports.ports,
            groupPos = staticDataLocal.group.group,setPos = staticDataLocal.set.set,scenePos = staticDataLocal.scene.scene,
            sendsPos = staticDataLocal.sends.sends,rendererSize = staticDataLocal.render,titlePos = staticDataLocal.title.title,
            navPos = staticDataLocal.nav.nav,maskPos = staticDataLocal.mask.box,loadContentPos = staticDataLocal.load.content;
        mainPos.height = boundaryValue(mainPos.height,370);
        this.nav.resize(navPos.x,navPos.y,navPos.width,navPos.height);
        //this.navBg.resize(navPos.x,navPos.y,navPos.width,navPos.height);
        this.title.resize(titlePos.x,titlePos.y,titlePos.width,titlePos.height);
        //this.titleBg.resize(titlePos.x,titlePos.y,titlePos.width,titlePos.height);
        this.main.resize(mainPos.x,mainPos.y,mainPos.width,mainPos.height);
        //this.mainBg.resize(mainPos.x,mainPos.y,mainPos.width,mainPos.height);
        this.edit.resize(posEdit.x,posEdit.y,posEdit.width,posEdit.height);
        this.ports.resize(portsPos.x,portsPos.y,portsPos.width,portsPos.height);
        this.group.resize(groupPos.x,groupPos.y,groupPos.width,groupPos.height);
        this.set.resize(setPos.x,setPos.y,setPos.width,setPos.height);
        this.scene.resize(scenePos.x,scenePos.y,scenePos.width,scenePos.height);
        this.sends.resize(sendsPos.x,sendsPos.y,sendsPos.width,sendsPos.height);
        this.mask.resize(maskPos.x,maskPos.y,maskPos.width,maskPos.height);
        this.renderer.resize(rendererSize.width,rendererSize.height);
        this.loadPage.resize(0,0,rendererSize.width,rendererSize.height);
        this.loadContent.resize(loadContentPos.x,loadContentPos.y,loadContentPos.width,loadContentPos.height);
    };
    /*创建uploader*/
    var kbUpload = function(){
        var data = {
            x : 300,
            y : 100,
            width : 500,
            height : 400,
            parent : ctx.stage,
            readFunc : webOnMsg,
            sendFunc : sendData,
            noList : true,
            noMessage : true,
            id : []
        };
        upload = new Uploader(data);
        upload.message = new kbMessage({noButton : true});
    };

    var loginInputDisabled = function(flag){
        for(var i= 0,len=iptArray.length;i<len;i++){
            if(iptArray[i].ipt.style.display == 'block'){
                iptArray[i].ipt.disabled = flag;
            }
        }
    };
    /*创建title部分*/
    var kbTitle = function(){
        this.titleBox = ctx.title.sprite;
        this.sceneButton();
        this.indexBnt();
        this.information();
        this.user();
    };

    kbTitle.prototype.sceneButton = function(){
        var scenePos = staticDataLocal.title.scene;
        this.sceneBnt = new kbButton(scenePos.x,scenePos.y,scenePos.width,scenePos.height,[images[imgID.main_scene],images[imgID.main_scene_light]],staticDataString.title.scene,staticDataColor.title.text.scene,staticDataFont.title.scene,this.titleBox);
        this.sceneBnt.switchColor(sceneEvent);
        menuButton.push(this.sceneBnt);
        function sceneEvent(){
            if(!ctx.scene.sprite.visible){
                resetMenuButton(0);
                displayPage(ctx.scene);
                dispearAllInput();
                ctx.main.visible(true);
                init.page.main.faderBox.visible(false);
                init.page.scene.updateData();
            }else{
                resizeMain();
            }
        }
    };

    kbTitle.prototype.indexBnt = function(){
        var smallButtonPos = staticDataLocal.title.smallButton;
        this.indexBg = new kbImg(smallButtonPos.x,smallButtonPos.y,smallButtonPos.width,smallButtonPos.height,images[imgID.main_bigbutton_background],this.titleBox);
        this.indexSprite = new kbSprite(smallButtonPos.x,smallButtonPos.y,smallButtonPos.width,smallButtonPos.height,this.titleBox);
        var textArray = staticDataString.title.indexTab,textColor = [staticDataColor.title.text.index,staticDataColor.title.text.indexLight];
        var textFont = staticDataFont.title.index,bntArray = new Array(4),bnt,indexEventArray = [],space = .004,x = space,width = (1-space*5)/4;
        for(var i=0;i<4;i++){
            if(i == 0){
                bnt = new kbButton(x,0,width,1,[images[imgID.main_smallbutton_left],images[imgID.main_smallbutton_left_light]],textArray[i],textColor,textFont,this.indexSprite.sprite);
            }else if(i == 3){
                bnt = new kbButton(x,0,width,1,[images[imgID.main_smallbutton_right],images[imgID.main_smallbutton_right_light]],textArray[i],textColor,textFont,this.indexSprite.sprite);
            }else{
                bnt = new kbButton(x,0,width,1,[images[imgID.main_smallbutton_middle],images[imgID.main_smallbutton_middle_light]],textArray[i],textColor,textFont,this.indexSprite.sprite);
            }
            x += width+space;
            bntArray[i] = bnt;
            menuButton.push(bnt);
        }
        kbSetRadioButton(bntArray,clickIndexButtonEvent);
        function clickIndexButtonEvent(e){
            for(var i=0;i<4;i++){
                if(bntArray[i] == e){
                    indexEventArray[i]();
                }
            }
        }

        function openPorts(){
            if(!ctx.ports.sprite.visible){
                resetMenuButton(1);
                dispearAllInput();
                var scrollBar = init.page.main.boxTraverse.scrollBar;
                scrollBar.sprite.visible(false);
                displayPage(ctx.ports);
                ctx.main.visible(true);
                init.page.main.faderBox.visible(false);
                init.page.ports.updateData();
            }else{
                resizeMain();
            }
        }

        this.openEdit = function(){
            if(!ctx.edit.sprite.visible){
                resetMenuButton(2);
                displayPage(ctx.edit);
                dispearAllInput();
                ctx.main.visible(true);
                chooseEditFader();
            }else{
                resizeMain();
            }
        };

        function openSends(){
            if(!ctx.sends.sprite.visible){
                resetMenuButton(3);
                dispearAllInput();
                var scrollBar = init.page.main.boxTraverse.scrollBar;
                scrollBar.sprite.visible(false);
                displayPage(ctx.sends);
                ctx.main.visible(true);
                init.page.main.faderBox.visible(false);
                init.page.sends.updateData();
            }else{
                resizeMain();
            }
        }

        function openGroup(){
            if(!ctx.group.sprite.visible){
                resetMenuButton(4);
                dispearAllInput();
                displayPage(ctx.group);
                ctx.main.visible(true);
                init.page.main.faderBox.visible(false);
                init.page.group.updateData();
            }else{
                resizeMain();
            }
        }

        indexEventArray = [openPorts,this.openEdit,openSends,openGroup];
    };

    kbTitle.prototype.player = function(){
        var playerPos = staticDataLocal.title.player;
        this.player = new kbSprite(playerPos.x,playerPos.y,playerPos.width,playerPos.height,this.titleBox);
        new kbImg(0,0,1,.5,images[imgID.main_bigbutton_background],this.player.sprite);
        var place = .003,x = place,bnt;
        var width = (1-place*6)/5;
        for(var i=0;i<5;i++){
            if(i == 0){
                bnt = new kbButton(x,0,width,.5,[images[imgID.main_smallbutton_left],images[imgID.main_smallbutton_left_light]],'','white','12pt',this.player.sprite);
            }else if(i == 4){
                bnt = new kbButton(x,0,width,.5,[images[imgID.main_smallbutton_right],images[imgID.main_smallbutton_right_light]],'','white','12pt',this.player.sprite);
            }else{
                bnt = new kbButton(x,0,width,.5,[images[imgID.main_smallbutton_middle],images[imgID.main_smallbutton_middle_light]],'','white','12pt',this.player.sprite);
            }
            x += width+place;
        }
        this.playerSelect = new kbButton(0,.5,1.,.5,[images[imgID.main_informationbutton],images[imgID.main_informationbutton_light]],'','white','12pt',this.player.sprite);
    };

    kbTitle.prototype.information = function(){
        var infoPos = staticDataLocal.title.info,string = staticDataString.title,color = staticDataColor.title,font = staticDataFont.title,
            textColor = color.text.info,tempColor = color.text.temp,textFont = font.info,smallButtonPos = staticDataLocal.title.smallButton;
        this.informationSprite = new kbSprite(infoPos.x,infoPos.y,infoPos.width,infoPos.height,this.titleBox);
        this.informationButton = new kbButton(0,0,1,1,[images[imgID.main_informationbutton],images[imgID.main_informationbutton_light]],'','white','12pt',this.informationSprite.sprite);
        if(infoPos.x < smallButtonPos.x+smallButtonPos.width){
            this.informationSprite.visible(false);
        }else{
            this.informationSprite.visible(true);
        }
        var lock = new kbImg(.93,.2,.065,.26,images[imgID.lock_white],this.informationSprite.sprite);
        lock.sprite.anchor.set(.5,0);

        new kbBoxText(.93,1,'!','white','28px',this.informationSprite.sprite,.5,1.2);
        var y = .47;
        new kbBoxText(.04,y,string.infoOnline,textColor,textFont,this.informationSprite.sprite,0,1);
        var online = new kbBoxText(.26,y,'5',textColor,textFont,this.informationSprite.sprite,0,1);

        new kbBoxText(.32,y,string.infoAdmin,textColor,textFont,this.informationSprite.sprite,0,1);
        var admin = new kbBoxText(.53,y,'5',textColor,textFont,this.informationSprite.sprite,0,1);

        new kbBoxText(.59,y,string.infoUser,textColor,textFont,this.informationSprite.sprite,0,1);

        y = .53;

        //new kbBoxText(.04,y,string.infoState,textColor,textFont,this.informationSprite.sprite,0,0);
        //var state = new kbBoxText(.23,y,'no fault',textColor,textFont,this.informationSprite.sprite,0,0);

        new kbBoxText(.04,y,'Version:',textColor,textFont,this.informationSprite.sprite,0,0);
        var state = new kbBoxText(.25,y,GLOBAL.version,textColor,textFont,this.informationSprite.sprite,0,0);

        var temp = new kbBoxText(.6,y,string.temp,tempColor,textFont,this.informationSprite.sprite,0,0);

        this.setInfo = function(){
            var onlineCount = 0,adminCount = 0;
            for(var i= 0,len=userData.length;i<len;i++){
                if(jugeStateValue(userData[i].type) == 'on line'){
                    onlineCount += 1;
                }
                if(jugeRoleValue(userData[i].perm.role) == 'Admin'){
                    adminCount += 1;
                }
            }
            online.setText(onlineCount+'');
            admin.setText(adminCount+'');
        }
    };

    kbTitle.prototype.user = function(){
        var userPos = staticDataLocal.title.user,his = this;
        this.login = new kbLogin();
        this.signOut = new kbSignOut(loginEvent,this.login.loginBnt);

        this.userSprite = new kbSprite(userPos.x,userPos.y,userPos.width,userPos.height,this.titleBox);
        this.userBnt = new kbButton(0,0,1,1,[images[imgID.main_scene],images[imgID.main_scene_light]],'','','',this.userSprite.sprite);
        this.userBnt.bounce();
        this.userBnt.switchColor(loginEvent);

         new kbImg(.3,.47,.16,.25,images[imgID.user_head],this.userSprite.sprite).sprite.anchor.set(1,1);

        this.adom = new kbBoxText(.35,.5,'Adom',staticDataColor.title.text.user,staticDataFont.title.user,this.userSprite.sprite,0,1);
        this.name = new kbBoxText(.5,.55,'',staticDataColor.title.text.user,staticDataFont.title.user,this.userSprite.sprite,.5,0);

        function loginEvent(){
            loginInputDisabled(true);
            ctx.mask.visible(true);
            if(!GLOBAL.loginFlag){
                his.login.sprite.visible(true);
                his.signOut.sprite.visible(false);
                his.login.iptOpen();
                var localData = localStorage.getItem('userName'),content = his.login.select.content;
                localData = localData == null ? [] : localData.split(',');
                for(var i= 0,len=localData.length;i<len;i++){
                    if(content[i] != localData[i]){
                        his.login.select.content = localData;
                        his.login.select.paint();
                        break;
                    }
                }
            }else{
                his.login.sprite.visible(false);
                his.signOut.sprite.visible(true);
            }
        }
    };

    kbTitle.prototype.resize = function(){
        var titlePos = staticDataLocal.title,smallButtonPos = titlePos.smallButton;
        this.sceneBnt.sprite.width = titlePos.scene.width;
        this.indexSprite.resize(smallButtonPos.x,smallButtonPos.y,smallButtonPos.width,smallButtonPos.height);
        this.indexBg.resize(smallButtonPos.x,smallButtonPos.y,smallButtonPos.width,smallButtonPos.height);
        this.informationSprite.setX(titlePos.info.x);
        this.informationSprite.setWidth(titlePos.info.width);
        if(titlePos.info.x < titlePos.smallButton.x+titlePos.smallButton.width){
            this.informationSprite.visible(false);
        }else{
            this.informationSprite.visible(true);
        }
        this.userSprite.resize(titlePos.user.x,titlePos.user.y,titlePos.user.width,titlePos.user.height);
        this.login.resize();
    };

    kbTitle.prototype.updateData = function(){
        this.setInfo();
        this.login.setData();
        this.signOut.setData();
    };

    kbTitle.prototype.setLock = function(flag){
        this.lock = flag;
        this.informationSprite.sprite.interactiveChildren = !flag;
        this.indexSprite.sprite.interactiveChildren = !flag;
        this.sceneBnt.sprite.interactiveChildren = !flag;
    };

    var kbNav = function(){
        this.parent = ctx.nav.sprite;
        this.navPos = staticDataLocal.nav;
        this.mainButton();
        this.group();
        this.setButton();
        //this.setLock(true);
    };

    kbNav.prototype.mainButton = function(){
        var mainPos = this.navPos.main;
        this.mainSprite = new kbSprite(mainPos.x,mainPos.y,mainPos.width,mainPos.height,this.parent);
        this.mainBnt = new kbButton(0,0,1,1,[images[imgID.main_mainbutton],images[imgID.main_mainbutton_light]],staticDataString.nav.main,staticDataColor.nav.text,staticDataFont.nav.main,this.mainSprite.sprite);
        this.mainBnt.switchColor(mainBntEvent);
        menuButton.push(this.mainBnt);
        this.mainBnt.setColor(this.mainBnt.imageRep);
        function mainBntEvent(){
            resizeMain();
        }
    };

    kbNav.prototype.group = function(){
        var groupBoxPos = this.navPos.group,maskPos = this.navPos.mask,his = this,bntWidth = 1/10.89,space = 1/500,x = 0,text = staticDataString.nav.nav,
            textColor = [staticDataColor.nav.text,staticDataColor.nav.textDown],font = staticDataFont.nav.group,
            lenText = text.length,bnt,bntSpace,bntArray = [],back,groupButtonIndex = 0,faderX,faderWidth,a = 0;
        var headerMute = new sendHeader.adsp_gain(0),headerSolo = new sendHeader.adsp_solo(0);
        this.groupMask = new kbSprite(maskPos.x,maskPos.y,maskPos.width,maskPos.height,this.parent);
        this.groupMask.sprite.mask = new kbBoxBg(0,0,1,1,0x000000,this.groupMask.sprite).graphics;
        var buttonLightIndex = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],groupAttr1 =['view','mute','solo'],groupAttr2 = ['input','fx','output','1','2','3','4'];
        this.groupBox = new kbSprite(groupBoxPos.x,groupBoxPos.y,groupBoxPos.width,groupBoxPos.height,this.groupMask.sprite);
        this.switchBnt = new switchArraw(x,.05,bntWidth/2.5,.9,this.groupBox.sprite,1,.1,0xFFFFFF,1,[images[imgID.arrawOpen],images[imgID.arrawClose]]);
        x += bntWidth/2;
        for(var i=0;i<lenText;i++){
            var len = text[i].length;
            bntSpace = .01/(len+1);
            back = new kbImg(x,.02,bntWidth*len +.01,.96,images[imgID.main_bigbutton_background],this.groupBox.sprite);
            x += bntSpace;
            for(var j=0;j<len;j++){
                if(i == 0){
                    if(j == 0){
                        bnt = new kbButton(x,0,bntWidth,1,[images[imgID.main_viewbutton_left],images[imgID.main_viewbutton_left_light]],text[i][j],textColor,font[i],this.groupBox.sprite);
                    }else if(j == len-1){
                        bnt = new kbButton(x,0,bntWidth,1,[images[imgID.main_viewbutton_right],images[imgID.main_viewbutton_right_light]],text[i][j],textColor,font[i],this.groupBox.sprite);
                    }else{
                        bnt = new kbButton(x,0,bntWidth,1,[images[imgID.main_viewbutton_middle],images[imgID.main_viewbutton_middle_light]],text[i][j],textColor,font[i],this.groupBox.sprite);
                    }
                    bnt.index = j;
                }else{
                    if(j == 0){
                        bnt = new kbButton(x,0,bntWidth,1,[images[imgID.main_smallbutton_left],images[imgID.main_inputbutton_left_light]],text[i][j],textColor,font[i],this.groupBox.sprite);
                    }else if(j == len-1){
                        bnt = new kbButton(x,0,bntWidth,1,[images[imgID.main_smallbutton_right],images[imgID.main_inputbutton_right_light]],text[i][j],textColor,font[i],this.groupBox.sprite);
                    }else{
                        bnt = new kbButton(x,0,bntWidth,1,[images[imgID.main_smallbutton_middle],images[imgID.main_inputbutton_middle_light]],text[i][j],textColor,font[i],this.groupBox.sprite);
                    }
                    bnt.switchColor(buttonEvent);
                    bnt.index = a;
                    a++;
                }
                x += bntWidth + bntSpace;
                bntArray.push(bnt);
            }
            if(i == 0){
                kbSetRadioButton(bntArray,groupButtonEvent);
            }
            x += space;
        }
        kbChangeButtonColor(bntArray[0],1);

        function groupButtonEvent(button){
            groupButtonIndex = button.index;
            for(var i=3;i<10;i++){
                kbChangeButtonColor(bntArray[i],buttonLightIndex[groupButtonIndex][i-3]);
            }
        }

        function buttonEvent(button){
            var index = button.index,idArray = [],eventFlag = button.eventFlag;
            buttonLightIndex[groupButtonIndex][index] = eventFlag;
            for(var i= 0,len=chID.DSP_CH_NUM;i<len;i++){
                if(groupData[groupAttr1[groupButtonIndex]][groupAttr2[index]][i] == true){
                    idArray.push(i)
                }
            }
            setFaderButton(idArray,groupButtonIndex,eventFlag);
        }

        function setFaderButton(idArray,index,flag){
            var main = init.page.main,faderArray = main.faderArray,count = 0, i,len;
                faderX = 0;faderWidth = staticDataLocal.main.fader.width;
            if(index == 0){
                for(i= 0,len=faderArray.length-1;i<len;i++){
                    if(flag){
                        if(inArray(idArray,i)){
                            faderChange(faderArray[i],index,flag,flag,flag);
                        }else{
                            faderChange(faderArray[i],index,false,flag,flag);
                        }
                    }else{
                        faderChange(faderArray[i],index,true,flag,flag);
                    }
                    count ++;
                }
                main.boxTraverse.resize(1-faderWidth*count);
            }else{
                for(i= 0,len=idArray.length;i<len;i++){
                    faderChange(faderArray[idArray[i]],index,true,flag,flag,idArray[i]);
                }
                send(index,idArray);
            }
        }

        function send(index,idArray){
            if(idArray.length <= 0){
                return;
            }
            var group = setHeaderGroup(idArray);
            if(index == 1){
                headerMute.para.group = group;
                sendData({pktHeader : headerMute.pkt,paraHeader : headerMute.para,data : items[idArray[0]].gain});
            }else{
                headerSolo.para.group = group;
                for(var i= 0,len=soloData.length;i<len;i++){
                    if(inArray(idArray,i)){
                        soloData[i] = boolean2number(!soloData[i]);
                    }
                }
                sendData({pktHeader : headerSolo.pkt,paraHeader : headerSolo.para,data : soloData});
            }
        }

        function faderChange(fader,index,flag1,flag2,flag3,id){
            if(index == 0){
                if(!ctx.edit.sprite.visible && !ctx.group.sprite.visible){
                    fader.sprite.visible(flag1);
                }
                fader.sprite.visible(flag1);
                if(flag1){
                    fader.x = faderX;
                    fader.sprite.setX(faderX);
                    faderX += faderWidth;
                }
            }else if(index == 1){
                kbGroupChangeButtonColor(fader.mute,flag2);
                items[id].gain.mute = boolean2number(flag2);
            }else if(index == 2){
                kbGroupChangeButtonColor(fader.solo,flag3);
                items[id].gain.solo = boolean2number(flag3);
            }
        }

        moveButton();
        function moveButton(){
            var groupBoxMove =  new lineMove(his.groupBox.sprite,500,'x');
            var flag = true;
            his.switchBnt.interactive(true);
            his.switchBnt.onEvent('mousedown',onGroupBoxMove);
            his.switchBnt.onEvent('touchstart',onGroupBoxMove);
            function onGroupBoxMove(){
                var groupBoxPos = staticDataLocal.nav.group;
                var moveStart = groupBoxPos.x,moveEnd = 1-(bntWidth/2)*groupBoxPos.width;
                if(flag){
                    groupBoxMove.action(moveStart,moveEnd);
                    his.switchBnt.switch();
                }else{
                    groupBoxMove.action(moveEnd,moveStart);
                    his.switchBnt.switch();
                }
                flag = !flag;
            }
        }
    };

    kbNav.prototype.setButton = function(){
        var setPos = this.navPos.set;
        this.setSprite = new kbSprite(setPos.x,setPos.y,setPos.width,setPos.height,this.parent);
        this.setBnt = new kbButton(0,0,1,1,[images[imgID.main_mainbutton],images[imgID.main_mainbutton_light]],staticDataString.nav.set,staticDataColor.nav.text,staticDataFont.nav.logo,this.setSprite.sprite);
        //this.setBnt.bounce();
        this.setBnt.switchColor(setBntEvent);
        menuButton.push(this.setBnt);
        function setBntEvent(){
            if(!ctx.set.sprite.visible){
                resetMenuButton(6);
                displayPage(ctx.set);
                dispearAllInput();
                ctx.main.visible(true);
                init.page.main.faderBox.visible(false);
                init.page.set.updateData();
            }else{
                resizeMain();
            }
        }
    };

    kbNav.prototype.resize = function(){
        var navPos = staticDataLocal.nav,maskPos = navPos.mask,mainPos = navPos.main,
            groupPos = navPos.group,setPos = navPos.set;
        this.groupMask.resize(maskPos.x,maskPos.y,maskPos.width,maskPos.height);
        this.mainSprite.resize(mainPos.x,mainPos.y,mainPos.width,mainPos.height);
        this.groupBox.resize(groupPos.x,groupPos.y,groupPos.width,groupPos.height);
        this.setSprite.resize(setPos.x,setPos.y,setPos.width,setPos.height);;
    };

    kbNav.prototype.setLock = function(flag){
        this.lock = flag;
        this.parent.interactiveChildren = !flag;
    };
    /*创建推子组件*/
    var kbFader = function(bg,parent,x,y,width,height,id,flag,func){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.parent = parent;
        this.bg = bg;
        this.id = id;
        this.flag = flag;
        this.sliderFunc = func;
        this.visible = true;
        this.lock = false;
        this.sprite = new kbSprite(this.x,this.y,this.width,this.height,this.parent);
        this.selected = false;
        this.relate = [this];
        this.chAct = 37;
        this.spaceActH = 5;
        this.resetLocal();
    };

    kbFader.prototype.setData =  function(){
        switch(this.flag){
            case 'ch' :
                if(this.id >= chID.CH_IN_NUM && this.id < chID.CH_MASTER){
                    setItemData(this.slider,new sendHeader.adsp_gain(this.id),items[this.id].gain,'gain',formula.main_slider);
                    setItemData(this.mute,new sendHeader.adsp_gain(this.id),items[this.id].gain,'mute');
                }else if(this.id == chID.CH_USER){
                    setItemData(this.slider,new sendHeader.adsp_panGain(this.id),items[this.id].panGain,'gain',formula.main_slider);
                    setItemData(this.mute,new sendHeader.adsp_panGain(this.id),items[this.id].panGain,'mute');
                    setItemData(this.panSlider,new sendHeader.adsp_panGain(this.id),items[this.id].panGain,'pan',formula.ch_pan);
                }else{
                    setItemData(this.slider,new sendHeader.adsp_mixerpan(this.id),items[this.id].mixerpan,'gain',formula.main_slider);
                    setItemData(this.mute,new sendHeader.adsp_mixerpan(this.id),items[this.id].mixerpan,'mute');
                    setItemData(this.panSlider,new sendHeader.adsp_mixerpan(this.id),items[this.id].mixerpan,'pan',formula.ch_pan);
                }
                break;
            case 'main' :
                setItemData(this.slider,new sendHeader.adsp_gain(this.id),miscData.gain,'gain',formula.main_slider);
                setItemData(this.mute,new sendHeader.adsp_gain(this.id),miscData.gain,'mute');
                break;
            case 'ports' :
                setItemData(this.slider,new sendHeader.adsp_gain(this.id),items[this.id].gain,'gain',formula.main_slider);
                setItemData(this.mute,new sendHeader.adsp_gain(this.id),items[this.id].gain,'mute');
                this.vBnt.disable && setItemData(this.vBnt,new sendHeader.adsp_ppower(this.id),items[this.id].ppower,'on');
                setItemData(this.emptyBnt,new sendHeader.adsp_gain(this.id),items[this.id].gain,'reverse');
                break;
            case 'sends' :
                var attr = this.tabIndex == 0 ? 'reverb_ratio' : 'echo_ratio';
                setItemData(this.slider,new sendHeader.adsp_mixerpan(this.id),items[this.id].mixerpan,attr,formula.sendsSlider);
                break;
        }
        this.ch && this.ch.setText(items[this.id].name.name);
        if(this.flag == 'ch' || this.flag == 'ports' || this.flag == 'sends'){
            if(this.id == 6){
                this.chCountText = 'Player R';
            }else if(this.id == 11){
                this.chCountText = '';
            }else{
                this.chCountText = 'CH'+(this.id+1);
            }
        }
    };

    kbFader.prototype.paintBg = function(){
        if(typeof this.bg == 'number' || typeof  this.bg == 'string'){
            var borderColor = staticDataColor.fader.border;
            this.background = new kbBoxBg(0,0,1,1,this.bg,this.sprite.sprite,true);
            this.background.setBorder(1,borderColor,1);
        }else{
            this.bgCanvas = new kbCanvasBg(0,0,1,1,this.bg,this.sprite.sprite);
        }
    };

    kbFader.prototype.paintStatus = function(flag){
        var his = this;
        this.sliderText = '0dB';
        this.statusSprite = new kbSprite(this.spaceX,this.marginY,this.boxW,this.displayHeight,this.sprite.sprite);
        if(!flag)new kbImg(0,0,1,1,images[imgID.main_Display],this.statusSprite.sprite);
        this.statusText = new kbBoxText(.5,.5,this.sliderText,staticDataColor.fader.text.status,staticDataFont.fader.status,this.statusSprite.sprite,.5);
        this.statusText.setInput(textInput,this.statusSprite.sprite,inputEvent);
        this.statusText.setRenderClearRect(this.statusSprite.sprite,0x373740);
        this.marginY += this.displayHeight;
        function inputEvent(val){
            var slider = his.slider,multiple = his.sliderMultiple;
            if(his.flag == 'sends' || his.flag == 'editSends'){
                val = boundaryValue(val,-800,0);
                val = formula.sends(val,true);
            }
            val = boundaryValue(val,-80,20);
            sliderInputEvent(slider,val,multiple);
        }
    };

    kbFader.prototype.paintEditSendsTitle = function(){
        this.editSendsTitleSprite = new kbSprite(this.spaceX,this.marginY,this.boxW,this.displayHeight,this.sprite.sprite);
        new kbBoxText(.5,.5,staticDataString.editSends.faderTitle,staticDataColor.editSends.text.faderTitle,staticDataFont.editSends.faderTitle,this.editSendsTitleSprite.sprite,.5);
        this.marginY += this.displayHeight;
    };

    kbFader.prototype.paintPortsTitle = function(){
        this.portsTitleSprite = new kbSprite(this.spaceX,this.marginY,this.boxW,this.portTitleHeight,this.sprite.sprite);
        new kbBoxText(.5,.5,staticDataString.editSends.faderTitle,staticDataColor.editSends.text.faderTitle,staticDataFont.editSends.faderTitle,this.portsTitleSprite.sprite,.5);
        this.marginY += this.portTitleHeight+this.spaceHeight;
    };

    kbFader.prototype.paintEditSendsChUp = function(){
        this.marginY += this.spaceHeight;
        this.editSendsChUp = new kbSprite(this.spaceX,this.marginY,this.boxW,this.controlHeight,this.sprite.sprite);
        new kbBoxText(.5,.5,staticDataString.editSends.ch[this.id],staticDataColor.editSends.text.faderCh,staticDataFont.editSends.faderCh,this.editSendsChUp.sprite,.5);
        this.marginY += this.controlHeight;
        this.marginY += this.spaceHeight;
    };

    kbFader.prototype.paintEditSendsChDown = function(){
        this.editSendsChDown = new kbSprite(this.spaceX,this.marginY,this.boxW,this.displayHeight,this.sprite.sprite);
        new kbBoxText(.5,.5,staticDataString.editSends.ch[this.id],staticDataColor.editSends.text.faderCh,staticDataFont.editSends.faderCh,this.editSendsChDown.sprite,.5);
    };

    kbFader.prototype.paintPan = function(){
        var his = this,timer;
        this.marginY += this.spaceHeight;
        this.pan = new kbSprite(this.spaceX,this.marginY,this.boxW,this.controlHeight,this.sprite.sprite);
        new kbBoxBg(.5,this.marginY -.3,2/(this.actW *this.boxW),2/24,0xFFFFFF,this.pan.sprite);
        this.marginY += this.controlHeight;
        this.panSlider = new kbSlider(.15,.34,.7,.32,images[imgID.main_controlBg],panSliderEvent,this.pan.sprite,'x',.5,.5,images[imgID.main_smallmetal]);
        this.panSlider.setRenderClearRect(this.sprite.sprite,0x373740);
        this.panSlider.Bg.setColor(0x1b7905);
        this.panSlider.Bg.setY(.15);
        this.panSlider.Bg.setHeight(.7);
        this.panSlider.stopPropagation();
        this.panSlider.onScroll(this.pan.sprite);
        this.panSlider.setStartFunc(onDragStartX);
        this.panSlider.setEndFunc(onDragEndX);

        function onDragStartX(){
            if(his.switchBgFunc)his.switchBgFunc(his.id);
        }
        function onDragEndX(){
            timer = setTimeout(function(){
                his.statusText.setText(his.sliderText);
            },GLOBAL.faderResetDisplayTime);
        }
        function panSliderEvent(x,val){
            clearTimeout(timer);
            var str;
            if(val > 0){
                str = 'R' + val;
            }else if(val < 0){
                str = 'L' + Math.abs(val);
            }else{
                str = 'center';
            }
            his.statusText.setText(str);
        }

        this.pan.interactive(true);
        this.pan.onDblEvent('mousedown',function(){
            his.panSlider.updateData(.5);
            his.panSlider.setX(.5);
            his.panSlider.sendData();
            onDragEndX();
        });
    };
    /*ER表示echo和reverb*/
    kbFader.prototype.paintER = function(url){
        var his = this;
        this.marginY += this.spaceHeight;
        this.ER = new kbImg(this.spaceX,this.marginY,this.boxW,this.controlHeight,url,this.sprite.sprite);
        this.marginY += this.controlHeight;

        this.ER.interactive(true);
        this.ER.onEvent('mousedown',EREvent);
        this.ER.onEvent('touchstart',EREvent);

        function EREvent(){
            his.switchBgFunc && his.switchBgFunc(his.id);
            ctx.edit.visible(false);
            init.title.openEdit();
            init.page.edit.tab.switchBg(1);
        }
    };

    kbFader.prototype.paintEq = function(){
        var his = this;
        this.marginY += this.spaceHeight;
        this.eq = new kbSprite(this.spaceX,this.marginY,this.boxW,this.displayHeight,this.sprite.sprite);
        this.eq.sprite.mask = new kbBoxBg(0,0,1,1,0x000000,this.eq.sprite).graphics;
        new kbImg(0, -.05,1,1.1,images[imgID.main_Display],this.eq.sprite);
        this.marginY += this.displayHeight;
        new kbLine(0,.5,1,.5,staticDataColor.fader.eqLine,this.eq.sprite,.01);
        this.eqBntActW = this.actW*this.boxW;
        this.eqBntActH = this.actH*this.displayHeight;
        createEqCurve();
        this.eq.interactive(true);
        this.eq.onEvent('mousedown',chClickEvent);
        this.eq.onEvent('touchstart',chClickEvent);

        function createEqCurve(){
            var canvas = document.createElement('canvas');
            canvas.width = his.eqBntActW;
            canvas.height = his.eqBntActH;
            var eqSprite = new kbSprite(0,0,1,1,his.eq.sprite,new PIXI.Texture.fromCanvas(canvas));
            eqSprite.setRenderClearRect(his.eq.sprite,staticDataColor.fader.backGroundColorDown);
            his.eqCurve = eqSprite;
        }

        function chClickEvent(){
            var tabEqIndex = his.id<chID.CH_IN_NUM ? 1 : 0;
            his.switchBgFunc && his.switchBgFunc(his.id);
            ctx.edit.visible(false);
            init.title.openEdit();
            init.page.edit.tab.switchBg(tabEqIndex);
            window.appRender();
        }
    };

    kbFader.prototype.paintMute = function(){
        this.marginY += this.spaceHeight;
        var muteImage = [images[imgID.main_mute],images[imgID.main_mute_light]];
        var textColor = [staticDataColor.fader.text.mute,staticDataColor.fader.text.muteDown];
        this.mute = new kbButton(this.spaceX,this.marginY,this.boxW,this.displayHeight,muteImage,staticDataString.faderBox.mute,textColor,staticDataFont.fader.mute,this.sprite.sprite);
        this.marginY += this.displayHeight;
        var his = this;
        this.mute.switchColor(function(){
            his.switchBgFunc && his.switchBgFunc(his.id);
        });
    };

    kbFader.prototype.paintVButton = function(){
        this.marginY += this.spaceHeight;
        var textColorV = staticDataColor.ports.vButtonText,textColorEmpty = staticDataColor.ports.emptyButtonText,
            backImg = images[imgID.main_smallbutton_background],his = this,
            vButtonImg = [images[imgID.main_smallbutton_left],images[imgID.main_smallbutton_left_light]],
            emptyButtonImg = [images[imgID.main_smallbutton_right],images[imgID.main_solo_light]];
        this.vButtonSprite = new kbSprite(this.spaceX,this.marginY,this.boxW,this.displayHeight,this.sprite.sprite);
        new kbImg(0,0,1,1,backImg,this.vButtonSprite.sprite);
        this.vBnt = new kbButton(.01,0,.4855,1,vButtonImg,'48v',textColorV,staticDataFont.fader.mute,this.vButtonSprite.sprite);
        this.vBnt.switchColor(Event);
        this.emptyBnt = new kbButton(.5055,0,.485,1,emptyButtonImg,'∅',textColorEmpty,staticDataFont.fader.mute,this.vButtonSprite.sprite);
        this.marginY += this.displayHeight;
        this.emptyBnt.switchColor(Event);
        if(this.id == chID.CH_USER){
            this.vBnt.setDisable(false);
        }
        function Event(){
            if(his.switchBgFunc)his.switchBgFunc(his.id);
        }
    };

    kbFader.prototype.v = function(){
        var x = .2;
        this.marginY += this.spaceHeight;
        this.skipTopColor = staticDataColor.fader.skipTop;
        this.skipTop = new kbSprite(this.skipX,this.marginY,this.boxW,this.skipTopHeight,this.sprite.sprite);
        this.frequencyTop1 = new kbSkip(0,0,.08,1,canvasCache.faderSkipTop(),this.skipTop.sprite,0x373740,true);
        this.frequencyTop1.index = this.id;
        var scale = ['20','10','5'];
        for(var i = 0,len = 3;i<len;i++){
                new kbBoxText(x,i*1/3+1/3/2,scale[i],staticDataColor.fader.text.num,staticDataFont.fader.num,this.skipTop.sprite,.5,.5);
            }
        if(this.id < chID.CH_IN_NUM){
            var marginY = .3;
            if(this.id != chID.CH_USER){
                this.vText = new kbBoxText(.6,marginY,staticDataString.faderBox.v,staticDataColor.fader.text.vText,staticDataFont.fader.vText,this.skipTop.sprite,.5,1.2);
                new kbImg(.5,marginY,.16,.2,images[imgID.main_flute],this.skipTop.sprite);
            }
            this.emptyText = new kbBoxText(.8,marginY,staticDataString.faderBox.empty,staticDataColor.fader.text.empty,staticDataFont.fader.empty,this.skipTop.sprite,.5,1.2);
            new kbImg(.7,marginY,.16,.2,images[imgID.main_flute],this.skipTop.sprite);
        }
        this.marginY += this.skipTopHeight;
    };

    kbFader.prototype.createElectric = function(x,width){
        this.marginY += this.spaceHeight;
        if(!width)width = .08;
        if(!this.efSprite)this.efSprite = new kbSprite(0,this.marginY,1,this.efHeight,this.sprite.sprite);
        this.frequency1 = new kbSkip(x,0,width,1,canvasCache.faderSkip(),this.efSprite.sprite,0x373740,false);
        if(this.id >= chID.CH_USER && (this.flag == 'ch' || this.flag == 'main' || this.flag == 'ports')){
            this.frequency2 = new kbSkip(x +.1,0,width,1,canvasCache.faderSkip(),this.efSprite.sprite,0x373740);
        }
    };

    kbFader.prototype.paintScale = function(scaleX,x,faderScale){
        this.scaleWidth = x-scaleX;
        var actEfH = this.efHeight*this.actH;
        if(!this.efSprite)this.efSprite = new kbSprite(0,this.marginY,1,this.efHeight,this.sprite.sprite);
        if(!faderScale)faderScale = kbFaderScale(this.actW *this.scaleWidth,this.actH*this.efHeight,this.flag);
        if(faderScale)this.sliderScale = new kbCanvasBg(scaleX +.02,-6/actEfH,x -scaleX,1+6/actEfH*2,faderScale,this.efSprite.sprite);
        if(this.efHeight < .2 && this.sliderScale)this.sliderScale.visible(false);
    };

    kbFader.prototype.paintSlider = function(x,width){
        var his = this,buttonImg,sliderFunc,unit = 'dB';
        var multiple = this.flag == 'sends' || this.flag == 'editSends' ? 1 : 10;
        this.sliderMultiple = multiple;
        var sendsFormula = formula.sends;
        sliderFunc = this.sliderFunc ? otherFaderEvent : faderEvent;
        buttonImg = this.main == 'main' ? images[imgID.master_red_bigmetal] : images[imgID.main_bigmetal];
        if(!this.efSprite)this.efSprite = new kbSprite(0,this.marginY,1,this.efHeight,this.sprite.sprite);
        this.slider = new kbSlider(x,0,width,1,images[imgID.main_sliderBg],sliderFunc,this.efSprite.sprite,'y',0,0,buttonImg);
        this.slider.setRenderClearRect(this.sprite.sprite,0x373740);
        this.slider.stopPropagation();
        this.slider.Bg.setBorder(2,0x16161a,1);
        this.slider.onScroll(this.efSprite.sprite);
        //new kbBoxBg(0,0,1,1,0x123123,this.efSprite.sprite);
        this.slider.button.sprite.on('mousedown', onDragStartX);
        this.slider.button.sprite.on('touchstart', onDragStartX);
        this.marginY += this.efHeight;
        function onDragStartX(){
            his.switchBgFunc && his.switchBgFunc(his.id);
        }
        function faderEvent(per,perVal){
            if(his.flag == 'sends' || his.flag == 'editSends'){
                perVal = sendsFormula(per);
            }
            for(var i= 0,len  = his.relate.length;i<len;i++){
                var text = perVal == -800 && (his.flag == 'sends' || his.flag == 'editSends' || his.flag == 'main' || his.flag == 'ch' || his.flag == 'portTrim') ? '-∞' : perVal/multiple+unit;
                var font = text == '-∞' ? '30px' : '18px';
                var content = {font : font, fontFamily : 'Airal', text : text};
                his.relate[i].statusText.setAttr(content);
                his.sliderText = text;
            }
        }
        function otherFaderEvent(per,val){
            his.sliderFunc(per,val,his.id);
        }
    };

    kbFader.prototype.chName = function(){
        this.marginY = 1-this.displayHeight*2-35/this.actH;
        var textColor = staticDataColor.fader.text.ch;
        var textFont = staticDataFont.fader.chName;
        if(this.id >= chID.CH_USER){
            this.skipTextL = new kbBoxText(this.skipX,this.marginY,'L',textColor,textFont,this.sprite.sprite,0,.2);
            this.skipTextR = new kbBoxText(this.skipX +.1,this.marginY,'R',textColor,textFont,this.sprite.sprite,0,.2);
        }else{
            this.skipBottom = new kbImg(this.skipX,this.marginY,.1,.1/this.actH*this.actW,images[imgID.main_flute],this.sprite.sprite);
        }
        this.marginY = 1-this.displayHeight*2-17/this.actH;
        this.skipText = new kbBoxText(this.skipX,this.marginY,this.chCountText,textColor,textFont,this.sprite.sprite);
    };

    kbFader.prototype.paintSolo = function(){
        this.marginY = 1-this.displayHeight-this.chHeight-5/this.actH;
        var soloText = this.id == chID.CH_MASTER ? staticDataString.faderBox.masterClear : staticDataString.faderBox.solo;
        var soloImage = [images[imgID.main_mute],images[imgID.main_solo_light]];
        var textColor = [staticDataColor.fader.text.solo,staticDataColor.fader.text.soloDown];
        this.solo = new kbButton(this.spaceX,this.marginY,this.boxW,this.displayHeight,soloImage,soloText,textColor,staticDataFont.fader.solo,this.sprite.sprite);
        this.solo.setEventDealy(GLOBAL.soloEventDealy);
        this.solo.id = this.id;
        this.marginY += this.displayHeight;
    };

    kbFader.prototype.paintCh = function(){
        this.marginY = 1-this.chHeight;
        var buttonImg,his = this;
        this.chSprite = new kbSprite(1/this.actW,this.marginY,1-2/this.actW,this.chHeight,this.sprite.sprite);
        if(this.id == 0){
            buttonImg = [images[imgID.main_viewbutton_left],images[imgID.main_viewbutton_left_light]];
            new kbBoxBg(0,0,1,1,0x121216,this.chSprite.sprite,true).setRadius(.1);
        }else if(this.id == chID.CH_IN_NUM+chID.CH_FX_NUM-1){
            buttonImg = [images[imgID.main_viewbutton_right],images[imgID.main_viewbutton_right_light]];
            new kbBoxBg(0,0,1,1,0x121216,this.chSprite.sprite);
        }else if(this.id == chID.CH_MASTER){
            buttonImg = [images[imgID.main_mute],images[imgID.set_button_light]];
            new kbBoxBg(0,0,1,1,0x121216,this.chSprite.sprite,true).setRadius(.1);
        }else{
            buttonImg = [images[imgID.main_viewbutton_middle],images[imgID.main_viewbutton_middle_light]];
            new kbBoxBg(0,0,1,1,0x121216,this.chSprite.sprite);
        }

        this.ch = new kbButton(0,-.06,1,1.12,buttonImg,' ',staticDataColor.fader.text.ch,staticDataFont.fader.ch,this.chSprite.sprite);
        this.ch.interactive(true);


        if(this.flag == 'ch' || this.flag == 'ports' || this.flag == 'sends' || this.flag == 'main'){
            this.ch.onLongEvent(openPopup);
            this.ch.onDblEvent('click',chDblEvent);
            this.ch.onDblEvent('touchend',chDblEvent);
        }

        this.ch.onEvent('mouseup',chClickEvent);
        this.ch.onEvent('touchend',chClickEvent);
        function chClickEvent(){
            if(his.switchBgFunc)his.switchBgFunc(his.id);
            if(his.flag == 'main' && ctx.edit.sprite.visible){
                chooseEditFader();
            }
        }

        function chDblEvent(){
            init.title.openEdit();
        }

        function openPopup(){
            if(!GLOBAL.mainPopupDisplayFlag) {
                GLOBAL.mainPopup.updateData(his.id, his.chCountText, his.ch);
            }
        }
    };

    kbFader.prototype.updateData = function(){
        this.mute && this.mute.update();
        if(this.solo){
            kbChangeButtonColor(this.solo,soloData[this.id]);
            this.solo.lastFlag = soloData[this.id];
        }
        this.vBnt && this.vBnt.update();
        this.emptyBnt && this.emptyBnt.update();
        this.panSlider && this.panSlider.update();
        this.slider && this.slider.update();
    };

    kbFader.prototype.relation = function(attr){
        this.relate = attr;
        var i,len = this.relate.length;
        if(this.slider){
            var oattr = new Array(len);
            for(i=0;i<len;i++){
                oattr[i] = this.relate[i].slider;
            }
            this.slider.relation(oattr);
            this.slider.setHeaderGroup(GLOBAL.linkData[this.id]);
        }
        if(this.mute){
            var muteAttr = new Array(len);
            for(i=0;i<len;i++){
                muteAttr[i] = this.relate[i].mute;
            }
            this.mute.relation(muteAttr);
            this.mute.setHeaderGroup(GLOBAL.linkData[this.id]);
            this.mute.switchColor();
        }
        if(this.solo){
            var soloAttr = new Array(len);
            for(i=0;i<len;i++){
                soloAttr[i] = this.relate[i].solo;
            }
            this.solo.relation(soloAttr);
            this.solo.setHeaderGroup(GLOBAL.linkData[this.id]);
            this.solo.switchColor();
        }
    };

    kbFader.prototype.removeRelation = function(){
        if(this.slider){
            this.slider.removeRelation();
            this.slider.setHeaderGroup(0);
        }
        if(this.mute){
            this.mute.removeRelation();
            this.mute.switchColor();
            this.mute.setHeaderGroup(0);
        }
        if(this.solo){
            this.solo.removeRelation();
            this.solo.switchColor();
            this.solo.setHeaderGroup(0);
        }
        this.relate = [this];
    };

    kbFader.prototype.setSwitchFunc = function(func,bgLight){
        this.switchBgFunc = function(flag){
            func(flag);
            window.appRender();
        };
        this.bgLight = bgLight;
    };

    kbFader.prototype.switchBg = function(flag){
        if(flag){
            this.frequency1.switchTexture(canvasCache.faderSkip('light'));
            if(this.frequency2){
                this.frequency2.switchTexture(canvasCache.faderSkip('light'));
            }
            if(this.bgLight){
                if(this.bgCanvas){
                    this.bgCanvas.sprite.texture = new PIXI.Texture.fromCanvas(this.bgLight);
                }else if(this.background){
                    this.background.setColor(this.bgLight);
                }
            }
            if(this.frequencyTop1){
                this.frequencyTop1.switchTexture(canvasCache.faderSkipTop('light'));
            }
            if(this.frequencyTop2){
                this.frequencyTop2.switchTexture(canvasCache.faderSkipTop('light'));
            }
            if(this.ch){
                for(var i= 0,len=this.relate.length;i<len;i++){
                    kbChangeRadioButtonColor(this.relate[i].ch,true);
                }
            }
            this.selected = true;
        }else{
            this.selected = false;
            this.frequency1.switchTexture(canvasCache.faderSkip());
            if(this.frequency2){
                this.frequency2.switchTexture(canvasCache.faderSkip());
            }
            if(this.bgLight){
                if(this.bgCanvas){
                    this.bgCanvas.sprite.texture = new PIXI.Texture.fromCanvas(this.bg);
                }else if(this.background){
                    this.background.setColor(this.bg);
                }
            }
            if(this.frequencyTop1 && this.skipTopColor){
                this.frequencyTop1.switchTexture(canvasCache.faderSkipTop());
            }
            if(this.frequencyTop2 && this.skipTopColor){
                this.frequencyTop2.switchTexture(canvasCache.faderSkipTop());
            }
            if(this.ch && !this.relate[0].selected){
                kbChangeRadioButtonColor(this.ch);
            }
        }
    };

    kbFader.prototype.render = function(){

    };

    kbFader.prototype.openEdit = function(flag){
        if(flag){
            this.chAct = 45;
            this.chSprite.setHeight(45/this.actH);
        }else{
            this.chAct = 37;
            this.chSprite.setHeight(37/this.actH);
        }
    };

    kbFader.prototype.resetLocal = function(){
        var actTmp = getSpriteActData(this.sprite.sprite);
        this.actW = actTmp[2];
        this.actH = actTmp[3];
        this.displayHeight = 41/this.actH;
        if(this.flag == 'sends'){
            this.portTitleHeight = 62/this.actH;
        }else{
            this.portTitleHeight = 34/this.actH;
        }
        this.controlHeight = 24/this.actH;
        this.skipTopHeight = 58/this.actH;
        this.chAct = this.flag == 'main' ? 45 : this.chAct;
        this.chHeight = this.flag == 'main' ? 45/this.actH : 37/this.actH;
        this.spaceHeight = this.spaceActH/this.actH;
        this.marginY = this.spaceHeight;
        this.spaceX = 6/this.actW;
        this.skipX = 18/this.actW;
        this.boxW = 1-this.spaceX*2;
        this.efHeight =  1-(this.displayHeight*3+this.controlHeight+50/this.actH+this.skipTopHeight+this.displayHeight*2+28/this.actH);
        if(this.flag == 'sends')this.efHeight += this.displayHeight*2;
        if(this.flag == 'editSends')this.efHeight += this.displayHeight;
        if(this.efHeight < 0)this.efHeight = 0.1;
    };

    kbFader.prototype.resize = function(x,y,width,height){
        var his = this;
        this.x = x;this.y = y;this.width = width;this.height = height;
        this.sprite.resize(x,y,width,height);
        this.resetLocal();
        judgeFaderElement(this.portsTitleSprite,this.spaceX,this.marginY,this.boxW,this.portTitleHeight);
        judgeFaderElement(this.editSendsTitleSprite,this.spaceX,this.marginY,this.boxW,this.displayHeight);
        judgeFaderElement(this.editSendsChUp,this.spaceX,this.marginY,this.boxW,this.controlHeight);
        judgeFaderElement(this.statusSprite,this.spaceX,this.marginY,this.boxW,this.displayHeight);
        judgeFaderElement(this.vButtonSprite,this.spaceX,this.marginY,this.boxW,this.displayHeight);
        judgeFaderElement(this.pan,this.spaceX,this.marginY,this.boxW,this.controlHeight);
        judgeFaderElement(this.ER,this.spaceX,this.marginY,this.boxW,this.controlHeight);
        judgeFaderElement(this.eq,this.spaceX,this.marginY,this.boxW,this.displayHeight);
        judgeFaderElement(this.mute,this.spaceX,this.marginY,this.boxW,this.displayHeight);
        judgeFaderElement(this.skipTop,this.skipX,this.marginY,this.boxW,this.skipTopHeight);
        if(!this.skipTop && this.flag != 'ports'){
            this.marginY += this.skipTopHeight;
        }
        if(this.flag == 'main' || this.flag == 'ch'){
            this.marginY -= this.spaceHeight;
        }
        this.marginY += this.spaceHeight*2;
        if(this.efHeight > 0){
            this.scaleResize();
            this.efSprite.resize(0,this.marginY,1,this.efHeight);
            judgeBgRadius(this.slider);
            judgeBgRadius(this.frequency1);
            judgeBgRadius(this.frequency2);
        }
        this.marginY = 1-this.displayHeight*2-35/this.actH;
        if(this.skipBottom){
            this.skipBottom.baseTexture.resize(this.skipX,this.marginY,.1,.1/this.actH*this.actW);
        }
        judgeFaderElement(this.skipTextL,this.marginY);
        judgeFaderElement(this.skipTextR,this.marginY);
        this.marginY = 1-this.displayHeight*2-17/this.actH;
        judgeFaderElement(this.skipText,this.marginY);
        this.marginY = 1-this.displayHeight-this.chHeight-5/this.actH;
        judgeFaderElement(this.solo,this.spaceX,this.marginY,this.boxW,this.displayHeight);
        judgeFaderElement(this.editSendsChDown,this.spaceX,this.marginY,this.boxW,this.displayHeight);
        this.marginY = 1-this.chHeight;
        judgeFaderElement(this.chSprite,1/this.actW,this.marginY,1-2/this.actW,this.chAct/this.actH);
        function judgeFaderElement(element,x,y,width,height){
            if(arguments.length == 2){
                if(element){
                    element.setY(x);
                }
            }else{
                if(element){
                    element.resize(x,y,width,height);
                    his.marginY += height+his.spaceHeight;
                }
            }
        }

        function judgeBgRadius(bg){
            if(bg){
                //bg.Bg.parentActW = null;
                //bg.Bg.setRadius(.5);
            }
        }
    };

    kbFader.prototype.scaleResize = function(x,y,width,height,min){
        var his = this;
        if(!this.sliderScale)return;
        if(arguments.length >= 4){
            this.sprite.resize(x,y,width,height);
        }else if(arguments.length == 1){
            min = x;
        }
        if(min == undefined)min = 100;
        var actTmp = getSpriteActData(this.sprite.sprite);
        this.actW = actTmp[2];
        this.actH = actTmp[3];
        if(this.actH*this.efHeight < min){
            his.sliderScale.visible(false);
        }else{
            var scaleCanvas;
            his.sliderScale.visible(true);
            if(this.flag == 'portDelay'){
                scaleCanvas = kbFaderPortDelayScale(this.actW *this.scaleWidth,this.actH*this.efHeight);
            }else if(this.flag == 'eq'){
                scaleCanvas = kbFaderEqSliderScale(this.actW *this.scaleWidth,this.actH*this.efHeight);
            }else{
                scaleCanvas = kbFaderScale(this.actW *this.scaleWidth,this.actH*this.efHeight,this.flag);
            }
            var scaleTexture = new PIXI.Texture.fromCanvas(scaleCanvas);
            his.sliderScale.baseTexture.sprite.texture = scaleTexture;
            var actEfH = this.efHeight*this.actH;
            his.sliderScale.baseTexture.setY(-6/actEfH);
            his.sliderScale.baseTexture.setHeight(1+6/actEfH*2);
        }
    };

    kbFader.prototype.setLock = function(flag){
        this.lock = flag;
        this.sprite.sprite.interactiveChildren = !flag;
    };

    var kbMainFader = function(bg,parent,x,y,width,height,id,flag){
        kbFader.call(this,bg,parent,x,y,width,height,id,flag);
        this.paintBg();
        this.paintStatus();
        if(id == chID.CH_ECHO){
            this.paintER(images[imgID.echo]);
        }else if(id == chID.CH_REVERB){
            this.paintER(images[imgID.reverb]);
        }else{
            this.paintPan();
            id == chID.CH_MASTER && this.pan.visible(false);
        }
        this.paintEq();
        this.paintMute();
        this.v();
        this.marginY += this.spaceHeight;
        this.createElectric(.15);
        var scaleX = this.id >= chID.CH_USER ? .326 : .226;
        this.paintScale(scaleX,.7 -.04);
        this.paintSlider(.7,.076);
        this.chName();
        this.paintSolo();
        this.paintCh();
    };

    kbMainFader.prototype = mergeObj(kbMainFader.prototype,kbFader.prototype);

    var kbEditSendsFader = function(bg,parent,x,y,width,height,id,flag,func){
        kbFader.call(this,bg,parent,x,y,width,height,id,flag,func);
        this.paintBg();
        this.paintEditSendsTitle();
        this.paintEditSendsChUp();
        this.paintStatus();
        this.marginY += this.spaceHeight*2+this.skipTopHeight;
        this.createElectric(.15);
        var scaleX = this.id > 8 ? .326 : .226;
        this.paintScale(scaleX,.7 -.04,canvasCache.faderScale);
        this.paintSlider(.7,.076);
        this.marginY = 1-this.displayHeight-this.chHeight-5/this.actH;
        this.paintEditSendsChDown();
    };

    kbEditSendsFader.prototype = mergeObj(kbEditSendsFader.prototype,kbFader.prototype);

    var kbEditPortTrimFader = function(bg,parent,x,y,width,height,id,flag,func){
        kbFader.call(this,bg,parent,x,y,width,height,id,flag,func);
        this.efHeight =  1;
        this.marginY -= this.spaceHeight;
        this.createElectric(0,.14);
        this.paintScale(.15,.85 -.04,canvasCache.portTrimScale);
        this.paintSlider(.88,.12);
    };

    kbEditPortTrimFader.prototype = mergeObj(kbEditPortTrimFader.prototype,kbFader.prototype);

    var kbEditPortDelayFader = function(bg,parent,x,y,width,height,id,flag,func){
        kbFader.call(this,bg,parent,x,y,width,height,id,flag,func);
        this.efHeight =  1;
        this.paintScale(0,.76 -.04,canvasCache.portDelayScale);
        this.paintSlider(1-.18,.18);
    };

    kbEditPortDelayFader.prototype = mergeObj(kbEditPortDelayFader.prototype,kbFader.prototype);

    var kbEditEqFader = function(bg,parent,x,y,width,height,id,flag,func){
        kbFader.call(this,bg,parent,x,y,width,height,id,flag,func);
        this.efHeight =  1;
        this.paintScale(0,1,canvasCache.eqSliderScale);
        this.paintSlider((1-.19)/2,.19);
    };

    kbEditEqFader.prototype = mergeObj(kbEditEqFader.prototype,kbFader.prototype);

    var kbPortsFader = function(bg,parent,x,y,width,height,id,flag,func){
        kbFader.call(this,bg,parent,x,y,width,height,id,flag,func);
        this.paintBg();
        this.spaceActH = 17;
        this.spaceHeight = this.spaceActH/this.actH;
        this.marginY = this.spaceHeight;
        this.paintPortsTitle();
        this.paintStatus();
        this.paintVButton();
        this.paintMute();
        this.marginY += this.spaceHeight*2;
        this.createElectric(.15);
        var scaleX = this.id >= chID.CH_USER ? .326 : .226;
        this.paintScale(scaleX,.7 -.04,canvasCache.faderScale);
        this.paintSlider(.7,.076);
        this.marginY = 1-this.displayHeight-this.chHeight-5/this.actH;
        this.paintCh();
    };

    kbPortsFader.prototype = mergeObj(kbPortsFader.prototype,kbFader.prototype);

    var kbSendsFader = function(bg,parent,x,y,width,height,id,flag,func){
        kbFader.call(this,bg,parent,x,y,width,height,id,flag,func);
        this.paintBg();
        this.spaceActH = 6;
        this.spaceHeight = this.spaceActH/this.actH;
        this.marginY = this.spaceHeight;
        this.paintPortsTitle();
        this.paintStatus();
        this.marginY += this.spaceHeight*2+this.skipTopHeight;
        this.createElectric(.15);
        var scaleX = .226;
        this.paintScale(scaleX,.7 -.04,canvasCache.faderScale);
        this.paintSlider(.7,.076);
        this.marginY = 1-this.chHeight-5/this.actH;
        this.paintCh();
    };

    kbSendsFader.prototype = mergeObj(kbSendsFader.prototype,kbFader.prototype);
    /*创建一个弹出框*/
    var kbPopup = function(){
        var popupPos = staticDataLocal.popup.popup;
        this.width = popupPos.width;
        this.height = popupPos.height;
        this.popup = ctx.popup;
        this.i = "";
        this.box();
        this.title();
        this.button();
        this.dispear();
        this.paintRename();
    };

    kbPopup.prototype.setData = function(){
        this.nameHeader = new sendHeader.ch_name(this.id);
    };

    kbPopup.prototype.box = function(){
        var bg = new PIXI.Graphics();
        bg.beginFill(staticDataColor.popup.backGroundColor);
        bg.lineStyle(.001,staticDataColor.popup.border,1);
        bg.moveTo(.05,0);
        bg.lineTo(.95,0);
        bg.arcTo(1,0,1,.05,.025);
        bg.lineTo(1,.85);
        bg.arcTo(1,.96,.95,.96,.025);
        bg.lineTo(.55,.96);
        bg.lineTo(.5,1);
        bg.lineTo(.45,.96);
        bg.lineTo(.05,.96);
        bg.arcTo(0,.96,0,.85,.025);
        bg.lineTo(.0,.05);
        bg.arcTo(0,0,.05,0,.025);
        bg.endFill();
        this.popup.sprite.addChild(bg);
    };

    kbPopup.prototype.title = function(){
        var popupColor = staticDataColor.popup;
        popupTitleGraphics(.96/9,popupColor.title,.1,this.popup.sprite);
        new kbBoxText(.1,.06,'Guitar',popupColor.text.button,staticDataFont.main.popupTitle,this.popup.sprite,0,.5);
        this.chText = new kbBoxText(.9,.06,'CH',popupColor.text.ch,staticDataFont.main.popupCh,this.popup.sprite,1,.5);
    };

    kbPopup.prototype.button = function(){
        var bg,text,his = this,height = .103,popupColor = staticDataColor.popup,bgArray = [],buttonEventArray = [],
            buttonText = staticDataString.chPopup.buttonText;
        this.buttonArray = new Array(8);
        for(var i=1;i<9;i++){
            bg = new kbBoxBg(0,height*(i-1) +.12,1,height,popupColor.backGroundColor,this.popup.sprite);
            bg.graphics.index = i-1;
            bgArray.push(bg);
            bg.interactive(true);
            bg.onEvent('mousedown',buttonEvent);
            bg.onEvent('touchstart',buttonEvent);
            if(i < 8){
                new kbLine(.05,height*i +.12,.95,height*i +.12,popupColor.line,this.popup.sprite,.005);
            }
            text = new kbBoxText(.1,height*(i -.5) +.12,buttonText[i],popupColor.text.button,staticDataFont.main.popupButton,this.popup.sprite,0,.5);
        }
        function buttonEvent(){
            bgArray[this.index].setColor(popupColor.buttonLight);
            buttonEventArray[this.index]();
            setTimeout(function(){
                for(var i=0;i<8;i++){
                    bgArray[i].setColor(popupColor.backGroundColor);
                }
            },GLOBAL.mainPopupButtonLightTime);
        }

        function renameEvent(){
            his.rename.box.clicked = true;
            his.renameIpt.clicked = true;
            his.rename.setContent({title : "重命名通道（"+his.ch+"）"});
            his.renameIpt.ipt.value = his.buttonText.content;
            his.rename.Display();
            his.renameIpt.visible(true);
        }
        function colorEvent(){}
        function copySettingsEvent(){
            GLOBAL.copyChannelData = items[his.id];
        }
        function pasteSettingsEvent(){
            if(GLOBAL.copyChannelData){
                var faderArray = init.page.main.faderArray;
                var data = GLOBAL.copyChannelData,obj,fader = faderArray[his.id];
                for(var i= 0,len=data.length;i<len;i++){
                    if(!inArray(noCopyID,i)){
                        items[this.id] = objClone(data);
                    }
                }
                fader.updateData();
            }
        }
        function resetChannelEvent(){}
        function linkNextChannelEvent(){
            var faderArray =init.page.main.faderArray,portFaderArray = init.page.ports.faderArray;
            var fader = faderArray[his.id],faderNext = faderArray[his.id+1];
            var portFader = portFaderArray[his.id],portFaderNext = portFaderArray[his.id+1];
            if(fader.relate.length <=1){
                GLOBAL.linkData[his.id] = setHeaderGroup([his.id,his.id+1]);
                GLOBAL.linkData[his.id+1] = setHeaderGroup([his.id,his.id+1]);
                fader.relation([fader,faderNext]);
                faderNext.relation([fader,faderNext]);
                portFader.relation([portFader,portFaderNext]);
                portFaderNext.relation([portFader,portFaderNext]);
                fader.switchBg(true);
                portFader.switchBg(true);
                items[his.id+1] = items[his.id];
                portsData[his.id+1] = portsData[his.id];
                faderNext.updateData();
                portFaderNext.updateData();
                fader.panSlider && fader.panSlider.setX(0);
                faderNext.panSlider && faderNext.panSlider.setX(1);
                init.page.edit.nav.updateData(his.id);
            }
        }
        function unlinkChannelEvent(){
            var relateFader = init.page.main.faderArray[his.id].relate;
            var portRelateFader = init.page.ports.faderArray[his.id].relate;
            if(relateFader.length >= 2){
                GLOBAL.linkData[his.id] = 0;
                GLOBAL.linkData[his.id+1] = 0;
                items[relateFader[1].id] = objClone(items[relateFader[0].id]);
                portsData[relateFader[1].id] = objClone(portsData[relateFader[0].id]);
                for(var j= 0,olen=relateFader.length;j<olen;j++){
                    relateFader[j].removeRelation();
                    portRelateFader[j].removeRelation();
                    if(!relateFader[j].selected)relateFader[j].switchBg(false);
                    if(!portRelateFader[j].selected)portRelateFader[j].switchBg(false);
                }
                init.page.edit.nav.updateData(his.id);
            }
        }

        function safetyEvent(){}
        buttonEventArray.push(renameEvent,colorEvent,copySettingsEvent,pasteSettingsEvent,resetChannelEvent,linkNextChannelEvent,unlinkChannelEvent,safetyEvent);
    };

    kbPopup.prototype.paintRename = function(){
        var textColor = staticDataColor.rename.text,font = staticDataFont.rename,iptColor = textColor.input,iptFont = font.input,his = this;
        this.rename = new kbMessage({buttonLen:2,content : ['cancel','sure']});
        messageArray.push(this.rename.box);
        this.rename.Display();
        var iptSprite = new kbSprite(.2,.35,.6,.2,this.rename.box.sprite);
        var iptStyle = {
            position : 'absolute',
            display : 'none',
            background : 'none',
            border : '2px solid #22222b',
            color : iptColor,
            fontSize : iptFont,
            textAlign : 'center'
        };
        this.renameIpt = new kbInput(iptSprite.sprite,document.body,iptStyle);
        GLOBAL.dispearPopup.push(this.renameIpt);
        this.rename.Dispear();
        this.rename.setEvent([cancelEvent,okEvent]);
        function okEvent(){
            var val = his.renameIpt.ipt.value;
            if(val != items[his.id].name.name){
                var faderArray = getFaderArray();
                for(var i= 0,len=faderArray.length;i<len;i++)faderArray[i][his.id].ch.setText(val);
                init.page.edit.nav.buttonText[his.id] = val;
                items[his.id].name.name = val;
                sendData({pktHeader : his.nameHeader.pkt,paraHeader : his.nameHeader.para,data : items[his.id].name});
            }
        }
        function cancelEvent(){
            his.renameIpt.ipt.value = his.buttonText.content;
        }
    };

    kbPopup.prototype.display = function(){
        this.popup.visible(true);
    };

    kbPopup.prototype.dispear = function(){
        this.popup.visible(false);
    };

    kbPopup.prototype.updateData = function(id,ch,button){
        this.id = id;
        this.ch = ch;
        this.buttonText = button.text;
        this.chText.setText(this.ch);
        this.setData();
        this.display();
        this.rePos(button.sprite);
    };

    kbPopup.prototype.rePos = function(sprite){
        if(sprite || this.posSprite){
            this.posSprite = sprite ? sprite : this.posSprite;
            var tmp = getSpriteActData(this.posSprite);
            var x = tmp[0]+tmp[2]/2-this.width/ 2,
                y = tmp[1]-this.height;
            if(this.popup.sprite.visible == true){
                this.popup.setX(boundaryValue(x,0));
                this.popup.setY(y);
            }
        }
    };

    kbPopup.prototype.resize = function(){
        this.rePos();
    };
    /*控制box的左右滑动*/
    var kbBoxTraverse = function(box,min,height,renderObj,parent){
        this.box = box;
        this.min = min;
        this.height = height;
        this.renderObj = renderObj;
        this.max = 0;
        this.actX = 0;
        this.parent = parent ? parent : this.box.parent;
        if(this.height){
            this.paintScroll(this.min);
        }
        this.event();
    };

    kbBoxTraverse.prototype.event = function(){
        this.box.interactive = true;
        this.box.on('mousedown', onDragStart);
        this.box.on('touchstart', onDragStart);

        this.box.on('mouseup', onDragEnd);
        this.box.on('mouseupoutside', onDragEnd);
        this.box.on('touchend', onDragEnd);
        this.box.on('touchendoutside', onDragEnd);

        this.box.on('mousemove', onDragMove);
        this.box.on('touchmove', onDragMove);
        var his = this;
        function onDragStart(event){
            if(GLOBAL.mainPopup.popup.sprite.visible){
                GLOBAL.mainPopup.dispear();
            }else{
                his.dragFlag = true;
                his.data = event.data;
                his.moveStartX = his.data.getLocalPosition(his.parent).x;
                his.styleX = his.box.position.x;
            }
        }

        function onDragEnd(){
            his.dragFlag = false;
            GLOBAL.mainPopupDisplayFlag = false;
            var actTmp = getSpriteActData(his.box.parent);
            his.actX = his.box.position.x*actTmp[2];
            clearElementChangePos();
        }

        function onDragMove(){
            if(his.dragFlag){
                his.moveX = his.data.getLocalPosition(his.parent).x;
                if(his.moveX != his.moveStartX){
                    GLOBAL.mainPopupDisplayFlag = true;
                    var cha = his.moveX - his.moveStartX+his.styleX;
                    if(his.min < 0){
                        cha = boundaryValue(cha,his.min,his.max);
                        his.moveStartX = his.moveX;
                        his.styleX = cha;
                        his.box.position.x = cha;
                        if(his.scrollBar){
                            his.scrollBar.setX(1-(cha-his.min)/(his.max-his.min));
                        }
                        his.renderObj.render();
                    }
                }
            }
        }
    };

    kbBoxTraverse.prototype.paintScroll = function(min){
        var scrollBarWidth = 1/(1-min);
        if(scrollBarWidth >= 1){
            scrollBarWidth = 1;
        }
        var scrollBarBgData = {
            x : 0,
            y:1-this.height,
            width : 1,
            height :this.height,
            color : 0xFFFFFF,
            alpha :.5
        };
        var scrollBarData = {
            x :0,
            y:0,
            width :scrollBarWidth,
            height:1,
            color : 0x2f2f2f,
            alpha :1,
            radius :.5
        };
        this.scrollBar = new kbScrollBar(scrollBarBgData,this.parent,scrollBarData);
    };

    kbBoxTraverse.prototype.resize = function(min,height){
        this.min = min ? min : this.min;
        var allLength = 1-min;
        var actTmp = getSpriteActData(this.box.parent);
        min = min > 0 ? 0 : min;
        var x = boundaryValue(this.actX/actTmp[2],min,0);
        this.actX = actTmp[2]*x;
        this.box.position.x = x;
        if(this.scrollBar){
            var scrollBarWidth = 1/allLength;
            scrollBarWidth = boundaryValue(scrollBarWidth,0,1);
            this.scrollBar.setWidth(scrollBarWidth);
            this.scrollBar.setX(-x/(allLength - 1));
            if(height){
                this.scrollBar.sprite.resize(0,1-height,1,height);
            }
        }
    };

    var kbMain = function(){
        this.sprite = ctx.main.sprite;
        ctx.main.setRenderClearRect(this.sprite);
        this.posMain = staticDataLocal.main;
        this.box();
    };

    kbMain.prototype.box = function(){
        var itemPos = this.posMain.chItem,
            faderBoxPos = this.posMain.faderBox;
        this.chItemBox = new kbSprite(itemPos.x,itemPos.y,itemPos.width,itemPos.height,this.sprite);
        this.chItemBox.setRenderClearRect(this.chItemBox.sprite,0x373740);
        this.faderBox = new kbSprite(faderBoxPos.x,faderBoxPos.y,faderBoxPos.width,faderBoxPos.height,this.chItemBox.sprite);
        this.fader();
        GLOBAL.mainPopup = new kbPopup();
        GLOBAL.dispearPopup.push(GLOBAL.mainPopup.popup);
    };

    kbMain.prototype.fader = function(){
        var his = this,faders,height = 1,x = 0,y = 0,
            width = this.posMain.fader.width,soloLight = [],soloArray = [],solo,soloVal = [],soloHeader = new sendHeader.adsp_solo(0);
        this.faderArray = [];

        function createChFader(){
            for(var i=0;i<chID.CH_IN_NUM;i++){
                faders = new kbMainFader(canvasCache.mainFaderMono,his.faderBox.sprite,x,y,width,height,i,'ch');
                x += width;
                his.faderArray.push(faders);
            }
        }

        function createFxFader(){
            faders = new kbMainFader(canvasCache.mainFaderMono,his.faderBox.sprite,x,y,width,height,chID.CH_ECHO,'ch');
            x += width;
            his.faderArray.push(faders);

            faders = new kbMainFader(canvasCache.mainFaderMono,his.faderBox.sprite,x,y,width,height,chID.CH_REVERB,'ch');
            faders.mainX = x;
            x += width;
            his.faderArray.push(faders);
        }

        function createMainFader(){
            var mainPos = his.posMain.mainFader;
            his.mainFader = new kbMainFader(canvasCache.mainFaderMono,his.sprite,mainPos.x,mainPos.y,mainPos.width,mainPos.height,chID.CH_MASTER,'main');
            his.faderArray.push(his.mainFader);
        }

        this.boxTraverse = new kbBoxTraverse(this.faderBox.sprite,(1-width*(chID.CH_IN_NUM+chID.CH_FX_NUM)),staticDataLocal.main.scrollBarHeight,ctx.main);
        createChFader();
        createFxFader();
        createMainFader();
        this.faderArray[0].selected = true;
        this.chItemBox.sprite.swapChildren(this.faderBox.sprite,this.boxTraverse.scrollBar.sprite.sprite);

        for(var i = 0,len = this.faderArray.length;i<len;i++){
            this.faderArray[i].setSwitchFunc(faderSwitchBg,canvasCache.mainFaderMonoLight);
            if(i < len-1){
                soloArray.push(this.faderArray[i].solo);
                this.faderArray[i].solo.lastFlag = false;
            }
        }
        this.mainFader.solo.switchColor(mainSoloEvent);
        function mainSoloEvent(bnt){
            if(bnt.eventFlag){
                soloLight = [];
                faderSwitchBg(bnt.id);
                for(var i = 0,len = his.faderArray.length-1;i<len;i++){
                    solo = his.faderArray[i].solo;
                    if(solo.eventFlag){
                        soloLight.push(i);
                        //solo.data[solo.dataAttr] = 0;
                        //solo.update();
                        //solo.sendData();
                        kbChangeButtonColor(solo,0);
                    }
                }
            }else{
                for(i = 0,len = his.faderArray.length-1;i<len;i++){
                    if(inArray(soloLight,i)){
                        solo = his.faderArray[i].solo;
                        //solo.data[solo.dataAttr] = 1;
                        //solo.update();
                        //solo.sendData();
                        kbChangeButtonColor(solo,1);
                        his.faderArray[i].selected = true;
                        his.faderArray[len-1].selected = true;
                    }
                }
            }
            soloDataFunc(bnt,true);
        }

        this.setSoloRadio = function(flag){
            if(flag){
                kbSetRadioButton(soloArray,soloEvent);
            }else{
                for(var i= 0,len=soloArray.length;i<len;i++){
                    soloArray[i].radio(false);
                    soloArray[i].switchColor();
                }
            }
        };

        function soloEvent(button){
            faderSwitchBg(button.id);
            if(button.eventFlag && button.lastFlag){
                //button.data[button.dataAttr] = boolean2number(!button.data[button.dataAttr]);
                button.eventFlag = !button.eventFlag;
                button.chooseColor();
            }
            soloDataFunc(button);
        }

        function soloDataFunc(button,noLast){
            for(var i= 0,len=soloArray.length;i<len;i++){
                var bnt = soloArray[i];
                soloData[i] = boolean2number(bnt.eventFlag)
            }
            sendData({pktHeader : soloHeader.pkt,paraHeader : soloHeader.para,data : soloData});
            for(i= 0,len=soloArray.length;i<len;i++){
                if(!noLast)soloArray[i].lastFlag = soloArray[i] == button ? button.eventFlag : false;
            }
        }
    };

    kbMain.prototype.updateData = function(){
        var len = this.faderArray.length;
        for(var i=0;i<len;i++){
            this.faderArray[i].updateData();
        }
        this.setSoloRadio(!settingData.solo_mode);
    };

    kbMain.prototype.resize = function(){
        var local = staticDataLocal.main,itemPos = local.chItem,faderPos = local.fader,faderX = faderPos.x,
            mainPos = local.mainFader,faderBoxPos = local.faderBox,scrollBarPosH = local.scrollBarHeight;
        this.chItemBox.resize(itemPos.x,itemPos.y,itemPos.width,itemPos.height);
        this.faderBox.setHeight(faderBoxPos.height);
        var faderTextureMono = new PIXI.Texture.fromCanvas(canvasCache.mainFaderMono);
        for(var i= 0,len = this.faderArray.length-1;i<len;i++){
            if(this.faderArray[i].visible){
                if(this.faderArray[i].moveStart){
                    this.faderArray[i].resize(-this.faderBox.sprite.position.x,faderPos.y,faderPos.width,faderPos.height);
                }else{
                    this.faderArray[i].resize(faderX,faderPos.y,faderPos.width,faderPos.height);
                }
                faderX += faderPos.width;
            }
            this.faderArray[i].bgCanvas.sprite.texture = faderTextureMono;
        }
        this.mainFader.resize(mainPos.x,mainPos.y,mainPos.width,mainPos.height);
        this.mainFader.bgCanvas.sprite.texture = faderTextureMono;
        this.boxTraverse.resize(1-faderPos.width*(chID.CH_IN_NUM+chID.CH_FX_NUM),scrollBarPosH);
        if(faderPos.width*12 < 1){
            this.faderBox.setX(0);
        }
    };

    kbMain.prototype.setLock = function(flag){
        this.lock = flag;
        this.sprite.interactiveChildren = !flag;
    };

    var kbScene = function(){
        inputClass.call(this);
        this.parent = ctx.scene.sprite;
        this.iptArray = [];
        this.selectIndex = 0;
        this.paintPage();
        this.paint();
        ctx.scene.visible(false);
    };

    kbScene.prototype.setData = function(){
        ctx.scene.visible(true);
        for(var i= 0,len=descData.length;i<len;i++){
            var addData = [{text : setNO(i)},{text : descData[i].name},{text : descData[i].creator},{text : descData[i].description},{text : descData[i].time}];
            this.listItem.Add(addData);
        }
        ctx.scene.visible(false);
        this.updateList();
        var string = 'SCENE '+setNO(0)+'\n'+descData[0].name;
        init.title.sceneBnt.setText(string);
        this.saveHeader = new sendHeader.scene();
    };

    kbScene.prototype.paintPage = function(){
        var tabPos = staticDataLocal.scene.tab;
        this.sprite = new kbSprite(0,0,1,1,this.parent);
        var titleStyle = {
            x : tabPos.x,
            width : tabPos.width,
            height : tabPos.height,
            images : [images[imgID.tabButtonLeft],images[imgID.tabButtonLeft_light],images[imgID.tabButtonRight],images[imgID.tabButtonLeft_light]],
            buttonSpace : 22
        };
        var titleText = staticDataString.scene.tab;
        this.tab = new kbTab(titleText,titleStyle,this.parent,[this.sprite.sprite]);
        this.tab.switchBg(0);
    };

    kbScene.prototype.paint = function(){
        var local = staticDataLocal.scene,color = staticDataColor.scene,textColor = color.text,font = staticDataFont.scene,string = staticDataString.scene,his = this,
            selectPos = local.select,memoryPos = local.memory,selectTitleHeight = local.selectTitleHeight,memoryTitleHeight = local.memoryTitleHeight,titleTextColor = textColor.title,
            contentTextColor = textColor.content,indextextColor = textColor.index,hookTextColor = textColor.hook,buttonTextColor = textColor.button,boxColor = color.box,titleColor = color.title,
            borderColor = color.border,titleFont = font.title,contentFont = font.content,indexFont = font.index,selectText = string.select,memoryText = string.memory,hook,
            buttonImg = [images[imgID.edit_button],images[imgID.main_mainbutton_light]];
        function paintSelect(){
            var buttonW = local.selectButtonW,buttonH = local.selectButtonH,resetName,resetDescription,saveFlag;
            his.select = new kbSprite(selectPos.x,selectPos.y,selectPos.width,selectPos.height,his.sprite.sprite);
            var userBg = new kbBoxBg(0,0,1,1,boxColor,his.select.sprite,true);
            userBg.setBorder(1,borderColor,1,true);
            userBg.setRadius(.04);
            popupTitleGraphics(selectTitleHeight,titleColor,.04,his.select.sprite);
            new kbBoxText(.5,selectTitleHeight/2,selectText.title,titleTextColor,titleFont,his.select.sprite,.5);
            his.index = new kbBoxText(.17,.35,selectText.index,indextextColor,indexFont,his.select.sprite,.5,1);
            hook = new kbBoxText(.17,.35,selectText.hook,hookTextColor,indexFont,his.select.sprite,.5,0);
            hook.visible(false);
            var x = .3,y = .22;
            new kbBoxText(x,y,selectText.name,contentTextColor,contentFont,his.select.sprite,0,.5);
            var nameBg = new kbSprite(.42,.22 -.1/2,.5,.1,his.select.sprite);
            new kbImg(0,0,1,1,images[imgID.input_background],nameBg.sprite);
            var iptStyle = {
                position : 'absolute',
                display : 'none',
                background : 'none',
                border : 'none',
                color : contentTextColor,
                fontSize : contentFont
            };
            var nameIpt = new kbInput(nameBg.sprite,document.body,iptStyle);
            his.iptArray.push(nameIpt);
            iptArray.push(nameIpt);
            y += .09;
            new kbBoxText(x,y,selectText.creator,contentTextColor,contentFont,his.select.sprite,0,.5);
            his.creator = new kbBoxText(x +.15,y,'',contentTextColor,contentFont,his.select.sprite,0,.5);
            y += .09;
            his.date = new kbBoxText(x,y,'',contentTextColor,contentFont,his.select.sprite,0,.5);
            y += .15;
            new kbBoxText(x,y,selectText.description,contentTextColor,contentFont,his.select.sprite,1,.5);
            var descriptionBg = new kbSprite(x,y -.05,.62,.2,his.select.sprite);
            new kbImg(0,0,1,1,images[imgID.input_background],descriptionBg.sprite);
            var descriptIpt = new kbInput(descriptionBg.sprite,document.body,iptStyle,'textarea');
            his.iptArray.push(descriptIpt);
            iptArray.push(descriptIpt);
            x = .2;y = .77;
            var space = (1-x*2-buttonW*2);
            his.applyBnt = new kbButton(x,y,buttonW,buttonH,buttonImg,selectText.applyButton[0],buttonTextColor,contentFont,his.select.sprite);
            his.applyBnt.bounce();
            his.applyBnt.switchColor(applyEvent);
            x += buttonW+space;
            his.editBnt = new kbButton(x,y,buttonW,buttonH,buttonImg,selectText.applyButton[2],buttonTextColor,contentFont,his.select.sprite);
            his.editBnt.bounce();
            his.editBnt.switchColor(editEvent);
            x = .25;space = (1-x*2-buttonW*2);
            his.cancelBnt = new kbButton(x,y,buttonW,buttonH,buttonImg,selectText.editButton[0],buttonTextColor,contentFont,his.select.sprite);
            his.cancelBnt.bounce();
            his.cancelBnt.switchColor(cancelEvent);
            x += buttonW+space;
            his.saveBnt = new kbButton(x,y,buttonW,buttonH,buttonImg,selectText.editButton[1],buttonTextColor,contentFont,his.select.sprite);
            his.saveBnt.bounce();
            his.saveBnt.switchColor(saveEvent);
            displayIpt(false);
            function applyEvent(){
                var index = his.index.content,
                    name = his.iptArray[0].ipt.value,
                    string = 'SCENE '+index+'\n'+name;
                init.title.sceneBnt.setText(string);
                hook.visible(true);
                var data = {opc : actID.ACT_APPLY,desc : descData[his.selectIndex]};
                his.saveHeader.para.index = his.selectIndex;
                sendData({pktHeader : his.saveHeader.pkt,paraHeader : his.saveHeader.para,data : data});
            }

            function editEvent(){
                resetName =  nameIpt.ipt.value;
                resetDescription = descriptIpt.ipt.value;
                saveFlag = 'edit';
                displayIpt(true);
            }

            function cancelEvent(){
                nameIpt.ipt.value = resetName;
                descriptIpt.ipt.value = resetDescription;
                displayIpt(false);
            }

            function saveEvent(){
                displayIpt(false);
                var name = his.iptArray[0].ipt.value,
                    creator = his.creator.content,
                    date = his.date.content,
                    description = his.iptArray[1].ipt.value,data;
                if(saveFlag == 'edit'){
                    data = descData[his.selectIndex];
                    if(data.name != name || data.creator != creator || data.description != description || data.time != date){
                        his.saveHeader.para.index = his.selectIndex;
                        descData[his.selectIndex] = {
                            name : name,
                            creator : creator,
                            description : description,
                            time : date
                        };
                        data = {opc : actID.ACT_EDIT, desc : descData[his.selectIndex]};
                        sendData({pktHeader : his.saveHeader.pkt,paraHeader : his.saveHeader.para,data : data});
                        his.listItem.setText(his.selectIndex,1,name);
                        his.listItem.setText(his.selectIndex,3,description);
                    }
                }else if(saveFlag == 'new'){
                    var box = his.listItem.itemBoxArray;
                    var item = [{text:setNO(box.length)},{text:name},{text:creator},{text:description},{text:date}];
                    his.listItem.Add(item);
                    descData.push({
                        name : name,
                        creator : creator,
                        description : description,
                        time : date
                    });
                    his.saveHeader.para.index = box.length-1;
                    //sendData({pktHeader : his.saveHeader.pkt,paraHeader : his.saveHeader.para,data : parasData.scene});
                }
            }

            function displayIpt(flag){
                if(!flag){
                    nameIpt.ipt.readOnly = true;
                    nameBg.renderable(false);
                    descriptIpt.ipt.blur();
                    setTimeout(function(){
                        descriptIpt.ipt.readOnly = true;
                    });
                    descriptionBg.renderable(false);
                    his.cancelBnt.visible(false);
                    his.saveBnt.visible(false);
                    his.applyBnt.visible(true);
                    //his.newBnt.visible(true);
                    his.editBnt.visible(true);
                }else{
                    nameIpt.ipt.readOnly = false;
                    nameBg.renderable(true);
                    descriptIpt.ipt.readOnly = false;
                    descriptionBg.renderable(true);
                    his.cancelBnt.visible(true);
                    his.saveBnt.visible(true);
                    his.applyBnt.visible(false);
                    //his.newBnt.visible(false);
                    his.editBnt.visible(false);
                }

            }
        }

        function paintMemory(){
            var buttonW = local.memoryButtonW,buttonH = local.memoryButtonH,buttonSaceY = local.buttonSpaceY,listPos = local.list,listScrollWidth = local.listScrollWidth;
            his.memory = new kbSprite(memoryPos.x,memoryPos.y,memoryPos.width,memoryPos.height,his.sprite.sprite);
            var userBg = new kbBoxBg(0,0,1,1,boxColor,his.memory.sprite,true);
            userBg.setBorder(1,borderColor,1,true);
            userBg.setRadius(.04);
            popupTitleGraphics(memoryTitleHeight,titleColor,.04,his.memory.sprite);
            new kbBoxText(.5,memoryTitleHeight/2,memoryText.title,titleTextColor,titleFont,his.memory.sprite,.5);
            his.listButton = [];
            paintListButton();
            function paintListButton(){
                var x = .05,space = (1-x*2-buttonW*6)/ 5,y = memoryTitleHeight+buttonSaceY,button,buttonFont=font.button;
                var funcArray = [importEvent,exportEvent,exportAllEvent,delectEvent,clearAllEvent,copyEvent];
                for(var i=0;i<=5;i++){
                    button = new kbButton(x,y,buttonW,buttonH,buttonImg,memoryText.button[i],buttonTextColor,buttonFont[i],his.memory.sprite);
                    button.bounce();
                    button.switchColor(funcArray[i]);
                    his.listButton[i] = button;
                    x += buttonW+space;
                }
                var importInputStyle = {
                    position : 'absolute',
                    display : 'none',
                    background : 'none',
                    border : 'none',
                    padding : 'none',
                    opacity : '0',
                    cursor : 'pointer',
                    fontSize : '0'
                };
                var importIpt = new kbInput(his.listButton[0].sprite,document.body,importInputStyle);
                importIpt.ipt.type = 'file';
                importIpt.ipt.onchange = function(){
                    var file = importIpt.ipt.files[0];
                    var reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = function(){
                        var str = uncompileStr(this.result);
                        var data = JSON.parse(str);
                        var box = his.listItem.itemBoxArray;
                        var item = [{text:setNO(box.length)},{text:data.desc.name},{text:data.desc.creator},{text:data.desc.description},{text:data.desc.time}];
                        his.listItem.Add(item);
                        his.saveHeader.para.index = box.length;
                        data.opc = actID.ACT_IMPORT;
                        sendData({pktHeader : his.saveHeader.pkt,paraHeader : his.saveHeader.para,data : data});
                    }
                };
                function importEvent(){
                    return  importIpt.ipt.click();
                }
                function exportEvent(a){
                    var index = typeof a == 'number' ? a : his.selectIndex;
                    var data = {
                        opc : actID.ACT_EXPORT,
                        desc : descData[index]
                    };
                    sendData({pktHeader : his.saveHeader.pkt,paraHeader : his.saveHeader.para,data : data});
                }
                function exportAllEvent(){
                    for(var i= 0,len=descData.length;i<len;i++){
                        exportEvent(i);
                    }
                }
                function delectEvent(a){
                    if(descData.length <= 1){
                        return;
                    }
                    var index = typeof a == 'number' ? a : his.selectIndex;
                    var box = his.listItem.itemBoxArray;
                    for(var i=index,len=box.length;i<len;i++){
                        his.listItem.setText(i,0,setNO(i-1));
                    }
                    for(i=0,len=his.iptArray.length;i<len;i++){
                        his.iptArray[i].ipt.value = '';
                    }
                    index != undefined && his.listItem.Delete(index);
                    his.selectIndex = undefined;
                    var data = {
                        opc : actID.ACT_REMOVE,
                        desc : descData[index]
                    };
                    descData.splice(index,1);
                    sendData({pktHeader : his.saveHeader.pkt,paraHeader : his.saveHeader.para,data : data});
                    his.selectIndex = 0;
                    his.updateList();
                }
                function clearAllEvent(){
                    for(var i= 0,len=descData.length;i<len;i++){
                        delectEvent(0);
                    }
                }
                function copyEvent(){
                    var box = his.listItem.itemBoxArray;
                    var date = getNewDate();
                    date = date.year+'/'+date.mouth+'/'+date.day;
                    var data = {
                        opc : actID.ACT_COPY,
                        desc : {
                            name : descData[his.selectIndex].name+'_copy',
                            creator : GLOBAL.user,
                            description : descData[his.selectIndex].description,
                            time : date
                        }
                    };
                    descData.push(data.desc);
                    his.saveHeader.para.index = descData.length-1;
                    sendData({pktHeader : his.saveHeader.pkt,paraHeader : his.saveHeader.para,data : data});

                    var lastData = descData[descData.length-1];
                    var addData = [{text : setNO(box.length)},{text : lastData.name},{text : lastData.creator},{text : lastData.description},{text : lastData.time}];
                    his.listItem.Add(addData);
                }
            }
            kbMemoryList(function(i){
                his.selectIndex = i;
                his.saveHeader.para.index = i;
                his.updateList();
            });
            function kbMemoryList(func){
                var playListBox = listBox();
                var listInit = {
                    position : new listPosition(listPos.x,listPos.y),
                    size : new listSize(listPos.width,listPos.height)
                };
                his.list = new playListBox.box(his.memory.sprite,listInit);
                var bodyInit = {
                    position : new listPosition(0,0),
                    size : new listSize(1,1)
                };
                his.listBody = new playListBox.Body(bodyInit);
                var bodyListInit = {
                    position : new listPosition(0,1/15),
                    size : new listSize(1-listScrollWidth,1-1/15)
                };
                his.listList = new playListBox.Body.List(bodyListInit);
                var rollInit = {
                    position : new listPosition(1-listScrollWidth,0),
                    size : new listSize(listScrollWidth,1)
                };
                his.listList.setScrollbar(rollInit);
                var listItemStyles = [],itemWidthArray = [.1,.2,.2,.2,.3];
                for(var i=0;i<5;i++){
                    listItemStyles.push({
                        size : new listSize(itemWidthArray[i],1),
                        margin: new listMargin(0,0),
                        borderRight : new listBorder(1,0x17171b,1),
                        content : new listContent('',contentTextColor,contentFont,'left')
                    })
                }
                var listItemBoxStyles = [],listItemBoxColorArray = [0x3d3d46,0x373740];
                for(var j=0;j<2;j++){
                    listItemBoxStyles.push({
                        margin: new listMargin(0,0),
                        size: new listSize(1,1/15),
                        color : new listColor(listItemBoxColorArray[j],1)
                    })
                }
                var listItems = [];
                his.listItem = new playListBox.Body.List.Item(listItemBoxStyles,listItemStyles,listItems);
                var selectData = {
                    color : new listColor(0x123123,1)
                };
                his.listItem.select(selectData,func);
                his.listItem.setNoMultiselect(true);
                var seqmentInit = {
                    position : new listPosition(0,0),
                    size : new listSize(1-listScrollWidth,1/15),
                    color : new listColor(0x22222b,1)
                };
                var seqmentItems = [],seqmentWidthArray = [.1,.2,.2,.2,.3];
                for(var i=0;i<5;i++){
                    seqmentItems.push({
                        size : new listSize(seqmentWidthArray[i],1),
                        margin: new listMargin(0,0),
                        content : new listContent(memoryText.seqment[i],contentTextColor,contentFont,'left'),
                        borderRight : new listBorder(1,0x17171b,1)
                    })
                }
                his.listSeqment = new playListBox.Body.Seqment(seqmentInit,seqmentItems);
            }
        }

        paintSelect();
        paintMemory();
    };

    kbScene.prototype.updateList = function(){
        var items = this.listItem.items[this.selectIndex],name = items[1].text,creator = items[2].text,date = items[4].text,description = items[3].text,index = items[0].text;
        this.iptArray[0].ipt.value = name;
        this.creator.setText(creator);
        this.date.setText(date);
        this.iptArray[1].ipt.value = description;
        this.index.setText(index);
    };

    kbScene.prototype.updateData = function(){
        this.iptOpen();
    };

    kbScene.prototype.resize = function(){
        var local = staticDataLocal.scene,
            selectPos = local.select,memoryPos = local.memory,tabPos = local.tab;
        this.select.resize(selectPos.x,selectPos.y,selectPos.width,selectPos.height);
        this.memory.resize(memoryPos.x,memoryPos.y,memoryPos.width,memoryPos.height);
        this.tab.resize(tabPos.x,tabPos.y,tabPos.width,tabPos.height);
    };

    kbScene.prototype.setLock = function(flag){
        this.lock = flag;
        this.parent.interactiveChildren = !this.lock;
    };

    var kbPorts = function(){
        this.parent = ctx.ports.sprite;
        ctx.ports.setRenderClearRect(this.parent);
        this.paintBox();
        ctx.ports.visible(false);
    };

    kbPorts.prototype.paintBox = function(){
        var faderBoxPos = staticDataLocal.ports.faderBox;
        this.faderBox = new kbSprite(faderBoxPos.x,faderBoxPos.y,faderBoxPos.width,faderBoxPos.height,this.parent);
        this.paintFader();
    };

    kbPorts.prototype.paintFader = function(){
        this.faderArray = [];
        var his = this,faders,height = 1,x = 0,y = 0;
        var width = staticDataLocal.ports.faderWidth;
        for(var i= 0,len=chID.CH_IN_NUM;i<len;i++){
            faders = new kbPortsFader(canvasCache.mainFaderMono,his.faderBox.sprite,x,y,width,height,i,'ports');
            his.faderArray.push(faders);
            faders.setSwitchFunc(faderSwitchBg,canvasCache.mainFaderMonoLight);
            x += width;
        }
        this.boxTraverse = new kbBoxTraverse(this.faderBox.sprite,(1-width*chID.CH_IN_NUM),staticDataLocal.main.scrollBarHeight,ctx.ports);
    };

    kbPorts.prototype.updateData = function(){
        for(var i= 0,len=this.faderArray.length;i<len;i++){
            this.faderArray[i].updateData();
        }
        this.resize();
    };

    kbPorts.prototype.resize = function(){
        var local = staticDataLocal.ports,faderBoxPos = local.faderBox,
            faderWidth = local.faderWidth,scrollBarPosH = local.scrollBarHeight;
        this.faderBox.resize(faderBoxPos.x,faderBoxPos.y,faderBoxPos.width,faderBoxPos.height);
        for(var i= 0,len = this.faderArray.length;i<len;i++){
            this.faderArray[i].resize(faderWidth*i,0,faderWidth,1);
        }
        this.boxTraverse.resize(1-faderWidth*chID.CH_IN_NUM,scrollBarPosH);
        if(faderWidth*10 < 1){
            this.faderBox.setX(0);
        }
    };

    var kbSendsPage = function(parent,tabIndex){
        this.parent = parent;
        this.tabIndex = tabIndex;
        this.paintBox();
        this.paintFader();
        this.sprite.visible(false);
    };

    kbSendsPage.prototype.paintBox = function(){
        var faderBoxPos = staticDataLocal.sends.faderBox;
        this.sprite = new kbSprite(0,0,1,1,this.parent);
        var mask = new kbBoxBg(0,0,1,1,0x123123,this.sprite.sprite);
        this.sprite.sprite.mask = mask.graphics;
        this.sprite.setRenderClearRect();
        this.faderBox = new kbSprite(faderBoxPos.x,faderBoxPos.y,faderBoxPos.width,faderBoxPos.height,this.sprite.sprite);
    };

    kbSendsPage.prototype.paintFader = function(){
        var x = 0,y = 0,faders,height = 1,
            faderBg = staticDataColor.fader.backGroundColor,width = staticDataLocal.sends.faderWidth;
        this.faderArray = [];
        for(var i=0;i<=chID.CH_8;i++){
            faders = new kbSendsFader(canvasCache.mainFaderMono,this.faderBox.sprite,x,y,width,height,i,'sends');
            faders.tabIndex = this.tabIndex;
            x += width;
            this.faderArray.push(faders);
            faders.setSwitchFunc(faderSwitchBg,canvasCache.mainFaderMonoLight);
        }
        this.boxTraverse = new kbBoxTraverse(this.faderBox.sprite,(1-width*(chID.CH_IN_NUM-1)),staticDataLocal.main.scrollBarHeight,this.sprite);
    };

    kbSendsPage.prototype.updateData = function(){
        for(var i= 0,len=this.faderArray.length;i<len;i++){
            this.faderArray[i].updateData();
        }
    };

    kbSendsPage.prototype.resize = function(i){
        var local = staticDataLocal.sends,faderWidth = local.faderWidth,faderBoxPos = local.faderBox,scrollBarPosH = local.scrollBarHeight;
        this.faderBox.setHeight(faderBoxPos.height);
        for(var i= 0,len = this.faderArray.length;i<len;i++)this.faderArray[i].resize(faderWidth*i,0,faderWidth,1);
        this.boxTraverse.resize(1-faderWidth*(chID.CH_IN_NUM-1),scrollBarPosH);
        faderWidth*10 < 1 && this.faderBox.setX(0);
    };

    var kbSends = function(){
        this.parent = ctx.sends.sprite;
        this.paintPage();
        ctx.sends.visible(false);
    };

    kbSends.prototype.paintPage = function(){
        var content = [],tabPos = staticDataLocal.sends.tab,his = this;
        this.pageArray = [];
        this.reverb = new kbSendsPage(this.parent,0);
        this.echo = new kbSendsPage(this.parent,1);
        content.push(this.reverb.sprite.sprite,this.echo.sprite.sprite);
        this.pageArray.push(this.reverb,this.echo);
        var titleStyle = {
            x : tabPos.x,
            width : tabPos.width,
            height : tabPos.height,
            images : [images[imgID.tabButtonLeft],images[imgID.tabButtonLeft_light],images[imgID.tabButtonRight],images[imgID.tabButtonLeft_light]],
            space : .02,
            buttonSpace : 19.5
        };
        var titleText = staticDataString.sends.tab;
        this.tab = new kbTab(titleText,titleStyle,this.parent,content,tabEvent);
        this.tab.switchBg(0);

        function tabEvent(i){
            his.tab.index = i;
            his.pageArray[i].resize();
        }
    };

    kbSends.prototype.updateData = function(){
        this.pageArray[this.tab.index].resize();
        this.pageArray[0].updateData();
        this.pageArray[1].updateData();
    };

    kbSends.prototype.resize = function(){
        var local = staticDataLocal.sends,
            tabPos = local.tab;
        this.tab.resize(tabPos.x,tabPos.y,tabPos.width,tabPos.height);
        this.reverb.resize();
        this.echo.resize();
    };

    var kbGroupPage = function(parent){
        this.parent = parent;
        this.ID = 1;
        this.indexButtonArray = [];
        this.buttonArray = [];
        this.lockFlag = [0,0,0,0];
        this.box();
    };

    kbGroupPage.prototype.box = function(){
        var boxPos = staticDataLocal.group.box;
        this.sprite = new kbSprite(boxPos.x,boxPos.y,boxPos.width,boxPos.height,this.parent);
        this.paint();
    };

    kbGroupPage.prototype.setData = function(){
        for(var i= 0,len=11;i<len;i++){
            setItemData(this.buttonArray[i],new sendHeader.setup_group(),this.data[this.ID],i,undefined,groupData);
        }
        this.clearBnt.setSendData(groupData);
        this.clearBnt.setSendHeader(new sendHeader.setup_group());
        this.allBnt.setSendData(groupData);
        this.allBnt.setSendHeader(new sendHeader.setup_group());
    };

    kbGroupPage.prototype.paint = function(){
        var local = staticDataLocal.group,color = staticDataColor.group,textColor = color.text,font = staticDataFont.group,string = staticDataString.group,
            buttonW = local.buttonW,buttonH = local.buttonH,buttonH1 = local.buttonH1,spaceY = local.spaceY,buttonSpace = local.buttonSpace,radioButtonW = local.radioButtonW,radioButtonH = local.radioButtonH,
            indexColor = textColor.index,buttonGroupTextColor = textColor.buttonGroup, buttonTextColor = textColor.button,radioButtonTextColor = textColor.buttonGroup,fontNum = font.num,fontIndex = font.index,fontButton = font.button,
            stringIndex = string.index,stringGroup = string.group,stringButton = string.button,stringRadioButton = string.radioButton,
            buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]],groupButtonImg = [images[imgID.set_button],images[imgID.set_button_light]],button,his = this;
        var x = .1,y= 0,spaceX = (1-buttonW*4-x)/ 3;

        function paintIndexButton(){
            for(var i=0;i<4;i++){
                button = new kbButton(x,y,buttonW,buttonH,groupButtonImg,stringGroup[i],buttonGroupTextColor,fontNum,his.sprite.sprite);
                button.index = i+1;
                his.indexButtonArray[i] = button;
                x += buttonW+spaceX;
            }
            kbSetRadioButton(his.indexButtonArray,indexButtonEvent);
            his.indexButtonArray[0].actionEvent();

            function indexButtonEvent(button){
                if(his.data){
                    his.ID = button.index;
                    his.updateButton();
                    his.setData();
                }
            }
        }

        function paintClearButton(){
            x = .1;y += buttonH+spaceY;
            his.clearBnt = new kbButton(x,y,buttonW,buttonH1,buttonImg,stringButton[0],buttonTextColor,fontButton,his.sprite.sprite);
            his.clearBnt.bounce();
            his.clearBnt.switchColor(clearButtonEvent);
            x += buttonW+spaceX;

            his.allBnt = new kbButton(x,y,buttonW,buttonH1,buttonImg,stringButton[1],buttonTextColor,fontButton,his.sprite.sprite);
            his.allBnt.bounce();
            his.allBnt.switchColor(allButtonEvent);
            x += buttonW+spaceX;
            function clearButtonEvent(){
                for(var i= 0;i<18;i++){
                    his.data[his.ID][i] = 0;
                    kbChangeButtonColor(his.buttonArray[i],0);
                }
            }

            function allButtonEvent(){
                for(var i= 0;i<18;i++){
                    his.data[his.ID][i] = 1;
                    kbChangeButtonColor(his.buttonArray[i],1);
                }
            }
        }

        function paintGroupButton(){
            x = .1;y += buttonH1+spaceY;
            for(var i= 0,len=stringIndex.length;i<len;i++){
                new kbBoxText(x -.04,y+buttonH/2,stringIndex[i],indexColor,fontIndex,his.sprite.sprite,1,.5);
                button = kbRadioButton(x,y,radioButtonW,radioButtonH,buttonSpace,stringRadioButton[i],buttonGroupTextColor,fontButton,his.sprite.sprite,true);
                his.buttonArray.push.apply(his.buttonArray,button);
                y += buttonH+spaceY;
            }
            for(i=0,len=his.buttonArray.length;i<len;i++)his.buttonArray[i].switchColor();
        }

        paintIndexButton();
        paintClearButton();
        paintGroupButton();
    };

    kbGroupPage.prototype.updateButton = function(){
        var id = this.ID-1;
        for(var i= 0,len=11;i<len;i++){
            kbChangeButtonColor(this.buttonArray[i],this.data[this.ID][i]);
        }
        this.clearBnt.interactive(!this.lockFlag[id]);
        this.allBnt.interactive(!this.lockFlag[id]);
        for(i= 0,len=this.buttonArray.length;i<len;i++){
            this.buttonArray[i].interactive(!this.lockFlag[id]);
        }
    };

    kbGroupPage.prototype.updateData = function(data){
        if(data != this.data){
            this.data = data;
            this.updateButton();
            this.setData();
        }
    };

    kbGroupPage.prototype.resize = function(){
        var boxPos = staticDataLocal.group.box;
        this.sprite.resize(boxPos.x,boxPos.y,boxPos.width,boxPos.height);
    };

    kbGroupPage.prototype.setLock = function(attr){
        this.lockFlag = attr;
    };

    var kbGroup = function(){
        this.sprite = ctx.group.sprite;
        this.box();
        ctx.group.visible(false)
    };

    kbGroup.prototype.setData = function(){
        this.data = [groupData.view,groupData.mute,groupData.solo];
        this.lockFlag = [[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        this.tab.switchBg(0);
    };

    kbGroup.prototype.box = function(){
        this.paintPage();
        //this.nav = new kbButtonNav(this.sprite);
        //GLOBAL.mainPopup.rename.groupButtonArray = this.nav.buttonArray;
    };

    kbGroup.prototype.paintPage = function(){
        var content = [],tabPos = staticDataLocal.group.tab,his = this;
        this.pageArray = [];
        this.view = new kbGroupPage(this.sprite,0);
        this.mute = new kbGroupPage(this.sprite,1);
        this.solo = new kbGroupPage(this.sprite,2);
        content.push(this.view.sprite.sprite,this.mute.sprite.sprite,this.solo.sprite.sprite);
        this.pageArray.push(this.view,this.mute,this.solo);
        var titleStyle = {
            x : tabPos.x,
            width : tabPos.width,
            height : tabPos.height,
            images : [images[imgID.tabButtonLeft],images[imgID.tabButtonLeft_light],images[imgID.tabButtonRight],images[imgID.tabButtonLeft_light]],
        };
        var titleText = staticDataString.group.tab;
        this.tab = new kbTab(titleText,titleStyle,this.sprite,content,tabEvent);
        this.tab.index = 0;
        function tabEvent(i){
            his.tab.index = i;
            his.pageArray[i].resize();
            his.pageArray[i].setLock(his.lockFlag[i]);
            his.pageArray[i].updateData(his.data[i])
        }
    };

    kbGroup.prototype.updateData = function(){
        var index = this.tab.index;
        this.pageArray[index].resize();
        this.pageArray[index].setLock(this.lockFlag[index]);
        this.pageArray[index].updateButton();
    };

    kbGroup.prototype.resize = function(){
        var tabPos = staticDataLocal.group.tab;
        this.tab.resize(tabPos.x,tabPos.y,tabPos.width,tabPos.height);
        this.pageArray[this.tab.index].resize();
    };

    kbGroup.prototype.setLock = function(i,j,flag){
        this.lockFlag[i][j] = flag;
    };
    /*初始化页面，包括main,ports,edit,sends,group,setup,scene页面*/
    var initPage = function(){
        this.createPage();
    };

    initPage.prototype.createPage = function(){
        this.main = new kbMain();
        this.scene = new kbScene();
        this.ports = new kbPorts();
        this.edit = new kbEdit();
        this.sends = new kbSends();
        this.group = new kbGroup();
        this.set = new kbSet();
        this.set.safes.channel = this.main.faderArray;
    };

    initPage.prototype.updateDate = function(){
        var faderArray = getFaderArray();
        for(var i= 0,len=faderArray.length;i<len;i++){
            for(var j= 0,olen=faderArray[i].length;j<olen;j++){
                faderArray[i][j].setData();
                if(j < chID.CH_MASTER && i == 0){
                    this.edit.eq.updateData(j);
                }else if(i == 0){
                    this.edit.geq.updateData(j);
                }
            }
        }

        this.main.updateData();
        this.edit.setData();
        this.scene.setData();
        this.group.setData();
        this.set.user.setData();
        this.set.safes.updateButton();
        this.set.settings.updateData();
        dispearAllInput();
        displayPage(ctx.main);
        this.set.user.updateData();
    };

    initPage.prototype.resize = function(){
        this.main.resize();
        this.edit.resize();
        this.ports.resize();
        this.group.resize();
        this.sends.resize();
        this.set.resize();
        this.scene.resize();
    };

    var kbSet = function(){
        this.sprite = ctx.set.sprite;
        this.paintPage();
        ctx.set.visible(false);
    };

    kbSet.prototype.paintPage = function(){
        var content = [],pageArray = [],tabPos = staticDataLocal.set.tab,his = this;
        this.safes = new kbSetSafes(this.sprite);
        this.settings = new kbSetSettings(this.sprite);
        this.user = new kbSetUser(this.sprite);
        this.network = new kbSetNetwork(this.sprite);
        this.upgrade = new kbSetUpgrade(this.sprite);
        this.about = new kbSetAbout(this.sprite);
        content.push(this.safes.sprite.sprite,this.settings.sprite.sprite,this.user.sprite.sprite,this.network.sprite.sprite,this.upgrade.sprite.sprite,this.about.sprite.sprite);
        pageArray.push(this.safes,this.settings,this.user,this.network,this.upgrade,this.about);
        var titleStyle = {
            x : tabPos.x,
            width : tabPos.width,
            height : tabPos.height,
            images : [images[imgID.set_tab_left],images[imgID.set_tab_left_light],images[imgID.set_tab_right],images[imgID.set_tab_left_light]],
        };
        var titleText = staticDataString.set.tab;
        this.tab = new kbTab(titleText,titleStyle,this.sprite,content,switchPageEvent);
        this.tab.switchBg(0);

        function switchPageEvent(i){
            his.tab.index = i;
            displayInput(i);
        }
        function displayInput(a){
            for(var i=1;i<=4;i++){
                if(a == i){
                    pageArray[i].iptOpen();
                }else{
                    pageArray[i].iptClose();
                }
            }
            if(a == 3){
                his.network.updateData();
            }
        }
    };

    kbSet.prototype.updateData = function(){
        if(this.tab.index == 2){
            this.user.iptOpen();
        }else{
            this.user.iptClose();
        }
    };

    kbSet.prototype.resize = function(){
        var tabPos = staticDataLocal.set.tab;
        this.tab.resize(tabPos.x,tabPos.y,tabPos.width,tabPos.height);
        this.safes.resize();
        this.settings.resize();
        this.user.resize();
        this.network.resize();
        this.upgrade.resize();
        this.about.resize();
    };

    var kbSetSafes = function(parent){
        this.parent = parent;
        this.buttonArray = [];
        this.channel = [];
        this.box();
    };

    kbSetSafes.prototype.box = function(){
        this.sprite = new kbSprite(0,0,1,1,this.parent);
        this.paintLeft();
        this.paintRight();
        this.buttonEvent();
    };

    kbSetSafes.prototype.paintLeft = function(){
        var leftPos = staticDataLocal.setSafes.left,string = staticDataString.setSafes,
            title = string.title,leftIndex = string.leftIndex,leftButton = string.leftButton;
        this.left = new kbSprite(leftPos.x,leftPos.y,leftPos.width,leftPos.height,this.sprite.sprite);
        this.paintButton(title,leftIndex,leftButton,this.left.sprite);
    };

    kbSetSafes.prototype.paintRight = function(){
        var rightPos = staticDataLocal.setSafes.right,rightIndex = staticDataString.setSafes.rightIndex,rightButton = staticDataString.setSafes.rightButton;
        this.right = new kbSprite(rightPos.x,rightPos.y,rightPos.width,rightPos.height,this.sprite.sprite);
        this.paintButton(null,rightIndex,rightButton,this.right.sprite);
    };

    kbSetSafes.prototype.paintButton = function(strTitle,strIndex,strButton,parent){
        var  local = staticDataLocal.setSafes,textColor = staticDataColor.setSafes.text,font = staticDataFont.setSafes,
            titleColor = textColor.title,indexColor = textColor.index,buttonColor = textColor.button,titleFont = font.title,
            indexFont = font.index,buttonFont = font.button,buttonW = local.buttonW,buttonH = local.buttonH,space = local.space,
            titleSpace = local.titleSpace,buttonSpace = local.buttonSpace,x = .23,y = titleSpace,button;
        if(strTitle != null && strTitle){
            new kbBoxText(x -.01,0,strTitle,titleColor,titleFont,parent,1,0);
        }
        for(var i= 0,len=strIndex.length;i<len;i++){
            new kbBoxText(x -.01,y+buttonH/2,strIndex[i],indexColor,indexFont,parent,1,.5);
            button = kbRadioButton(x,y,buttonW,buttonH,buttonSpace,strButton[i],buttonColor,buttonFont,parent,true);
            this.buttonArray.push.apply(this.buttonArray,button);
            y += buttonH+space;
        }
    };

    kbSetSafes.prototype.buttonEvent = function(){
        var id = [0,1,2,3,4,null,null,null,5,6,9,10,null,null,null,null,7,8,11],his = this;
        for(var i= 0,len=this.buttonArray.length;i<len;i++){
            this.buttonArray[i].index = i;
            this.buttonArray[i].switchColor(buttonEvent);
        }

        function buttonEvent(button){
            var index = button.index,
                channelId = id[index];
            if(channelId != null && index <19){
                his.channel[channelId].setLock(button.eventFlag);
            }else if(index >=19 && index <27){
                var lockArray = init.page.group.lockFlag,i = index-19;
                lockArray[parseInt(i/4)+1][i%4] = button.eventFlag;
            }else if(index == 29){
                init.page.scene.setLock(button.eventFlag);
            }else if(index == 30){
                init.page.set.settings.setLock(button.eventFlag);
            }else if(index == 31){
                init.page.set.network.setLock(button.eventFlag);
            }
            GLOBAL.setSafes = replaceString(GLOBAL.setSafes,index,boolean2number(button.eventFlag));
            try{
                localStorage.setItem('setSafes',GLOBAL.setSafes);
            }catch(err) {
                kbLog('error','localStorage error:',err);
            }

        }
        this.setSafesButtonEvent = buttonEvent;
    };

    kbSetSafes.prototype.updateButton = function(){
        for(var i= 0,len=this.buttonArray.length;i<len;i++){
            kbChangeButtonColor(this.buttonArray[i],parseInt(GLOBAL.setSafes[i]));
            this.setSafesButtonEvent(this.buttonArray[i]);
        }
    };

    kbSetSafes.prototype.resize = function(){
        var local = staticDataLocal.setSafes,leftPos = local.left,rightPos = local.right;
        this.left.resize(leftPos.x,leftPos.y,leftPos.width,leftPos.height);
        this.right.resize(rightPos.x,rightPos.y,rightPos.width,rightPos.height);
    };

    var kbSetSettings = function(parent){
        inputClass.call(this);
        this.iptArray = [];
        this.parent = parent;
        this.titleColor = staticDataColor.setSettings.text.title;
        this.titleFont = staticDataFont.setSettings.title;
        this.indexColor = staticDataColor.setSettings.text.index;
        this.indexFont = staticDataFont.setSettings.index;
        this.buttonColor = staticDataColor.setSettings.text.button;
        this.buttonFont = staticDataFont.setSettings.button;
        this.box();
        this.paintGloble();
        this.paintLocal();
    };

    kbSetSettings.prototype.box = function(){
        this.sprite = new kbSprite(0,0,1,1,this.parent);
    };

    kbSetSettings.prototype.paintGloble = function() {
        var local = staticDataLocal.setSettings,string = staticDataString.setSettings,globlePos = local.globle,globleIndex = string.globleIndex,globleButton = string.globleButton,
            globleTitle = string.globleTitle,buttonW = local.buttonWidth, buttonH = local.buttonHeight1, spaceY = local.spaceY1, y = local.titleSpace1;
        var funcArray = [lrEvent,soloModeEvent, recordModeEvent, powerModeEvent,minerModeEvent];
        var setHeader =  new sendHeader.setup_sett(),mixerHeader =  new sendHeader.misc_mixerMode(),setOldData = {};
        this.globleSprite = new kbSprite(globlePos.x, globlePos.y, globlePos.width, globlePos.height, this.sprite.sprite);
        this.globleButtonArray = this.paintButton(globleIndex, globleButton, globleTitle, buttonW, buttonH, spaceY, y, this.globleSprite.sprite, funcArray);

        function lrEvent(i) {
            switchButton(settingData,'LR',i,setHeader);
        }

        function soloModeEvent(i) {
            init.page.main.setSoloRadio(!i);
            switchButton(settingData,'solo_mode',i,setHeader);
        }

        function recordModeEvent(i) {
            switchButton(settingData,'rec_mode',i,setHeader);
        }

        function powerModeEvent(i) {
            switchButton(settingData,'pwr_mode',i,setHeader);
        }

        function minerModeEvent(i){
            GLOBAL.masterMode = i;
            switchButton(miscData.mixermode,'mode',i,mixerHeader);
        }

        function switchButton(data,attr,i,header) {
            data[attr] = i;
            if(setOldData[attr] != data[attr]){
                sendData({pktHeader : header.pkt,paraHeader : header.para,data : data});
                setOldData[attr] = data[attr];
            }
        }
    };

    kbSetSettings.prototype.paintLocal = function(){
        var local = staticDataLocal.setSettings,string = staticDataString.setSettings,localPos = local.local,localIndex = string.localIndex,
            localButton = string.localButton,localTitle = string.localTitle,buttonW = local.buttonWidth,buttonH = local.buttonHeight2,
            spaceY = local.spaceY2,y = local.titleSpace2,funcArray = [clipHoldEvent,rescaleEvent,frameRateEvent,languageEvent],his = this;
        this.clipHold = [0,1000,2000,3000,5000,8000,10000];
        this.localSprite = new kbSprite(localPos.x,localPos.y,localPos.width,localPos.height,this.sprite.sprite);
        this.localButton = this.paintButton(localIndex,localButton,localTitle,buttonW,buttonH,spaceY,y,this.localSprite.sprite,funcArray);
        function clipHoldEvent(i){
            GLOBAL.clipHold = his.clipHold[i];
            localStorage.setItem('setClipHold',GLOBAL.clipHold);
        }
        function rescaleEvent(i){
            switch(i){
                case 0 :
                    GLOBAL.setRescale = 1;
                    resize();
                    break;
                case 1 :
                    GLOBAL.setRescale = 0;
                    break;
            }
            localStorage.setItem('setRescale',GLOBAL.setRescale);
        }
        function frameRateEvent(i){
            switch(i){
                case 0 :
                    GLOBAL.fps = 60;
                    break;
                case 1 :
                    GLOBAL.fps = 60/2;
                    break;
                case 2 :
                    GLOBAL.fps = 60/3;
                    break;
                case 3 :
                    GLOBAL.fps = 60/4;
                    break;
            }
            localStorage.setItem('setFps',GLOBAL.fps);
        }
        function languageEvent(i){
            switch(i){
                case 0 :
                    GLOBAL.language = 'cn';
                    break;
                case 1 :
                    GLOBAL.language = 'en';
                    break;
            }
            switchLanguage(GLOBAL.language);
            localStorage.setItem('setLanguage',GLOBAL.language);
        }
    };

    kbSetSettings.prototype.setLocalSettings = function(){
        var his = this,attr = [clipHoldEvent(),rescaleEvent(),frameRateEvent(),languageEvent()];
        kbChangeRadioButtonArrayColor(this.localButton,attr);
        function clipHoldEvent(){
            for(var i= 0,len=his.clipHold.length;i<len;i++){
                if(GLOBAL.clipHold == his.clipHold[i]){
                    return i;
                }
            }
        }
        function rescaleEvent(){
            switch(GLOBAL.setRescale){
                case 0 :
                    return 1;
                case 1 :
                    return 0;
            }
        }
        function frameRateEvent(){
            switch(GLOBAL.fps){
                case 60 :
                    return 0;
                case 60/2 :
                    return 1;
                case 60/3 :
                    return 2;
                case 60/4 :
                    return 3;
            }
        }
        function languageEvent(){
            switch(GLOBAL.language){
                case 'cn' :
                    return 0;
                case 'en' :
                    return 1;
            }
            switchLanguage(GLOBAL.language);
        }
    };

    kbSetSettings.prototype.paintButton = function(strIndex,strButton,strTitle,buttonW,buttonH,spaceY,y,parent,funcArray){
        var x = .15,buttonArray = [],button,space = 2/700;
        new kbBoxText(x -.01,0,strTitle,this.titleColor,this.titleFont,parent,1,0);
        for(var i= 0,len=strIndex.length;i<len;i++){
            new kbBoxText(x -.02,y+buttonH/2,strIndex[i],this.indexColor,this.indexFont,parent,1,.5);
            button = kbRadioButton(x,y,buttonW,buttonH,space,strButton[i],this.buttonColor,this.buttonFont,parent,funcArray[i]);
            buttonArray.push(button);
            y += buttonH+spaceY;
        }
        return buttonArray;
    };

    kbSetSettings.prototype.updateData = function(){
        GLOBAL.masterMode = miscData.mixermode.mode;
        var globleBntVal = [settingData.LR,settingData.solo_mode,settingData.rec_mode,settingData.pwr_mode,miscData.mixermode.mode];
        kbChangeRadioButtonArrayColor(this.globleButtonArray,globleBntVal);
    };

    kbSetSettings.prototype.resize = function(){
        var globlePos = staticDataLocal.setSettings.globle,
            localPos = staticDataLocal.setSettings.local;
        this.globleSprite.resize(globlePos.x,globlePos.y,globlePos.width,globlePos.height);
        this.localSprite.resize(localPos.x,localPos.y,localPos.width,localPos.height);
    };

    kbSetSettings.prototype.setLock = function(flag){
        this.lock = flag;
        this.sprite.sprite.interactiveChildren = !this.lock;
    };

    var kbSetUser = function(parent){
        inputClass.call(this);
        this.parent = parent;
        this.buttonArray = [];
        this.radioButtonArray = [];
        this.listSelectIndex = 0;
        this.initID();
        this.box();
        this.paintUser();
        this.paintAccount();
        this.paintAuthorization();
    };

    kbSetUser.prototype.initID = function(){
        this.buttonID = [];
        for(var v in  userID){
            if(userID[v] >= userID.ID_CH1 && userID[v] <= userID.ID_SETUP){
                this.buttonID.push(userID[v]);
            }
        }
        this.header = new sendHeader.setup_user(this.listSelectIndex);
    };

    kbSetUser.prototype.setData = function(){
        this.header.para.index = this.listSelectIndex;
        this.accountSave.setSendHeader(this.header);
        this.accountSave.setSendData(userData[this.listSelectIndex]);
        this.accountSave.sendOldData = objClone(userData[this.listSelectIndex]);
        this.authSave.setSendHeader(this.header);
        this.authSave.setSendData(userData[this.listSelectIndex]);
        this.authSave.sendOldData = objClone(userData[this.listSelectIndex]);
    };

    kbSetUser.prototype.box = function(){
        this.sprite = new kbSprite(0,0,1,1,this.parent);
    };

    kbSetUser.prototype.paintUser = function(){
        var local = staticDataLocal.setUser,color = staticDataColor.setUser,font = staticDataFont.setUser,string = staticDataString.setUser,
            userPos = local.user, userScrollWidth = local.userScrollWidth,boxColor = color.box, titleColor = color.title, borderColor = color.border,
            titleHeight = local.userTitleHeight, titleText = string.userTitle, titleTextColor = color.text.title,
            titleTextFont = font.title, listPos = local.userList, buttonBoxHeight = local.userButtonBoxHeight,
            buttonTextColor = color.text.button, buttonText = string.userButton,textFont = font.other,
            buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]],his = this;
        this.user = new kbSprite(userPos.x,userPos.y,userPos.width,userPos.height,this.sprite.sprite);
        var userBg = new kbBoxBg(0,0,1,1,boxColor,this.user.sprite,true);
        userBg.setBorder(1,borderColor,1,true);
        userBg.setRadius(.04);
        popupTitleGraphics(titleHeight,titleColor,.04,this.user.sprite);
        new kbBoxText(.5,titleHeight/2,titleText,titleTextColor,titleTextFont,this.user.sprite,.5);
        this.list = {};
        kbUserList(clickItemBox);
        function kbUserList(func){
            var playListBox = listBox();
            var listInit = {
                position:new listPosition(listPos.x,listPos.y),
                size:new listSize(listPos.width,listPos.height)
            };
            his.list.list = new playListBox.box(his.user.sprite,listInit);
            var bodyInit = {
                position : new listPosition(0,0),
                size : new listSize(1,1)
            };
            his.list.listBody = new playListBox.Body(bodyInit);
            var bodyListInit = {
                position : new listPosition(0,1/15),
                size : new listSize(1-userScrollWidth,1-1/15)
            };
            his.list.listList = new playListBox.Body.List(bodyListInit);
            var rollInit = {
                position : new listPosition(1-userScrollWidth,0),
                size : new listSize(userScrollWidth,1)
            };
            his.list.listList.setScrollbar(rollInit);
            var listItemBoxStyle = {
                margin: new listMargin(0,0),
                size: new listSize(1,1/15),
                color : new listColor(0x373740,1)
            };
            var listItemBoxStyle2 = {
                margin: new listMargin(0,0),
                size: new listSize(1,1/15),
                color : new listColor(0x3d3d46,1)
            };
            var listItemStyle = {
                size: new listSize(.25,1),
                margin: new listMargin(0,0),
                borderRight : new listBorder(1,0x17171b,1),
                content : new listContent('','#a8a8a8','12pt')
            };
            var listItemStyle2 = listItemStyle;
            listItemStyle2.content = new listContent('','#a8a8a8','12pt','left');
            var listItems1 = [];
            var listItemBoxStyles = [listItemBoxStyle,listItemBoxStyle2];
            var listItemStyles = [listItemStyle,listItemStyle2,listItemStyle2,listItemStyle2];
            his.list.listItem = new playListBox.Body.List.Item(listItemBoxStyles,listItemStyles,listItems1);
            var selectData = {
                color : new listColor(0x123123,1)
            };
            his.list.listItem.select(selectData,func);
            his.list.listItem.setNoMultiselect(true);
            var seqmentInit = {
                position : new listPosition(0,0),
                size : new listSize(.96,1/15),
                color : new listColor(0x3d3d46,1)
            };
            var seqmentTitle = string.userSeqment,seqmentItems = [];
            for(var i=0;i<4;i++){
                seqmentItems.push({
                    size : new listSize(.25,1),
                    margin: new listMargin(0,0),
                    content : new listContent(seqmentTitle[i],'#a8a8a8','12pt','left'),
                    borderRight : new listBorder(1,0x17171b,1)
                })
            }
            his.list.listSeqment = new playListBox.Body.Seqment(seqmentInit,seqmentItems);
        }

        this.userButtonBox = new kbSprite(0,1-buttonBoxHeight,1,buttonBoxHeight,this.user.sprite);
        var buttonW = .23,len=buttonText.length,buttonX = (1-buttonW*len)*.3,buttonSpace = (1-buttonW*len-buttonX*2)/3,button;
        var funcArray = [listNewEvent,listCopyEvent,listRemoveEvent,listClearEvent];
        for(var i= 0;i<len;i++){
            button = new kbButton(buttonX,.21,buttonW,.58,buttonImg,buttonText[i],buttonTextColor,textFont,this.userButtonBox.sprite);
            buttonX += buttonW+buttonSpace;
            button.bounce();
            button.switchColor(funcArray[i]);
        }
        function listNewEvent(){
            var count = userData.length;
            var newData = {
                type : emSign.SIGN_UP,
                name : 'user_'+count,
                passwd : '123456',
                sign_up : true,
                perm : {
                role : emRole.ROLE_OPERATOR,
                rw : [
                        {w : 0,r : 0},
                        {w : 0,r : 0},
                        {w : 0,r : 0},
                        {w : 0,r : 0},
                        {w : 0,r : 0},
                        {w : 0,r : 0},
                        {w : 0,r : 0},
                        {w : 0,r : 0},
                        {w : 0,r : 0},
                        {w : 0,r : 0},
                        {w : 0,r : 0},
                        {w : 0,r : 0},
                        {w : 0,r : 0}
                    ]
                }
            };
            var box = his.list.listItem.itemBoxArray;
            var item = [{text : setNO(box.length)},{text : newData.name},{text : jugeRoleValue(newData.perm.role)},{text : jugeStateValue(newData.type)}];
            his.list.listItem.Add(item);
            his.header.para.index = userData.length;
            //sendData({pktHeader : his.header.pkt,paraHeader : his.header.para,data : newData});
            userData.push(newData);
        }

        function listCopyEvent(){
            var listItems = his.list.listItem.items;
            var listBox = his.list.listItem.itemBoxArray;
            var str = '_copy';
            if(his.listSelectIndex){
                listItems[his.listSelectIndex][0].text = setNO(listItems.length);
                listItems[his.listSelectIndex][1].text += str;
                his.list.listItem.Add(listItems[his.listSelectIndex]);
            }
            var data = objClone(userData[his.listSelectIndex]);
            data.type = emSign.SIGN_UP;
            data.name += str;
            userData.push(data);
            his.header.para.index = his.listSelectIndex+1;
            sendData({pktHeader : his.header.pkt,paraHeader : his.header.para,data : data});
            listBox[listBox.length-1].sprite._events.mousedown.fn();
        }

        function listRemoveEvent(){
            his.listSelectIndex != undefined ? his.list.listItem.Delete(his.listSelectIndex) : console.log('请选择');
            var box = his.list.listItem.itemBoxArray;
            for(var i=his.listSelectIndex,len=box.length;i<len;i++){
                his.list.listItem.setText(i,0,setNO(i));
            }
            for(i=0,len=his.iptArray[0].length;i<len;i++){
                his.iptArray[i].ipt.value = '';
            }
            his.header.para.index = his.listSelectIndex;
            userData[his.listSelectIndex].type = emSign.SIGN_DN;
            sendData({pktHeader : his.header.pkt,paraHeader : his.header.para,data : userData[his.listSelectIndex]});
            userData.splice(his.listSelectIndex,1);
            his.listSelectIndex = undefined;
        }

        function listClearEvent(){
            var box = his.list.listItem.itemBoxArray;
            for(var i= 0,len=box.length;i<len;i++){
                his.list.listItem.Delete(0);
            }
            his.header.para.index = 0;
            sendData({pktHeader : his.header.pkt,paraHeader : his.header.para,data : undefined});
            userData = [];
        }

        function clickItemBox(i){
            his.listSelectIndex = i;
            his.header.para.index = i;
            his.accountUpdateData();
            his.authorizationUpdateData();
            his.setData();
        }
    };

    kbSetUser.prototype.paintAccount = function(){
        var local = staticDataLocal.setUser,color = staticDataColor.setUser,font = staticDataFont.setUser,string = staticDataString.setUser,his = this,
            accountPos = local.account,boxColor = color.box,borderColor = color.border,titleHeight = local.accountTitleHeight,
            titleColor = color.title,titleText = string.accountTitle,titleTextColor = color.text.title,titleTextFont = font.title,
            indexText = string.accountIndex,textColor = color.text.text,textFont = font.other,indexSpace = local.accountIndexSpace,
            iptH = local.accountIptH,buttonText = staticDataString.setUser.accountButton,buttonTextColor = color.text.button,
            buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]];
        this.account = new kbSprite(accountPos.x,accountPos.y,accountPos.width,accountPos.height,this.sprite.sprite);
        var userBg = new kbBoxBg(0,0,1,1,boxColor,this.account.sprite,true);
        userBg.setBorder(1,borderColor,1,true);
        userBg.setRadius(.04);
        popupTitleGraphics(titleHeight,titleColor,.04,this.account.sprite);
        new kbBoxText(.5,titleHeight/2,titleText,titleTextColor,titleTextFont,this.account.sprite,.5);
        var y = titleHeight+indexSpace,text,iptSprite,ipt,iptStyle = {
                position : 'absolute',
                display : 'none',
                background : 'none',
                border : 'none',
                color : textColor,
                fontSize : textFont
            };
        this.iptArray = [];
        for(var i= 0,len=indexText.length;i<len;i++){
            text = new kbBoxText(.25,y+iptH/2,indexText[i],textColor,textFont,this.account.sprite,1,.5);
            iptSprite = new kbSprite(.3,y,.6,iptH,this.account.sprite);
            new kbImg(0,0,1,1,images[imgID.input_background],iptSprite.sprite);
            ipt = new kbInput(iptSprite.sprite,document.body,iptStyle);
            if(i!=0){
                ipt.ipt.type = 'password';
            }
            this.iptArray.push(ipt);
            iptArray.push(ipt);
            y += indexSpace+iptH;
        }
        var userErrMessage  = new kbMessage({title : '用户信息有误',noAutoClose : true});
        userErrMessage.setEvent(function(){
            userErrMessage.Dispear();
            his.iptOpen();
        });
        this.iptArray[0].setRegex(regex.user_name,[rightWrongCanvas.redRight,rightWrongCanvas.redWrong]);
        this.iptArray[1].setRegex(regex.user_password,[rightWrongCanvas.redRight,rightWrongCanvas.redWrong]);
        var buttonW = .25,len=buttonText.length,buttonSpace = .1,buttonX = .2,button;
        var buttonEvent = [resetEvent,saveEvent];
        for(i= 0;i<len;i++){
            button = new kbButton(buttonX,.82,buttonW,.13,buttonImg,buttonText[i],buttonTextColor,textFont,this.account.sprite);
            buttonX += buttonW+buttonSpace;
            button.bounce();
            button.switchColor(buttonEvent[i]);
            if(i == len-1)this.accountSave = button;
        }
        function resetEvent(){
            his.accountUpdateData();
        }
        function saveEvent(){
            var name = his.iptArray[0].ipt.value;
            var pswd = his.iptArray[1].ipt.value;
            var repeat = his.iptArray[2].ipt.value;
            var nameRegex = his.iptArray[0].actionRegex();
            var passwdRegex = his.iptArray[1].actionRegex();
            if(pswd != repeat){
                userErrMessage.setContent({text : '两次输入密码不一致！'});
                userErrMessage.Display();
                his.iptClose();
                return;
            }else if(!nameRegex || !passwdRegex){
                userErrMessage.setContent({text : '用户信息有误！'});
                userErrMessage.Display();
                his.iptClose();
                return;
            }
            userData[his.listSelectIndex].name = name;
            userData[his.listSelectIndex].passwd = pswd;
            if(userData[his.listSelectIndex].sign_up){
                userData[his.listSelectIndex].type = emSign.SIGN_UP;
                userData[his.listSelectIndex].sign_up = undefined;
            }else{
                userData[his.listSelectIndex].type = emSign.SIGN_EDIT;
            }
            his.list.listItem.setText(his.listSelectIndex,1,userData[his.listSelectIndex].name);
        }
    };

    kbSetUser.prototype.paintAuthorization = function(){
        var local = staticDataLocal.setUser,color = staticDataColor.setUser,font = staticDataFont.setUser,string = staticDataString.setUser,his = this,
            authorizationPos = local.authorization,boxColor = color.box,borderColor = color.border,titleHeight = local.authorizationTitleHeight,
            titleColor = color.title,titleText = string.authorizationTitle,titleTextColor = color.text.title,titleTextFont = font.title,textFont = font.other,
            indexSpace = local.authorizationIndexSpace,buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]];
        this.authorization = new kbSprite(authorizationPos.x,authorizationPos.y,authorizationPos.width,authorizationPos.height,this.sprite.sprite);
        var bg = new kbBoxBg(0,0,1,1,boxColor,this.authorization.sprite,true);
        bg.setBorder(1,borderColor,1,true);
        bg.setRadius(.04);
        popupTitleGraphics(titleHeight,titleColor,.04,this.authorization.sprite);
        new kbBoxText(.5,titleHeight/2,titleText,titleTextColor,titleTextFont,this.authorization.sprite,.5);
        var x = .05,y = .1,strRadioButton = string.authorizationRadioButton,radioButtonW = local.radioButtonW,radioButtonH = local.radioButtonH,
            radioButtonSpace = local.radioButtonSpace,radioButtonColor = color.text.radioButton,button,resetData;
        paintRadioButton();
        function paintRadioButton(){
            for(var i= 0,len=strRadioButton.length;i<len;i++){
                if(i == 0){
                    his.radioButtonArray = kbRadioButton(x,y,radioButtonW,radioButtonH,radioButtonSpace,strRadioButton[i],radioButtonColor,textFont,his.authorization.sprite);
                }else{
                    button = kbRadioButton(x,y,radioButtonW,radioButtonH,radioButtonSpace,strRadioButton[i],radioButtonColor,textFont,his.authorization.sprite,true);
                    his.buttonArray.push.apply(his.buttonArray,button);
                }
                y += radioButtonH+indexSpace;
            }

            for(i= 0,len=his.buttonArray.length;i<len;i++){
                his.buttonArray[i].index = i;
                his.buttonArray[i].switchColor();
            }
        }

        var strButton = string.authorizationButton,buttonW = .23,len=strButton.length,buttonSpace = (1-buttonW*len)/ 5,buttonX = buttonSpace,
            bottomButtonEvent = [clearBntEvent,allBntEvent,resetBntEvent,saveBntEvent];
        for(var i= 0;i<len;i++){
            button = new kbButton(buttonX,.9,buttonW,.07,buttonImg,strButton[i],color.text.button,textFont,this.authorization.sprite);
            buttonX += buttonW+buttonSpace;
            button.bounce();
            button.switchColor(bottomButtonEvent[i]);
            if(i == len-1)this.authSave = button;
        }

        function clearBntEvent(){
            for(var i= 0,len=his.buttonArray.length;i<len;i++){
                kbChangeButtonColor(his.buttonArray[i],0);
            }
        }

        function allBntEvent(){
            for(var i= 0,len=his.buttonArray.length;i<len;i++){
                kbChangeButtonColor(his.buttonArray[i],1);
            }
        }

        function resetBntEvent(){
            his.authorizationUpdateData();
        }

        function saveBntEvent(){
            var roleVal = his.radioButtonArray[0].eventFlag ? emRole.ROLE_ADMIN : emRole.ROLE_OPERATOR;
            if(userData[his.listSelectIndex].perm.role != roleVal){
                userData[his.listSelectIndex].perm.role = roleVal;
                his.list.listItem.setText(his.listSelectIndex,2,jugeRoleValue(roleVal));
            }
            for(var i= 0,len=chID.DSP_CH_NUM;i<len;i++){
                var eventflag = his.buttonArray[i].eventFlag;
                if(userData[his.listSelectIndex].perm.rw[i].w != eventflag){
                    userData[his.listSelectIndex].perm.rw[i].w = boolean2number(eventflag);
                }
            }
            if(userData[his.listSelectIndex].sign_up){
                userData[his.listSelectIndex].type = emSign.SIGN_UP;
                userData[his.listSelectIndex].sign_up = undefined;
            }else{
                userData[his.listSelectIndex].type = emSign.SIGN_EDIT;
            }
            his.userUpdateData();
        }
    };

    kbSetUser.prototype.updateData = function(){
        if(userData.length < this.listSelectIndex+1){
            return;
        }
        this.userUpdateData();
        this.accountUpdateData();
        this.authorizationUpdateData();
    };

    kbSetUser.prototype.userUpdateData = function(){
        var box = this.list.listItem.itemBoxArray;
        for(var i= 0,len=box.length;i<len;i++){
            this.list.listItem.Delete(0);
        }
        var visible1 = this.sprite.sprite.visible;
        var visible2 = this.parent.visible;
        this.sprite.sprite.visible = true;
        this.parent.visible = true;
        for(i= 0,len=userData.length;i<len;i++){
            var name = userData[i].name,
                role = jugeRoleValue(userData[i].perm.role),
                state = jugeStateValue(userData[i].type),
                item = [{text : setNO(i)},{text : name},{text : role},{text : state}];
            this.list.listItem.Add(item);
        }
        this.sprite.sprite.visible = visible1;
        this.parent.visible = visible2;
    };

    kbSetUser.prototype.accountUpdateData = function(){
        this.iptArray[0].ipt.value = userData[this.listSelectIndex].name;
        this.iptArray[1].ipt.value = userData[this.listSelectIndex].passwd;
    };

    kbSetUser.prototype.authorizationUpdateData = function(){
        var data = userData[this.listSelectIndex],radioButtonData1 = 0,radioButtonData2 = 0;
        if(data.perm.role == emRole.ROLE_ADMIN){
            radioButtonData1 = 1;
        }else if(data.perm.role == emRole.ROLE_OPERATOR){
            radioButtonData2 = 1;
        }
        kbChangeRadioButtonColor(this.radioButtonArray[0],radioButtonData1);
        kbChangeRadioButtonColor(this.radioButtonArray[1],radioButtonData2);
        for(var i= 0,len=chID.DSP_CH_NUM;i<len;i++){
            kbChangeButtonColor(this.buttonArray[i],data.perm.rw[i].w);
        }
    };

    kbSetUser.prototype.resize = function(){
        var local = staticDataLocal.setUser,
            userPos = local.user,accountPos = local.account,authorizationPos = local.authorization;
        this.user.resize(userPos.x,userPos.y,userPos.width,userPos.height);
        this.account.resize(accountPos.x,accountPos.y,accountPos.width,accountPos.height);
        this.authorization.resize(authorizationPos.x,authorizationPos.y,authorizationPos.width,authorizationPos.height);
    };

    var jugeRoleValue = function(flag){
        switch(flag){
            case emRole.ROLE_ROOT :
                return 'Root';
            case emRole.ROLE_ADMIN :
                return 'Admin';
            case emRole.ROLE_OPERATOR :
                return 'Operator';
            case emRole.ROLE_GUEST :
                return 'Guest';
        }
    };

    var jugeStateValue = function(flag){
        switch(flag){
            case emSign.SIGN_NONE :
                return 'none';
            case emSign.SIGN_IN :
                return 'on line';
            case emSign.SIGN_OUT :
                return 'out line';
            case emSign.SIGN_EDIT:
                return 'out line';
            case emSign.SIGN_UP :
                return 'out line';
            case emSign.SIGN_DN :
                return '';
        }
    };

    var kbLogin = function(){
        inputClass.call(this);
        this.parent = ctx.stage;
        this.iptArray = [];
        this.box();
        this.paint();
        this.sprite.visible(false);
    };

    kbLogin.prototype.setData = function(){
        this.loginBnt.setSendHeader(new sendHeader.sign());
        this.loginBnt.setSendData(signData);
    };

    kbLogin.prototype.box = function(){
        var boxPos = staticDataLocal.login.login;
        this.sprite = new kbSprite(boxPos.x,boxPos.y,boxPos.width,boxPos.height,this.parent);
        messageArray.push(this.sprite);
    };

    kbLogin.prototype.paint = function(){
        var local = staticDataLocal.login,color = staticDataColor.login,textColor = color.text,font = staticDataFont.login,string = staticDataString.login,
            boxColor = color.login,borderColor = color.border,titleHeight = local.titleHeight,titleColor = color.title,titleText = string.title,buttonTextColor = textColor.button,
            titleTextColor = textColor.title,oTextColor = textColor.text,titleTextFont = font.title,labelText = string.label,textFont = font.other,spaceY = local.spaceY,
            iptH = local.iptH,buttonW = local.buttonW,buttonH = local.buttonH,buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]];
        var bg = new kbBoxBg(0,0,1,1,boxColor,this.sprite.sprite,true);
        bg.setBorder(1,borderColor,1,true);
        bg.setRadius(.05);
        popupTitleGraphics(titleHeight,titleColor,.05,this.sprite.sprite);
        new kbBoxText(.5,titleHeight/2,titleText,titleTextColor,titleTextFont,this.sprite.sprite,.5);
        var y = .22,text,iptSprite,ipt,iptStyle = {
                position : 'absolute',
                display : 'none',
                background : 'none',
                border : 'none',
                color : oTextColor,
                fontSize : textFont
            };
        for(var i= 0,len=labelText.length;i<len;i++){
            text = new kbBoxText(.25,y+iptH/2,labelText[i],oTextColor,textFont,this.sprite.sprite,1,.5);
            iptSprite = new kbSprite(.3,y,.5,iptH,this.sprite.sprite);
            new kbImg(0,0,1,1,images[imgID.input_background],iptSprite.sprite);
            if(i != 0){
                ipt = new kbInput(iptSprite.sprite,document.body,iptStyle);
                ipt.ipt.type = 'password';
                this.sprite.sprite.setChildIndex(iptSprite.sprite,1);
                this.select.otherIpt = ipt.ipt;
                ipt.setRegex(regex.user_password,[rightWrongCanvas.redRight,rightWrongCanvas.redWrong]);
            }else{
                var selectSprite = new kbSprite(0,0,.85,1,iptSprite.sprite);
                ipt = new kbInput(selectSprite.sprite,document.body,iptStyle);
                var triangle = new kbTriangle(.85,.3,.1,.4,0,color.triangle,color.triangle,iptSprite.sprite);
                this.select = new kbSelectOption(ipt.ipt,iptSprite.sprite,triangle);
                this.sprite.sprite.setChildIndex(iptSprite.sprite,2);
                ipt.setRegex(regex.user_name,[rightWrongCanvas.redRight,rightWrongCanvas.redWrong],iptSprite.sprite);
            }
            this.iptArray.push(ipt);
            iptArray.push(ipt);
            y += spaceY+iptH;
        }
        var x = .2,y = .7,his = this;
        this.cancelBnt = new kbButton(x,y,buttonW,buttonH,buttonImg,string.cancel,buttonTextColor,textFont,this.sprite.sprite);
        this.cancelBnt.bounce();
        this.cancelBnt.switchColor(onCancelEvent);
        x = 1-.2-buttonW;
        this.loginBnt = new kbButton(x,y,buttonW,buttonH,buttonImg,string.login,buttonTextColor,textFont,this.sprite.sprite);
        this.loginBnt.bounce();
        this.loginBnt.switchColor(onLoginEvent);
        var loginErrMessage  = new kbMessage({title : '登录错误提示',noAutoClose : true});
        loginErrMessage.setEvent(function(){
            loginErrMessage.Dispear();
            his.iptOpen();
        });
        function onCancelEvent(){
            ctx.mask.visible(false);
            his.sprite.visible(false);
            his.iptClose();
            loginInputDisabled(false);
        }
        function onLoginEvent(){
            var userRegex = his.iptArray[0].actionRegex();
            var passwdRegex = his.iptArray[1].actionRegex();
            if(!userRegex || !passwdRegex){
                loginErrMessage.setContent({text : '用户名或密码有误！'});
                loginErrMessage.Display();
                his.iptClose();
                return;
            }
            his.loginBnt.sendOldData = null;
            setSignData(signID.SIGN_IN);
            !webPowerControl.LOGIN && his.loginSucess();
            GLOBAL.loginFlag = true;
            setTimeout(function(){
                if(GLOBAL.loginFlag){
                    his.loginSucess();
                }
            },GLOBAL.loginTime);
            GLOBAL.ackFunc = function(err){
                if(his.sprite.sprite.visible && err.errID != errID.ERR_SUCCESS){
                    var text = '登录出错';
                    switch(err.errID){
                        case errID.ERR_NET_NOT_EXIST :
                            text = '请检查用户名或密码是否正确';
                            break;
                        case errID.ERR_SIGN_PASS_WRONG :
                            text = '密码错误';
                            break;
                    }
                    GLOBAL.loginFlag = false;
                    his.iptClose();
                    loginErrMessage.setContent({text : text});
                    loginErrMessage.Display();
                }
                GLOBAL.ackFunc = undefined;
            }
        }
        this.loginSucess = function(){
            var name = his.iptArray[0].ipt.value;
            ctx.mask.visible(false);
            his.sprite.visible(false);
            his.iptClose();
            loginInputDisabled(false);
            init.title.name.setText(name);
            GLOBAL.user = name;
            var attr = localStorage.getItem('userName');
            attr = attr == null ? [] : attr.split(',');
            if(name != '' && !inArray(attr,name)){
                attr.push(name);
                attr.length > 3 && attr.splice(0,1);
                localStorage.setItem('userName',attr);
            }
            init.page.set.user.updateData();
        };
        kbKeyEvent.addKeyDown({key : 13,func : loginKeyEvent});
        function loginKeyEvent(){
            if(his.sprite.sprite.visible)his.loginBnt.mousedownfunc();
        }
    };

    kbLogin.prototype.resize = function(){
        var local = staticDataLocal.login,boxPos = local.login;
        this.sprite.resize(boxPos.x,boxPos.y,boxPos.width,boxPos.height);
    };

    var kbSignOut = function(loginEvent,loginBnt){
        this.parent = ctx.stage;
        this.loginEvent = loginEvent;
        this.loginBnt = loginBnt;
        this.box();
        this.paint();
        this.sprite.visible(false);
    };

    kbSignOut.prototype.setData = function(){
        this.signOutBnt.setSendHeader(new sendHeader.sign());
        this.signOutBnt.setSendData(signData);
        this.switchBnt.setSendHeader(new sendHeader.sign());
        this.switchBnt.setSendData(signData);
    };

    kbSignOut.prototype.box = function(){
        var boxPos = staticDataLocal.login.login;
        this.sprite = new kbSprite(boxPos.x,boxPos.y,boxPos.width,boxPos.height,this.parent);
        messageArray.push(this.sprite);
    };

    kbSignOut.prototype.paint = function(){
        var local = staticDataLocal.login,color = staticDataColor.login,textColor = color.text,font = staticDataFont.login,string = staticDataString.login,
            boxColor = color.login,borderColor = color.border,buttonTextColor = textColor.button,oTextColor = textColor.text,textFont = font.other,buttonW = local.buttonW,
            fontPrompt = font.prompt,buttonH = local.buttonH,cancelPos = local.cancel,buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]];
        var bg = new kbBoxBg(0,0,1,1,boxColor,this.sprite.sprite,true);
        bg.setBorder(1,borderColor,1,true);
        bg.setRadius(.05);
        new kbBoxText(.5,.4,string.outPrompt,oTextColor,fontPrompt,this.sprite.sprite,.5);

        var x = .2,y = .6,his = this;
        this.signOutBnt = new kbButton(x,y,buttonW,buttonH,buttonImg,string.signOut,buttonTextColor,textFont,this.sprite.sprite);
        this.signOutBnt.bounce();
        this.signOutBnt.switchColor(onsignOutBntEvent);
        x = 1-.2-buttonW;
        this.switchBnt = new kbButton(x,y,buttonW,buttonH,buttonImg,string.switcher,buttonTextColor,textFont,this.sprite.sprite);
        this.switchBnt.bounce();
        this.switchBnt.switchColor(onSwitchBntEvent);

        this.cancelBnt = new kbCanvasBg(cancelPos.x,cancelPos.y,cancelPos.width,cancelPos.height,rightWrongCanvas.grayWrong,this.sprite.sprite);
        this.cancelBnt.interactive(true);
        this.cancelBnt.onEvent('mousedown',onCancelkEvent);
        this.cancelBnt.onEvent('touchstart',onCancelkEvent);

        function onCancelkEvent(event){
            event.stopPropagation();
            his.sprite.visible(false);
            loginInputDisabled(false);
            ctx.mask.visible(false);
        }

        function onsignOutBntEvent(){
            GLOBAL.loginFlag = false;
            ctx.mask.visible(false);
            his.sprite.visible(false);
            loginInputDisabled(false);
            setSignData(signID.SIGN_OUT);
            his.loginBnt.sendOldData = undefined;
        }

        function onSwitchBntEvent(){
            GLOBAL.loginFlag = false;
            his.loginEvent();
            setSignData(signID.SIGN_OUT);
            his.loginBnt.sendOldData = undefined;
        }
    };

    kbSignOut.prototype.resize = function(){
        var local = staticDataLocal.login,boxPos = local.login;
        this.sprite.resize(boxPos.x,boxPos.y,boxPos.width,boxPos.height);
    };

    var setSignData = function(type){
        var iptArray = init.title.login.iptArray;
        signData.type = type;
        signData.name = iptArray[0].ipt.value;
        signData.passwd = iptArray[1].ipt.value;
    };

    var kbSelectOption = function(element,parent,triangle,content,func){
        this.element = element;
        this.parent = parent;
        this.triangle = triangle;
        this.content = content ? content : [];
        this.func = func;
        this.options = [];
        this.eventElement = this.element instanceof kbButton ? this.element : this.triangle;
    };

    kbSelectOption.prototype.paint = function(bntBack,textColor,textFont,pos){
        bntBack = bntBack ? bntBack : [0x22222b,0x123123];
        textColor = textColor ? textColor : '#a8a8a8';
        textFont = textFont ? textFont : '16px';
        var x, y,width,height;
        if(pos){
            x = pos.x ? pos.x : 0;
            y = pos.y ? pos.y : 1;
            width = pos.width ? pos.width : 1;
            height = pos.height ? pos.height : 1;
        }else{
            x = 0;y = 1;width = 1;height = 1;
        }
        for(var i= 0,len=this.options.length;i<len;i++){
            this.parent.removeChild(this.options[i].sprite);
        }
        this.options = [];
        for(i= 0,len=this.content.length;i<len;i++){
            var button = new kbButton(x,y,width,height,bntBack,this.content[i],textColor,textFont,this.parent);
            button.text.setAttr({anchor1: -.2,x :0});
            button.index = i;
            this.options.push(button);
            y += height;
        }
        this.event();
        this.dispear();
    };

    kbSelectOption.prototype.event = function(){
        var his = this,flag = true;
        this.eventElement.interactive(true);
        this.eventElement.onEvent('mousedown',triangleEvent);
        this.eventElement.onEvent('touchstart',triangleEvent);

        for(var i= 0,len=this.options.length;i<len;i++){
            this.options[i].bounce();
            this.options[i].switchColor(optionsEvent);
            this.options[i].onEvent(optionsEvent);
            this.options[i].index = i;
        }

        function triangleEvent(){
            flag ? his.display() : his.dispear();
            flag = !flag;
        }

        function optionsEvent(button){
            var text = button.text.content;
            if(his.element instanceof kbButton){
                his.element.setText(text);
            }else{
                his.element.value = text;
            }
            his.dispear();
            his.func && his.func(button);
            flag = !flag;
        }
    };

    kbSelectOption.prototype.display = function(){
        for(var i= 0,len=this.options.length;i<len;i++){
            this.options[i].visible(true);
        }
        if(this.otherIpt)this.otherIpt.style.display = 'none';
    };

    kbSelectOption.prototype.dispear = function(){
        for(var i= 0,len=this.options.length;i<len;i++){
            this.options[i].visible(false);
        }
        if(this.otherIpt){
            this.otherIpt.style.display = 'block';
        }
    };

    var kbSetNetwork = function(parent){
        inputClass.call(this);
        this.parent = parent;
        this.iptArray = [];
        this.box();
        this.paintIp();
        this.paintWlan();
        this.setData();
    };

    kbSetNetwork.prototype.setData = function(){
        this.scanHeader = new sendHeader.network_ap_scan();
        this.connectHeader = new sendHeader.network_ap_connect(27);
        this.connectHeader1 = new sendHeader.network_ap_connect(98);
        this.networkHeader = new sendHeader.network();
    };

    kbSetNetwork.prototype.box = function(){
        this.sprite = new kbSprite(0,0,1,1,this.parent);
    };

    kbSetNetwork.prototype.paintWlan = function(){
        var local = staticDataLocal.setNetwork,color = staticDataColor.setNetwork,font = staticDataFont.setNetwork,string = staticDataString.setNetwork,his = this,
            staPos = local.wlan,titleHeight = local.titleHeight,staListScrollWidth = local.staListScrollWidth,boxColor = color.box,titleColor = color.title,borderColor = color.border,textTitle = string.staTitle,
            fontTitle = font.title,titleTextColor = color.text.title,x,buttonW = local.buttonW,buttonH = local.buttonH,fontText = font.other,indexText = string.modeIndex,textColor = color.text.text;
        var contentWlan;
        this.sta = new kbSprite(staPos.x,staPos.y,staPos.width,staPos.height,this.sprite.sprite);
        var bg = new kbBoxBg(0,0,1,1,boxColor,this.sta.sprite,true);
        bg.setBorder(1,borderColor,1,true);
        bg.setRadius(.04);
        popupTitleGraphics(titleHeight,titleColor,.06,this.sta.sprite);
        new kbBoxText(.5,titleHeight/2,textTitle,titleTextColor,fontTitle,this.sta.sprite,.5);
        var indexX = .3,y = .2;
        var newWifi = new kbBoxText(indexX,y+buttonH/2,'',textColor,fontText,this.sta.sprite,0,.5);
        var lockWifi = listIcon(true,100);
        lockWifi.y = y;lockWifi.width = .05;lockWifi.height = .1;lockWifi.x = .68;lockWifi.anchor.set(.5);
        this.sta.sprite.addChild(lockWifi);
        var witeIconSprite = new kbSprite(.9,y+buttonH/2,1/local.actW,1/local.actH,this.sta.sprite);
        var witeIcon = new kbWiteIcon(4,witeIconSprite.sprite);
        witeIcon.dispear();
        y += buttonH+.025;
        var clickCount;
        kbStaList(function(i){
            his.selectedIndex = i;
            if(clickCount == i){
                his.pswdPopup.Display();
                his.pswdIpt.visible(true);
                his.pswdPopup.box.clicked = true;
                his.pswdIpt.clicked = true;
                his.iptClose();
            }else{
                clickCount = i;
            }
        });

        function kbStaList(func){
            var playListBox = listBox();
            var listInit = {
                position: new listPosition(0,y),
                size:new listSize(1,.95-y)
            };
            his.list = new playListBox.box(his.sta.sprite,listInit);
            var bodyInit = {
                position : new listPosition(0,0),
                size : new listSize(1,1)
            };
            his.listBody = new playListBox.Body(bodyInit);
            var bodyListInit = {
                position : new listPosition(0,0),
                size : new listSize(1-staListScrollWidth,1)
            };
            his.listList = new playListBox.Body.List(bodyListInit);
            var rollInit = {
                position : new listPosition(1-staListScrollWidth,0),
                size : new listSize(staListScrollWidth,1)
            };
            his.listList.setScrollbar(rollInit);
            var listItemBoxStyles = [],listItemBoxColorArray = [0x3d3d46,0x373740],
                listItemStyles = [],listItemWidthArray = [.3,.4,.15],listItemLeftArray = [.15,0,0];
            for(var i=0;i<2;i++) {
                listItemBoxStyles.push({
                    margin: new listMargin(0, 0),
                    size: new listSize(1, 1 / 4),
                    border: new listBorder(1, 0x000000, 1),
                    color: new listColor(listItemBoxColorArray[i], 1)
                });
            }
            for(i=0;i<3;i++) {
                listItemStyles.push({
                    size : new listSize(listItemWidthArray[i],1),
                    margin : new listMargin(0,listItemLeftArray[i]),
                    content : new listContent('','#a8a8a8','12pt','left')
                });
            }
            var listItemsContent = [
            ];
            his.listItem = new playListBox.Body.List.Item(listItemBoxStyles,listItemStyles,listItemsContent);
            his.listItem.noMultiselect = true;
            var selectData = {
                color : new listColor(0x123123,1)
            };
            his.listItem.select(selectData,func);
        }

        function paintPopup(){
            var textTitle = string.pswdPopupTitle;
            his.pswdPopup = new kbMessage({noContent : true,title : textTitle,noAutoClose: true,buttonLen: 2,content: [{ch : '取消',en : 'CANCEN'},{ch : '确定',en : 'OK'}]});
            messageArray.push(his.pswdPopup.box);
            his.pswdPopup.Display();
            his.pswdPopup.setEvent([cancelEvene,sureEvent]);
            var iptStyle = {
                position : 'absolute',
                display : 'none',
                background : 'none',
                border : '2px solid #22222b',
                color : '#a8a8a8',
                fontSize : setFontSizeResolute(fontTitle)
            };
            var iptSprite = new kbSprite(.2,.35,.6,.25,his.pswdPopup.box.sprite);
            his.pswdIpt = new kbInput(iptSprite.sprite,document.body,iptStyle);
            iptArray.push(his.pswdIpt);
            //GLOBAL.dispearPopup.push(his.pswdIpt);

            his.pswdPopup.Dispear();
            kbKeyEvent.addKeyDown({key : 13,func : sureKeyEvent});
            function sureKeyEvent() {
                if (his.pswdPopup.box.sprite.visible) {
                    his.pswdPopup.buttonArray[1].mousedownfunc();
                    his.pswdPopup.Dispear();
                    his.pswdIpt.visible(false);
                }
            }
            function sureEvent(){
                his.pswdIpt.visible(false);
                his.pswdPopup.Dispear();
                his.iptOpen();
                var index;
                var listSsid = his.listItem.get(his.selectedIndex)[0].text;
                for(var i=0,len=wlanData.length;i<len;i++){
                    if(listSsid == wlanData[i].wsec.ssid){
                        index = i;
                    }else{
                        his.listItem.setText(i,2,'未连接');
                    }
                }
                var data = {
                    type : netEM.NET_CONN,
                    act : '',
                    dLen : 64,
                    wsec : {
                        ssid : wlanData[index].wsec.ssid,
                        passwd : his.pswdIpt.ipt.value,
                        crypto : 0,
                        cipher : 0
                    }
                };
                sendData({pktHeader : his.connectHeader1.pkt,data : data});
                witeIcon.display();
                contentWlan = wlanData[index];
                setTimeout(function(){
                    his.contentSucess();
                },2000);
            }
            function cancelEvene(){
                his.pswdIpt.visible(false);
                his.pswdPopup.Dispear();
                his.iptOpen();
            }
        }

        paintPopup();

        function listIcon(L,signal,parent){
            var sprite = parent ? parent : new PIXI.Sprite(),wifiCvs;
            if(signal >= 0 && signal <= 10){
                wifiCvs = wifiCanvas.signal0;
            }else if(signal > 10 && signal <= 40){
                wifiCvs = wifiCanvas.signal1;
            }else if(signal > 40 && signal <= 70){
                wifiCvs = wifiCanvas.signal2;
            }else if(signal > 70 && signal <= 1000){
                wifiCvs = wifiCanvas.signal3;
            }
            if(!parent){
                sprite.x = .25;sprite.y = 0;sprite.width = .13;sprite.height = 1;
            }
            if(L){
                var lock = new PIXI.Sprite.fromImage(images[imgID.lock]);
                lock.x = 0;lock.y = .5;lock.anchor.set(.5);pushScaleData(lock,{width:.8,height:.8});
                sprite.addChild(lock);
            }
            var wifi = new PIXI.Sprite(new PIXI.Texture.fromCanvas(wifiCvs));
            wifi.x = 1;wifi.y = .5;wifi.anchor.set(.5);pushScaleData(wifi,{width:.8,height:.8});
            sprite.addChild(wifi);
            return sprite;
        }

        this.updateList = function() {
            var box = his.listItem.itemBoxArray, i,len;
            for(i=0,len=box.length;i<len;i++){
                his.listItem.Delete(0);
            }
            for(i=0,len=wlanData.length;i<len;i++){
                var addData = [{text : wlanData[i].wsec.ssid},{sprite : listIcon(wlanData[i].wsec.crypto,wlanData[i].stat.quality)},{text : '未连接'}];
                this.listItem.Add(addData);
            }
            clickCount = undefined;
        };

        this.contentSucess = function(){
            newWifi.setText(contentWlan.wsec.ssid+'');
            witeIcon.dispear();
            lockWifi.removeChildren();
            listIcon(contentWlan.wsec.crypto,contentWlan.stat.quality,lockWifi);
            his.listItem.setText(his.selectedIndex,2,'已连接');
        };
    };

    kbSetNetwork.prototype.paintIp = function(){
        var local = staticDataLocal.setNetwork,color = staticDataColor.setNetwork,font = staticDataFont.setNetwork,string = staticDataString.setNetwork,his = this,
            apPos = local.ip,titleHeight = local.titleHeight,boxColor = color.box,titleColor = color.title,borderColor = color.border,textTitle = string.apTitle,inputH = local.inputH,
            fontTitle = font.title,titleTextColor = color.text.title,spaceY = local.spaceY,x,ox,y = titleHeight+spaceY,buttonW = local.buttonW,buttonH = local.buttonH,sureBntText = string.sureBnt,
            fontText = font.other,indexText = string.apIndex,textColor = color.text.text,buttonColor = color.text.button,iptPlaceholder = string.iptPlaceholder;
        this.ap = new kbSprite(apPos.x,apPos.y,apPos.width,apPos.height,this.sprite.sprite);
        var bg = new kbBoxBg(0,0,1,1,boxColor,this.ap.sprite,true);
        bg.setBorder(1,borderColor,1,true);
        bg.setRadius(.04);
        popupTitleGraphics(titleHeight,titleColor,.06,this.ap.sprite);
        new kbBoxText(.5,titleHeight/2,textTitle,titleTextColor,fontTitle,this.ap.sprite,.5);
        var ipt, i,iptStyle = {
                position : 'absolute',
                display : 'none',
                background : 'none',
                border : 'none',
                color : textColor,
                fontSize : setFontSizeResolute(fontText)
            };
        x = .12,ox = .62,y += .02;
        new kbBoxText(x,y,indexText[0],textColor,fontText,this.ap.sprite,1,.5);
        this.ip1 = new kbBoxText(.13,y,'',textColor,fontText,this.ap.sprite,0,.5);
        new kbBoxText(ox,y,indexText[1],textColor,fontText,this.ap.sprite,1,.5);
        this.ip2 = new kbBoxText(.63,y,'',textColor,fontText,this.ap.sprite,0,.5);
        y += .05;
        new kbBoxText(x,y+buttonH/2,indexText[2],textColor,fontText,this.ap.sprite,1,.5);
        this.modeBnt = kbRadioButton(.3,y,buttonW,buttonH,2/700,string.mode,buttonColor,fontText,this.ap.sprite,modeEvent);
        for(i=3;i<7;i++){
            var textX,iptX;
            if(i%2 == 0){
                textX = ox;iptX = .65;
            }else{
                textX = x;iptX = .15;y += .2;
            }
            new kbBoxText(textX,y+inputH/2,indexText[i],textColor,fontText,this.ap.sprite,1,.5);
            var sprite = new kbSprite(iptX,y,.25,inputH,this.ap.sprite);
            new kbImg(0,0,1,1,images[imgID.input_background],sprite.sprite);
            ipt = new kbInput(sprite.sprite,document.body,iptStyle);
            ipt.ipt.placeholder = iptPlaceholder[i-3];
            this.iptArray.push(ipt);
            iptArray.push(ipt);
        }
        y += .15;
        var buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]];
        this.ipSureBnt = new kbButton(.5-buttonW/2,y,buttonW,buttonH,buttonImg,sureBntText,buttonColor,fontText,this.ap.sprite);
        this.ipSureBnt.bounce();
        this.ipSureBnt.switchColor(sureEvent);
        function sureEvent(){
            networkData.self.ssid = his.iptArray[0].ipt.value;
            networkData.self.passwd = his.iptArray[1].ipt.value;
            networkData.other.ssid = his.iptArray[2].ipt.value;
            networkData.other.passwd = his.iptArray[3].ipt.value;
            sendData({pktHeader : his.networkHeader.pkt,paraHeader : his.networkHeader.para,data : networkData});
        }
        function modeEvent(i){
            networkData.mode = i;
        }
        this.setIp12 = function(ip1,ip2){
            his.ip1.setText(ip1);
            his.ip2.setText(ip2);
        }
    };

    kbSetNetwork.prototype.updateData = function(){
        var his = this;
        kbChangeRadioButtonArrayColor(this.modeBnt,networkData.mode);
        this.iptArray[0].ipt.value = networkData.self.ssid;
        this.iptArray[1].ipt.value = networkData.self.passwd;
        this.iptArray[2].ipt.value = networkData.other.ssid;
        this.iptArray[3].ipt.value = networkData.other.passwd;
        clearInterval(timer);
        var timer = setInterval(function(){
            if(his.sprite.sprite.visible){
                var scanData = {type : netEM.NET_SCAN,act : actID.ACT_START};
                sendData({pktHeader : his.scanHeader.pkt,data : scanData});
                his.updateList();
            }else{
                clearInterval(timer);
            }
        },window.GLOBAL.netUpdateTime);

    };

    kbSetNetwork.prototype.resize = function(){
        var local = staticDataLocal.setNetwork,staPos = local.wlan,apPos = local.ip;
        this.sta.resize(staPos.x,staPos.y,staPos.width,staPos.height);
        this.ap.resize(apPos.x,apPos.y,apPos.width,apPos.height);
    };

    kbSetNetwork.prototype.setLock = function(flag){
        this.lock = flag;
        this.sprite.sprite.interactiveChildren = !this.lock;
    };

    var kbSetUpgrade = function(parent){
        inputClass.call(this);
        this.parent = parent;
        this.iptArray = [];
        this.box();
        this.paint();
    };

    kbSetUpgrade.prototype.box = function(){
        this.sprite = new kbSprite(0,0,1,1,this.parent);
    };

    kbSetUpgrade.prototype.paint = function(){
        var local = staticDataLocal.setUpgrade,color = staticDataColor.setUpgrade,font = staticDataFont.setUpgrade,string = staticDataString.setUpgrade,his = this,
            contentPos = local.content,logoPos = local.logo,linePos = local.line,spaceY1 = local.spaceY1,spaceY2 = local.spaceY2,spaceY3 = local.spaceY3,
            lineColor = color.line,buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]],buttonTextColor = color.text.cancel,
            textColor = color.text.text,textFont = font.text,contentText = string.content,buttonText = string.button;y=0;
        this.content = new kbSprite(contentPos.x,contentPos.y,contentPos.width,contentPos.height,this.sprite.sprite);
        this.logo = new kbImg(logoPos.x,logoPos.y,logoPos.width,logoPos.height,images[imgID.logo],this.content.sprite);
        y += logoPos.height+spaceY1;
        this.line = new kbBoxBg(linePos.x,y,linePos.width,linePos.height,lineColor,this.content.sprite);
        y += linePos.height;
        for(var i= 0,len=contentText.length;i<len;i++){
            y += spaceY2;
            var text = i == 0 ? contentText[i]+GLOBAL.version : contentText[i];
            new kbBoxText(0,y,text,textColor,textFont,this.content.sprite,0,.5);
        }
        y += spaceY3;
        var url,fileButton;
        function paintInput(){
            var progressColor = color.progress;
            new kbImg(0,y,local.fileDisplayW,spaceY3,images[imgID.input_background],his.content.sprite);
            url = new kbBoxText(.02,y+spaceY3/2,'',textColor,textFont,his.content.sprite,0,.5);
            url.ellipsis(390);
            var fileButtonSprite = new kbSprite(1-local.fileButtonW,y,local.fileButtonW,spaceY3,his.content.sprite);
            new kbImg(0,0,1,1,images[imgID.upgrade_button],fileButtonSprite.sprite);
            new kbBoxText(.5,.2,'...',textColor,'40px',fileButtonSprite.sprite,.5);
            var fileButtonStyle = {
                position : 'absolute',
                display : 'none',
                background : 'none',
                border : 'none',
                padding : 'none',
                opacity : '0',
                cursor : 'pointer',
                fontSize : '0'
            };
            fileButton = new kbInput(fileButtonSprite.sprite,document.body,fileButtonStyle);
            his.iptArray.push(fileButton);
            fileButton.ipt.type = 'file';
            fileButton.ipt.id = 'upgradeFile';
            var fileData = {
                    type : fileType.FILE_SYSTEM,
                    index : 0,
                    last : 0,
                    dlen : 0
                };
            upload.addNode(['upgradeFile'],[onChangeValue],[new sendHeader.upgrade],[fileData]);
            upload.progressFunc = progressFunc;
            y += spaceY3;
            //his.square = new drawUpgradeSquare(.01,y-local.squareH/2,local.squareW,local.squareH,0xb1b1b1,0xc30d23,his.content.sprite);
            //new kbBoxText(.32,y,string.reboot,textColor,textFont,his.content.sprite,.5);
            //his.square.graphics.interactive = true;
            //his.square.graphics.buttonMode = true;
            //his.square.graphics.on('mousedown',onClickSquare);
            //his.square.graphics.on('touchstart',onClickSquare);
            y += spaceY3;
            var progressData = {
                x :0,
                y : y,
                width :1,
                height :.025,
                backgroundColor : color.progressBackground,
                backgroundAlpha : 1,
                color : canvasCache.setUpgradeProgress,
                radius:.5,
                parent : his.content.sprite
            };
            var progress = new progressBar(progressData);
            function onChangeValue(){
                url.setText(fileButton.ipt.value);
                upload.uploadFlag = false;
                window.appRender();
            }
            function progressFunc(per){
                var canvas = kbSetUpgradeProgress(450*per,10,progressColor);
                this.texture = new PIXI.Texture.fromCanvas(canvas);
                progress.progress.sprite.texture = this.texture;
                progress.setCursor({width : per});
                if(per == 1){
                    kbChangeButtonColor(his.cancelBnt,0);
                    his.cancelBnt.setText(buttonText[0]);
                }
            }
            function onClickSquare(){
                his.square.switchColor();
            }
        }

        paintInput();
        var buttonW = local.buttonW,buttonH = local.buttonH,x = .5-buttonW/2,y = 1-buttonH;
        this.cancelBnt = new kbButton(x,y,buttonW,buttonH,buttonImg,buttonText[0],buttonTextColor,textFont,this.content.sprite);
        this.cancelBnt.switchColor(cancelEvent);
        function cancelEvent(button){
            if(url.content == '')return;
            var flag = button.eventFlag;
            upload.off = !flag;
            if(flag){
                upload.message.box.clicked = true;
                upload.resend(fileButton.ipt.files[0]);
                upload.readData();
                his.cancelBnt.setText(buttonText[1]);
            }else{
                his.cancelBnt.setText(buttonText[0]);
            }
        }
    };

    kbSetUpgrade.prototype.resize = function(){
        var local = staticDataLocal.setUpgrade,
            contentPos = local.content;
        this.content.resize(contentPos.x,contentPos.y,contentPos.width,contentPos.height);
    };

    var drawUpgradeSquare = function(x,y,width,height,color1,color2,parent){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = this.color1 = color1;
        this.color2 = color2;
        this.parent = parent;
        this.graphics = new PIXI.Graphics();
        this.parent.addChild(this.graphics);
        this.paint();
    };

    drawUpgradeSquare.prototype.paint = function(){
        this.graphics.clear();
        this.graphics.beginFill(0x00000,0);
        this.graphics.lineStyle(.005,this.color,1);
        this.graphics.drawRect(this.x,this.y,this.width,this.height);
        this.graphics.moveTo(this.x+this.width *.1,this.y+this.height *.5);
        this.graphics.lineTo(this.x+this.width *.35,this.y+this.height *.75);
        this.graphics.moveTo(this.x+this.width *.35,this.y+this.height *.75);
        this.graphics.lineTo(this.x+this.width *.9,this.y+this.height *.4);
        this.graphics.endFill();
    };

    drawUpgradeSquare.prototype.switchColor = function(){
        this.color = this.color == this.color1 ? this.color2 : this.color1;
        this.paint();
    };

    var kbSetAbout = function(parent){
        this.parent = parent;
        this.paintBox();
        this.paint();
    };

    kbSetAbout.prototype.paintBox = function(){
        this.sprite = new kbSprite(0,0,1,1,this.parent);
    };

    kbSetAbout.prototype.paint = function(){
        var local = staticDataLocal.setAbout,color = staticDataColor.setAbout,font = staticDataFont.setAbout,string = staticDataString.setAbout,
            boxPos = local.box,logoPos = local.logo,spaceY1 = local.spaceY1,spaceY2 = local.spaceY2,lineHeight = local.lineHeight,
            lineColor = color.line,textColor = color.text.text,textFont = font.text,contentFont = font.content,
            titleText = string.title,contentText = string.content,contactWayText = string.contactWay,y=0;
        this.box = new kbSprite(boxPos.x,boxPos.y,boxPos.width,boxPos.height,this.sprite.sprite);
        this.logo = new kbImg(logoPos.x,logoPos.y,logoPos.width,logoPos.height,images[imgID.logo],this.box.sprite);
        y += logoPos.height+spaceY1;
        new kbBoxBg(0,y,1,lineHeight,lineColor,this.box.sprite);
        y += lineHeight+spaceY2;
        new kbBoxText(.5,y,titleText,textColor,textFont,this.box.sprite,.5);
        y += spaceY2;
        new kbBoxText(.5,y,contentText,textColor,contentFont,this.box.sprite,.5);
        y = 1;

        new kbBoxText(.35,y,contactWayText[0],textColor,textFont,this.box.sprite,1,1);
        new kbBoxText(.5,y,contactWayText[1],textColor,textFont,this.box.sprite,.5,1);
        new kbBoxText(.65,y,contactWayText[2],textColor,textFont,this.box.sprite,0,1);

    };

    kbSetAbout.prototype.resize = function(){
        var boxPos = staticDataLocal.setAbout.box,
            logoPos = staticDataLocal.setAbout.logo;
        this.box.resize(boxPos.x,boxPos.y,boxPos.width,boxPos.height);
        this.logo.resize(logoPos.x,logoPos.y,logoPos.width,logoPos.height);
    };

    var kbButtonNav = function(parent){
        this.parent = parent;
        this.buttonArray = [];
        this.buttonText = staticDataString.faderBox.ch;
        this.buttonLen = 0;
        this.paintBox();
        this.paint();
    };

    kbButtonNav.prototype.paintBox = function(){
        var navPos = staticDataLocal.edit.nav;
        this.box = new kbSprite(navPos.x,navPos.y,navPos.width,navPos.height,this.parent);
        this.box.setRenderClearRect(this.box.sprite,0x373740);
        this.box.sprite.mask = new kbBoxBg(0,0,1,1,0x123123,this.box.sprite).graphics;
    };

    kbButtonNav.prototype.paint = function(){
        var local = staticDataLocal.edit,buttonW = local.actNavButton,editW = local.editWidth;
        this.sprite &&　this.box.sprite.removeChild(this.sprite.sprite);
        this.sprite = new kbSprite(0,0,buttonW/editW*this.buttonText.length,1,this.box.sprite);
        this.button();
    };

    kbButtonNav.prototype.button = function(){
        var len = this.buttonText.length,local = staticDataLocal.edit,color = staticDataColor.edit,font = staticDataFont.edit,his = this,
            buttonW = local.actNavButton,editW = local.editWidth,
            navTextColor = color.navText,textFont = font.navButton,buttonImgLeft = [images[imgID.main_viewbutton_left],images[imgID.main_viewbutton_left_light]],
            buttonImgMiddle = [images[imgID.main_viewbutton_middle],images[imgID.main_viewbutton_middle_light]],
            buttonImgRight = [images[imgID.main_viewbutton_right],images[imgID.main_viewbutton_right_light]];
        var button,height = 1.12,y = -.06,space = local.navButtonSpace/len,x = space,width = local.navButton/len;
        new kbBoxBg(0,0,1,1,0x121216,this.sprite.sprite,true).setRadius(.2);
        for(var i=0;i<len;i++){
            if(i == 0){
                button = new kbButton(x,y,width,height,buttonImgLeft,this.buttonText[i],navTextColor,textFont,this.sprite.sprite);
            }else if(i == len-1){
                button = new kbButton(x,y,width,height,buttonImgRight,this.buttonText[i],navTextColor,textFont,this.sprite.sprite);
            }else{
                button = new kbButton(x,y,width,height,buttonImgMiddle,this.buttonText[i],navTextColor,textFont,this.sprite.sprite);
            }
            button.index = i;
            this.buttonArray[i] = button;
            x += width+space*2;
        }

        kbSetRadioButton(this.buttonArray,navButtonEvent);

        for(var j= 0,olen=this.buttonArray.length;j<olen;j++){
            this.buttonArray[j].onLongEvent(buttonLangEvent);
        }

        function navButtonEvent(button){
            faderSwitchBg(button.index);
            chooseEditFader();
        }

        function buttonLangEvent(button){
            if(!GLOBAL.mainPopupDisplayFlag){
                GLOBAL.mainPopup.updateData(his.id,'ch'+button.index,button);
            }
        }

        this.scrollBar = new kbBoxTraverse(this.sprite.sprite,1-buttonW/editW*len,local.scrollBarHeight,this.box);
    };

    kbButtonNav.prototype.updateData = function(id){
        this.id = id;
        var faderArray = init.page.main.faderArray,his = this,buttonText = this.buttonText;
        this.buttonText = [];
        for(var i= 0,len=faderArray.length-1;i<len;i++){
            faderArray[i].visible && this.buttonText.push(faderArray[i].ch.text.content);
        }
        !equalArray(buttonText,this.buttonText) && this.paint();
        setButtonLight();
        function setButtonLight(){
            var fader = faderArray[his.id].relate;
            for(var i= 0,len=his.buttonText.length;i<len;i++){
                for(var j= 0,olen=fader.length;j<olen;j++){
                    if(his.buttonText[i] == fader[j].ch.text.content){
                        kbChangeRadioButtonColor(his.buttonArray[i],true);
                        break;
                    }else{
                        kbChangeRadioButtonColor(his.buttonArray[i],false);
                    }
                }
            }
        }
    };

    kbButtonNav.prototype.resize = function(){
        var local = staticDataLocal.edit,navPos = local.nav,buttonW = local.actNavButton,editW = local.editWidth;
        this.box.resize(navPos.x,navPos.y,navPos.width,navPos.height);
        this.sprite && this.sprite.setWidth(buttonW/editW*this.buttonText.length);
        this.scrollBar && this.scrollBar.resize(1-buttonW/editW*this.buttonText.length,staticDataLocal.edit.scrollBarHeight);
    };

    var kbEdit = function(){
        this.sprite = ctx.edit.sprite;
        this.box();
        this.paintMasterNavFader();
        ctx.edit.visible(false);
    };

    kbEdit.prototype.setData = function(){
        setItemData(this.masterNavFader.slider,new sendHeader.adsp_delay(chID.CH_MASTER,0),items[chID.CH_MASTER].delay,'gain',formula.main_slider);
        this.masterNavFader.slider.update();
        this.model.setData();
    };

    kbEdit.prototype.box = function(){
        this.paintPage();
        this.nav = new kbButtonNav(this.sprite);
        GLOBAL.mainPopup.rename.editButtonArray = this.nav.buttonArray;
    };

    kbEdit.prototype.paintPage = function(){
        var content = [],pageArray = [],his = this,tabPos = staticDataLocal.edit.tab;
        new kbBoxBg(0,0,1,1,staticDataColor.edit.background,this.sprite);
        this.port = new kbEditPort(this.sprite);
        this.geq = new kbEditGeq(this.sprite);
        this.eq = new kbEditEq(this.sprite);
        this.dyn = new kbEditDyn(this.sprite);
        this.sends = new kbEditSends(this.sprite);
        this.model = new kbEditModel(this.sprite);
        this.group = new kbEditGroup(this.sprite);
        this.tabOldIndex = [0,0,0,0];
        content.push(this.port.sprite.sprite,this.geq.sprite.sprite,this.eq.sprite.sprite,this.dyn.sprite.sprite,this.sends.sprite.sprite,this.model.sprite.sprite,this.group.sprite.sprite);
        pageArray.push(this.port,this.geq,this.eq,this.dyn,this.sends,this.model,this.group);
        var titleStyle = {
            x : tabPos.x,
            width : tabPos.width,
            height : tabPos.height,
            images : [images[imgID.tabButtonLeft],images[imgID.tabButtonLeft_light],images[imgID.tabButtonRight],images[imgID.tabButtonLeft_light]],
        };
        var titleText = staticDataString.edit.tab;
        this.tab = new kbTab(titleText,titleStyle,this.sprite,content,resizePage);
        this.tab.switchBg(0);
        function resizePage(i){
            his.tabIndex = i;
            if(his.id >= chID.CH_IN_NUM && his.id <= chID.CH_REVERB){
                his.tabOldIndex[1] = his.tabIndex;
            }else if(his.id == chID.CH_MASTER){
                his.tabOldIndex[2] = his.tabIndex;
            }else if(his.id == chID.CH_USER){
                his.tabOldIndex[3] = his.tabIndex;
            }else{
                his.tabOldIndex[0] = his.tabIndex;
            }
        }
    };

    kbEdit.prototype.paintMasterNavFader = function(){
        var local = staticDataLocal.edit,masterFaderBoxPos = local.masterFaderBox,masterFaderPos = local.masterFader,SwitcherPos = local.masterFaderSwitcher;
        var buttonImg = [images[imgID.set_button],images[imgID.set_button_light]],buttonText = staticDataString.edit.switcher,buttonColor = staticDataColor.edit.switcher,
            buttonFont = staticDataFont.edit.switcher,unit = 'dB',his = this;
        this.masterFaderBox = new kbSprite(masterFaderBoxPos.x,masterFaderBoxPos.y,masterFaderBoxPos.width,masterFaderBoxPos.height,this.sprite);
        this.masterFaderTop = new kbSprite(SwitcherPos.x,SwitcherPos.y,SwitcherPos.width,SwitcherPos.height,this.masterFaderBox.sprite);
        this.masterSwitcher = new kbButton(0,0,1,.8,buttonImg,buttonText[0],buttonColor,buttonFont,this.masterFaderTop.sprite);
        this.masterGainStatus = new kbBoxText(.5,1,'0dB',buttonColor,staticDataFont.edit.gainStatus,this.masterFaderTop.sprite,.5);
        this.masterNavFader = new kbEditEqFader('',this.masterFaderBox.sprite,masterFaderPos.x,masterFaderPos.y,masterFaderPos.width,masterFaderPos.height,chID.CH_MASTER,'eq',faderCallback);
        this.masterNavFader.slider.setRenderClearRect(this.masterFaderBox.sprite,0x373740);
        new kbBoxText(.5,1.,staticDataString.edit.gain,buttonColor,buttonFont,this.masterFaderBox.sprite,.5,1);
        this.masterSwitcher.switchColor(switcherEvent);
        function switcherEvent(button){
            var flag = button.eventFlag,text,id = chID.CH_MASTER;
            if(flag){
                text = buttonText[1];
                formula.eq_hpf_freq13_range = {max : 100,min : 20};
                formula.eq_hpf_freq14_range = {max : 10000,min : 40};
                items[id] = itemsOut[0][0];
                GLOBAL.hl = 0;
            }else{
                text = buttonText[0];
                formula.eq_hpf_freq13_range = {max : 10000,min : 40};
                formula.eq_hpf_freq14_range = {max : 20000,min : 10000};
                items[id] = itemsOut[0][1];
                GLOBAL.hl = 1;
            }
            his.setData();
            his.eq.updateData(id,true);
            his.dyn.updateData(id,true);
            button.setText(text);
        }

        function faderCallback(per,val){
            his.masterGainStatus.setText(val/10+unit);
        }
    };

    kbEdit.prototype.updateData = function(id){
        if(this.id != id){
            this.id = id;
            if(id >= chID.CH_IN_NUM && id <= chID.CH_REVERB){
                this.tab.setTabDispear([0,1,3,4]);
                this.tab.switchBg(this.tabOldIndex[1]);
            }else if(id == chID.CH_MASTER){
                this.tab.setTabDispear([0,4,5,6]);
                this.tab.switchBg(this.tabOldIndex[2]);
            }else if(id == chID.CH_USER){
                this.tab.setTabDispear([1,4,5]);
                this.tab.switchBg(this.tabOldIndex[3]);
            }else{
                this.tab.setTabDispear([1,5]);
                this.tab.switchBg(this.tabOldIndex[0]);
            }
            this.group.updateData(id);
        }
        if(id < chID.CH_IN_NUM){
            this.sends.updateData(id);
            this.eq.updateData(id);
            this.dyn.updateData(id);
            this.port.updateData(id);
            this.masterFaderBox.visible(false)
        }else if(id >= chID.CH_IN_NUM && id <= chID.CH_REVERB){
            this.eq.updateData(id);
            this.model.updateData(id);
            this.masterFaderBox.visible(false)
        }else if(id == chID.CH_MASTER){
            this.eq.updateData(id);
            this.geq.updateData(id);
            this.dyn.updateData(id);
            this.masterFaderBox.visible(true)
        }
        this.nav.updateData(id);
    };

    kbEdit.prototype.setLock = function(flag){
        this.lock = flag;
        this.port.setLock(flag);
        this.eq.setLock(flag);
        this.dyn.setLock(flag);
        this.sends.setLock(flag);
        this.group.setLock(flag);
    };

    kbEdit.prototype.resize = function(){
        var tabPos = staticDataLocal.edit.tab,
            local = staticDataLocal.edit,masterFaderBoxPos = local.masterFaderBox,masterFaderPos = local.masterFader,SwitcherPos = local.masterFaderSwitcher;
        this.masterFaderBox.resize(masterFaderBoxPos.x,masterFaderBoxPos.y,masterFaderBoxPos.width,masterFaderBoxPos.height);
        this.masterFaderTop.resize(SwitcherPos.x,SwitcherPos.y,SwitcherPos.width,SwitcherPos.height);
        this.masterNavFader.sprite.resize(masterFaderPos.x,masterFaderPos.y,masterFaderPos.width,masterFaderPos.height);
        this.masterNavFader.scaleResize(1);
        this.nav.resize();
        this.tab.resize(tabPos.x,tabPos.y,tabPos.width,tabPos.height);
        this.port.resize();
        this.eq.resize();
        this.geq.resize();
        this.dyn.resize();
        this.sends.resize();
        this.group.resize();
    };

    var kbFreqShift = function(x,y,width,height,parent,status){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.parent = parent;
        this.status = status;
        this.paintBg();
        this.paintCircle();
    };

    kbFreqShift.prototype.setData = function(){
        var group = GLOBAL.linkData[this.id];
        this.header = new sendHeader.fdbk(this.id,group);
    };

    kbFreqShift.prototype.paintBg = function(){
        var bgColor = staticDataColor.phase.freqShift.backgroundColor;
        var bgBorderColor = staticDataColor.phase.freqShift.backgroundBorderColor;
        this.sprite = new kbSprite(this.x,this.y,this.width,this.height,this.parent);
        var tmp = getSpriteActData(this.sprite.sprite);
        this.actW = tmp[2];
        this.actH = tmp[3];
        new kbBoxBg(0,0,1,1,bgColor,this.sprite.sprite,true).setBorder(3,bgBorderColor,1);
    };

    kbFreqShift.prototype.paintCircle = function(){
        var textArray = staticDataString.editPort.fbc,his = this,font = staticDataFont.editPort;
        this.circleBntArray = new Array(4);
        this.ringBntArray = new Array(4);
        for(var i=0;i<4;i++){
            var circleBnt = new kbImg(.5,i/3,40/this.actW,40/this.actH,images[imgID.fbcButton],this.sprite.sprite);
            circleBnt.sprite.anchor.set(.5);
            var ringBnt = new kbRingButton(.5,i/3,0x3e932e,0x3e932e,this.sprite.sprite,20,35,1,.2);
            ringBnt.setBorder(35,2,0x3e932e,1);
            this.circleBntArray[3-i] = circleBnt;
            this.ringBntArray[3-i] = ringBnt;
            ringBnt.graphics.renderable = false;
            if(i == 3){
                new kbBoxText(.5,i/3,textArray[i],staticDataColor.editPort.text.status,font.fbcOff,this.sprite.sprite,.5,.5);
            }else{
                new kbBoxText(.5,i/3,textArray[i],staticDataColor.editPort.text.status,font.fbcNum,this.sprite.sprite,.5,.5);
            }
            circleBnt.baseTexture.interactive(true);
            circleBnt.sprite.index = 3-i;
            circleBnt.baseTexture.onEvent('mousedown',circleBntEvent);
            circleBnt.baseTexture.onEvent('touchstart',circleBntEvent);
        }
        function circleBntEvent(index){
            index = typeof index == 'number' ? index : this.index;
            for(var i=0;i<4;i++){
                if(i == index){
                    his.ringBntArray[i].graphics.renderable = true;
                    his.status.setText(textArray[3-i]);
                    items[his.id].fdbk.degree = i;
                    if(his.old != i){
                        sendData({pktHeader : his.header.pkt,paraHeader : his.header.para,data : items[his.id].fdbk});
                        his.old = i;
                    }
                }else{
                    his.ringBntArray[i].graphics.renderable = false;
                }
            }
            window.appRender();
        }
        this.circleBntEvent = circleBntEvent;
    };

    kbFreqShift.prototype.updateData = function(id){
        this.id = id;
        this.setData();
        this.old = items[this.id].fdbk.degree;
        this.circleBntEvent(items[this.id].fdbk.degree);
    };

    kbFreqShift.prototype.resize = function(x,y,width,height){
        this.sprite.resize(x,y,width,height);
        var tmp = getSpriteActData(this.sprite.sprite);
        var actAttr = [tmp[2],tmp[3]];
        for(var i= 0,len=this.circleBntArray.length;i<len;i++ ){
            this.circleBntArray[i].fixedScale({width:40,height:40},actAttr);
        }
    };
    /*绘制edit的port界面*/
    var kbEditPort = function(parent){
        this.parent = parent;
        this.local = staticDataLocal.port;
        this.color = staticDataColor.editPort;
        this.textColor = this.color.text;
        this.font = staticDataFont.editPort;
        this.string = staticDataString.editPort;
        this.box();
        this.trim();
        //this.delay();
        this.fbc();
        this.phase();
    };

    kbEditPort.prototype.setData = function(){
        var group = GLOBAL.linkData[this.id];
        setItemData(this.trimFader.slider,new sendHeader.adsp_gain(this.id,group),items[this.id].gain,'gain',formula.main_slider);
        //setItemData(this.delayFader.slider,new sendHeader.adsp_gain(this.id,group),portsData[this.id][portsID.delay],'val',formula.port_delay);
        setItemData(this.emptyButton,new sendHeader.adsp_gain(this.id,group),items[this.id].gain,'reverse');
        this.id < chID.CH_USER && setItemData(this.ppButton,new sendHeader.adsp_ppower(this.id,group),items[this.id].ppower,'on');
    };

    kbEditPort.prototype.box = function(){
        var contentPos = staticDataLocal.port.content,
            textTopPos = staticDataLocal.port.textTop,
            textBottomPos = staticDataLocal.port.textBottom;
        this.sprite = new kbSprite(contentPos.x,contentPos.y,contentPos.width,contentPos.height,this.parent);
        this.textTop = new kbSprite(textTopPos.x,textTopPos.y,textTopPos.width,textTopPos.height,this.sprite.sprite);
        this.textBottom = new kbSprite(textBottomPos.x,textBottomPos.y,textBottomPos.width,textBottomPos.height,this.sprite.sprite);
    };

    kbEditPort.prototype.trim = function(){
        var trimPos = staticDataLocal.port.trim,string = staticDataString.editPort.titleTrim,titleColor = staticDataColor.editPort.text.title,titleFont = staticDataFont.editPort.title,his = this;
        new kbBoxText(trimPos.x+trimPos.width/2,.5,string,titleColor,titleFont,this.textTop.sprite,.5,1);
        var textSprite = new kbSprite(trimPos.x,.5,trimPos.width,.5,this.textTop.sprite);
        this.trimStatus = new kbBoxText(.5,.5,'',staticDataColor.editPort.text.status[0],staticDataFont.editPort.status,textSprite.sprite,.5);
        this.trimFader = new kbEditPortTrimFader('',this.sprite.sprite,trimPos.x,trimPos.y,trimPos.width,trimPos.height,this.id,'portTrim');
        this.trimFader.statusText = this.trimStatus;
        this.trimFader.slider.setRenderClearRect(this.sprite.sprite,0x373740);
        new kbBoxText(trimPos.x+trimPos.width/2,1,string,titleColor,titleFont,this.textBottom.sprite,.5,1);
        this.trimStatus.setInput(textInput,textSprite.sprite,inputEvent);
        function inputEvent(val){
            val = boundaryValue(val,-80,20);
            sliderInputEvent(his.trimFader.slider,val,10);
        }
    };

    kbEditPort.prototype.delay = function(){
        var delayPos = this.local.delay;
        var  max = portRangeTab.delay.max,min = portRangeTab.delay.min,unit = 'ms',his = this;
        this.delayTextTop = new kbBoxText(delayPos.x+delayPos.width/2,.5,staticDataString.editPort.titleDelay,staticDataColor.editPort.text.title,staticDataFont.editPort.title,this.textTop.sprite,.5,1);
        this.delayStatus = new kbBoxText(delayPos.x+delayPos.width/2,.5,'350ms',staticDataColor.editPort.text.status,staticDataFont.editPort.status,this.textTop.sprite,.5,0);
        this.delayFader = new kbEditPortDelayFader('',this.sprite.sprite,delayPos.x,delayPos.y,delayPos.width,delayPos.height,this.id,'portDelay',delayMoveEvent);
        this.delayTextBottom = new kbBoxText(delayPos.x+delayPos.width/2,1,staticDataString.editPort.titleDelay,staticDataColor.editPort.text.title,staticDataFont.editPort.title,this.textBottom.sprite,.5,1);
        function delayMoveEvent(y){
            var gain = (max-(max-min)*y).toFixed(1);
            portsData[his.id][portsID.delay].val = gain;
            his.delayStatus.setText(gain+unit);
        }
    };

    kbEditPort.prototype.fbc = function(){
        var fbcPos = this.local.fbc,fbcString = this.string.titleFbc,statusString = this.string.statusFbc,textTitleColor = this.textColor.title,
            textStatusColor = this.textColor.status,titleFont = this.font.title,statusFont = this.font.status;
        this.fbcTextTop = new kbBoxText(fbcPos.x+fbcPos.width/2,.5,fbcString,textTitleColor,titleFont,this.textTop.sprite,.5,1);
        this.fbcStatus = new kbBoxText(fbcPos.x+fbcPos.width/2,.5,statusString,textStatusColor,statusFont,this.textTop.sprite,.5,0);
        this.fbcTextBottom = new kbBoxText(fbcPos.x+fbcPos.width/2,1,fbcString,textTitleColor,titleFont,this.textBottom.sprite,.5,1);
        this.FreqShift = new kbFreqShift(fbcPos.x,fbcPos.y,fbcPos.width,fbcPos.height,this.sprite.sprite,this.fbcStatus);
    };

    kbEditPort.prototype.phase = function(){
        var buttonPos1 = this.local.phaseButton1,buttonPos2 = this.local.phaseButton2,phaseString = this.string.titlePhase,titleColor = this.textColor.title,his = this,
            titleFont = this.font.title,emptyFont = this.font.empty,statusColor = this.textColor.status,buttonImg = [images[imgID.set_button],images[imgID.set_button_light]];
        new kbBoxText(buttonPos1.x+buttonPos1.width/2,.5,phaseString,titleColor,titleFont,this.textTop.sprite,.5,1);
        new kbBoxText(buttonPos1.x+buttonPos1.width/2,1,phaseString,titleColor,titleFont,this.textBottom.sprite,.5,1);
        this.emptyButton = new kbButton(buttonPos1.x,buttonPos1.y,buttonPos1.width,buttonPos1.height,buttonImg,'∅',statusColor,emptyFont,this.sprite.sprite);
        this.ppButton = new kbButton(buttonPos2.x,buttonPos2.y,buttonPos2.width,buttonPos2.height,buttonImg,'48v',statusColor,titleFont,this.sprite.sprite);
        this.emptyButton.switchColor();
        this.ppButton.switchColor();
    };

    kbEditPort.prototype.updateData = function(id){
        if(this.id != id){
            this.id = id;
            this.FreqShift.updateData(this.id);
            this.setData();
            this.resize();
            var fbcVisible = id == chID.CH_USER ? false : true;
            this.fbcTextTop.visible(fbcVisible);
            this.fbcStatus.visible(fbcVisible);
            this.fbcTextBottom.visible(fbcVisible);
            this.FreqShift.sprite.visible(fbcVisible);
            this.ppButton.visible(fbcVisible);
        }
        this.trimFader.slider.update();
        //this.delayFader.slider.update();
        this.emptyButton.update();
        this.ppButton.update();
    };

    kbEditPort.prototype.resize = function(){
        var local = staticDataLocal.port,contentPos = local.content,textTopPos = local.textTop,textBottomPos = local.textBottom,
            buttonPos1 = local.phaseButton1,buttonPos2 = local.phaseButton2,trimPos = local.trim,delayPos = local.delay,fbcPos = local.fbc;
        this.sprite.resize(contentPos.x,contentPos.y,contentPos.width,contentPos.height);
        this.textTop.resize(textTopPos.x,textTopPos.y,textTopPos.width,textTopPos.height);
        this.textBottom.resize(textBottomPos.x,textBottomPos.y,textBottomPos.width,textBottomPos.height);
        this.trimFader.scaleResize(trimPos.x,trimPos.y,trimPos.width,trimPos.height);
        //this.delayFader.scaleResize(delayPos.x,delayPos.y,delayPos.width,delayPos.height);
        this.FreqShift.resize(fbcPos.x,fbcPos.y,fbcPos.width,fbcPos.height);
        this.emptyButton.box.resize(buttonPos1.x,buttonPos1.y,buttonPos1.width,buttonPos1.height);
        this.ppButton.box.resize(buttonPos2.x,buttonPos2.y,buttonPos2.width,buttonPos2.height);
    };

    kbEditPort.prototype.setLock = function(flag){
        this.lock = flag;
        this.sprite.sprite.interactiveChildren = !flag;
    };

    var kbEqParent = function(parent){
        this.parent = parent;
    };

    kbEqParent.prototype.paintBox = function(){
        var local = staticDataLocal.eq,eqPos = local.eq;
        this.sprite = new kbSprite(0,0,1,1,this.parent);
        this.eqSprite = new kbSprite(eqPos.x,eqPos.y,eqPos.width,eqPos.height,this.sprite.sprite);
    };

    kbEqParent.prototype.paintCureBox = function(bypassEvent,resetEvent){
        var his = this,local = this.local,color = staticDataColor.editEq,font = staticDataFont.editEq,
            eqMatrixPos = local.eqMatrix,eqLineBox = local.lineBox,
            matrixButtonPos1 = local.matrixButton1,matrixButtonPos2 = local.matrixButton2,matrixButtonPos3 = local.matrixButton3,
            matrixButtonImg = [images[imgID.edit_button],images[imgID.edit_button_light]],matrixButtonTextColor = color.text.matrixButton,
            ringColor = color.circleBnt,bypassEventBntColor = color.bypassEvent,matrixButtonTextFont = font.matrixButton;
        this.martix = new kbSprite(eqMatrixPos.x,eqMatrixPos.y,eqMatrixPos.width,eqMatrixPos.height,this.eqSprite.sprite);
        new kbBoxBg(0,0,1,1,staticDataColor.editEq.lineBox,this.martix.sprite);
        this.lineSprite = new kbSprite(eqLineBox.x,eqLineBox.y,eqLineBox.width,eqLineBox.height,this.martix.sprite);
        if(this.flag == 'eq'){
            this.lineBg = new kbCanvasBg(0,0,1,1,canvasCache.eqMatrixBg,this.lineSprite.sprite);
        }else if(this.flag == 'geq'){
            this.lineBg = new kbCanvasBg(0,0,1,1,canvasCache.geqMatrixBg,this.lineSprite.sprite);
        }
        this.scaleSprite = new kbSprite(eqLineBox.x,eqLineBox.y,eqLineBox.width,eqLineBox.height,this.martix.sprite);
        this.graphics = new PIXI.Graphics();
        this.lineSprite.sprite.addChild(this.graphics);

        if(this.flag == 'geq'){
            this.byPassButton = new kbButton(matrixButtonPos1.x,matrixButtonPos1.y,matrixButtonPos1.width,matrixButtonPos1.height, matrixButtonImg,'BYPASS',matrixButtonTextColor,matrixButtonTextFont,this.martix.sprite);
            this.byPassButton.switchColor(bypassEvent);
        }else{
            this.bypassBnt = new Array(4);
            for(var i=0;i<4;i++){
                this.bypassBnt[i] = new kbButton(matrixButtonPos1.x,matrixButtonPos1.y,matrixButtonPos1.width,matrixButtonPos1.height, matrixButtonImg,'BYPASS',matrixButtonTextColor,matrixButtonTextFont,this.martix.sprite);
                this.bypassBnt[i].index = i;
                this.bypassBnt[i].switchColor(bypassEvent);
            }
        }

        this.reSetButton = new kbButton(matrixButtonPos2.x,matrixButtonPos2.y,matrixButtonPos2.width,matrixButtonPos2.height, matrixButtonImg,'RESET',matrixButtonTextColor,matrixButtonTextFont,this.martix.sprite);
        //this.spectrumButton = new kbButton(matrixButtonPos3.x,matrixButtonPos3.y,matrixButtonPos3.width,matrixButtonPos3.height, matrixButtonImg,'SPECTRUM',matrixButtonTextColor,matrixButtonTextFont,this.martix.sprite);

        this.reSetButton.bounce();
        this.reSetButton.switchColor(resetEvent);

        var lineMask = new kbBoxBg(0,0,1,1,0x123123,this.lineSprite.sprite);
        this.lineSprite.sprite.mask = lineMask.graphics;

        this.setCircleBntColor = function(flag,index){
            var attr = his.bntArray, i,len = attr.length;
            if(his.id == chID.CH_MASTER){
                switch(index){
                    case 0:
                        i = 1;
                        len = 5;
                        break;
                    case 1:
                        i = 5;
                        len = 9;
                        break;
                    case 2:
                        i = 9;
                        len = 13;
                        break;
                    case 3:
                        i = 13;
                        len = 15;
                        break;
                }
            }else{
                i=0;len = 5;
            }
            if(flag){
                for(i;i<len;i++){
                    attr[i].circleBnt.setRing({color1:bypassEventBntColor,color2:bypassEventBntColor,borderColor1:bypassEventBntColor});
                }
            }else{
                for(i;i<len;i++){
                    attr[i].circleBnt.setRing({color1:ringColor[i],color2:ringColor[i],borderColor1:ringColor[i]});
                }
            }
        };

        this.setMasterCircleBntColor = function(flag){
            var attr = his.masterCircle;
            for(var i= 0,len=attr.length;i<len;i++){
                if(flag){
                    attr[i].setAttr({color:bypassEventBntColor,borderColor:bypassEventBntColor});
                    his.masterSlider[i].Bg.setColor(bypassEventBntColor);
                }else{
                    var colorIndex = parseInt(i/5)+1;
                    attr[i].setAttr({color:ringColor[colorIndex],borderColor:ringColor[colorIndex]});
                    his.masterSlider[i].Bg.setColor(ringColor[colorIndex]);
                }
            }
        };
    };

    kbEqParent.prototype.resize = function(){
        var local = this.flag == 'eq' ? staticDataLocal.eq : staticDataLocal.geq,tabSlider = local.tabSlider,tabPos = local.tab,eqMatrixPos = local.eqMatrix,
            eqLineBox = local.lineBox,matrixButtonPos1 = local.matrixButton1,matrixButtonPos2 = local.matrixButton2,matrixButtonPos3 = local.matrixButton3,eqPos = local.eq,
            masterFaderBoxPos = local.faderBox,faderPos = local.fader,masterStatusY = local.statusY,sliderButtonH = local.sliderButtonH,switcherPos = local.switcher,delayPos = local.delay;
        this.eqSprite.resize(eqPos.x,eqPos.y,eqPos.width,eqPos.height);
        this.martix.resize(eqMatrixPos.x,eqMatrixPos.y,eqMatrixPos.width,eqMatrixPos.height);
        this.lineSprite.resize(eqLineBox.x,eqLineBox.y,eqLineBox.width,eqLineBox.height);
        this.scaleSprite.resize(eqLineBox.x,eqLineBox.y,eqLineBox.width,eqLineBox.height);
        this.reSetButton.resize(matrixButtonPos2.x,matrixButtonPos2.y,matrixButtonPos2.width,matrixButtonPos2.height);
        //this.spectrumButton.resize(matrixButtonPos3.x,matrixButtonPos3.y,matrixButtonPos3.width,matrixButtonPos3.height);
        if(this.flag == 'eq'){
            this.tabSprite.resize(tabSlider.x,tabSlider.y,tabSlider.width,tabSlider.height);
            this.tab.resize(tabPos.x,tabPos.y,tabPos.width,tabPos.height);
            this.switcherBox.resize(switcherPos.x,switcherPos.y,switcherPos.width,switcherPos.height);
            for(var i= 0,len=4;i<len;i++){
                this.bypassBnt[i].resize(matrixButtonPos1.x,matrixButtonPos1.y,matrixButtonPos1.width,matrixButtonPos1.height);
            }
            for(i=0,len=this.bandArray.length;i<len;i++)this.bandArray[i].resize();
            for(i=0;i<15;i++){
                this.feqs[i].calcFreqz(local.lineBoxW);
            }
            for(i=0;i<15;i++){
                this.bntArray[i].resize(local.lineBoxW,local.lineBoxH);
            }
        }else if(this.flag == 'geq'){
            for(i=0,len=this.masterSlider.length;i<len;i++){
                this.masterSlider[i].button.setHeight(sliderButtonH);
            }
            this.masterFaderBox.resize(masterFaderBoxPos.x,masterFaderBoxPos.y,masterFaderBoxPos.width,masterFaderBoxPos.height);
            this.masterFader.sprite.resize(faderPos.x,faderPos.y,faderPos.width,faderPos.height);
            this.masterFader.scaleResize(1);
            this.masterStatus.setY(masterStatusY);
            this.delayBox.resize(delayPos.x,delayPos.y,delayPos.width,delayPos.height);
            this.byPassButton.resize(matrixButtonPos1.x,matrixButtonPos1.y,matrixButtonPos1.width,matrixButtonPos1.height);
        }
        this.paintMatrixLine();
    };

    kbEqParent.prototype.setLock = function(flag){
        this.lock = flag;
        this.sprite.sprite.interactiveChildren = !flag;
    };

    var kbEditEq = function(parent){
        kbEqParent.call(this,parent);
        this.flag = 'eq';
        this.iirHeader = [];
        this.local = staticDataLocal.eq;
        this.paintBox();
        this.paintCureBox(bypassEvent,resetEvent);
        this.paintMatrixScale();
        this.paintBntBox();
        this.paintTabSwitcher();
        var his = this;
        var freqPos2 = formula.eq_freq,freqPos0 = formula.eq_hpf_freq0,freqPos13 = formula.eq_hpf_freq13,freqPos14 = formula.eq_hpf_freq14,resetQ = 1-CalcQ(7),
            resetFreq = [freqPos0(20,true),freqPos2(200,true),freqPos2(1000,true),freqPos2(4000,true),freqPos2(10000,true),freqPos13(40,true),freqPos14(10000,true)];
        function resetEvent(){
            his.bandArray[0].freqSlider.updateData(resetFreq[0]);
            his.bandArray[0].freqSlider.setY(resetFreq[0]);
            his.bandArray[0].freqSlider.sendData();
            var len = his.id == chID.CH_MASTER ? 13 : 5;
            for(var i=1;i<len;i++) {
                var gainSlider = his.bandArray[i].gainSlider,freqSlider = his.bandArray[i].freqSlider,QvalueSlider = his.bandArray[i].QvalueSlider;
                gainSlider.updateData(.5);
                gainSlider.setY(.5);
                freqSlider.updateData(resetFreq[(i-1)%4+1]);
                freqSlider.setY(resetFreq[(i-1)%4+1]);
                QvalueSlider.updateData(resetQ);
                QvalueSlider.setY(resetQ);
                if(gainSlider.sendOldData != items[his.id].eq[i-1].gain || freqSlider.sendOldData != items[his.id].eq[i-1].freq || QvalueSlider.sendOldData != items[his.id].eq[i-1].Q){
                    gainSlider.sendOldData = items[his.id].eq[i-1].gain;
                    freqSlider.sendOldData = items[his.id].eq[i-1].freq;
                    his.bandArray[i].QvalueSlider.sendOldData = undefined;
                    his.bandArray[i].QvalueSlider.sendData();
                }
            }
            if(his.id != chID.CH_MASTER){
                return;
            }
            his.bandArray[13].freqSlider.updateData(resetFreq[5]);
            his.bandArray[13].freqSlider.setY(resetFreq[5]);
            his.bandArray[13].freqSlider.sendData();
            his.bandArray[14].freqSlider.updateData(resetFreq[6]);
            his.bandArray[14].freqSlider.sendData();
        }

        function bypassEvent(button){
            var flag = button.eventFlag,index = button.index, i,len;
            his.setCircleBntColor(flag,index);
                switch(index){
                    case 0:
                        i = 0;
                        len = 4;
                        break;
                    case 1:
                        i = 4;
                        len = 8;
                        break;
                    case 2:
                        i = 8;
                        len = 12;
                        break;
                    case 3:
                        if(items[his.id].hpf) {
                            items[his.id].hpf.bypass = boolean2number(flag);
                            sendData({pktHeader: his.xoHeader.pkt, paraHeader: his.xoHeaderH.para, data: items[his.id].hpf});
                        }
                        if(items[his.id].lpf) {
                            items[his.id].lpf.bypass = boolean2number(flag);
                            sendData({pktHeader: his.xoHeader.pkt, paraHeader: his.xoHeaderL.para, data: items[his.id].lpf});
                        }
                        break;
                }
                if(his.id != chID.CH_MASTER){
                    if(items[his.id].hpf) {
                        items[his.id].hpf.bypass = boolean2number(flag);
                        sendData({pktHeader: his.xoHeader.pkt, paraHeader: his.xoHeader.para, data: items[his.id].hpf});
                    }
                }
            if(index != 3){
                for(;i<len;i++){
                    items[his.id].eq[i].bypass = boolean2number(flag);
                    sendData({pktHeader : his.iirHeader[i].pkt,paraHeader : his.iirHeader[i].para,data : items[his.id].eq[i]});
                }
            }
        }
    };

    kbEditEq.prototype.setData = function(){
        var group = GLOBAL.linkData[this.id];
        for(var i=0;i<12;i++){
            this.iirHeader[i] = new sendHeader.adsp_iir(this.id,i,group);
        }
        this.xoHeader = new sendHeader.adsp_xo(this.id,group);
        this.xoHeaderH = new sendHeader.adsp_xo(this.id,group,1);
        this.xoHeaderL = new sendHeader.adsp_xo(this.id,group,0);
        this.setAllCircleBntColor();
    };

    kbEditEq.prototype.setAllCircleBntColor = function(){
        if(this.id == chID.CH_MASTER){
            this.setCircleBntColor(items[this.id].eq[0].bypass,0);
            this.setCircleBntColor(items[this.id].eq[4].bypass,1);
            this.setCircleBntColor(items[this.id].eq[8].bypass,2);
            this.setCircleBntColor(items[this.id].hpf.bypass,3);
        }
    };

    kbEditEq.prototype.feqData = function(){
        var freq_x = [20,25,32,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,12500,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000,20000];
        this.peaks = [];
        this.feqs = [];
        this.typeArray = [];
        for (var i=0;i<15;i++) {
            var q = i == 0 ? .7 : 0;
            if(i == 0 || i == 13){
                this.typeArray[i] = DSP.HPF;
            }else if(i == 14){
                this.typeArray[i] = DSP.LPF;
            }else{
                this.typeArray[i] = DSP.PEAKING_EQ;
            }
            this.peaks[i] = new eqPeak(freq_x[3+i], 0, q);
            this.feqs[i] = new FrequencyEq(this.typeArray[i],48000, this.peaks[i]);
        }
    };

    kbEditEq.prototype.paintMatrixLine = function(){
        this.lineBg.baseTexture.sprite.texture = new PIXI.Texture.fromCanvas(canvasCache.eqMatrixBg);
    };

    kbEditEq.prototype.paintMatrixScale = function(){
        var scaleY = staticDataString.eq.scaleY,textColor = staticDataColor.editEq.text.scale,
            textFont = staticDataFont.editEq.num,scaleX = staticDataString.eq.scaleX,text,anchorX = 1.2,anchorY = .5;
        var attr = [20,50,100,200,500,1000,2000,5000,10000,20000];
        for(var i=0;i<7;i++){
            if(i==0){
                anchorY = 0;
            }else if(i == 6){
                anchorY = 1;
            }else{
                anchorY = .5;
            }
            text = new kbBoxText(0,i/6,scaleY[i],textColor,textFont,this.scaleSprite.sprite,anchorX,anchorY);
        }
        anchorX = .5,anchorY = -.2;
        for(var i=0;i<10;i++){
            if(i==0){
                anchorX = 0;
            }else if(i==9){
                anchorX = 1;
            }else{
                anchorX = .5;
            }
            var x = CalcXPos6(1,20,20000,attr[i]);
            text = new kbBoxText(x,1,scaleX[i],textColor,textFont,this.scaleSprite.sprite,anchorX,anchorY);
        }
    };

    kbEditEq.prototype.paintBntBox = function(){
        var local = staticDataLocal.eq,tabSlider = local.tabSlider,tabW = local.sliderWidth,tabPos = local.tab,his = this,band,tabLen = 15;
        this.bntArray = new Array(tabLen);
        this.bandArray = new Array(tabLen);
        /*创建绘制eq曲线的graphics*/
        this.graphicsEq = new PIXI.Graphics();
        this.lineSprite.sprite.addChild(this.graphicsEq);
        pushScaleData(this.graphicsEq);
        this.feqData();
        /*绘制ring按钮*/
        for(var i=0;i<tabLen;i++){
            var bnt =  new kbEqCircleBnt(0,.5,staticDataColor.editEq.circleBnt,this.lineSprite.sprite,i,this.peaks,this.graphicsEq,this.feqs,this.typeArray[i]);
            this.lineSprite.sprite.setChildIndex(bnt.graphicsEq,0);
            this.bntArray[i] = bnt;
        }
        paintTab();
        addButtonBorder();
        function paintTab(){
            his.tabSprite = new kbSprite(tabSlider.x,tabSlider.y,tabSlider.width,tabSlider.height,his.eqSprite.sprite);
            var space = 20,bntW = tabW-5*5,bntW1 = bntW/5*1.15/tabW,bntW2 = (bntW/tabW-bntW1)/4;
            var titleStyle = {
                    x : tabPos.x,
                    width : tabPos.width,
                    height : tabPos.height,
                    buttonWidth : [bntW1,bntW2,bntW2,bntW2,bntW2,bntW2,bntW2,bntW2,bntW2,bntW2,bntW2,bntW2,bntW2,bntW2,bntW2],
                    images : [images[imgID.edit_eq_tab_left],images[imgID.edit_eq_tab_left_light],images[imgID.edit_eq_tab_right],images[imgID.edit_eq_tab_left_light]],
                    buttonSpace : space
                },titleText = staticDataString.eq.tabLabel,content = [];
            for(var i=0;i<tabLen;i++){
                band = new kbBandBox(his.bntArray[i],i,his.tabSprite.sprite);
                his.bandArray[i] = band;
                his.bntArray[i].band = band;
                content[i] = band.sprite;
            }
            his.tab = new kbTab(titleText,titleStyle,his.tabSprite.sprite,content,resizePage);
            his.tabIndex = 1;
            function resizePage(i){
                his.tabIndex = i;
                jugeFunc(his.bandArray[i].gainFader);
                jugeFunc(his.bandArray[i].freqFader);
                jugeFunc(his.bandArray[i].QFader);
                function jugeFunc(element){
                    if(element)element.scaleResize(1);
                }
            }
        }

        function addButtonBorder(){
            var attr = his.bntArray;
            attr[1].circleBnt.setRing({borderAlpha1 : 1});
            for(var i=0,len=attr.length;i<len;i++){
                attr[i].setMoveStartFunc(ringBntMoveEvent,attr);
            }
        }

        function ringBntMoveEvent(count,noTab){
            var attr = his.bntArray,tabIndex=count;
            for(var i=0,len=attr.length;i<len;i++){
                if(i == count){
                    attr[i].circleBnt.setRing({borderAlpha1 : 1});
                    if(his.id > chID.CH_USER){
                        tabIndex = (i-1)%4;
                    }
                }else{
                    attr[i].circleBnt.setRing({borderAlpha1 : 0});
                }
            }
            !noTab && his.tab.switchBg(tabIndex);
            window.appRender();
        }
    };

    kbEditEq.prototype.paintTabSwitcher = function(){
        var space = .005,x = .05+space,width = (.9 -space*5)/4,y = 0,height = 1,textColor = staticDataColor.editEq.text.tabTitle,
            textFont = staticDataFont.editEq.tabTitle,his = this,textArray = staticDataString.eq.switcher,boxPos = staticDataLocal.eq.switcher;
        this.switcherBox = new kbSprite(boxPos.x,boxPos.y,boxPos.width,boxPos.height,this.eqSprite.sprite);
        this.buttonArray = kbRadioButton(x,y,width,height,space,textArray,textColor,textFont,this.switcherBox.sprite,switcherEvent);
        var attr = [[0,5,6,7,8,9,10,11,12,13,14],[0,1,2,3,4,9,10,11,12,13,14],[0,1,2,3,4,5,6,7,8,13,14],[0,1,2,3,4,5,6,7,8,9,10,11,12]];
        function switcherEvent(i) {
            his.setBypassVisible(i);
            his.tab.setTabDispear(attr[i]);
            for(var a= 0;a<15;a++){
                if(!inArray(attr[i],a)){
                    his.bntArray[a].circleBnt.visible(true);
                    his.bandArray[a].updateData(his.id);
                }else{
                    his.bntArray[a].circleBnt.visible(false);
                }
            }
            his.tab.switchBg(0);
        }
    };

    kbEditEq.prototype.updateData = function(id,forceUpdata){
        if(this.id != id || forceUpdata){
            this.id = id;
            this.setData();
        }
        var visible = this.sprite.sprite.visible,editVisible = ctx.edit.sprite.visible;
        this.sprite.visible(true);
        this.eqSprite.visible(true);
        ctx.edit.visible(true);

        if(this.id >= chID.CH_ECHO && this.id <= chID.CH_REVERB){
            this.circleBntDisable([0,5,6,7,8,9,10,11,12,13,14],false);
            this.circleBntDisable([1,2,3,4],true);
            this.bntArray[0].setType('OFF');
            this.tab.setTabDispear([0,5,6,7,8,9,10,11,12,13,14]);
            this.tab.switchBg(0);
        }else if(this.id < chID.CH_ECHO){
            this.circleBntDisable([5,6,7,8,9,10,11,12,13,14],false);
            this.circleBntDisable([0,1,2,3,4],true);
            this.bntArray[0].setType(DSP.HPF);
            this.tab.setTabDispear([5,6,7,8,9,10,11,12,13,14]);
            this.tab.switchBg(1);
        }
        if(this.id == chID.CH_MASTER){
            this.bntArray[0].setType('OFF');
            this.switcherBox.visible(true);
            this.buttonArray[0].mousedownfunc();
        }else{
            this.switcherBox.visible(false);
            this.setBypassVisible(0);
        }
        this.updateBypass(this.id);
        this.eqSprite.visible(true);

        var i = (this.id >= chID.CH_ECHO && this.id <= chID.CH_MASTER) ? 1 : 0;
        var tabLen = this.id == chID.CH_MASTER ? 15 : 5;

        for(i;i<tabLen;i++){
            this.bntArray[i].updateData(this.id);
            this.bandArray[i].updateData(this.id,forceUpdata);
        }
        this.sprite.visible(visible);
        ctx.edit.visible(editVisible);
    };

    kbEditEq.prototype.updateBypass = function(id){
        id = id ? id : this.id;
        if(id != chID.CH_MASTER){
            kbChangeButtonColor(this.bypassBnt[0],items[id].eq[0].bypass);
            this.setCircleBntColor(items[id].eq[this.tabIndex].bypass,0);
        }else{
            kbChangeButtonColor(this.bypassBnt[0],items[id].eq[0].bypass);
            kbChangeButtonColor(this.bypassBnt[1],items[id].eq[4].bypass);
            kbChangeButtonColor(this.bypassBnt[2],items[id].eq[8].bypass);
            kbChangeButtonColor(this.bypassBnt[3],items[id].hpf.bypass);
            this.setAllCircleBntColor();
        }

    };

    kbEditEq.prototype.setBypassVisible = function(i){
        for(var j=0;j<4;j++){
            if(j == i){
                this.bypassBnt[j].visible(true);
            }else{
                this.bypassBnt[j].visible(false);
            }
        }
    };

    kbEditEq.prototype.circleBntDisable = function(attr,flag){
        for(var i= 0,len=attr.length;i<len;i++){
            var a = attr[i];
            this.bntArray[a].circleBnt.visible(flag);
        }
    };

    kbEditEq.prototype = mergeObj(kbEditEq.prototype,kbEqParent.prototype);

    var kbEditGeq = function(parent) {
        this.flag = 'geq';
        kbEqParent.call(this, parent);
        this.parent = parent;
        this.local = staticDataLocal.geq;
        this.titleColor = staticDataColor.editEq.text.band;
        this.titleFont = staticDataFont.editEq.band;
        this.paintBox();
        this.paintDelay();
        this.paintCureBox(bypassEvent, resetEvent);
        this.paintMatrixScale();
        this.paintSlider();
        this.byPassButton.updateFunc = updateBypass;
        var his = this;

        function resetEvent() {
            for (var i = 0, len = his.masterSlider.length; i < len; i++) {
                his.masterSlider[i].updateData(.5);
                his.masterSlider[i].setY(.5);
                his.masterSlider[i].sendData();
            }
        }

        function bypassEvent(button, noSend) {
            var flag = button.eventFlag;
            his.setMasterCircleBntColor(flag);
            if (!noSend) {
                for (var j = 0, olen = his.masterSlider.length; j < olen; j++) {
                    miscData.eq[j].bypass = boolean2number(flag);
                    his.masterSlider[j].sendOldData = undefined;
                    his.masterSlider[j].sendData();
                }
            }
        }

        function updateBypass(button) {
            var data = button.eventFlag;
            his.setMasterCircleBntColor(data);
            for (var j = 0, olen = his.masterSlider.length; j < olen; j++) {
                miscData.eq[j].bypass = boolean2number(data);
            }
        }
    };

    kbEditGeq.prototype.setData = function(){
        var group = GLOBAL.linkData[this.id];
        for(var i= 0,len=this.masterSlider.length;i<len;i++){
            setItemData(this.masterSlider[i],new sendHeader.adsp_iir(chID.CH_MISC,i,group),miscData.eq[i],'gain',formula.eq_gain);
        }
        kbChangeButtonColor(this.byPassButton,miscData.eq[0].bypass);
        this.byPassButton.func(this.byPassButton,true);
        setItemData(this.delaySlider,new sendHeader.adsp_delay(chID.CH_MISC,0),miscData.ldelay,'time',formula.adsp_delay);
        setItemData(this.byPassButton,new sendHeader.adsp_iir(chID.CH_MISC,1,group),miscData.eq[0],'bypass');
        this.byPassButton.sendFlag = false;
    };

    kbEditGeq.prototype.paintMatrixLine = function(){
        this.lineBg.baseTexture.sprite.texture = new PIXI.Texture.fromCanvas(canvasCache.geqMatrixBg);
    };

    kbEditGeq.prototype.paintMatrixScale = function(){
        var scaleY = staticDataString.eq.scaleY,textColor = staticDataColor.editEq.text.scale,
            textFont = staticDataFont.editEq.num;
        var scaleX = [31.5,46,63,100,160,250,400,630,'1k','1.6k','2.5k','4k','6.3k','10k','16k'];
        for(var i=0;i<7;i++){
            new kbBoxText(0,i/6,scaleY[i],textColor,textFont,this.scaleSprite.sprite,1.2,.5);
        }
        for(i=0;i<16;i++){
            new kbBoxText(i/15+1/30,1,scaleX[i],textColor,textFont,this.scaleSprite.sprite,.5,-.5);
        }
    };

    kbEditGeq.prototype.paintDelay = function(){
        var delayPos = this.local.delay,str = staticDataString.eq.delay,unit = 'ms',his = this;
        this.delayBox = new kbSprite(delayPos.x,delayPos.y,delayPos.width,delayPos.height,this.sprite.sprite);
        new kbBoxText(0,.5,str,this.titleColor,this.titleFont,this.delayBox.sprite,0,.5);
        this.delaySlider = new kbSlider(.15,.4,.7,.2,images[imgID.main_sliderBg],delaySliderEvent,this.delayBox.sprite,'x',0,.5,images[imgID.main_smallmetal]);
        this.delayStatus = new kbBoxText(1,.5,'',this.titleColor,this.titleFont,this.delayBox.sprite, 1,.5);
        this.delaySlider.setRenderClearRect(this.delayBox.sprite,0x373740);
        function delaySliderEvent(per,val){
            his.delayStatus.setText(val/10+unit);
        }
    };

    kbEditGeq.prototype.paintSlider = function(){
        var color = staticDataColor.editEq,ringColor = color.circleBnt,curveColor = color.masterCurve,lightColor = color.masterLight,local = this.local,
            buttonW = local.sliderButtonW,buttonH = local.sliderButtonH,buttonRing = local.sliderButtonRing,lightBg = [],his = this,
            masterFaderBoxPos = local.faderBox,faderPos = local.fader,masterStatusY = local.statusY,unit = 'dB';
        this.masterSlider = [];
        this.masterCircle = [];
        this.masterBntIndex = 0;
        for(var i=0;i<15;i++){
            lightBg[i] = new kbBoxBg(i/15,0,1/15,1,lightColor,this.lineSprite.sprite,0);
            var buttonColor = ringColor[parseInt(i/5)+1];
            var sprite = new kbSprite(0,.5,1,buttonH);
            var circle = new Circle(.5,0,.5,buttonColor,sprite.sprite,.3,buttonRing,buttonColor,1);
            sprite.eventElement = circle.graphics;
            this.masterSlider[i] = new kbSlider(i/15+(1/15-buttonW)/2,0,buttonW,1,undefined,masterSliderEvent,this.lineSprite.sprite,'y',0,.5,sprite);
            this.masterSlider[i].Bg.setRadius(0);
            this.masterSlider[i].Bg.setAlpha(.5);
            this.masterSlider[i].Bg.setColor(buttonColor);
            this.masterSlider[i].Bg.resize(0,.5,1,0);
            this.masterSlider[i].index = i;
            this.masterSlider[i].setRenderClearRect(this.lineSprite.sprite,staticDataColor.editEq.lineBox);
            sprite.sprite.anchor.set(0,.5);
            this.masterCircle[i] = circle;
            this.masterSlider[i].setStartFunc(masterSliderStart);
            this.masterSlider[i].sprite.swapChildren(this.masterSlider[i].Bg.graphics,sprite.sprite);
        }

        this.masterFaderBox = new kbSprite(masterFaderBoxPos.x,masterFaderBoxPos.y,masterFaderBoxPos.width,masterFaderBoxPos.height,this.eqSprite.sprite);
        new kbBoxText(.5,0,'GAIN',this.titleColor,this.titleFont,this.masterFaderBox.sprite,.5,0);
        this.masterStatus = new kbBoxText(.5,masterStatusY,'',staticDataColor.editEq.text.bandStatus,staticDataFont.editEq.bandStatus,this.masterFaderBox.sprite,.5,0);
        this.masterFader = new kbEditEqFader('',this.masterFaderBox.sprite,faderPos.x,faderPos.y,faderPos.width,faderPos.height,this.id,'eq',faderCallback);
        this.masterAllSlider = this.masterFader.slider;
        this.masterAllSlider.setRenderClearRect(this.masterFaderBox.sprite,0x373740);

        new kbBoxText(.5,1,'GAIN',this.titleColor,this.titleFont,this.masterFaderBox.sprite,.5,1);

        function faderCallback(per){
            his.masterSlider[his.masterBntIndex].setY(per);
            his.masterSlider[his.masterBntIndex].updateData(per);
            his.masterSlider[his.masterBntIndex].sendData();
            his.masterSlider[0].render();
        }

        function masterSliderEvent(y,data,button){
            his.masterBntIndex = button.index;
            his.masterAllSlider.setY(y);
            his.masterStatus.setText(data/10+unit);
            y = y * his.eqBntActH;
            var x = Math.round(his.eqBntActW/15*his.masterBntIndex),
                w = his.eqBntActW/15*.8,
                h = .5 * his.eqBntActH - y;
            his.eqCurve.clearRect(x,0,his.eqBntActW/15,his.eqBntActH);
            his.eqCurve.beginPath();
            his.eqCurve.fillStyle = curveColor[parseInt(his.masterBntIndex/5)+1];
            his.eqCurve.fillRect(x,y,w,h);
            his.eqCurve.closePath();
            his.eqCurve.stroke();
            his.masterAllSlider.render();
            his.eqSprite.render();
        }

        function masterSliderStart(button){
            for(var i= 0,len=lightBg.length;i<len;i++){
                if(i == button.index){
                    lightBg[i].setAlpha(.5);
                    his.masterBntIndex = button.index;
                }else{
                    lightBg[i].setAlpha(0);
                }
            }
            window.appRender();
        }
    };

    kbEditGeq.prototype.updateData = function(id){
        if(this.id == id)return;
        this.id = id;
        this.setData();
        var fader = init.page.main.faderArray[id],visible = this.sprite.sprite.visible,editVisible = ctx.edit.sprite.visible;
        this.sprite.visible(true);
        this.eqSprite.visible(true);
        ctx.edit.visible(true);
        kbChangeButtonColor(this.byPassButton,miscData.eq[0].bypass);
        this.setMasterCircleBntColor(miscData.eq[0].bypass);
        this.eqBntActW = fader.eqBntActW;
        this.eqBntActH = fader.eqBntActH;
        this.eqCurve = fader.eqCurve.sprite.texture.baseTexture.source.getContext('2d');
        this.eqSprite = fader.eqCurve;
        for(var i= 0,len=this.masterSlider.length;i<len;i++){
            this.masterSlider[i].update();
        }
        this.sprite.visible(visible);
        ctx.edit.visible(editVisible);
        this.delaySlider.update();
    };

    kbEditGeq.prototype = mergeObj(kbEditGeq.prototype,kbEqParent.prototype);

    var kbBandBox = function(bntN,num,parent){
        this.bntN = bntN;
        this.num = num;
        this.parent = parent;
        this.group = 0;
        this.paintBox();
        this.button();
        if(this.num == 13 || this.num == 14){
            this.paintOrder();
        }
        this.sliderBox();
        this.initData();
    };

    kbBandBox.prototype.initData = function(){
        this.gainUnit = 'dB';
        this.freqUnit = 'Hz';
    };

    kbBandBox.prototype.setData = function(){
        var group = GLOBAL.linkData[this.id];
        if(this.num == 0){
            setItemData(this.freqSlider,new sendHeader.adsp_xo(this.id,group),items[this.id].hpf,'freq',formula.eq_hpf_freq0);
        }else if(this.num == 13){
            items[this.id].hpf.response = 1;
            setItemData(this.freqSlider,new sendHeader.adsp_xo(this.id,group,1),items[this.id].hpf,'freq',formula.eq_hpf_freq13);
            this.tabButtonHeader = new sendHeader.adsp_xo(this.id,group,1);
        }else if(this.num == 14){
            items[this.id].lpf.response = 0;
            setItemData(this.freqSlider,new sendHeader.adsp_xo(this.id,group,0),items[this.id].lpf,'freq',formula.eq_hpf_freq14);
            this.tabButtonHeader = new sendHeader.adsp_xo(this.id,group,0);
        }else{
            setItemData(this.gainSlider,new sendHeader.adsp_iir(this.id,this.num-1,group),items[this.id].eq[this.num-1],'gain',formula.eq_gain);
            setItemData(this.freqSlider,new sendHeader.adsp_iir(this.id,this.num-1,group),items[this.id].eq[this.num-1],'freq',formula.eq_freq);
            setItemData(this.QvalueSlider,new sendHeader.adsp_iir(this.id,this.num-1,group),items[this.id].eq[this.num-1],'Q',formula.eq_Q);
            this.tabButtonHeader = new sendHeader.adsp_iir(this.id,this.num-1,group);
        }
    };

    kbBandBox.prototype.paintBox = function(){
        var tabSliderH = getSpriteActData(this.parent)[3];
        this.sprite = new kbSprite(0,5/tabSliderH,1,1-5/tabSliderH,this.parent).sprite;
        new kbBoxBg(0,0,1,1,staticDataColor.editEq.bandBox,this.sprite);
        var topBox = staticDataLocal.eq.topBox,
            centerBox = staticDataLocal.eq.centerBox,
            BottomBox = staticDataLocal.eq.bottomBox;
        this.topBox = new kbSprite(topBox.x,topBox.y,topBox.width,topBox.height,this.sprite);
        this.centerBox = new kbSprite(centerBox.x,centerBox.y,centerBox.width,centerBox.height,this.sprite);
        this.bottomBox = new kbSprite(BottomBox.x,BottomBox.y,BottomBox.width,BottomBox.height,this.sprite);
    };

    kbBandBox.prototype.button = function(){
        var space = .005,x = .05+space,width = (.9 -space*5)/4,y = .1,height = 40/140,textColor = staticDataColor.editEq.text.tabTitle,
            textFont = staticDataFont.editEq.tabTitle,his = this,resetFunc;
        var textArray = staticDataString.eq.getTabButton(this.num);
        this.funcArray = his.num != 13 && his.num != 14 ? [offBntEvent,lShelvEvent,peqBntEvent,HShelcEvent] : [offBntEvent,butterEvent,besselEvent,linkWitzEvent];
        this.buttonArray = kbRadioButton(x,y,width,height,space,textArray,textColor,textFont,this.topBox.sprite,true);
        var buttonArray = this.buttonArray;
        this.oldResponse = 0;
        if(this.num != 0){
            var resetButton = buttonArray[2];
            kbSetRadioButton([buttonArray[1],buttonArray[2],buttonArray[3]],radioEvent);
            kbChangeRadioButtonColor(buttonArray[2],1);
        }else{
            buttonArray[0].parent.x = .5-width/2;
        }
        buttonArray[0].switchColor(offBntEvent);
        function offBntEvent(button){
            var eventFlag = !button ? true : button.eventFlag;
            if(eventFlag){
                his.bntN.setType('OFF');
                his.bntN.sendFlag = false;
                if(his.num != 0){
                    for(var i=1;i<4;i++)kbChangeRadioButtonColor(buttonArray[i],0);
                }
                setSliderSendFlag(false);
                setResponse(iirResponse.IIR_OFF);
            }else{
                if(his.num !=0)kbChangeRadioButtonColor(resetButton,1);
                resetFunc();
            }
        }
        function lShelvEvent(){
            buttonEvent(buttonArray[1],DSP.LOW_SHELF,iirResponse.IIR_LOWSHELVF,lShelvEvent);
        }
        function peqBntEvent(){
            buttonEvent(buttonArray[2],DSP.PEAKING_EQ,iirResponse.IIR_EQ,peqBntEvent);
        }
        function HShelcEvent(){
            buttonEvent(buttonArray[3],DSP.HIGH_SHELF,iirResponse.IIR_HIGHELVF,HShelcEvent);
        }
        function butterEvent(){
            buttonEvent(buttonArray[1],DSP.HPF,xoMode.XO_BUTTERWORTH,butterEvent);
        }
        function besselEvent(){
            buttonEvent(buttonArray[2],DSP.HPF,xoMode.XO_BESSEL,besselEvent);
        }
        function linkWitzEvent(){
            buttonEvent(buttonArray[3],DSP.HPF,xoMode.XO_LINKWITZ,linkWitzEvent);
        }

        function buttonEvent(button,dspType,mode,func){
            resetFunc = func;
            kbChangeButtonColor(buttonArray[0],0);
            setSliderSendFlag(true);
            resetButton = button;
            dspType && his.bntN.setType(dspType);
            if(his.num != 13 && his.num != 14){
                setResponse(mode);
            }else{
                setMode(mode);
            }
        }

        function setSliderSendFlag(flag) {
            if(his.num != 0 && his.num != 13 && his.num != 14){
                his.gainSlider.sendFlag = flag;
                his.QvalueSlider.sendFlag = flag;
            }
            his.freqSlider.sendFlag = flag;
        }

        function radioEvent(button){
            for(var i = 1,len = buttonArray.length;i<len;i++){
                if(buttonArray[i] == button){
                    his.funcArray[i]();
                    var data,oSendData;
                    if(his.num == 13){
                        data = items[his.id].hpf.method;
                        oSendData = items[his.id].hpf;
                    }else if(his.num == 14){
                        data = items[his.id].lpf.method;
                        oSendData = items[his.id].lpf;
                    }else{
                        data = items[his.id].eq[his.num-1].response;
                        oSendData = items[his.id].eq[his.num-1];
                    }
                    if(data != his.oldResponse){
                        sendData({pktHeader : his.tabButtonHeader.pkt,paraHeader : his.tabButtonHeader.para,data : oSendData});
                        his.oldResponse = data;
                    }
                }
            }
        }

        function setResponse(data){
            his.freqSlider.data.response = data;
        }
        function setMode(data){
            his.freqSlider.data.method = data;
        }
    };

    kbBandBox.prototype.paintOrder = function(){
        var space = .005,x = .05+space,width = (.9 -space*5)/4,y = 55/140,height = 40/140,textColor = staticDataColor.editEq.text.tabTitle,
            textFont = staticDataFont.editEq.tabTitle,his = this,textArray = staticDataString.eq.order;
        this.oldOrder = 0;
        var buttonArray = kbRadioButton(x,y,width,height,space,textArray,textColor,textFont,this.topBox.sprite,true);
        this.orderButtonArray = buttonArray;
        kbSetRadioButton(buttonArray,radioEvent);
        function radioEvent(button){
            for(var i = 0,len = buttonArray.length;i<len;i++){
                if(buttonArray[i] == button){
                    var data = i+1;
                    var oSendData = his.num == 13 ? items[his.id].hpf : items[his.id].lpf;
                    if(his.oldOrder != data){
                        oSendData['pre_order'] = data;
                        sendData({pktHeader : his.tabButtonHeader.pkt,paraHeader : his.tabButtonHeader.para,data : oSendData});
                        his.oldOder = data;
                    }
                }
            }
        }
    };

    kbBandBox.prototype.sliderBox = function(){
        var his = this,title = staticDataString.eq.bandTitle;
        var x = .14,y = 0,width = .13,height = 1,textH = .7,textStatusY = this.num != 13 && this.num != 14 ? .55 : .85;
        if(this.num >= 1 && this.num <= 12){
            new kbBoxText(x+width/2,textStatusY,title[0],staticDataColor.editEq.text.band,staticDataFont.editEq.band,this.topBox.sprite,.5,1);
            this.gainStatus = new kbBoxText(x+width/2,textStatusY+.1,'10dB',staticDataColor.editEq.text.bandStatus,staticDataFont.editEq.bandStatus,this.topBox.sprite,.5);
            this.gainFader = new kbEditEqFader('',this.centerBox.sprite,x,y,width,height,this.id,'eq',gainCallback);
            this.gainSlider = this.gainFader.slider;
            this.gainSlider.setRenderClearRect(this.sprite,staticDataColor.editEq.bandBox);
            new kbBoxText(x+width/2,textH,title[0],staticDataColor.editEq.text.band,staticDataFont.editEq.band,this.bottomBox.sprite,.5);
            this.gainStatus.setInput(textInput,[20,10],gainInputEvent);
        }

        x = (1-width)/2;
        new kbBoxText(x+width/2,textStatusY,title[1],staticDataColor.editEq.text.band,staticDataFont.editEq.band,this.topBox.sprite,.5,1);
        this.freqStatus = new kbBoxText(x+width/2,textStatusY+.1,'1kHz',staticDataColor.editEq.text.bandStatus,staticDataFont.editEq.bandStatus,this.topBox.sprite,.5);
        this.freqFader = new kbEditEqFader('',this.centerBox.sprite,x,y,width,height,this.id,'eq',freqCallback);
        this.freqSlider = this.freqFader.slider;
        this.freqSlider.setRenderClearRect(this.sprite,staticDataColor.editEq.bandBox);
        //this.freqSlider.setStep(.2,0,.5);
        new kbBoxText(x+width/2,textH,title[1],staticDataColor.editEq.text.band,staticDataFont.editEq.band,this.bottomBox.sprite,.5);
        this.freqStatus.setInput(textInput,[20,10],freqInputEvent);

        if(this.num >=1 && this.num <= 12){
            x = 1-.14-width;
            new kbBoxText(x+width/2,textStatusY,title[2],staticDataColor.editEq.text.band,staticDataFont.editEq.band,this.topBox.sprite,.5,1);
            this.qStatus = new kbBoxText(x+width/2,textStatusY+.1,'12.0',staticDataColor.editEq.text.bandStatus,staticDataFont.editEq.bandStatus,this.topBox.sprite,.5);
            this.QFader = new kbEditEqFader('',this.centerBox.sprite,x,y,width,height,this.id,'eq',QCallback);
            this.QvalueSlider = this.QFader.slider;
            this.QvalueSlider.setRenderClearRect(this.sprite,staticDataColor.editEq.bandBox);
            new kbBoxText(x+width/2,textH,title[2],staticDataColor.editEq.text.band,staticDataFont.editEq.band,this.bottomBox.sprite,.5);
            this.qStatus.setInput(textInput,[20,10],qInputEvent);
        }

        function gainCallback(data,val){
            data = boundaryValue(data,0,1);
            his.bntN.perY = data;
            his.gainStatus.setText(parseInt(val)/10+his.gainUnit);
            his.bntN.move();
        }

        function freqCallback(data,val){
            his.bntN.perX = his.num != 0 && his.num != 13 && his.num != 14 ? 1-data : 1-formula.eq_freq(val,true);
            his.freqStatus.setText(kbKUnit(val)+his.freqUnit);
            his.bntN.move();
        }

        function QCallback(per,val){
            his.qStatus.setText(parseInt(val)/10);
            his.bntN.QValue = parseInt(val)/10;
            his.bntN.move();
        }

        function gainInputEvent(val){
            val = boundaryValue(val,-30,30);
            sliderInputEvent(his.gainSlider,val,10);
        }

        function freqInputEvent(val){
            val = boundaryValue(val,20,20000);
            sliderInputEvent(his.freqSlider,val);
        }

        function qInputEvent(val){
            val = boundaryValue(val,.4,128);
            sliderInputEvent(his.QvalueSlider,val,10);
        }
    };

    kbBandBox.prototype.updateData = function(id,forceUpdata){
        if(id != this.id || forceUpdata){
            this.id = id;
            this.setData();
            this.gainSlider && this.gainSlider.update();
            var a = this.freqSlider;
            //if(!isPc)alert(a.data[a.dataAttr]);
            this.freqSlider && this.freqSlider.update();
            this.QvalueSlider && this.QvalueSlider.update();
            this.updateTabButton();
        }
    };

    kbBandBox.prototype.updateTabButton = function(){
        var his = this;
        if(this.num == 0){
            this.oldResponse = items[this.id].hpf.response;
        }else if(this.num == 13){
            this.oldResponse = items[this.id].hpf.method;
            kbChangeRadioButtonArrayColor(this.orderButtonArray,items[this.id].hpf.pre_order-1);
        }else if(this.num == 14){
            this.oldResponse = items[this.id].lpf.method;
            kbChangeRadioButtonArrayColor(this.orderButtonArray,items[this.id].lpf.pre_order-1);
        }else{
            this.oldResponse = items[this.id].eq[this.num-1].response;
        }
        if(this.num != 13 && this.num != 14){
            switch (this.oldResponse){
                case iirResponse.IIR_OFF :
                    kbChangeButtonColor(this.buttonArray[0],1);
                    this.funcArray[0]();
                    break;
                case iirResponse.IIR_LOWSHELVF :
                    switchBnt(1);
                    break;
                case iirResponse.IIR_EQ :
                    switchBnt(2);
                    break;
                case iirResponse.IIR_HIGHELVF :
                    switchBnt(3);
                    break;
            }
        }else{
            switch (this.oldResponse){
                case xoMode.XO_OFF :
                    kbChangeButtonColor(this.buttonArray[0],1);
                    this.funcArray[0]();
                    break;
                case xoMode.XO_BUTTERWORTH :
                    switchBnt(1);
                    break;
                case xoMode.XO_BESSEL :
                    switchBnt(2);
                    break;
                case xoMode.XO_LINKWITZ :
                    switchBnt(3);
                    break;
            }
        }
        function switchBnt(i){
            if(!his.buttonArray[i]){
                kbChangeButtonColor(his.buttonArray[0],0);
                return;
            }
            his.buttonArray[i].changeColorFunc();
            his.funcArray[i]();
        }
    };

    kbBandBox.prototype.resize = function(){
        var local = staticDataLocal.eq,topBox = local.topBox,centerBox = local.centerBox,BottomBox = local.bottomBox;
        centerBox.height = boundaryValue(centerBox.height,0);
        this.topBox.resize(topBox.x,topBox.y,topBox.width,topBox.height);
        this.centerBox.resize(centerBox.x,centerBox.y,centerBox.width,centerBox.height);
        this.bottomBox.resize(BottomBox.x,BottomBox.y,BottomBox.width,BottomBox.height);
        judgeFunc(this.gainFader);
        judgeFunc(this.freqFader);
        judgeFunc(this.QFader);
        function judgeFunc(element){
            if(element){
                element.scaleResize(1);
            }
        }
    };

    var eqPeak = function(freq,gain,Q){
        this.freq = freq;
        this.gain = gain;
        this.Q = Q;
    };

    var kbEqCircleBnt = function(boxX,boxY,color,parent,index,peaks,graphicsEqAll,feqs,type){
        this.x = boxX;
        this.y = boxY;
        this.color = color;
        this.content = staticDataString.eq.bntText[index];
        this.parent = parent;
        this.index = index;
        this.peaks = peaks;
        this.graphicsEqAll = graphicsEqAll;
        this.feqs = feqs;
        this.type = type;
        this.curveFlag = true;
        this.perX = this.x;
        this.perY = this.y;
        this.QValue = 0.707;
        this.scaleX = 0;
        this.sendFlag = false;
        this.paintEq = index == 1 ? true : false;
        this.paintGraphics();
        this.button();
    };

    kbEqCircleBnt.prototype.button = function(){
        var ringColor = staticDataColor.editEq.circleBnt,
            ringlocal = staticDataLocal.eq;
        this.ringColor = ringColor[this.index];
        this.circleBnt = new Ring(this.x,this.y,ringlocal.ringButton1,ringlocal.ringButton2,this.ringColor,this.ringColor,this.parent,.5,.8,3,null,ringColor[this.index],null,0,null);
        new kbBoxText(0,0,this.content,staticDataColor.editEq.text.circleButton,staticDataFont.editEq.circleBnt,this.circleBnt.graphics,.5);
        this.circleBnt.setRenderClearRect(this.parent,staticDataColor.editEq.lineBox);
        window.GLOBAL.parent = this.parent;
        this.moveCircle();
    };

    kbEqCircleBnt.prototype.paintGraphics = function(){
        var local = staticDataLocal.eq;
        this.actW = local.lineBoxW;
        this.actH = local.lineBoxH;
        this.graphicsEq = new PIXI.Graphics();
        this.parent.addChild(this.graphicsEq);
        pushScaleData(this.graphicsEq);
    };

    kbEqCircleBnt.prototype.moveCircle = function(){
        this.circleBnt.interactive(true);
        this.circleBnt.onEvent('mousedown', onDragStart);
        this.circleBnt.onEvent('touchstart', onDragStart);

        this.circleBnt.onEvent('mouseup', onDragEnd);
        this.circleBnt.onEvent('mouseupoutside', onDragEnd);
        this.circleBnt.onEvent('touchend', onDragEnd);
        this.circleBnt.onEvent('touchendoutside', onDragEnd);

        this.circleBnt.onEvent('mousemove', onDragMove);
        this.circleBnt.onEvent('touchmove', onDragMove);
        var his = this,diffX,diffY,dragFlag;
        function onDragStart(event){
            dragFlag = true;
            his.flag = false;
            his.data = event.data;
            var pos = his.data.getLocalPosition(his.parent);
            diffX = pos.x-his.circleBnt.x;
            diffY = pos.y-his.circleBnt.y;
            if(his.moveStartFunc){
                his.moveStartFunc(his.index);
            }
            his.timer = setInterval(function(){
                if(his.oldY != his.perY || his.oldX != his.perX){
                    his.sendFlag = true;
                    his.oldY = his.perY;
                    his.oldX = his.perX;
                }
            },GLOBAL.setIntervalTime)
        }
        function onDragEnd(){
            dragFlag = false;
            his.sendFlag = true;
            clearInterval(his.timer);
            his.send();
        }
        function onDragMove(){
            if(dragFlag){
                var pos = his.data.getLocalPosition(his.parent);
                his.perX = boundaryValue(pos.x-diffX,0,1);
                for(var i= 0,len=his.bntArray.length;i<len;i++){
                    his.bntArray[i].paintEq = i == his.index ? true : false;
                }
                if(his.index > 0 && his.index < 13){
                    his.perY = boundaryValue(pos.y-diffY,0,1);
                    his.band.freqSlider.updateData(1-his.perX);
                    his.band.gainSlider.updateData(his.perY);
                    his.band.freqSlider.setY(1-his.perX);
                    his.band.gainSlider.setY(his.perY);
                }else if(his.index == 0 || his.index == 13 || his.index == 14){
                    var val = formula.eq_freq(1-his.perX),per;
                    if(his.index == 0){
                        per = 1-formula.eq_hpf_freq0(val,true);
                    }else if(his.index == 13){
                        per = 1-formula.eq_hpf_freq13(val,true);
                    }else if(his.index == 14){
                        per = 1-formula.eq_hpf_freq14(val,true);
                    }
                    per = boundaryValue(per,0,1);
                    his.band.freqSlider.updateData(1-per);
                    his.band.freqSlider.setY(1-per);
                    his.perY = .5;
                }
                his.band.freqSlider.render();
            }
        }
    };

    kbEqCircleBnt.prototype.move = function(){
        this.circleBnt.render();
        this.circleBnt.setX(this.perX);
        this.circleBnt.setY(this.perY);
        if(this.curveFlag){
            this.moveCurve();
        }
        this.send();
    };

    kbEqCircleBnt.prototype.send = function(){
        var freqSlider = this.band.freqSlider;
        if(this.sendFlag && !equals(this.sendOldData,freqSlider.sendBaseData)){
            sendData({pktHeader : freqSlider.pktHeader,paraHeader : freqSlider.paraHeader,data : freqSlider.sendBaseData});
            this.sendOldData = objClone(freqSlider.sendBaseData);
            this.sendFlag = false;
        }
    };

    kbEqCircleBnt.prototype.setType = function(type,onCurve){
        if(type == this.type)return;
        this.type = type;
        this.feqs[this.index].setType(type);
        this.peaks[this.index].freq = 0;
        this.peaks[this.index].gain = 0;
        !onCurve && this.moveCurve();
    };

    kbEqCircleBnt.prototype.moveCurve = function(){
        var freq = this.x2freq(this.perX);
        var gain = this.y2gain(this.perY);
        var Q = this.QValue;
        this.flag = 0;
        if (this.peaks[this.index].freq != freq) {
            this.peaks[this.index].freq = freq;
            this.feqs[this.index].setFreq( freq);
            this.flag = 1;
        }

        if (this.peaks[this.index].Q != Q) {
            this.peaks[this.index].Q = Q;
            this.feqs[this.index].setQ( Q);
            this.flag = 1;
        }

        if (this.peaks[this.index].gain != gain) {
            this.peaks[this.index].gain = gain;
            this.feqs[this.index].setGain( gain);
            this.flag = 1;
        }

        if(this.flag == 1){
            this.feqs[this.index].calcFreqz(this.actW);
            this.curve();
        }
    };

    kbEqCircleBnt.prototype.curve = function(){
        var len = this.id == chID.CH_MASTER ? this.bntArray.length : 5;
        for(var i= 0,olen=this.bntArray.length;i<olen;i++){
            this.bntArray[i].graphicsEq.clear();
        }
        this.graphicsEq.beginFill(this.ringColor,.1);
        this.graphicsEq.lineStyle(2,this.ringColor);

        this.graphicsEqAll.clear();
        this.graphicsEqAll.beginFill(staticDataColor.editEq.curve,.5);
        this.graphicsEqAll.lineStyle(2,staticDataColor.editEq.curveLine);

        if(this.graphicsMainEq){
            this.graphicsMainEq.clearRect(0,0,this.eqBntActW,this.eqBntActH);
            this.graphicsMainEq.fillStyle = staticDataColor.editEq.canvasCurve;
            this.graphicsMainEq.strokeStyle = staticDataColor.editEq.canvasLine;
            this.graphicsMainEq.lineWidth = 2;
            this.graphicsMainEq.beginPath();
        }

        for (var x=0; x<this.actW; x+=1) {
            var y = 0,ys = 0;
            for (var j= 0;j<len; j++) {
                if(!this.feqs[j].freqzs[x]){
                    continue;
                }
                ys += this.feqs[j].freqzs[x];
            }
            y = this.feqs[this.index].freqzs[x];
            y = this.gain2y(y);
            ys = this.gain2y(ys);

            if (x == 0) {
                this.graphicsEq.moveTo(x-2,y);
                this.graphicsEq.moveTo(x,y);
                this.graphicsEqAll.moveTo(x-20,ys);
                this.graphicsEqAll.moveTo(x,ys);
                if(this.graphicsMainEq)this.graphicsMainEq.moveTo(0,this.eqBntActH *.5);
            }else{
                this.graphicsEq.lineTo(x,y);
                this.graphicsEqAll.lineTo(x,ys);
                if(this.graphicsMainEq)this.graphicsMainEq.lineTo(x*this.eqwM,ys*this.eqhM);
            }
        }
        this.graphicsEq.lineTo(this.actW+2,y);
        this.graphicsEq.lineTo(this.actW+2,.5*this.actH);
        this.graphicsEq.lineTo(0-2,.5*this.actH);
        this.graphicsEq.endFill();

        this.graphicsEqAll.lineTo(this.actW+10,ys);
        this.graphicsEqAll.lineTo(this.actW+10,.5*this.actH);
        this.graphicsEqAll.lineTo(0-20,.5*this.actH);
        this.graphicsEqAll.lineStyle(2,staticDataColor.editEq.curClose);
        this.graphicsEqAll.moveTo(0,.5*this.actH);
        this.graphicsEqAll.lineTo(this.actW,.5*this.actH);
        this.graphicsEqAll.endFill();
        if(this.graphicsMainEq){
            this.graphicsMainEq.lineTo(this.eqBntActW,.5*this.eqBntActH);
            this.graphicsMainEq.lineTo(0,.5*this.eqBntActH);
            this.graphicsMainEq.closePath();
            this.graphicsMainEq.stroke();
            this.graphicsMainEq.fill();
            this.mainEqSprite.render();
        }
    };

    kbEqCircleBnt.prototype.gain2y = function(y){
        return (30-y)/60*this.actH;
    };

    kbEqCircleBnt.prototype.y2gain = function(y){
        return 30-60*y;
    };

    kbEqCircleBnt.prototype.freq2x = function(freq){
        return Math.round(CalcXPos6(this.actW,20,20000,freq));
    };

    kbEqCircleBnt.prototype.x2freq = function(x){
        return Math.round(CalcFreq6(1,x,20,20000));
    };

    kbEqCircleBnt.prototype.setMoveStartFunc = function(func,bntArray){
        this.moveStartFunc = func;
        this.bntArray = bntArray;
    };

    kbEqCircleBnt.prototype.updateData = function(id){
        this.id = id;
        if(this.type == 'OFF')return;
        var fader = init.page.main.faderArray[id];
        if(id < chID.CH_MASTER){
            this.eqBntActW = fader.eqBntActW;
            this.eqBntActH = fader.eqBntActH;
            this.graphicsMainEq = fader.eqCurve.sprite.texture.baseTexture.source.getContext('2d');
            this.mainEqSprite = fader.eqCurve;
        }
        this.eqwM = this.eqBntActW/this.actW;
        this.eqhM = this.eqBntActH/this.actH;
    };

    kbEqCircleBnt.prototype.resize = function(actW,actH){
        this.actW = actW;
        this.actH = actH;
        this.eqwM = this.eqBntActW/this.actW;
        this.eqhM = this.eqBntActH/this.actH;
        if(this.paintEq){
            this.curve();
        }
    };

    var byPassMinMax = function(element,min,max){
        element.minI = min;
        element.maxI = max;
    };

    /*创建门限矩形框中的按钮；
     * 根据depthPulley,MenKanHL两个函数来跟左边的slider的数据同步
     * upButton是为了判断是上一个矩形框还是下一个矩形框而设置的标志*/
    var KBCircleBntR = function(content,CircleButT,depthPulley){
        this.content = content;
        this.CircleButT = CircleButT;
        this.depthPulley = depthPulley;
        this.CircleButTY = 1;
        this.ratioY = 1;
        this.parent = this.CircleButT.parent;
        this.createCircle();
    };

    KBCircleBntR.prototype.createCircle = function(){
        var ringColor = staticDataColor.editDyn.circleBnt[1],
            ringlocal = staticDataLocal.dyn;
        this.circle = new Ring(1,1,ringlocal.ringButton1,ringlocal.ringButton2,ringColor,ringColor,this.parent,.5,.8,3,null,ringColor,null,0,null);
        new kbBoxText(0,0,this.content,staticDataColor.editEq.text.circleButton,staticDataFont.editEq.circleBnt,this.circle.graphics,.5);
        this.moveR();
    };

    KBCircleBntR.prototype.moveR = function(){
        var his = this;
        this.circle.interactive(true);
        this.circle.onEvent('mousedown', onDragStart);
        this.circle.onEvent('touchstart', onDragStart);

        this.circle.onEvent('mouseup', onDragEnd);
        this.circle.onEvent('mouseupoutside', onDragEnd);
        this.circle.onEvent('touchend', onDragEnd);
        this.circle.onEvent('touchendoutside', onDragEnd);

        this.circle.onEvent('mousemove', onDragMove);
        this.circle.onEvent('touchmove', onDragMove);
        function onDragStart(event){
            his.dragFlag = true;
            his.data = event.data;
            his.startY = his.data.getLocalPosition(his.parent).y;
            his.styleY = his.circle.y;
            his.CircleButTY = his.CircleButT.circle.y;
            if(his.moveStartFunc){
                his.moveStartFunc(his.attrCount);
            }
            his.timer = setInterval(function(){
                his.sendFlag = true;
            },GLOBAL.setIntervalTime)
        }

        function onDragEnd(){
            his.dragFlag = false;
            his.move();
            clearInterval(his.timer);
        }

        function onDragMove(){
            if(his.dragFlag){
                his.newY = his.data.getLocalPosition(his.parent).y;
                his.newY = his.newY-his.startY+his.styleY;
                if(his.newY < 0){
                    his.newY = 0;
                }else if(his.newY > his.CircleButTY){
                    his.newY = his.CircleButTY
                }
                if(his.newY != his.oldY){
                    his.move();
                    his.depthPulley(his.newY/his.CircleButTY,his.sendFlag);
                    his.sendFlag = false;
                }
            }
        }
    };

    KBCircleBntR.prototype.move = function(){
        this.circle.setY(this.newY);
        this.ratioY = this.newY/this.CircleButT.circle.y;
        this.oldY = this.newY;
        this.CircleButT.drawPolygonFunc();
    };

    KBCircleBntR.prototype.setMoveStartFunc = function(func,count){
        this.moveStartFunc = func;
        this.attrCount = count;
    };

    var KBCircleBntD = function(content,CircleButT,depthPulley){
        this.content = content;
        this.CircleButT = CircleButT;
        this.depthPulley = depthPulley;
        this.SRT = CircleButT.SRT;
        this.parent = CircleButT.parent;
        this.createCircle();
    };

    KBCircleBntD.prototype.createCircle = function(){
        var ringColor = staticDataColor.editDyn.circleBnt[3],
            ringlocal = staticDataLocal.dyn;
        this.circle = new Ring(1,1,ringlocal.ringButton1,ringlocal.ringButton2,ringColor,ringColor,this.parent,.5,.8,3,null,ringColor,null,0,null);
        new kbBoxText(0,0,this.content,staticDataColor.editEq.text.circleButton,staticDataFont.editEq.circleBnt,this.circle.graphics,.5);
        this.moveD();
    };

    KBCircleBntD.prototype.moveD = function(){
        this.circle.interactive(true);
        this.circle.onEvent('mousedown', onDragStart);
        this.circle.onEvent('touchstart', onDragStart);

        this.circle.onEvent('mouseup', onDragEnd);
        this.circle.onEvent('mouseupoutside', onDragEnd);
        this.circle.onEvent('touchend', onDragEnd);
        this.circle.onEvent('touchendoutside', onDragEnd);

        this.circle.onEvent('mousemove', onDragMove);
        this.circle.onEvent('touchmove', onDragMove);
        var his = this;
        function onDragStart(event){
            his.dragFlag = true;
            his.data = event.data;
            his.startY = his.data.getLocalPosition(his.parent).y;
            his.styleY = his.circle.y;
            his.CircleButTY = his.CircleButT.circle.y;
            if(his.moveStartFunc){
                his.moveStartFunc(his.attrCount);
            }
            his.timer = setInterval(function(){
                his.sendFlag = true;
            },GLOBAL.setIntervalTime);
        }

        function onDragEnd(){
            his.dragFlag = false;
            clearInterval(his.timer);
            his.slider.sendData();
        }

        function onDragMove(){
            if(his.dragFlag){
                his.newY = his.data.getLocalPosition(his.parent).y;
                his.newY = his.newY-his.startY+his.styleY;
                his.newY = boundaryValue(his.newY,his.CircleButTY,his.CircleButTY+his.SRT);
                if(his.newY != his.oldY && his.newY >= his.CircleButTY && his.newY <= his.CircleButTY+his.SRT){
                    his.move();
                    his.depthPulley((his.newY-his.CircleButTY)/his.SRT,his.sendFlag);
                    his.sendFlag = false;
                }
            }
        }
    };

    KBCircleBntD.prototype.move = function(){
        this.circle.setY(this.newY);
        this.oldY = this.newY;
        this.CircleButT.SRT = this.newY-this.CircleButTY;
        this.CircleButT.positionD();
    };

    KBCircleBntD.prototype.setMoveStartFunc = function(func,count){
        this.moveStartFunc = func;
        this.attrCount = count;
    };

    var KBCircleButT = function(content,parent,depthPulley,MenKanHL,upButton,drawPolygon){
        this.content = content;
        this.parent = parent;
        this.MenKanHL = MenKanHL;
        this.SRT = .6;
        this.rPerY = 1;
        this.drawPolygonFunc = drawPolygon;
        this.createCircle(upButton);
        this.moveT();
        var his = this;
        if(upButton == 'D'){
            this.CircleButD = new KBCircleBntD('G',this,depthPulley);
            this.parent.swapChildren(this.circle.graphics,this.CircleButD.circle.graphics);
            his.move = his.KBmove;
        }else if(upButton == 'R'){
            this.CircleButR = new KBCircleBntR('R',this,depthPulley);
            this.parent.swapChildren(this.circle.graphics,this.CircleButR.circle.graphics);
            his.move = his.KBmoveR;
        }
    };

    KBCircleButT.prototype.createCircle = function(upButton){
        var ringColor = staticDataColor.editDyn.circleBnt,
            ringlocal = staticDataLocal.dyn;
        if(upButton == 'R'){
            ringColor = ringColor[0];
        }else if(upButton == 'D'){
            ringColor = ringColor[2];
        }
        this.circle = new Ring(0,1,ringlocal.ringButton1,ringlocal.ringButton2,ringColor,ringColor,this.parent,.5,.8,3,null,ringColor,null,0,null);
        new kbBoxText(0,0,this.content,staticDataColor.editEq.text.circleButton,staticDataFont.editEq.circleBnt,this.circle.graphics,.5);
    };

    KBCircleButT.prototype.moveT = function(){
        var his = this;
        his.circle.interactive(true);
        his.circle.onEvent('mousedown', onDragStart);
        his.circle.onEvent('touchstart', onDragStart);

        his.circle.onEvent('mouseup', onDragEnd);
        his.circle.onEvent('mouseupoutside', onDragEnd);
        his.circle.onEvent('touchend', onDragEnd);
        his.circle.onEvent('touchendoutside', onDragEnd);

        his.circle.onEvent('mousemove', onDragMove);
        his.circle.onEvent('touchmove', onDragMove);
        function onDragStart(event){
            his.dragFlag = true;
            his.data = event.data;
            his.startX = his.data.getLocalPosition(his.parent).x;
            his.styleX = his.circle.x;
            if(his.moveStartFunc){
                his.moveStartFunc(his.attrCount);
            }
            his.timer = setInterval(function(){
                his.sendFlag = true;
            },GLOBAL.setIntervalTime);
        }

        function onDragEnd(){
            his.dragFlag = false;
            his.move();
            clearInterval(his.timer);
        }

        function onDragMove(){
            if(his.dragFlag){
                his.newX = his.data.getLocalPosition(his.parent).x;
                his.newX = his.newX-his.startX+his.styleX;
                his.newX = boundaryValue(his.newX,0,1);
                if(his.newX != his.oldX){
                    his.move();
                }
            }
        }
    };

    KBCircleButT.prototype.KBmove = function(){
        this.MenKanHL(this.newX,this.sendFlag);
        this.sendFlag = false;
        this.kbMove();
    };

    KBCircleButT.prototype.kbMove = function(){
        this.circle.setX(this.newX);
        this.circle.setY(1-this.newX);
        this.oldX = this.newX;
        this.positionD();
    };

    KBCircleButT.prototype.positionD = function(){
        var Dy = (1-this.newX)+this.SRT;
        this.CircleButD.circle.setX(this.newX);
        this.CircleButD.circle.setY(Dy);
        this.drawPolygonFunc();
    };

    KBCircleButT.prototype.KBmoveR = function(){
        this.MenKanHL(this.newX,this.sendFlag);
        this.sendFlag = false;
        this.kbMoveR();
    };

    KBCircleButT.prototype.kbMoveR = function(){
        this.circle.setX(this.newX);
        this.circle.setY(1-this.newX);
        this.oldX = this.newX;
        var rNewY = (1-this.newX)*this.CircleButR.ratioY;
        this.CircleButR.newY = rNewY;
        this.CircleButR.circle.setY(rNewY);
        this.drawPolygonFunc();
    };

    KBCircleButT.prototype.setMoveStartFunc = function(func,count){
        this.moveStartFunc = func;
        this.attrCount = count;
    };

    /*创建DYN页面*/
    var kbEditDyn = function(parent){
        this.parent = parent;
        this.group = 0;
        this.local = staticDataLocal.dyn;
        this.color = staticDataColor.editDyn;
        this.font = staticDataFont.editDyn;
        this.string = staticDataString.editDyn;
        this.initData();
        this.createBox();
        this.paintDelay();
        this.paintMatrixLineBox();
        this.paintMatrixButton();
        this.paint();
        this.paintFreq();
    };

    kbEditDyn.prototype.initData = function(){
        this.unit = [
            [tableCh[channeTabID.gate_threshold].unit,tableCh[channeTabID.gate_depth].unit,tableCh[channeTabID.gate_attck].unit,tableCh[channeTabID.gate_hold].unit,tableCh[channeTabID.gate_release].unit],
            [tableCh[channeTabID.cps_threshold].unit,tableCh[channeTabID.cps_ratio].unit,tableCh[channeTabID.cps_attck].unit,tableCh[channeTabID.cps_hold].unit,tableCh[channeTabID.cps_release].unit]
        ];
        this.byPassButton = [];
        this.formulaAttr = [
            ['gate_threshold','gate_depth','gate_attck','gate_hold','gate_release'],
            ['cps_threshold','cps_ratio','cps_attck','cps_hold','cps_release']
        ];
    };

    kbEditDyn.prototype.setData = function(){
        var attr = ['thresholdValue','depth','startUp','keep','release'],group = GLOBAL.linkData[this.id];
        var dataAttr = [];
        if(this.id != chID.CH_MASTER){
            this.data = items[this.id].gatecps;
            dataAttr = [
                ['gate_threshold','gate_depth','gate_attck','gate_hold','gate_release'],
                ['cps_threshold','cps_ratio','cps_attck','cps_hold','cps_release']
            ];
            this.formulaAttr[0][1] = 'gate_depth';
        }else{
            this.data = items[this.id].limit;
            dataAttr = [
                ['lim_threshold','lim_ratio','lim_attck','lim_hold','lim_release'],
                ['cps_threshold','cps_ratio','cps_attck','cps_hold','cps_release']
            ];
            this.formulaAttr[0][1] = 'cps_ratio';
            setItemData(this.delaySlider,new sendHeader.adsp_delay(this.id,0),items[this.id].delay,'time',formula.adsp_delay);
        }
        for(var i=0;i<2;i++){
            for(var j=0;j<5;j++){
                setItemData(this.tabSlider[i][attr[j]].slider,new sendHeader.adsp_gatecps(this.id,group),this.data,dataAttr[i][j],formula[this.formulaAttr[i][j]]);
            }
        }
        this.bypassBntHeader = new sendHeader.adsp_gatecps(this.id,group);
        setItemData(this.byPassButton[0],new sendHeader.adsp_gatecps(this.id,group),items[this.id].gatecps,'gate_bypass');
        setItemData(this.byPassButton[1],new sendHeader.adsp_gatecps(this.id,group),items[this.id].gatecps,'cps_bypass');
    };

    kbEditDyn.prototype.createBox = function(){
        var local = this.local,color = this.color,dynPos = local.dyn,tabSliderPos = local.tabSlider,tabPos = local.tab,matrixPos = local.dynMatrix;
        this.sprite = new kbSprite(dynPos.x,dynPos.y,dynPos.width,dynPos.height,this.parent);
        new kbBoxBg(0,0,1,1,color.box,this.sprite.sprite);
        this.matrixBox = new kbSprite(matrixPos.x,matrixPos.y,matrixPos.width,matrixPos.height,this.sprite.sprite);
        new kbBoxBg(0,0,1,1,color.sliderBox,this.matrixBox.sprite);
        this.sliderBox = new kbSprite(tabSliderPos.x,tabSliderPos.y,tabSliderPos.width,tabSliderPos.height,this.sprite.sprite);
        new kbBoxBg(0,0,1,1,color.sliderBox,this.sliderBox.sprite);
        this.sliderBox.setRenderClearRect(this.sliderBox.sprite,color.sliderBox);
    };

    kbEditDyn.prototype.paint = function(){
        var local = this.local,tabPos = local.tab,his = this;
        this.sliderBoxTop = new Array(2);
        this.sliderBoxCenter = new Array(2);
        this.sliderBoxBottom = new Array(2);
        this.tabSlider = new Array(2);
        this.paintTabGate();
        this.paintTabCompressor();
        this.byPassButton[0].updateFunc = this.bypassEvent;
        this.byPassButton[1].updateFunc = this.bypassEvent;
        var content = [this.gateBox.sprite,this.compressorBox.sprite];
        var titleStyle = {
            x : tabPos.x,
            width : tabPos.width,
            height : tabPos.height,
            images : [images[imgID.edit_dyn_tab_left],images[imgID.edit_dyn_tab_left_light],images[imgID.edit_dyn_tab_right],images[imgID.edit_dyn_tab_left_light]]
        };
        var titleText = this.string.tabTitle,titleTextMaster = this.string.tabTitleMaster;
        this.tab = new kbTab(titleText,titleStyle,this.sliderBox.sprite,content,resizePage);
        this.tabIndex = 0;
        this.tab.switchBg(0);
        function resizePage(i){
            his.tabIndex = i;
            his.sliderBox.render();
            //his.tabSlider[i].thresholdValue.render();
            //his.tabSlider[i].depth.render();
            //his.tabSlider[i].startUp.scaleResize(1);
            //his.tabSlider[i].keep.scaleResize(1);
            //his.tabSlider[i].release.scaleResize(1);
        }
        this.setTabTitle = function(id){
            var textArray = id == chID.CH_MASTER ? titleTextMaster : titleText;
            for(var i= 0,len=textArray.length;i<len;i++){
                his.tab.tabButton[i].setText(textArray[i]);
            }
        }
    };

    kbEditDyn.prototype.paintFreq = function(){
        var freqBoxPos = this.local.freqBox,text = this.string.freq,textColor = this.color.text.freq,textFont = this.font.freq,his = this;
        this.freqBox = new kbSprite(freqBoxPos.x,freqBoxPos.y,freqBoxPos.width,freqBoxPos.height,this.matrixBox.sprite);
        this.frequencyArray = [];
        paintSkip(0,0,.1,1,canvasCache.faderSkip(),text[0]);
        paintSkip(.375,0,.1,1,canvasCache.faderSkip(),text[1]);
        paintSkip(.75,0,.1,1,this.color.skipCenter,text[2]);
        function paintSkip(x,y,width,height,canvas1,text){
            var skip = new kbSkip(x,y,width,height,canvas1,his.freqBox.sprite,his.color.sliderBox,true);
            his.frequencyArray.push(skip);
            new kbBoxText(x+width/2,1,text,textColor,textFont,his.freqBox.sprite,.5,0);
        }
    };

    kbEditDyn.prototype.paintMatrixButton = function(){
        var local = this.local,string = this.string,color = this.color,font = this.font,
            buttonLeftPos = local.matrixButton1,buttoncenterPos = local.matrixButton2,buttonrightPos = local.matrixButton3,text = string.matrixButton,
            textColor = color.text.matrixButton,textFont = font.matrixButton,buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]],
            ringColor = color.circleBnt,bypassEventBntColor = color.bypassClick,his = this,backgroungColor = color.bypass;
        this.bypassBnt = new kbButton(buttonLeftPos.x,buttonLeftPos.y,buttonLeftPos.width,buttonLeftPos.height,buttonImg,text[0],textColor,textFont,this.matrixBox.sprite);
        byPassMinMax(this.bypassBnt,0,4);
        this.resetBnt = new kbButton(buttoncenterPos.x,buttoncenterPos.y,buttoncenterPos.width,buttoncenterPos.height,buttonImg,text[1],textColor,textFont,this.matrixBox.sprite);
        this.resetBnt.resetFlag = 'all';
        //this.presetsBnt = new kbButton(buttonrightPos.x,buttonrightPos.y,buttonrightPos.width,buttonrightPos.height,buttonImg,text[2],textColor,textFont,this.matrixBox.sprite);
        this.bypassBnt.switchColor(bypassEvent);
        this.resetBnt.bounce();
        this.resetBnt.switchColor(resetEvent);
        //this.presetsBnt.switchColor();
        var attr = [this.circleButT.circle,this.circleButT.CircleButR.circle,this.circleButG.circle,this.circleButG.CircleButD.circle];
        function bypassEvent(button){
            var flag = button.eventFlag,i = button.minI,len = button.maxI,switchData;
            for(;i<len;i++) {
                if (flag) {
                    switchData = {
                        color1: bypassEventBntColor,
                        color2: bypassEventBntColor,
                        borderColor1: bypassEventBntColor
                    };
                    his.shapeColor = backgroungColor.backGroungEvent;
                    his.lineGColor = backgroungColor.backGroungLineEvent;
                } else {
                    switchData = {
                        color1: ringColor[i],
                        color2: ringColor[i],
                        borderColor1: ringColor[i]
                    };
                    his.shapeColor = backgroungColor.backGroung;
                    his.lineGColor = backgroungColor.backGroungLine;
                }
                attr[i].setRing(switchData);
            }
            his.drawPolygon();
            if(button.minI == 0 && button.maxI == 4){
                his.data.gate_bypass = his.byPassButton[0].sendOldData = boolean2number(flag);
                his.data.cps_bypass = his.byPassButton[1].sendOldData = boolean2number(flag);
                sendData({pktHeader : his.bypassBntHeader.pkt,paraHeader : his.bypassBntHeader.para,data : his.data});
                his.byPassButton[0].update();
                his.byPassButton[1].update();
            }else if(his.byPassButton[0].eventFlag == his.byPassButton[1].eventFlag){
                kbChangeButtonColor(his.bypassBnt,his.byPassButton[0].eventFlag);
            }
        }

        this.bypassEvent = bypassEvent;

        function resetEvent(button){
            button.resetFlag == 'all' && resetGate();
            button.resetFlag == 'all' && resetCom();
            button.resetFlag == 'com' && resetCom();
            button.resetFlag == 'gate' && resetGate();

            function resetCom(){
                if(his.id != chID.CH_MASTER){
                    items[his.id].gatecps.cps_threshold = -100;
                    items[his.id].gatecps.cps_ratio = 1000;
                }else{
                    items[his.id].limit.cps_threshold = -100;
                    items[his.id].limit.cps_ratio = 1000;
                }
                his.tabSlider[1].thresholdValue.slider.update(null,true);
                his.tabSlider[1].thresholdValue.slider.sendData();
                his.tabSlider[1].depth.slider.update(null,true);
                his.tabSlider[1].depth.slider.sendData();
            }
            function resetGate(){
                if(his.id != chID.CH_MASTER){
                    items[his.id].gatecps.gate_threshold = -300;
                    items[his.id].gatecps.gate_depth = 600;
                }else{
                    items[his.id].limit.lim_threshold = -300;
                    items[his.id].limit.lim_ratio = 600;
                }
                his.tabSlider[0].thresholdValue.slider.update(null,true);
                his.tabSlider[0].thresholdValue.slider.sendData();
                his.tabSlider[0].depth.slider.update(null,true);
                his.tabSlider[0].depth.slider.sendData();
            }
        }
    };

    kbEditDyn.prototype.paintMatrixLineBox = function(){
        var his = this,local = this.local,color = this.color,lineBoxPos = local.lineBox,text = this.string.linBoxScale,
            textColor = color.text.linBoxScale,textFont = this.font.lineBoxScale,backgroungColor = color.bypass;
        this.lineBoxWidth = local.lineBoxWidth;this.lineBoxHeight = local.lineBoxHeight,this.shapeColor = backgroungColor.backGroung,this.shapeAlpha = backgroungColor.backGroungAlpha;
        this.lineBox = new kbSprite(lineBoxPos.x,lineBoxPos.y,lineBoxPos.width,lineBoxPos.height,this.matrixBox.sprite);
        this.lineBox.setRenderClearRect(this.lineBox.sprite,color.sliderBox);
        this.scaleBox = new kbSprite(lineBoxPos.x,lineBoxPos.y,lineBoxPos.width,lineBoxPos.height,this.matrixBox.sprite);
        var lineMask = new kbBoxBg(0,0,1,1,0x123123,this.lineBox.sprite);
        this.lineBox.sprite.mask = lineMask.graphics;
        this.graphicsLine = new PIXI.Graphics();
        this.lineBox.sprite.addChild(this.graphicsLine);
        this.paintLineMatrix();
        new kbPolygon([{x:0,y:1},{x:1,y:1},{x:1,y:0}],backgroungColor.triangle,backgroungColor.triangleAlpha,this.lineBox.sprite);
        this.backGround = new PIXI.Graphics();
        this.lineBox.sprite.addChild(this.backGround);
        pushScaleData(this.backGround);
        this.lineGColor = backgroungColor.backGroungLine;
        this.circleButG = new KBCircleButT('G',this.lineBox.sprite,depthHL1,MenKanHL1,'D',drawPolygon);
        this.circleButT = new KBCircleButT('T',this.lineBox.sprite,depthHL,MenKanHL,'R',drawPolygon);
        this.circleButG.setMoveStartFunc(ringBntMoveEvent,0);
        this.circleButG.CircleButD.setMoveStartFunc(ringBntMoveEvent,1);
        this.circleButT.setMoveStartFunc(ringBntMoveEvent,2);
        this.circleButT.CircleButR.setMoveStartFunc(ringBntMoveEvent,3);
        this.circleBntArray = [this.circleButG.circle,this.circleButG.CircleButD.circle,this.circleButT.circle,this.circleButT.CircleButR.circle];
        this.circleBntArray[3].setRing({borderAlpha1 : 1});
        paintLineBoxScale();
        function paintLineBoxScale(){
            for(var i=0;i<11;i++){
                if(i == 0){
                    new kbBoxText(0,i/10,text[i],textColor,textFont,his.scaleBox.sprite,1.2,0);
                    new kbBoxText(i/10,1,text[10-i],textColor,textFont,his.scaleBox.sprite,0, -.2);
                }else if(i == 10){
                    new kbBoxText(0,i/10,text[i],textColor,textFont,his.scaleBox.sprite,1.2,1);
                    new kbBoxText(i/10,1,text[10-i],textColor,textFont,his.scaleBox.sprite,1, -.2);
                }else{
                    new kbBoxText(0,i/10,text[i],textColor,textFont,his.scaleBox.sprite,1.2,.5);
                    new kbBoxText(i/10,1,text[10-i],textColor,textFont,his.scaleBox.sprite,.5, -.2);
                }
            }
        }

        function depthHL(per,flag){
            dataProcess(per,flag,his.tabSlider[1].depth);
        }
        function depthHL1(per,flag){
            dataProcess(per,flag,his.tabSlider[0].depth);
        }
        function MenKanHL(per,flag){
            his.tX = per;
            if(his.tX < his.gX){
                his.gX = his.tX;

                his.tabSlider[0].thresholdValue.slider.updateData(1-his.gX);
                his.tabSlider[0].thresholdValue.slider.update(true);
            }
            dataProcess(per,flag,his.tabSlider[1].thresholdValue);
        }
        function MenKanHL1(per,flag) {
            his.gX = per;
            if(his.gX > his.tX){
                his.tX = his.gX;
                his.tabSlider[1].thresholdValue.slider.updateData(1-his.tX);
                his.tabSlider[1].thresholdValue.slider.update(true);
            }
            dataProcess(per,flag,his.tabSlider[0].thresholdValue);
        }

        function dataProcess(per,sendFlag,element){
            element.slider.setY(1-per);
            element.slider.updateData(1-per);
            if(sendFlag)element.slider.sendData();
            his.sliderBox.render();
        }

        function ringBntMoveEvent(count){
            for(var i=0,len=his.circleBntArray.length;i<len;i++){
                if(i == count){
                    his.circleBntArray[i].setRing({borderAlpha1 : 1});
                    var pageCount = i == 0 || i == 1 ? 0 : 1;
                    his.tab.switchBg(pageCount);
                }else{
                    his.circleBntArray[i].setRing({borderAlpha1 : 0});
                }
            }
        }

        function drawPolygon(){
            his.drawPolygon();
        }
    };

    kbEditDyn.prototype.drawPolygon = function(){
        var tBnt = this.circleButT.circle,rBnt = this.circleButT.CircleButR.circle,gBnt = this.circleButG.circle,
            dBnt = this.circleButG.CircleButD.circle,lineG = this.backGround,lineGW = 2,his = this;
        function drawPolygon(){
            var obj = {x : rBnt.x*his.lineBoxWidth,y : rBnt.y*his.lineBoxHeight};
            var obj1 = {x : tBnt.x*his.lineBoxWidth,y : tBnt.y*his.lineBoxHeight};
            var obj2 = {x : gBnt.x*his.lineBoxWidth,y : gBnt.y*his.lineBoxHeight};
            var obj3 = {x : dBnt.x*his.lineBoxWidth,y : dBnt.y*his.lineBoxHeight};
            var obj4 = {x : boundaryValue((dBnt.x-(1-dBnt.y)),0,dBnt.x)*his.lineBoxWidth,y : his.lineBoxHeight};
            var obj5 = {x : his.lineBoxWidth,y : his.lineBoxHeight};

            lineG.clear();
            lineG.beginFill(his.shapeColor,his.shapeAlpha);
            lineG.lineStyle(lineGW,his.lineGColor);
            lineG.moveTo(obj.x,obj.y);
            if(his.softKneeFlag){
                lineG.quadraticCurveTo(obj1.x,obj1.y,obj2.x,obj2.y);
            }else{
                lineG.lineTo(obj1.x,obj1.y);
            }
            lineG.lineTo(obj2.x,obj2.y);
            lineG.lineTo(obj3.x,obj3.y);
            lineG.lineTo(obj4.x,obj4.y+2);
            lineG.lineTo(obj5.x+2,obj5.y+2);
            lineG.lineTo(obj.x+2,obj.y);
            lineG.endFill();
        }
        drawPolygon();
    };

    kbEditDyn.prototype.paintLineMatrix = function(){
        var lineColor = this.color.lineBoxLine;
        this.graphicsLine.clear();
        this.graphicsLine.beginFill();
        this.graphicsLine.lineStyle(1/this.lineBoxHeight,lineColor);
        for(var i=0;i<11;i++){
            this.graphicsLine.moveTo(0,i/10);
            this.graphicsLine.lineTo(1,i/10);
        }
        this.graphicsLine.lineStyle(1/this.lineBoxWidth,lineColor);
        for(var i=0;i<11;i++){
            this.graphicsLine.moveTo(i/10,0);
            this.graphicsLine.lineTo(i/10,1);
        }
        this.graphicsLine.endFill();
    };

    kbEditDyn.prototype.paintTabCompressor = function(){
        this.compressorBox = new kbSprite(0,0,1,1,this.sliderBox.sprite);
        var titleText = this.string.cpsTabFaderTitle,defStatus = ['0dB','10','400ms','650ms','2800ms'],his = this;
        this.compressorFunc = [thresholdValueEvent,thresholdDepth,startSliderEvent,styleSliderEvent,releaseSliderEvent];
        var inputFuncArray = [thresInputEvent,ratioInputEvent,attchInputEvent,holdInputEvent,releaseInputEvent];
        this.paintTabPage(1,titleText,defStatus,this.compressorFunc,this.compressorBox.sprite,inputFuncArray);
        function thresholdValueEvent(text,val){
            if(his.id != chID.CH_MASTER){
                his.tX = 1-text;
                var mx = his.circleButT;
                if(his.tX < his.gX){
                    his.gX = his.tX;
                    his.tabSlider[0].thresholdValue.slider.updateData(1-his.gX);
                    his.tabSlider[0].thresholdValue.slider.update(true);
                }
                mx.newX = his.tX;
                mx.kbMoveR();
            }
            his.tabSlider[1].thresholdValueStatus.setText(parseInt(val)/10+his.unit[0][0]);
            his.lineBox.render();
        }
        function thresholdDepth(text,val){
            if(his.id != chID.CH_MASTER){
                text = 1-text;
                var mx =  his.circleButT.CircleButR,mxT =  his.circleButT.circle.y;
                mx.newY = mxT*text;
                mx.move();
            }
            his.tabSlider[1].depthStatus.setText(parseInt(val)/10);
            his.lineBox.render();
        }
        function startSliderEvent(y,val){
            his.tabSlider[1].startUpStatus.setText(val/10+his.unit[0][2]);
        }
        function styleSliderEvent(y,val){
            his.tabSlider[1].keepStatus.setText(val+his.unit[0][3]);
        }
        function releaseSliderEvent(y,val){
            his.tabSlider[1].releaseStatus.setText(val/10+his.unit[0][4]);
        }

        function thresInputEvent(val){
            val = boundaryValue(val,-80,20);
            sliderInputEvent(his.tabSlider[1]['thresholdValue'].slider,val,10);
        }
        function ratioInputEvent(val){
            val = boundaryValue(val,1,25);
            sliderInputEvent(his.tabSlider[1]['depth'].slider,val,10);
        }
        function attchInputEvent(val){
            val = boundaryValue(val,1,200);
            sliderInputEvent(his.tabSlider[1]['startUp'].slider,val,10);
        }
        function holdInputEvent(val){
            val = boundaryValue(val,0,5000);
            sliderInputEvent(his.tabSlider[1]['keep'].slider,val);
        }
        function releaseInputEvent(val){
            val = boundaryValue(val,10,3000);
            sliderInputEvent(his.tabSlider[1]['release'].slider,val,10);
        }
    };

    kbEditDyn.prototype.paintTabGate = function(){
        this.gateBox = new kbSprite(0,0,1,1,this.sliderBox.sprite);
        var titleText = this.string.gateTabFaderTitle,titleTextMaster = this.string.cpsTabFaderTitle,defStatus = ['0dB','10','400ms','650ms','2800ms'],his = this;
        this.gateFunc = [menXianMenKan,thresholdDepth,attckSliderEvent,holdSliderEvent,releaseSliderEvent];
        var inputFuncArray = [thresInputEvent,depthInputEvent,attchInputEvent,holdInputEvent,releaseInputEvent];
        var textTitleArray = this.paintTabPage(0,titleText,defStatus,this.gateFunc,this.gateBox.sprite,inputFuncArray);
        this.circleButG.CircleButD.slider = this.tabSlider[0].depth.slider;
        function menXianMenKan(text,val){
            if(his.id != chID.CH_MASTER){
                his.gX = 1-text;
                var mx =  his.circleButG;
                if(his.gX > his.tX){
                    his.tX = his.gX;
                    his.tabSlider[1].thresholdValue.slider.updateData(1-his.tX);
                    his.tabSlider[1].thresholdValue.slider.update(true);
                }
                mx.newX = his.gX;
                mx.kbMove();
            }
            his.tabSlider[0].thresholdValueStatus.setText(parseInt(val)/10+his.unit[1][0]);
            his.lineBox.render();
        }
        function thresholdDepth(text,val){
            if(his.id != chID.CH_MASTER){
                text = 1-text;
                var tmp = text,mx =  his.circleButG.CircleButD,mxP =  his.circleButG.circle.y;
                mx.CircleButTY = mxP;
                mx.newY = tmp*mx.SRT+mxP;
                mx.move();
            }
            his.tabSlider[0].depthStatus.setText(parseInt(val)/10+his.unit[1][1]);
            his.lineBox.render();
        }
        function attckSliderEvent(y,val){
            his.tabSlider[0].startUpStatus.setText(val/10+his.unit[1][2]);
        }
        function holdSliderEvent(y,val){
            his.tabSlider[0].keepStatus.setText(val+his.unit[1][3]);
        }
        function releaseSliderEvent(y,val){
            his.tabSlider[0].releaseStatus.setText(val/10+his.unit[1][4]);
        }

        function thresInputEvent(val){
            val = boundaryValue(val,-80,20);
            sliderInputEvent(his.tabSlider[0]['thresholdValue'].slider,val,10);
        }
        function depthInputEvent(val){
            val = boundaryValue(val,0,60);
            sliderInputEvent(his.tabSlider[0]['depth'].slider,val,10);
        }
        function attchInputEvent(val){
            val = boundaryValue(val,1,200);
            sliderInputEvent(his.tabSlider[0]['startUp'].slider,val,10);
        }
        function holdInputEvent(val){
            val = boundaryValue(val,0,5000);
            sliderInputEvent(his.tabSlider[0]['keep'].slider,val);
        }
        function releaseInputEvent(val){
            val = boundaryValue(val,10,3000);
            sliderInputEvent(his.tabSlider[0]['release'].slider,val,10);
        }

        this.setGateTitle = function(id){
            var text = id == chID.CH_MASTER ? titleTextMaster[1] : titleText[1];
            textTitleArray[1].titleUp.setText(text);
            textTitleArray[1].titleDn.setText(text);
        }
    };

    kbEditDyn.prototype.paintTabPage = function(i,titleText,defStatus,func,parent,InputEvent){
        var x = .06,width = .1,y = 0,spaceX = (1-width*5-x*2)/4,his = this,height = 1,
            local = this.local,color = this.color,font = this.font,string = this.string,
            sliderBoxTop = local.tabSliderTop,sliderBoxCenter = local.tabSliderCenter,sliderBoxBottom = local.tabSliderBottom,
            buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]],buttonW = local.tabButtonW,buttonH = local.tabButtonH,
            buttonColor = color.tabTitle,buttonFont = font.tabTitle,gainCanvas = canvasCache.eqSliderScale,buttonString = string.tabButton;
        this.tabSlider[i] = {};
        this.sliderBoxTop[i] = new kbSprite(sliderBoxTop.x,sliderBoxTop.y,sliderBoxTop.width,sliderBoxTop.height,parent);
        this.sliderBoxCenter[i] = new kbSprite(sliderBoxCenter.x,sliderBoxCenter.y,sliderBoxCenter.width,sliderBoxCenter.height,parent);
        this.sliderBoxBottom[i] = new kbSprite(sliderBoxBottom.x,sliderBoxBottom.y,sliderBoxBottom.width,sliderBoxBottom.height,parent);
        var buttonX = i == 1 ?　.02 : .2;
        this.byPassButton[i] = new kbButton(buttonX,.1,buttonW,buttonH,buttonImg,buttonString[0],buttonColor,buttonFont,this.sliderBoxTop[i].sprite);
        i == 1 ? byPassMinMax(this.byPassButton[i],0,2) : byPassMinMax(this.byPassButton[i],2,4);

        if(i == 1){
            var softKneeButton = new kbButton(.5-buttonW/2,.1,buttonW,buttonH,buttonImg,buttonString[1],buttonColor,buttonFont,this.sliderBoxTop[i].sprite);
            softKneeButton.switchColor(softKneeEvent);
            function softKneeEvent(button){
                his.softKneeFlag = button.eventFlag;
                his.drawPolygon();
            }
        }

        var resetButton = new kbButton(1-buttonW-buttonX,.1,buttonW,buttonH,buttonImg,buttonString[2],buttonColor,buttonFont,this.sliderBoxTop[i].sprite);
         resetButton.resetFlag = i == 1 ? 'com' : 'gate';
        this.byPassButton[i].switchColor(this.bypassBnt.func);
        resetButton.bounce();
        resetButton.switchColor(his.resetBnt.func);

        var attr = [['thresholdValueStatus','thresholdValue'],['depthStatus','depth'],['startUpStatus','startUp'],['keepStatus','keep'],['releaseStatus','release']],
            textTitleColor = color.text.faderTitle,textTitleFont = font.faderTitle,textStatusColor = color.text.statusTitle,textStatusFont = font.statusTitle,text = [];
        for(var j=0;j<5;j++){
            text[j] = {};
            text[j].titleUp = new kbBoxText(x+width/2,.5,titleText[j],textTitleColor,textTitleFont,this.sliderBoxTop[i].sprite,.5);
            this.tabSlider[i][attr[j][0]] = new kbBoxText(x+width/2,.65,defStatus[j],textStatusColor,textStatusFont,this.sliderBoxTop[i].sprite,.5);
            this.tabSlider[i][attr[j][1]] = new kbEditEqFader(gainCanvas,this.sliderBoxCenter[i].sprite,x,y,width,height,this.id,'eq',func[j]);
            text[j].titleDn = new kbBoxText(x+width/2,.6,titleText[j],textTitleColor,textTitleFont,this.sliderBoxBottom[i].sprite,.5);
            this.tabSlider[i][attr[j][0]].setInput(textInput,[20,10],InputEvent[j]);
            this.tabSlider[i][attr[j][1]].slider.setRenderClearRect(this.sliderBox.sprite,color.sliderBox);
            x += width+spaceX;
        }
        return text;
    };

    kbEditDyn.prototype.paintDelay = function(){
        var local = this.local,color = this.color,font = this.font,delayPos = local.delay,str = staticDataString.eq.delay,unit = 'ms',his = this;
        var textTitleColor = color.text.faderTitle,textTitleFont = font.faderTitle,textStatusColor = color.text.statusTitle,textStatusFont = font.statusTitle;
        this.delayBox = new kbSprite(delayPos.x,delayPos.y,delayPos.width,delayPos.height,this.sprite.sprite);
        new kbBoxText(0,.5,str,textTitleColor,textTitleFont,this.delayBox.sprite,0,.5);
        this.delaySlider = new kbSlider(.15,.4,.7,.2,images[imgID.main_sliderBg],delaySliderEvent,this.delayBox.sprite,'x',0,.5,images[imgID.main_smallmetal]);
        this.delayStatus = new kbBoxText(1,.5,'',textStatusColor,textStatusFont,this.delayBox.sprite, 1,.5);
        this.delaySlider.setRenderClearRect(this.delayBox.sprite,0x373740);
        function delaySliderEvent(per,val){
            his.delayStatus.setText(val/10+unit);
        }
    };

    kbEditDyn.prototype.updateData = function(id,forceUpdata){
        if(id != this.id || forceUpdata){
            var his = this,masterFlag;
            this.id = id;
            this.setData();
            this.bypassBnt.update();
            this.tX = this.gX = undefined;
            var attr = ['thresholdValue','depth','startUp','keep','release'];
            for(var i=0;i<2;i++){
                for(var j=0;j<5;j++){
                    his.tabSlider[i][attr[j]].slider.update();
                }
            }
            this.byPassButton[0].update();
            this.byPassButton[1].update();
            this.bypassEvent(this.byPassButton[0]);
            this.bypassEvent(this.byPassButton[1]);
            this.setTabTitle(id);
            this.setGateTitle(id);
            if(this.id == chID.CH_MASTER){
                masterFlag = false;
                this.delaySlider.update();
            }else{
                masterFlag = true;
            }
            this.delayBox.visible(!masterFlag);
            this.lineBox.sprite.interactiveChildren = masterFlag;
            this.bypassBnt.setDisable(masterFlag);
            this.byPassButton[0].setDisable(masterFlag);
            this.byPassButton[1].setDisable(masterFlag);
        }
    };

    kbEditDyn.prototype.resize = function(){
        var local = staticDataLocal.dyn,dynPos = local.dyn,freqBoxPos = local.freqBox,lineBoxPos = local.lineBox,
            tabPos = local.tab,tabSliderPos = local.tabSlider,matrixPos = local.dynMatrix,delayPos = local.delay,
            sliderBoxTop = local.tabSliderTop,sliderBoxCenter = local.tabSliderCenter,sliderBoxBottom = local.tabSliderBottom,
            buttonLeftPos = local.matrixButton1,buttoncenterPos = local.matrixButton2,buttonrightPos = local.matrixButton3;
        this.lineBoxWidth = local.lineBoxWidth;this.lineBoxHeight = local.lineBoxHeight;
        this.sprite.resize(dynPos.x,dynPos.y,dynPos.width,dynPos.height);
        this.sliderBox.resize(tabSliderPos.x,tabSliderPos.y,tabSliderPos.width,tabSliderPos.height);
        this.matrixBox.resize(matrixPos.x,matrixPos.y,matrixPos.width,matrixPos.height);
        this.tab.resize(tabPos.x,tabPos.y,tabPos.width,tabPos.height);
        this.bypassBnt.resize(buttonLeftPos.x,buttonLeftPos.y,buttonLeftPos.width,buttonLeftPos.height);
        this.resetBnt.resize(buttoncenterPos.x,buttoncenterPos.y,buttoncenterPos.width,buttoncenterPos.height);
        //this.presetsBnt.resize(buttonrightPos.x,buttonrightPos.y,buttonrightPos.width,buttonrightPos.height);
        this.freqBox.resize(freqBoxPos.x,freqBoxPos.y,freqBoxPos.width,freqBoxPos.height);
        this.lineBox.resize(lineBoxPos.x,lineBoxPos.y,lineBoxPos.width,lineBoxPos.height);
        this.scaleBox.resize(lineBoxPos.x,lineBoxPos.y,lineBoxPos.width,lineBoxPos.height);
        this.delayBox.resize(delayPos.x,delayPos.y,delayPos.width,delayPos.height);
        this.drawPolygon();
        this.paintLineMatrix();
        for(var i=0;i<2;i++){
            this.sliderBoxTop[i].resize(sliderBoxTop.x,sliderBoxTop.y,sliderBoxTop.width,sliderBoxTop.height);
            this.sliderBoxCenter[i].resize(sliderBoxCenter.x,sliderBoxCenter.y,sliderBoxCenter.width,sliderBoxCenter.height);
            this.sliderBoxBottom[i].resize(sliderBoxBottom.x,sliderBoxBottom.y,sliderBoxBottom.width,sliderBoxBottom.height);
            this.tabSlider[i].thresholdValue.scaleResize(1);
            this.tabSlider[i].depth.scaleResize(1);
            this.tabSlider[i].startUp.scaleResize(1);
            this.tabSlider[i].keep.scaleResize(1);
            this.tabSlider[i].release.scaleResize(1);
        }
    };

    kbEditDyn.prototype.setLock = function(flag){
        this.lock = flag;
        this.sprite.sprite.interactiveChildren = !flag;
    };

    var kbEditModel = function(parent){
        this.parent = parent;
        this.paintBox();
        this.paintEcho();
        this.paintReverb();
        this.paintTab();
    };

    kbEditModel.prototype.setData = function(){
        var echoId = chID.CH_ECHO,reverbId = chID.CH_REVERB;
        setItemData(this.tabSlider[0][0].slider,new sendHeader.adsp_echo(echoId),items[echoId].echo,'ldelay',formula.echo_delay);
        setItemData(this.tabSlider[0][1].slider,new sendHeader.adsp_echo(echoId),items[echoId].echo,'ratio',formula.echo_ratio);
        setItemData(this.tabSlider[1][0].slider,new sendHeader.adsp_reverb(reverbId),items[reverbId].reverb,'pre_delay',formula.reverb_pre_delay);
        setItemData(this.tabSlider[1][1].slider,new sendHeader.adsp_reverb(reverbId),items[reverbId].reverb,'time',formula.reverb_time);
        setItemData(this.tabSlider[1][2].slider,new sendHeader.adsp_reverb(reverbId),items[reverbId].reverb,'freq',formula.reverb_fdbk_freq);
        this.tabSlider[0][0].slider.update();
        this.tabSlider[0][1].slider.update();
        this.tabSlider[1][0].slider.update();
        this.tabSlider[1][1].slider.update();
        this.tabSlider[1][2].slider.update();
        this.echoHeader = new sendHeader.adsp_echo(echoId);
        this.reverbHeader = new sendHeader.adsp_reverb(reverbId);
        this.echoMode.setText(this.strMode[items[echoId].echo.type]);
        this.reverbRoom.setText(this.strRoom[items[reverbId].reverb.type]);
    };

    kbEditModel.prototype.paintBox = function(){
        var local = staticDataLocal.ER,bntBoxPos = local.bntBox,tabPos = local.tabBox,boxColor = staticDataColor.ER.box,erPos = staticDataLocal.eq.eq;
        this.button1Pos = local.button1;this.button2Pos = local.button2;this.button3Pos = local.button3;this.picturePos = local.picture;
        this.bntImg = [images[imgID.edit_button],images[imgID.edit_button_light]];
        this.sprite = new kbSprite(erPos.x,erPos.y,erPos.width,erPos.height,this.parent);
        this.bntBox = new kbSprite(bntBoxPos.x,bntBoxPos.y,bntBoxPos.width,bntBoxPos.height,this.sprite.sprite);
        this.tabBox = new kbSprite(tabPos.x,tabPos.y,tabPos.width,tabPos.height,this.sprite.sprite);
        new kbBoxBg(0,0,1,1,boxColor,this.bntBox.sprite);
        new kbBoxBg(0,0,1,1,boxColor,this.tabBox.sprite);
    };

    kbEditModel.prototype.paintEcho = function(){
        var local = staticDataLocal.ER,string = staticDataString.ER,color = staticDataColor.ER,textColor=color.text,font = staticDataFont.ER,
            echoPos = local.echo,picturePos = local.picture,buttonStr = string.echoButton,fontBnt = font.button,his = this;
        this.strMode = string.modeSelect;
        this.echo = new kbSprite(echoPos.x,echoPos.y,echoPos.width,echoPos.height,this.bntBox.sprite);
        this.echoMode = new kbButton(this.button1Pos.x,this.button1Pos.y,this.button1Pos.width,this.button1Pos.height,this.bntImg,this.strMode[0],textColor.button,fontBnt,this.echo.sprite);
        var triangle = new kbTriangle(.85,.3,.1,.4,0,color.triangle,color.triangle,this.echoMode.sprite);
        this.echoSelect = new kbSelectOption(this.echoMode,this.echoMode.sprite,triangle,this.strMode,selectEvent);
        this.echoSelect.paint([0x373740,0x123123],undefined,fontBnt,{y:.92,height :.8});
        this.echoPicture = new kbImg(picturePos.x,picturePos.y,picturePos.width,picturePos.height,images[imgID.echo],this.echo.sprite);
        this.echo.sprite.swapChildren(this.echoMode.sprite,this.echoPicture.sprite);
        function selectEvent(button){
            var index = button.index;
            items[chID.CH_ECHO].echo.type = index;
            sendData({pktHeader : his.echoHeader.pkt,paraHeader : his.echoHeader.para,data : items[chID.CH_ECHO].echo});
        }
    };

    kbEditModel.prototype.paintReverb = function(){
        var local = staticDataLocal.ER,string = staticDataString.ER,color = staticDataColor.ER,textColor=color.text,font = staticDataFont.ER,
            reverbPos = local.reverb,picturePos = local.picture,buttonStr = string.reverbButton,fontBnt = font.button,his = this;
        this.strRoom = string.roomSelect;
        this.reverb = new kbSprite(reverbPos.x,reverbPos.y,reverbPos.width,reverbPos.height,this.bntBox.sprite);
        this.reverbRoom = new kbButton(this.button1Pos.x,this.button1Pos.y,this.button1Pos.width,this.button1Pos.height,this.bntImg,this.strRoom[0],textColor.button,fontBnt,this.reverb.sprite);
        var triangle = new kbTriangle(.85,.3,.1,.4,0,color.triangle,color.triangle,this.reverbRoom.sprite);
        this.reverbSelect = new kbSelectOption(this.reverbRoom,this.reverbRoom.sprite,triangle,this.strRoom,selectEvent);
        this.reverbSelect.paint([0x373740,0x123123],undefined,fontBnt,{y:.92,height :.8});
        this.reverbPicture = new kbImg(picturePos.x,picturePos.y,picturePos.width,picturePos.height,images[imgID.reverb],this.reverb.sprite);
        this.reverb.sprite.swapChildren(this.reverbRoom.sprite,this.reverbPicture.sprite);
        function selectEvent(button){
            var index = button.index;
            items[chID.CH_REVERB].reverb.type = index;
            sendData({pktHeader : his.reverbHeader.pkt,paraHeader : his.reverbHeader.para,data : items[chID.CH_REVERB].reverb});
        }
    };

    kbEditModel.prototype.paintTab = function(){
        var local = staticDataLocal.ER,tabPos = local.tab,his = this;
        this.sliderBoxTop = new Array(2);
        this.sliderBoxCenter = new Array(2);
        this.sliderBoxBottom = new Array(2);
        this.tabSlider = new Array(2);
        this.tabStatus = new Array(2);
        this.paintEchoSlider();
        this.paintReverbSlider();
    };

    kbEditModel.prototype.paintEchoSlider = function(){
        var local = staticDataLocal.ER,color = staticDataColor.ER,string = staticDataString.ER,titleText = string.echoTabTitle,
            defStatus = ['1ms','0%'],func = [delayEvent,fdbkRatioEvent],his = this;
        var buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]],buttonPos = local.tap,
            buttonColor = color.text.tap,buttonFont = staticDataFont.ER.tap,buttonText = string.tap;
        var delayTime = 0;
        this.echoTabBox = new kbSprite(0,0,1,1,this.tabBox.sprite);
        this.paintSliderPage(0,titleText,defStatus,func,this.echoTabBox.sprite);
        function delayEvent(per,val){
            his.tabStatus[0][0].setText(val+'ms');
        }
        function fdbkRatioEvent(per,val){
            his.tabStatus[0][1].setText(val+'%');
        }
        this.tap = new kbButton(buttonPos.x,buttonPos.y,buttonPos.width,buttonPos.height,buttonImg,buttonText,buttonColor,buttonFont,this.sliderBoxTop[0].sprite);
        this.tap.bounce();
        this.tap.switchColor(tapEvent);
        function tapEvent(){
            var newTime = new Date().getTime();
            var delay = newTime - delayTime;
            if(delay < 500){
                items[chID.CH_ECHO].echo.ldelay = delay;
                his.tabSlider[0][0].slider.update();
                his.tabSlider[0][0].slider.sendData();
            }
            delayTime = newTime;
        }
    };

    kbEditModel.prototype.paintReverbSlider = function(){
        var titleText = staticDataString.ER.reverbTabTitle,defStatus = ['0','0','0'],
            func = [delayEvent,reverbTimeEvent,fdbkFilterEvent],his = this;
        this.reverbTabBox = new kbSprite(0,0,1,1,this.tabBox.sprite);
        this.paintSliderPage(1,titleText,defStatus,func,this.reverbTabBox.sprite);
        function delayEvent(per,val){
            his.tabStatus[1][0].setText(val+'ms');
        }
        function reverbTimeEvent(per,val){
            his.tabStatus[1][1].setText(val+'ms');
        }
        function fdbkFilterEvent(per,val){
            his.tabStatus[1][2].setText(val+'HZ');
        }
    };

    kbEditModel.prototype.paintSliderPage = function(i,titleText,defStatus,func,parent){
        var len = i==0 ? 2 : 3,x = i==0 ? .2 : .06,width = .1,y = 0,spaceX = (1-width*len-x*2)/(len-1),height = 1,
            local = staticDataLocal.ER,color = staticDataColor.ER,font = staticDataFont.ER,sliderBoxTop = local.tabSliderTop,
            sliderBoxCenter = local.tabSliderCenter,sliderBoxBottom = local.tabSliderBottom,
            gainCanvas = canvasCache.eqSliderScale;
        this.tabSlider[i] = [];
        this.tabStatus[i] = [];
        this.sliderBoxTop[i] = new kbSprite(sliderBoxTop.x,sliderBoxTop.y,sliderBoxTop.width,sliderBoxTop.height,parent);
        this.sliderBoxCenter[i] = new kbSprite(sliderBoxCenter.x,sliderBoxCenter.y,sliderBoxCenter.width,sliderBoxCenter.height,parent);
        this.sliderBoxBottom[i] = new kbSprite(sliderBoxBottom.x,sliderBoxBottom.y,sliderBoxBottom.width,sliderBoxBottom.height,parent);
        var textTitleColor = color.text.faderTitle,textTitleFont = font.faderTitle,textStatusColor = color.text.statusTitle,textStatusFont = font.statusTitle;
        for(var j=0;j<len;j++){
            new kbBoxText(x+width/2,.5,titleText[j],textTitleColor,textTitleFont,this.sliderBoxTop[i].sprite,.5);
            this.tabStatus[i][j] = new kbBoxText(x+width/2,.65,defStatus[j],textStatusColor,textStatusFont,this.sliderBoxTop[i].sprite,.5);
            this.tabSlider[i][j] = new kbEditEqFader(gainCanvas,this.sliderBoxCenter[i].sprite,x,y,width,height,this.id,'eq',func[j]);
            new kbBoxText(x+width/2,.6,titleText[j],textTitleColor,textTitleFont,this.sliderBoxBottom[i].sprite,.5);
            x += width+spaceX;
        }
    };

    kbEditModel.prototype.updateData = function(id){
        if(id != this.id){
            this.id = id;
            if(id == chID.CH_ECHO){
                this.echo.visible(true);
                this.reverb.visible(false);
                this.echoTabBox.visible(true);
                this.reverbTabBox.visible(false);
            }else if(id == chID.CH_REVERB){
                this.echo.visible(false);
                this.reverb.visible(true);
                this.echoTabBox.visible(false);
                this.reverbTabBox.visible(true);
            }
        }
    };

    kbEditModel.prototype.resize = function(){
        var local = staticDataLocal.ER,bntBoxPos = local.bntBox,tabBoxPos = local.tabBox,tabPos = local.tab,
            echoPos = local.echo,picturePos = local.picture,reverbPos = local.reverb,
            sliderBoxTop = local.tabSliderTop,sliderBoxCenter = local.tabSliderCenter,sliderBoxBottom = local.tabSliderBottom;
        this.button1Pos = local.button1;this.button2Pos = local.button2;this.button3Pos = local.button3;this.picturePos = local.picture;
        this.bntBox.resize(bntBoxPos.x,bntBoxPos.y,bntBoxPos.width,bntBoxPos.height);
        this.tabBox.resize(tabBoxPos.x,tabBoxPos.y,tabBoxPos.width,tabBoxPos.height);
        this.echo.resize(echoPos.x,echoPos.y,echoPos.width,echoPos.height);
        this.echoMode.resize(this.button1Pos.x,this.button1Pos.y,this.button1Pos.width,this.button1Pos.height);
        this.echoPicture.resize(picturePos.x,picturePos.y,picturePos.width,picturePos.height);
        this.reverb.resize(reverbPos.x,reverbPos.y,reverbPos.width,reverbPos.height);
        this.reverbRoom.resize(this.button1Pos.x,this.button1Pos.y,this.button1Pos.width,this.button1Pos.height);
        this.reverbPicture.resize(picturePos.x,picturePos.y,picturePos.width,picturePos.height);
        this.tab.resize(tabPos.x,tabPos.y,tabPos.width,tabPos.height);
        for(var i=0;i<2;i++){
            this.sliderBoxTop[i].resize(sliderBoxTop.x,sliderBoxTop.y,sliderBoxTop.width,sliderBoxTop.height);
            this.sliderBoxCenter[i].resize(sliderBoxCenter.x,sliderBoxCenter.y,sliderBoxCenter.width,sliderBoxCenter.height);
            this.sliderBoxBottom[i].resize(sliderBoxBottom.x,sliderBoxBottom.y,sliderBoxBottom.width,sliderBoxBottom.height);
            this.tabSlider[i][0].scaleResize(1);
            this.tabSlider[i][1].scaleResize(1);
        }
    };
    /*绘制edit的sends界面*/
    var kbEditSends = function(parent){
        this.parent = parent;
        this.box();
    };

    kbEditSends.prototype.setData = function(){
        var group = GLOBAL.linkData[this.id];
        setItemData(this.faderArray[0].slider,new sendHeader.adsp_mixerpan(this.id,group),items[this.id].mixerpan,'reverb_ratio',formula.sendsSlider);
        //setItemData(this.faderArray[0].mute,new sendHeader.adsp_mixerpan(this.id,group),sendsData[this.id],'mute');
        setItemData(this.faderArray[1].slider,new sendHeader.adsp_mixerpan(this.id,group),items[this.id].mixerpan,'echo_ratio',formula.sendsSlider);
        //setItemData(this.faderArray[1].mute,new sendHeader.adsp_mixerpan(this.id,group),sendsData[this.id+half],'mute');
    };

    kbEditSends.prototype.box = function(){
        var faderBoxPos = staticDataLocal.editSends.faderBox;
        this.sprite = new kbSprite(0,0,1,1,this.parent);
        this.faderBox = new kbSprite(faderBoxPos.x,faderBoxPos.y,faderBoxPos.width,faderBoxPos.height,this.sprite.sprite);
        this.fader();
    };

    kbEditSends.prototype.fader = function(){
        var len = 2,x = 0,his = this,faderBg = staticDataColor.main.faderBg,
            faderPos = staticDataLocal.editSends.fader;
        this.faderArray = new Array(len);
        for(var i=0;i<len;i++){
            var fader = new kbEditSendsFader(canvasCache.mainFaderMono,this.faderBox.sprite,x,faderPos.y,faderPos.width,faderPos.height,i,'editSends');
            fader.slider.index = i;
            fader.setSwitchFunc(faderSwitchBg,canvasCache.mainFaderMonoLight);
            this.faderArray[i] = fader;
            x += faderPos.width;
        }

        this.boxTraverse = new kbBoxTraverse(this.faderBox.sprite,(1-faderPos.width*8));

        function faderSwitchBg(id){
            for(var i = 0,len = his.faderArray.length;i<len;i++){
                if(i == id){
                    his.faderArray[i].switchBg(true);
                }else{
                    his.faderArray[i].switchBg(false);
                }
            }
        }
    };

    kbEditSends.prototype.updateData = function(id){
        if(this.id != id){
            this.id = id;
            //this.resize();
        }
        this.setData();
        this.faderArray[0].updateData();
        this.faderArray[1].updateData();
    };

    kbEditSends.prototype.resize = function(){
        var local = staticDataLocal.editSends,faderPos = local.fader,faderBoxPos = local.faderBox;
        this.faderBox = new kbSprite(faderBoxPos.x,faderBoxPos.y,faderBoxPos.width,faderBoxPos.height,this.sprite.sprite);
        for(var i= 0,len = this.faderArray.length;i<len;i++){
            this.faderArray[i].resize(faderPos.x+(faderPos.width)*i,faderPos.y,faderPos.width,faderPos.height);
        }
        this.boxTraverse.resize(1-faderPos.width*8)
    };

    kbEditSends.prototype.setLock = function(flag){
        this.lock = flag;
        this.sprite.sprite.interactiveChildren = !flag;
    };
    /*绘制edit的group界面*/
    var kbEditGroup = function(parent){
        this.parent = parent;
        this.groupButtonArray = [];
        this.groupArray = ['view','mute','solo'];
        this.box();
    };

    kbEditGroup.prototype.setData = function(){
        var group = GLOBAL.linkData[this.id];
        for(var i=0;i<3;i++){
            for(var j=0;j<4;j++){
                setItemData(this.groupButtonArray[i][j],new sendHeader.setup_group(group),groupData[this.groupArray[i]][j+1],this.id,undefined,groupData);
            }
        }
        this.clearBnt.setSendHeader(new sendHeader.setup_group(group));
        this.clearBnt.setSendData(groupData);
        this.allBnt.setSendHeader(new sendHeader.setup_group(group));
        this.allBnt.setSendData(groupData);
    };

    kbEditGroup.prototype.box = function(){
        var groupPos = staticDataLocal.editGroup.group;
        this.buttonH = staticDataLocal.editGroup.buttonH;
        this.buttonW = staticDataLocal.editGroup.buttonW;
        this.sprite = new kbSprite(groupPos.x,groupPos.y,groupPos.width,groupPos.height,this.parent);
        this.y = [.25,.4 +.3/2,.85];
        this.button();
        this.index();
        this.groupButton();
    };

    kbEditGroup.prototype.button = function(){
        var buttonImg = [images[imgID.edit_button],images[imgID.edit_button_light]],buttonH = staticDataLocal.editGroup.cleatButtonH,
            clearText = staticDataString.editGroup.clear,allText = staticDataString.editGroup.all,TextFont = staticDataFont.editGroup.title,
            TextColor = staticDataColor.editGroup.text.title,space = (1-this.buttonW*4)/ 3,his = this;
        this.clearBnt = new kbButton(this.buttonW+space,0,this.buttonW,buttonH,buttonImg,clearText,TextColor,TextFont,this.sprite.sprite);
        this.allBnt = new kbButton((this.buttonW+space)*2,0,this.buttonW,buttonH,buttonImg,allText,TextColor,TextFont,this.sprite.sprite);
        this.clearBnt.bounce();
        this.clearBnt.switchColor(clearButtonEvent);
        this.allBnt.bounce();
        this.allBnt.switchColor(allButtonEvent);
        function clearButtonEvent(){
            clearAll(0)
        }
        function allButtonEvent(){
            clearAll(1)
        }
        function clearAll(flag){
            for(var i=0;i<3;i++){
                for(var j=0;j<4;j++){
                    groupData[his.groupArray[i]][j+1][his.id] = flag;
                    kbChangeButtonColor(his.groupButtonArray[i][j],flag);
                }
            }
        }
    };

    kbEditGroup.prototype.index = function(){
        var text = staticDataString.editGroup.index,textColor = staticDataColor.editGroup.text.index,textFont = staticDataFont.editGroup.index,len = this.y.length;
        for(var i=0;i<len;i++)new kbBoxText(-.1,this.y[i] +this.buttonH/2,text[i],textColor,textFont,this.sprite.sprite,1,.5);
    };

    kbEditGroup.prototype.groupButton = function(){
        var button,x = 0,space = (1-this.buttonW*4)/ 3,his = this,
            buttonImg = [images[imgID.set_button],images[imgID.set_button_light]],
            buttonTextColor = staticDataColor.editGroup.text.group,
            buttonTextFont = staticDataFont.editGroup.group,index = 0;
        for(var i=0;i<3;i++) {
            x = 0;
            this.groupButtonArray[i] = [];
            for (var j = 0; j < 4; j++) {
                button = new kbButton(x, this.y[i], this.buttonW, this.buttonH, buttonImg,j+1,buttonTextColor,buttonTextFont,this.sprite.sprite);
                button.switchColor();
                this.groupButtonArray[i].push(button);
                x += this.buttonW+space;
            }
        }
    };

    kbEditGroup.prototype.updateData = function(id){
        if(id != this.id){
            this.id = id;
            this.setData();
            for(var i=0;i<3;i++){
                for(var j=0;j<4;j++){
                    kbChangeButtonColor(this.groupButtonArray[i][j],groupData[this.groupArray[i]][j+1][this.id]);
                }
            }
            //this.resize();
        }
    };

    kbEditGroup.prototype.resize = function(){
        var groupPos = staticDataLocal.editGroup.group;
        this.sprite.resize(groupPos.x,groupPos.y,groupPos.width,groupPos.height);
    };

    kbEditGroup.prototype.setLock = function(flag){
        this.lock = flag;
        this.sprite.sprite.interactiveChildren = !flag;
    };

    var kbInit = function(){
        this.title = new kbTitle();
        this.nav = new kbNav();
        this.page = new initPage();
        if(!isPc){
            for(var i= 0,len=iptArray.length;i<len;i++){
                iptArray[i].ipt.onfocus = function(){
                    GLOBAL.iptScale = false;
                    for(var j=0,olen=messageArray.length;j<olen;j++){
                        if(messageArray[j].sprite.visible){
                            //var messageH = messageArray[j].sprite.height,messageY = messageArray[j].sprite.y;
                            //var height = messageH > 1 ? window.innerHeight : 1,newY = (height-messageH);
                            messageArray[j].setY(0);
                            resizeAllInput();
                        }
                    }
                };
                iptArray[i].ipt.onblur = function(){
                    GLOBAL.iptScale = true;
                }
            }
        }
    };

    var setLevelSkipFunc = function(){
        var mainFader = init.page.main.faderArray,portFader = init.page.ports.faderArray,
            sendsFader = [init.page.sends.reverb.faderArray,init.page.sends.echo.faderArray],
            editSendFader = init.page.edit.sends.faderArray;
        var frequencyL2 = [],frequencyL1 = [],frequencyTop = [],frequencySends = [],frequencyEditSends = [],
            frequencyPort = init.page.edit.port.trimFader.frequency1,frequencyGc = init.page.edit.dyn.frequencyArray;
        var formulaLevels = formula.leves;
        for(var i= 0,len=mainFader.length-1;i<len;i++){
            frequencyL2.push(mainFader[i].frequency1);
            mainFader[i].frequency2 && frequencyL2.push(mainFader[i].frequency2);
        }
        for(i=0,len=chID.CH_USER;i<=len;i++){
            mainFader[i].frequencyTop1 && frequencyTop.push(mainFader[i].frequencyTop1);
        }
        mainFader[chID.CH_MASTER].frequencyTop1 && frequencyTop.push(mainFader[chID.CH_MASTER].frequencyTop1);
        for(var a= 0,olen=sendsFader.length;a<olen;a++){
            frequencySends[a] = [];
            for(i= 0,len=sendsFader[a].length;i<len;i++){
                frequencySends[a].push(sendsFader[a][i].frequency1);
            }
        }
        for(i= 0,len=portFader.length;i<len;i++){
            frequencyL1.push(portFader[i].frequency1);
            portFader[i].frequency2 && frequencyL1.push(portFader[i].frequency2);
        }
        for(i= 0,len=editSendFader.length;i<len;i++){
            frequencyEditSends.push(editSendFader[i].frequency1);
        }
        frequencyL1.push(mainFader[mainFader.length-1].frequency1);
        frequencyL1.push(mainFader[mainFader.length-1].frequency2);
        function main(){
            var mainVisible = ctx.main.sprite.visible,sendsVisible = ctx.sends.sprite.visible,editSendId = init.page.edit.sends.id,
                editVisible = ctx.edit.sprite.visible,editSendVisible = init.page.edit.sends.sprite.sprite;
            if(!mainVisible && !sendsVisible && (!editVisible || !editSendVisible))return;
            var mainLevelsData = levelsData.l2;
            for(var i= 0,len=frequencyL2.length;i<len;i++){
                if(mainVisible){
                    frequencyL2[i].cut(0,formulaLevels(mainLevelsData[i],true));
                }
                if(sendsVisible && i<=chID.CH_8){
                    frequencySends[0][i].cut(0,formulaLevels(mainLevelsData[i],true));
                    frequencySends[1][i].cut(0,formulaLevels(mainLevelsData[i],true));
                }
                if(editVisible && editSendVisible && editSendId == i){
                    frequencyEditSends[0].cut(0,formulaLevels(mainLevelsData[i],true));
                    frequencyEditSends[1].cut(0,formulaLevels(mainLevelsData[i],true));
                }
            }
        }
        function port(){
            if(!ctx.ports.sprite.visible && !ctx.main.sprite.visible)return;
            var l1LevelsData = levelsData.l1;
            for(var i= 0,len=frequencyL1.length;i<len;i++){
                frequencyL1[i] !== '' && frequencyL1[i].cut(0,formulaLevels(l1LevelsData[i],true));
            }
            if(init.page.edit.port.sprite.sprite.visible && ctx.edit.sprite.visible){
                var id = init.page.edit.port.id;
                frequencyPort.cut(0,formulaLevels(l1LevelsData[id],true));
            }
        }
        function dyn(){
            var editDynVisible = init.page.edit.dyn.sprite.sprite.visible,editVisible = ctx.edit.sprite.visible,mainVisible = ctx.main.sprite.visible,dynLevelsData,
                tabIndex = init.page.edit.dyn.tabIndex;
            if(editDynVisible && editVisible){
                var id = init.page.edit.dyn.id;
                if(id != chID.CH_MASTER){
                    dynLevelsData = levelsData.gc[id];
                }else if(GLOBAL.hl){
                    dynLevelsData = levelsData.lm[1][0];
                }else{
                    dynLevelsData = levelsData.lm[0][0];
                }
                if(tabIndex == 0){
                    dynLevelsData = [dynLevelsData[0],dynLevelsData[1]+dynLevelsData[0],-dynLevelsData[1]-1500];
                }else{
                    dynLevelsData = [dynLevelsData[2],dynLevelsData[3]+dynLevelsData[2],-dynLevelsData[3]-1500]
                }
                for(var i= 0,len=3;i<len;i++){
                    if(i == 2){
                        frequencyGc[i].cut(0,formulaLevels(dynLevelsData[i],true),1,0);
                    }else{
                        frequencyGc[i].cut(0,formulaLevels(dynLevelsData[i],true));
                    }
                }
            }
            if(mainVisible){
                for(i=0,len=frequencyTop.length;i<len;i++){
                    if(i != len-1){
                        dynLevelsData = levelsData.gc[i];
                    }else if(GLOBAL.hl){
                        dynLevelsData = levelsData.lm[1][0];
                    }else{
                        dynLevelsData = levelsData.lm[0][0];
                    }
                    if(tabIndex == 0){
                        dynLevelsData = dynLevelsData[1]+dynLevelsData[0];
                    }else{
                        dynLevelsData = dynLevelsData[2]+dynLevelsData[3];
                    }
                    frequencyTop[i].cut(0,formulaLevels(dynLevelsData,true));
                }
            }
        }
        return {
            main : main,
            port : port,
            dyn : dyn
        }
    };

    var loadImages = function(){
        images = ['./images/main-scene.png','images/main-scene-light.png','./images/main-smallbutton-background.png','./images/main-smallbutton-left.png','./images/main-smallbutton-left-light.png',
            './images/main-smallbutton-middle.png', './images/main-smallbutton-middle-light.png','./images/main-smallbutton-right.png','./images/main-smallbutton-right-light.png',
            './images/main-bigbutton-background.png','./images/main-mainbutton.png','./images/main-mainbutton-light.png','./images/main-viewbutton-left.png',
            './images/main-viewbutton-left-light.png','./images/main-viewbutton-middle.png','./images/main-viewbutton-middle-light.png','./images/main-viewbutton-right.png',
            './images/main-viewbutton-right-light.png','./images/main-inputbutton-left-light.png','./images/main-inputbutton-middle-light.png','./images/main-inputbutton-right-light.png',
            './images/main-smallmetal.png','./images/main-mute.png','./images/main-mute-light.png','./images/main-solo-light.png','./images/main-bigmetal.png','./images/master-red-bigmetal.png','./images/main-informationbutton.png',
            './images/main-informationbutton-light.png','./images/main-Display.png','./images/main-sliderBg.png','./images/main-flute.jpg','./images/main-controlBg.png','./images/arrawOpen.png',
            './images/arrawClose.png','./images/fbcButton.jpg','./images/tabButtonLeft.png','./images/tabButtonLeft_light.png','./images/tabButtonRight.png',
            './images/tabBackground.png','./images/edit-button.png','./images/edit-button-light.png','./images/input-background.png','./images/favicon.ico','./images/set-button-background.png',
            './images/edit-dyn-tab-background.png', './images/edit-dyn-tab-left.png','./images/edit-dyn-tab-left-light.png','./images/edit-dyn-tab-right.png',
            './images/upgrade-button.png','./images/sends-tab-background.png','./images/set-tab-left.png','./images/set-tab-left-light.png','./images/set-tab-right.png',
            './images/edit-eq-tab-left.png','./images/edit-eq-tab-left-light.png','./images/edit-eq-tab-right.png','./images/edit-eq-tab-last.png','./images/edit-eq-tab-last-light.png',
            './images/set-radiobutton-left-light.png','./images/set-button.png','./images/set-button-light.png','./images/lock.png','./images/wifi.png','./images/set-radioButton-middle-light.png',
            './images/set-radioButton-right-light.png','./images/set-upgrade-progress.png','./images/lock-white.png','./images/user-head.png','./images/echo.jpg','./images/reverb.jpg'
        ];
        GLOBAL.sureButtonImg = [images[imgID.set_button],images[imgID.set_button_light]];
        PIXI.loader
            .add(images)
            .load(onAssetsLoaded)
            .on('progress',progressEvent);
        function progressEvent(target){
            var per = target.progress,progress = ctx.loadPage.progress;
            progressFunc(per/100);
            function progressFunc(per){
                var canvas = kbSetUpgradeProgress(450*per,10,staticDataColor.setUpgrade.progress);
                progress.progress.sprite.texture = new PIXI.Texture.fromCanvas(canvas);
                progress.setCursor({width : per});
            }
        }
        function onAssetsLoaded(){
            ctx.loadPage.visible(false);
            ctx.app.stop();
            kbLog('log','images loaded!');
            kbUpload();
            init = new kbInit();
            if(webPowerControl.SOCKET){
                //createWebList(url);
                createHttpRequest();
            }else{
                createTestData();
            }
            GLOBAL.disNetMessage = new kbMessage({title : '网络断开提示',noButton : true});
            init.page.set.settings.setLocalSettings();
            faderSwitchBg(0);
            window.GLOBAL.setLevelSkip = setLevelSkipFunc();
            window.appRender();
        }
    };

    loadImages();

    canvasCache = canvasCacheObj();
    ctx = new kbStage();
    window.appRender = function(){
        fixedScale();
        ctx.app.render();
    };
    var setBypassUpdate = function(){
        var eqPage = init.page.edit.eq,dynPage = init.page.edit.dyn;
        for(var i=0;i<=chID.CH_MASTER;i++){
            var adspType = (i >=chID.CH_USER && i<= chID.CH_MASTER) ? sendTypeID.TYPE_DSP_IIR_STEREO : sendTypeID.TYPE_DSP_IIR_MONO;
            var adspXoType = (i >=chID.CH_USER && i<= chID.CH_MASTER) ? sendTypeID.TYPE_DSP_XO_STEREO : sendTypeID.TYPE_DSP_XO_MONO;
            if(i != chID.CH_MASTER){
                for(var j=0;j<4;j++){
                    updateWidgetArray.push({button : bypassEvent,type : adspType,ch : i,index : j,pf : 0,data : items[i].eq[j],attr : 'bypass',hl : 0});
                }
                updateWidgetArray.push({button : bypassEvent,type : adspXoType,ch : i,index : 0,pf : 0,data : items[i].hpf,attr : 'bypass',hl : 0});
                if(i <= chID.CH_USER){
                    setItemData(dynPage.byPassButton[0],new sendHeader.adsp_gatecps(i,0),items[i].gatecps,'gate_bypass');
                    setItemData(dynPage.byPassButton[1],new sendHeader.adsp_gatecps(i,0),items[i].gatecps,'cps_bypass');
                }
            }else{
                for(j=0;j<12;j++){
                    updateWidgetArray.push({button : bypassEvent,type : adspType,ch : i,index : j,pf : 0,data : items[i].eq[j],attr : 'bypass',hl : 1});
                    updateWidgetArray.push({button : bypassEvent,type : adspType,ch : i,index : j,pf : 0,data : itemsOut[0][0].eq[j],attr : 'bypass',hl : 0});
                }
                updateWidgetArray.push({button : bypassEvent,type : adspXoType,ch : i,index : 0,pf : 1,data : items[i].hpf,attr : 'bypass',hl : 1});
                updateWidgetArray.push({button : bypassEvent,type : adspXoType,ch : i,index : 0,pf : 0,data : items[i].lpf,attr : 'bypass',hl : 1});
                updateWidgetArray.push({button : bypassEvent,type : adspXoType,ch : i,index : 0,pf : 1,data : itemsOut[0][0].hpf,attr : 'bypass',hl : 0});
                updateWidgetArray.push({button : bypassEvent,type : adspXoType,ch : i,index : 0,pf : 0,data : itemsOut[0][0].lpf,attr : 'bypass',hl : 0});
            }
        }
        function bypassEvent(data){
            if(data.ch == eqPage.id){
                eqPage.updateBypass();
            }
        }
    };

    window.GLOBAL.initStart = function() {
        init.page.updateDate();
        init.title.updateData();
        pageInteractive(true);
        resizeMain();
        setBypassUpdate();
        window.appRender();
    }
})();
/*********************************************
     js:  the javascript object
     bin: the ArrayBuffer object
     
    after finishing, the kbBinary should be 
    placed into GLOBAL obj
**********************************************/
var url;
if(webPowerControl.URL){
    url = ["ws://192.168.2.211:54321"];
}else{
    url = ["ws://192.168.2.210:7791"];
}
var MAX_USER = 20,MAX_SCENE = 20,MAX_LOCK = 50;
var port = '9191';
var items = [];
var ipData = [];
var ipList = [];
var userData = [];
var descData = [];
var webList = [];
var wlanData = [];
for(var i=0;i<6;i++){
    wlanData[i] = {
        wsec : {
            ssid : i,
            crypto : 0
        },
        stat : {
            quality : 100
        }
    }
}
var levelsData = {};
var myWeb,upload,networkData;
var kbBinary ={};
function myWebs(url,fn) {
    this.url = url;
    this.name = 'myWebs';
    this.open = _open;
    this.reopen = _reopen;
    this.close = _close;
    this.send = _send;
    this.state = _state;
    this.setcb = _setcb;
    this.closeCount = 0;
    this.maxConnect = 100;
    var his = this;
    this.open();
    function _open() {
        kbLog('log',"____ url: %s\n", his.url);
        his.ws = new WebSocket(his.url);
        his.ws.binaryType = 'arraybuffer';
        his.ws.onopen = _onopen;
        his.ws.onclose = _onclose;
        his.ws.onmessage = _onmsg;
        his.ws.onerror = _onerror;
    }

    function _reopen() {
        _close();
        _open(his.url);
        GLOBAL.disNetMessage.Dispear();
    }

    function _close() {
        his.ws.close();
    }

    function _send(msg) {
        if (his.ws.readyState != WebSocket.OPEN)
            return;
        his.ws.send(msg);
    }

    function _state() {
        return his.ws.readyState;
    }

    function _setcb(tp, f) {
        switch (tp) {
            case "open":
                his.ws.onopen = f;
                break;

            case "close":
                his.ws.onclose = f;
                break;

            case "msg":
                his.ws.onmessage = f;
                break;

            case "err":
                his.ws.onerror = f;
                break;
        }
    }

    function _onopen(evt) {
        his.closeCount = 0;
        pageInteractive(true);
        kbLog('log',"___ ws.onopen");
    }

    function _onclose(evt) {
        var message = GLOBAL.disNetMessage;
        if(true){
            message.setContent({text : '网络断开，3s后重新连接'});
            setTimeout(_reopen, 3000);
            his.closeCount += 1;
        }else{
            message.setContent({text : '重连失败，请刷新'});
        }
        pageInteractive(false);
        message.Display();
    }

    function _onmsg(evt) {
        if (evt.data instanceof ArrayBuffer) {
            fn(evt.data);
            var pkt = new Uint8Array(evt.data);
            var val = pkt[1] << 8 | pkt[0];
        }
    }

    function _onerror(evt) {
        kbLog('log',"___ onerror");
        //write_scr('<span style="color: red;">ERROR:</span> '+ evt.data);
    }

    function _pong() {

    }
}

function appendBuffer( buffer1, buffer2 ) {
    var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
    tmp.set( new Uint8Array( buffer1 ), 0 );
    tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
    return tmp.buffer;
}

function fRandomBy(){
    return Math.random()*(200+1500)-1500;
}

//the process for device infomations, including address
kbBinary.dev_info = function() {

    this.js2bin = function (js,buffer,len) {
        var ipLen = js.length;
        for(var i=0;i<ipLen;i++){
            var info = new kbdevInfo2buffer(js,buffer,len);
            len = info.len;
            buffer = info.buffer;
        }
        return {buffer : buffer,len : len};
    };

    this.bin2js = function (bin,len,dLen) {
        var data = new kbdevInfo(bin,len);
        len = data.len;
        return {data : data.ip,len : len};
    };
};

kbBinary.net_info = function() {

    this.js2bin = function (js,buffer,len) {
        var ipLen = js.length;
        for(var i=0;i<ipLen;i++){
            var info = new kbNetInfo2buffer(js,buffer,len);
            len = info.len;
            buffer = info.buffer;
        }
        return buffer;
    };

    this.bin2js = function (bin,len,dLen) {
        var data = [];
        var oLen = dLen/103;
        for(var i=0;i<oLen;i++){
            var info = new kbNetInfo(bin,len);
            data[i] = info;
            len = info.len;
        }
        return {data : data,len : len};
    }
};

kbBinary.eth_info = function() {

    this.js2bin = function (js,buffer,len) {
        var ipLen = js.length;
        for(var i=0;i<ipLen;i++){
            var info = new kbEthInfo2buffer(js,buffer,len);
            len = info.len;
            buffer = info.buffer;
        }
        return buffer;
    };

    this.bin2js = function (bin,len,dLen) {
        var Len = len;
        var ipLen = dLen/90;
        for(var i=0;i<ipLen;i++){
            var info = new kbEthInfo(bin,Len);
            Len = info.len;
            ipData.push(info);
        }
    }
};

kbBinary.ip_info = function() {

    this.js2bin = function (js,buffer,len) {
        var info = new kbIpInfo2buffer(js,buffer,len);
        len = info.len;
        buffer = info.buffer;
        return {buffer : buffer,len : len};
    };

    this.bin2js = function (bin,len,dLen) {
        var info = new kbIpInfo(bin,Len);
        len = info.len;
        return {data : info,len : len};
    }
};

kbBinary.ap_hdr = function(){
    item_attr.call(this,kbApHdr,kbApHdr2buffer);
};

kbBinary.route = function(){

    this.js2bin = function(js,buffer,len){
        var data;
        for(var i= 0,oLen=chID.CH_IN_NUM;i<oLen;i++){
            data = new kbRoute2buffer(js.in[i],buffer,len);
            buffer = data.buffer;
            len = data.len;
        }
        for(i= 0,oLen=chID.CH_FX_NUM;i<oLen;i++){
            data = new kbRoute2buffer(js.in[i],buffer,len);
            buffer = data.buffer;
            len = data.len;
        }
        for(i= 0,oLen=chID.CH_OUT_NUM;i<oLen;i++){
            data = new kbRoute2buffer(js.in[i],buffer,len);
            buffer = data.buffer;
            len = data.len;
        }

        return {buffer : buffer,len : len};
    };

    this.bin2js = function(bin,len){
        var route = {},data;
        route.in = new Array(chID.CH_IN_NUM);
        route.fx = new Array(chID.CH_FX_NUM);
        route.out = new Array(chID.CH_OUT_NUM);
        for(var i= 0,oLen=chID.CH_IN_NUM;i<oLen;i++){
            data = new kbRoute(bin,len);
            route.in[i] = data.val;
            len = data.len;
        }
        for(i= 0,oLen=chID.CH_FX_NUM;i<oLen;i++){
            data = new kbRoute(bin,len);
            route.fx[i] = data.val;
            len = data.len;
        }
        for(i= 0,oLen=chID.CH_OUT_NUM;i<oLen;i++){
            data = new kbRoute(bin,len);
            route.out[i] = data.val;
            len = data.len;
        }

        return {data : route,len : len};
    }
};

kbBinary.routeIn = function(){

    this.js2bin = function(js,buffer,len){

    };

    this.bin2js = function(bin,len){
        var data = new kbRouteIn(bin,len);
        return data;
    }
};

kbBinary.routeOut = function(){

    this.js2bin = function(js,buffer,len){

    };

    this.bin2js = function(bin,len){
        var data = new kbRouteOut(bin,len);
        return data;
    }
};

kbBinary.ap_auth = function(){
    item_attr.call(this,kbApAuth,kbApAuth2buffer);
};

kbBinary.userAuth = function(){

    this.js2bin = function(js,buffer,len){

    };

    this.bin2js = function(bin,len){
        var data = new kbUserAuth(bin,len);
        return data;
    }
};

kbBinary.fileData = function(){

    this.js2bin = function(js,buffer,len){

    };

    this.bin2js = function(bin,len){
        var data = new kbFileData(bin,len);
        return data;
    }
};

kbBinary.askfor = function(){

    this.js2bin = function(js,buffer,len){

    };

    this.bin2js = function(bin,len){
        var data = new kbAskfor(bin,len);
        return data;
    }
};

/*******************************/
kbBinary.header = function() {

    this.js2bin  = function (js) {
        var hdr = js.pktHeader,tmp;
        var bufferLen = hdr.type == Type.TYPE_USER_FILE ? 21 : hdr.dlen;
        this.buffer = new ArrayBuffer(bufferLen);
        this.binHeader = new kbheader2buffer(hdr,this.buffer,0);
        var hdrLen = this.binHeader.len;
        var buffer = this.binHeader.buffer;
        switch(hdr.type){
            case Type.TYPE_USER_NET :
                tmp = binary.net_hdr.js2bin(js.data,buffer,hdrLen);
                buffer = tmp.buffer;
                break;

            case Type.TYPE_USER_PARA :
                tmp = binary.para.js2bin(js,buffer,hdrLen);
                buffer = tmp.buffer;
                break;

            case Type.TYPE_USER_FILE :
                js.data.dlen = js.buffer.byteLength;
                tmp = new kbFileData2buffer(js.data,buffer,hdrLen);
                buffer = appendBuffer(tmp.buffer,js.buffer);
                break;
        }
        return buffer;
    };

    this.bin2js = function (bin) {
        var tmp;
        this.hdr = new kbheader(bin);
        /*判断type的值*/
        if(this.hdr.type != Type.TYPE_DEVICE_STATUS){
            kbLog('log','header:',this.hdr);
        }
        if(this.hdr.isAck == 1){
            tmp = binary.ack.bin2js(bin,this.hdr.len,true);
            kbLog('log',tmp);
            var data = tmp.data;
            GLOBAL.ackFunc && GLOBAL.ackFunc(data);
            switch(data.errID){
                case errorTypeID.ERR_PKT_LACK:case errorTypeID.ERR_PKT_REPEAT :
                    upload.sliceFile(data.index);
                    break;
                case errorTypeID.ERR_PKT_TIMEOUT :
                    upload.resend();
                    break;
            }
            return;
        }
        switch(this.hdr.type) {
            case Type.TYPE_DEVICE_INFO:
                tmp = binary.dev_info.bin2js(bin,this.hdr.len,this.hdr.dlen);
                ipList = tmp.data;
                init.page.set.network.setIp12(ipList.mst.eth,ipList.mst.wl);
                kbLog('log','device_info:',tmp);
                break;

            case Type.TYPE_DEVICE_NET:
                tmp = binary.net_hdr.bin2js(bin,this.hdr.len,this.hdr.dlen);
                tmp = binary.net_info.bin2js(bin,tmp.len,tmp.data.dlen);
                kbLog('log','net_info:',tmp);
                wlanData = [];
                for(var i= 0,len=tmp.data.length;i<len;i++){
                    wlanData[i] = tmp.data[i];
                }
                init.page.set.network.updateList();
                break;

            case Type.TYPE_DEVICE_STATUS:
                tmp = binary.dsp_levels.bin2js(bin,this.hdr.len,this.hdr.dlen);
                break;

            case Type.TYPE_DEVICE_PARAS:
                binary.paras.bin2js(bin,this.hdr.len,this.hdr.dlen);
                break;

            case Type.TYPE_USER_PARAS:
                tmp = binary.paras.bin2js(bin,this.hdr.len,this.hdr.dlen);
                break;

            case Type.TYPE_USER_PARA:
                tmp = binary.para.bin2js(bin,this.hdr.len,true);
                break;

            case Type.TYPE_DEVICE_ACK:
                tmp = binary.ack.bin2js(bin,this.hdr.len,true);
                break;

            default :
                kbLog('error',"header.bin2js未匹配type:",this.hdr.type);
        }
    }
};

kbBinary.para = function(){

    this.js2bin = function(js,buffer,len){
        var hdr = js.paraHeader,tmp;
        var para = new kbpara2buffer(hdr,buffer,len);
        len = para.len;
        buffer = para.buffer;

        switch(hdr.type){
            case sendTypeID.TYPE_DSP_GAIN_MONO:case sendTypeID.TYPE_DSP_GAIN_STEREO:
                tmp = binary.dsp_gain.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_PANGAIN:
                tmp = binary.dsp_panGain.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_MIXERPAN:
                tmp = binary.dsp_mixerpan.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_SOLO:
                tmp = binary.dsp_solo.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_IIR_MONO:case sendTypeID.TYPE_DSP_IIR_STEREO:
                tmp = binary.dsp_iir.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_XO_MONO:case sendTypeID.TYPE_DSP_XO_STEREO:
                tmp = binary.dsp_xo.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_GATECPS_MONO:case sendTypeID.TYPE_DSP_GATECPS_STEREO:
                tmp = binary.dsp_gatecps.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_LIMITER :
                tmp = binary.dsp_limiter.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_SETUP_GROUP:
                tmp = binary.setup_group.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_SETUP_SETT:
                tmp = binary.setup_sett.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_USER:
                if(buffer.byteLength == 91){
                    tmp = binary.sign.js2bin(js.data,buffer,len);
                }else{
                    tmp = binary.user.js2bin(js.data,buffer,len);
                }
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_SCENE:
                tmp = binary.scene_hdr.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_FDBK :
                tmp = binary.dsp_fdbk.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_NAME :
                tmp = binary.name.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_PPOWER :
                tmp = binary.dsp_ppower.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_ECHO :
                tmp = binary.dsp_echo.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_REVERB :
                tmp = binary.dsp_reverb.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_DELAY :
                tmp = binary.dsp_delay.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            case sendTypeID.TYPE_DSP_MIXERMODE :
                tmp = binary.dsp_mixermode.js2bin(js.data,buffer,len);
                buffer = tmp.buffer;
                break;

            default :
                kbLog('error','未匹配到type值！');
        }

        return {buffer : buffer};
    };

    this.bin2js = function(bin,len,flag){
        if(!flag){
            var data = {};
            var tmp = binary.dsp.bin2js(bin,len);
            data.dsp = tmp.data;
            len = tmp.len;

            tmp = binary.setup.bin2js(bin,len);
            data.setup = tmp.data;
            len = tmp.len;

            return {data : data,len : len};
        }else{
            var header = new kbpara(bin,len);
            len = header.len;
            var ch = header.ch;
            switch(header.type){
                case sendTypeID.TYPE_DSP_NAME :
                    tmp = binary.name.bin2js(bin,len);
                    items[ch].name.name = tmp.data;
                    init.page.main.faderArray[ch].ch.setText(tmp.data);
                    break;

                case sendTypeID.TYPE_DSP_GAIN_MONO:case sendTypeID.TYPE_DSP_GAIN_STEREO:
                    tmp = binary.dsp_gain.bin2js(bin,len);
                    window.GLOBAL.updateWidget(header.type,header.ch,header.index,header.pf,tmp.data,header.hl);
                    break;

                case sendTypeID.TYPE_DSP_PANGAIN:
                    tmp = binary.dsp_panGain.bin2js(bin,len);
                    window.GLOBAL.updateWidget(header.type,header.ch,header.index,header.pf,tmp.data,header.hl);
                    break;

                case sendTypeID.TYPE_DSP_IIR_MONO:case sendTypeID.TYPE_DSP_IIR_STEREO:
                    tmp = binary.dsp_iir.bin2js(bin,len);

                    window.GLOBAL.updateWidget(header.type,header.ch,header.index,header.pf,tmp.data,header.hl);
                    break;

                case sendTypeID.TYPE_DSP_XO_MONO:case sendTypeID.TYPE_DSP_XO_STEREO:
                    tmp = binary.dsp_xo.bin2js(bin,len);
                    window.GLOBAL.updateWidget(header.type,header.ch,header.index,header.pf,tmp.data,header.hl);
                    break;

                case sendTypeID.TYPE_DSP_GATECPS_MONO:case sendTypeID.TYPE_DSP_GATECPS_STEREO:
                    tmp = binary.dsp_gatecps.bin2js(bin,len);
                    window.GLOBAL.updateWidget(header.type,header.ch,header.index,header.pf,tmp.data,header.hl);
                    break;

                case sendTypeID.TYPE_DSP_LIMITER:
                    tmp = binary.dsp_limiter.bin2js(bin,len);
                    window.GLOBAL.updateWidget(header.type,header.ch,header.index,header.pf,tmp.data,header.hl);
                    break;

                case sendTypeID.TYPE_DSP_MIXERPAN:
                    tmp = binary.dsp_mixerpan.bin2js(bin,len);
                    window.GLOBAL.updateWidget(header.type,header.ch,header.index,header.pf,tmp.data,header.hl);
                    break;

                case sendTypeID.TYPE_DSP_PPOWER:
                    tmp = binary.dsp_ppower.bin2js(bin,len);
                    window.GLOBAL.updateWidget(header.type,header.ch,header.index,header.pf,tmp.data,header.hl);
                    break;

                case sendTypeID.TYPE_DSP_DELAY:
                    tmp = binary.dsp_delay.bin2js(bin,len);
                    window.GLOBAL.updateWidget(header.type,header.ch,header.index,header.pf,tmp.data,header.hl);
                    break;

                case sendTypeID.TYPE_DSP_FDBK:
                    tmp = binary.dsp_fdbk.bin2js(bin,len);
                    items[ch].fdbk = tmp.data;
                    var fdbk = init.page.edit.port.FreqShift;
                    if(fdbk.id == ch)fdbk.updateData(ch);
                    break;

                case sendTypeID.TYPE_DSP_SOLO :
                    tmp = binary.dsp_solo.bin2js(bin,len);
                    soloData = tmp.data.on;
                    var faderArray = init.page.main.faderArray;
                    for(var i= 0,olen=faderArray.length-1;i<olen;i++){
                        faderArray[i].updateData();
                    }
                    break;

                case sendTypeID.TYPE_SCENE :
                    tmp = binary.scene_hdr.bin2js(bin,len);
                    if(tmp.data.opc == opcID.OPC_EXPORT){
                        saveAsFile(tmp.data, tmp.data.desc.name+'.txt');
                    }
                    break;

                case sendTypeID.TYPE_SETUP_SETT :
                    tmp = binary.setup_sett.bin2js(bin,len);
                    settingData = tmp.data;
                    init.page.set.settings.updateData();
                    break;

                case sendTypeID.TYPE_DSP_MIXERMODE :
                    tmp = binary.dsp_mixermode.bin2js(bin,len);
                    miscData.mixermode = tmp.data;
                    init.page.set.settings.updateData();
                    break;

                case sendTypeID.TYPE_USER :
                    tmp = binary.sign.bin2js(bin,len);
                    if(tmp.data.type == emSign.SIGN_IN){
                        init.title.login.loginSucess();
                    }
                    break;

                case sendTypeID.TYPE_SETUP_GROUP:
                    tmp = binary.setup_group.bin2js(bin,len);
                    groupData = tmp.data;
                    var group = init.page.group,editGoup = init.page.edit.group;
                    if(group.sprite.visible)group.updateData();
                    if(editGoup.sprite.sprite.visible)editGoup.updateData();
                    break;
            }
            window.appRender();
        }
    }

};

kbBinary.paras = function() {

    this.js2bin = function (js,buffer,len) {
        var tmp;
        tmp = binary.name.bin2js(js.name,buffer,len);
        len = tmp.len;
        buffer = tmp.buffer;

        tmp = binary.scene.bin2js(js.scene,buffer,len);
        len = tmp.len;
        buffer = tmp.buffer;

        tmp = binary.users.bin2js(js.user,buffer,len);
        len = tmp.len;
        buffer = tmp.buffer;

        tmp = binary.descs.bin2js(js.desc,buffer,len);
        len = tmp.len;
        buffer = tmp.buffer;

        tmp = binary.paras_lock.bin2js(lockData,buffer,len);
        len = tmp.len;
        buffer = tmp.buffer;
        return {buffer : buffer,len : len};
    };

    this.bin2js = function (bin,len,dLen) {
        var parasData = {};
        var tmp;

        tmp = binary.name.bin2js(bin,len);
        parasData.name = tmp.data;
        len = tmp.len;

        tmp = binary.scene.bin2js(bin,len);
        parasData.scene = tmp.data;
        len = tmp.len;

        tmp = binary.users.bin2js(bin,len);
        parasData.user = tmp.data;
        len = tmp.len;

        tmp = binary.descs.bin2js(bin,len);
        parasData.desc = tmp.data;
        len = tmp.len;

        tmp = binary.version.bin2js(bin,len);
        parasData.version = tmp.data;
        len = tmp.len;

        //tmp = binary.paras_lock.bin2js(bin,len);
        //parasData.lock = tmp.data;
        //lockData = paras.lock[0];

        descData = [];
        for(var i= 0,olen=parasData.desc.length;i<olen;i++){
            descData.push(parasData.desc[i]);
        }
        descData.length == 0 && descData.push(parasData.scene.desc);
        settingData = parasData.scene.para.setup.set;
        kbLog('log',parasData);
        window.GLOBAL.initStart();
    };
};

kbBinary.net_hdr = function(){
    item_attr.call(this,kbNetHdr,kbNetHdr2buffer);
};

kbBinary.version = function(){
    item_attr.call(this,kbVersion,kbVersion2buffer);
};

kbBinary.paras_lock = function(){
    var lockLen = MAX_LOCK;
    this.js2Bin = function(js,buffer,len){
        var obj = {};obj.ulock = parseInt(js,2);
        var lock = new kbLock2buffer(obj,buffer,len);
        return {buffer : lock.buffer , len : lock.len};
    };

    this.bin2js = function(bin,len){
        var data = new Array(lockLen);
        for(var i=0;i<lockLen;i++){
            var lock = new kbLock(bin,len);
            data[i] = lock.ulock;
            len = lock.len;
            //var lockData = lock.ulock.toString(2);
        }
        return {data : data,len : lock.len};
    };
};

kbBinary.dsp = function(){

    this.js2bin = function(js,buffer,len){
        var tmp;
        tmp = binary.adsp.js2bin(js.adsp,buffer,len);
        buffer = tmp.buffer;
        len = tmp.len;
        return {buffer : buffer,len : len};
    };

    this.bin2js = function(bin,len,dLen){
        var data = {},tmp;
        tmp = binary.adsp.bin2js(bin,len);
        data.adsp = tmp.data;
        len = tmp.len;
        return {data : data,len : len};
    }
};

kbBinary.adsp = function(){

    this.js2bin = function(js,buffer,len){
        var tmp;
        setBuffer(binary.dsp_ins,'in');
        setBuffer(binary.dsp_fxs,'fx');
        setBuffer(binary.dsp_outs,'out');
        setBuffer(binary.dsp_misc,'misc');
        return {buffer : buffer,len : len};
        function setBuffer(func,attr){
            tmp = func.js2bin(js[attr],buffer,len);
            buffer = tmp.buffer;
            len = tmp.len;
        }
    };

    this.bin2js = function(bin,len,dLen){
        var data = {},tmp;
        getData(binary.dsp_ins,'in');
        getData(binary.dsp_fxs,'fx');
        getData(binary.dsp_outs,'out');
        getData(binary.dsp_misc,'misc');
        getData(binary.dsp_solo,'solo');
        items = [];
        itemsOut = [];
        for(var i= 0,olen=data.in.length;i<olen;i++){
            items.push(data.in[i]);
        }
        for(i= 0,olen=data.fx.length;i<olen;i++){
            items.push(data.fx[i]);
        }
        items.push(data.out[0][1]);
        for(i= 0,olen=data.out.length;i<olen;i++){
            itemsOut.push(data.out[i]);
        }
        miscData = data.misc;
        soloData = data.solo.on;
        return {data : data,len : len};
        function getData(func,attr){
            tmp = func.bin2js(bin,len);
            data[attr] = tmp.data;
            len = tmp.len;
        }
    }
};

function dsp_items(itemLen,funcAttr){

    this.js2bin = function(js,buffer,len){
        var tmp;
        for(var i=0;i<itemLen;i++){
            tmp = binary[funcAttr].js2bin(js[i],buffer,len);
            buffer = tmp.buffer;
            len = tmp.len;
        }

        return {buffer : buffer,len : len};
    };

    this.bin2js = function(bin,len,dLen){
        var data = new Array(itemLen),tmp;
        for(var i=0;i<itemLen;i++){
            tmp = binary[funcAttr].bin2js(bin,len);
            data[i] = tmp.data;
            len = tmp.len;
        }

        return {data : data,len : len};
    };
}

kbBinary.dsp_status = function() {
    dsp_items.call(this,1,'dsp_level');
};

kbBinary.dsp_ins = function(){
    dsp_items.call(this,chID.CH_IN_NUM,'dsp_in');
};

kbBinary.dsp_fxs = function(){
    dsp_items.call(this,chID.CH_FX_NUM,'dsp_fx');
};

kbBinary.dsp_outs = function(){
    dsp_items.call(this,chID.CH_OUT_NUM,'dsp_out');
};

kbBinary.dsp_misc = function(){

    this.js2bin = function(js,buffer,len){
        var tmp;
        setBuffer(binary.name,js.name);
        setBuffer(binary.router,js.router);
        setBuffer(binary.dsp_mixerpan,js.mixerpan);
        setBuffer(binary.dsp_mixermode,js.mixermode);
        for(var i=0;i<15;i++){
            setBuffer(binary.dsp_iir,js.eq[i]);
        }
        setBuffer(binary.dsp_delay,js.ldelay);
        setBuffer(binary.dsp_gain,js.gain);
        return {buffer : buffer,len : len};
        function setBuffer(func,data){
            tmp = func.js2bin(data,buffer,len);
            buffer = tmp.buffer;
            len = tmp.len;
        }
    };

    this.bin2js = function(bin,len,dLen){
        var data = {},tmp;
        getData(binary.name,'name');
        getData(binary.router,'router');
        getData(binary.dsp_mixermode,'mixermode');
        data.eq = new Array(15);
        for(var i=0;i<15;i++){
            tmp = binary.dsp_iir.bin2js(bin,len);
            data.eq[i] = tmp.data;
            len = tmp.len;
        }
        getData(binary.dsp_delay,'ldelay');
        getData(binary.dsp_gain,'gain');
        return {data : data,len : len};
        function getData(func,attr){
            tmp = func.bin2js(bin,len);
            data[attr] = tmp.data;
            len = tmp.len;
        }
    };
};

kbBinary.dsp_in = function(){

    this.js2bin = function(js,buffer,len){
        var tmp;
        setBuffer(binary.name,js.name);
        setBuffer(binary.dsp_gain,js.gain);
        for(var i=0;i<4;i++){
            setBuffer(binary.dsp_iir,js.eq[i]);
        }
        setBuffer(binary.dsp_xo,js.hpf);
        setBuffer(binary.dsp_gatecps,js.gatecps);
        setBuffer(binary.dsp_fdbk,js.fdbk);
        setBuffer(binary.dsp_panGain,js.panGain);
        setBuffer(binary.dsp_mixerpan,js.mixerpan);
        setBuffer(binary.dsp_ppower,js.ppower);
        return {buffer : buffer,len : len};

        function setBuffer(func,data){
            tmp = func.js2bin(data,buffer,len);
            buffer = tmp.buffer;
            len = tmp.len;
        }
    };

    this.bin2js = function(bin,len){
        var data = {},tmp;
        getData(binary.name,'name');
        getData(binary.dsp_gain,'gain');
        data.eq = new Array(4);
        for(var i=0;i<4;i++){
            tmp = binary.dsp_iir.bin2js(bin,len);
            data.eq[i] = tmp.data;
            len = tmp.len;
        }
        getData(binary.dsp_xo,'hpf');
        getData(binary.dsp_gatecps,'gatecps');
        getData(binary.dsp_fdbk,'fdbk');
        getData(binary.dsp_panGain,'panGain');
        getData(binary.dsp_mixerpan,'mixerpan');
        getData(binary.dsp_ppower,'ppower');
        return {data : data,len : len};
        function getData(func,attr){
            tmp = func.bin2js(bin,len);
            data[attr] = tmp.data;
            len = tmp.len;
        }
    };

};

kbBinary.dsp_fx = function(){

    this.js2bin = function(js,buffer,len){
        var tmp;
        setBuffer(binary.name,js.name);
        setBuffer(binary.dsp_gain,js.gain);
        setBuffer(binary.dsp_echo,js.echo);
        setBuffer(binary.dsp_reverb,js.reverb);
        for(var i=0;i<4;i++){
            setBuffer(binary.dsp_iir,js.eq[i]);
        }
        return {buffer : buffer,len : len};
        function setBuffer(func,data){
            tmp = func.js2bin(data,buffer,len);
            buffer = tmp.buffer;
            len = tmp.len;
        }
    };

    this.bin2js = function(bin,len,dLen){
        var data = {},tmp;
        getData(binary.name,'name');
        getData(binary.dsp_gain,'gain');
        getData(binary.dsp_echo,'echo');
        getData(binary.dsp_reverb,'reverb');
        data.eq = new Array(4);
        for(var i=0;i<4;i++){
            tmp = binary.dsp_iir.bin2js(bin,len);
            data.eq[i] = tmp.data;
            len = tmp.len;
        }
        return {data : data,len : len};
        function getData(func,attr){
            tmp = func.bin2js(bin,len);
            data[attr] = tmp.data;
            len = tmp.len;
        }
    };

};

kbBinary.dsp_out = function(){

    this.js2bin = function(js,buffer,len){
        var tmp;
        for(var i= 0,olen=js.length;i<olen;i++){
            setBuffer(binary.name,js[i].name);
            setBuffer(binary.dsp_xo,js[i].hpf);
            setBuffer(binary.dsp_xo,js[i].lpf);
            for(var j=0;j<12;j++){
                setBuffer(binary.dsp_iir,js[i].eq[j]);
            }
            setBuffer(binary.dsp_delay,js[i].delay);
            setBuffer(binary.dsp_limiter,js[i].limit);
        }

        return {buffer : buffer,len : len};
        function setBuffer(func,data){
            tmp = func.js2bin(data,buffer,len);
            buffer = tmp.buffer;
            len = tmp.len;
        }
    };

    this.bin2js = function(bin,len,dLen){
        var data = [],tmp;
        for(var i= 0;i<2;i++){
            data[i] = {};
            getData(binary.name,'name');
            getData(binary.dsp_xo,'hpf');
            getData(binary.dsp_xo,'lpf');
            data[i].eq = new Array(12);
            for(var j=0;j<12;j++){
                tmp = binary.dsp_iir.bin2js(bin,len);
                data[i].eq[j] = tmp.data;
                len = tmp.len;
            }
            getData(binary.dsp_delay,'delay');
            getData(binary.dsp_limiter,'limit');
        }
        return {data : data,len : len};
        function getData(func,attr){
            tmp = func.bin2js(bin,len);
            data[i][attr] = tmp.data;
            len = tmp.len;
        }
    };
};

function item_attr(bin2js,js2bin){

    this.js2bin = function(js,buffer,len){
        var tmp = new js2bin(js,buffer,len);
        return {buffer : tmp.buffer,len : tmp.len};
    };

    this.bin2js = function(bin,len,dLen){
        var tmp = new bin2js(bin,len);
        return {data : tmp,len : tmp.len};
    }

}

kbBinary.name = function(){
    item_attr.call(this,kbName,kbName2buffer);
};

kbBinary.ack = function(){
    item_attr.call(this,kbAck,kbAck2buffer);
};

kbBinary.askfor = function(){
    item_attr.call(this,kbAskfor,kbAskfor2buffer);
};

kbBinary.dsp_gain = function(){
    item_attr.call(this,kbAdspGain,kbAdspGain2buffer)
};

kbBinary.dsp_solo = function(){
    item_attr.call(this,kbAdspSolo,kbAdspSolo2buffer);
};

kbBinary.dsp_panGain = function(){
    item_attr.call(this,kbAdspPanGain,kbAdspPanGain2buffer)
};

kbBinary.dsp_iir = function(){
    item_attr.call(this,kbAdspIir,kbAdspIir2buffer)
};

kbBinary.dsp_xo = function(){
    item_attr.call(this,kbAdspXo,kbAdspXo2buffer)
};

kbBinary.dsp_limiter = function(){
    item_attr.call(this,kbAdspLimiter,kbAdspLimiter2buffer)
};

kbBinary.dsp_mixerpan = function(){
    item_attr.call(this,kbAdspMixerpan,kbAdspMixerpan2buffer)
};

kbBinary.dsp_mixermode = function(){
    item_attr.call(this,kbAdspMixermode,kbAdspMixermode2buffer)
};

kbBinary.dsp_mixer = function(){
    item_attr.call(this,kbAdspMixer,kbAdspMixer2buffer)
};

kbBinary.router = function(){
    item_attr.call(this,kbAdspRouter,kbAdspRouter2buffer)
};

kbBinary.dsp_delay = function(){
    item_attr.call(this,kbAdspDelay,kbAdspDelay2buffer)
};

kbBinary.dsp_levels = function(){
    var maxL1 = 12,maxL2 = 14;
    this.js2bin = function(js,buffer,len){
    };

    this.bin2js = function(bin,len,dLen){
        var data = {},tmp;
        data.l1 = new Array(maxL1);
        data.l2 = new Array(maxL2);
        data.gc = new Array(chID.CH_IN_NUM);
        data.lm = new Array(2);
        data.lm[0] = new Array(chID.CH_OUT_NUM);
        data.lm[1] = new Array(chID.CH_OUT_NUM);
        for(var i=0;i<maxL1;i++){
            tmp = new kbAdspLevel(bin,len);
            data.l1[i] = tmp.level;
            len = tmp.len;
        }
        for(i=0;i<maxL2;i++){
            tmp = new kbAdspLevel(bin,len);
            data.l2[i] = tmp.level;
            len = tmp.len;
        }
        for(i=0;i<chID.CH_IN_NUM;i++){
            tmp = binary.dsp_lg.bin2js(bin,len);
            data.gc[i] = tmp.data;
            len = tmp.len;
        }
        for(i=0;i<2;i++){
            for(var j=0;j<chID.CH_OUT_NUM;j++){
                tmp = binary.dsp_lg.bin2js(bin,len);
                data.lm[i][j] = tmp.data;
                len = tmp.len;
            }
        }
        levelsData = data;
        //kbLog('log',levelsData.l2);
        //kbLog('log',levelsData.l1);
        //kbLog('log',levelsData.gc[1]);
        window.GLOBAL.setLevelSkip.main();
        window.GLOBAL.setLevelSkip.dyn();
        window.GLOBAL.setLevelSkip.port();
        return {data : data,len : len};
    }

};

function createLevels(){
    levelsData.l1 = [];
    levelsData.l2 = [];
    levelsData.gc = [];
    levelsData.lm = [];
    for(var i=0;i<12;i++){
        levelsData.l1[i] = fRandomBy();
    }
    for(i=0;i<14;i++){
        levelsData.l2[i] = fRandomBy();
    }
    for(i=0;i<chID.CH_IN_NUM;i++){
        levelsData.gc[i] = [];
        for(var j=0;j<4;j++){
            levelsData.gc[i][j] = fRandomBy();
        }
    }
    for(i=0;i<2;i++){
        levelsData.lm[i] = [];
        for(j=0;j<chID.CH_OUT_NUM;j++){
            levelsData.lm[i][j] = [];
            for(var z=0;z<4;z++){
                levelsData.lm[i][j][z] = fRandomBy();
            }
        }
    }
    window.GLOBAL.setLevelSkip.main();
    window.GLOBAL.setLevelSkip.dyn();
    window.GLOBAL.setLevelSkip.port();
}

if(webPowerControl.LEVELS){
    setTimeout(function(){
        setInterval(function(){
            //createLevels();
        },100);
    },3000);
}

kbBinary.dsp_lg = function(){
    var lgLen = 4;
    this.bin2js = function(bin,len,dLen){
        var data = new Array(lgLen),tmp;
        for(var i=0;i<lgLen;i++){
            tmp = new kbAdspLevel(bin,len);
            data[i] = tmp.level;
            len = tmp.len;
        }
        return {data : data,len : len};
    }
};

kbBinary.dsp_fdbk = function(){
    item_attr.call(this,kbAdspFdbk,kbAdspFdbk2buffer)
};

kbBinary.dsp_echo = function(){
    item_attr.call(this,kbAdspEcho,kbAdspEcho2buffer)
};

kbBinary.dsp_reverb = function(){
    item_attr.call(this,kbAdspReverb,kbAdspReverb2buffer)
};

kbBinary.dsp_gatecps = function(){
    item_attr.call(this,kbAdspGatecps,kbAdspGatecps2buffer)
};

kbBinary.dsp_ppower = function(){
    item_attr.call(this,kbAdspPpower,kbAdspPpower2buffer)
};

kbBinary.setup = function(){

    this.js2bin = function(js,buffer,len){
        setBuffer(binary.name,'name');
        setBuffer(binary.setup_sett,'set');
        setBuffer(binary.network,'network');
        setBuffer(binary.setup_group,'group');
        return {buffer : buffer,len : len};
        function setBuffer(func,attr){
            var tmp = func.js2bin(js[attr],buffer,len);
            buffer = tmp.buffer;
            len = tmp.len;
        }
    };

    this.bin2js = function(bin,len,dLen){
        var data = {},tmp;
        getData(binary.name,'name');
        getData(binary.setup_sett,'set');
        getData(binary.network,'network');
        getData(binary.setup_group,'group');
        networkData = data.network;
        return {data : data,len : len};
        function getData(func,attr){
            tmp = func.bin2js(bin,len);
            data[attr] = tmp.data;
            len = tmp.len;
        }
    }
};

kbBinary.network = function(){
    item_attr.call(this,kbNetwork,kbNetwork2buffer)
};

kbBinary.setup_sett = function(){
    item_attr.call(this,kbSetupSett,kbSetupSett2buffer);
};

kbBinary.setup_group = function(){
    var ch_num = chID.DSP_CH_NUM;
    var attr = ['view','mute','solo'];
    this.js2bin = function(js,buffer,len){
        for(var a=0;a<3;a++) {
            for (var j = 1; j < 5; j++) {
                for (var i = 0; i < ch_num; i++) {
                    var tmp = new kbGroup2buffer(groupData[attr[a]][j][i], buffer, len);
                    len = tmp.len;
                    buffer = tmp.buffer;
                }
            }
        }
        return {buffer : buffer,len : len};
    };

    this.bin2js = function(bin,len){
        groupData = {
            view:{
                input:[0,0,1,1,1,1,1,0,0,0,0],
                fx:[0,0,1,1,1,1,1,0,0,0,0],
                output:[0,0,1,1,1,1,1,0,0,0,0],
                1:[0,0,1,1,1,1,1,0,0,0,0],
                2:[0,0,1,1,1,1,1,0,0,0,0],
                3:[0,0,1,1,1,1,1,0,0,0,0],
                4:[0,0,1,1,1,1,1,0,0,0,0]
            },
            mute:{
                input:[0,0,1,1,1,1,1,0,0,0,0],
                fx:[0,0,1,1,1,1,1,0,0,0,0],
                output:[0,0,1,1,1,1,1,0,0,0,0],
                1:[0,0,1,1,1,1,1,0,0,0,0],
                2:[0,0,1,1,1,1,1,0,0,0,0],
                3:[0,0,1,1,1,1,1,0,0,0,0],
                4:[0,0,1,1,1,1,1,0,0,0,0]
            },
            solo:{
                input:[0,0,1,1,1,1,1,0,0,0,0],
                fx:[0,0,1,1,1,1,1,0,0,0,0],
                output:[0,0,1,1,1,1,1,0,0,0,0],
                1:[0,0,1,1,1,1,1,0,0,0,0],
                2:[0,0,1,1,1,1,1,0,0,0,0],
                3:[0,0,1,1,1,1,1,0,0,0,0],
                4:[0,0,1,1,1,1,1,0,0,0,0]
            }
        };
        for(var a=0;a<3;a++) {
            for (var j = 1; j < 5; j++) {
                for (var i = 0; i < ch_num; i++) {
                    var tmp = new kbGroup(bin, len);
                    groupData[attr[a]][j][i] = tmp.sw;
                    len = tmp.len;
                }
            }
        }
        return {data : groupData,len : len};
    }
};

kbBinary.users = function(){

    this.js2bin = function(js,buffer,len){
        for(var i= 0,olen=js.length;i<olen;i++){
            var data = binary.user.js2bin(js[i],buffer,len);
            len = data.len;
            buffer = data.buffer;
        }
        return {buffer : buffer,len:len};
    };

    this.bin2js = function(bin,len,dLen){
        var data = [];
        userData = [];
        for(var i=0;i<MAX_USER;i++){
            var tmp = binary.user.bin2js(bin,len);
            if(tmp.data.type != 0){
                data.push(tmp.data);
                userData.push(tmp.data);
            }
            len = tmp.len;
        }
        return {data : data,len : len};
    }
};

kbBinary.user = function(){

    this.js2bin = function(js,buffer,len){
        var data = new kbUser2buffer(js,buffer,len);
        len = data.len;
        buffer = data.buffer;
        return {buffer : buffer,len:len};
    };

    this.bin2js = function(bin,len,dLen){
        var tmp = new kbUser(bin,len);
        len = tmp.len;
        return {data : tmp,len : len};
    }
};

kbBinary.sign = function(){
    item_attr.call(this,kbSign,kbSign2buffer);
};

kbBinary.scenes = function(){

    this.js2bin = function(js,buffer,len){
        for(var i= 0;i<MAX_SCENE;i++){
            if(!js[i])js[i] = {inuser : 0};
            var data = binary.scene.js2bin(js[i],buffer,len);
            len = data.len;
            buffer = data.buffer;
        }
        return {buffer : buffer,len:len};
    };

    this.bin2js = function(bin,len,dLen){
        var data = [];
        for(var i=0;i<MAX_SCENE;i++){
            var tmp = binary.scene.bin2js(bin,len);
            tmp.data.inuser && data.push(tmp.data);
            len = tmp.len;
        }
        return {data : data,len : len};
    }
};

kbBinary.scene = function(){

    this.js2bin = function(js,buffer,len){
        var data = new binary.desc.js2bin(js.desc,buffer,len);
        len = data.len;
        buffer = data.buffer;

        data = new binary.para.js2bin(js.para,buffer,len);
        len = data.len;
        buffer = data.buffer;

        return {buffer : buffer,len:len};
    };

    this.bin2js = function(bin,len,dLen){
        var data = {},tmp;
        tmp = new binary.desc.bin2js(bin,len);
        data.desc = tmp.data;
        len = tmp.len;

        tmp = new binary.para.bin2js(bin,len);
        data.para = tmp.data;
        len = tmp.len;
        return {data : data,len : len};
    };
};

kbBinary.scene_hdr = function(){

    this.js2bin = function(js,buffer,len){
        var tmp = new kbSceneHdr2buffer(js,buffer,len);
        if(js.para){
            tmp = new binary.para.js2bin(js.para,tmp.buffer,tmp.len);
        }
        return {buffer : tmp.buffer,len : tmp.len};
    };

    this.bin2js = function(bin,len,dLen){
        var tmp = new kbSceneHdr(bin,len);
        len = tmp.len;
        if(dLen > len){
            tmp.para = new binary.para.bin2js(bin,len);
            len = tmp.para.len;
        }
        return {data : tmp,len : len};
    }
};

kbBinary.descs = function(){
    var descLen = MAX_SCENE;
    this.js2bin = function(js,buffer,len){
        for(var i= 0;i<descLen;i++){
            if(!js[i])js[i] = {inuser : 0};
            var data = binary.desc.js2bin(js[i],buffer,len);
            len = data.len;
            buffer = data.buffer;
        }
        return {buffer : buffer,len:len};
    };

    this.bin2js = function(bin,len,dLen){
        var data = [];
        for(var i=0;i<descLen;i++){
            var tmp = binary.desc.bin2js(bin,len);
            if(tmp.data.name != '')data.push(tmp.data);
            len = tmp.len;
        }
        return {data : data,len : len};
    }
};

kbBinary.desc = function(){
    item_attr.call(this,kbDesc,kbDesc2buffer);
};

function webOnMsg(bin){
    binary.header.bin2js(bin);
}

function sendData(data){
    kbLog('log',data);
    var buffer = binary.header.js2bin(data);
    if(webPowerControl.SOCKET){
        if(GLOBAL.masterMode == 1){
            webList[0].send(buffer);
        }else{
            for(var i= 0,len=webList.length;i<len;i++){
                webList[i].send(buffer);
            }
        }
    }
}

var workData = new Worker('./js/library/workData.js');

workData.onmessage = function(event){
    var data = event.data;
    if(!data.flag){
        return;
    }
    switch (data.flag){
        case 'send' :
            !webPowerControl && myWeb.send();
            break;
    }
};

function createWebList(ipList){
    webList = [];
    for(var i= 0,len=ipList.length;i<len;i++){
        for(var j= 0,olen=webList.length;j<olen;j++){
            if(ipList[i] == webList[j].url){
                break;
            }
        }
        webList.push(new myWebs(ipList[i],webOnMsg));
    }
}

var base64 = function () {

    "use strict";

    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    var lookup = new Uint8Array(256);
    for (var i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
    }

    this.encode = function(arraybuffer) {
        var bytes = new Uint8Array(arraybuffer),
            i, len = bytes.length, base64 = "";

        for (i = 0; i < len; i+=3) {
            base64 += chars[bytes[i] >> 2];
            base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
            base64 += chars[bytes[i + 2] & 63];
        }

        if ((len % 3) === 2) {
            base64 = base64.substring(0, base64.length - 1) + "=";
        } else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2) + "==";
        }

        return base64;
    };

    this.decode =  function(base64) {
        var bufferLength = base64.length * 0.75,
            len = base64.length, i, p = 0,
            encoded1, encoded2, encoded3, encoded4;

        if (base64[base64.length - 1] === "=") {
            bufferLength--;
            if (base64[base64.length - 2] === "=") {
                bufferLength--;
            }
        }

        var arraybuffer = new ArrayBuffer(bufferLength),
            bytes = new Uint8Array(arraybuffer);

        for (i = 0; i < len; i+=4) {
            encoded1 = lookup[base64.charCodeAt(i)];
            encoded2 = lookup[base64.charCodeAt(i+1)];
            encoded3 = lookup[base64.charCodeAt(i+2)];
            encoded4 = lookup[base64.charCodeAt(i+3)];

            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }

        return arraybuffer;
    };
};

function createHttpRequest(){
    var xmlhttp;
    if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest;
            if (xmlhttp.overrideMimeType) {
                xmlhttp.overrideMimeType('text/xml');
            }
        }else if (window.ActiveXObject){
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    xmlhttp.onreadystatechange = callback;
    xmlhttp.open("GET","/IpList",true);
    xmlhttp.send(null);
    kbLog('log','send http request');
    function callback(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            var response = xmlhttp.responseText;
            var str = response.split('IpList: ');
            str = str[1];
            var base = new base64();
            var ipBuffer = base.decode(str);
            var tmp = binary.dev_info.bin2js(ipBuffer,0,ipBuffer.byteLength);
            ipList = tmp.data;
            kbLog('log','http request ipList:',ipList);
            var ip = wsHeader() + ipList.ws.addr + ':' + ip_port;
            init.page.set.network.setIp12(ipList.mst.eth,ipList.mst.ip);
            createWebList([ip]);
        }
    }
}

function wsHeader(){
    var protocol = window.location.protocol,ws;
    if (protocol == 'https:'){
        ws = 'wss://';
    }else{
        ws = 'ws://';
    }
    return ws;
}
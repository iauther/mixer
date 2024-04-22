var binary = {
    header : new kbBinary.header(),
    paras : new kbBinary.paras(),
    version : new kbBinary.version(),
    para : new kbBinary.para(),
    sign : new kbBinary.sign(),
    ack : new kbBinary.ack(),
    dev_info : new kbBinary.dev_info(),
    net_info : new kbBinary.net_info(),
    eth_info : new kbBinary.eth_info(),
    ip_info : new kbBinary.ip_info(),
    ap_hdr : new kbBinary.ap_hdr(),
    dsp : new kbBinary.dsp(),
    adsp : new kbBinary.adsp(),
    dsp_status : new kbBinary.dsp_status(),
    dsp_ins : new kbBinary.dsp_ins(),
    dsp_in : new kbBinary.dsp_in(),
    dsp_fxs : new kbBinary.dsp_fxs(),
    dsp_fx : new kbBinary.dsp_fx(),
    dsp_outs : new kbBinary.dsp_outs(),
    dsp_out : new kbBinary.dsp_out(),
    dsp_gain : new kbBinary.dsp_gain(),
    dsp_panGain : new kbBinary.dsp_panGain(),
    dsp_iir : new kbBinary.dsp_iir(),
    dsp_xo : new kbBinary.dsp_xo(),
    dsp_limiter : new kbBinary.dsp_limiter(),
    dsp_mixerpan : new kbBinary.dsp_mixerpan(),
    dsp_mixermode : new kbBinary.dsp_mixermode(),
    dsp_mixer : new kbBinary.dsp_mixer(),
    dsp_solo : new kbBinary.dsp_solo(),
    router : new kbBinary.router(),
    dsp_delay : new kbBinary.dsp_delay(),
    dsp_levels : new kbBinary.dsp_levels(),
    dsp_lg : new kbBinary.dsp_lg(),
    dsp_fdbk : new kbBinary.dsp_fdbk(),
    dsp_echo : new kbBinary.dsp_echo(),
    dsp_reverb : new kbBinary.dsp_reverb(),
    dsp_gatecps : new kbBinary.dsp_gatecps(),
    name : new kbBinary.name(),
    dsp_ppower : new kbBinary.dsp_ppower(),
    dsp_misc : new kbBinary.dsp_misc(),
    setup : new kbBinary.setup(),
    setup_sett : new kbBinary.setup_sett(),
    setup_group : new kbBinary.setup_group(),
    users : new kbBinary.users(),
    user : new kbBinary.user(),
    scenes : new kbBinary.scenes(),
    scene : new kbBinary.scene(),
    paras_lock : new kbBinary.paras_lock(),
    desc : new kbBinary.desc(),
    scene_hdr : new kbBinary.scene_hdr(),
    descs : new kbBinary.descs(),
    askfor : new kbBinary.askfor(),
    network : new kbBinary.network(),
    net_hdr : new kbBinary.net_hdr()
};

function kbdevInfo(data,olen,dlen){
    var tmp, len, length=olen;

    this.ip = new kbIpInfo(data,length);
    length = this.ip.len;

    this.len = length;
}

function kbApInfo(data,olen){
    var tmp, len, length=olen;

    len = 32;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.ssid = arrayToString(tmp);

    len = 32;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.passwd = arrayToString(tmp);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.security = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.strength = tmp.getUint8(0,true);

    this.len = length;
}

function kbApHdr(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.ssid = tmp.getUint8(0,true);

    if(data.byteLength > length){
        this.info = kbApInfo(data,length);
        length = this.info.len;
    }

    this.len = length;
}

function kbEthInfo(data,olen){
    kbApInfo.call(this,data,olen);
}

function kbIpInfo(data,olen){
    var tmp, len, length=olen;

    this.mst = new kbIpMst(data,length);
    length = this.mst.len;

    this.ws = new kbIp(data,length);
    length = this.ws.len;

    this.ip = [];
    for(var i=0,ipLen = (data.byteLength-length)/64;i<ipLen;i++){
        this.ip[i] = new kbIp(data,length);
        length = this.ip[i].len;
    }

    this.len = length;
}

function kbIpExt(data,olen){
    var tmp, len, length=olen;

    len = 64;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.eth = arrayToString(tmp);

    len = 64;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.wl = arrayToString(tmp);

    this.len = length;
}

function kbIp(data,olen){
    var tmp, len, length=olen;

    len = 64;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.addr = arrayToString(tmp);

    this.len = length;
}

function kbIpMst(data,olen){
    var tmp, len, length=olen;

    len = 64;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.eth = arrayToString(tmp);

    len = 64;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.wl = arrayToString(tmp);

    len = 64;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.ip = arrayToString(tmp);

    this.len = length;
}

function kbLink(data,olen){
    var tmp, len, length=olen;

    len = 32;
    tmp = new DataView(data, length, len);
    length += len;
    this.name = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.sw = tmp.getUint8(0,true);

    this.len = length;
}

function kbRoute(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.val = tmp.getUint8(0,true);

    this.len = length;
}

function kbRouteIn(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.eff = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.out = tmp.getUint8(0,true);

    this.len = length;
}

function kbRouteOut(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.in = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.eff = tmp.getUint8(0,true);

    this.len = length;
}

function kbApAuth(data,olen){
    var tmp, len, length=olen;

    len = 32;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.ssid = arrayToString(tmp);

    len = 32;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.passwd = arrayToString(tmp);

    this.len = length;
}

function kbUserAuth(data,olen){
    var tmp, len, length=olen;

    len = 32;
    tmp = new DataView(data, length, len);
    length += len;
    this.name = tmp.getUint8(0,true);

    len = 32;
    tmp = new DataView(data, length, len);
    length += len;
    this.passwd = tmp.getUint8(0,true);

    this.len = length;
}

function kbFileData(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.type = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.last = tmp.getUint8(0,true);

    this.len = length;
}

function kbAskfor(data,olen){
    var tmp, len, length=olen;

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.type = tmp.getUint32(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.index = tmp.getUint32(0,true);

    this.len = length;
}

function kbAck(data,olen){
    var tmp, len, length=olen;

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.errID = tmp.getUint32(0,true);

    if(data.byteLength > length){
        len = 4;
        tmp = new DataView(data, length, len);
        length += len;
        this.index = tmp.getUint32(0,true);
    }

    this.len = length;
}

/*adsp*/
function kbheader(data){
    var tmp, len, length=0;

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.magic = tmp.getUint16(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.rw = tmp.getUint8(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.type = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.isAck = tmp.getUint8(0,true);
    this.needAck = tmp.getUint8(1,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.dlen = tmp.getUint32(0,true);

    this.len = length;
} //11

function kbpara(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.mode = tmp.getUint8(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.type = tmp.getUint16(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.ch = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.hl = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.pf = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.index = tmp.getUint8(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.group = tmp.getUint32(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.dLen = tmp.getUint32(0,true);

    this.len = length;
} //15

function kbGroup(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.sw = tmp.getUint8(0,true);

    this.len = length;
}

function kbName(data,olen){
    var tmp, len, length=olen;

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.name = arrayToString(tmp);

    this.len = length;
}

function kbSign(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.type = tmp.getUint8(0,true);

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.name = arrayToString(tmp);

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.passwd = arrayToString(tmp);

    if(length >= data.byteLength){
        this.len = length;
        return;
    }
    kbUserPerm.call(this,data,length);
}

function kbLock(data,olen){
    var tmp, len, length=olen;

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.ulock = tmp.getUint32(0,true);

    this.len = length;
}

function kbAdspGain(data,olen){
    var tmp, len, length=olen;
    len = 2;
    tmp = new DataView(data, length, len);
    this.gain = tmp.getInt16(0,true);
    length += len;

    len = 1;
    tmp = new DataView(data, length, len);
    this.mute = tmp.getUint8(0,true);
    length += len;

    len = 1;
    tmp = new DataView(data, length, len);
    this.reverse = tmp.getUint8(0,true);
    length += len;

    len = 1;
    tmp = new DataView(data, length, len);
    this.type = tmp.getUint8(0,true);
    length += len;

    this.len = length;
}

function kbAdspPpower(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.on = tmp.getUint8(0,true);

    this.len = length;
}

function kbAdspPanGain(data,olen){
    kbAdspGain.call(this,data,olen);
    var tmp,len,length = this.len;

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.pan = tmp.getInt16(0,true);

    this.len = length;
}

function kbAdspIir(data,olen){
    var tmp,len,length = olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.bypass = tmp.getUint8(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.response = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.gain = tmp.getInt16(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.freq = tmp.getFloat32(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.Q = tmp.getUint32(0,true);

    this.len = length;
}

function kbAdspXo(data,olen){
    var tmp,len,length = olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.bypass = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.pre_order = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.max_order = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.method = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.response = tmp.getUint8(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.freq = tmp.getFloat32(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.Q = tmp.getUint16(0,true);

    this.len = length;
}

function kbAdspLimiter(data,olen){
    var tmp,len,length = olen;

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_level = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_gain = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.peak_level = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.peak_gain = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_threshold = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_ratio = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_attck = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_hold = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_release = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.lim_threshold = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.lim_ratio = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.lim_attck = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.lim_hold = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.lim_release = tmp.getUint16(0,true);

    this.len = length;
}

function kbAdspMixerpan(data,olen){
    var tmp,len,length = olen;

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.direct_ratio = tmp.getFloat32(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.echo_ratio = tmp.getFloat32(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.reverb_ratio = tmp.getFloat32(0,true);

    kbAdspPanGain.call(this,data,length);
}

function kbAdspMixermode(data,olen){
    var tmp,len,length = olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.mode = tmp.getUint8(0,true);

    this.len = length;
}

function kbAdspMixer(data,olen){
    kbAdspGain.call(this,data,olen);
}

function kbAdspRouter(data,olen){
    var tmp,len,length = olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.num = tmp.getUint8(0,true);

    this.len = length;
}

function kbAdspDelay(data,olen){
    var tmp,len,length = olen;

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.time = tmp.getUint16(0,true);

    kbAdspGain.call(this,data,length);
    length = this.len;

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.Len = tmp.getUint32(0,true);

    this.len = length;
}

function kbAdspLevel(data,olen){
    var tmp,len,length = olen;

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.level = tmp.getInt16(0,true);

    this.len = length;
}

function kbAdspFdbk(data,olen){
    var tmp,len,length = olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.degree = tmp.getUint8(0,true);

    this.len = length;
}

function kbAdspEcho(data,olen){
    var tmp,len,length = olen;

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.ldelay = tmp.getUint32(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.rdelay = tmp.getUint32(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.ratio = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.type = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.fdbk = tmp.getUint8(0,true);

    this.len = length;
}

function kbAdspReverb(data,olen){
    var tmp,len,length = olen;

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.pre_delay = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.time = tmp.getUint16(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.freq = tmp.getFloat32(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.type = tmp.getUint8(0,true);

    this.len = length;
}

function kbAdspGatecps(data,olen){
    var tmp,len,length = olen;

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.gate_level = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.gate_gain = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_level = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_gain = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.gate_threshold = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.gate_depth = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.gate_attck = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.gate_hold = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.gate_release = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.gate_bypass = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_threshold = tmp.getInt16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_ratio = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_attck = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_hold = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_release = tmp.getUint16(0,true);

    len = 2;
    tmp = new DataView(data, length, len);
    length += len;
    this.cps_bypass = tmp.getUint16(0,true);

    this.len  = length;
}

function kbSetupSett(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.LR = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.solo_route = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.solo_mode = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.rec_mode = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.pwr_mode = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.clip_hold = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.rescale = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.framerate = tmp.getUint8(0,true);

    this.len = length;
}

function kbAdspRw(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.r = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.w = tmp.getUint8(0,true);

    this.len = length;
}

function kbUserPerm(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.role = tmp.getUint8(0,true);

    this.rw = [];
    for(var i=0;i<chID.DSP_CH_NUM;i++){
        this.rw[i] = new kbAdspRw(data,length);
        length = this.rw[i].len;
    }

    this.len = length;
}

function kbUser(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.type = tmp.getUint8(0,true);

    //if(this.type == 0){
    //    this.len = length + 1 + 32 + 32 + 1 + chID.DSP_CH_NUM * 2;
    //    return;
    //}

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.name = arrayToString(tmp);

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.passwd = arrayToString(tmp);

    this.perm = new kbUserPerm(data,length);
    this.len = this.perm.len;
}

function kbSetupScene(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.inuse = tmp.getUint8(0,true);

    if(!this.inuse){
        this.len = length + 32 + 32 + 32 + 32;
        return;
    }

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.name = arrayToString(tmp);

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.creater = arrayToString(tmp);

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.description = arrayToString(tmp);

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.time = arrayToString(tmp);

    this.len = length;
}

function kbDesc(data,olen){
    var tmp, len, length=olen;

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.name = arrayToString(tmp);

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.creator = arrayToString(tmp);

    len = 256;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.description = arrayToString(tmp);

    len = 32;
    tmp = new Int8Array(data, length, len);
    length += len;
    this.time = arrayToString(tmp);

    this.len = length;
}

function kbSceneHdr(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.opc = tmp.getUint8(0,true);

    this.desc = new kbDesc(data,length);

    this.len = this.desc.len;
}

function kbAdspSolo(data,olen){
    var tmp, len, length=olen;
    var onLen = chID.CH_IN_NUM+chID.CH_FX_NUM;
    this.on = new Array();

    for(var i=0;i<onLen;i++){
        len = 1;
        tmp = new DataView(data, length, len);
        length += len;
        this.on[i] = tmp.getUint8(0,true);
    }

    this.len = length;
}

function kbVersion(data,olen){
    var tmp, len, length=olen;

    len = 10;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.sys = arrayToString(tmp);

    len = 10;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.dsp = arrayToString(tmp);

    len = 10;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.srv = arrayToString(tmp);

    len = 10;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.web = arrayToString(tmp);

    len = 10;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.time = arrayToString(tmp);

    len = 10;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.ver = arrayToString(tmp);

    this.len = length;
}

function kbWsec(data,olen){
    var tmp, len, length=olen;

    len = 32;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.ssid = arrayToString(tmp);

    len = 32;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.passwd = arrayToString(tmp);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.crypto = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.cipher = tmp.getUint8(0,true);

    this.len = length;
}

function kbNetInfo(data,olen){
    var tmp, len, length=olen;

    this.wsec = new kbWsec(data,length);
    length = this.wsec.len;

    this.stat = new kbNetStatus(data,length);
    length = this.stat.len;

    this.len = length;
}

function kbNetStatus(data,olen){
    var tmp, len, length=olen;

    len = 32;
    tmp = new Uint8Array(data, length, len);
    length += len;
    this.ssid = arrayToString(tmp);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.security = tmp.getUint8(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.quality = tmp.getFloat32(0,true);

    this.len = length;
}

function kbNetHdr(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.type = tmp.getUint8(0,true);

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.act = tmp.getUint8(0,true);

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.dlen = tmp.getUint32(0,true);

    this.len = length;
}

function kbNetwork(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.mode = tmp.getUint8(0,true);

    this.self = new kbWsec(data,length);
    length = this.self.len;

    this.other = new kbWsec(data,length);
    length = this.other.len;

    this.len = length;
}

function kbDebug(data,olen){
    var tmp, len, length=olen;

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.web = {
        on : tmp.getUint8(0,true)
    };

    len = 4;
    tmp = new DataView(data, length, len);
    length += len;
    this.web.log = {
        mask : tmp.getUint32(0,true)
    };

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.app = {
        use : tmp.getUint8(0,true)
    };

    len = 1;
    tmp = new DataView(data, length, len);
    length += len;
    this.sys = {
        use : tmp.getUint8(0,true)
    };

    this.len = length;
}

/*kb2buffer*/
function arrayToString(data){
    var s = "";
    for(var i=0;i<data.length  && data[i] !=0;i++){
        s +=String.fromCharCode(data[i]);
    }
    return s;
}

function stringToArray(data,attr){
    for(var i=0;i<data.length;i++){
        attr[i] = data.charCodeAt(i);
    }
    return attr;
}

function kbdevInfo2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    tmp = new kbIpInfo2buffer(data.ip,this.buffer,length);
    length = tmp.len;
    this.buffer = tmp.buffer;

    this.len = length;
}

function kbRoute2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data,true);

    this.len = length;
}

function kbAck2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.errID,true);

    this.len = length;
}

function kbApInfo2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    tmp = stringToArray(data.ssid,tmp);

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    tmp = stringToArray(data.passwd,tmp);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.security,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.strength,true);

    this.len = length;
}

function kbApHdr2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.opc,true);

    if(data.info){
        tmp = new kbApInfo2buffer(data.info,this.buffer,length);
        length = tmp.len;
    }
    this.len = length;
}

function kbApAuth2buffer(data,olen){
    var tmp, len, length=olen;

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    tmp = stringToArray(data.ssid,tmp);

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    tmp = stringToArray(data.passwd,tmp);

    this.len = length;
}

function kbEthInfo2buffer(data,olen){
    kbApInfo2buffer.call(this,data,olen);
}

function kbIpInfo2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    tmp = new kbIpMst2buffer(data.mst,this.buffer,length);
    length = tmp.len;
    this.buffer = tmp.buffer;

    tmp = new kbIp2buffer(data.ws,this.buffer,length);
    length = tmp.len;
    this.buffer = tmp.buffer;

    if(data.ip){
        tmp = new kbIp2buffer(data.ip,this.buffer,length);
        length = tmp.len;
        this.buffer = tmp.buffer;
    }

    this.len = length;
}

function kbIpExt2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 64;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    tmp = stringToArray(data.eth,tmp);

    len = 64;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    tmp = stringToArray(data.wl,tmp);

    this.len = length;
}

function kbIp2buffer(data,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 64;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    tmp = stringToArray(data.addr,tmp);

    this.len = length;
}

function kbIpMst2buffer(data,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 64;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    tmp = stringToArray(data.eth,tmp);

    len = 64;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    tmp = stringToArray(data.wl,tmp);

    len = 64;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    tmp = stringToArray(data.ip,tmp);

    this.len = length;
}
/*adsp*/
function kbheader2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.magic,true);

    len = 1;
    tmp = new Uint8Array(this.buffer, length, len);
    length += len;
    tmp[0] = data.rw;

    len = 2;
    tmp = new DataView(this.buffer, length,len);
    length += len;
    tmp.setUint16(0,data.type,true);

    len = 2;
    tmp = new Uint8Array(this.buffer, length, len);
    length += len;
    tmp[0] = data.isAck;
    tmp[1] = data.needAck;

    len = 4;
    tmp = new DataView(this.buffer, length,len);
    length += len;
    tmp.setUint32(0,data.dlen,true);

    this.len = length;
}

function kbpara2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.mode,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.type,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.ch,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.hl,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.pf,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.index,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.group,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.dlen,true);

    this.len = length;
}

function kbGroup2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data,true);

    this.len = length;
}

function kbSign2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.type,true);

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.name,tmp);

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.passwd,tmp);

    if(this.buffer.byteLength == length){
        this.len = length;
        return;
    }else{
        kbUserPerm2buffer(data,this.buffer,length);
    }
}

function kbName2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.name,tmp);

    this.len = length;
}

function kbLock2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.ulock,true);

    this.len = length;
}

function kbAdspGain2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.gain,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.mute,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.reverse,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.type,true);

    this.len = length;
}

function kbAdspPpower2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.on,true);

    this.len = length;
}

function kbAdspPanGain2buffer(data,buffer,olen){
    kbAdspGain2buffer.call(this,data,buffer,olen);
    var tmp, len, length=this.len;

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.pan,true);

    this.len = length;
}

function kbAdspIir2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;
    //console.log('bypass___  '+data.bypass);
    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.bypass,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.response,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.gain,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setFloat32(0,data.freq,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.Q,true);

    this.len = length;
}

function kbAdspXo2buffer(data,buffer,olen){
    var tmp,len,length = olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.bypass,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.pre_order,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.max_order,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.method,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.response,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setFloat32(0,data.freq,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.Q,true);

    this.len = length;
}

function kbAdspLimiter2buffer(data,buffer,olen){
    var tmp,len,length = olen;
    this.buffer = buffer;

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.cps_level,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.cps_gain,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.peak_level,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.peak_gain,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.cps_threshold,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.cps_ratio,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.cps_attck,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.cps_hold,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.cps_release,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.lim_threshold,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.lim_ratio,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.lim_attck,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.lim_hold,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.lim_release,true);

    this.len = length;
}

function kbAdspMixerpan2buffer(data,buffer,olen){
    var tmp,len,length = olen;
    this.buffer = buffer;

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setFloat32(0,data.direct_ratio,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setFloat32(0,data.echo_ratio,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setFloat32(0,data.reverb_ratio,true);

    kbAdspPanGain2buffer.call(this,data,this.buffer,length);
}

function kbAdspMixermode2buffer(data,buffer,olen){
    var tmp,len,length = olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.mode,true);

    this.len = length;
}

function kbAdspMixer2buffer(data,buffer,olen){
    kbAdspGain2buffer.call(this,data,buffer,olen);
}

function kbAdspRouter2buffer(data,buffer,olen){
    var tmp,len,length = olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.num,true);

    this.len = length;
}

function kbAdspDelay2buffer(data,buffer,olen){
    var tmp,len,length = olen;
    this.buffer = buffer;

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.time,true);

    kbAdspGain2buffer.call(this,data,this.buffer,length);
    length = this.len;

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.Len,true);

    this.len = length;
}

function kbAdspLevel2buffer(data,buffer,olen){
    var tmp,len,length = olen;
    this.buffer = buffer;

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.level,true);

    this.len = length;
}

function kbAdspFdbk2buffer(data,buffer,olen){
    var tmp,len,length = olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.degree,true);

    this.len = length;
}

function kbAdspEcho2buffer(data,buffer,olen){
    var tmp,len,length = olen;
    this.buffer = buffer;

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.ldelay,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.rdelay,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.ratio,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.type,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.fdbk,true);

    this.len = length;
}

function kbAdspReverb2buffer(data,buffer,olen){
    var tmp,len,length = olen;
    this.buffer = buffer;

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.pre_delay,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.time,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setFloat32(0,data.freq,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.type,true);

    this.len = length;
}

function kbAdspGatecps2buffer(data,buffer,olen){
    var tmp,len,length = olen;
    this.buffer = buffer;

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.gate_level,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.gate_gain,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.cps_level,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.cps_gain,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.gate_threshold,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.gate_depth,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.gate_attck,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.gate_hold,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.gate_release,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.gate_bypass,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setInt16(0,data.cps_threshold,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.cps_ratio,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.cps_attck,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.cps_hold,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.cps_release,true);

    len = 2;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint16(0,data.cps_bypass,true);

    this.len  = length;
}

function kbSetupSett2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.LR,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.solo_route,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.solo_mode,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.rec_mode,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.pwr_mode,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.clip_hold,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,this.rescale,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.framerate,true);

    this.len = length;
}

function kbRw2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.r,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.w,true);

    this.len = length;
}

function kbUserPerm2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.role,true);

    for(var i=0;i<chID.DSP_CH_NUM;i++){
        tmp = new kbRw2buffer(data.rw[i],this.buffer,length);
        length = tmp.len;
    }

    this.len = length;
}

function kbUser2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    if(!data){
        len = 1;
        tmp = new DataView(this.buffer, length, len);
        length += len;
        tmp.setUint8(0,0,true);
        this.len = length + 1 + 32 + 32 + 1 + chID.DSP_CH_NUM*2;
        return;
    }

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.type,true);

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.name,tmp);

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.passwd,tmp);
    if(length >= this.buffer.byteLength-1){
        this.len = length;
        return;
    }

    tmp = new kbUserPerm2buffer(data.perm,this.buffer,length);

    this.buffer = tmp.buffer;
    this.len = tmp.len;
}

function kbSetupScene2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    if(!data.inuse){
        this.len = length + 1 + 32 + 32 + 32 + 32;
        return;
    }

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.inuse,true);



    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.name,tmp);

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.creater,tmp);

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.description,tmp);

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.time,tmp);

    this.len = length;
}

function kbDesc2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.name,tmp);

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.creator,tmp);

    len = 256;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.description,tmp);

    len = 32;
    tmp = new Int8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.time,tmp);

    this.len = length;
}

function kbSceneHdr2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.opc,true);

    tmp = new kbDesc2buffer(data.desc,this.buffer,length);
    this.buffer = tmp.buffer;
    this.len = tmp.len;
}

function kbFileData2buffer(data,buffer,olen){
    var tmp, len, length = olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer,length,len);
    length += len;
    tmp.setUint8(0,data.type,true);

    len = 4;
    tmp = new DataView(this.buffer,length,len);
    length += len;
    tmp.setUint32(0,data.index,true);

    len = 1;
    tmp = new DataView(this.buffer,length,len);
    length += len;
    tmp.setUint8(0,data.last,true);

    len = 4;
    tmp = new DataView(this.buffer,length,len);
    length += len;
    tmp.setUint32(0,data.dlen,true);

    this.len = length;
}

function kbAskfor2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.type,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.index,true);

    this.len = length;
}

function kbAdspSolo2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;
    var swLen = chID.CH_IN_NUM+chID.CH_FX_NUM;

    for(var i=0;i<swLen;i++){
        len = 1;
        tmp = new DataView(this.buffer, length, len);
        length += len;
        tmp.setUint8(0,data[i],true);
    }

    this.len = length;
}

function kbVersion2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 10;
    tmp = new Uint8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.sys,tmp);

    len = 10;
    tmp = new Uint8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.dsp,tmp);

    len = 10;
    tmp = new Uint8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.srv,tmp);

    len = 10;
    tmp = new Uint8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.web,tmp);

    len = 10;
    tmp = new Uint8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.time,tmp);

    len = 10;
    tmp = new Uint8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.ver,tmp);

    this.len = length;
}

function kbWsec2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 32;
    tmp = new Uint8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.ssid,tmp);

    len = 32;
    tmp = new Uint8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.passwd,tmp);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.crypto,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.cipher,true);

    this.len = length;
}

function kbNetInfo2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    tmp = new kbWsec2buffer(data.wsec,this.buffer,length);
    length = tmp.len;
    this.buffer = tmp.buffer;

    tmp = new kbNetStatus2buffer(data.stat,this.buffer,length);
    length = tmp.len;
    this.buffer = tmp.buffer;

    this.len = length;
}

function kbNetStatus2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 32;
    tmp = new Uint8Array(this.buffer, length, len);
    length += len;
    stringToArray(data.ssid,tmp);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.security,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setFloat32(0,data.quality,true);

    this.len = length;
}

function kbNetHdr2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.type,true);

    if(this.buffer.byteLength <= length){
        this.len = length;
        return;
    }

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.act,true);

    if(this.buffer.byteLength <= length){
        this.len = length;
        return;
    }

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.dlen,true);

    if(this.buffer.byteLength <= length){
        this.len = length;
        return;
    }

    tmp = new kbWsec2buffer(data.wsec,this.buffer,length);
    length = tmp.len;
    this.buffer = tmp.buffer;

    this.len = length;
}

function kbNetwork2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.mode,true);

    tmp = new kbWsec2buffer(data.self,this.buffer,length);
    length = tmp.len;
    this.buffer = tmp.buffer;

    tmp = new kbWsec2buffer(data.other,this.buffer,length);
    length = tmp.len;
    this.buffer = tmp.buffer;

    this.len = length;
}

function kbDebug2buffer(data,buffer,olen){
    var tmp, len, length=olen;
    this.buffer = buffer;

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.web.on,true);

    len = 4;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint32(0,data.web.log.mask,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.app.use,true);

    len = 1;
    tmp = new DataView(this.buffer, length, len);
    length += len;
    tmp.setUint8(0,data.sys.use,true);

    this.len = length;
}
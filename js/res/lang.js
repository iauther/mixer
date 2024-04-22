var staticDataString = (function(){
    function language(cn,en){
        if(cn instanceof Array && en instanceof Array){
            var result = [];
            for(var i= 0,len=cn.length;i<len;i++){
                result.push({cn : cn[i], en : en[i]});
            }
            return result;
        }else{
            return {cn : cn, en : en}
        }
    }

    function setLang(){
        this.tab = [language('安全','SAFES'),language('设置','SETTINGS'),language('用户','USER'),language('网络','NETWORK'),language('升级','UPGRADE'),language('关于','ABOUT')];
    }

    function faderLang(){
        this.popup = new faderPopupLang();
        this.masterClear = language('清空静音','CLEAR S');
        this.ch = ['1.GUITAR','2.GUITAR','3.GUITAR','4.GUITAR','5.GUITAR','PLAYER-L','PLAYER-R','RECORD-L','RECORD-R','REVERB','ECHO','MASTER'];
        this.v = '48v';
        this.empty = '∅';
        this.solo = language('独奏','SOLO');
        this.mute = language('静音','MUTE');
    }

    function editLang(){
        this.tab = language(['端口','图形均衡强','均衡器','动态学','发送','模式','分组'],['PORT','GEQ','EQ','DYN','SENDS','MODEL','GROUP']);
        this.switcher = language(['中高音','低音'],['HIGH','LOW']);
        this.gain = language('增益','GAIN');
    }

    function editPortsLang(){
        this.titleTrim = language('消减','TRIM');
        this.titleDelay = language('延时','DELAY');
        this.statusFbc = language('关','OFF');
        this.titleFbc = language('回馈声','FBC');
        this.titlePhase = language('相位/幻象电源','PHASE/PP');
        this.fbc = language(['3','2','1','关'],['3','2','1','OFF']);
    }

    function editEqLang(){
        this.bntText = ['H','1','2','3','4','5','6','7','8','9','10','11','12','H','L'];
        this.scaleY = ['30','20','10','0','-10','-20','-30'];
        this.scaleX = ['20','50','100','200','500','1k','2k','5k','10k','20k'];
        this.tabLabel = ['HPF','EQ1','EQ2','EQ3','EQ4','EQ5','EQ6','EQ7','EQ8','EQ9','EQ10','EQ11','EQ12','HPF','LPF'];
        this.bandTitle = language(['增益','频率','Q值'],['GAIN','FREQ','Q']);
        this.switcher = language(['均衡器 1-4','均衡器 5-8','均衡器 9-12','混合'],['Equailzer 1-4','Equailzer 5-8','Equailzer 9-12','Crossover']);
        this.delay = language('延时','DELAY');
        this.order = ['6dB','12dB','18dB','24dB'];
        this.getTabButton = function(id){
            if(id == 0){
                return language(['关'],['OFF']);
            }else if(id == 13 || id == 14){
                return language(['关','BUTTER','BESSEL','LINKWITZ'],['OFF','BUTTER','BESSEL','LINKWITZ']);
            }else {
                return language(['关','低架滤波','图形均衡','高架滤波'],['OFF','LOWSHELV','PEQ','HIGHSHELV']);
            }
        }
    }

    function titleLang(){
        this.indexTab = language(['端口','编辑','发送','分组'],['PORTS','EDIT','SENDS','GROUP']);
        this.player = language(['播放器'],['PLAYER']);
        this.scene = language('场景 001\nTitranic Hall','SCENE 001\nTitranic Hall');
        this.logo = 'ENEWAVE';
        this.infoOnline = language('在线:','Online:');
        this.infoAdmin = language('管理员:','Admin:');
        this.infoUser = language('用户','User');
        this.infoState = language('状态:','State:');
        this.temp = '85℃';
    }

    function navLang(){
        this.main = language('主界面','MAIN');
        this.nav = [language(['显示','静音','独奏'],['VIEW','MUTE','SOLO']),language(['输入','FX','输出'],['INPUT','FX','OUTPUT']),['1','2','3','4']];
        this.set = language('设置','SETUP');
    }

    function faderPopupLang(){
        this.title = '预设';
        this.save = '保存预设';
        this.import = '导入预设';
        this.userSet = '用户预设';
        this.startSet = '初始预设';
    }

    function editSendsLang(){
        this.faderTitle = 'ENEWAVE';
        this.ch = language(['混响','回声','辅助1','辅助2','SUB1','SUB2','左录音','右录音'],['REVERB','ECHO','AUX1','AUX2','SUB1','SUB2','REC-L','REC-R']);
    }

    function editGroupLang(){
        this.clear = language('清空','CLEAR');
        this.all = language('全选','ALL');
        this.index = language(['显示','静音','独奏'],['VIEW','MUTE','SOLO']);
        this.button = ['1','2','3','4'];
    }

    function editDynLang(){
        this.freq = language(['输入','输出','增益'],['IN','OUT','GR']);
        this.matrixButton = language(['旁通','重置','预制'],['BYPASS','RESET','PRESETS']);
        this.linBoxScale = ['20','10','0','-10','-20','-30','-40','-50','-60','-70','-80'];
        this.tabButton = language(['旁通','软拐点','重置'],['BYPASS','SOFT KNEE','RESET']);
        this.tabTitle = ['Gate','Compressor'];
        this.tabTitleMaster = ['PEAK','RMS'];
        this.gateTabFaderTitle = ['THRESHOLD','DEPTH','ATTCK','HOLD','RELEASE'];
        this.cpsTabFaderTitle = ['THRESHOLD','RATIO','ATTCK','HOLD','RELEASE'];
    }

    function ERLang(){
        this.echoButton = language(['回声','回声预设'],['ECHO','PRESETECHO']);
        this.reverbButton = language(['混响','混响预设'],['REVERB','PRESETEREVERB']);
        //this.modeSelect = language(['普通'],['ECHO_MONO','ECHO_STEREO','ECHO_ECHO']);
        this.modeSelect = ['ECHO_MONO','ECHO_STEREO','ECHO_ECHO'];
        this.roomSelect = ['SMALL ROOM','MIDDLE ROOM','BIG ROOM'];
        this.echoTabTitle = language(['延时','反馈比'],['DELAY','FEEDBACK RATIO']);
        this.tabButton = language(['回声','混响'],['ECHO','REVERB']);
        this.reverbTabTitle = language(['预延时','混响时间','反馈滤波'],['PREDELAY','REVERB TIME','FDBK FREQ']);
        this.tap = 'TAP';
        this.bpm = 'BPM';
    }

    function setSettingsLang(){
        this.globleTitle = language('全局设置','Globle Settings');
        this.globleIndex = language(['LR','独奏模式:','录音模式:','权限模式:','级联模式:'],['LR','Solo Mode:','Record Mode:','Power Mode:','Mixer Mode:']);
        this.globleButton = [
            language(['L','R'],['L','R']),
            language(['单一的','多样的'],['SINGLE','MULTIPLE']),
            ['24bit','36bit'],
            ['ALWAYSON','AUTOSTANDY'],
            language(['独立模式','立体声模式','左级联','右级联'],['STANDALONE','STEREO_STANDALONE','STEREO_CASCADE_L','STEREO_CASCADE_R'])
        ];
        this.localTitle = language('本地设置','Local Settings');
        this.localIndex = language(['Clip Hold:','缩放:','帧率级别:','语言:'],['Clip Hold:','Rescaling:','Frame Rate:','Language:']);
        this.localButton = [
            ['0s','1s','2s','3s','5s','8s','10s'],
            language(['开','关'],['ON','OFF']),
            [language('全部','FULL'),'1/2','1/3','1/4'],
            ['中文','ENGLISH']
        ];
    }

    function setSafesLang(){
        this.title = 'Local Safes';
        this.leftIndex = ['MIC/LINE:','','PLAY:','FX:','AUX:','SUB:','RECORD:',''];
        this.leftButton = [
            ['GULTAR\nCH1','GULTAR\nCH2','GULTAR\nCH3','GULTAR\nCH4'],
            ['GULTAR\nCH5','GULTAR\nCH6','GULTAR\nCH7','GULTAR\nCH8'],
            ['DLAN\nPLAY-L','DLAN\nPLAY-R'],
            ['REVERD','ECHO'],
            ['1#ROOM\nAUX1','1#ROOM\nAUX2'],
            ['3#ROOM\nSUB1','4#ROOM\nSUB2'],
            ['RECORD-L\nREC-L','RECORD-L\nREC-R'],
            ['MASTER']
        ];
        this.rightIndex = ['Mute Group:','Solo Group:','Player:',''];
        this.rightButton = [
            ['MUTE\nGROUP1','MUTE\nGROUP2','MUTE\nGROUP3','MUTE\nGROUP4'],
            ['SOLO\nGROUP1','SOLO\nGROUP2','SOLO\nGROUP3','SOLO\nGROUP4'],
            ['PLAYER','RECORDER'],
            ['SCENE','SETTINGS','NETWORK']
        ];
    }

    function setUserLang(){
        this.userTitle = 'User';
        this.accountTitle = 'Account';
        this.authorizationTitle = 'Authorization';
        this.userButton = ['NEW','COPY','REMOVE','CLEAR'];
        this.accountIndex = ['Name:','Password:','Repeat:'];
        this.accountButton = ['RESET','SAVE'];
        this.authorizationRadioButton = [
            ['ADMIN','OPERATOR'],
            ['CH1','CH2','CH3','CH4'],
            ['CH5','CH6','CH7','CH8'],
            ['REVERB','ECHO'],
            ['PLAYER-L','PLAYER-R','REC-L','REC-R'],
            ['AUX1','AUX2','SUB1','SUB2'],
            ['PLAYER','RECORDER','MASTER'],
            ['GROUP','SETUP']
        ];
        this.authorizationButton = ['CLEAR','ALL','RESET','SAVE'];
        this.userSeqment = ['No','Name','Role','State']
    }

    function setNetworkLang(){
        this.lanTitle = 'Lan';
        this.staTitle = 'WLAN';
        this.apTitle = 'IP';
        this.modeTitle = language('模式:','Mode:');
        this.mode = language(['从机','主机'],['SLAVE','MASTER']);
        this.lanIndex = ['IP:','MAX:','Gate:','Sub Mask:','DNS Sever:'];
        this.staIndex = ['ENEWAVE','可用网络','ENEWAVE','Office','ENEWAVE2'];
        this.modeIndex = language(['模式:','SSID:','To SSID:'],['Mode:','SSID:','To SSID:']);
        //this.apIndex = ['IP:','SSID:','Channel:','Verify:','SN:'];
        this.apIndex = ['IP1:','IP2:','Mode:','Self SSID:','Password','To SSID:','Password'];
        this.cancel = 'CANCEL';
        this.save = 'SAVE';
        this.ethernetBnt = 'ETHERNET';
        //this.pswdPopupTitle = language('请输入密码','Please input a password');
        this.pswdPopupTitle = '请输入密码';
        this.staBnt = 'STA';
        this.sureBnt = language('确定','OK');
        this.advanceBnt = 'ADVANCE';
        this.apBnt = 'AP';
        this.staListBnt = 'STA LIST';
        this.iptPlaceholder = ['请输入SSID','请输入密码','请输入SSID','请输入密码']
    }

    function setUpgradeLang(){
        this.content = ['VERISON:','MODEL：RAY BOOM 2.0','SERIAL：MH58-5662-JU65-HUR9','FIRMWARE：DASHB011582.0','UID：5562262503'];
        this.reboot = 'Reboot after operation';
        this.button = language(['确定','取消'],['OK','CANCEL']);
    }

    function setAboutLang(){
        this.title = '版权声明';
        this.content = '本样板的所有内容，包括文字、图片,均为原创。对未经许可擅自使用者，本公司保留追究其法律责任的权利。';
        this.contactWay = ['WEB：www.enewave.com','SALAS SERVICE：0755-68258888','AFTER-SALAS SERVICE：0755-68258888'];
    }

    function sceneLang(){
        this.tab = ['SCENE'];
        this.select = {
            title : 'Selection',
            name : 'Name:',
            creator : 'Creator:',
            description : 'Description',
            applyButton : ['APPLY','NEW','EDIT'],
            editButton : ['CANCEL','SAVE'],
            index : '002',
            hook : '✔'
        };
        this.memory = {
            title : 'Memory',
            button : ['IMPORT','EXPORT','EXPORT ALL','DELETE','CLEAR ALL','COPY'],
            seqment : ['NO','Name','Creator','Description','Date&Time']
        }
    }

    function groupLang(){
        this.tab = ['VIEW','MUTE','SOLO'];
        this.index = ['Input :','','Play :','FX :','AUX :','Sub :','Record:'];
        this.group = ['1','2','3','4'];
        this.button = ['CLEAR','ALL'];
        this.radioButton = [
            ['GUITAR\nCH1','GUITAR\nCH2','GUITAR\nCH3','GUITAR\nCH4'],
            ['GUITAR\nCH5','GUITAR\nCH6','GUITAR\nCH7','GUITAR\nCH8'],
            ['DLAN\nPLAY-L','DLAN\nPLAY-R'],
            ['REVERB','ECHO'],
            ['1#ROOM\nAUX1','2#ROOM\nAUX2'],
            ['3#ROOM\nSUB1','4#ROOM\nSUB2'],
            ['RECORD-L\nREC-L','RECORD-R\nREC-R']
        ]
    }

    function sendsLang(){
        //this.tab = ['AUX1','AUX2','SUB1','SUB2','REC-L','RED-R','REVERB','ECHO'];
        this.tab = ['REVERB','ECHO'];
    }

    function loginLang(){
        this.label = ['name:','password'];
        this.cancel = 'CANCEL';
        this.login = 'LOGIN';
        this.title = 'Login';
        this.outPrompt = '退出或者切换账户';
        this.signOut = 'SIGN OUT';
        this.switcher = 'SWITCH USER';
    }

    function chPopupLang(){
        this.buttonText = ['Guitar','Rename','Color','Copy Settings','Paste Settings','Reset Channel','Link Next Channel','Unlink Channel','Safety'];
    }

    return {
        title : new titleLang(),
        nav : new navLang(),
        eq : new editEqLang(),
        set : new setLang(),
        faderBox : new faderLang(),
        edit : new editLang(),
        editPort : new editPortsLang(),
        editSends : new editSendsLang(),
        editGroup : new editGroupLang(),
        editDyn : new editDynLang(),
        setSettings : new setSettingsLang(),
        setSafes : new setSafesLang(),
        setUser  : new setUserLang(),
        setNetwork : new setNetworkLang(),
        setUpgrade : new setUpgradeLang(),
        setAbout : new setAboutLang(),
        scene : new sceneLang(),
        group : new groupLang(),
        sends : new sendsLang(),
        login : new loginLang(),
        chPopup : new chPopupLang(),
        ER : new ERLang()
    };
})();

var a = 0;
var channeTabID = {
/*0*/    index : a++,
/**/    ch : a++,
/**/    enable : a++,
/**/    solo : a++,
/**/    mute : a++,
/**/    gain : a++,
/**/    mixerpan : a++,
/**/    bypass : a++,
/**/    phase : a++,
/**/    phase_phantom_power : a++,
/*10*/    phase_gain : a++,
/**/    phase_direct_ratio : a++,
/**/    phase_echo_ratio : a++,
/**/    phase_reverb_ratio : a++,
/**/    phase_pan : a++,
/**/    phase_freq_shift : a++,
/**/    EQ : a++,
/**/    eq_bypass : a++,
/**/    eq_high_pass_filter : a++,
/**/    eq_high_bypass : a++,
/*20*/    eq_mute : a++,
/**/    eq_pre_order : a++,
/**/    eq_max_order : a++,
/**/    eq_response : a++,
/**/    eq_filter_method : a++,
/**/    eq_freq : a++,
/**/    eq_Q : a++,
/**/    eq_dot_1 : a++,
/**/    eq_bypass_1 : a++,
/**/    eq_response_1 : a++,
/*30*/    eq_gain_1 : a++,
/**/    eq_freq_1: a++,
/**/    eq_Q_1 : a++,
/**/    eq_type_1 : a++,
/**/    eq_dot_2 : a++,
/**/    eq_bypass_2 : a++,
/**/    eq_response_2 : a++,
/**/    eq_gain_2 : a++,
/**/    eq_freq_2 : a++,
/**/    eq_Q_2 : a++,
/*40*/    eq_type_2 : a++,
/**/    eq_dot_3 : a++,
/**/    eq_bypass_3 : a++,
/**/    eq_response_3 : a++,
/**/    eq_gain_3 : a++,
/**/    eq_freq_3 : a++,
/**/    eq_Q_3 : a++,
/**/    eq_type_3 : a++,
/**/    eq_dot_4 : a++,
/**/    eq_bypass_4 : a++,
/*50*/    eq_response_4 : a++,
/**/    eq_gain_4 : a++,
/**/    eq_freq_4 : a++,
/**/    eq_Q_4 : a++,
/**/    type_4 : a++,
/**/    echo : a++,
/**/    echo_bypass : a++,
/**/    pre_delay : a++,
/**/    delay : a++,
/**/    repeat_ratio : a++,
/*60*/    echo_type : a++,
/**/    reverb : a++,
/**/    reverb_bypass : a++,
/**/    predelay : a++,
/**/    time : a++,
/**/    freq : a++,
/**/    type : a++,
/**/    gate_compress : a++,
/**/    gate_al_bypass : a++,
/**/    gate_level : a++,
/*70*/    gate_gain : a++,
/**/    compresss_level : a++,
/**/    compresss_gain : a++,
/**/    gate_bypass : a++,
/**/    gate_threshold : a++,
/**/    gate_depth : a++,
/**/    gate_attck : a++,
/**/    gate_hold : a++,
/**/    gate_release : a++,
/**/    cps_bypass : a++,
/*80*/    cps_threshold : a++,
/**/    cps_ratio : a++,
/**/    cps_attck : a++,
/**/    cps_hold : a++,
/**/    cps_release    : a++
};

a = 0;
var mainTabID = {
/*0*/   index :  a++,
/*1*/    audio_mode :  a++,
/*2*/    router :  a++,
/*3*/    mixermode :  a++,
/*4*/    limiter :  a++,
/*5*/    limiter_bypass :  a++,
/*6*/    level :  a++,
/*7*/    threshold :  a++,
/*8*/    attck :  a++,
/*9*/    release :  a++,
/*10*/    clip_level :  a++,
/*11*/     clip_release :  a++,
/*12*/     compress_limiter :  a++,
/*13*/     compress_H_bypass :  a++,
/*14*/     compress_level_H :  a++,
/*15*/     compress_gain_H :  a++,
/*16*/     peak_level_H :  a++,
/*17*/     peak_gain_H :  a++,
/*18*/     compress_threshold_H :  a++,
/*19*/     compress_ratio_H :  a++,
/*20*/     compress_attck_H :  a++,
/*21*/     compress_hold_H :  a++,
/*22*/     compress_release_H :  a++,
/*23*/     limit_threshold_H :  a++,
/*24*/     limit_ratio_H :  a++,
/*25*/     limit_attck_H :  a++,
/*26*/     limit_hold_H :  a++,
/*27*/     limit_release_H :  a++,
/*28*/     compress_L_bypass :  a++,
/*29*/     compress_level_L :  a++,
/*30*/     compress_gain_L :  a++,
/*31*/     peak_level_L :  a++,
/*32*/     peak_gain_L :  a++,
/*33*/     compress_threshold_L :  a++,
/*34*/     compress_ratio_L :  a++,
/*35*/     compress_attck_L :  a++,
/*36*/     compress_hold_L :  a++,
/*37*/     compress_release_L :  a++,
/*38*/     limit_threshold_L :  a++,
/*39*/     limit_ratio_L :  a++,
/*40*/     limit_attck_L :  a++,
/*41*/     limit_hold_L :  a++,
/*42*/     limit_release_L :  a++,
/*43*/     delay :  a++,
/*44*/     delay_bypass :  a++,
/*45*/     mute :  a++,
/*46*/     gain :  a++,
/*47*/     time :  a++,
/*48*/     length :  a++,
/*49*/     high_pass_filter :  a++,
/*50*/     high_pass_bypass_1 :  a++,
/*51*/     high_pass_mute_1 :  a++,
/*52*/     high_pass_pre_order_1 :  a++,
/*53*/     high_pass_max_order_1 :  a++,
/*54*/     high_pass_response_1 :  a++,
/*55*/     high_pass_filter_method_1 :  a++,
/*56*/     high_pass_freq_1 :  a++,
/*57*/     high_pass_Q_1 :  a++,
/*58*/     high_pass_bypass_2 :  a++,
/*59*/     high_pass_mute_2 :  a++,
/*60*/     high_pass_pre_order_2 :  a++,
/*61*/     high_pass_max_order_2 :  a++,
/*62*/     high_pass_response_2 :  a++,
/*63*/     high_pass_filter_method_2 :  a++,
/*64*/     high_pass_freq_2 :  a++,
/*65*/     high_pass_Q_2 :  a++,
/*66*/     low_pass_filter :  a++,
/*67*/     low_pass_bypass_1 :  a++,
/*68*/     low_pass_mute_1 :  a++,
/*69*/     low_pass_pre_order_1 :  a++,
/*70*/     low_pass_max_order_1 :  a++,
/*71*/     low_pass_response_1 :  a++,
/*72*/     low_pass_filter_method_1 :  a++,
/*73*/     low_pass_freq_1 :  a++,
/*74*/     low_pass_Q_1 :  a++,
/*75*/     low_pass_bypass_2 :  a++,
/*76*/     low_pass_mute_2 :  a++,
/*77*/     low_pass_pre_order_2 :  a++,
/*78*/     low_pass_max_order_2 :  a++,
/*79*/     low_pass_response_2 :  a++,
/*80*/     low_pass_filter_method_2 :  a++,
/*81*/     low_pass_freq_2 :  a++,
/*82*/     low_pass_Q_2 :  a++,
/*83*/     graphic_EQ :  a++,
/*84*/     graphic_EQ_bypass :  a++,
/*85*/     graphic_EQ_response_1 :  a++,
/*86*/     graphic_EQ_freq_1 :  a++,
/*87*/     graphic_EQ_gain_1 :  a++,
/*88*/     graphic_EQ_Q_1 :  a++,
/*89*/     graphic_EQ_response_2 :  a++,
/*90*/     graphic_EQ_freq_2 :  a++,
/*91*/     graphic_EQ_gain_2 :  a++,
/*92*/     graphic_EQ_Q_2 :  a++,
/*93*/     graphic_EQ_response_3 :  a++,
/*94*/     graphic_EQ_freq_3 :  a++,
/*95*/     graphic_EQ_gain_3 :  a++,
/*96*/     graphic_EQ_Q_3 :  a++,
/*97*/     graphic_EQ_response_4 :  a++,
/*98*/     graphic_EQ_freq_4 :  a++,
/*99*/     graphic_EQ_gain_4 :  a++,
/*100*/     graphic_EQ_Q_4 :  a++,
/*101*/     graphic_EQ_response_5 :  a++,
/*102*/     graphic_EQ_freq_5 :  a++,
/*103*/     graphic_EQ_gain_5 :  a++,
/*104*/     graphic_EQ_Q_5 :  a++,
/*105*/     graphic_EQ_response_6 :  a++,
/*106*/     graphic_EQ_freq_6 :  a++,
/*107*/     graphic_EQ_gain_6 :  a++,
/*108*/     graphic_EQ_Q_6 :  a++,
/*109*/     graphic_EQ_response_7 :  a++,
/*110*/     graphic_EQ_freq_7 :  a++,
/*111*/     graphic_EQ_gain_7 :  a++,
/*112*/     graphic_EQ_Q_7 :  a++,
/*113*/     graphic_EQ_response_8 :  a++,
/*114*/     graphic_EQ_freq_8 :  a++,
/*115*/     graphic_EQ_gain_8 :  a++,
/*116*/     graphic_EQ_Q_8 :  a++,
/*117*/     graphic_EQ_response_9 :  a++,
/*118*/     graphic_EQ_freq_9 :  a++,
/*119*/     graphic_EQ_gain_9 :  a++,
/*120*/     graphic_EQ_Q_9 :  a++,
/*121*/     graphic_EQ_response_10 :  a++,
/*122*/     graphic_EQ_freq_10 :  a++,
/*123*/     graphic_EQ_gain_10 :  a++,
/*124*/     graphic_EQ_Q_10 :  a++,
/*125*/     graphic_EQ_response_11 :  a++,
/*126*/     graphic_EQ_freq_11 :  a++,
/*127*/     graphic_EQ_gain_11 :  a++,
/*128*/     graphic_EQ_Q_11 :  a++,
/*129*/     graphic_EQ_response_12 :  a++,
/*130*/     graphic_EQ_freq_12 :  a++,
/*131*/     graphic_EQ_gain_12 :  a++,
/*132*/     graphic_EQ_Q_12 :  a++,
/*133*/     graphic_EQ_response_13 :  a++,
/*134*/     graphic_EQ_freq_13 :  a++,
/*135*/     graphic_EQ_gain_13 :  a++,
/*136*/     graphic_EQ_Q_13 :  a++,
/*137*/     graphic_EQ_response_14 :  a++,
/*138*/     graphic_EQ_freq_14 :  a++,
/*139*/     graphic_EQ_gain_14 :  a++,
/*140*/     graphic_EQ_Q_14 :  a++,
/*141*/     graphic_EQ_response_15 :  a++,
/*142*/     graphic_EQ_freq_15 :  a++,
/*143*/     graphic_EQ_gain_15 :  a++,
/*144*/     graphic_EQ_Q_15 :  a++,
/*145*/     EQ_param_EQ :  a++,
/*146*/     param_EQ_bypass_H :  a++,
/*147*/     param_EQ_response_H_1 :  a++,
/*148*/     param_EQ_freq_H_1 :  a++,
/*149*/     param_EQ_gain_H_1 :  a++,
/*150*/     param_EQ_Q_H_1 :  a++,
/*151*/     param_EQ_response_H_2 :  a++,
/*152*/     param_EQ_freq_H_2 :  a++,
/*153*/     param_EQ_gain_H_2 :  a++,
/*154*/     param_EQ_Q_H_2 :  a++,
/*155*/    param_EQ_response_H_3 :  a++,
/*156*/    param_EQ_freq_H_3 :  a++,
/*157*/    param_EQ_gain_H_3 :  a++,
/*158*/    param_EQ_Q_H_3 :  a++,
/*159*/    param_EQ_response_H_4 :  a++,
/*160*/    param_EQ_freq_H_4 :  a++,
/**/    param_EQ_gain_H_4 :  a++,
/**/    param_EQ_Q_H_4 :  a++,
/**/    param_EQ_response_H_5 :  a++,
/**/    param_EQ_freq_H_5 :  a++,
/**/    param_EQ_gain_H_5 :  a++,
/**/    param_EQ_Q_H_5 :  a++,
/**/    param_EQ_response_H_6 :  a++,
/**/    param_EQ_freq_H_6 :  a++,
/**/    param_EQ_gain_H_6 :  a++,
/*170*/    param_EQ_Q_H_6 :  a++,
/**/    param_EQ_response_H_7 :  a++,
/**/    param_EQ_freq_H_7 :  a++,
/**/    param_EQ_gain_H_7 :  a++,
/**/    param_EQ_Q_H_7 :  a++,
/**/    param_EQ_response_H_8 :  a++,
/**/    param_EQ_freq_H_8 :  a++,
/**/    param_EQ_gain_H_8 :  a++,
/**/    param_EQ_Q_H_8 :  a++,
/**/    param_EQ_response_H_9 :  a++,
/*180*/    param_EQ_freq_H_9 :  a++,
/**/    param_EQ_gain_H_9 :  a++,
/**/    param_EQ_Q_H_9 :  a++,
/**/    param_EQ_response_H_10 :  a++,
/**/    param_EQ_freq_H_10 :  a++,
/**/    param_EQ_gain_H_10 :  a++,
/**/    param_EQ_Q_H_10 :  a++,
/**/    param_EQ_response_H_11 :  a++,
/**/    param_EQ_freq_H_11 :  a++,
/**/    param_EQ_gain_H_11 :  a++,
/*190*/    param_EQ_Q_H_11 :  a++,
/**/    param_EQ_response_H_12 :  a++,
/**/    param_EQ_freq_H_12 :  a++,
/**/    param_EQ_gain_H_12 :  a++,
/**/    param_EQ_Q_H_12 :  a++,
/**/    param_EQ_bypass_L :  a++,
/**/    param_EQ_response_L_1 :  a++,
/**/    param_EQ_freq_L_1 :  a++,
/**/    param_EQ_gain_L_1 :  a++,
/**/    param_EQ_Q_L_1 :  a++,
/*200*/    param_EQ_response_L_2 :  a++,
/**/    param_EQ_freq_L_2 :  a++,
/**/    param_EQ_gain_L_2 :  a++,
/**/    param_EQ_Q_L_2 :  a++,
/**/    param_EQ_response_L_3 :  a++,
/**/    param_EQ_freq_L_3 :  a++,
/**/    param_EQ_gain_L_3 :  a++,
/**/    param_EQ_Q_L_3 :  a++,
/**/    param_EQ_response_L_4 :  a++,
/**/    param_EQ_freq_L_4 :  a++,
/*210*/    param_EQ_gain_L_4 :  a++,
/**/    param_EQ_Q_L_4 :  a++,
/**/    param_EQ_response_L_5 :  a++,
/**/    param_EQ_freq_L_5 :  a++,
/**/    param_EQ_gain_L_5 :  a++,
/**/    param_EQ_Q_L_5 :  a++,
/**/    param_EQ_response_L_6 :  a++,
/**/    param_EQ_freq_L_6 :  a++,
/**/    param_EQ_gain_L_6 :  a++,
/**/    param_EQ_Q_L_6 :  a++,
/*220*/    param_EQ_response_L_7 :  a++,
/**/    param_EQ_freq_L_7 :  a++,
/**/    param_EQ_gain_L_7 :  a++,
/**/    param_EQ_Q_L_7 :  a++,
/**/    param_EQ_response_L_8 :  a++,
/**/    param_EQ_freq_L_8 :  a++,
/**/    param_EQ_gain_L_8 :  a++,
/**/    param_EQ_Q_L_8 :  a++,
/**/    param_EQ_response_L_9 :  a++,
/**/    param_EQ_freq_L_9 :  a++,
/*230*/    param_EQ_gain_L_9 :  a++,
/**/    param_EQ_Q_L_9 :  a++,
/**/    param_EQ_response_L_10 :  a++,
/**/    param_EQ_freq_L_10 :  a++,
/**/    param_EQ_gain_L_10 :  a++,
/**/    param_EQ_Q_L_10 :  a++,
/**/    param_EQ_response_L_11 :  a++,
/**/    param_EQ_freq_L_11 :  a++,
/**/    param_EQ_gain_L_11 :  a++,
/**/    param_EQ_Q_L_11 :  a++,
/*240*/    param_EQ_response_L_12 :  a++,
/**/    param_EQ_freq_L_12 :  a++,
/**/    param_EQ_gain_L_12 :  a++,
/**/    param_EQ_Q_L_12 :  a++
};

a = 0;
var setTableID = {
    index : a++,
    network_id : a++,
    language : a++
};

var Table = function(){
    this.ch  = channeTab();
    this.mn  = mainTab();
    this.set = setTab();
};

var channeTab = function(){
    var extTab = [
        new itemObj(0,'INDEX','索引号'),
        new itemObj(1,'CH','CH','#'),
        new itemObj(2,'ENABLE','使能','#'),
        new itemObj(3,'SOLO','独奏','#'),
        new itemObj(4,'MUTE','静音','#'),
        new itemObj(5,'GAIN','增益','dB'),
        new itemObj(6,'MIXERPAN','混合','#'),
        new itemObj(7,'BYPASS','旁通','#'),
        new itemObj(8,'PHASE','相位','#'),
        new itemObj(9,'PHANTOM POWER','幻象电源','#'),
        new itemObj(10,'GAIN','增益','dB'),
        new itemObj(11,'DIRECT RATIO','直通率','%'),
        new itemObj(12,'ECHO RATIO','回声率','%'),
        new itemObj(13,'REVERB RATIO','混响率','%'),
        new itemObj(14,'PAN','声相','L/R'),
        new itemObj(15,'FREQ SHIFT','移频','#'),
        new itemObj(16,'EQ','均衡器','#'),
        new itemObj(17,'BYPASS','旁通','#'),
        new itemObj(18,'HIGH PASS FILTER','高通滤波','#'),
        new itemObj(19,'BYPASS','旁通','#'),
        new itemObj(20,'MUTE','静音','#'),
        new itemObj(21,'PRE ORDER','阶数','#'),
        new itemObj(22,'MAX ORDER','最大阶数','#'),
        new itemObj(23,'RESPONSE','响应','#'),
        new itemObj(24,'FILTER METHOD','滤波方式','#'),
        new itemObj(25,'FREQ','频率','HZ'),
        new itemObj(26,'Q','Q值','#'),
        new itemObj(27,'DOT 1','控点1','#'),
        new itemObj(28,'BYPASS','旁通','#'),
        new itemObj(29,'RESPONSE','响应','#'),
        new itemObj(30,'GAIN','增益','dB'),
        new itemObj(31,'FREQ','频率','HZ'),
        new itemObj(32,'Q','Q值','#'),
        new itemObj(33,'TYPE','类型','#'),
        new itemObj(34,'DOT 2','控点2','#'),
        new itemObj(35,'BYPASS','旁通','#'),
        new itemObj(36,'RESPONSE','响应','#'),
        new itemObj(37,'GAIN','增益','dB'),
        new itemObj(38,'FREQ','频率','HZ'),
        new itemObj(39,'Q','Q值','#'),
        new itemObj(40,'TYPE','类型','#'),
        new itemObj(41,'DOT 3','控点3','#'),
        new itemObj(42,'BYPASS','旁通','#'),
        new itemObj(43,'RESPONSE','响应','#'),
        new itemObj(44,'GAIN','增益','dB'),
        new itemObj(45,'FREQ','频率','HZ'),
        new itemObj(46,'Q','Q值','#'),
        new itemObj(47,'TYPE','类型','#'),
        new itemObj(48,'DOT 4','控点4','#'),
        new itemObj(49,'BYPASS','旁通','#'),
        new itemObj(50,'RESPONSE','响应','#'),
        new itemObj(51,'GAIN','增益','dB'),
        new itemObj(52,'FREQ','频率','HZ'),
        new itemObj(53,'Q','Q值','#'),
        new itemObj(54,'TYPE','类型','#'),
        new itemObj(55,'ECHO','回声','#'),
        new itemObj(56,'BYPASS','旁通','#'),
        new itemObj(57,'PRE DELAY','预延时','MS'),
        new itemObj(58,'DELAY','延时','MS'),
        new itemObj(59,'REPEAT RATIO','重复率','#'),
        new itemObj(60,'TYPE','类型','#'),
        new itemObj(61,'REVERB','混响','#'),
        new itemObj(62,'BYPASS','旁通','#'),
        new itemObj(63,'PREDELAY','预延时','#'),
        new itemObj(64,'TIME','时间','#'),
        new itemObj(65,'FREQ','频率','HZ'),
        new itemObj(66,'TYPE','类型','#'),
        new itemObj(67,'COMPRESS','压缩门限','#'),
        new itemObj(68,'BYPASS','旁通','#'),
        new itemObj(69,'LEVEL','级别','#'),
        new itemObj(70,'GAIN','增益','dB'),
        new itemObj(71,'COMPRESSS LEVEL','级别','#'),
        new itemObj(72,'COMPRESSS GAIN','增益','dB'),
        new itemObj(73,'BYPASS','旁通','#'),
        new itemObj(74,'THRESHOLD','阈值','dB'),
        new itemObj(75,'DEPTH','深度','dB'),
        new itemObj(76,'ATTCK','启动','MS'),
        new itemObj(77,'HOLD','保持','MS'),
        new itemObj(78,'RELEASE','释放','MS'),
        new itemObj(79,'BYPASS','旁通','#'),
        new itemObj(80,'THRESHOLD','门限','dB'),
        new itemObj(81,'RATIO','比例','#'),
        new itemObj(82,'ATTCK','启动','MS'),
        new itemObj(83,'HOLD','保持','MS'),
        new itemObj(84,'RELEASE','释放','MS'),
    ];
    return extTab;
};

var mainTab = function(){
    var minTab = [
        new itemObj(0,'INDEX','索引号','#'),
        new itemObj(1,'AUDIO MODE','音频模式','#'),
        new itemObj(2,'ROUTER','路由','#'),
        new itemObj(3,'MIXERMODE','混合模式','#'),
        new itemObj(4,'LIMITER','限制器','#'),
        new itemObj(5,'BYPASS','旁通','#'),
        new itemObj(6,'LEVEL','级别','#'),
        new itemObj(7,'THRESHOLD','阈值','#'),
        new itemObj(8,'ATTCK','启动','#'),
        new itemObj(9,'RELEASE','释放','#'),
        new itemObj(10,'CLIP LEVEL','削波级别','#'),
        new itemObj(11,'CLIP RELEASE','削波释放','#'),
        new itemObj(12,'LIMITER','限制器','#'),
        new itemObj(13,'BYPASS','旁通','#'),
        new itemObj(14,'COMPRESS LEVEL','压缩级别','#'),
        new itemObj(15,'COMPRESS GAIN','压缩增益','dB'),
        new itemObj(16,'PEAK LEVEL','峰值级别','#'),
        new itemObj(17,'PEAK GAIN','峰值增益','dB'),
        new itemObj(18,'COMPRESS THRESHOLD','压缩阈值','#'),
        new itemObj(19,'COMPRESS RATIO','压缩率','%'),
        new itemObj(20,'COMPRESS ATTCK','压缩启动','#'),
        new itemObj(21,'COMPRESS HOLD','压缩保持','#'),
        new itemObj(22,'COMPRESS RELEASE','压缩释放','#'),
        new itemObj(23,'LIMIT THRESHOLD','限制阈值','dB'),
        new itemObj(24,'LIMIT RATIO','限制率','%'),
        new itemObj(25,'LIMIT ATTCK','限制启动','#'),
        new itemObj(26,'LIMIT HOLD','限制保持','#'),
        new itemObj(27,'LIMIT RELEASE','限制释放','#'),
        new itemObj(28,'BYPASS','旁通','#'),
        new itemObj(29,'COMPRESS LEVEL','压缩级别','#'),
        new itemObj(30,'COMPRESS GAIN','压缩增益','dB'),
        new itemObj(31,'PEAK LEVEL','峰值级别','#'),
        new itemObj(32,'PEAK GAIN','峰值增益','dB'),
        new itemObj(33,'COMPRESS THRESHOLD','压缩阈值','dB'),
        new itemObj(34,'COMPRESS RATIO','压缩率','%'),
        new itemObj(35,'COMPRESS ATTCK','压缩启动','#'),
        new itemObj(36,'COMPRESS HOLD','压缩保持','#'),
        new itemObj(37,'COMPRESS RELEASE','压缩释放','#'),
        new itemObj(38,'LIMIT THRESHOLD','限制阈值','#'),
        new itemObj(39,'LIMIT RATIO','限制率','%'),
        new itemObj(40,'LIMIT ATTCK','限制启动','#'),
        new itemObj(41,'LIMIT HOLD','限制保持','#'),
        new itemObj(42,'LIMIT RELEASE','限制释放','#'),
        new itemObj(43,'DELAY','延迟','MS'),
        new itemObj(44,'BYPASS','旁通','#'),
        new itemObj(45,'MUTE','静音','#'),
        new itemObj(46,'GAIN','增益','dB'),
        new itemObj(47,'TIME','时间','MS'),
        new itemObj(48,'LENGTH','长度','#'),
        new itemObj(49,'HIGH PASS FILTER','高通滤波','#'),
        new itemObj(50,'BYPASS','旁通','#'),
        new itemObj(51,'MUTE','静音','#'),
        new itemObj(52,'PRE ORDER','阶数','#'),
        new itemObj(53,'MAX ORDER','最大阶数','#'),
        new itemObj(54,'RESPONSE','响应','#'),
        new itemObj(55,'FILTER METHOD','滤波方式','#'),
        new itemObj(56,'FREQ','频率','HZ'),
        new itemObj(57,'Q','Q值','#'),
        new itemObj(58,'BYPASS','旁通','#'),
        new itemObj(59,'MUTE','静音','#'),
        new itemObj(60,'PRE ORDER','阶数','#'),
        new itemObj(61,'MAX ORDER','最大阶数'),
        new itemObj(62,'RESPONSE','响应方式','#'),
        new itemObj(63,'FILTER METHOD','滤波方式','#'),
        new itemObj(64,'FREQ','频率','HZ'),
        new itemObj(65,'Q','Q值','#'),
        new itemObj(66,'LOW PASS FILTER','低通滤波','#'),
        new itemObj(67,'BYPASS','旁通','#'),
        new itemObj(68,'MUTE','静音','#'),
        new itemObj(69,'PRE ORDER','阶数','#'),
        new itemObj(70,'MAX ORDER','最大阶数','#'),
        new itemObj(71,'RESPONSE','响应方式','#'),
        new itemObj(72,'FILTER METHOD','滤波方式','#'),
        new itemObj(73,'FREQ','频率','HZ'),
        new itemObj(74,'Q','Q值','#'),
        new itemObj(75,'BYPASS','旁通','#'),
        new itemObj(76,'MUTE','静音','#'),
        new itemObj(77,'PRE ORDER','阶数','#'),
        new itemObj(78,'MAX ORDER','最大阶数','#'),
        new itemObj(79,'RESPONSE','响应方式','#'),
        new itemObj(80,'FILTER METHOD','滤波方式','#'),
        new itemObj(81,'FREQ','频率','HZ'),
        new itemObj(82,'Q','Q值','#'),
        new itemObj(83,'GRAPHIC EQ','图形 EQ','#'),
        new itemObj(84,'BYPASS','旁通','#'),
        new itemObj(85,'RESPONSE','响应','#'),
        new itemObj(86,'FREQ','频率','HZ'),
        new itemObj(87,'GAIN','增益','dB'),
        new itemObj(88,'Q','Q值','#'),
        new itemObj(89,'RESPONSE','响应','#'),
        new itemObj(90,'FREQ','频率','HZ'),
        new itemObj(91,'GAIN','增益','dB'),
        new itemObj(92,'Q','Q值','#'),
        new itemObj(93,'RESPONSE','响应','#'),
        new itemObj(94,'FREQ','频率','HZ'),
        new itemObj(95,'GAIN','增益','dB'),
        new itemObj(96,'Q','Q值','#'),
        new itemObj(97,'RESPONSE','响应','#'),
        new itemObj(98,'FREQ','频率','HZ'),
        new itemObj(99,'GAIN','增益','dB'),
        new itemObj(100,'Q','Q值','#'),
        new itemObj(101,'RESPONSE','响应','#'),
        new itemObj(102,'FREQ','频率','HZ'),
        new itemObj(103,'GAIN','增益','dB'),
        new itemObj(104,'Q','Q值','#'),
        new itemObj(105,'RESPONSE','响应','#'),
        new itemObj(106,'FREQ','频率','HZ'),
        new itemObj(107,'GAIN','增益','dB'),
        new itemObj(108,'Q','Q值','#'),
        new itemObj(109,'RESPONSE','响应','#'),
        new itemObj(110,'FREQ','频率','HZ'),
        new itemObj(111,'GAIN','增益','dB'),
        new itemObj(112,'Q','Q值','#'),
        new itemObj(113,'RESPONSE','响应','#'),
        new itemObj(114,'FREQ','频率','HZ'),
        new itemObj(115,'GAIN','增益','dB'),
        new itemObj(116,'Q','Q值','#'),
        new itemObj(117,'RESPONSE','响应','#'),
        new itemObj(118,'FREQ','频率','HZ'),
        new itemObj(119,'GAIN','增益','dB'),
        new itemObj(120,'Q','Q值','#'),
        new itemObj(121,'RESPONSE','响应','#'),
        new itemObj(122,'FREQ','频率','HZ'),
        new itemObj(123,'GAIN','增益','dB'),
        new itemObj(124,'Q','Q值','#'),
        new itemObj(125,'RESPONSE','响应','#'),
        new itemObj(126,'FREQ','频率','HZ'),
        new itemObj(127,'GAIN','增益','dB'),
        new itemObj(128,'Q','Q值','#'),
        new itemObj(129,'RESPONSE','响应','#'),
        new itemObj(130,'FREQ','频率','HZ'),
        new itemObj(131,'GAIN','增益','dB'),
        new itemObj(132,'Q','Q值','#'),
        new itemObj(133,'RESPONSE','响应','#'),
        new itemObj(134,'FREQ','频率','HZ'),
        new itemObj(135,'GAIN','增益','dB'),
        new itemObj(136,'Q','Q值','#'),
        new itemObj(137,'RESPONSE','响应','#'),
        new itemObj(138,'FREQ','频率','HZ'),
        new itemObj(139,'GAIN','增益','dB'),
        new itemObj(140,'Q','Q值','#'),
        new itemObj(141,'RESPONSE','响应','#'),
        new itemObj(142,'FREQ','频率','HZ'),
        new itemObj(143,'GAIN','增益','dB'),
        new itemObj(144,'Q','Q值','#'),
        new itemObj(145,'PARAM EQ','参数EQ','#'),
        new itemObj(146,'BYPASS','旁通','#'),
        new itemObj(147,'RESPONSE','响应','#'),
        new itemObj(148,'FREQ','频率','HZ'),
        new itemObj(149,'GAIN','增益','dB'),
        new itemObj(150,'Q','Q值','#'),
        new itemObj(151,'RESPONSE','响应','#'),
        new itemObj(152,'FREQ','频率','HZ'),
        new itemObj(153,'GAIN','增益','dB'),
        new itemObj(154,'Q','Q值','#'),
        new itemObj(155,'RESPONSE','响应','#'),
        new itemObj(156,'FREQ','频率','HZ'),
        new itemObj(157,'GAIN','增益','dB'),
        new itemObj(158,'Q','Q值','#'),
        new itemObj(159,'RESPONSE','响应','#'),
        new itemObj(160,'FREQ','频率','HZ'),
        new itemObj(161,'GAIN','增益','dB'),
        new itemObj(162,'Q','Q值','#'),
        new itemObj(163,'RESPONSE','响应','#'),
        new itemObj(164,'FREQ','频率','HZ'),
        new itemObj(165,'GAIN','增益','dB'),
        new itemObj(166,'Q','Q值','#'),
        new itemObj(167,'RESPONSE','响应','#'),
        new itemObj(168,'FREQ','频率','HZ'),
        new itemObj(169,'GAIN','增益','dB'),
        new itemObj(170,'Q','Q值','#'),
        new itemObj(171,'RESPONSE','响应','#'),
        new itemObj(172,'FREQ','频率','HZ'),
        new itemObj(173,'GAIN','增益','dB'),
        new itemObj(174,'Q','Q值','#'),
        new itemObj(175,'RESPONSE','响应','#'),
        new itemObj(176,'FREQ','频率','HZ'),
        new itemObj(177,'GAIN','增益','dB'),
        new itemObj(178,'Q','Q值','#'),
        new itemObj(179,'RESPONSE','响应','#'),
        new itemObj(180,'FREQ','频率','HZ'),
        new itemObj(181,'GAIN','增益','dB'),
        new itemObj(182,'Q','Q值','#'),
        new itemObj(183,'RESPONSE','响应','#'),
        new itemObj(184,'FREQ','频率','HZ'),
        new itemObj(185,'GAIN','增益','dB'),
        new itemObj(186,'Q','Q值','#'),
        new itemObj(187,'RESPONSE','响应','#'),
        new itemObj(188,'FREQ','频率','HZ'),
        new itemObj(189,'GAIN','增益','dB'),
        new itemObj(190,'Q','Q值','#'),
        new itemObj(191,'RESPONSE','响应','#'),
        new itemObj(192,'FREQ','频率','HZ'),
        new itemObj(193,'GAIN','增益','dB'),
        new itemObj(194,'Q','Q值','#'),
        new itemObj(195,'BYPASS','旁通','#'),
        new itemObj(196,'RESPONSE','响应','#'),
        new itemObj(197,'FREQ','频率','HZ'),
        new itemObj(198,'GAIN','增益','dB'),
        new itemObj(199,'Q','Q值','#'),
        new itemObj(200,'RESPONSE','响应','#'),
        new itemObj(201,'FREQ','频率','HZ'),
        new itemObj(202,'GAIN','增益','dB'),
        new itemObj(203,'Q','Q值','#'),
        new itemObj(204,'RESPONSE','响应','#'),
        new itemObj(205,'FREQ','频率','HZ'),
        new itemObj(206,'GAIN','增益','dB'),
        new itemObj(207,'Q','Q值','#'),
        new itemObj(208,'RESPONSE','响应','#'),
        new itemObj(209,'FREQ','频率','HZ'),
        new itemObj(210,'GAIN','增益','dB'),
        new itemObj(211,'Q','Q值','#'),
        new itemObj(212,'RESPONSE','响应','#'),
        new itemObj(213,'FREQ','频率','HZ'),
        new itemObj(214,'GAIN','增益','dB'),
        new itemObj(215,'Q','Q值','#'),
        new itemObj(216,'RESPONSE','响应','#'),
        new itemObj(217,'FREQ','频率','HZ'),
        new itemObj(218,'GAIN','增益','dB'),
        new itemObj(219,'Q','Q值','#'),
        new itemObj(220,'RESPONSE','响应','#'),
        new itemObj(221,'FREQ','频率','HZ'),
        new itemObj(222,'GAIN','增益','dB'),
        new itemObj(223,'Q','Q值','#'),
        new itemObj(224,'RESPONSE','响应','#'),
        new itemObj(225,'FREQ','频率','HZ'),
        new itemObj(226,'GAIN','增益','dB'),
        new itemObj(227,'Q','Q值','#'),
        new itemObj(228,'RESPONSE','响应','#'),
        new itemObj(229,'FREQ','频率','HZ'),
        new itemObj(230,'GAIN','增益','dB'),
        new itemObj(231,'Q','Q值','#'),
        new itemObj(232,'RESPONSE','响应','#'),
        new itemObj(233,'FREQ','频率','HZ'),
        new itemObj(234,'GAIN','增益','dB'),
        new itemObj(235,'Q','Q值','#'),
        new itemObj(236,'RESPONSE','响应','#'),
        new itemObj(237,'FREQ','频率','HZ'),
        new itemObj(238,'GAIN','增益','dB'),
        new itemObj(239,'Q','Q值','#'),
        new itemObj(240,'RESPONSE','响应','#'),
        new itemObj(241,'FREQ','频率','HZ'),
        new itemObj(242,'GAIN','增益','dB'),
        new itemObj(243,'Q','Q值','#')
    ];
    return minTab;
};

var setTab = function(){
    var setTab = [
        new itemObj(0,'INDEX','索引号','#'),
        new itemObj(0,'INDEX','索引号','#'),
        new itemObj(1,'NETWORK ID','网络ID','#'),
        new itemObj(2,'LANGUAGE','语言','#')
    ];
    return setTab;
};

function itemObj(id,en,cn,unit){
    this.id = id;
    this.en = en;
    this.cn = cn;
    if(unit == '#' || unit == ''){
        this.unit = '';
    }else{
        this.unit = unit;
    }
}
var staticDataColor = (function(){
    /*button的默认、弹起、按下时的颜色*/
    function buttonColor(){
        this.down = 0xB22222;
        this.up = 0x9ACD32;
        this.def = 0x9ACD32;
    }
    /*slider的颜色*/
    function sliderColor(){
        /*背景颜色*/
        this.backGroundColor = 0x7D7D7D;
        /*随着按钮滑动而改变长度是的颜色*/
        this.color = '#2d3521';
        /*按钮内环的颜色*/
        this.buttonColor1 = 0x698B22;
        /*按钮外环的颜色*/
        this.buttonColor2 = 0xFFFFFF;
    }
    /*title的颜色*/
    function titleColor(){
        /*背景颜色*/
        this.backGroundColor = '#B7B7B7';
        /*各部分的背景颜色*/
        this.boxColor = 0x000000;
        /*线的颜色*/
        this.lineColor = '#000000';

        this.text = new titleTextColor();
    }

    function navColor(){
        this.text = 0xb1b1b1;
        this.textDown = 'white';
        this.background = 0x373740;
    }
    /*title里面的文字的颜色，主要为中间部分的颜色*/
    function titleTextColor(){
        this.display = 'black';
        this.input = 'white';
        this.mode = 'white';
        this.index = '#b1b1b1';
        this.indexLight = '#00cb13';
        this.user = '#c9c9c9';
        this.scene = 'white';
        this.info = '#c9c9c9';
        this.temp = '#ff7200'
    }
    /*fader的颜色*/
    function faderColor(){
        /*一个通道的背景颜色*/
        this.backGroundColor = 0x373740;
        this.backGroundColorDown = 0x4c4c56;
        /*左边11个通道的背景颜色*/
        this.boxColor = 0x292929;
        /*设置跟随phase页面gain slider而动的button的颜色*/
        this.tuningPanelBg = 0x000;
        this.tuningPanelButton = 0x123123;
        this.tuningPanelButtonBg = 0xFFFFFF;
        this.border = 0x000000;
        /*ch按钮的颜色*/
        this.chUp = 0xFFFFFF;
        this.chDown = 0x9900ff;
        this.chLink = 0x009e0f;
        /*slider按钮的背景颜色*/
        this.buttonBg = 0x000;
        /*跳转到phase,lim,eq界面的按钮的颜色*/
        this.boxButton = '#FFFFFF';
        /*跳转到lim页面的里面的两条矩形框的背景颜色*/
        this.limBox = '#CD3700';
        this.line = '#848484';
        /*随着频率跳动的颜色*/
        this.skip = [{pos:0,color:'#791416'},{pos:.25,color:'#6f512a'},{pos:.25,color:'#4e6d2a'},{pos:1,color:'#2a481d'}];
        this.skipLight = [{pos:0,color:'#f00302'},{pos:.25,color:'#c9a829'},{pos:.25,color:'#8dda29'},{pos:1,color:'#358509'}];
        this.flute = [{pos:0,color:'#1d1d21'},{pos:.5,color:'#24242a'},{pos:1,color:'#1d1d21'}];
        this.skipTop = '#74171a';
        this.skipTopLight = '#ed0303';
        this.skipBg = 0x242329;
        this.eqLine = 0x666669;
        this.groove1 = 0x179003;
        this.groove2 = 0xd07202;
        this.text = new faderTextColor();
    }

    function faderTextColor(){
        /*48v的字体颜色*/
        this.vText = '#898989';
        /*∅的字体颜色*/
        this.empty = '#898989';
        /*数字刻度的颜色*/
        this.num = '#898989';
        /*phase页面按钮按下后的颜色*/
        this.vTextDown = 'red';
        this.emptyDown = 'red';
        /*mute.solo.ch按钮的字体*/
        this.mute = 0xb1b1b1;
        this.solo = this.mute;
        this.muteDown = '#ee2626';
        this.soloDown = '#cb8f00';
        this.ch = ['#b1b1b1','#f2fdf3'];
        this.skipBg = 0x24242a;
        this.status = 0xb1b1b1;
    }
    /*主输出的颜色*/
    function mainColor(){
        /*背景色*/
        this.backGroundColor = '#373740';
        /*slider的背景*/
        this.sliderBg = 0x123123;
        /*主输出*/
        this.printOut = 0x000000;
        /*slider的box*/
        this.lineBox = 0x000000;
        this.line = 0x719f00;
        this.text = new mainTextColor();
        this.faderBg = 0x373740;
        this.faderSelectBg = 0x4c4c56;
        this.status = 0x24242a;
    }

    function mainTextColor(){
        /*主输出的字体*/
        this.print = 'white';
        this.button = 'black';
        this.num = 'green';
    }
    /*设置页面的颜色*/
    function setColor(){
        this.backgroundColor = 0x373740;
        this.titleButton = 0x6d6d6d;
        this.titleButtonDown = 0x99d003;
        this.line = 0xFFFFFF;
        this.inputBox = 0x000;
        this.info = 0x000;
        this.showDevice = 0x000;
        this.updateBnt = 0x99d003;
        this.text = new setTextColor();
    }

    function setTextColor(){
        this.info = 'white';
        this.communicate = 'white';
        this.keepButton = 'black';
        this.title = 'black';
        this.titleWork = 'black';
    }

    function editColor(){
        this.background = 0x373740;
        this.navText = ['#b1b1b1','#f2fdf3'];
        this.switcher = ['#b1b1b1','#f2fdf3'];
    }

    function ERColor(){
        this.background = 0x373740;
        this.box = 0x22222b;
        this.triangle = 0xb1b1b1;
        this.text = new ERTextColor();
    }

    function ERTextColor(){
        this.muteBnt = ['#b1b1b1','#ee2626'];
        this.button = ['#b1b1b1','#00cb13'];
        this.faderTitle = '#b1b1b1';
        this.statusTitle = 'white';
        this.tap = '#247f2c';
    }

    /*回声混响页面*/
    function echoColor(){
        this.backGroundColor = 0xB7B7B7;
        this.singleChannel = 0x8b8b8b;
        this.chooseRoomBnt = 0x8b8b8b;
        this.echoSet = 0x8b8b8b;
        this.reverbSet = 0x8b8b8b;
        this.triangle1 = 0xFFFFFF;
        this.triangle2 = 0x123123;
        this.bntBox = 0x000000;
        this.pulleyBox = 0x131315;
        this.slider = 0x424240;
        this.fader = 0x123123;
        this.selectLine = 0x838383;
        this.selectBg = 0xFFFFFF;
        this.setPopup = new echoSetPopup();
        this.text = new echoTextColor();
    }

    function echoSetPopup(){
        this.title = 0x123123;
        this.save = 0xFFFFFF;
        this.import = 0xFFFFFF;
        this.userSet = 0x123123;
        this.startSet = 0x123123;
        this.startSetBox = 0xFFFFFF;
        this.text = new echoSetPopupTextColor();
    }

    function echoSetPopupTextColor(){
        this.title = 'white';
        this.save = 'grey';
        this.import = 'grey';
        this.userSet = 'white';
        this.startSet = 'grey';
    }

    function echoTextColor(){
        this.echo = 'white';
        this.reverb = 'white';
        this.tap = 'black';
        this.select = 'green';
        this.echoBnt = 'black';
        this.reverbBnt = 'black'
    }
    /*eq页面*/
    function editEqColor(){
        this.box = 0x373740;
        this.lineBox = 0x22222b;
        this.sliderBox = 0x22222b;
        this.line = '#787878';
        this.curClose = 0x787878;
        this.canvasLine = '#787878';
        this.circleBnt = 0xFFFFFF;
        this.bandBox = 0x22222b;
        this.curve = 0x44444a;
        this.curveLine = 0xffffff;
        this.canvasCurve = '#44444a';
        this.sliderScaleLine = '#898989';
        this.circleBnt = [0x5065d6,0x8d31bd,0xf46e02,0xc23838,0x3e932e,0x8d31bd,0xf46e02,0xc23838,0x3e932e,0x8d31bd,0xf46e02,0xc23838,0x3e932e,0x5065d6,0x5065d6];
        this.masterCurve = ['#5065d6','#8d31bd','#f46e02','#c23838','#3e932e','#8d31bd','#f46e02','#c23838','#3e932e','#8d31bd','#f46e02','#c23838','#3e932e','#5065d6','#5065d6'];
        this.bypassEvent = 0x8b8b8c;
        this.masterLight = 0x4c4c56;
        this.text = new eqTextColor();
    }

    function eqTextColor(){
        this.band = '#b1b1b1';
        this.bandStatus = '#FFFFFF';
        this.titleButton = 'black';
        this.bandButton = 'black';
        this.circleButton = 'white';
        this.scale = '#3a7d33';
        this.matrixButton = ['#b1b1b1','#00cb13'];
        this.tabTitle = ['#b1b1b1','#FFFFFF'];
    }
    /*phase页面*/
    function phaseColor(){
        this.backGroundColor = 0x123123;
        this.slider = 0x7d7d7d;
        this.line = 0xFFFFFF;
        this.gain = 0x698B22;
        this.freqShift = new freqShift();
        this.panLine = 0xb7b7b7;
        this.panBackGroundColor = 0xb7b7b7;
        this.panMove = 0x123123;
        this.panColor1 = 0x123123;
        this.panColor2 = 0xFFFFFF;
        this.text = new phaseTextColor();
    }

    function phaseTextColor(){
        this.button = 'black';
        this.text = 'white';
        this.num = 'white';
    }

    function freqShift(){
        this.backgroundColor = 0x24242a;
        this.backgroundBorderColor = 0x16161a;
        this.circle1 = 0x698B22;
        this.circle2 = 0x7D7D7D;
        this.circleDown1 = 0xFFFFFF;
        this.circleDown2 = 0x698B22;
    }
    /*DYN页面*/
    function editDynColor(){
        this.box = 0x373740;
        this.backGroundColor = 0xFFFFFF;
        this.lineBox = 0x000000;
        this.line = 0xFFFFFF;
        this.sliderBox = 0x22222b;
        this.tabTitle = ['#b1b1b1','#00cb13'];
        this.lineBoxLine = 0x575757;
        this.skipCenter = 0x730d11;
        this.circleBnt  = [0xf46e02,0x5065d6,0x8d31bd,0xc23838];
        this.bypassClick = 0x8b8b8c;
        this.bypass = new bypassColor();
        this.text = new dynTextColor();
    }

    function dynTextColor(){
        this.faderTitle = '#b1b1b1';
        this.statusTitle = 'white';
        this.button = 'black';
        this.circleBnt = 'black';
        this.freq = '#a8a8a8';
        this.linBoxScale = '#a8a8a8';
        this.matrixButton = ['#b1b1b1','#00cb13'];
    }

    function bypassColor(){
        this.button = 0xFFFFFF;
        this.backGroung = 0x289024;
        this.backGroungLine = 0x289024;
        this.backGroungAlpha = .3;
        this.triangle = 0x2d2d32;
        this.triangleAlpha = .3;
        this.backGroungEvent = 0x8b8b8c;
        this.backGroungLineEvent = 0x8b8b8c;
        this.text = new bypassTextColor();
    }

    function bypassTextColor(){
        this.num = 'white';
    }
    /*页面弹框*/
    function popupColor(){
        this.backGroundColor = 0x2f2f37;
        this.border = 0xFFFFFF;
        this.title = 0x1c1c22;
        this.buttonLight = 0x4e4e55;
        this.save = 0xFFFFFF;
        this.line = 0x9f9f9f;
        this.imgButton = 0xFFFFFF;
        this.button = 0xFFFFFF;
        this.colorButton = 0xFFFFFF;
        this.setButton = 0xFFFFFF;
        this.chooseColor = [0x969696,0xA2CD5A,0xCCCCCC,0x8968CD,0xDB7093,0x969696,0xA2CD5A,0xCCCCCC,0x8968CD,0xDB7093];
        this.text = new popupTextColor();
    }

    function popupTextColor(){
        this.title = 'black';
        this.save = 'black';
        this.imgButton = 'black';
        this.colorButton = 'black';
        this.setButton = 'black';
        this.button = 'white';
        this.ch = '#359033'
    }

    function editPortColor(){
        this.text = new portTextColor();
    }

    function portTextColor(){
        this.title = '#b1b1b1';
        this.status = [0xa8a8a8,0xebf8ed];
    }

    function editSendsColor(){
        this.text = new editSendsTextColor();
    }

    function editSendsTextColor(){
        this.faderTitle = '#232326';
        this.faderCh = '#f2f2f2';
    }

    function editGroupColor(){
        this.text = new editGroupTextColor();
    }

    function editGroupTextColor(){
        this.title = ['#b1b1b1','#00cb13'];
        this.index = '#b1b1b1';
        this.group = ['#b1b1b1','#FFFFFF']
    }

    function setSettingsColor(){
        this.text = new setSettingsTextColor();
    }

    function setSettingsTextColor(){
        this.title = '#eeeeee';
        this.index = '#b1b1b1';
        this.button = ['#b1b1b1','#f2fdf3'];
    }

    function setSafesColor(){
        this.text = new setSafesTextColor();
    }

    function setSafesTextColor(){
        this.title = '#eeeeee';
        this.index = '#b1b1b1';
        this.button = ['#b1b1b1','#f2fdf3'];
    }

    function setUserColor(){
        this.box = 0x373740;
        this.border = 0x000000;
        this.title = 0x22222b;
        this.text = new setUserTextColor();
    }

    function setUserTextColor(){
        this.title = '#b1b1b1';
        this.radioButton = ['#b1b1b1','#ebf8ed'];
        this.button = ['#a8a8a8','#07b919'];
        this.text = ['#a8a8a8'];
    }

    function setNetworkColor(){
        this.box = 0x373740;
        this.title = 0x22222b;
        this.border = 0x000000;
        this.text = new setNetworkTextColor();
    }

    function setNetworkTextColor(){
        this.title = '#b1b1b1';
        this.button = ['#a8a8a8','#ebf8ed'];
        this.text = '#a8a8a8';
    }

    function setUpgradeColor(){
        this.line = 0x282831;
        this.progressBackground = 0x24242a;
        this.progress = [{pos:0,color:'#4a6357'},{pos:1,color:'#05530c'}];
        this.text = new setUpgradeTextColor();
    }

    function setUpgradeTextColor(){
        this.cancel = ['#a8a8a8','#07b919'];
        this.text = '#b1b1b1';
    }

    function setAboutColor(){
        this.line = 0x282831;
        this.text = new setAboutTextColor();
    }

    function setAboutTextColor(){
        this.text = '#b1b1b1';
    }

    function sceneColor(){
        this.background = 0x373740;
        this.box = 0x373740;
        this.border = 0x000000;
        this.title = 0x22222b;
        this.text = new sceneTextColor();
    }

    function sceneTextColor(){
        this.title = '#b1b1b1';
        this.content = '#a8a8a8';
        this.index = '#dbdbdb';
        this.button = ['#a8a8a8','#07b919'];
        this.hook = '#07b919';
    }

    function portsColor(){
        this.box = 0x373740;
        this.vButtonText = ['#b1b1b1','#00cb13'];
        this.emptyButtonText = ['#b1b1b1','#cb8f00'];
    }

    function sendsColor(){
        this.box = 0x373740;
    }

    function groupColor(){
        this.box = 0x373740;
        this.text = new groupTextColor();
    }

    function groupTextColor(){
        this.index = '#b1b1b1';
        this.buttonGroup = ['#a8a8a8','#f2fdf3'];
        this.button = ['#a8a8a8','#00cb13'];
        this.radioButton = ['#b1b1b1','#f2fdf3'];
    }

    function renameColor(){
        this.box = 0x000000;
        this.inputBorder = '#777777';
        this.text = new renameTextColor();
    }

    function renameTextColor(){
        this.title = 'white';
        this.input = '#777777';
        this.button = ['#777777','white'];
    }

    function loginColor(){
        this.box = 0x000000;
        this.login = 0x373740;
        this.border = 0x000000;
        this.title = 0x22222b;
        this.triangle = 0xb1b1b1;
        this.text = new loginTextColor();
    }

    function maskColor(){
        this.box = 0x000000;
    }

    function loginTextColor(){
        this.title = '#b1b1b1';
        this.button = ['#a8a8a8','#07b919'];
        this.text = ['#a8a8a8'];
    }

    return {
        button : new buttonColor(),
        slider : new sliderColor(),
        title : new titleColor(),
        fader : new faderColor(),
        set : new setColor(),
        echo : new echoColor(),
        main : new mainColor(),
        phase : new phaseColor(),
        popup : new popupColor(),
        nav : new navColor(),
        edit : new editColor(),
        editPort : new editPortColor(),
        editEq : new editEqColor(),
        editDyn : new editDynColor(),
        editSends : new editSendsColor(),
        editGroup : new editGroupColor(),
        setSettings : new setSettingsColor(),
        setSafes : new setSafesColor(),
        setUser : new setUserColor(),
        setNetwork : new setNetworkColor(),
        setUpgrade : new setUpgradeColor(),
        setAbout : new setAboutColor(),
        scene : new sceneColor(),
        ports : new portsColor(),
        group : new groupColor(),
        sends : new sendsColor(),
        rename : new renameColor(),
        login : new loginColor(),
        mask : new maskColor(),
        ER : new ERColor()
    }
})();

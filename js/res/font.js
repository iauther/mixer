var staticDataFont = (function(){
    function titleFontSize(){
        this.input = '6pt Arial';
        this.scene = '16px';
        this.status = '20pt';
        this.main = '14pt';
        this.index = '18px';
        this.user = '16px';
        this.info = '16px';
    }

    function faderFontSize(){
        this.vText = '14px';
        this.empty = '14px';
        this.num = '14px';
        this.scale = '15px Arial';
        this.mute = 'bold 18px Arial';
        this.solo = this.mute;
        this.chName = '14px';
        this.ch = '18px';
        this.status = '18px';
        this.popup = new faderPopupFontSize();
    }

    function faderPopupFontSize(){
        this.title = '12pt Arial';
    }

    function navFontSize(){
        this.main = '18px';
        this.group = ['14px','14px','18px'];
        this.logo = '14pt'
    }



    function setFontSize(){
        this.info = '12pt';
        this.communicate = '12pt'
    }

    function mainFontSize(){
        this.num = '12pt';
        this.popupTitle = '20px';
        this.popupButton = '18px';
        this.popupCh = '16px';
    }

    function editEqFontSize(){
        this.num = '12pt Arial';
        this.band = '16px Arial';
        this.bandStatus = '14px Arial';
        this.circleBnt = 'bold 20px Arial';
        this.tabTitle = '14px';
        this.matrixButton = '16px';
    }

    function echoFontSize(){
        this.echoPredelay = '12pt';
        this.echoDelay = '12pt';
        this.reverbPredelay = '12pt';
        this.reverbTime = '12pt';
        this.reverbFreq = '12pt';
    }

    function phaseFontSize(){
        this.text = '12pt';
        this.gainNum = '10pt';
        this.freqShift = '6pt Arial';
    }

    function editDynFontSize(){
        this.faderTitle = '16px Arial';
        this.statusTitle = '14px Arial';
        this.num = '12pt Arial';
        this.circle = '20pt Arial';
        this.tabTitle = '16px';
        this.freq = '16px';
        this.matrixButton = '16px';
        this.lineBoxScale = '14px';
    }

    function ERFontSize(){
        this.faderTitle = '16px Arial';
        this.statusTitle = '14px Arial';
        this.button = '14px';
        this.tap = '24px';
    }

    function editPortFontSize(){
        this.title = '16px';
        this.status = '14px';
        this.fbcNum = 'bold 18px Arial';
        this.fbcOff = 'bold 14px Arial';
        this.empty = '20px';
    }

    function editFontSize(){
        this.navButton = '18px';
        this.switcher = '18px';
        this.gainStatus = '16px';
    }

    function editSendsFontSize(){
        this.faderTitle = '20px';
        this.faderCh = '18px';
    }

    function editGroupFontSize(){
        this.title = '18px';
        this.index = '18px';
        this.group = '18px';
    }

    function setSafesFontSize(){
        this.title = '20px';
        this.index = '18px';
        this.button = '16px';
    }

    function setSettingsFontSize(){
        this.title = '18px';
        this.index = '16px';
        this.button = '16px';
    }

    function setUserFontSize(){
        this.title = '20px';
        this.other = '16px';
    }

    function setNetworkFontSize(){
        this.title = '20px';
        this.other = '16px';
    }

    function setUpgradeFontSize(){
        this.text = '20px';
    }

    function setAboutFontSize(){
        this.text = '20px';
        this.content = '18px';
    }

    function sceneFontSize(){
        this.title = '20px';
        this.content = '18px';
        this.button = ['16px','16px','14px','16px','16px','16px'];
        this.index = '46px';
    }

    function groupFontSize(){
        this.num = '22px';
        this.index = '18px';
        this.tab = '20px';
        this.button = '16px';

    }

    function renameFontSize(){
        this.title = 'bold 24px';
        this.input = '18px';
        this.button = '18px';
    }

    function loginFontSize(){
        this.title = '20px';
        this.other = '16px';
        this.prompt = '24px';
    }

    return {
        title : new titleFontSize(),
        fader : new faderFontSize(),
        set : new setFontSize(),
        main : new mainFontSize(),
        echo : new echoFontSize(),
        phase : new phaseFontSize(),
        nav : new navFontSize(),
        edit : new editFontSize(),
        editPort : new editPortFontSize(),
        editEq : new editEqFontSize(),
        editDyn : new editDynFontSize(),
        editSends : new editSendsFontSize(),
        editGroup : new editGroupFontSize(),
        setSettings : new setSettingsFontSize(),
        setSafes : new setSafesFontSize(),
        setUser : new setUserFontSize(),
        setNetwork : new setNetworkFontSize(),
        setUpgrade : new setUpgradeFontSize(),
        setAbout : new setAboutFontSize(),
        scene : new sceneFontSize(),
        group : new groupFontSize(),
        rename : new renameFontSize(),
        login : new loginFontSize(),
        ER : new ERFontSize()
    }
})();
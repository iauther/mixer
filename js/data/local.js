var staticDataLocal = {};
var resolute = 1;
var isPc = IsPC();
/*判断是移动端还是PC端*/
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
RefreshLocal();
function RefreshLocal(){
    var widthScreen= window.innerWidth,heightScreen = window.innerHeight;
    if(heightScreen < 813 && !isPc)resolute = 813/heightScreen;
    widthScreen *= resolute;heightScreen *= resolute;
    var titleHeight = 81,navHeight = 54,contentHeight = heightScreen-titleHeight-navHeight,
        faderWidth = 120;
    staticDataLocal.render = new renderLocal();
    staticDataLocal.load = new loadLocal();
    staticDataLocal.title = new titleLocal();
    staticDataLocal.status = new statusLocal();
    staticDataLocal.nav = new navLocal();
    staticDataLocal.main = new mainLocal();
    staticDataLocal.fader = new faderLocal();
    staticDataLocal.edit = new editLocal();
    staticDataLocal.port = new editPortLocal();
    staticDataLocal.eq = new editEqLocal();
    staticDataLocal.geq = new editGeqLocal();
    staticDataLocal.dyn = new editDynLocal();
    staticDataLocal.editSends = new editSendsLocal();
    staticDataLocal.editGroup = new editGroupLocal();
    staticDataLocal.set = new setLocal();
    staticDataLocal.setSettings = new setSettingsLocal();
    staticDataLocal.setSafes = new setSafesLocal();
    staticDataLocal.setUser = new setUserLocal();
    staticDataLocal.setUpgrade = new setUpgradeLocal();
    staticDataLocal.setNetwork = new setNetworkLocal();
    staticDataLocal.setAbout = new setAboutLocal();
    staticDataLocal.login = new loginLocal();
    staticDataLocal.mask = new maskLocal();
    staticDataLocal.scene = new sceneLocal();
    staticDataLocal.ports = new portsLocal();
    staticDataLocal.group = new groupLocal();
    staticDataLocal.sends = new sendsLocal();
    staticDataLocal.ER = new ERLocal();
    staticDataLocal.popup = new popupLocal();
    staticDataLocal.rename = new renameLocal();
    staticDataLocal.message = new uploadMessageLocal();

    function renderLocal(){
        this.width = widthScreen;
        this.height = heightScreen;
    }

    function loadLocal(){
        var contentW = 350,contentH = 200;
        this.content = new pos(.5-contentW/widthScreen/2,.5-contentH/heightScreen/2,contentW/widthScreen,contentH/heightScreen);
    }

    function titleLocal(){
        var y = .04,height = 1-y* 2,width = 120/widthScreen,navWidth = 320,infoWidth = 265;
        this.title = new pos(0,0,widthScreen,titleHeight);
        this.button = new pos(.002,.02,width,1 -.02*2);
        this.scene = new pos(0,y,width,height);
        this.smallButton = new pos(this.scene.width+15/widthScreen,y,navWidth/widthScreen,height);
        this.player = new pos(.33,y,.23,height);
        this.user = new pos(1-width,y,width,height);
        this.info = new pos(1-this.user.width -infoWidth/widthScreen -15/widthScreen,y,infoWidth/widthScreen,height)
    }

    function navLocal(){
        var y = .04,height = 1-y* 2,width = 120/widthScreen,maskX = 120/widthScreen,maskWidth = 1-width-maskX;
        var groupWidth = 760/maskWidth/widthScreen,groupX = boundaryValue(1-groupWidth,0,1);
        this.nav = new pos(0,titleHeight,widthScreen,navHeight);
        this.main = new pos(0,y,width,height);
        this.set = new pos(1-width,y,width,height);
        this.mask = new pos(maskX,y,maskWidth,height);
        this.group = new pos(groupX,0,groupWidth,1);
    }

    function mainLocal(){
        var width = faderWidth;
        this.main = new pos(0,titleHeight+navHeight,widthScreen,contentHeight);
        this.box = new pos(0,titleHeight+navHeight,widthScreen,contentHeight);
        this.mainFader = new pos(1-width/widthScreen,0,width/widthScreen,1);
        this.chItem = new pos(0,0,1-this.mainFader.width,1);
        this.fader = new pos(0,0,width/(widthScreen-width),1);
        this.popup = new pos(0,(contentHeight-395)/contentHeight,260/(widthScreen-faderWidth),340/contentHeight);
        this.scrollBarHeight = 8/contentHeight;
        this.faderBox = new pos(0,0,1,(1-this.scrollBarHeight));
    }

    function popupLocal(){
        this.popup = new pos(0,0,260,340);
    }

    function renameLocal(){
        var width = 340,height = 200;
        this.rename = new pos((widthScreen-width)/2,(heightScreen-height)/2,width,height);
    }

    function faderLocal(){
        var width = faderWidth;
        this.width = width/(widthScreen-width);
        this.height = 1;
        this.actW = width;
    }

    function statusLocal(){
        this.count = 50;
        this.space = .008;
        this.bigSpace1 = .01;
        this.bigSpace2 = .01;
        this.bigSpace3 = .01;
    }

    function editLocal(){
        var navWidth = faderWidth,editWidth = widthScreen-faderWidth* 2,faderH = contentHeight-20;
        this.edit = new pos(faderWidth,titleHeight+navHeight,editWidth,contentHeight);
        this.tabTitleBnt = new pos(0,0,100/editWidth,40/contentHeight);
        this.nav = new pos(0,1-45/contentHeight,1,37/contentHeight);
        this.navButtonSpace = 1/navWidth;
        this.navButton = 118/navWidth;
        this.actNavButton = 118;
        this.editWidth = editWidth;
        this.scrollBarHeight = 8/contentHeight;
        this.tab = new pos(10/editWidth,-45/contentHeight,540/editWidth,45/contentHeight);
        this.masterFaderBox = new pos(-faderWidth/editWidth,0,faderWidth/editWidth,faderH/contentHeight);
        this.masterFaderSwitcher = new pos(.1,10/faderH,.8,55/faderH);
        this.masterFader = new pos(.25,105/faderH,.5,1-(170)/faderH);
    }

    function editPortLocal(){
        var edit = staticDataLocal.edit.edit;
        var contentW = 400,contentH = 505,x = (edit.width-contentW)/2/edit.width,y = (edit.height-50-contentH)/2/edit.height;
        x = boundaryValue(x,0);
        y = boundaryValue(y,5/edit.height);
        contentH = boundaryValue(edit.height-50,290,contentH);
        this.content = new pos(x,y,contentW/edit.width,contentH/edit.height);
        this.trim = new pos(0,70/contentH,75/contentW,1-135/contentH);
        this.delay = new pos(faderWidth/contentW,70/contentH,50/contentW,1-135/contentH);
        this.fbc = new pos(200/contentW,90/contentH,10/contentW,1-175/contentH);
        this.phaseButton1 = new pos(1-95/contentW,70/contentH,95/contentW,45/contentH);
        this.phaseButton2 = new pos(1-95/contentW,155/contentH,95/contentW,45/contentH);
        this.textTop = new pos(0,0,1,35/contentH);
        this.textBottom = new pos(0,1-35/contentH,1,35/contentH);
        this.contentW = contentW;
        this.contentH = contentH;
    }

    function editEqLocal(){
        var contentWidth = widthScreen-faderWidth* 2,eqWidth = contentWidth-20;
        eqWidth = boundaryValue(eqWidth,600);
        var sliderWidth = 380,matrixWidth = eqWidth-sliderWidth-10,matrixHeight = (contentHeight-150);
        var masterSliderWidth = 100,masterMatrixWidth = eqWidth-masterSliderWidth-10;
        var matrixButtonY = 10/matrixHeight,matrixButtonW = faderWidth/matrixWidth,matrixButtonH = 45/matrixHeight,
            matrixButtonSpceAll = matrixWidth-100*2-faderWidth,limeBoxHeight = matrixHeight-faderWidth;
        this.eq = new pos(10/contentWidth,70/contentHeight,eqWidth/contentWidth,matrixHeight/contentHeight);
        this.eqMatrix = new pos(0,0,matrixWidth/eqWidth,1);
        this.tabSlider = new pos(1-sliderWidth/eqWidth,0,sliderWidth/eqWidth,1);
        limeBoxHeight = boundaryValue(limeBoxHeight,1);
        this.lineBox = new pos(35/matrixWidth,70/matrixHeight,1-60/matrixWidth,limeBoxHeight/matrixHeight);
        this.tab = new pos(0,-45/matrixHeight,1,45/matrixHeight);
        this.sliderWidth = sliderWidth;
        this.sliderHeight = matrixHeight;
        this.ringButton1 = 35;
        this.ringButton2 = 15;
        this.matrixButton1 = new pos(100/matrixWidth,matrixButtonY,matrixButtonW,matrixButtonH);
        this.matrixButton2 = new pos((100+matrixButtonSpceAll)/matrixWidth,matrixButtonY,matrixButtonW,matrixButtonH);
        this.matrixButton3 = new pos((45+matrixButtonSpceAll *.75)/matrixWidth,matrixButtonY,matrixButtonW,matrixButtonH);
        this.matrixButton4 = new pos((45+matrixButtonSpceAll)/matrixWidth,matrixButtonY,matrixButtonW,matrixButtonH);
        this.topBox = new pos(0,0,1,140/matrixHeight);
        this.centerBox = new pos(0,140/matrixHeight,1,1-220/matrixHeight);
        this.bottomBox = new pos(0,1-80/matrixHeight,1,80/matrixHeight);
        this.lineBoxW = matrixWidth-60;
        this.lineBoxH = matrixHeight-faderWidth;
        this.matrixlineWidth = 1/this.lineBoxH;
        this.matrixlineHeight = 1/this.lineBoxW;
        this.switcher = new pos(0,-50/matrixHeight,450/eqWidth,40/matrixHeight);
        this.eqMatrixActW = matrixWidth;
        this.eqMatrixActH = matrixHeight;
    }

    function editGeqLocal(){
        var contentWidth = widthScreen-faderWidth* 2,eqWidth = contentWidth-20;eqWidth = boundaryValue(eqWidth,600);
        var matrixHeight = (contentHeight-150),masterSliderWidth = 100,masterMatrixWidth = eqWidth-masterSliderWidth-10;
        var matrixButtonY = 10/matrixHeight,matrixButtonH = 45/matrixHeight, limeBoxHeight = matrixHeight-faderWidth;
        var masterMatrixButtonW = faderWidth/masterMatrixWidth,masterMatrixButtonSpceAll = masterMatrixWidth-45*2-faderWidth;
        this.eq = new pos(10/contentWidth,70/contentHeight,eqWidth/contentWidth,matrixHeight/contentHeight);
        this.eqMatrix = new pos(0,0,masterMatrixWidth/eqWidth,1);
        limeBoxHeight = boundaryValue(limeBoxHeight,1);
        this.faderBox = new pos(1-80/eqWidth,0,60/eqWidth,1);
        this.fader = new pos(0,80/(matrixHeight),1,1-150/(matrixHeight));
        this.lineBox = new pos(35/masterMatrixWidth,70/matrixHeight,1-60/masterMatrixWidth,limeBoxHeight/matrixHeight);
        this.matrixButton1 = new pos(45/masterMatrixWidth,matrixButtonY,masterMatrixButtonW,matrixButtonH);
        this.matrixButton2 = new pos((45+masterMatrixButtonSpceAll)/masterMatrixWidth,matrixButtonY,masterMatrixButtonW,matrixButtonH);
        this.matrixButton3 = new pos((45+masterMatrixButtonSpceAll *.75)/masterMatrixWidth,matrixButtonY,masterMatrixButtonW,matrixButtonH);
        this.matrixButton4 = new pos((45+masterMatrixButtonSpceAll)/masterMatrixWidth,matrixButtonY,masterMatrixButtonW,matrixButtonH);
        this.lineHeight = 1/(masterMatrixWidth-60);
        this.sliderButtonW = 1/17;
        this.sliderButtonH = (masterMatrixWidth-60)/17/limeBoxHeight;
        this.sliderButtonRing = 2/((masterMatrixWidth-60)/17);
        this.statusY = 20/(matrixHeight);
        this.lineBoxW = masterMatrixWidth-60;
        this.lineBoxH = matrixHeight-faderWidth;
        this.matrixlineWidth = 1/masterMatrixWidth;
        this.matrixlineHeight = 1/matrixHeight;
        this.delay = new pos(30/contentWidth,10/contentHeight,500/contentWidth,40/contentHeight);
        this.eqMatrixActW = masterMatrixWidth;
        this.eqMatrixActH = matrixHeight;
    }

    function editDynLocal(){
        var contentWidth = widthScreen-faderWidth*2,eqWidth = contentWidth-20;
        eqWidth = boundaryValue(eqWidth,865);
        var sliderWidth = 510,matrixWidth = eqWidth-sliderWidth-10,matrixHeight = (contentHeight-150),
            sliderCenterHeight = matrixHeight-220,matrixButtonY = 10/matrixHeight,matrixButtonW = faderWidth/matrixWidth,matrixButtonH = 45/matrixHeight,
            matrixButtonSpceAll = matrixWidth-225-faderWidth,freqBoxHeight = matrixHeight-65-45;
        this.dyn = new pos(10/contentWidth,70/contentHeight,eqWidth/contentWidth,matrixHeight/contentHeight);
        this.dynMatrix = new pos(0,0,1-(sliderWidth+10)/eqWidth,1);
        this.tabSlider = new pos(1-sliderWidth/eqWidth,0,sliderWidth/eqWidth,1);
        this.tabSliderTop = new pos(0,0,1,140/matrixHeight);
        sliderCenterHeight = boundaryValue(sliderCenterHeight,0);
        this.tabSliderCenter = new pos(0,140/matrixHeight,1,sliderCenterHeight/matrixHeight);
        this.tabSliderBottom = new pos(0,1-80/matrixHeight,1,80/matrixHeight);
        this.tabButtonW = 106/sliderWidth;
        this.tabButtonH = 45/140;
        this.matrixlineWidth = 2/matrixWidth;
        this.tab = new pos(0,-45/matrixHeight,.5,45/matrixHeight);
        this.sliderWidth = sliderWidth;
        this.sliderHeight = matrixHeight;
        freqBoxHeight = boundaryValue(freqBoxHeight,0);
        this.freqBox = new pos(1-155/matrixWidth,65/matrixHeight,130/matrixWidth,freqBoxHeight/matrixHeight);
        this.lineBoxWidth = matrixWidth-225;
        this.lineBoxHeight = boundaryValue((matrixHeight-faderWidth),0);
        this.ringButton1 = 35;
        this.ringButton2 = 15;
        this.matrixButton1 = new pos(90/matrixWidth,matrixButtonY,matrixButtonW,matrixButtonH);
        this.matrixButton2 = new pos((45+matrixButtonSpceAll-90)/matrixWidth,matrixButtonY,matrixButtonW,matrixButtonH);
        this.matrixButton3 = new pos((45+matrixButtonSpceAll)/matrixWidth,matrixButtonY,matrixButtonW,matrixButtonH);
        this.lineBox = new pos(45/matrixWidth,70/matrixHeight,this.lineBoxWidth/matrixWidth,this.lineBoxHeight/matrixHeight);
        this.delay = new pos(30/eqWidth,-60/matrixHeight,500/eqWidth,40/matrixHeight);
    }

    function editSendsLocal(){
        var width = widthScreen-faderWidth* 2,height = contentHeight;
        this.faderBox = new pos(0,0,1,1-8/height);
        this.fader = new pos(0,0,faderWidth/width,1);
    }

    function editGroupLocal(){
        var width = widthScreen-faderWidth* 2,height = contentHeight,boxWidth = 440,boxHeight = 280;
        this.group = new pos((width/2-boxWidth/2)/width,(height-boxHeight-45)/3/height,boxWidth/width,boxHeight/height);
        this.buttonH = 45/boxHeight;
        this.buttonW = 90/boxWidth;
        this.cleatButtonH = 50/boxHeight;
    }

    function setLocal(){
        var width = widthScreen-faderWidth,height = contentHeight;
        this.set = new pos(0,titleHeight+navHeight,width,height);
        this.tab = new pos(130/width,-45/height,735/width,45/height);
        this.width = width;
        this.height = height;
    }

    function setSafesLocal(){
        var setWidth = widthScreen-faderWidth,setHeight = contentHeight,width = 480,height = 450,
            spaceAll = setWidth-width* 2,x1 = boundaryValue(spaceAll *.3,0),x2 = boundaryValue(x1+width+spaceAll *.4,width),
            y = boundaryValue((setHeight-height) *.4,5);
        this.left = new pos(x1/setWidth,y/setHeight,width/setWidth,height/setHeight);
        this.right = new pos(x2/setWidth,y/setHeight,width/setWidth,height/setHeight);
        this.buttonW = 90/width;
        this.buttonH = 41/height;
        this.space = 11/height;
        this.titleSpace = 50/height;
        this.buttonSpace = 2/width;
    }

    function setSettingsLocal(){
        var setWidth = widthScreen-faderWidth,setHeight = contentHeight,
            width = 795,x = boundaryValue((setWidth-width)*.5,0),height1 = 280,height2 = 236,
            y1 = boundaryValue((setHeight-height1-height2)*.4,5),y2 = y1+height1+y1/2;
        this.globle = new pos(x/setWidth,y1/setHeight,width/setWidth,height1/setHeight);
        this.local = new pos(x/setWidth,y2/setHeight,width/setWidth,height2/setHeight);
        this.buttonWidth = 94/width;
        this.buttonHeight1 = 43/height1;
        this.buttonHeight2 = 43/height2;
        this.spaceY1 = 12/height1;
        this.spaceY2 = 12/height2;
        this.titleSpace1 = 30/height1;
        this.titleSpace2 = 30/height2;
    }

    function setUserLocal(){
        var setWidth = widthScreen-faderWidth,setHeight = contentHeight,
            userWidth = 390,userHeight = 670,accountWidth = 376,accountHeight = 370,authorizationWidth = 428,authorizationHeight = 670,
            y = boundaryValue((setHeight-userHeight)/2,5),spaceAll = boundaryValue(setWidth-userWidth-accountWidth-authorizationWidth,0),
            x1 = spaceAll*1/4,x2 = x1+x1+userWidth,x3 = x1*3+userWidth+accountWidth;
        this.user = new pos(x1/setWidth,y/setHeight,userWidth/setWidth,userHeight/setHeight);
        this.account = new pos(x2/setWidth,y/setHeight,accountWidth/setWidth,accountHeight/setHeight);
        this.authorization = new pos(x3/setWidth,y/setHeight,authorizationWidth/setWidth,authorizationHeight/setHeight);
        this.userTitleHeight = 40/userHeight;
        this.userButtonBoxHeight = 80/userHeight;
        this.authorizationTitleHeight = this.userTitleHeight;
        this.accountTitleHeight = 40/accountHeight;
        this.userList = new pos(0,this.userTitleHeight,1,1-this.userTitleHeight-this.userButtonBoxHeight);
        this.accountIptH = 40/accountHeight;
        this.accountIndexSpace = 30/accountHeight;
        this.authorizationIndexSpace = 20/authorizationHeight;
        this.radioButtonW = 95/authorizationWidth;
        this.radioButtonH = 40/authorizationHeight;
        this.radioButtonSpace = 1/authorizationWidth;
        this.userScrollWidth = 15/userWidth;
    }

    function setNetworkLocal(){
        var setWidth = widthScreen-faderWidth,setHeight = contentHeight,
            width = 700,height = 280,boxSpace = 20,y = boundaryValue((setHeight-height*2-boxSpace)/2,0),x = setWidth/2-width/2;
        this.lan = new pos(x/setWidth,y/setHeight,width/setWidth,height/setHeight);
        this.ip = new pos(x/setWidth,y/setHeight,width/setWidth,height/setHeight);
        y += height + boxSpace;
        this.wlan = new pos(x/setWidth,y/setHeight,width/setWidth,height/setHeight);
        this.titleHeight = 42/height;
        this.popupTitleHeight = 30/100;
        this.spaceY = 12/height;
        this.buttonH = 45/height;
        this.inputH = 39/height;
        this.cancelButtonH = 50/height;
        this.buttonW = 112/width;
        this.staListScrollWidth = 15/width;
        this.actW = width;
        this.actH = height;
        this.pswdPopup = new pos((setWidth/2-150)/setWidth,(setHeight/2-100)/setHeight,300/setWidth,200/setHeight);
    }

    function uploadMessageLocal(){
        var width = widthScreen,height = heightScreen,boxWidth = 300,boxHeight = 200;
        this.box = new pos((width-boxWidth)/2,(height-boxHeight)/2,boxWidth,boxHeight);
        this.titleHeight = 40/boxHeight;
    }

    function setUpgradeLocal(){
        var setWidth = widthScreen-faderWidth,setHeight = contentHeight,
            contentW = 450,contentH = 540,lineWidth = (setWidth-faderWidth)/contentW,x = boundaryValue((setWidth-contentW)/2,0);
        this.content = new pos(x/setWidth,40/setHeight,contentW/setWidth,contentH/setHeight);
        this.line = new pos(.5-lineWidth/2,.2,lineWidth,10/contentH);
        this.logo = new pos(.5-100/contentW,0,200/contentW,faderWidth/contentH);
        this.spaceY1 = 15/contentH;
        this.spaceY2 = 35/contentH;
        this.spaceY3 = 40/contentH;
        this.fileDisplayW = 1-50/contentW;
        this.fileButtonW = 40/contentW;
        this.buttonH = 50/contentH;
        this.buttonW = 95/contentW;
        this.squareW = 25/contentW;
        this.squareH = 25/contentH;
    }

    function setAboutLocal(){
        var setWidth = widthScreen-faderWidth,setHeight = contentHeight,
            boxWidth = boundaryValue(setWidth-60*2,1100),boxHeight = 370;
        this.box = new pos(60/setWidth,70/setHeight,boxWidth/setWidth,boxHeight/setHeight);
        this.logo = new pos(.5-100/boxWidth,0,200/boxWidth,faderWidth/boxHeight);
        this.lineHeight = 10/boxHeight;
        this.spaceY1 = 15/boxHeight;
        this.spaceY2 = 55/boxHeight;
    }

    function loginLocal(){
        var width = widthScreen,height = heightScreen,loginWidth = 414,loginHeight = 273,loginX = (width-loginWidth)/ 2,loginY = (height-loginHeight)/2;
        this.box = new pos(0,0,width,height);
        this.login = new pos(loginX,loginY,loginWidth,loginHeight);
        this.cancel = new pos((loginWidth-30)/loginWidth,0,30/loginWidth,30/loginHeight);
        this.titleHeight = 40/loginHeight;
        this.buttonH = 50/loginHeight;
        this.buttonW = 95/loginWidth;
        this.spaceY = 30/loginHeight;
        this.iptH = 40/loginHeight;
    }

    function maskLocal(){
        this.box = new pos(0,0,widthScreen,heightScreen);
    }

    function sceneLocal(){
        var width = widthScreen-faderWidth,height = contentHeight,selectW = 465,selectH = 330,memoryW = 720,memoryH = 650;
        width = boundaryValue(width,selectW+memoryW);
        height = boundaryValue(height,memoryH);
        var spaceX = (width-selectW-memoryW)/ 3,spaceY = (height-memoryH)*.3;
        this.scene = new pos(0,titleHeight+navHeight,width,height);
        this.tab = new pos(130/width,-45/height,faderWidth/width,45/height);
        this.select = new pos(spaceX/width,spaceY/height,selectW/width,selectH/height);
        this.memory = new pos((spaceX*2+selectW)/width,spaceY/height,memoryW/width,memoryH/height);
        this.list = new pos(0,110/memoryH,1,1-110/memoryH);
        this.selectTitleHeight = 40/selectH;
        this.memoryTitleHeight = 40/memoryH;
        this.selectButtonW = 95/selectW;
        this.selectButtonH = 50/selectH;
        this.memoryButtonW = 95/memoryW;
        this.memoryButtonH = 50/memoryH;
        this.buttonSpaceY = 10/memoryH;
        this.listScrollWidth = 15/memoryW;
    }

    function portsLocal(){
        var width = widthScreen-faderWidth,height = contentHeight;
        this.ports = new pos(0,titleHeight+navHeight,width,height);
        this.scrollBarHeight = 8/height;
        this.faderBox = new pos(0,0,1,(1-this.scrollBarHeight));
        this.faderWidth = faderWidth/width;
    }

    function sendsLocal(){
        var width = widthScreen-faderWidth,height = contentHeight;
        this.sends = new pos(0,titleHeight+navHeight,width,height);
        this.scrollBarHeight = 8/height;
        this.faderBox = new pos(0,0,1,(1-this.scrollBarHeight));
        this.faderWidth = faderWidth/width;
        this.tab = new pos(130/width,-45/height,200/width,45/height);
        this.faderBox = new pos(0,0,1,1-8/height);
        this.scrollBarHeight = 8/height;
    }

    function ERLocal(){
        var width = widthScreen-faderWidth*2,height = contentHeight,actBoxH = height-150,tabW = 400,boxY = 70/height,boxH = 1-150/height,
            bntBoxW = width-10-10-tabW,echoH = (height-150),sliderCenterHeight = actBoxH-220;
        this.ER = new pos(faderWidth,titleHeight+navHeight,width,height);
        this.bntBox = new pos(10/width,boxY,bntBoxW/width,boxH);
        this.tabBox = new pos(1-tabW/width,boxY,tabW/width,boxH);
        this.tab = new pos(0,-45/(height-150),.5,45/(height-150));
        this.echo = new pos(0,0,1,1);
        this.reverb = new pos(0,0,1,1);
        this.buttonW = 160/bntBoxW;
        this.buttonH = 65/echoH;
        this.button1 = new pos(0,10/echoH,this.buttonW,this.buttonH);
        this.button2 = new pos(.5-this.buttonW/2,10/echoH,this.buttonW,this.buttonH);
        this.button3 = new pos(1-this.buttonW,10/echoH,this.buttonW,this.buttonH);
        this.picture = new pos(0,85/echoH,.6,1-85/echoH);

        this.tabSliderTop = new pos(0,0,1,140/actBoxH);
        sliderCenterHeight = boundaryValue(sliderCenterHeight,0);
        this.tabSliderCenter = new pos(0,140/actBoxH,1,sliderCenterHeight/actBoxH);
        this.tabSliderBottom = new pos(0,1-80/actBoxH,1,80/actBoxH);
        this.tap = new pos(.5-100/tabW/2,10/140,100/tabW,50/140);
    }

    function groupLocal(){
        var width = widthScreen-faderWidth,height = contentHeight,y = titleHeight+navHeight,x = 0;
        width = boundaryValue(width,520);
        height = boundaryValue(height,505);
        var boxWidth = 450,boxHeight = 465,boxX = (width-boxWidth)/2,boxY = 40;
        this.group = new pos(x,y,width,height);
        this.box = new pos(boxX/width,boxY/height,boxWidth/width,boxHeight/height);
        this.tab = new pos(130/width,-45/height,244/width,45/height);
        this.buttonW = 82/boxWidth;
        this.radioButtonW = 95/boxWidth;
        this.radioButtonH = 42/boxHeight;
        this.buttonH = 47/boxHeight;
        this.buttonH1 = 48/boxHeight;
        this.spaceY = 14/boxHeight;
        this.buttonSpace = 2/width;
    }

    function pos(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

/*获取最大值与最小值的边界值*/
function boundaryValue(val,min,max){
    var v  = val;
    if(v < min){
        v = min;
    }else if(v > max){
        v = max;
    }
    return v;
}

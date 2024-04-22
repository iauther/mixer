var listBox = function(){
    var listBox = {};
    function rectEvent(event, fnc, sprite) {
        var tmp = getSpriteActData(sprite);
        listBox.his.onEvent([event, fnc, 'rect', tmp[0], tmp[1], tmp[2], tmp[3]]);
    }

    function createBg(initData, parent) {
        var bg;
        if (initData.color) {
            if (initData.border) {
                bg = new kbBoxBg(0, 0, 1, 1, initData.color.backGroundColor, parent, initData.color.alpha);
                bg.setBorder(initData.border.width, initData.border.color);
            } else {
                bg = new kbBoxBg(0, 0, 1, 1, initData.color.backGroundColor, parent, initData.color.alpha)
            }
        } else {
            if (initData.border) {
                bg = new kbBoxBg(0, 0, 1, 1, '', parent, 0);
                bg.setBorder(initData.border.width, initData.border.color)
            } else {
                bg = new kbBoxBg(0, 0, 1, 1, '', parent, 0)
            }
        }
        return bg;
    }

    function unBlur(ipt) {
        listBox.his.ctx.interactive = true;
        listBox.his.ctx.on('mousedown', onDragStart);
        listBox.his.ctx.on('touchstart', onDragStart);
        function onDragStart() {
            ipt.blur();
        }
    }

    function bodySetAttr(setData, his) {
        var setFlag = false;
        if (setData.position) {
            setFlag = true;
            his.x = setAttrData(setData.position.x, his.x);
            his.y = setAttrData(setData.position.y, his.y);
            his.sprite.x = his.x;
            his.sprite.y = his.y;
        }
        if (setData.size) {
            setFlag = true;
            his.width = setAttrData(setData.size.width, his.width);
            his.height = setAttrData(setData.size.height, his.height);
            his.sprite.width = his.width;
            his.sprite.height = his.height;
        }
        if (setFlag) {
            his.sprite.create();
        }
    }

    function borderSetAttr(setData, his) {
        var paintFlag = false;
        if (setData.position) {
            his.x = setAttrData(setData.position.x, his.x);
            his.y = setAttrData(setData.position.y, his.y);
        }
        if (setData.size) {
            his.width = setAttrData(setData.size.width, his.width);
            his.height = setAttrData(setData.size.height, his.height);
        }
        his.sprite.x = his.x;
        his.sprite.y = his.y;
        his.sprite.width = his.width;
        his.sprite.height = his.height;
        his.sprite.paint();
        if (setData.border) {
            paintFlag = true;
            his.borderColor = setAttrData(setData.border.color, his.borderColor);
            his.borderWidth = setAttrData(setData.border.width, his.borderWidth);
            his.borderAlpha = setAttrData(setData.border.alpha, his.borderAlpha);
        }
        if (setData.content) {
            paintFlag = true;
            his.text = setAttrData(setData.content.text, his.text);
            his.textFont = setAttrData(setData.content.font, his.textFont);
            his.textColor = setAttrData(setData.content.color, his.textColor);
        }
        if (setData.color) {
            paintFlag = true;
            his.backGroundColor = setAttrData(setData.color.backGroundColor, his.backGroundColor);
            his.backGroundAlpha = setAttrData(setData.color.alpha, his.backGroundAlpha);
        }
        if (paintFlag) {
            his.Paint();
        }
    }

    /*遍历数组的属性和值*/
    function allPrpos(obj) {
        // 用来保存所有的属性名称和值
        var props = {};
        var key = [];
        var val = [];
        // 开始遍历
        for (var p in obj) { // 方法
            if (typeof ( obj [p]) == " function ") {
                obj [p]();
            } else {
                // p 为属性名称，obj[p]为对应属性的值
                key.push(p);
                val.push(obj[p]);
            }
        }
        props = {
            key: key,
            val: val
        };
        return props;
    }

    function division(a,b){
        if(b == 0){
            return 0;
        }else{
            return a/b;
        }
    }
    /*绘制一边的border*/
    function oneSideBorder(style, parent) {
        paintBorder(style.borderTop, parent, 0, 0, 1, 0);
        paintBorder(style.borderRight, parent, 1, 0, 1, 1);
        paintBorder(style.borderLeft, parent, 0, 0, 0, 1);
        paintBorder(style.borderBottom, parent, 0, 1, 1, 1);

        function paintBorder(style, parent, x1, y1, x2, y2) {
            if (style) {
                var line = new kbLine(x1, y1, x2, y2, style.color, parent, style.width);
                pushScaleData(line.graphics,{width:1});
            }
        }
    }

    /*判断一个元素在不在数组内*/
    Array.prototype.S = String.fromCharCode(2);
    Array.prototype.in_array = function (e) {
        var r = new RegExp(this.S + e + this.S);
        return (r.test(this.S + this.join(this.S) + this.S));
    };
    function inSome_array(attr, inAttr) {
        var len = inAttr.length;
        for (var i = 0; i < len; i++) {
            var flag = attr.in_array(inAttr[i]);
            if (!flag) {
                return false;
            }
            if (i == len - 1) {
                return true;
            }
        }
    }

    function inRect(x, y, p) {
        if (x > p[3] && x < p[3] + p[5] && y > p[4] && y < p[6] + p[4]) {
            p[1](x, y);
        }
    }

    /*判断键盘事件*/
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
    function keyDown(e) {
        var currKey = 0, e = e || event;
        currKey = e.keyCode || e.which || e.charCode;
        var keyName = String.fromCharCode(currKey);
        listBox.Body.List.Item.his.keyDown(currKey);
        listBox.Body.List.Item.his.keyValue = currKey;
    }

    function keyUp(e) {
        var currKey = 0, e = e || event;
        currKey = e.keyCode || e.which || e.charCode;
        var keyName = String.fromCharCode(currKey);
        if (currKey == 17) {
            listBox.Body.List.Item.his.keyValue = -1;
        }
    }

    /*判断坐标是否在矩形内*/
    function isInRect(X, Y, x, y, width, height) {
        if (X > x && X < (x + width) && Y > y && Y < (y + height)) {
            return true;
        } else {
            return false;
        }

    }

    function kbLisetScrollBgCanvas(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx = drawLinearGradient({x1: 0, y1: 0, x2: width, y2: 0}, [{pos: 0, color: '#23232a'}, {
            pos: .5,
            color: '#3a3a49'
        }, {pos: 1, color: '#24242b'}], ctx);
        ctx.fillRect(0, 0, width, height);
        return canvas;
    }

    listBox.box = function (ctx, InitData) {
        this.ctx = ctx;
        this.ctx.interactive = true;
        this.x = InitData.position.x;
        this.y = InitData.position.y;
        this.width = InitData.size.width;
        this.height = InitData.size.height;
        this.sprite = new kbSprite(this.x, this.y, this.width, this.height, this.ctx);
        this.sprite.setRenderClearRect(this.sprite.sprite,0x373740);
        this.eventArray = [];
        this.eventDataArray = [];
        listBox.his = this;
        this.Border = function (data) {
            new listBox.Border(data)
        };
    };

    listBox.box.prototype.setAttr = function (setData) {
        bodySetAttr(setData, this);
    };

    listBox.box.prototype.Paint = function (objArray) {
        this.objArray = objArray;
        var len = this.objArray.length;
        for (var i = 0; i < len; i++) {
            this.objArray[i].Paint();
        }
    };

    listBox.box.prototype.onEvent = function (event) {
        //var eventArray = ['click','mousedown','touchstart','mouseup','mouseupoutside','touchend','touchendoutside','mousemove','touchmove'];
        var inFlag = this.eventArray.in_array(event[0]);
        if (!inFlag) {
            this.ctx.on(event[0], this.getClient);
            this.eventArray.push(event[0]);
        }
        var inArrayFlag = this.eventDataArray.in_array(event);
        if (!inArrayFlag) {
            this.eventDataArray.push(event);
        }
    };

    listBox.box.prototype.removeEvent = function (event, data) {
        var len = this.eventDataArray.length;
        var argumentLen = arguments.length;
        for (var i = 0; i < len; i++) {
            var flag = inSome_array(this.eventDataArray[i], event);
            if (flag) {
                if (argumentLen == 1) {
                    this.eventDataArray.splice(i, 1);
                    i--;
                    len = this.eventDataArray.length;
                } else if (argumentLen == 2) {
                    //console.log(this.eventDataArray[i][4]);
                    this.eventDataArray[i][3] = data[0];
                    this.eventDataArray[i][4] = data[1];
                    this.eventDataArray[i][5] = data[2];
                    this.eventDataArray[i][6] = data[3];
                    //console.log(this.eventDataArray[i][4]);
                }
            }
        }
    };

    listBox.box.prototype.getClient = function (event) {
        var clientX, clientY;
        clientX = event.data.originalEvent.offsetX;
        clientY = event.data.originalEvent.offsetY;
        var len = listBox.his.eventDataArray.length;
        for (var i = 0; i < len; i++) {
            if (listBox.his.eventDataArray[i][2] == 'rect' && listBox.his.eventDataArray[i][0] == event.type) {
                inRect(clientX, clientY, listBox.his.eventDataArray[i]);
            }
        }
    };

    listBox.Border = function (initData, paintFlage) {
        this.initData = initData;
        this.x = initData.position.x;
        this.y = initData.position.y;
        this.width = initData.size.width;
        this.height = initData.size.height;
        this.borderType = initData.border.type;
        if (initData.border) {
            switch (this.borderType) {
                case 'line':
                    this.borderColor = initData.border.color;
                    this.borderWidth = initData.border.width;
                    this.borderAlpha = initData.border.alpha;
                    break;
                case 'img':
                    this.borderImg = initData.border.img;
                    this.borderWidth = initData.border.width * this.width;
                    break;
                case 'rect':
                    this.borderColor = initData.border.backGroundColor;
                    this.borderWidth = initData.border.width * this.width;
                    this.borderAlpha = initData.border.alpha;
                    this.borderlineColor = initData.border.borderColor;
                    this.borderLineWidth = initData.border.borderWidth;
                    break;
            }
        }

        this.backGroundColor = setAttrData(initData.color.backGroundColor, 0xFFFFFF);
        this.alpha = setAttrData(initData.color.alpha, 1);

        this.sprite = new kbSprite(this.x, this.y, this.width, this.height, listBox.his.sprite.sprite);

        var tmp = getSpriteActData(this.sprite.sprite);
        this.actX = tmp[0];
        this.actY = tmp[1];
        this.actWidth = tmp[2];
        this.actHeight = tmp[3];
        if (!paintFlage) {
            this.Paint();
        }

    };

    listBox.Border.prototype.Paint = function () {
        this.sprite.sprite.removeChildren();
        if (this.initData.border) {
            switch (this.borderType) {
                case 'line':
                    this.border = new kbBoxBg(0, 0, 1, 1, this.backGroundColor, this.sprite.sprite, this.alpha).setBorder(this.borderWidth, this.borderColor, this.borderAlpha);
                    break;
                case 'img':
                    this.topImg = new kbImg(0, 0, this.width - this.borderWidth, this.borderWidth, this.borderImg, this.sprite.sprite);
                    this.rightImg = new kbImg(this.width - this.borderWidth, 0, this.borderWidth, this.height - this.borderWidth, this.borderImg, this.sprite.sprite);
                    this.bottomImg = new kbImg(this.borderWidth, this.height - this.borderWidth, this.width - this.borderWidth, this.borderWidth, this.borderImg, this.sprite.sprite);
                    this.leftImg = new kbImg(0, this.borderWidth, this.borderWidth, this.height - this.borderWidth, this.borderImg, this.sprite.sprite);
                    break;
                case 'rect':
                    this.topRect = new kbBoxBg(0, 0, this.width - this.borderWidth * (this.actHeight / this.actWidth), this.borderWidth, this.borderColor, this.sprite.sprite, this.borderAlpha, this.borderLineWidth, this.borderlineColor);
                    this.rightRect = new kbBoxBg(this.width - this.borderWidth * (this.actHeight / this.actWidth), 0, this.borderWidth * (this.actHeight / this.actWidth), this.height - this.borderWidth, this.borderColor, this.sprite.sprite, this.borderAlpha);
                    this.bottomRect = new kbBoxBg(this.borderWidth * (this.actHeight / this.actWidth), this.height - this.borderWidth, this.width - this.borderWidth * (this.actHeight / this.actWidth), this.borderWidth, this.borderColor, this.sprite.sprite, this.borderAlpha);
                    this.leftRect = new kbBoxBg(0, this.borderWidth, this.borderWidth * (this.actHeight / this.actWidth), this.height - this.borderWidth, this.borderColor, this.sprite.sprite, this.borderAlpha);
                    this.topRect.setBorder(this.borderLineWidth, this.borderlineColor);
                    this.rightRect.setBorder(this.borderLineWidth, this.borderlineColor);
                    this.bottomRect.setBorder(this.borderLineWidth, this.borderlineColor);
                    this.leftRect.setBorder(this.borderLineWidth, this.borderlineColor);
                    break;
            }
        }
    };

    listBox.Border.prototype.setAttr = function (setData) {
        if (setData.border) {
            this.borderType = setAttrData(setData.border.type, this.borderType);
        }
        borderSetAttr(setData, this);

    };

    listBox.Border.prototype.onEvent = function (event, fnc) {
        listBox.his.onEvent([event, fnc, 'rect', this.actX, this.actY, this.actWidth, this.actHeight]);
    };

    listBox.Border.prototype.removeEvent = function (event) {
        listBox.his.removeEvent([event, 'rect', this.actX, this.actY, this.actWidth, this.actHeight])
    };

    listBox.Title = function (initData, paintFlage) {
        this.initData = initData;

        this.x = initData.position.x;
        this.y = initData.position.y;
        this.width = initData.size.width;
        this.height = initData.size.height;

        this.text = initData.content.text;
        this.textFont = initData.content.font;
        this.textColor = initData.content.color;

        if (initData.border) {
            this.borderColor = this.initData.border.color;
            this.borderWidth = this.initData.border.width;
            this.borderAlpha = this.initData.border.alpha;
        }
        if (initData.color) {
            this.backGroundColor = initData.color.backGroundColor;
            this.backGroundAlpha = initData.color.alpha;
        }
        this.sprite = new kbSprite(this.x, this.y, this.width, this.height, listBox.his.sprite.sprite);
        var tmp = getSpriteActData(this.sprite.sprite);
        this.actX = tmp[0];
        this.actY = tmp[1];
        this.actWidth = tmp[2];
        this.actHeight = tmp[3];
        if (!paintFlage) {
            this.Paint();
        }
    };

    listBox.Title.prototype.setAttr = function (setData) {
        borderSetAttr(setData, this);
    };

    listBox.Title.prototype.Modify = function () {
        if (this.initData.content) {
            this.textSprite = new kbBoxText(.5, .5, this.text, this.textColor, this.textFont, this.sprite.sprite, .5, .5);
        }
    };

    listBox.Title.prototype.Paint = function () {
        this.sprite.sprite.removeChildren();
        this.borderBg = new kbSprite(0, 0, 1, 1, this.sprite.sprite);
        if (this.initData.color) {
            if (this.initData.border) {
                new kbBoxBg(0, 0, 1, 1, this.backGroundColor, this.borderBg.sprite, this.backGroundAlpha).setBorder(this.borderWidth, this.borderColor);
            } else {
                new kbBoxBg(0, 0, 1, 1, this.backGroundColor, this.borderBg.sprite, this.backGroundAlpha);
            }
        }
        this.Modify();
    };

    listBox.Title.prototype.onEvent = function (event, fnc) {
        listBox.his.onEvent([event, fnc, 'rect', this.actX, this.actY, this.actWidth, this.actHeight]);
    };

    listBox.Title.prototype.removeEvent = function (event) {
        listBox.his.removeEvent([event, 'rect', this.actX, this.actY, this.actWidth, this.actHeight]);
    };

    listBox.Body = function (initData, paintFlage) {
        this.initData = initData;
        this.x = initData.position.x;
        this.y = initData.position.y;
        this.width = initData.size.width;
        this.height = initData.size.height;
        listBox.Body.his = this;
        if (!paintFlage) {
            this.Paint();
        }
    };

    listBox.Body.prototype.setAttr = function (setData) {
        bodySetAttr(setData, this);
    };

    listBox.Body.prototype.Paint = function () {
        this.sprite = new kbSprite(this.x, this.y, this.width, this.height, listBox.his.sprite.sprite);
        var tmp = getSpriteActData(this.sprite.sprite);
        this.actX = tmp[0];
        this.actY = tmp[1];
        this.actWidth = tmp[2];
        this.actHeight = tmp[3];
    };

    listBox.Body.List = function (initData, paintFlage) {
        this.initData = initData;
        this.x = initData.position.x;
        this.y = initData.position.y;
        this.width = initData.size.width;
        this.height = initData.size.height;
        listBox.Body.List.his = this;
        this.sprite = new kbSprite(this.x, this.y, this.width, this.height, listBox.Body.his.sprite.sprite);
        var maskGraphics = new kbBoxBg(this.x, this.y,1, this.height,0x000000,listBox.Body.his.sprite.sprite);
        listBox.Body.his.sprite.sprite.mask = maskGraphics.graphics;

        if (initData.border) {
            this.borderColor = this.initData.border.color;
            this.borderWidth = this.initData.border.width;
            this.borderAlpha = this.initData.border.alpha;
        }
        if (initData.color) {
            this.backGroundColor = initData.color.backGroundColor;
            this.backGroundAlpha = initData.color.alpha;
        }

        var tmp = getSpriteActData(this.sprite.sprite);
        this.actX = tmp[0];
        this.actY = tmp[1];
        this.actWidth = tmp[2];
        this.actHeight = tmp[3];
        if (!paintFlage) {
            this.Paint();
        }
        this.moveY();
    };

    listBox.Body.List.prototype.moveY = function () {
        var his = this;
        this.sprite.sprite.interactive = true;
        this.sprite.sprite.on('mousedown', onDragStart);
        this.sprite.sprite.on('touchstart', onDragStart);

        this.sprite.sprite.on('mouseup', onDragEnd);
        this.sprite.sprite.on('mouseupoutside', onDragEnd);
        this.sprite.sprite.on('touchend', onDragEnd);
        this.sprite.sprite.on('touchendoutside', onDragEnd);

        this.sprite.sprite.on('mousemove', onDragMove);
        this.sprite.sprite.on('touchmove', onDragMove);

        var itemHis,bodyH = listBox.Body.his.actHeight;
        function onDragStart(event) {
            itemHis = listBox.Body.List.Item.his;
            bodyH = listBox.Body.his.actHeight;
            var len = itemHis.itemBoxArray.length-1;
            var sprite = itemHis.itemBoxArray[len];
            his.lastItemY = sprite.y + sprite.height;
            his.startY = event.data.global.y;
            his.stayY = his.sprite.sprite.position.y;
            his.dragFlag = true;
        }

        function onDragEnd() {
            his.dragFlag = false;
            itemHis.getItemPattinPlace();
        }

        function onDragMove(event) {
            if (his.dragFlag) {
                var chaY = (event.data.global.y-his.startY)/bodyH;
                if(chaY > .018 || chaY < -.018){
                    itemHis.listMoveFlag = true;
                }
                var newY = chaY+his.stayY;
                if(newY <= 0 && newY >= 1-his.lastItemY){
                    his.sprite.setY(newY);
                    var rollY = newY/(1-his.lastItemY)*(1-itemHis.rollHeight);
                    itemHis.rollSprite.setY(rollY);
                }
                listBox.his.sprite.render();
            }
        }
    };

    listBox.Body.List.prototype.Paint = function () {
        this.borderBg = new kbSprite(0, 0, 1, 1, this.sprite.sprite);
        createBg(this.initData,this.borderBg.sprite);
    };

    listBox.Body.List.prototype.setFrame = function (setData) {
        borderSetAttr(setData, this);
    };

    listBox.Body.List.prototype.setScrollbar = function (data) {
        this.sprite.setWidth(1 - data.size.width);
        this.rollBoxSprite = new kbSprite(data.position.x, data.position.y, data.size.width, data.size.height, listBox.Body.his.sprite.sprite);
    };

    listBox.Body.List.prototype.Sort = function () {
        console.log('running body list sort');
    };

    listBox.Body.List.prototype.addList = function () {
        console.log('running body list addList');
    };

    listBox.Body.List.prototype.onEvent = function (event, fnc, sprite) {
        if (!sprite) {
            sprite = this.sprite.sprite;
        }
        if (event == 'mouseup') {
            listBox.his.onEvent([event, fnc, 'rect', 0, 0, 1920, 678]);
        } else {
            rectEvent(event, fnc, sprite);
        }
    };

    listBox.Body.List.prototype.removeEvent = function (event) {
        listBox.his.removeEvent([event, 'rect', this.actX, this.actY, this.actWidth, this.actHeight]);
    };

    listBox.Body.List.prototype.Filter = function () {
        console.log('running body list filter');
    };

    listBox.Body.List.Item = function (initData, itemStyle, items, paintFlage) {
        this.initData = initData;
        this.items = items;
        this.itemStyle = itemStyle;
        this.itemBoxArray = [];
        this.itemBoxBgArray = [];
        this.itemPaint = this.items;
        this.itemPattinPlace = 0;
        this.upDownFlag = true;
        this.keyValue = -1;
        this.startClickTime = 0;
        listBox.Body.List.Item.his = this;
        this.paintRollBox();
        if (!paintFlage) {
            this.Paint();
        }
    };

    listBox.Body.List.Item.prototype.setItemBoxAttr = function (setData) {
        borderSetAttr(setData, this);

    };

    listBox.Body.List.Item.prototype.setItemAttr = function (setData) {
        borderSetAttr(setData, this);
    };

    listBox.Body.List.Item.prototype.Add = function (addData) {
        var len = this.itemBoxArray.length,
            styleLen = this.initData.length,
            height = this.initData[len % styleLen].size.height,
            y = len == 0 ? 0 : this.itemBoxArray[len-1].sprite.position.y+height;
        this.items.push(addData);
        this.itemPaint = this.items;
        this.paintItem(y, len, len % styleLen);
        this.visibleItem();
        this.setRollHeight();
        this.select(this.selectStyle,this.itemClickEvent);
    };

    listBox.Body.List.Item.prototype.Bind = function () {
        console.log('running body list item bind');
    };

    listBox.Body.List.Item.prototype.Delete = function (count) {
        var y = this.itemBoxArray[count].sprite.position.y,styleLen = this.initData.length;
        listBox.Body.List.his.sprite.sprite.removeChild(this.itemBoxArray[count].sprite);
        this.items.splice(count, 1);
        this.itemBoxArray.splice(count, 1);
        this.itemBoxBgArray.splice(count, 1);
        this.itemPaint = this.items;
        this.visibleItem();
        this.setRollHeight();
        for(var i= 0,len=this.itemBoxArray.length;i<len;i++){
            this.itemBoxArray[i].sprite.index = i;
            this.itemBoxBgArray[i].setColor(this.initData[i % styleLen].color.backGroundColor);
            this.itemBoxBgArray[i].setAlpha(this.initData[i % styleLen].color.alpha);
            if(i>=count){
                var height = this.initData[i % styleLen].size.height;
                this.itemBoxArray[i].setY(y);
                y += height;
            }
        }
    };

    listBox.Body.List.Item.prototype.Move = function () {
        console.log('running body list item move');
    };

    listBox.Body.List.Item.prototype.Modify = function () {
        console.log('running body list item modify');
    };

    listBox.Body.List.Item.prototype.Paint = function () {
        for (var i = 0; i < this.itemBoxArray.length; i++) {
            listBox.Body.List.his.sprite.sprite.removeChild(this.itemBoxArray[i].sprite);
        }
        this.itemBoxArray = [];
        this.itemBoxBgArray = [];
        var y = 0;
        var len = this.itemPaint.length;
        if (len != 0) {
            var styleLen = this.initData.length;
            for (var i = 0; i < len; i++) {
                y += this.initData[i % styleLen].margin.top;
                this.paintItem(y, i, i % styleLen);
                y += this.initData[i % styleLen].size.height;
            }
            this.visibleItem();
            this.setRollHeight();
        }
    };
    /*参数i是item的下标*/
    listBox.Body.List.Item.prototype.paintItem = function (y, i, j) {
        var itemBoxSprite = new kbSprite(this.initData[j].margin.left, y, this.initData[j].size.width, this.initData[j].size.height, listBox.Body.List.his.sprite.sprite);
        var itemBoxBg = createBg(this.initData[j], itemBoxSprite.sprite);
        var lenItem = this.itemPaint[i].length;
        var x1 = 0;
        for (var a = 0; a < lenItem; a++) {
            var tmp = this.itemPaint[i][a];
            x1 += this.itemStyle[a].margin.left;
            var itemSprite = new kbSprite(x1, this.itemStyle[a].margin.top, this.itemStyle[a].size.width, this.itemStyle[a].size.height, itemBoxSprite.sprite);
            createBg(this.itemStyle[a], itemSprite.sprite);
            oneSideBorder(this.itemStyle[a], itemSprite.sprite);
            if (tmp.text != undefined) {
                var textColor = tmp.color ? tmp.color : this.itemStyle[a].content.color;
                var textFont = tmp.font ? tmp.font : this.itemStyle[a].content.font;
                var textAlign = tmp.align ? tmp.align : this.itemStyle[a].content.align;
                var itemText;
                if (!textAlign) {
                    itemText = new kbBoxText(.5, .5, tmp.text, textColor, textFont, itemSprite.sprite, .5, .5);
                } else if (textAlign = 'left') {
                    itemText = new kbBoxText(.1, .5, tmp.text, textColor, textFont, itemSprite.sprite, 0, .5);
                }
                var tmp = getSpriteActData(itemSprite.sprite);
                itemText.ellipsis(tmp[2]);
            }else if (tmp.sprite != undefined) {
                itemSprite.sprite.addChild(tmp.sprite);
            }
            x1 += this.itemStyle[a].size.width;
        }
        this.itemBoxBgArray.push(itemBoxBg);
        this.itemBoxArray.push(itemBoxSprite);
    };

    listBox.Body.List.Item.prototype.setText = function(i,j,content){
        this.items[i][j].text = content;
        var child = this.itemBoxArray[i].sprite.children[j+1].children;
        for(var a= 0,len=child.length;a<len;a++){
            if(child[a] instanceof kbBoxText || child[a] instanceof PIXI.Text)child[a].text = content;
        }
    };

    listBox.Body.List.Item.prototype.visibleItem = function () {
        var len = this.itemBoxArray.length;
        var count = 0;
        var styleLen = this.initData.length;
        for (var i = 0; i < len; i++) {
            var height = this.initData[i % styleLen].size.height;
            var y = this.itemBoxArray[i].sprite.position.y;
            if (y > -height && y < .999) {
                count ++;
            }
        }
        this.pageCount = count;
    };

    listBox.Body.List.Item.prototype.getItemPattinPlace = function () {
        var len = this.itemBoxArray.length;
        var styleLen = this.initData.length;
        var listY = -listBox.Body.List.his.sprite.sprite.position.y;
        for (var i = 0; i < len; i++) {
            var height = this.initData[i % styleLen].size.height;
            var y = this.itemBoxArray[i].sprite.position.y;
            if(y <= listY && y+height > listY){
                this.itemPattinPlace = i;
            }
        }
    };

    listBox.Body.List.Item.prototype.paintRollBox = function () {
        if (listBox.Body.List.his.rollBoxSprite) {
            this.rollBoxSprite = listBox.Body.List.his.rollBoxSprite;
            var scrollBg = kbLisetScrollBgCanvas(10, 10);
            new kbCanvasBg(0, 0, 1, 1, scrollBg, this.rollBoxSprite.sprite);
            var tmp = getSpriteActData(this.rollBoxSprite.sprite);
            var height = tmp[2] / tmp[3];
            this.rollTop = new kbSprite(0, 0, 1, height, this.rollBoxSprite.sprite);
            var topAttr = [
                {
                    x: .5,
                    y: .1
                },
                {
                    x: .9,
                    y: .9
                },
                {
                    x: .1,
                    y: .9
                }
            ];
            new kbPolygon(topAttr, 0x6b6a6a, 1, this.rollTop.sprite);

            this.rollBottom = new kbSprite(0, 1 - height, 1, height, this.rollBoxSprite.sprite);
            var ButtomAttr = [
                {
                    x: .5,
                    y: .9
                },
                {
                    x: .9,
                    y: .1
                },
                {
                    x: .1,
                    y: .1
                }
            ];
            new kbPolygon(ButtomAttr, 0x6b6a6a, 1, this.rollBottom.sprite);

            this.rollCenter = new kbSprite(0, height, 1, 1 - height * 2, this.rollBoxSprite.sprite);
            this.rollHeight = division(this.pageCount,this.itemPaint.length);
            if (this.rollHeight > 1) {
                this.rollHeight = 1;
            }
            this.paintRoll();
            this.dragRoll();
        }
    };

    listBox.Body.List.Item.prototype.paintRoll = function () {
        var his = this;
        this.rollSprite = new kbSprite(0, 0, 1, this.rollHeight, this.rollCenter.sprite);
        this.scrollLine = new PIXI.Graphics();
        this.rollSprite.sprite.addChild(this.scrollLine);
        this.rollTop.sprite.interactive = true;
        this.rollBottom.sprite.interactive = true;
        this.rollCenter.sprite.interactive = true;
        this.rollTop.sprite.on('mousedown', clickRollTop);
        this.rollTop.sprite.on('touchstart', clickRollTop);

        this.rollBottom.sprite.on('mousedown', clickRollBottom);
        this.rollBottom.sprite.on('touchstart', clickRollBottom);

        this.rollCenter.sprite.on('mousedown', clickRollCenter);
        this.rollCenter.sprite.on('touchstart', clickRollCenter);

        function clickRollTop(event) {
            event.stopPropagation();
            his.jumpPage('perOne');
            his.rollMoveFlag = false;
        }

        function clickRollBottom() {
            event.stopPropagation();
            his.jumpPage('nextOne');
            his.rollMoveFlag = false;
        }

        function clickRollCenter(event){
            var rollY = his.rollSprite.sprite.position.y;
            var rollH = his.rollSprite.sprite.height;
            var y = event.data.getLocalPosition(his.rollBoxSprite.sprite).y;
            if(y < rollY){
                his.jumpPage('per');
            }else if(y > rollY+rollH){
                his.jumpPage('next');
            }
            his.rollMoveFlag = false;
        }
    };

    listBox.Body.List.Item.prototype.setRollHeight = function () {
        this.rollHeight = division(this.pageCount,this.itemPaint.length);
        if (this.rollHeight > 1) {
            this.rollHeight = 1;
        }
        this.rollSprite.setHeight(this.rollHeight);
        var tmp = getSpriteActData(this.rollSprite.sprite), actH = tmp[3];
        this.scrollLine.clear();
        this.scrollLine.beginFill(0x22222b);
        this.scrollLine.lineStyle(3 / actH, 0x3d3d46);
        this.scrollLine.drawRect(0,0,1,1);
        this.scrollLine.moveTo(0, .5 - 10 / actH);
        this.scrollLine.lineTo(1, .5 - 10 / actH);
        this.scrollLine.moveTo(0, .5);
        this.scrollLine.lineTo(1, .5);
        this.scrollLine.moveTo(0, .5 + 10 / actH);
        this.scrollLine.lineTo(1, .5 + 10 / actH);
        this.scrollLine.endFill();
    };

    listBox.Body.List.Item.prototype.dragRoll = function () {
        var tmp;
        var his = this;
        tmp = getSpriteActData(his.rollCenter.sprite);
        var bodyH = tmp[3];
        this.rollSprite.sprite.interactive = true;
        this.rollSprite.sprite.on('mousedown', onDragStart);
        this.rollSprite.sprite.on('touchstart', onDragStart);
        this.rollSprite.sprite.on('mouseup', onDragEnd);
        this.rollSprite.sprite.on('mouseupoutside', onDragEnd);
        this.rollSprite.sprite.on('touchend', onDragEnd);
        this.rollSprite.sprite.on('touchendoutside', onDragEnd);
        this.rollSprite.sprite.on('mousemove', onDragMove);
        this.rollSprite.sprite.on('touchmove', onDragMove);
        function onDragStart(event) {
            event.stopPropagation();
            his.startY = event.data.global.y;
            his.stayY = his.rollSprite.sprite.position.y;
            var len = his.itemBoxArray.length-1;
            var sprite = his.itemBoxArray[len];
            his.lastItemY = sprite.y + sprite.height;
            his.rollMoveFlag = true;
        }

        function onDragEnd() {
            his.rollMoveFlag = false;
            his.getItemPattinPlace();
        }

        function onDragMove(event) {
            if (his.rollMoveFlag) {
                var chaY = (event.data.global.y-his.startY)/bodyH;
                var newY = chaY+his.stayY;
                if(newY >= 0 && newY <= 1-his.rollHeight){
                    his.rollSprite.setY(newY);
                    var listY = newY/(1-his.rollHeight)*(1-his.lastItemY);
                    listBox.Body.List.his.sprite.setY(listY);
                }
                listBox.his.sprite.render();
            }
        }
    };

    listBox.Body.List.Item.prototype.itemMove = function (itemPlace) {
        var listSprite = listBox.Body.List.his.sprite;
        var a = Math.floor(itemPlace);
        var y = -(this.itemBoxArray[a].sprite.position.y);
        listSprite.setY(y);
    };

    listBox.Body.List.Item.prototype.paintRollPlace = function (y) {
        var per = (y) / (this.itemPaint.length - this.pageCount);
        if (per >= 0 && per <= 1) {
            var height = this.rollSprite.sprite.height;
            var yPer = (1 - height) * per;
            this.rollSprite.setY(yPer);
        }
    };

    listBox.Body.List.Item.prototype.jumpPage = function (pageFlag) {
        var page;
        if (pageFlag == 'last') {
            page = this.itemPaint.length - this.pageCount;
        } else if (pageFlag == 'next') {
            page = this.itemPattinPlace + this.pageCount;
        } else if (pageFlag == 'per') {
            page = this.itemPattinPlace - this.pageCount;
        } else if (pageFlag == 'perOne') {
            page = this.itemPattinPlace - 1;
        } else if (pageFlag == 'nextOne') {
            page = this.itemPattinPlace + 1;
        } else {
            page = pageFlag * this.pageCount;
        }
        if (page > (this.itemPaint.length - this.pageCount)) {
            page = this.itemPaint.length - this.pageCount;
        } else if (page < 0) {
            page = 0;
        }
        this.itemPattinPlace = page;
        this.itemMove(this.itemPattinPlace);
        this.paintRollPlace(this.itemPattinPlace);
    };

    listBox.Body.List.Item.prototype.keyDown = function (currKey) {
        if (currKey == 38) {
            this.jumpPage('perOne');
        } else if (currKey == 40) {
            this.jumpPage('nextOne');
        }
    };

    listBox.Body.List.Item.prototype.onEvent = function (event, fnc, sprite) {
        if (!sprite) {
            rectEvent(event, itemsEvent, listBox.Body.List.his.sprite.sprite);
        } else {
            rectEvent(event, fnc, sprite);
        }
        var his = this;
        function itemsEvent(x, y) {
            var len = his.itemBoxArray.length;
            for (var v in his.itemBoxArray) {
                if (v < len) {
                    var tmp = getSpriteActData(his.itemBoxArray[v].sprite);
                    var isIn = isInRect(x, y, tmp[0], tmp[1], tmp[2], tmp[3]);
                    if (isIn) {
                        fnc(his.itemBoxArray[v].sprite);
                    }
                }
            }
        }
    };

    listBox.Body.List.Item.prototype.removeEvent = function (event) {
        listBox.his.removeEvent([event, 'rect', this.actX, this.actY, this.actWidth, this.actHeight]);
    };

    listBox.Body.List.Item.prototype.changeItemEvent = function (s) {
        var len = this.itemBoxArray.length;
        var tmp, cha;
        if (!s) {
            s = 0;
        }
        for (var i = 0; i < len; i++) {
            tmp = this.itemEventData[i];
            cha = tmp[1] + s;
            listBox.his.removeEvent(['mousedown', 'rect', tmp[0], tmp[1], tmp[2], tmp[3]], [tmp[0], cha, tmp[2], tmp[3]]);
            this.itemEventData[i][1] = cha;
        }
    };

    listBox.Body.List.Item.prototype.select = function (data, Len) {
        var start, len, tmp, his = this;
        var styleLen = this.initData.length,resultIndex = [];
        if (typeof Len == 'function') {
            this.selectStyle = data;
            start = 0;
            len = this.itemBoxArray.length;
            this.itemEventData = new Array(len);
            this.itemClickEvent = Len;
        } else {
            start = data;
            len = Len + start;
        }
        for (var i = start; i < len; i++) {
            tmp = getSpriteActData(this.itemBoxArray[i].sprite);
            this.itemEventData[i] = tmp;
        }
        for (i = start; i < len; i++) {
            his.itemBoxArray[i].sprite.interactive = true;
            his.itemBoxArray[i].sprite.removeAllListeners();
            his.itemBoxArray[i].sprite.on('pointertap', onDragClick);
            his.itemBoxArray[i].sprite.on('pointerdown', onDragDown);
            //his.itemBoxArray[i].sprite.on('touchstart', onDragStart,his.itemBoxArray[i].sprite);
            his.itemBoxArray[i].sprite.index = i;
        }
        function onDragDown(){
            his.listMoveFlag = false;
        }
        function onDragClick() {
            if(his.listMoveFlag)return;
            var index = this.context ? this.context.index : this.index;
            his.endClickTime = Date.now();
            var difTime = his.endClickTime - his.startClickTime;
            his.startClickTime = his.endClickTime;
            if ((his.keyValue != 17 && difTime > 500) || his.noMultiselect) {
                resultIndex = [];
                for (var i= 0,len=his.itemBoxBgArray.length;i<len;i++) {
                    his.itemBoxBgArray[i].setColor(his.initData[i % styleLen].color.backGroundColor);
                    his.itemBoxBgArray[i].setAlpha(his.initData[i % styleLen].color.alpha);
                }
            }
            if (his.selectStyle.color.backGroundColor) {
                his.itemBoxBgArray[index].setColor(his.selectStyle.color.backGroundColor);
            }
            if (his.selectStyle.color.alpha) {
                his.itemBoxBgArray[index].setAlpha(his.selectStyle.color.alpha);
            }
            resultIndex.push(index);
            resultIndex.length == 1 ? his.itemClickEvent(resultIndex[0],his.items[index]) : his.itemClickEvent(resultIndex);
            listBox.his.sprite.render();
        }
    };

    listBox.Body.List.Item.prototype.setNoMultiselect = function(flag){
        this.noMultiselect = flag;
    };

    listBox.Body.List.Item.prototype.get = function (index) {
        return this.items[index];
    };

    listBox.Body.Search = function (initData, paintFlage) {
        this.initData = initData;
        this.x = initData.position.x;
        this.y = initData.position.y;
        this.width = initData.size.width;
        this.height = initData.size.height;
        this.sprite = new kbSprite(this.x, this.y, this.width, this.height, listBox.Body.his.sprite.sprite);
        listBox.Body.Search.his = this;

        if (initData.border) {
            this.borderColor = this.initData.border.color;
            this.borderWidth = this.initData.border.width;
            this.borderAlpha = this.initData.border.alpha;
        }
        if (initData.color) {
            this.backGroundColor = initData.color.backGroundColor;
            this.backGroundAlpha = initData.color.alpha;
        }

        var tmp = getSpriteActData(this.sprite.sprite);
        this.actX = tmp[0];
        this.actY = tmp[1];
        this.actWidth = tmp[2];
        this.actHeight = tmp[3];
        if (!paintFlage) {
            this.Paint();
        }
    };

    listBox.Body.Search.prototype.Paint = function () {
        this.borderBg = createBg(this.initData, this.sprite.sprite);
    };

    listBox.Body.Search.prototype.setAttr = function (setData) {
        borderSetAttr(setData, this);
    };

    listBox.Body.Search.prototype.createClass = function (data) {
        var tmp = allPrpos(data);
        this.attr = tmp.key;
        this.classButton = new kbButton(.1, .2, .2, .6, 0x000000, '分类', 'white', '8pt', this.sprite.sprite);
        this.classSelet = new kbSelet(.1, .8, .3, 1, 0x838383, 0xFFFFFF, 'green', this.attr, this.sprite.sprite, this.classButton);
        /*设置select的index*/
        var index = listBox.Body.his.sprite.sprite.children.length - 1;
        listBox.Body.his.sprite.sprite.setChildIndex(this.sprite.sprite, index);
        /*点击其他位置消失*/
        listBox.his.ctx.on('mousedown', onDragStart);
        listBox.his.ctx.on('touchstart', onDragStart);
        var his = this;
        var his1 = listBox.Body.List.Item.his;

        function onDragStart() {
            his.classSelet.sprite.renderable = false;
            his.classSelet.sprite.interactiveChildren = false;
        }

        function getSelectValue(data) {
            his1.itemPaint = [];
            var sub = tmp.val[data];
            if (sub == 'all') {
                his1.itemPaint = his1.items;
            } else {
                var len = sub.length;
                for (var i = 0; i < len; i++) {
                    his1.itemPaint.push(his1.items[sub[i]]);
                }
            }
            his1.Paint();
            his1.setRollHeight();
        }
    };

    listBox.Body.Search.prototype.setOptions = function () {
        console.log('running body search setOptions');
    };

    listBox.Body.Search.prototype.onEvent = function (event, fnc, sprite) {
        if (!sprite) {
            sprite = this.sprite.sprite;
        }
        if (event == 'mouseup') {
            listBox.his.onEvent([event, fnc, 'rect', 0, 0, 1920, 678]);
        } else {
            rectEvent(event, fnc, sprite);
        }
    };

    listBox.Body.Search.prototype.removeEvent = function (event) {
        listBox.his.removeEvent([event, 'rect', his.actX, his.actY, his.actWidth, his.actHeight]);
    };

    listBox.Body.Seqment = function (initData, items, paintFlage) {
        this.initData = initData;
        this.items = items;
        this.x = initData.position.x;
        this.y = initData.position.y;
        this.width = initData.size.width;
        this.height = initData.size.height;
        this.itemArray = [];
        this.sprite = new kbSprite(this.x, this.y, this.width, this.height, listBox.Body.his.sprite.sprite);

        if (initData.border) {
            this.borderColor = this.initData.border.color;
            this.borderWidth = this.initData.border.width;
            this.borderAlpha = this.initData.border.alpha;
        }
        if (initData.color) {
            this.backGroundColor = initData.color.backGroundColor;
            this.backGroundAlpha = initData.color.alpha;
        }

        var tmp = getSpriteActData(this.sprite.sprite);
        this.actX = tmp[0];
        this.actY = tmp[1];
        this.actW = tmp[2];
        this.actH = tmp[3];
        if (!paintFlage) {
            this.Paint();
        }
    };

    listBox.Body.Seqment.prototype.createSeqmentItem = function () {
        var len = this.itemArray.length;
        for (var i = 0; i < len; i++) {
            this.sprite.sprite.removeChild(this.itemArray[i].sprite);
        }
        var len = this.items.length;
        var x = 0;
        for (var i = 0; i < len; i++) {
            var tmp = this.items[i];
            x += tmp.margin.left;
            var itemSprite = new kbSprite(x, tmp.margin.top, tmp.size.width, tmp.size.height, this.sprite.sprite);
            oneSideBorder(tmp, itemSprite.sprite);
            if (tmp.color) {
                if (tmp.border) {
                    new kbBoxBg(0, 0, 1, 1, tmp.color.backGroundColor, itemSprite.sprite, tmp.color.backGroundAlpha).setBorder(tmp.border.borderWidth, tmp.border.borderColor);
                } else {
                    new kbBoxBg(0, 0, 1, 1, tmp.color.backGroundColor, itemSprite.sprite, tmp.color.backGroundAlpha);
                }
            } else {
                if (tmp.border) {
                    new kbBoxBg(0, 0, 1, 1, '', itemSprite.sprite, 0).setBorder(tmp.border.borderWidth, tmp.border.borderColor);
                } else {
                    new kbBoxBg(0, 0, 1, 1, '', itemSprite.sprite, 0);
                }
            }
            if (tmp.content.align) {
                if (tmp.content.align == 'left') {
                    new kbBoxText(.1, .5, tmp.content.text, tmp.content.color, tmp.content.font, itemSprite.sprite, 0, .5);
                }
            } else {
                new kbBoxText(.5, .5, tmp.content.text, tmp.content.color, tmp.content.font, itemSprite.sprite, .5, .5);
            }

            x += tmp.size.width;
            this.itemArray.push(itemSprite);
        }
    };

    listBox.Body.Seqment.prototype.Add = function (addData) {
        var len = addData.length;
        for (var i = 0; i < len; i++) {
            this.items.push(addData[i]);
        }
        this.createSeqmentItem();
    };

    listBox.Body.Seqment.prototype.Delete = function (count) {
        this.items.splice(count, 1);
        this.createSeqmentItem();
    };

    listBox.Body.Seqment.prototype.Modify = function () {
        console.log('running body seqmentmodify');
    };

    listBox.Body.Seqment.prototype.setAttr = function () {
        console.log('running body seqment setAttr');

    };

    listBox.Body.Seqment.prototype.Paint = function () {
        this.borderBg = createBg(this.initData, this.sprite.sprite);
        this.createSeqmentItem();
    };

    listBox.Body.Seqment.prototype.onEvent = function (event, fnc, sprite) {
        if (!sprite) {
            sprite = this.sprite.sprite;
        }
        if (event == 'mouseup') {
            listBox.his.onEvent([event, fnc, 'rect', 0, 0, 1920, 678]);
        } else {
            rectEvent(event, fnc, sprite);
        }
    };

    listBox.Body.Seqment.prototype.removeEvent = function (event) {
        listBox.his.removeEvent([event, 'rect', this.actX, this.actY, this.actW, this.actH]);
    };

    listBox.Body.Footer = function (initData, paintFlage) {
        this.initData = initData;
        this.x = initData.position.x;
        this.y = initData.position.y;
        this.width = initData.size.width;
        this.height = initData.size.height;
        this.buttonWidth = .1;
        this.buttonHeight = .8;
        this.buttonY = (1 - this.buttonHeight) / 2;
        this.sprite = new kbSprite(this.x, this.y, this.width, this.height, listBox.Body.his.sprite.sprite);

        if (initData.border) {
            this.borderColor = this.initData.border.color;
            this.borderWidth = this.initData.border.width;
            this.borderAlpha = this.initData.border.alpha;
        }
        if (initData.color) {
            this.backGroundColor = initData.color.backGroundColor;
            this.backGroundAlpha = initData.color.alpha;
        }

        var tmp = getSpriteActData(this.sprite.sprite);
        this.actX = tmp[0];
        this.actY = tmp[1];
        this.actWidth = tmp[2];
        this.actHeight = tmp[3];
        if (!paintFlage) {
            this.Paint();
        }
    };

    listBox.Body.Footer.prototype.Paint = function () {
        createBg(this.initData, this.sprite.sprite);
        this.createButtonFirst();
        this.createButtonPer();
        this.createIpt();
        this.createButtonJump();
        this.createButtonNext();
        this.createButtonLast();
    };

    listBox.Body.Footer.prototype.createButtonFirst = function () {
        var his = this;
        this.buttonFirst = new kbButton(.05, this.buttonY, this.buttonWidth, this.buttonHeight, 0x000000, '首页', 'white', '8pt', this.sprite.sprite);
        this.onEvent('mousedown', jumpFirstPage, this.buttonFirst.sprite);
        this.onEvent('touchstart', jumpFirstPage, this.buttonFirst.sprite);
        function jumpFirstPage() {
            his.setPage(0);
        }
    };

    listBox.Body.Footer.prototype.createButtonPer = function () {
        var his = this;
        this.buttonFirst = new kbButton(.2, this.buttonY, this.buttonWidth, this.buttonHeight, 0x000000, '上一页', 'white', '8pt', this.sprite.sprite);
        this.onEvent('mousedown', jumpPerPage, this.buttonFirst.sprite);
        this.onEvent('touchstart', jumpPerPage, this.buttonFirst.sprite);
        function jumpPerPage() {
            his.setPage('per');
        }
    };

    listBox.Body.Footer.prototype.createIpt = function () {
        this.iptSprite = new kbSprite(.35, this.buttonY, this.buttonWidth, this.buttonHeight, this.sprite.sprite);
        new kbBoxBg(0, 0, 1, 1, 0x000000, this.iptSprite.sprite);
        var iptStyle = {
            position: 'absolute',
            border: 'none',
            background: 'none',
            color: 'white',
            fontSize: '8pt',
            textAlign: 'center',
        };
        var ipt = new kbInput(this.iptSprite.sprite, document.body, iptStyle);
        this.ipt = ipt.ipt;
        this.ipt.value = 1;
        unBlur(this.ipt);
    };

    listBox.Body.Footer.prototype.createButtonJump = function () {
        var his = this;
        this.allPage = Math.ceil(listBox.Body.List.Item.his.items.length / listBox.Body.List.Item.his.pageCount);
        this.allpageTextContent = '/共' + this.allPage + '页';
        this.allpageText = new kbBoxText(.45, .5, this.allpageTextContent, 'black', '8pt', this.sprite.sprite, 0, .5);
        this.jumpButton = new kbButton(.5, this.buttonY, this.buttonWidth, this.buttonHeight, 0x000000, '跳转', 'white', '8pt', this.sprite.sprite);
        this.onEvent('mousedown', jumpPage, this.jumpButton.sprite);
        this.onEvent('touchstart', jumpPage, this.jumpButton.sprite);
        function jumpPage() {
            var iptVal = his.ipt.value;
            if (iptVal < 1) {
                iptVal = 1;
            }
            his.setPage(iptVal - 1);
        }
    };

    listBox.Body.Footer.prototype.createButtonNext = function () {
        var his = this;
        this.buttonFirst = new kbButton(.7, this.buttonY, this.buttonWidth, this.buttonHeight, 0x000000, '下一页', 'white', '8pt', this.sprite.sprite);
        this.onEvent('mousedown', jumpNextPage, this.buttonFirst.sprite);
        this.onEvent('touchstart', jumpNextPage, this.buttonFirst.sprite);
        function jumpNextPage() {
            his.setPage('next');
        }
    };

    listBox.Body.Footer.prototype.createButtonLast = function () {
        var his = this;
        this.buttonLast = new kbButton(.85, this.buttonY, this.buttonWidth, this.buttonHeight, 0x000000, '尾页', 'white', '8pt', this.sprite.sprite);
        this.onEvent('mousedown', jumpLastPage, this.buttonLast.sprite);
        this.onEvent('touchstart', jumpLastPage, this.buttonLast.sprite);
        function jumpLastPage() {
            his.setPage('last');
        }
    };

    listBox.Body.Footer.prototype.onEvent = function (event, fnc, sprite) {
        if (!sprite) {
            sprite = this.sprite.sprite;
        }
        rectEvent(event, fnc, sprite)
    };

    listBox.Body.Footer.prototype.removeEvent = function (event) {
        listBox.his.removeEvent([event, 'rect', this.actX, this.actY, this.actWidth, this.actHeight]);
    };

    listBox.Body.Footer.prototype.setPage = function (num) {
        listBox.Body.List.Item.his.jumpPage(num);
    };

    return listBox;
};
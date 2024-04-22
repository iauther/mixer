var fxRangeTab = function(){
    return [
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(-1500,400),

        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(20,20000),
        new rangeObj(4,1280),

        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(-300,300),
        new rangeObj(20,20000),
        new rangeObj(4,1280),
        new rangeObj(0,0),

        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(-300,300),
        new rangeObj(20,20000),
        new rangeObj(4,1280),
        new rangeObj(0,0),

        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(-300,300),
        new rangeObj(20,20000),
        new rangeObj(4,1280),
        new rangeObj(0,0),

        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(-300,300),
        new rangeObj(20,20000),
        new rangeObj(4,1280),
        new rangeObj(0,0),

        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),

        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0)
    ];
}();

var outputRangeTab = function(){
    return [
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(-1500,400),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0),
        new rangeObj(0,0)
    ]
}();

var portRangeTab = function () {
    return {
        trim : new rangeObj(-1500,400),
        delay : new rangeObj(0,500),
        fback : new rangeObj(0,3),
        phase : new rangeObj(0,0),
        ppower : new rangeObj(0,0),
        value : new rangeObj(0,0),
        mute : new rangeObj(0,0),
        solo : new rangeObj(0,0)
    }
}();

var sendRangeTab = function () {
    return {
        val : new rangeObj(-1500,400),
        mute : new rangeObj(0,500),
        solo : new rangeObj(0,0)
    }
}();

var rangeTab = function(){
    return {
        mainSlider : new rangeObj(-800,200)
    }
}();
function rangeObj(min,max){
    this.max = max;
    this.min = min;
}
var ip_port = '54321';
var webPowerControl = {
    SOCKET : false,
    URL : true,
    LOGIN : true,
    LEVELS : true
};

function debug_sett_constructor(){
    this.log = false;
    this.info = false;
    this.erroe = false;
    this.trace = false;
    this.warn = false;
    this.set = function(array){
        this.log = array[0];
        this.info = array[1];
        this.erroe = array[2];
        this.trace = array[3];
        this.warn = array[4];
    }
}

var debug_sett = new debug_sett_constructor();
debug_sett.set([1,0,0,0,0]);

function kbLog(attr){
    if(!attr)return;
    var data = [];
    for(var i= 1,len=arguments.length;i<len;i++){
        data.push(arguments[i])
    }
    if(debug_sett[attr]){
        if(console[attr].apply){
            console[attr].apply(console,data);
        }else{
            console[attr](data);
        }
    }
}
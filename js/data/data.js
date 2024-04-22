var inputChannelID = function(){
    var ItemLen = 0;
    return {
        ID_IN_SOLO : ItemLen++,
        ID_IN_MUTE : ItemLen++,
        ID_IN_GAIN : ItemLen++,

        ID_IN_MIXERPAN_BYPASS : ItemLen++,
        ID_IN_MIXERPAN_PHASE : ItemLen++,
        ID_IN_MIXERPAN_PPOWER : ItemLen++,
        ID_IN_MIXERPAN_GAIN : ItemLen++,
        ID_IN_MIXERPAN_DIRECT_RATIO : ItemLen++,
        ID_IN_MIXERPAN_ECHO_RATIO : ItemLen++,
        ID_IN_MIXERPAN_REVERB_RATIO : ItemLen++,
        ID_IN_MIXERPAN_PAN : ItemLen++,
        ID_IN_MIXERPAN_FSK : ItemLen++,    //0, 1, 2, 3

        ID_IN_PEQ_BYPASS : ItemLen++,
        ID_IN_PEQ_HPF_BYPASS : ItemLen++,
        ID_IN_PEQ_HPF_PRE_ORDER : ItemLen++,
        ID_IN_PEQ_HPF_MAX_ORDER : ItemLen++,
        ID_IN_PEQ_HPF_RESPONSE : ItemLen++,
        ID_IN_PEQ_HPF_METHOD : ItemLen++,
        ID_IN_PEQ_HPF_FREQ : ItemLen++,
        ID_IN_PEQ_HPF_Q : ItemLen++,

        //PEQ : ItemLen++,Pcount: 4
        ID_IN_PEQ_1_BYPASS : ItemLen++,
        ID_IN_PEQ_1_RESPONSE : ItemLen++,
        ID_IN_PEQ_1_GAIN : ItemLen++,
        ID_IN_PEQ_1_FREQ : ItemLen++,
        ID_IN_PEQ_1_Q : ItemLen++,
        ID_IN_PEQ_1_TYPE : ItemLen++,  //0: PEQ, 1: L-SHELF

        ID_IN_PEQ_2_BYPASS : ItemLen++,
        ID_IN_PEQ_2_RESPONSE : ItemLen++,
        ID_IN_PEQ_2_GAIN : ItemLen++,
        ID_IN_PEQ_2_FREQ : ItemLen++,
        ID_IN_PEQ_2_Q : ItemLen++,
        ID_IN_PEQ_2_TYPE : ItemLen++,

        ID_IN_PEQ_3_BYPASS : ItemLen++,
        ID_IN_PEQ_3_RESPONSE : ItemLen++,
        ID_IN_PEQ_3_GAIN : ItemLen++,
        ID_IN_PEQ_3_FREQ : ItemLen++,
        ID_IN_PEQ_3_Q : ItemLen++,
        ID_IN_PEQ_3_TYPE : ItemLen++,

        ID_IN_PEQ_4_BYPASS : ItemLen++,
        ID_IN_PEQ_4_RESPONSE : ItemLen++,
        ID_IN_PEQ_4_GAIN : ItemLen++,
        ID_IN_PEQ_4_FREQ : ItemLen++,
        ID_IN_PEQ_4_Q : ItemLen++,
        ID_IN_PEQ_4_TYPE : ItemLen++,

        ID_IN_ECHO_BYPASS : ItemLen++,
        ID_IN_ECHO_PRE_DELAY : ItemLen++,
        ID_IN_ECHO_DELAY : ItemLen++,
        ID_IN_ECHO_REPEAT_RATIO : ItemLen++,
        ID_IN_ECHO_TYPE : ItemLen++,

        ID_IN_REVB_BYPASS : ItemLen++,
        ID_IN_REVB_PRE_DELAY : ItemLen++,
        ID_IN_REVB_TIME : ItemLen++,
        ID_IN_REVB_FREQ : ItemLen++,
        ID_IN_REVB_TYPE : ItemLen++,

        //GATECPS
        ID_IN_GATECPS_BYPASS : ItemLen++,
        ID_IN_GATECPS_GATE_LEVEL : ItemLen++,
        ID_IN_GATECPS_GATE_GAIN : ItemLen++,
        ID_IN_GATECPS_CPS_LEVEL : ItemLen++,
        ID_IN_GATECPS_CPS_GAIN : ItemLen++,

        ID_IN_GATECPS_GATE_BYPASS : ItemLen++,
        ID_IN_GATECPS_GATE_THRESHOLD : ItemLen++,
        ID_IN_GATECPS_GATE_DEPTH : ItemLen++,
        ID_IN_GATECPS_GATE_ATTCK : ItemLen++,
        ID_IN_GATECPS_GATE_HOLD : ItemLen++,
        ID_IN_GATECPS_GATE_RELEASE : ItemLen++,

        ID_IN_GATECPS_CPS_BYPASS : ItemLen++,
        ID_IN_GATECPS_CPS_THRESHOLD : ItemLen++,
        ID_IN_GATECPS_CPS_RATIO : ItemLen++,
        ID_IN_GATECPS_CPS_ATTCK : ItemLen++,
        ID_IN_GATECPS_CPS_HOLD : ItemLen++,
        ID_IN_GATECPS_CPS_RELEASE : ItemLen++,

        ID_IN_NUM : ItemLen
    };
}();

var fxChannelID = function(){
    var len = 0;
    return {
        ID_FX_SOLO : len++,
        ID_FX_MUTE : len++,
        ID_FX_GAIN : len++,

        ID_FX_PEQ_BYPASS : len++,
        ID_FX_PEQ_HPF_BYPASS : len++,
        ID_FX_PEQ_HPF_PRE_ORDER : len++,
        ID_FX_PEQ_HPF_MAX_ORDER : len++,
        ID_FX_PEQ_HPF_RESPONSE : len++,
        ID_FX_PEQ_HPF_METHOD : len++,
        ID_FX_PEQ_HPF_FREQ : len++,
        ID_FX_PEQ_HPF_Q : len++,

        //PEQ, count: 4
        ID_FX_PEQ_1_BYPASS : len++,
        ID_FX_PEQ_1_RESPONSE : len++,
        ID_FX_PEQ_1_GAIN : len++,
        ID_FX_PEQ_1_FREQ : len++,
        ID_FX_PEQ_1_Q : len++,
        ID_FX_PEQ_1_TYPE : len++,  //0: PEQ, 1: L-SHELF

        ID_FX_PEQ_2_BYPASS : len++,
        ID_FX_PEQ_2_RESPONSE : len++,
        ID_FX_PEQ_2_GAIN : len++,
        ID_FX_PEQ_2_FREQ : len++,
        ID_FX_PEQ_2_Q : len++,
        ID_FX_PEQ_2_TYPE : len++,

        ID_FX_PEQ_3_BYPASS : len++,
        ID_FX_PEQ_3_RESPONSE : len++,
        ID_FX_PEQ_3_GAIN : len++,
        ID_FX_PEQ_3_FREQ : len++,
        ID_FX_PEQ_3_Q : len++,
        ID_FX_PEQ_3_TYPE : len++,

        ID_FX_PEQ_4_BYPASS : len++,
        ID_FX_PEQ_4_RESPONSE : len++,
        ID_FX_PEQ_4_GAIN : len++,
        ID_FX_PEQ_4_FREQ : len++,
        ID_FX_PEQ_4_Q : len++,
        ID_FX_PEQ_4_TYPE : len++,

        ID_FX_ECHO_BYPASS : len++,
        ID_FX_ECHO_PRE_DELAY : len++,
        ID_FX_ECHO_DELAY : len++,
        ID_FX_ECHO_REPEAT_RATIO : len++,
        ID_FX_ECHO_TYPE : len++,

        ID_FX_REVB_BYPASS : len++,
        ID_FX_REVB_PRE_DELAY : len++,
        ID_FX_REVB_TIME : len++,
        ID_FX_REVB_FREQ : len++,
        ID_FX_REVB_TYPE : len++,

        ID_FX_NUM : len++
    };
}();

var outputChannelID = function(){
    var len = 0;
    return {
        ID_OUT_AUDIOMODE : len++,
        ID_OUT_ROUTER : len++,
        ID_OUT_MIXERMODE : len++,

        ID_OUT_LIMITER_BYPASS : len++,
        ID_OUT_LIMITER_LEVEL : len++,
        ID_OUT_LIMITER_THRESHOLD : len++,
        ID_OUT_LIMITER_ATTCK : len++,
        ID_OUT_LIMITER_RELEASE : len++,
        ID_OUT_LIMITER_CLIP_LEVEL : len++,
        ID_OUT_LIMITER_CLIP_RELEASE : len++,

        ID_OUT_LIMITERX3_BYPASS : len++,
        ID_OUT_LIMITERX3_CPS_LEVEL : len++,
        ID_OUT_LIMITERX3_CPS_GAIN : len++,
        ID_OUT_LIMITERX3_PEAK_LEVEL : len++,
        ID_OUT_LIMITERX3_PEAK_GAIN : len++,
        ID_OUT_LIMITERX3_CPS_THRESHOLD : len++,
        ID_OUT_LIMITERX3_CPS_RATIO : len++,
        ID_OUT_LIMITERX3_CPS_ATTCK : len++,
        ID_OUT_LIMITERX3_CPS_HOLD : len++,
        ID_OUT_LIMITERX3_CPS_RELEASE : len++,
        ID_OUT_LIMITERX3_LIM_THRESHOLD : len++,
        ID_OUT_LIMITERX3_LIM_RATIO : len++,
        ID_OUT_LIMITERX3_LIM_ATTCK : len++,
        ID_OUT_LIMITERX3_LIM_HOLD : len++,
        ID_OUT_LIMITERX3_LIM_RELEASE : len++,

        ID_OUT_DELAY_BYPASS : len++,
        ID_OUT_DELAY_MUTE : len++,
        ID_OUT_DELAY_GAIN : len++,
        ID_OUT_DELAY_TIME : len++,
        ID_OUT_DELAY_LEN : len++,

        ID_OUT_HPF_BYPASS : len++,
        ID_OUT_HPF_MUTE : len++,
        ID_OUT_HPF_PRE_ORDER : len++,
        ID_OUT_HPF_MAX_ORDER : len++,
        ID_OUT_HPF_RESPONSE : len++,
        ID_OUT_HPF_METHOD : len++,
        ID_OUT_HPF_FREQ : len++,
        ID_OUT_HPF_Q : len++,

        ID_OUT_LPF_BYPASS : len++,
        ID_OUT_LPF_MUTE : len++,
        ID_OUT_LPF_PRE_ORDER : len++,
        ID_OUT_LPF_MAX_ORDER : len++,
        ID_OUT_LPF_RESPONSE : len++,
        ID_OUT_LPF_METHOD : len++,
        ID_OUT_LPF_FREQ : len++,
        ID_OUT_LPF_Q : len++,

        ID_OUT_PEQ_BYPASS : len++,
        ID_OUT_PEQ_1_RESPONSE : len++,
        ID_OUT_PEQ_1_FREQ : len++,
        ID_OUT_PEQ_1_GAIN : len++,
        ID_OUT_PEQ_1_Q : len++,

        ID_OUT_PEQ_2_RESPONSE : len++,
        ID_OUT_PEQ_2_FREQ : len++,
        ID_OUT_PEQ_2_GAIN : len++,
        ID_OUT_PEQ_2_Q : len++,

        ID_OUT_PEQ_3_RESPONSE : len++,
        ID_OUT_PEQ_3_FREQ : len++,
        ID_OUT_PEQ_3_GAIN : len++,
        ID_OUT_PEQ_3_Q : len++,

        ID_OUT_PEQ_4_RESPONSE : len++,
        ID_OUT_PEQ_4_FREQ : len++,
        ID_OUT_PEQ_4_GAIN : len++,
        ID_OUT_PEQ_4_Q : len++,

        ID_OUT_PEQ_5_RESPONSE : len++,
        ID_OUT_PEQ_5_FREQ : len++,
        ID_OUT_PEQ_5_GAIN : len++,
        ID_OUT_PEQ_5_Q : len++,

        ID_OUT_PEQ_6_RESPONSE : len++,
        ID_OUT_PEQ_6_FREQ : len++,
        ID_OUT_PEQ_6_GAIN : len++,
        ID_OUT_PEQ_6_Q : len++,

        ID_OUT_PEQ_7_RESPONSE : len++,
        ID_OUT_PEQ_7_FREQ : len++,
        ID_OUT_PEQ_7_GAIN : len++,
        ID_OUT_PEQ_7_Q : len++,

        ID_OUT_PEQ_8_BYPASS : len++,
        ID_OUT_PEQ_8_RESPONSE : len++,
        ID_OUT_PEQ_8_FREQ : len++,
        ID_OUT_PEQ_8_GAIN : len++,
        ID_OUT_PEQ_8_Q : len++,

        ID_OUT_PEQ_9_RESPONSE : len++,
        ID_OUT_PEQ_9_FREQ : len++,
        ID_OUT_PEQ_9_GAIN : len++,
        ID_OUT_PEQ_9_Q : len++,

        ID_OUT_PEQ_10_BYPASS : len++,
        ID_OUT_PEQ_10_RESPONSE : len++,
        ID_OUT_PEQ_10_FREQ : len++,
        ID_OUT_PEQ_10_GAIN : len++,
        ID_OUT_PEQ_10_Q : len++,

        ID_OUT_PEQ_11_RESPONSE : len++,
        ID_OUT_PEQ_11_FREQ : len++,
        ID_OUT_PEQ_11_GAIN : len++,
        ID_OUT_PEQ_11_Q : len++,

        ID_OUT_PEQ_12_RESPONSE : len++,
        ID_OUT_PEQ_12_FREQ : len++,
        ID_OUT_PEQ_12_GAIN : len++,
        ID_OUT_PEQ_12_Q : len++,

        ID_OUT_PEQ_13_RESPONSE : len++,
        ID_OUT_PEQ_13_FREQ : len++,
        ID_OUT_PEQ_13_GAIN : len++,
        ID_OUT_PEQ_13_Q : len++,

        ID_OUT_PEQ_14_RESPONSE : len++,
        ID_OUT_PEQ_14_FREQ : len++,
        ID_OUT_PEQ_14_GAIN : len++,
        ID_OUT_PEQ_14_Q : len++,

        ID_OUT_PEQ_15_RESPONSE : len++,
        ID_OUT_PEQ_15_FREQ : len++,
        ID_OUT_PEQ_15_GAIN : len++,
        ID_OUT_PEQ_15_Q : len++,

        ID_OUT_NUM : len++
    };
}();

var userID = function() {
    var userLen = 0;
    return {
        ID_NAME: userLen++,
        ID_PASSWORD: userLen++,
        ID_ROLE: userLen++,
        ID_STATE: userLen++,
        ID_CH1: userLen++,
        ID_CH2: userLen++,
        ID_CH3: userLen++,
        ID_CH4: userLen++,
        ID_CH5: userLen++,
        ID_CH6: userLen++,
        ID_CH7: userLen++,
        ID_CH8: userLen++,
        ID_REVERB: userLen++,
        ID_ECHO: userLen++,
        ID_PLAYER_L: userLen++,
        ID_PLAYER_R: userLen++,
        ID_REC_L: userLen++,
        ID_REC_R: userLen++,
        ID_AUX1: userLen++,
        ID_AUX2: userLen++,
        ID_SUB1: userLen++,
        ID_SUB2: userLen++,
        ID_PLAYER: userLen++,
        ID_RECORDER: userLen++,
        ID_MASTER: userLen++,
        ID_GROUP: userLen++,
        ID_SETUP: userLen++,

        ID_USER_NUM : userLen++
    };
}();

var effID = function(){
    var chError = 0;
    return {
        ID_EFF_INDEX : chError++,
        ID_EFF_NAME : chError++,
        ID_EFF_ENABLE : chError++,

        ID_EFF_SOLO : chError++,
        ID_EFF_MUTE : chError++,
        ID_EFF_GAIN : chError++,

        ID_EFF_FEQ_NAME : chError++,
        ID_EFF_FEQ_BYPASS : chError++,

        ID_EFF_FEQ_HPF_NAME : chError++,
        ID_EFF_FEQ_HPF_BYPASS : chError++,
        ID_EFF_FEQ_HPF_PRE_ORDER : chError++,
        ID_EFF_FEQ_HPF_MAX_ORDER : chError++,
        ID_EFF_FEQ_HPF_RESPONSE : chError++,
        ID_EFF_FEQ_HPF_METHOD : chError++,
        ID_EFF_FEQ_HPF_FREQ : chError++,
        ID_EFF_FEQ_HPF_Q : chError++,

        ID_EFF_FEQ_1_NAME : chError++,
        ID_EFF_FEQ_1_BYPASS : chError++,
        ID_EFF_FEQ_1_RESPONSE : chError++,
        ID_EFF_FEQ_1_GAIN : chError++,
        ID_EFF_FEQ_1_FREQ : chError++,
        ID_EFF_FEQ_1_Q : chError++,
        ID_EFF_FEQ_1_TYPE : chError++,

        ID_EFF_FEQ_2_NAME : chError++,
        ID_EFF_FEQ_2_BYPASS : chError++,
        ID_EFF_FEQ_2_RESPONSE : chError++,
        ID_EFF_FEQ_2_GAIN : chError++,
        ID_EFF_FEQ_2_FREQ : chError++,
        ID_EFF_FEQ_2_Q : chError++,
        ID_EFF_FEQ_2_TYPE : chError++,

        ID_EFF_FEQ_3_NAME : chError++,
        ID_EFF_FEQ_3_BYPASS : chError++,
        ID_EFF_FEQ_3_RESPONSE : chError++,
        ID_EFF_FEQ_3_GAIN : chError++,
        ID_EFF_FEQ_3_FREQ : chError++,
        ID_EFF_FEQ_3_Q : chError++,
        ID_EFF_FEQ_3_TYPE : chError++,

        ID_EFF_FEQ_4_NAME : chError++,
        ID_EFF_FEQ_4_BYPASS : chError++,
        ID_EFF_FEQ_4_RESPONSE : chError++,
        ID_EFF_FEQ_4_GAIN : chError++,
        ID_EFF_FEQ_4_FREQ : chError++,
        ID_EFF_FEQ_4_Q : chError++,
        ID_EFF_FEQ_4_TYPE : chError++,

        ID_EFF_ECHO_NAME : chError++,
        ID_EFF_ECHO_BYPASS : chError++,
        ID_EFF_ECHO_PRE_DELAY : chError++,
        ID_EFF_ECHO_DELAY : chError++,
        ID_EFF_ECHO_REPEAT_RATIO : chError++,
        ID_EFF_ECHO_TYPE : chError++,

        ID_EFF_REVB_NAME : chError++,
        ID_EFF_REVB_BYPASS : chError++,
        ID_EFF_REVB_PRE_DELAY : chError++,
        ID_EFF_REVB_TIME : chError++,
        ID_EFF_REVB_FREQ : chError++,
        ID_EFF_REVB_TYPE : chError++,

        ID_EFF_NUM : chError++
    };
}();

var chID = function(){
    var chLen = 0;
    return {
        /*CH-IN*/
        CH_1 : chLen++,
        CH_2 : chLen++,
        CH_3 : chLen++,
        CH_4 : chLen++,
        CH_5 : chLen++,
        CH_6 : chLen++,
        CH_7 : chLen++,
        CH_8 : chLen++,
        CH_USER : chLen++,
        CH_IN_MIN : 0,
        CH_IN_MAX : 8,
        CH_IN_NUM : 9,

        /*CH-FX*/
        CH_ECHO : chLen++,
        CH_REVERB : chLen++,
        CH_FX_NUM : 2,

        /*CH-OUT*/
        //CH_AUX1 : chLen++,
        //CH_AUX2 : chLen++,
        //CH_SUB1 : chLen++,
        //CH_SUB2 : chLen++,
        //CH_REC1 : chLen++,
        //CH_REC2 : chLen++,
        CH_MASTER : chLen++,
        CH_OUT_NUM : 1,

        CH_MISC : chLen++,

        DSP_CH_NUM : 9+2+1+1,

        //CH_SCENE : chLen++,
        //CH_PORTS : chLen++,
        //CH_SENDS : chLen++,
        //CH_GROUPS : chLen++,
        //CH_ROUTES : chLen++,
        //CH_LOCAL : chLen++,
        //CH_SETTING : chLen++,
        //CH_USER : chLen++,
        //CH_NAME : chLen++,
        CH_SETUP : chLen++,

        CH_NUM : chLen++
    };
}();

var portChID = function(){
    var id = 0;
    return {
        CH_1 : id++,
        CH_2 : id++,
        CH_3 : id++,
        CH_4 : id++,
        CH_5 : id++,
        CH_6 : id++,
        CH_7 : id++,
        CH_8 : id++,
        CH_USER : id++,
        CH_PLAYL : id++,
        CH_PLAYR : id++,

        ID_CH_NUM : id++
    }
}();

var portsID = function(){
    var portLen = 0;
    return {
        trim : portLen++,
        delay : portLen++,
        fback : portLen++,
        phase : portLen++,
        ppower : portLen++,
        value : portLen++,
        mute : portLen++,
        solo : portLen++
    }
}();

var imgID = function(){
    var imgLen = 0;
    return {
        main_scene : imgLen ++,
        main_scene_light : imgLen ++,
        main_smallbutton_background : imgLen ++,
        main_smallbutton_left : imgLen ++,
        main_smallbutton_left_light : imgLen ++,
        main_smallbutton_middle : imgLen ++,
        main_smallbutton_middle_light : imgLen ++,
        main_smallbutton_right : imgLen ++,
        main_smallbutton_right_light : imgLen ++,
        main_bigbutton_background : imgLen ++,
        main_mainbutton : imgLen ++,
        main_mainbutton_light : imgLen ++,
        main_viewbutton_left : imgLen ++,
        main_viewbutton_left_light : imgLen ++,
        main_viewbutton_middle : imgLen ++,
        main_viewbutton_middle_light : imgLen ++,
        main_viewbutton_right : imgLen ++,
        main_viewbutton_right_light : imgLen ++,
        main_inputbutton_left_light : imgLen ++,
        main_inputbutton_middle_light : imgLen ++,
        main_inputbutton_right_light : imgLen ++,
        main_smallmetal : imgLen ++,
        main_mute : imgLen ++,
        main_mute_light : imgLen ++,
        main_solo_light : imgLen ++,
        main_bigmetal : imgLen ++,
        master_red_bigmetal : imgLen ++,
        main_informationbutton : imgLen ++,
        main_informationbutton_light : imgLen ++,
        main_Display : imgLen ++,
        main_sliderBg : imgLen ++,
        main_flute : imgLen ++,
        main_controlBg : imgLen ++,
        arrawOpen : imgLen ++,
        arrawClose : imgLen ++,
        fbcButton : imgLen ++,
        tabButtonLeft : imgLen ++,
        tabButtonLeft_light : imgLen ++,
        tabButtonRight : imgLen ++,
        tabBackground : imgLen ++,
        edit_button : imgLen ++,
        edit_button_light : imgLen ++,
        input_background : imgLen ++,
        logo : imgLen ++,
        set_button_background : imgLen ++,
        edit_dyn_tab_background : imgLen ++,
        edit_dyn_tab_left : imgLen ++,
        edit_dyn_tab_left_light : imgLen ++,
        edit_dyn_tab_right : imgLen ++,
        upgrade_button : imgLen ++,
        sends_tab_background : imgLen ++,
        set_tab_left : imgLen ++,
        set_tab_left_light : imgLen ++,
        set_tab_right : imgLen ++,
        edit_eq_tab_left : imgLen ++,
        edit_eq_tab_left_light : imgLen ++,
        edit_eq_tab_right : imgLen ++,
        edit_eq_tab_last : imgLen ++,
        edit_eq_tab_last_light : imgLen ++,
        set_radiobutton_left_light : imgLen ++,
        set_button : imgLen ++,
        set_button_light : imgLen ++,
        lock : imgLen ++,
        wifi : imgLen ++,
        set_radioButton_middle_light : imgLen ++,
        set_radioButton_right_light : imgLen ++,
        set_upgrade_progress : imgLen ++,
        lock_white : imgLen ++,
        user_head : imgLen ++,
        echo : imgLen ++,
        reverb : imgLen ++,

        img_num : imgLen ++
    };
}();

var paraID = function(){
    var paraLen = 0;
    return  {
        PARA_Val : paraLen++,
        PARA_SRT : paraLen++
    };
}();

var modeID = function(){
    var modeLen = 0;
    return {
        SINGLE : modeLen++,
        ITEM : modeLen++,
        TYPE : modeLen++,
        CHANNEL : modeLen++,
        GROUP : modeLen++,
        DSPALL : modeLen++,         //
        TOTAL : modeLen++
    };
}();

var sendsChID = function(){
    var sendsLen = 0;
    return {
        REVERB_1 : sendsLen++,
        REVERB_2 : sendsLen++,
        REVERB_3 : sendsLen++,
        REVERB_4 : sendsLen++,
        REVERB_5 : sendsLen++,
        REVERB_6 : sendsLen++,
        REVERB_7 : sendsLen++,
        REVERB_8 : sendsLen++,
        REVERB_USER : sendsLen++,
        REVERB_PLAYERL : sendsLen++,
        REVERB_PLAYERR : sendsLen++,
        ECHO_1 : sendsLen++,
        ECHO_2 : sendsLen++,
        ECHO_3 : sendsLen++,
        ECHO_4 : sendsLen++,
        ECHO_5 : sendsLen++,
        ECHO_6 : sendsLen++,
        ECHO_7 : sendsLen++,
        ECHO_8 : sendsLen++,
        ECHO_USER : sendsLen++,
        ECHO_PLAYERL : sendsLen++,
        ECHO_PLAYERR : sendsLen++,

        SENDS_NUM : sendsLen++
    }
}();

var sendID = function(){
    var sendLen = 0;
    return {
        VAL : sendLen++,
        MUTE : sendLen++,
        SOLO : sendLen++,

        SEND_NUM : sendLen++
    }
}();

var emType = function(){
    var typeNum = 0;
    return {
        TYPE_VAL : typeNum++,
        TYPE_PEQ : typeNum++,
        TYPE_SCENE : typeNum++,
        TYPE_PORT : typeNum++,
        TYPE_SEND : typeNum++,
        TYPE_GROUP : typeNum++,
        TYPE_ROUTE : typeNum++,
        TYPE_USER : typeNum++,
        TYPE_NAME : typeNum++,

        TYPE_CHANNEL : typeNum++,
        TYPE_ALL : typeNum++,

        TYPE_NUM : typeNum++
    };
}();

var emSign = function(){
    var len = 0;
    return {
        SIGN_NONE : len++,
        SIGN_IN : len++,
        SIGN_OUT : len++,
        SIGN_EDIT : len++,
        SIGN_UP : len++,
        SIGN_DN : len++
    };
}();

var emRole = function(){
    var roleNum = 0;
    return {
        ROLE_ROOT : 88,
        ROLE_ADMIN : roleNum++,
        ROLE_OPERATOR : roleNum++,
        ROLE_GUEST : roleNum++
    };
}();

var errorTypeID = {
    ERR_NONE : 0,
    ERR_ERROR : -1,
    ERR_NOT_INITED : 3000,
    ERR_WRONG_PARA : 3001,
    ERR_CHECK_FAIL : 3002,
    ERR_IS_STOPPED : 3003,
    ERR_IS_QUIT : 3004,
    ERR_MSG_NULL : 3005,
    ERR_MSG_FULL :3006,
    ERR_PKT_LACK : 4000,
    ERR_PKT_REPEAT : 4001,
    ERR_PKT_TIMEOUT : 4002,
    ERR_DSP_READ_FAILED : 5000,
    ERR_DSP_WRITE_FAILED : 5001,
    ERR_NET_SCAN_NONE : 5200,
    ERR_NET_NOT_EXIST : 5201,
    ERR_NET_WRONG_PASSWD : 5202,
    UPG_TRANS_FAILED : 5300,
    UPG_CHECK_FAILED : 5301,
    UPG_OLD_VERSION : 5302,
    ERR_SIGN_USER_EXIST : 5400,
    ERR_SIGN_USER_NOT_EXIST : 5401,
    ERR_SIGN_USER_FULL : 5402,
    ERR_SIGN_PASS_WRONG : 5403
};

var sendTypeID = function(){
    var len = 0;
    return {
        TYPE_DSP_GAIN_MONO : len++,
        TYPE_DSP_GAIN_STEREO : len++,
        TYPE_DSP_PANGAIN : len++,
        TYPE_DSP_IIR_MONO : len++,
        TYPE_DSP_IIR_STEREO : len++,
        TYPE_DSP_XO_MONO : len++,
        TYPE_DSP_XO_STEREO : len++,
        TYPE_DSP_GATECPS_MONO : len++,
        TYPE_DSP_GATECPS_STEREO : len++,
        TYPE_DSP_LIMITER : len++,
        TYPE_DSP_MIXERPAN : len++,
        TYPE_DSP_MIXERMODE : len++,
        TYPE_DSP_DELAY : len++,
        TYPE_DSP_ECHO : len++,
        TYPE_DSP_REVERB : len++,
        TYPE_DSP_FDBK : len++,
        TYPE_DSP_ROUTER : len++,
        TYPE_DSP_LEVEL : len++,

        TYPE_DSP_NAME : len++,              //channel name
        TYPE_DSP_PPOWER : len++,
        TYPE_DSP_MUTE : len++,
        TYPE_DSP_SOLO : len++,

        TYPE_SETUP_NAME : len++,
        TYPE_SETUP_GROUP : len++,
        TYPE_SETUP_SETT : len++,
        TYPE_SETUP_NETWORK : len++,


        TYPE_SCENE : len++,
        TYPE_SCENE_DESC : len++,

        TYPE_NAME : len++,
        TYPE_USER : len++,
        TYPE_LOCK : len++,

        TYPE_NUM : len++
    }
}();

var emModeID = function(){
    var len = 0;
    return {
        MODE_TYPE : len++,
        MODE_CH : len++,
        MODE_ALL : len++
    }
}();

var signID = function(){
    var len = 0;
    return {
        SIGN_NONE : len++,
        SIGN_IN : len++,
        SIGN_OUT : len++,
        SIGN_UP : len++,
        SIGN_DN : len++
    }
}();

var actID = function(){
    var len = 0;
    return {
        ACT_NEW : len++,
        ACT_EDIT : len++,
        ACT_COPY : len++,
        ACT_APPLY : len++,
        ACT_REMOVE : len++,
        ACT_IMPORT : len++,
        ACT_EXPORT : len++,
        ACT_START : len++,
        ACT_STOP : len++
    }
}();

var netEM = function(){
    var len = 0;
    return {
        NET_INFO : len++,
        NET_STATUS : len++,
        NET_SCAN : len++,
        NET_CONN : len++,
        NET_DISCONN : len++,
        NET_SET : len++            //config network
    };
}();

var noCopyID = [
    inputChannelID.ID_IN_SOLO,
    inputChannelID.ID_IN_MUTE
];

var iirResponse = {
    IIR_EQ : 0,
    IIR_LOWSHELVF : 1,
    IIR_HIGHELVF : 2,
    IIR_OFF : 3
};

var xoMode = {
    XO_BUTTERWORTH : 0,
    XO_BESSEL : 1,
    XO_LINKWITZ : 2,
    XO_OFF : 3
};

var fileType = function(){
    var len = 0;
    return {
        FILE_SCENE : len++,
        FILE_AUDIO : len++,
        FILE_SYSTEM : len++,

        FILE_NUM : len++
    }
}();

var errID = function(){
    return {
        ERR_SUCCESS : 0,
        ERR_ERROR : -1,
        ERR_NOT_INITED : 3000,
        ERR_WRONG_PARA : 3001,
        ERR_DSP_WRITE_FAILED : 5001,
        ERR_NET_SCAN_NONE : 5200,
        ERR_NET_NOT_EXIST : 5201,
        ERR_NET_WRONG_PASSWD : 5202,
        UPG_TRANS_FAILED : 5300,
        UPG_CHECK_FAILED : 5301,
        ERR_SIGN_USER_EXIST : 5400,
        ERR_SIGN_USER_NOT_EXIST : 5401,
        ERR_SIGN_USER_FULL : 5402,
        ERR_SIGN_PASS_WRONG : 5403
    }
}();

var soloType = function(){
    var len = 0;
    return {
        SOLO_NONE : len++,
        SOLO_SOME : len++,
        SOLO_ALL : len++
    }
}();

var echoType = function(){
    var len = 0;
    return {
        ECHO_MONO : len++,
        ECHO_STEREO : len++,
        ECHO_ECHO : len++
    }
}();

var mixerMode = function(){
    var len = 0;
    return {
        STANDALONE : len++,
        STEREO_STANDALONE : len++,
        STEREO_CASCADE_L : len++,
        STEREO_CASCADE_R : len++,
        MIXER_MODE_NUM : len++
    }
}();

var getPara = function(){
};

getPara.prototype.ch = function(){

};

getPara.prototype.main = function(){
};

var setPara = function(){};

setPara.prototype.ch = function(){};

setPara.prototype.main = function(){};


var Type = function(){
    var a = 0x1000,b = 0x2000,c = 0x3000;
    return {
        TYPE_DEVICE_INFO : a++,
        TYPE_DEVICE_STATUS : a++,
        TYPE_DEVICE_PARAS : a++,
        TYPE_DEVICE_ACK : a++,
        TYPE_DEVICE_LOG : a++,
        TYPE_DEVICE_FILE : a++,

        TYPE_DEVICE_BROAD : b++,
        TYPE_DEVICE_SWITCH : b++,
        TYPE_DEVICE_CONNECT : b++,
        TYPE_DEVICE_NET : b++,

        TYPE_USER_PARA : c++,
        TYPE_USER_PARAS : c++,
        TYPE_USER_REBOOT : c++,
        TYPE_USER_RESET : c++,
        TYPE_USER_LOG : c++,
        TYPE_USER_FILE : c++,
        TYPE_USER_LOCK : c++,
        TYPE_USER_NET : c++,
    };
}();
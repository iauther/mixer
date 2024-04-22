var items = [];
var mainData = [];
var groupData = {};
var userData = [];
var portsData = [];
var sendsData = [];
signData = {
    type : signID.SIGN_IN,
    name : '',
    passwd : ''
};

function createTestData(){
    var i;
    var name = ['1.GUITAR','2.GUITAR','3.GUITAR','4.GUITAR','5.GUITAR','6.GUITAR','7.GUITAR','8.GUITAR','9.PLAYER','ECHO','REVERB','MASTER'];
    for(i=0;i<7;i++){
        userData[i] = {
            type : 1,
            name : 'root',
            passwd : '123456',
            perm : {
                role : 2,
                rw : [
                    {w : 0,r : 0},
                    {w : 0,r : 0},
                    {w : 1,r : 0},
                    {w : 1,r : 0},
                    {w : 0,r : 0},
                    {w : 1,r : 0},
                    {w : 1,r : 0},
                    {w : 0,r : 0},
                    {w : 1,r : 0},
                    {w : 1,r : 0},
                    {w : 1,r : 0},
                    {w : 1,r : 0},
                    {w : 0,r : 0},
                    {w : 1,r : 0},
                    {w : 1,r : 0}
                ]
            }
        }
    }

    for(i=0;i<portChID.ID_CH_NUM;i++){
        portsData[i] = [
            {val : 10},
            {val : 10},
            {val : 2},
            {val : 1},
            {val : 1},
            {val : 30},
            {val : 1},
            {val : 0}
        ]
    }

    for(i=0;i<sendsChID.SENDS_NUM;i++){
        sendsData[i] = {
            gain : -100,
            mute : 0,
            onoff : 0,
            pan : 0,
            phase : 0
        }
    }

    descData = [
        {
            name : '123',
            creator : 'je',
            description : 'sadfsd',
            time : '2017-10-10 10-10-5'
        },
        {
            name : '234',
            creator : 'je',
            description : 'sadfsd',
            time : '2017-10-10 10-10-5'

        },
        {
            name : '456',
            creator : 'je',
            description : 'sadfsd',
            time : '2017-10-10 10-10-5'
        }
    ];

    settingData = {
        LR : 1,
        ms : 1,
        ssid : '',
        netin : 0,
        solo_route : 0,
        solo_mode : 0,
        rec_mode : 0,
        pwr_mode : 0,
        lock : 0,
        clip_hold : 0,
        rescale : 0,
        framerate : 0
    };

    miscData = {
        eq : [
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 31.5,    Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 46,      Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 63,      Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 100,     Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 160,     Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 250,     Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 400,     Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 630,     Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 1000,    Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 1600,    Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 2500,    Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 4000,    Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 6300,    Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 10000,   Q :.7},
            {response : 1,   mute : 0,   gain : 100,   bypass : 1,   freq : 16000,   Q :.7}
        ],
        gain : {
            gain : -100,
            mute : 0,
            reverse : 0,
            type : 0
        },
        mixermode : {mode : 0},
        ldelay : {
            time : 150,
            Len : 100,
            gain : 100,
            mute :　0,
            reverse : 0,
            type : 0
        }
    };

    lockData = '00000000000000000000000000000000';
    for(i=0;i<chID.CH_IN_NUM;i++){
        items[i] = {};
        items[i].name = {name : name[i]};
        items[i].gain = {
                gain : -100,
                mute : 0,
                reverse : 0,
                type : 0,
                solo : 0
            };
        items[i].eq = [
                {
                    bypass : 0,
                    response : 0,
                    gain : 100,
                    mute : 0,
                    freq : 50,
                    Q : 7
                },
                {
                    bypass : 0,
                    response : 0,
                    gain : 200,
                    mute : 0,
                    freq : 1000,
                    Q : 7
                },
                {
                    bypass : 0,
                    response : 0,
                    gain : 200,
                    mute : 0,
                    freq : 4000,
                    Q : 7
                },
                {
                    bypass : 0,
                    response : 0,
                    gain : 200,
                    mute : 0,
                    freq : 20000,
                    Q : 7
                }
            ];
        items[i].hpf = {
                bypass : 0,
                pre_order : 0,
                max_order : 0,
                method : 0,
                response : 0,
                freq : 600,
                Q : 1
            };
        items[i].gatecps = {
                gate_level : 10,
                gate_gain : 10,
                cps_level : 10,
                cps_gain : 40,
                gate_threshold : -50,
                gate_depth : 20,
                gate_attck : 10,
                gate_hold : 20,
                gate_release : 10,
                gate_bypass : 0,
                cps_threshold : 10,
                cps_ratio : 10,
                cps_attck : 18,
                cps_hold : 10,
                cps_release : 20,
                cps_bypass : 0
            };
        items[i].fdbk = {
                degree : 1
            };
        items[i].mixerpan = {
                direct_ratio : 100,
                echo_ratio : 0,
                reverb_ratio : 0,
                gain : 0,
                mute : 0,
                phase : 0,
                pan : 0,
                solo : 0
            };
        items[i].panGain = {
                gain : 0,
                mute : 0,
                pan : 0,
                reverse : 0,
                type : 0,
                solo : 1
            };
        if(i < chID.CH_USER)items[i].ppower = {on : 0};
    }

    for(i=chID.CH_IN_NUM;i<chID.CH_IN_NUM+chID.CH_FX_NUM;i++){
        items[i] = {};
        items[i].name = {name : name[i]};
        items[i].echo = {
                ldelay : 400,
                rdelay : 400,
                ratio : 50,
                type : 0,
                fdbk : 1
            };
        items[i].reverb = {
            pre_delay : 10,
            time : 10,
            freq : 2000,
            type : 1
        };
        items[i].eq = [
                {
                    bypass : 0,
                    response : 0,
                    gain : 20,
                    mute : 0,
                    freq : 400,
                    Q : 7
                },
                {
                    bypass : 0,
                    response : 0,
                    gain : 20,
                    mute : 0,
                    freq : 1000,
                    Q : 7
                },
                {
                    bypass : 0,
                    response : 0,
                    gain : 20,
                    mute : 0,
                    freq : 4000,
                    Q : 7
                },
                {
                    bypass : 0,
                    response : 0,
                    gain : 20,
                    mute : 0,
                    freq : 10000,
                    Q : 7
                }
            ];
        items[i].gain = {
                gain : -100,
                mute : 0,
                reverse : 0,
                type : 0,
                solo : 1
            };
        items[i].solo = {on : 0};
    }

    itemsOut = [];
    itemsOut[0] = [];
    for(i=0;i<2;i++){
        itemsOut[0][i] = {};
        itemsOut[0][i].name = {name : name[11]};
        itemsOut[0][i].eq = [
            {
                bypass : 0,
                response : 0,
                gain : 200,
                mute : 0,
                freq : 400,
                Q : 7
            },
            {
                bypass : 0,
                response : 0,
                gain : 100,
                mute : 0,
                freq : 400,
                Q : 7
            },
            {
                bypass : 0,
                response : 0,
                gain : 200,
                mute : 0,
                freq : 400,
                Q : 7
            },
            {
                bypass : 0,
                response : 0,
                gain : -100,
                mute : 0,
                freq : 400,
                Q : 7
            },
            {
                bypass : 0,
                response : 0,
                gain : 10,
                mute : 0,
                freq : 400,
                Q : 7
            },
            {
                bypass : 0,
                response : 0,
                gain : 10,
                mute : 0,
                freq : 400,
                Q : 7
            },
            {
                bypass : 0,
                response : 0,
                gain : 10,
                mute : 0,
                freq : 400,
                Q : 7
            },
            {
                bypass : 0,
                response : 0,
                gain : 10,
                mute : 0,
                freq : 400,
                Q : 7
            },
            {
                bypass : 0,
                response : 0,
                gain : 10,
                mute : 0,
                freq : 400,
                Q : 7
            },
            {
                bypass : 0,
                response : 0,
                gain : 10,
                mute : 0,
                freq : 400,
                Q : 7
            },
            {
                bypass : 0,
                response : 0,
                gain : 10,
                mute : 0,
                freq : 400,
                Q : 7
            },
            {
                bypass : 0,
                response : 0,
                gain : 10,
                mute : 0,
                freq : 400,
                Q : 7
            }
        ];
        itemsOut[0][i].hpf = {
            bypass : 0,
            pre_order : 3,
            max_order : 0,
            method : 1,
            response : 0,
            freq : 100,
            Q : 1
        };
        itemsOut[0][i].lpf = {
            bypass : 0,
            pre_order : 4,
            max_order : 0,
            method : 2,
            response : 0,
            freq : 8000,
            Q : 1
        };
        itemsOut[0][i].limit = {
            cps_level : 100,
            cps_gain : 100,
            peak_level : 100,
            peak_gain : 100,
            cps_threshold : -500,
            cps_ratio : 200,
            cps_attck : 100,
            cps_hold : 200,
            cps_release : 100,
            lim_threshold : 100,
            lim_ratio : 100,
            lim_attck : 180,
            lim_hold : 100,
            lim_release : 200
        };
        itemsOut[0][i].delay = {
            time : 100,
            Len : 100,
            gain : 100,
            mute :　0,
            reverse : 0,
            type : 0
        };
    }

    for(i=chID.CH_MASTER;i<=chID.CH_MASTER;i++){
        items[i] = itemsOut[0][1];
    }

    groupData = {
            view:{
                input:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                fx:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                output:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                1:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                2:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                3:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                4:[0,0,1,1,1,1,1,0,0,0,0,0,0,0]
            },
            mute:{
                input:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                fx:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                output:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                1:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                2:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                3:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                4:[0,0,1,1,1,1,1,0,0,0,0,0,0,0]
            },
            solo:{
                input:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                fx:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                output:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                1:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                2:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                3:[0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                4:[0,0,1,1,1,1,1,0,0,0,0,0,0,0]
            }
        };

    soloData = [];
    for(i=0;i<chID.CH_IN_NUM+chID.CH_FX_NUM;i++){
        soloData[i] = 0;
    }

    networkData = {
        mode : 1,
        self : {
            ssid : '',
            passwd : ''
        },
        other : {
            ssid : '',
            passwd : ''
        }
    };

    window.GLOBAL.initStart();
}
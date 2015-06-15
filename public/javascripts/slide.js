(function ($) {
    var isclicked = false,
            musicFlag = true;

    $(".square").height(function () {
        return $(this).width();
    });
    //music
    $("#music").click(function (event) {
        var bgaudio = $("#bgaudio")[0];
        $(this).toggleClass("music-roll")
                .siblings().toggleClass("heart-propagation");
        if ($(this).hasClass("music-roll")) {
            bgaudio.play();
            musicFlag = true;
        } else {
            bgaudio.pause();
            musicFlag = false;
        }
    });


    function sectionAnimate0() {
        setInterval(function () {
            var $fore1 = $(".fore1"),
                    index = $(".loading:visible", $fore1).length;
            if (index === 8) {
                $(".loading", $fore1).hide();
            } else {
                $(".loading:eq(" + index + ")", $fore1).css("display", "inline-block");
            }
        }, 500);

        var $audio1 = $("#bgaudio");
        $audio1.attr("src", "/audio/bgmusic.mp3").on("canplaythrough", function () {
            $audio1[0].play();
            swiper.activeIndex = 1;
            swiper.slideTo(1, 500, false);
            setTimeout(function () {
                sectionAnimate1();
            }, 500);
        })[0].load();
    }
    function sectionAnimate1() {
        $(".kiss-text").animate({opacity: 1}, 2000)
        var w = $(window).width();
        var h = $(window).height();
        var row = Math.ceil(h / 80);
        var col = Math.ceil(w / 100);
        var arrKiss = [];
        var arrKiss2 = [];
        var len = 0;
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                arrKiss.push({left: 100 * j - 30, top: 80 * i - 20})
            }
        }
        len = arrKiss.length;
        for (var i = 0; i < len; i++) {
            var n = parseInt(Math.random() * arrKiss.length);
            arrKiss2.push(arrKiss[n]);
            arrKiss.splice(n, 1);
        }
        function randomKiss(left, top) {
            var n = parseInt(Math.random() * 3) + 2;
            var deg = parseInt(Math.random() * 120) - 60;
            var opa = (parseInt(Math.random() * 5) + 5) / 10;
            var $kiss = $('<div class="kiss kiss-' + n + '"></div>')
            $kiss.css({
                "opacity": opa,
                "left": left + "px",
                "top": top + "px",
                "transform": "rotate(" + deg + "deg)",
                "-ms-transform": "rotate(" + deg + "deg)",
                "-moz-transform": "rotate(" + deg + "deg)",
                "-webkit-transform": "rotate(" + deg + "deg)",
                "-o-transform": "rotate(" + deg + "deg)"
            });
            $(".fore2").append($kiss);
            $kiss.animate({opacity: 1});
        }
        $(".fore2").click(function () {
            if (isclicked == true) {
                return;
            }
            musicFlag && $("#kissesaudio")[0].play();
            isclicked = true;
            var kissNum = 0;
            var t1 = 50;
            $(".fore2").css("background", "#c91623");
            $(".tap-tip").hide();
            var timer = setInterval(function () {
                kissNum++;
                if (kissNum == 5) {
                    $(".kiss-text img").attr("src", "skin/i/kiss-text-2.png");
                }
                else if (kissNum == parseInt(arrKiss2.length * 2 / 3)) {
                    $(".kiss-text").css("opacity", 0).animate({opacity: 1}, 1500);
                    $(".kiss-text img").attr("src", "skin/i/kiss-text-3.png");
                }
                t1 = 1 / kissNum * 50;
                if (kissNum < arrKiss2.length)
                {
                    randomKiss(arrKiss2[kissNum].left, arrKiss2[kissNum].top);
                }
                else {
                    clearInterval(timer);
                    $(".kiss").css("background", "none");
                    $(".kiss-text").addClass("flash");
                    setTimeout(function () {
                        $(".kiss-text").css({
                            "transform": "scale3d(0.8,0.8,1) rotate(-10deg) translate(0,-30px)",
                            "-webkit-transform": "scale3d(0.8,0.8,1) rotate(-10deg) translate(0,-30px)",
                            "-webkit-transition": "all ease-out 0.2s",
                            "transition": "all ease-out 0.2s"
                        });
                    }, 1000);
                    setTimeout(function () {
                        $(".it-text").css("visibility", "visible").addClass("tada");
                    }, 1800)
                    setTimeout(function () {
                        //$(".it-text-shadow").animate({opacity:1},500);
                        $(".kiss-blue").animate({opacity: 1}, 1500);
                    }, 3300)
                }
            }, t1)
        })
    }
    function sectionAnimate4() {
        $(".run-man1").addClass("runningman");
        setTimeout(function () {
            $("#run-man1").removeClass("runningman").addClass("run-man2 opacityIn");
            $("#arm").addClass("opacityIn");
            setTimeout(function () {
                $("#arm").removeClass("opacityIn").addClass("armmove");
                //$("#run-encourage").addClass("opacityIn");
                $("#run-type1").removeClass("hide").addClass("scaleZ");
                setTimeout(function () {
                    $("#run-type2").removeClass("hide").addClass("scaleZ");
                    setTimeout(function () {
                        $("#run-type3").removeClass("hide").addClass("scaleZ");
                        setTimeout(function () {
                            $("#run-type4").removeClass("hide").addClass("scaleZ");
                        }, 500);
                    }, 500);
                }, 500);
            }, 1000);
        }, 1000);

        $(".run-type").bind('touchstart', function (event) {
            $(this).addClass($(this).attr("id") + "-active");
        }).bind('touchend', function (event) {
            $(this).removeClass($(this).attr("id") + "-active");
        });
        $(".run-type").on('tap', function (event) {
            var idx = $(".run-type").index($(this));
            $(".swiper-slide .box").attr("idx", idx);
            // 换战线员工
            if (useFrontRandom) {
                render(random(employees));
            } else {
                init2();
            }
            changeSkin();
            // 换战线员工结束
            $(".line-w").css("display", "none").eq(idx).css("display", "block");
            swiper.activeIndex = 3;
            swiper.slideTo(3, 500, false);
            setTimeout(function () {
                sectionAnimate6();
            }, 500);
        });
    }
    function sectionAnimate6() {
        $(".change-w").addClass("flipInY")
        /*箭头闪烁是禁止点击遮罩*/
        $('.sad-w').css({
            height: $(window).height()
        });
        /*亲吻弹层*/
        $('.sad-popup').css({
            height: $(window).height()
        });
        /*吻ta箭头动画*/
        setTimeout(function () {
            $('.sad-point').eq(0).addClass('sad-flash');
            setTimeout(function () {
                $('.sad-point').eq(1).addClass('sad-flash');
                setTimeout(function () {
                    $('.sad-point').eq(2).addClass('sad-flash');
                    $('.sad-w').hide();
                    setTimeout(function () {
                        $('.sad-point').eq(3).addClass('sad-flash');
                        $('.sad-w').hide();
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);

        /*点击人物*/
//        $('.sad ul li p').bind('click', function(event) {
//            if($(this).hasClass('hadClick')){
//                return;
//            }
//            $(this).addClass('hadClick');
//            $(this).children('.sad-kiss').show(); 
//            /*$('.sad-swing-hide').removeClass();*/
//            $(this).find('.sad-swing-hide').removeClass();
//            musicFlag && $("#kissaudio")[0].play();
//            setTimeout(function(){
//               $('.sad-popup').show();
//                /*弹窗动画*/
//                setTimeout(function(){
//                    $('.sp-people').show();
//                    $('.sp-people').addClass('happy-tada');
//                    setTimeout(function(){
//                        $('.sp-skin01,.sp-del,.sp-txt').show();
//                        $('.sp-skin01,.sp-del,.sp-txt').addClass('happy-fadeIn');
//                        setTimeout(function(){
//                            $('.happy-point').show();
//                            $('.happy-point').addClass('happy-bounceInLeft');
//                        },500);
//                    },1000);
//                },1000); 
//            },800);
//
//        });
        /*弹层关闭按钮*/
        $('.sp-del,.hg-del').bind('click', function (event) {
            $('.sad-popup').hide();
        });
        /*换一批吻*/
//        var changeAttr=[];
//        $('.change').bind('click', function(event) {
//            changeAttr = [];
//            for (var i = 0; i < 4; i++) {
//                var changeNum=parseInt(Math.random()*10);
//                if(!findNum(changeNum,changeAttr)){
//                    changeAttr.push(changeNum);
//                }else{
//                    i--;
//                }
//            }
//            $('.sad-cover img').each(function(index) {
//                $('.sad-cover img').eq(index).attr("src","skin/i/sad0"+changeAttr[index]+"-cover.png");
//            });
//           
//        });
//        function findNum(num,arr){
//            for(var i = 0;i<arr.length;i++){
//                if(num == arr[i]){
//                    return true;
//                }
//            }
//            return false;
//        }
    }

    $(".common-wrapper").css("height", $(window).height());
    sectionAnimate0();
    var swiper = new Swiper('.swiper-container', {
        centeredSlides: true,
        autoplay: false,
        autoplayDisableOnInteraction: false,
        loop: false,
        threshold: 20,
        direction: "vertical",
        onSlideChangeEnd: function (swiper) {
            switch (swiper.activeIndex) {
                case 1:
                    sectionAnimate1();
                    swiper.unlockSwipeToNext();
                    break;
                case 2:
                    sectionAnimate4();
                    swiper.unlockSwipeToNext();
                    break;
                case 3:
                    sectionAnimate6();
                    swiper.lockSwipeToNext();
                    break;
            }

        }
    });


    // 微信分享事件绑定
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        // 发送给好友
        WeixinJSBridge.on('menu:share:appmessage', function (argv) {
            WeixinJSBridge.invoke('sendAppMessage', {
                "img_url": "http://storage.jd.com/kiss.jd.com/fenxiang.png",
                "img_width": "640",
                "img_height": "640",
                "link": window.location.href,
                "desc": "这个618你被保养了",
                "title": "这个618你被保养了！亲肿了算我的"
            }, function (res) {
                _report('send_msg', res.err_msg);
            })
        });
        // 分享到朋友圈
        WeixinJSBridge.on('menu:share:timeline', function (argv) {
            WeixinJSBridge.invoke('shareTimeline', {
                "img_url": "http://storage.jd.com/kiss.jd.com/fenxiang.png",
                "img_width": "640",
                "img_height": "640",
                "link": window.location.href,
                "desc": "这个618你被保养了",
                "title": "这个618你被保养了！亲肿了算我的"
            }, function (res) {
                _report('timeline', res.err_msg);
            });
        });
    }, false);

    var employees = [], // 员工缓存数组
            unkiss = [], // 未被kiss的数组
            kissed = [], // 已被kiss的数组
            changeAttr = [], // 皮肤数组
            number = 4;  // 一次显示的数组长度
    var useFrontRandom = false;// 是否使用前端随机

    (function () {
        var local = window.location.pathname;
        $.ajax({
            url: "http://wq.jd.com/mlogin/wxv3/LoginCheckJsonp",
            dataType: 'JSONP',
            jsonpCallback: 'validateLoginCallback',
            success: function (data) {
                if (data.iRet == "9999") {
                    // "http://wq.jd.com/mlogin/h5v1/cpLogin_BJ?rurl="+encodeURIComponent(option.rurl)
                    window.location.href = "http://wq.jd.com/mlogin/wxv3/login_BJ?rurl=" + encodeURIComponent(local) + "&appid=1";
                }
            }
        });
    })();
    /**
     * 初始化操作，如果当前没有缓存，就使用ajax拉取数据
     * @returns {undefined}
     */
    var init = function () {
        // 当前没缓存，直接使用ajax加载
        if (employees.length === 0) {
            $.getJSON("/cache/kiss_jd_employee", function (data) {
                employees = data;
                render(random(employees));
            });
        } else {
            render(random(employees));
        }
    };

    /**
     * 随机生成指定【4】个图片
     * @param {type} employees
     * @returns {Array}
     */
    var random = function (employees) {
        // 申明临时对象，用于存储生成的对象数据
        var tmp = [];
        // 如果unkiss和kissed都为空，把employees赋值到unkiss中
        if (unkiss.length === 0 && kissed.length === 0)
            unkiss = employees.slice(0);
        var unkiss_length = unkiss.length;
        // 如果unkiss的数组长度足设定值，就先从kissed数组中补充
        var kiss_length = unkiss_length < number ? number - unkiss_length : 0;
        var _kissed = kissed.slice(0);
        for (var i = 0; i < kiss_length; i++) {
            // 随机一个数据出来
            var employee = _kissed.splice(randomIndex(_kissed.length), 1)[0];
            // 设置kissed状态
            employee.kissed = true;
            tmp.push(employee);
        }
        // 从unkiss中填充数据到tmp
        unkiss_length = unkiss_length < number ? unkiss_length : number;
        var _unkiss = unkiss.slice(0);
        for (var i = 0; i < unkiss_length; i++) {
            // 随机一个数据出来
            var employee = _unkiss.splice(randomIndex(_unkiss.length), 1)[0];
            tmp.push(employee);
        }
        return tmp;
    };

    /**
     * 渲染界面
     * @param {type} checked
     * @returns {undefined}
     */
    var render = function (checked) {
        $.each(checked, function (i) {
            var em = checked[i];
            $("p#kiss_employee_0" + (i + 1) + " > img").attr("src", em.images.sad);
            $("p#kiss_employee_0" + (i + 1) + " > img").attr("employeeid", em.id);
            $("p#kiss_employee_0" + (i + 1) + " > img").attr("happyurl", em.images.happy);
            $("p#kiss_employee_0" + (i + 1) + " > img").attr("kissed", em.kissed);
            $("p#kiss_employee_0" + (i + 1) + " > img").attr("slogan", em.slogan);
            $("i.kiss-num0" + (i + 1)).html(em.times);
            if (em.kissed == true) {
                $('.sad ul li p').eq(i).addClass("hadClick");
                $('.sad ul li p').eq(i).children('.sad-kiss').show();
            } else {
                $('.sad ul li p').eq(i).removeClass("hadClick");
                $('.sad ul li p').eq(i).children('.sad-kiss').hide();
            }
        });
    };

    /**
     * 获取一个小于size的随机整数
     * @param {type} size
     * @returns {Number}
     */
    var randomIndex = function (size) {
        return Math.floor(Math.random() * size);
    };

    /**
     * 切换皮肤功能
     * @param {type} event
     * @returns {undefined}
     */
    var changeSkin = function () {
        changeAttr = [];
        for (var i = 0; i < 4; i++) {
            var changeNum = parseInt(Math.random() * 10);
            if (!findNum(changeNum, changeAttr)) {
                changeAttr.push(changeNum);
            } else {
                i--;
            }
        }
        $('.sad-cover img').each(function (index) {
            $('.sad-cover img').eq(index).attr("src", "skin/i/sad0" + changeAttr[index] + "-cover.png");
        });
    };

    var findNum = function (num, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (num == arr[i]) {
                return true;
            }
        }
        return false;
    };

    /**
     * 点击人物切换动画的操作
     * @param {type} target 点击人物所对应的P节点
     * @returns {undefined}
     */
    var clickOne = function (target) {
        if (target.hasClass('hadClick')) {
            return;
        }
        var happyurl = target.children('img').attr("happyurl");
        var slogan = target.children('img').attr("slogan");
        $('.sad-popup .sp-people img').attr("src", happyurl);
        $('.sad-popup .sp-txt').html(slogan);
        target.addClass('hadClick');
        target.children('.sad-kiss').show();
        /*$('.sad-swing-hide').removeClass();*/
        target.find('.sad-swing-hide').removeClass();
        musicFlag && $("#kissaudio")[0].play();
        setTimeout(function () {
            $('.sad-popup').show();
            /*弹窗动画*/
            setTimeout(function () {
                $('.sp-people').show();
                $('.sp-people').addClass('happy-tada');
                setTimeout(function () {
                    $('.sp-skin01,.sp-del,.sp-txt').show();
                    $('.sp-skin01,.sp-del,.sp-txt').addClass('happy-fadeIn');
                    setTimeout(function () {
                        $('.happy-point').show();
                        $('.happy-point').addClass('happy-bounceInLeft');
                    }, 500);
                }, 1000);
            }, 1000);
        }, 800);
    };

    /**
     * kiss操作
     * @param {employee} target
     * @param {boolean} type true标示前端随机结果的kiss操作，false标示后端随机
     * @returns {undefined}
     */
    var kissOne = function (target, type) {
        var thisImg = target.children("img");
        var kissed = thisImg.attr("kissed");
        var emid = thisImg.attr("employeeid");
        if (kissed != "true") {
            $.ajax({
                url: '/employee/kiss',
                type: 'post',
                data: {
                    id: emid,
                    withline: true
                },
                success: function (data) {
                    if (data.success) {
                        thisImg.attr("kissed", true);
                        var num = data.msg;
                        target.children("i").html(num);
                        if (type) {
                            if (unkiss.length !== 0) {
                                var id = emid;
                                kissme(id, num);
                            }
                        }
                    }
                }
            });
            luckdraw("kissIT11");
        }
    };

    /**
     * 后台随机算法进行初始化
     * @returns {undefined}
     */
    var init2 = function () {
        var line = $(".swiper-slide .box").attr("idx");
        $.ajax({
            url: "/employee/random",
            type: "post",
            dataType: "json",
            data: {
                line: line ? (Number(line) + 1) : 1
            },
            success: function (data) {
                if (data.success) {
                    render(data.msg);
                }
            }
        });
    };

    // 初始化
    (function () {
        if (useFrontRandom) {
            init();
        } else {
            init2();
        }
    })();

    /**
     * 点击图片后的操作
     * @param {type} data
     * @returns {undefined}
     */
    $(".change").click(function () {
        if (useFrontRandom) {
            render(random(employees));
        } else {
            init2();
        }
        changeSkin();
    });

    /**
     * 点击人物层的操作：
     * 第一个是切换动画（打开弹出层，切换人物图片）
     * 第二个是执行一个ajax操作
     */
    $('.sad ul li p').click(function () {
        clickOne($(this));
        kissOne($(this), useFrontRandom);
    });

    var luckdraw = function (active) {
        $.ajax({
            url: 'http://wq.jd.com/active/active_draw?active=' + active,
            dataType: 'JSONP',
            jsonpCallback: 'ActiveLotteryCallBack',
            success: function (data) {
                if (data) {
                    if (data.ret == 2) {
                        var local = window.location.pathname;
                        // "http://wq.jd.com/mlogin/h5v1/cpLogin_BJ?rurl="+encodeURIComponent(local)
                        window.location.href = "http://wq.jd.com/mlogin/wxv3/login_BJ?rurl=" + encodeURIComponent(local) + "&appid=1";
                    } else
                    if (data.ret == 0 && data.bingo.ret == 0) {
                        $(".happy-point .hp-prize").html("<p>初次见面，送你</p><p class='hp-big'>" + data.award.awardcode + "</p>").show().siblings("div").hide();
                    } else if (data.ret == 3) {
                        $(".happy-point .hp-noprize").html("<p>木有中奖哟</p><p>换个人kiss吧</p>").show().siblings("div").hide();
                    } else if (data.ret == 104) {
                        $(".happy-point .hp-noprize").html("<p>您来晚啦</p><p>活动已结束</p>").show().siblings("div").hide();
                    } else if (data.ret == 157) {
                        $(".happy-point .hp-noprize").html("<p>抽奖机会已用完</p><p>分享好友一起kiss</p>").show().siblings("div").hide();
                    } else {
                        $(".happy-point .hp-nochange").show().siblings("div").hide();
                    }
                }
            }
        });
    };

    // kiss操作，把已经做了kiss操作的图片放置到kisssed数组
    var kissme = function (id, num) {
        console.log("id = " + id);
        for (var i = 0; i < unkiss.length; i++) {
            if (unkiss[i].id == id) {
                // 把数据从unkiss中移动到kissed中
                var one = unkiss.splice(i, 1)[0];
                one.times = num;
                kissed.push(one);
            }
        }
    };
})(Zepto);



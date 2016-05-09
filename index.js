"use strict"
var page = new Index();
var todo_keyWord = "业务一部";
var gui = require('nw.gui');
var app = gui.App;

initTray();

nw.Window.get().on('close', function (arg) {
    if (arg == "quit") {
        app.quit();
    } else {
        nw.Window.get().hide();
    }
});
nw.Window.open("http://172.18.18.18/hftpframe/CustomFrame4Bid/login_TP.aspx", { id: "login" });

// 【托盘】 图标、菜单
function initTray() {
    var tray = new gui.Tray({ "icon": "trayIcon_80.png", "tooltip": "提醒" });

    //退出菜单
    var menuShow = new nw.MenuItem({
        label: "显示",
        click: function () { nw.Window.open("index.htm", { "id": "index" }); }
    });
    var menuQuit = new nw.MenuItem({
        label: "退出",
        click: function () { app.quit(); }
    });

    var menu = new gui.Menu();
    menu.append(menuShow);
    menu.append(new nw.MenuItem({ type: "separator", }));
    menu.append(menuQuit);
    tray.menu = menu;
}

//
//页面
function Index() {
    var todos = new TodoWatch("业务一部", 2 * 60 * 1000);
    var announce = new AnnouncementWatch("点位", 60 * 60 * 1000);
    var logger = new Logger();
    var alerter = $("#alerter");

    this.init = function () {
        todos.start();
        announce.start();
        $("#btnLogin").click(function () {
            nw.Window.open("http://172.18.18.18/hftpframe/CustomFrame4Bid/login_TP.aspx", { id: "login" });
        });
        $("#reloadTodo").click(function () {
            todos.query();
        });
        $("#reloadAnno").click(function () {
            announce.query();
        });
        $("#btnClearLog").click(function () {
            logger.clearLog();
        });
    };

    this.init();
}

//
//日志类
function Logger() {
    var logdl = $("#log");

    this.log = function (content, type) {
        var date = new Date();
        var dateStr = formatNumber(date.getHours()) + ":" + formatNumber(date.getMinutes()) + ":" + formatNumber(date.getSeconds());
        if (type == "error") {
            logdl.prepend("<dd class=\"text-danger\">" + content + "</dd>");
        } else if (type == "success") {
            logdl.prepend("<dd class=\"text-success\">" + content + "</dd>");
        }
        else {
            logdl.prepend("<dd>" + content + "</dd>");
        }
        logdl.prepend("<dt>" + dateStr + "</dt>");
    };

    this.clearLog = function () {
        logdl.empty();
    };

    var formatNumber = function (n) {
        if (n < 10)
            return "0" + "" + n;
        else
            return n;
    };
}

//
// 通知类
function Notifier() {
    var _canNotify = false;//是否能够发送桌面通知

    //构造
    this.init = function () {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
        if (Notification.permission === 'granted' || Notification.permission === 'default') {
            _canNotify = true;
        }
    };

    //显示通知
    this.show = function (title, msg) {
        if (_canNotify) {
            var n = new Notification(title, { body: msg, icon: "trayIcon_64.png" });
            return n;
        }
        else {
            alert(msg);
            return null;
        }
    };

    this.init();
}

//
//localStorage助手
function lsHelper() {

    //获取Id最大值
    this.getMaxId = function (name) {
        var id = 0;
        this.find(name, function (key) {
            if (key.indexOf("_") >= 0) {
                var tmp = parseInt(key.substr(key.indexOf("_") + 1));
                if (tmp > id) {
                    id = tmp;
                }
            }
        });
        return id;
    };

    //按名称查找
    this.find = function (name, callback) {
        for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            //全匹配则回调
            if (k == name) {
                if (!callback(k)) {
                    break;
                }
            }
            //带序号也回调
            else if (k.indexOf("_") >= 0) {
                if (k.substr(0, k.indexOf("_")) == name) {
                    if (!callback(k)) {
                        break;
                    }
                }
            }
        }
    };

    //插入新记录
    this.insert = function (name, val) {
        var id = this.getMaxId(name) + 1;
        var key = name + "_" + id;
        localStorage.setItem(key, val);
        return id;
    };

    //清空指定名称的记录
    this.clear = function (name) {
        this.find(name, function (key) {
            localStorage.removeItem(key);
        });
    };

    //读取所有记录
    this.readAll = function (name) {
        var arr = new Array();
        this.find(name, function (key) {
            arr.push(localStorage.getItem(key));
        });
        return arr;
    };
}

//
//待办检测类
function TodoWatch(w, itv) {

    var logger = new Logger();
    var notify = new Notifier();
    var intervalId;

    //检测关键词
    this.keyWord = w;
    //时间间隔
    this.interval = itv;

    //构造
    this.init = function () {

    };

    //查询
    this.query = function () {
        var _data = "{\"BaseOUGuid\": \"-1\",\"UserGuid\": \"8623cf12-b066-4dab-9d33-0a89e331a1d0\"}";
        var _url = "http://172.18.18.18/hftpframe/ZHManageMis_HFZTB/MainPages/TP_Main_OA/TP_Main_OA.aspx/GetMissionContent";
        $.ajax({
            type: "post", data: _data, contentType: "application/json;utf-8", url: _url, success: read, error: function (e) {
                logger.log("【失败】查询待办失败！是否还没有登录？", "error");
            }
        });
    };

    //读取内容
    var read = function (data) {
        var ret = data.d;
        var arr = new Array();
        $(ret).find("li").each(function (i) { arr[i] = $(this).find("div").eq(1).text(); });
        show(arr);
    };

    //显示内容  
    var show = function (arr) {
        $(".list-group").empty();
        if (arr.length === 0) {
            $(".list-group").html("<li class='list-group-item disabled'>没有待办</li>");
        }
        else {
            var found = false;
            $(arr).each(function (i) {
                var tmp = arr[i];
                //通知
                if (tmp.indexOf(todo_keyWord) >= 0) {
                    if (!found) {
                        logger.log("发现待办，发出提醒。", "success");
                        var title = tmp.slice(tmp.indexOf("【") + 1, tmp.indexOf("】"));
                        var msg = tmp.slice(tmp.indexOf("】") + 1);
                        var n = notify.show(title, msg);
                        n.onclick = function () {
                            n.cancel();
                        };
                        found = true;
                    }
                }
                //显示到列表
                var item = "<li class='list-group-item'>" + tmp + "</li>";
                $(".list-group").append(item);
            });
            if (!found) {
                logger.log("查询待办完成。");
            }
        }
    };

    //启动
    this.start = function () {
        clearInterval(intervalId);
        intervalId = setInterval(this.query, this.interval);
    };

    //停止
    this.stop = function () {
        clearInterval(intervalId);
    }

    this.init();
}

//
//交警点位检测类
function AnnouncementWatch(keyWord, interval) {

    var logger = new Logger();
    var notify = new Notifier();
    var helper = new lsHelper();
    var intervalId;
    var url = "http://www.hfjjzd.gov.cn/zhuzhan/jwgk/";
    var xhr;

    //时间间隔
    this.interval = interval;

    //关键词
    this.keyWord = keyWord;

    //构造
    this.init = function () {

    };

    //查询
    this.query = function () {
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = xhrStateChanged;
        xhr.open("GET", url, true);
        xhr.send();
    }

    var xhrStateChanged = function () {
        if (xhr.readyState == 4) {
            //读取内容
            var arr = $(xhr.responseText).find(".liebiangaoqilaile2_kaishil2 ul li a");
            var href;
            $("#announcement").empty();
            if (arr.length == 0) {
                $("#announcement").append("<span>没有公告</span>");
                $("#announcement").append("<br>");
            } else {
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    $("#announcement").append(item);
                    $("#announcement").append("<br>");
                }
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    if ($(item).attr("title").indexOf(keyWord) >= 0) {
                        href = $(item).attr("href");
                        break;
                    }
                }
            }
            if (href) {
                if (!getIsRead(href)) {
                    show(keyWord, href);
                    logger.log("查询交警支队警务公开信息。发现关键词“" + keyWord + "”", "success");
                }
                else {
                    logger.log("查询交警支队警务公开信息，没有发现关键词。");
                }
            } else {
                logger.log("查询交警支队警务公开信息，没有发现关键词。");
            }
        }
    };

    //显示通知
    var show = function (word, href) {
        var n = notify.show("检测到关键字：" + word, url);
        n.onclick = function () {
            window.open(url);
            setIsRead(href);
        };
    };

    //启动
    this.start = function () {
        clearInterval(intervalId);
        setInterval(this.query, interval);
    };

    //停止
    this.stop = function () {
        clearInterval(intervalId);
    };

    //设置为已读
    var setIsRead = function (href) {
        helper.insert("read", href);
    };

    //判断是否是已读
    var getIsRead = function (href) {
        var arr = helper.readAll("read");
        for (var i = 0; i < arr.length; i++) {
            var u = arr[i];
            if (href == u) {
                return true;
            }
        }
        return false;
    };

    this.init();
}
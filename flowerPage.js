"use strict"

var flowers = [
    new Flower("君子兰", 30, 20, 270, "f1", "浇水后必须放置于通风处", 3, false),
    new Flower("虎皮兰", 30, 20, 398, "f2", "一个月左右向土喷水", 3, false),
    new Flower("君子兰", 30, 20, 526, "f3", "浇水后必须放置于通风处", 3, false),
    new Flower("莲花竹", 4, 20, 654, "f4", "", 1, false),
    new Flower("虎皮兰", 30, 330, 286, "f5", "一个月左右向土喷水", 3, false),
    new Flower("虎皮兰", 30, 330, 414, "f6", "一个月左右向土喷水", 3, false),
    new Flower("发财树", 25, 330, 542, "f7", "浇水后必须放置于通风处", 5, false),
    new Flower("袖珍椰子", 4, 330 - 20, 670, "f8", "", 1, false),
    new Flower("常青藤", 4, 330 + 15, 670, "f9", "", 1, false),
    new Flower("金钱树", 30, 365, 286, "f10", "浇水后必须放置于通风处", 3, false),
    new Flower("竹竽", 4, 365, 414, "f11", "", 1, false),
    new Flower("竹柏", 4, 365, 542, "f12", "", 1, false),
    new Flower("兰花", 4, 365 + 15, 670, "f13", "", 1, false),
    new Flower("富贵树", 7, 160, 675, "f14", "", 2, true),
    new Flower("竹柏", 4, 347, 151, "f15", "", 1, false),
    new Flower("螺纹铁", 15, 438, 132, "f16", "", 2, true),
    new Flower("螺纹铁", 15, 228, 132, "f17", "", 2, true),
    new Flower("未名", 7, 525, 633, "f18", "", 2, false),
    new Flower("香龙血树", 7, 518, 414, "f19", "", 2, true),
    new Flower("测试", 2, 330, 190, "f20", "虚构出来用于测试的花", 1, false)
];

dispFlowers();
dispToday();
// bindEvents();
dispHumidity();

//显示花信息
function dispFlowers() {
    var canvas = $("#canvas");
    canvas.html("");
    for (var index = 0; index < flowers.length; index++) {
        var f = flowers[index];
        f.getWateredDate();
        canvas.append(
            `<div id="${f.id}" class="flower ${f.isLarge ? "lg-flower" : "sm-flower"}" style="left:${f.x}px;top:${f.y}px;">
                <div class="dry" style="height: ${f.dry}%; /*opacity: ${f.dry / 100}*/"></div>
                <div class="wet" style="height: ${f.wet}%"></div>
            </div>`);
    }
    //悬停提示
    $(document).tooltip({
        items: ".flower",
        content: function () {
            var f = getFlowerById(this.id);
            if (f) {
                return `<p>${f.name}\t-\t${f.id}</p><p>每 ${f.period}±${f.offSet} 天浇一次水，${f.wateredDaysToNow} 天前浇过。</p><p>${f.note}</p>`;
            }
        }
    });
    //点击浇花
    $(".flower").click(function () {
        setWateredDate(this.id);
    });
}

//注册事件
function bindEvents() {
    //花图标鼠标悬停闪烁
    var eles = document.getElementsByClassName("link");
    for (var i = 0; i < eles.length; i++) {
        var e = eles[i];

        e.onmouseover = function () {
            document.getElementById(this.id).parentElement.parentElement.firstElementChild.style.animation = "pulse 2s infinite linear";
            document.getElementById(this.id).parentElement.parentElement.children[1].style.animation = "pulse 2s infinite linear";
        };
        e.onmouseleave = function () {
            document.getElementById(this.id).parentElement.parentElement.firstElementChild.style.animation = "none";
            document.getElementById(this.id).parentElement.parentElement.children[1].style.animation = "none";
        }
    }

    //今日浇水鼠标悬停时花图标闪烁
    var items = document.getElementsByClassName("list-group-item");
    for (var i = 0; i < items.length; i++) {
        var o = items[i];
        o.onmouseover = function () {
            var fid = this.id.slice(2);
            document.getElementById(fid).parentElement.parentElement.firstElementChild.style.animation = "pulse 2s infinite linear";
        }
        o.onmouseleave = function () {
            var fid = this.id.slice(2);
            document.getElementById(fid).parentElement.parentElement.firstElementChild.style.animation = "none";
        }
        o.onclick = function () {
            var fid = this.id.slice(2);
            setWateredDate(fid);
        }
    }
}

//通过id查找花
function getFlowerById(id) {
    for (var i = 0; i < flowers.length; i++) {
        var f = flowers[i];
        if (f.id == id)
            return f;
    }
}

//记录浇水
function setWateredDate(id) {
    var f = getFlowerById(id);
    if (f) {
        confirmDialog("浇过了吗？", function () {
            f.setWateredDate();
            dispFlowers();
            dispToday();
        });
    }
}

function confirmDialog(msg, callback) {
    var div = $("#confirm");
    if (div.length == 0) {
        $("body").append("<div id='confirm' title='确认'><p></p></div>")
        div = $("#confirm");
    }
    div.find("p").html(msg);
    div.dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "是": function () {
                $(this).dialog("close");
                callback();
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });
}

//显示天气湿度
function dispHumidity() {
    var humidity = getHumidity();
    if (humidity > -1) {
        $("#humidity").text(humidity + "%");
    }
}

//显示今天要浇水
function dispToday() {
    var list = [];
    var nextWaterDay = nextWorkDay(); //距离下次有人在这浇水的天数
    for (var i = 0; i < flowers.length; i++) {
        var f = flowers[i];
        if (f.wateredDaysToNow + nextWaterDay > f.period) {
            list.push(f);
        }
    }
    $("#today>h3").unbind();
    $("#today>h3").mouseover(function () {
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            pulseFlower(f.id);
        }
    });
    $("#today>h3").mouseleave(function () {
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            stopPulseFlower(f.id);
        }
    });
    $("#today>div").remove();
    $("#today").append("<div></div>");
    var page = $("#today>div");
    page.html("");
    for (var i = 0; i < list.length; i++) {
        var f = list[i];
        page.append(
            `<h3 data-fid="${f.id}">${f.name}\t-\t${f.id}</h3>
            <div>
                <p>每 ${f.period}±${f.offSet} 天浇一次水，${f.wateredDaysToNow} 天前浇过。<br>${f.note}</p>
                <a href="javascript:void(0)" class="btn" onclick=setWateredDate('${f.id}')>已浇水</a>
            </div>`);
    }
    $(".btn").button();
    page.accordion({ heightStyle: "content", collapsible: true });
    $("[data-fid]").mouseover(function () {
        var fid = $(this).attr("data-fid");
        pulseFlower(fid);
    });
    $("[data-fid]").mouseleave(function () {
        var fid = $(this).attr("data-fid");
        stopPulseFlower(fid);
    });
}

function pulseFlower(fid) {
    $(`#${fid}>div`).css({ animation: "pulse 2s infinite linear" })
}
function stopPulseFlower(fid) {
    $(`#${fid}>div`).css({ animation: "none" });
}

//获取下一个工作日距离今天有几天 // 大于8天则会返回9天
function nextWorkDay() {
    // API示例：
    // http://www.easybots.cn/api/holiday.php?d=20160905,20160910,20161007,20161008
    //查询未来8天
    var dates = [];
    var now = new Date();
    for (var i = 1; i < 9; i++) {
        var tmp = addDays(now, i);
        dates.push(tmp.getFullYear() + ("00" + (tmp.getMonth() + 1)).slice(-2) + ("00" + (tmp.getDate())).slice(-2));
    }
    var queryString = "";
    for (var i = 0; i < dates.length; i++) {
        queryString += dates[i] + ",";
    }
    queryString = queryString.slice(0, queryString.length - 1);
    var result = $.ajax({
        type: "GET",
        async: false,
        url: "http://www.easybots.cn/api/holiday.php?d=" + queryString,
        error: function (ex) {
            alert("查询节假日失败！请检查API是否可用。");
            throw ex;
        }
    }).responseText;
    var data = JSON.parse(result);
    for (var i = 0; i < dates.length; i++) {
        var d = dates[i];
        if (data[d] == 0) {
            return i + 1;
        }
    }
    return 9;
}

//日期计算
function addDays(date, daysToAdd) {
    return new Date(date.getTime() + (daysToAdd * 1000 * 3600 * 24));
}

//获取湿度
function getHumidity() {
    var result = -1;
    try {
        var txt = $.ajax({ async: false, dataType: "text", url: "http://tianqi.2345.com/today-58321.htm" }).responseText;
        result = parseInt(txt.match(/\d+%</)[0].replace("%<", ""));
    } catch (ex) { }
    return result;
}
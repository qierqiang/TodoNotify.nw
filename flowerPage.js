"use strict"

var flowers = [
    new Flower("君子兰", 30, 0, 1, "f1", "浇水后必须放置于通风处", 3),
    new Flower("虎皮兰", 30, 0, 2, "f2", "一个月左右向土喷水", 3),
    new Flower("君子兰", 30, 0, 3, "f3", "浇水后必须放置于通风处", 3),
    new Flower("莲花竹", 4, 0, 4, "f4", "", 1),
    new Flower("虎皮兰", 30, 2, 1, "f5", "一个月左右向土喷水", 3),
    new Flower("虎皮兰", 30, 2, 2, "f6", "一个月左右向土喷水", 3),
    new Flower("发财树", 25, 2, 3, "f7", "浇水后必须放置于通风处", 5),
    new Flower("袖珍椰子", 4, 2, 4, "f8", "", 1),
    new Flower("常青藤", 4, 3, 4, "f9", "", 1),
    new Flower("金钱树", 30, 4, 1, "f10", "浇水后必须放置于通风处", 3),
    new Flower("竹竽", 4, 4, 2, "f11", "", 1),
    new Flower("竹柏", 4, 4, 3, "f12", "", 1),
    new Flower("兰花", 4, 4, 4, "f13", "", 1),
    new Flower("富贵树", 7, 1, 5, "f14", "", 2),
    new Flower("竹柏", 4, 2, 0, "f15", "", 1),
    new Flower("香龙血树", 7, 4, 0, "f16", "", 2),
    new Flower("香龙血树", 7, 1, 0, "f17", "", 2),
    new Flower("未名", 7, 5, 5, "f18", "", 2),
    new Flower("香龙血树", 7, 5, 3, "f19", "", 2),
    new Flower("测试", 2, 5, 0, "f20", "", 1)
];

drawGrid();
dispFlowers();
dispToday();
bindEvents();
dispHumidity();

//画网格
function drawGrid() {
    var gridRowCount = 6;
    var gridColCount = 6;
    var grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (var i = 0; i < gridRowCount; i++) {
        var tmp = "<tr id='r" + i + "'>";
        for (var j = 0; j < gridColCount; j++) {
            tmp += "<td id='" + "r" + i + "c" + j + "'></td>";
        }
        tmp += "</tr>";
        grid.innerHTML = grid.innerHTML + tmp;
    }
}

//显示花信息
function dispFlowers() {
    for (var index = 0; index < flowers.length; index++) {
        var f = flowers[index];
        var pos = `r${f.y}c${f.x}`;
        var td = document.getElementById(pos);
        td.innerHTML = `
        <div class="flower">
            <div class="dry" style="height: ${f.dry}%"></div>
            <div class="wet" style="height: ${f.wet}%"></div>
            <div class="content"><a id="${f.id}" class="link" href="javascript:void(0);" onclick="setWateredDate('${f.id}')">${f.name}</a></div>
        </div>`;
    }
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

    //花图标鼠标悬停展示信息
    $(document).tooltip({
        items: ".link",
        content: function () {
            var f = getFlowerById(this.id);
            if (f) {
                return `<p>${f.name}\t-\t${f.id}</p><p>每 ${f.period}±${f.offSet} 天浇一次水，${f.wateredDaysToNow} 天前浇过。</p><p>${f.note}</p>`;
            }
        }
    });

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
    if (confirm("浇过了吗？")) {
        var f = getFlowerById(id);
        if (f) {
            f.setWateredDate();
            alert("已记录");
            drawGrid();
            dispFlowers();
            dispToday();
            bindEvents();
        }
    }
}

//显示天气湿度
function dispHumidity() {
    var humidity = getHumidity();
    if (humidity > -1) {
        var dry = 100 - humidity;
        $(".humidity>.dry").css("height", dry + "%");
        $(".humidity>.wet").css("height", humidity + "%");
        $(".humidity>.content").html(`湿度：${humidity}%`)
    }
}

//显示今天要浇水
function dispToday() {

    //查询下两次浇水的时间

    var list = [];
    var nextWaterDay = nextWorkDay(); //距离下次有人在这浇水的天数
    for (var i = 0; i < flowers.length; i++) {
        var f = flowers[i];
        if (f.wateredDaysToNow + nextWaterDay > f.period) {
            list.push(f);
        }
    }
    var page = document.getElementById("today");
    page.innerHTML = "";
    for (var i = 0; i < list.length; i++) {
        var f = list[i];
        page.innerHTML = page.innerHTML + `
        <a id="a-${f.id}" href="javascript:void(0);" class="list-group-item">
            <h4 class="list-group-item-heading">${f.name} (${f.id})</h4>
            <p class="list-group-item-text">每 ${f.period}±${f.offSet} 天浇一次水，${f.wateredDaysToNow} 天前浇过。</p>
            <p class="list-group-item-text">${f.note}</p>
        </a>
        `;
    }
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
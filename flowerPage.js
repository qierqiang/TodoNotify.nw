var flowers = [];
flowers.push(new Flower("君子兰", 30, 0, 1, "f1", "浇水后必须放置于通风处", 1));
flowers.push(new Flower("虎皮兰", 30, 0, 2, "f2", "一个月左右向土喷水", 1));
flowers.push(new Flower("君子兰", 30, 0, 3, "f3", "浇水后必须放置于通风处", 1));
flowers.push(new Flower("莲花竹", 4, 0, 4, "f4", "", 1));
flowers.push(new Flower("虎皮兰", 30, 2, 1, "f5", "一个月左右向土喷水", 1));
flowers.push(new Flower("虎皮兰", 30, 2, 2, "f6", "一个月左右向土喷水", 1));
flowers.push(new Flower("发财树", 25, 2, 3, "f7", "浇水后必须放置于通风处", 5));
flowers.push(new Flower("袖珍椰子", 4, 2, 4, "f8", "", 1));
flowers.push(new Flower("吊兰", 4, 3, 4, "f9", "", 1));
flowers.push(new Flower("金钱树", 30, 4, 1, "f10", "浇水后必须放置于通风处", 1));
flowers.push(new Flower("竹竽", 4, 4, 2, "f11", "", 1));
flowers.push(new Flower("竹柏", 4, 4, 3, "f12", "", 1));
flowers.push(new Flower("？？", 4, 4, 4, "f13", "", 1));
flowers.push(new Flower("？？", 7, 1, 5, "f14", "", 1));
// flowers.push(new Flower("？？", 7, 1, 0, "f14", "", 1));
flowers.push(new Flower("竹柏", 4, 2, 0, "f15", "", 1));
flowers.push(new Flower("？？", 4, 4, 0, "f16", "", 1));
flowers.push(new Flower("？？", 4, 1, 0, "f17", "", 1));
// flowers.push(new Flower("？？", 7, 5, 3, "f17", "", 1));
flowers.push(new Flower("？？", 7, 5, 5, "f18", "", 1));
flowers.push(new Flower("？？", 7, 5, 3, "f19", "", 1));
// flowers.push(new Flower("？？", 7, 1, 5, "f19", "", 1));

flowers.push(new Flower("测试", 2, 5, 0, "f20", "", 1));

drawGrid();
dispFlowers();
dispHumidity();
dispToday();
bindEvents();

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
        f.getWateredDate();
        f.setWetAndDry();
        var pos = `r${f.y}c${f.x}`;
        var td = document.getElementById(pos);
        td.innerHTML = `
                <div class="flower">
                    <div class="dry" style="height: ${f.dry}%"></div>
                    <div class="wet" style="height: ${f.wet}%"></div>
                    <div class="content"><a id="${f.number}" class="link" href="javascript:void(0);" onclick="setWateredDate('${f.number}')">${f.name}</a></div>
                </div>`;
    }
}

function bindEvents() {
    var eles = document.getElementsByClassName("link");
    for (var i = 0; i < eles.length; i++) {
        var e = eles[i];
        e.onmouseover = function () {
            document.getElementById(this.id).parentElement.parentElement.firstElementChild.style.animation = "pulse 2s infinite linear";
            document.getElementById(this.id).parentElement.parentElement.children[1].style.animation = "pulse 2s infinite linear";

            var f = getFlowerById(this.id);
            if (f) {
                var page = document.getElementById("hoverInfo");
                page.innerHTML = `
                    <p>${f.name}\t-\t${f.number}</p>
                    <p>每 <mark>${f.period}</mark> 天浇一次水，前后可误差 <mark>${f.offSet}</mark> 天。<br>
                    ${f.note}<br><br>
                    上次浇水是：<mark>${f.wateredDaysToNow}</mark> 天前\t${f.wateredDate.getFullYear()}-${f.wateredDate.getMonth() + 1}-${f.wateredDate.getDate()}</p>
                    `;
            }
        };
        e.onmouseleave = function () {
            document.getElementById(this.id).parentElement.parentElement.firstElementChild.style.animation = "none";
            document.getElementById(this.id).parentElement.parentElement.children[1].style.animation = "none";
        }
    }
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

function getFlowerById(id) {
    for (var i = 0; i < flowers.length; i++) {
        var f = flowers[i];
        if (f.number == id)
            return f;
    }
}

function setWateredDate(id) {
    if (confirm("浇过了吗？")) {
        var f = getFlowerById(id);
        if (f) {
            f.setWateredDate();
            alert("已记录");
            drawGrid();
            dispFlowers();
            // dispHumidity();
            dispToday();
            bindEvents();
        }
    }
}

function dispHumidity() {
    var humidity = getHumidity();
    if (humidity > -1) {
        var dry = 100 - humidity;
        $(".humidity>.dry").css("height", dry + "%");
        $(".humidity>.wet").css("height", humidity + "%");
        $(".humidity>.content").html(`湿度：${humidity}%`)
    }
}

function dispToday() {
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
        <a id="a-${f.number}" href="javascript:void(0);" class="list-group-item">
            <h4 class="list-group-item-heading">${f.name} (${f.number})</h4>
            <p class="list-group-item-text">每 <mark>${f.period}</mark> 天浇一次，前后可误差 ${f.offSet} 天。</p>
            <p class="list-group-item-text">${f.note}</p>
            <p class="list-group-item-text">上次浇水是：<mark>${f.wateredDaysToNow}</mark> 天前。</p>
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

function addDays(date, daysToAdd) {
    return new Date(date.getTime() + (daysToAdd * 1000 * 3600 * 24));
}

//获取湿度
function getHumidity() {
    var txt = $.ajax({ async: false, dataType: "text", url: "http://tianqi.2345.com/today-58321.htm" }).responseText;
    var result = -1;
    try { result = parseInt(txt.match(/\d+%</)[0].replace("%<", "")); } catch (ex) { }
    return result;
}
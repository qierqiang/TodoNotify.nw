function Flower(name, period, x, y, number, note, offSet) {
    this.name = name;
    this.period = period;
    this.note = (note == undefined ? "" : note);
    this.offSet = (offSet == undefined ? 1 : offSet);

    this.x = x;
    this.y = y;
    this.number = number;
    this.wateredDate = new Date(2016, 7, 30);
    this.getWateredDate();
    this.wet = 0;
    this.dry = 100;
    
    this.wateredDaysToNow = 0;
}

Flower.prototype.getWateredDate = function () {
    var val = localStorage.getItem(this.number);
    if (val != undefined){
        this.wateredDate = new Date(val);
        this.wateredDate = new Date(this.wateredDate.getFullYear(), this.wateredDate.getMonth(), this.wateredDate.getDate());
    }
    this.wateredDaysToNow = Math.round((new Date() - this.wateredDate) / 1000 / 60 / 60 / 24);
};

Flower.prototype.setWateredDate = function () {
    var today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    localStorage.setItem(this.number, today.toString());
}

Flower.prototype.setWetAndDry = function () {
    var days = (new Date() - this.wateredDate) / 1000 / 60 / 60 / 24;
    if (days > this.period) {
        this.wet = 0;
        this.dry = 100;
    } else {
        this.dry = days / this.period * 100;
        this.wet = 100 - this.dry;
    }
};
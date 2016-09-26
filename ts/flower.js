"use strict";
var Flower = (function () {
    function Flower(id, name, period, x, y, note, isLarge) {
        this.id = id;
        this.name = name;
        this.period = period;
        this.x = x;
        this.y = y;
        this.note = note;
        this.isLarge = isLarge;
        this.wateredDaysToNow = 0;
        this.offSet = 0;
        this.wet = 0;
        this.dry = 100;
        this.today = new Date();
        this.today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
    }
    Flower.prototype.getWateredDate = function () {
        var val = localStorage.getItem(this.id);
        if (val != undefined) {
            this.wateredDate = new Date(val);
            this.wateredDate = new Date(this.wateredDate.getFullYear(), this.wateredDate.getMonth(), this.wateredDate.getDate());
        }
        this.wateredDaysToNow = Math.round((this.today - this.wateredDate) / 1000 / 60 / 60 / 24);
        var days = (this.today - this.wateredDate) / 1000 / 60 / 60 / 24;
        if (days > (this.period + this.offSet)) {
            this.wet = 0;
            this.dry = 100;
        }
        else {
            this.dry = (days / (this.period + this.offSet)) * 100;
            this.wet = 100 - this.dry;
        }
    };
    return Flower;
}());

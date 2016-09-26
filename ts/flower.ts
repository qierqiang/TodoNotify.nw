"use strict"

class Flower {
    constructor(public id: string, public name: string, public period: number,
        public x: number, public y: number, public note: string,
        public isLarge: boolean) {
        this.today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
    }

    public wateredDaysToNow: number = 0;
    public wateredDate: any;
    public offSet = 0;
    public wet = 0;
    public dry = 100;

    private today: any = new Date();

    public getWateredDate(): void {
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
        } else {
            this.dry = (days / (this.period + this.offSet)) * 100;
            this.wet = 100 - this.dry;
        }
    }
}
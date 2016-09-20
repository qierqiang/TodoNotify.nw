"use strict"

function Dictionary() {
    this.items = [];
}

Dictionary.prototype.get = function (key) {
    for (var i = 0; i < this.items.length; i++) {
        var o = this.items[i];
        if (o.key === key) {
            return o.val;
        }
    }
    return null;
};

Dictionary.prototype.set = function (key, val) {
    for (var i = 0; i < this.items.length; i++) {
        var o = this.items[i];
        if (o.key === key) {
            this.items[i].val = val;
            return;
        }
    }
    this.items.push(new KeyValuePair(key, val));
};

function KeyValuePair(key, val) {
    this.key = key;
    this.val = val;
}
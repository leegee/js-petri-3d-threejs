define( function () {
    'use strict';

    var Base = function (options) {
        var i, self = this;
        for (i in self.options) {
            self[i] = self.options[i];
        }
        for (i in options) {
            self[i] = options[i];
        }
    };

    Base.prototype.options = {};

    return Base;
});

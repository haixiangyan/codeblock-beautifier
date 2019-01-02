var fs = require('fs');

var path = '../lib/highlight/styles'
var themes = []

fs.readdir(path, function (err, items) {
    console.log(items);

    for (var i = 0; i < items.length; i++) {
        themes.push(items[i])
    }
});

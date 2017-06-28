var fs = require('fs');
var path = require('path');
var svgfont2svgicons = require('svgfont2svgicons');

require('ensure-dir')('src/assets/icons/');

var iconDir = path.resolve(__dirname, '../src/assets/icons/');

var fontStream = fs.createReadStream(path.join(__dirname, '../tmp/icons.svg'));
var iconProvider = svgfont2svgicons();

// Piping the font
fontStream.pipe(iconProvider);

// Saving the SVG files
iconProvider.on('readable', function() {
  var icon;
  do {
    icon = iconProvider.read();
    if (icon) {
      console.log('New icon:', icon.metadata.name, icon.metadata.unicode);
      icon.pipe(fs.createWriteStream(path.join(iconDir, icon.metadata.name + '.svg')));
    }
  } while(null !== icon);
}).once('end', function() {
  console.log('No more icons !')
});

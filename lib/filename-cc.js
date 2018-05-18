const klaw = require('klaw');
const opencc = require('node-opencc');
const fs = require ('fs');
const path = require('path');

function cc(text, direction=true) {
  let result = direction ? opencc.simplifiedToTraditional(text) : opencc.traditionalToSimplified(text);
  return result;
};

function rename_cc(filename, direction=true) {
  let dirname = path.dirname(filename);
  let basename = path.basename(filename);
  let tt = cc(basename, direction);
  if (tt!==basename) {
    fs.rename(path.join(dirname, basename), path.join(dirname, tt), (err) => {
       if (err) throw err;
       console.log(filename + ' rename to ' + tt);
    })
  }
};

function file_cc(folder, direction=true) {
  let items = [];
  klaw(folder)
    .on('data', item => items.push(item.path))
    .on('error', (err, item) => {
      console.log(err.message)
      console.log(item.path) // the file the error occurred on
    })
    .on('end', function () {
      for(let i = (items.length -1); i >= 0; i--) {
        rename_cc(items[i], direction)
      }
    })
};

function cc_cmd(folder, action = 'S2T') {
  if (action.toUpperCase()==='S2T') {
    file_cc(folder, true);
  } else {
    file_cc(folder, false);
  }
}

// direction = 'S2T' 簡體->繁體
// direction = 'other' 繁體->簡體
function shell_cmd() {
  let args = process.argv.length;
  if (args < 3){
    console.log('Usege: filename-cc dir-path direction');
  } else {
    cc_cmd(process.argv[2], process.argv[3])
  }
}

shell_cmd();

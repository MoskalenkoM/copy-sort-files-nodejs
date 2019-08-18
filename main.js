const path = require('path');
const fs = require('fs');

const workDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

function createDir(dir, options) {
  try {
    fs.statSync(dir);
    if (options.log) {
      console.log(`Directory ${dir} exists`);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      if (options.log) {
        console.log(`Directory ${dir} does not exist`);
      }
      fs.mkdirSync(dir, err => {
        if (err) throw err;
      });
    }
  }
}

createDir(distDir, { log: false });

function checkDir(dir) {
  fs.readdir(dir, (err, nextDir) => {
    if (err) throw err;
    nextDir.forEach(it => {
      const item = dir + path.sep + it;
      parseDir(item);
    });
  });
}

function parseDir(item) {
  fs.stat(item, (err, stats) => {
    if (err) {
      throw err;
    }
    if (stats.isDirectory()) {
      // directory
      checkDir(item);
    } else {
      // file
      const newInnerDir = distDir + path.sep + path.basename(item)[0];
      createDir(newInnerDir, { log: false });
      //
      fs.readFile(item, (err, data) => {
        if (err) {
          throw err;
        }
        //
        fs.writeFile(newInnerDir + path.sep + path.basename(item), data, err => {
          if (err) {
            throw err;
          }
          // a file was copied
          console.log(`File ${path.basename(item)} was copied and sorted`);
        });
      });
      // delete file
      // fs.unlink(item, err => {
      //   if (err) throw err;
      //   console.log(`File ${path.basename(item)} was deleted`);
      // });
    }
  });
}

checkDir(workDir);

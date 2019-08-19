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
      // directories
      checkDir(item);
    } else {
      // files
      const newInnerDir = distDir + path.sep + path.basename(item)[0];
      createDir(newInnerDir, { log: false });
      //
      const rs = fs.createReadStream(item, { encoding: 'utf8' });
      const ws = fs.createWriteStream(newInnerDir + path.sep + path.basename(item));
      //
      rs.on('data', chunk => {
        console.log(`${chunk.length} bytes - ${path.basename(item)}`);
        rs.pipe(ws);
      });
      // rs.on('end', () => {});
      // ws.on('close', () => {});
      //
      // delete file
      // fs.unlink(item, err => {
      //   if (err) throw err;
      //   console.log(`File ${path.basename(item)} was deleted`);
      // });
    }
  });
}

checkDir(workDir);

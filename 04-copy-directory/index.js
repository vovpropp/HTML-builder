const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname,'files');
const destDir = path.join(__dirname,'files-copy');

copyDir(sourceDir, destDir);

function copyDir(sourceDir, destDir) {
    
  fs.promises.mkdir(destDir,{recursive:true});

  fs.promises.readdir(destDir)
    .then(files => {
      files.forEach(file => {
        const destFile = path.join(destDir,file);
        fs.promises.unlink(destFile);
      });
    });
  
  fs.promises.readdir(sourceDir)
    .then(files => {
      files.forEach( fileName =>{
        const sourceFile = path.join(sourceDir, fileName);
        const destFile = path.join(destDir,fileName);
        fs.promises.copyFile(sourceFile, destFile);
      });
    });
}



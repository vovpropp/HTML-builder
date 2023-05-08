const fs = require('fs');
const path = require('path');
const sourceDir = path.join(__dirname, 'styles'); 
const bundleName = 'bundle.css';
const bundlePath = path.join(__dirname,'project-dist',bundleName);
const output = fs.createWriteStream(bundlePath);

fs.promises.readdir(sourceDir, {withFileTypes: true})
  .then(files => {
    let cssFiles = files.filter(file => {
      const isCssFile = file.isFile() && path.extname(file.name) === '.css';
      return isCssFile;
    });
    cssFiles.forEach(file => {
      const sourceFile = path.join(sourceDir, file.name);
      const input = fs.createReadStream(sourceFile, 'utf-8');
      input.on('data', chunk => output.write(chunk));
    });
  });





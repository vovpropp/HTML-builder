const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const distPath = path.join(__dirname, 'project-dist' );
const assetsDir = path.join(__dirname,'assets');
const styleDir = path.join(__dirname, 'styles');
const componentDir = path.join(__dirname,'components');
const styleFilePath = path.join(distPath,'style.css');
const htmlFilePath = path.join(distPath,'index.html');
const templatePath = path.join(__dirname, 'template.html');
const emitter = new EventEmitter();

makeDir(distPath);
copyDir(assetsDir, distPath);
createCss();
createHTML();

function makeDir(path) {
  fs.promises.mkdir(path, {recursive: true});
}

function copyFile(source,dest) {
  fs.promises.copyFile(source,dest);
}

function copyDir(sourceDirPath, destDirPath) {
  const newDirPath = path.join(destDirPath, path.basename(sourceDirPath)); 
  makeDir(newDirPath);

  fs.promises.readdir(sourceDirPath, {withFileTypes: true})
    .then(files => {
      files.forEach(file => {
        if (file.isFile()) {
          const sourceFile = path.join(sourceDirPath, file.name);
          const destFile = path.join(newDirPath, file.name);
          copyFile(sourceFile,destFile);
        } else {
          const newSourceDir = path.join(sourceDirPath, file.name);
          copyDir(newSourceDir, newDirPath);
        }
      });
    });
}

function createCss() {
  const output = fs.createWriteStream(styleFilePath);

  fs.promises.readdir(styleDir, {withFileTypes: true})
    .then(files => {
      files.forEach(file => {
        const isCSS = file.isFile() && path.extname(file.name) === '.css';
        if (isCSS) {
          const sourceCssFile = path.join(styleDir, file.name);
          const input = fs.createReadStream(sourceCssFile,'utf-8');
          input.on('data', chunk => output.write(chunk));
        }
      });
    });
}

function createHTML() {
  const output = fs.createWriteStream(htmlFilePath);
  const input = fs.createReadStream(templatePath, 'utf-8');
  let countStream = 0;
  let body = '';
  input.on('data', chunk => {
    body += chunk;
  });

  input.on('end', () => {
    let requiredComponents = body.match(/{{[a-z-]+}}/ig);
    requiredComponents = requiredComponents.map(e => e.slice(2,e.length-2)+'.html');

    fs.promises.readdir(componentDir, {withFileTypes: true})
    .then(files => {
        files.forEach(file => {
          
          const isHTML = file.isFile() && path.extname(file.name) === '.html';
          if (isHTML && requiredComponents.includes(file.name)) {
            const componentPath = path.join(__dirname,'components',file.name);
            let componentBody ='';
            const input = fs.createReadStream(componentPath,'utf-8');
            
            countStream++;
            input.on('data', chunk => componentBody += chunk);
            input.on('end', () => {
              const reg = new RegExp(`{{${file.name.slice(0,-5)}}}`, 'ig');
              body = body.replace(reg,componentBody);
              countStream--;
              emitter.emit('ready', countStream)
            });
          }
        });
        
    });
  });

  emitter.on('ready', (count) => {
    if (count === 0)  output.write(body);
  });

}





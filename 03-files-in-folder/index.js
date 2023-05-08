const path = require('path');
const fs = require('fs');
const folderPath = path.join(__dirname,'secret-folder');

fs.promises.readdir(folderPath)
  .then(files => {
    files.forEach(file => {
      const filePath = path.join(folderPath, file);

      fs.promises.stat(filePath)
        .then(fileStat => {
          
          if (fileStat.isFile()) {
            const file = path.parse(filePath);
            const name = file.name;
            const ext = file.ext.slice(1);
            const size = fileStat.size;

            console.log(`${name} - ${ext} - ${size}`);
          }
        })
    });
  });



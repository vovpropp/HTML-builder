const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dest.txt');
const output = fs.createWriteStream(filePath);
const {stdin, stdout} = process;
const exitString = 'exit';

stdout.write('Hello! Please enter text: \n');

stdin.on('data', data => {
  const content = data.toString();
  
  if (content.trim() === exitString) exit();

  output.write(content);
});

function exit() {
  stdout.write('Hasta la vista, baby! I\'ll be back!');
  process.exit();
}

process.on('SIGINT', exit);


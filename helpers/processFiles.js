import path from 'path';
import fs from 'fs';

function readFile (filePath) {
  return fs.readFileSync(filePath);
}

function writeFile (filePath, fileContants) {
  var stream = fs.createWriteStream(filePath);
  stream.once('open', function(fd) {
    stream.write(fileContants);
    stream.end();
  });
}

function uploadImages (fileName, filePath, folderPath) {
  const rootPath = path.join(path.resolve(__dirname), '../');
  const fileContants = readFile(filePath);
  const newPath = `${rootPath}${folderPath}${fileName}`;
  writeFile (newPath, fileContants);
  return newPath;
}

module.exports = {
  readFile,
  writeFile,
  uploadImages
}
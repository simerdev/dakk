import path from 'path';
import fs from 'fs';
import { IMAGES_FOLDER_PATH } from '../constants';

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

function uploadImages (fileName, filePath) {
  const rootPath = path.join(path.resolve(__dirname), '../');
  const fileContants = readFile(filePath);
  const newPath = `${rootPath}${IMAGES_FOLDER_PATH}${fileName}`;
  console.log('newpath', newPath);
  writeFile (newPath, fileContants);
  return newPath;
}

module.exports = {
  readFile,
  writeFile,
  uploadImages
}
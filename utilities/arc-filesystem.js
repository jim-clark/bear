const fs = require('fs');
const path = require('path');

const arcBasePath = fs.realpathSync('./arc-protected-files');
const templateFolderName = 'templates-for-clients';
const clientBasePath = path.join(arcBasePath, 'client-folders');

module.exports = {
  getTemplatesFileList,
  copyTemplateFileToClientFolder,
};

function copyTemplateFileToClientFolder(templatePath, clientId) {
  const sourceTemplateFilePath = path.join(arcBasePath, templateFolderName, templatePath);
  const targetTemplateFilePath = path.join(clientBasePath, clientId, templatePath);
  return new Promise(function(resolve, reject) {
    if (sourceTemplateFilePath.includes('.')) {
      fs.copyFile(sourceTemplateFilePath, targetTemplateFilePath, function(err) {
        if (err) reject(err);
        resolve(`COPIED: ${targetTemplateFilePath}`);
      });
    } else {
      fs.mkdir(targetTemplateFilePath, { recursive: true }, function(err) {
        if (err) resolve(`DIR ALREADY EXISTS: ${sourceTemplateFilePath}`);
        resolve(`DIR CREATED: ${sourceTemplateFilePath}`);
      });
    }
  });
}

function getTemplatesFileList(cb) {
  /*
    - Returns an array of files contained within the "client templates" folder
    held in templateFolderName.
    - Paths to each file will be relative to the "client templates" folder
    - Return example:
      ['template1.txt', 'documents', documents/doc-1.txt', 'documents/doc-2.txt', 'engineering', 'engineering/widgets', 'engineering/widgets/widget-1.txt']
  */
  let templatePath = path.join(arcBasePath, templateFolderName);
  let fileList = [];
  getFileListForDirectory(templatePath, fileList);
  fileList = fileList.map(file => file.replace(templatePath, ''));
  cb(fileList);
}

/*-- helper functions --*/

function getFileListForDirectory(fullPath, list) {
  let results = fs.readdirSync(fullPath);
  results.forEach(function(item) {
    let nextPath = path.join(fullPath, item);
    list.push(nextPath);
    if (!item.includes('.')) getFileListForDirectory(nextPath, list);
  });
}



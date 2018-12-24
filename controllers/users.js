const arcFs = require('../utilities/arc-filesystem');

module.exports = {
  listTemplates,
  copyTemplates
};

function listTemplates(req, res) {
  arcFs.getTemplatesFileList(function(fileList) {
    res.render('users/templates', {fileList, userId: req.params.userId});
  });
}

function copyTemplates(req, res) {
  console.log(req.body);
  arcFs.getTemplatesFileList(function(fileList) {
    res.render('users/templates', {fileList, userId: req.params.userId});
  });
}
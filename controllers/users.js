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

async function copyTemplates(req, res) {
  for (let pathToCopy in req.body.paths) {
    try {
      await arcFs.copyTemplateFileToClientFolder(pathToCopy, req.params.userId);
    } catch (err) {
      console.log(err);
    };
  }
  res.render('users/copy-confirmation', {pathsCopied: req.body.paths , userId: req.params.userId});

}
const inputs = Array.from(document.querySelectorAll('form input'));

document.querySelector('form').addEventListener('change', handleChange);

function handleChange(e) {
  const inp = e.target;
  if (inp.tagName !== 'INPUT') return;
  const folder = isFolder(inp);
  if (folder) {
    clearOrSelectAllDecendents(inp);
    uncheckEmptyFolders();
  } else if (getLevel(inp) > 1) {
    if (inp.checked) {
      checkAllAncestorFolders(inp);
    } else if (areSiblingFilesSameState(inp)) {
      getParentFolder(inp).checked = false;
      uncheckEmptyFolders();
    }
  }
}

function uncheckEmptyFolders() {
  const folders = inputs.filter(inp => isFolder(inp));
  const deepestFolderLevel = folders.reduce((level, f) => getLevel(f) > level ? getLevel(f) : level, 0);
  let level = deepestFolderLevel - 1;
  while (level > 0) {
    const foldersAtLevel = folders.filter(f => getLevel(f) === level);
    for (let f of foldersAtLevel) {
      const childFolders = getChildFolders(f);
      if (childFolders.length) f.checked = childFolders.some(f => f.checked);
    }
    level--;
  }
}

function getChildFolders(inp) {
  let idx = inputs.indexOf(inp) + 1;
  let level = getLevel(inp);
  let childFolders = [];
  while (idx < inputs.length && getLevel(inputs[idx]) > level) {
    if (isFolder(inputs[idx]) && getLevel(inputs[idx]) === level + 1) childFolders.push(inputs[idx]);
    idx++;
  }
  return childFolders;
}

function checkAllAncestorFolders(inp) {
  let parentFolder = getParentFolder(inp);
  while (parentFolder) {
    parentFolder.checked = true;
    parentFolder = getParentFolder(parentFolder);
  }
}

function getParentFolder(inp) {
  let idx = inputs.indexOf(inp) - 1;
  if (idx < 0) return;
  let level = getLevel(inp);
  while (idx >= 0 && !isFolder(inputs[idx]) || (idx >= 0 && getLevel(inputs[idx]) >= level)) idx--;
  return idx >= 0 && isFolder(inputs[idx]) ? inputs[idx] : null;
}

function areSiblingFilesSameState(inp) {
  const level = getLevel(inp);
  let idx = inputs.indexOf(inp);
  // find index of first file in folder
  while (getLevel(inputs[idx]) === level) idx--;
  idx++;
  while (idx < inputs.length && getLevel(inputs[idx]) === level) {
    if (inputs[idx].checked !== inp.checked) return false;
    idx++;
  }
  return true;
}

function clearOrSelectAllDecendents(inp) {
  const folderLevel = getLevel(inp);
  let idx = inputs.indexOf(inp) + 1;
  while (idx < inputs.length && getLevel(inputs[idx]) > folderLevel) {
    inputs[idx].checked = inp.checked;
    idx++;
  }
}

function isFolder(inp) {
  const wrappingDiv = inp.parentElement.parentElement;
  return wrappingDiv.classList.contains('folder');
}

function getLevel(inp) {
  const wrappingDiv = inp.parentElement.parentElement;
  return parseInt(wrappingDiv.className.match(/level-(\d)/)[1]);
}
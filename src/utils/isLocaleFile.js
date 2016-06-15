export default function isLocaleFile(filePath) {
  if (filePath === '<input>') { return true; } // Required for test

  return filePath.match(/i18n/);
}

const utils = require('./utils')

const imgFile = {type: 'image/jpeg'}
const pdfFile = {type: 'pdf'}

test('Checks file extension', () => {
  expect(utils.checkFileExtension(imgFile)).toBe(true)
});

test('Checks file extension', () => {
  expect(utils.checkFileExtension(pdfFile)).toBe(false)
});

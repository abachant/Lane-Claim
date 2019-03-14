const utils = require('./utils')

const imgFile = {type: 'image/jpeg'}
const pdfFile = {type: 'pdf'}

test('Checks file extension of a jpeg', () => {
  expect(utils.checkFileExtension(imgFile)).toBe(true)
});

test('Checks file extension of a pdf', () => {
  expect(utils.checkFileExtension(pdfFile)).toBe(false)
});

test('Checks DMStoDD of 0,0,0,N to be 0', () => {
  expect(utils.convertDMSToDD(0,0,0,'N')).toBe(0)
});

test('Checks DMStoDD of 10,6,36,N to be 10.11', () => {
  expect(utils.convertDMSToDD(10,6,36,'N')).toBe(10.11)
});

test('Checks DMStoDD of 10,6,Nan,N to be NaN', () => {
  expect(utils.convertDMSToDD(10,6,NaN,'N')).toBe(NaN)
});

test('Checks DMStoDD of 10,6,undefined,N to be NaN', () => {
  expect(utils.convertDMSToDD(10,6,undefined,'N')).toBe(NaN)
});

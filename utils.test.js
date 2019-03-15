const utils = require('./utils')

const imgFile = {type: 'image/jpeg'}
const pdfFile = {type: 'pdf'}

describe('Utils functions', () => {

  describe('isFileExtensionJpeg function', () => {
    it('should return true for image/jpeg', () => {
      expect(utils.isFileExtensionJpeg(imgFile)).toBe(true)
    });

    it('should return false for pdf', () => {
      expect(utils.isFileExtensionJpeg(pdfFile)).toBe(false)
    });
  });

  describe('DDMStoDD function', () => {
    it('should return 0 for 0,0,0,N', () => {
      expect(utils.convertDMSToDD(0,0,0,'N')).toBe(0)
    });

    it('should return 10.11 for 10,6,36,N', () => {
      expect(utils.convertDMSToDD(10,6,36,'N')).toBe(10.11)
    });

    it('should return NaN for 10,6,NaN,N', () => {
      expect(utils.convertDMSToDD(10,6,NaN,'N')).toBe(NaN)
    });

    it('should return NaN for 10,6,undefined,N', () => {
      expect(utils.convertDMSToDD(10,6,undefined,'N')).toBe(NaN)
    });
  });

});

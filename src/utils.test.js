const utils = require('./utils')

const imgFile = {type: 'image/jpeg'}
const pdfFile = {type: 'pdf'}
const emptyFile = {}
const emptyGPSData = {}

describe('Utils functions', () => {
  describe('isFileExtensionJpeg function', () => {
    it('should return true for image/jpeg', () => {
      expect(utils.isFileExtensionJpeg(imgFile)).toBe(true)
    });

    it('should return false for pdf', () => {
      expect(utils.isFileExtensionJpeg(pdfFile)).toBe(false)
    });

    it('should return false for undefined', () => {
      expect(utils.isFileExtensionJpeg(emptyFile)).toBe(false)
    });
  });

  describe('DDMStoDD function', () => {
    it('should return 0 for 0,0,0,N', () => {
      expect(utils.convertDMSToDD(0,0,0,'N')).toBe(0)
    });

    it('should return 10.11 for 10,6,36,N', () => {
      expect(utils.convertDMSToDD(10,6,36,'N')).toBe(10.11)
    });

    it('should return -10.11 for 10,6,36,S', () => {
      expect(utils.convertDMSToDD(10,6,36,'S')).toBe(-10.11)
    });

    it('should return NaN for 10,6,NaN,N', () => {
      expect(utils.convertDMSToDD(10,6,NaN,'N')).toBe(NaN)
    });

    it('should return NaN for 10,6,undefined,N', () => {
      expect(utils.convertDMSToDD(10,6,undefined,'N')).toBe(NaN)
    });
  });

  describe('parseDMS function', () => {
    it('should return false for a file with no GPS data', () => {
      expect(utils.parseDMS(emptyGPSData)).toBe(false)
    });

    it('should return false for undefined GPSLatitude, GPSLongitude, and their Refs', () => {
      expect(utils.parseDMS(
        {GPSLatitude:undefined, GPSLatitudeRef:undefined, GPSLongitude: undefined, GPSLongitudeRef:undefined}
      )).toBe(false)
    });

    it('should return false for undefined GPSLatitude', () => {
      expect(utils.parseDMS(
        {GPSLatitude:undefined, GPSLatitudeRef:"N", GPSLongitude:[5,14,6], GPSLongitudeRef:"E"}
      )).toBe(false)
    });

    it('should return 0,0 for 0,0,0,N and 0,0,0,E', () => {
      expect(utils.parseDMS(
        {GPSLatitude:[0,0,0], GPSLatitudeRef:"N", GPSLongitude:[0,0,0], GPSLongitudeRef:"E"}
      )).toEqual({Latitude:0, Longitude:0, Position:"0,0"})
    });

    it('should return 10.11,5.235 for 10,6,36,N and 5,14,6,E', () => {
      expect(utils.parseDMS(
        {GPSLatitude:[10,6,36], GPSLatitudeRef:"N", GPSLongitude:[5,14,6], GPSLongitudeRef:"E"}
      )).toEqual({Latitude:10.11, Longitude:5.235, Position:"10.11,5.235"})
    });

    it('should return 10.11,-5.235 for 10,6,36,N and 5,14,6,W', () => {
      expect(utils.parseDMS(
        {GPSLatitude:[10,6,36], GPSLatitudeRef:"N", GPSLongitude:[5,14,6], GPSLongitudeRef:"W"}
      )).toEqual({Latitude:10.11, Longitude:-5.235, Position:"10.11,-5.235"})
    });

    it('should return -10.11,5.235 for 10,6,36,S and 5,14,6,E', () => {
      expect(utils.parseDMS(
        {GPSLatitude:[10,6,36], GPSLatitudeRef:"S", GPSLongitude:[5,14,6], GPSLongitudeRef:"E"}
      )).toEqual({Latitude:-10.11, Longitude:5.235, Position:"-10.11,5.235"})
    });

    it('should return -10.11,-5.235 for 10,6,36,S and 5,14,6,W', () => {
      expect(utils.parseDMS(
        {GPSLatitude:[10,6,36], GPSLatitudeRef:"S", GPSLongitude:[5,14,6], GPSLongitudeRef:"W"}
      )).toEqual({Latitude:-10.11, Longitude:-5.235, Position:"-10.11,-5.235"})
    });
  });

});

/**
* Get raw longitude and latitude data from a file's metadata
*/
function parseDMS (input) {
  if (input.GPSLatitude !== undefined && input.GPSLongitude !== undefined) {
    var lat = convertDMSToDD(input.GPSLatitude[0], input.GPSLatitude[1], input.GPSLatitude[2], input.GPSLatitudeRef)
    var lng = convertDMSToDD(input.GPSLongitude[0], input.GPSLongitude[1], input.GPSLongitude[2], input.GPSLongitudeRef)

    return {
      Latitude: lat,
      Longitude: lng,
      Position: lat + ',' + lng
    }
  } else {
    return false
  }

}

/**
* Convert a latitude longitude position from DMS(degrees, minutes, seconds) to
* DD(decimal degrees)
*/
function convertDMSToDD (degrees, minutes, seconds, direction) {
  var dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60)

  if (direction === 'S' || direction === 'W' || direction === 's' || direction === 'w') {
    dd = dd * -1
  } // Don't do anything for N or E
  return dd
}

/**
* Determine whether or not file is a jpeg
*/
function checkFileExtension (file) {
  if (file.type === 'image/jpeg') {
    return true
  } else {
    return false
  }
}

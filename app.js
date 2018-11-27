$(document).ready(function () {
  var progressBar = $('#progressBar')
  var file
  var database = firebase.database().ref()
  var incidentsRef = database.child('incidents')
  var storage = firebase.storage().ref()
  var photosRef = storage.child('photos')
  var incidentMarkers


  /**
  * Retrieve latitude, longitude, and datetime of photo from its exif data
  */
  function getExif (file, callback) {
    EXIF.getData(file, function () {
      var allMetaData = EXIF.getAllTags(this)
      var gpsInfo = parseDMS(allMetaData)
      if (gpsInfo) {
        var exifInfo = {
          latitude: gpsInfo.Latitude,
          longitude: gpsInfo.Longitude,
          dateTime: allMetaData.DateTime
        }
      } else {
        var exifInfo = false
      }

      callback(exifInfo)
    })
  };

  /**
  * Determine whether or not file is a jpeg
  */
  function checkFileExtension (file) {
    if (file.type === 'image/jpeg') {
      return true
    } else {
      return false
    }
  };

  /**
  * Have user confirm the file's info to be uploaded to firebase
  */
  function confirmDetails () {
    var fileButton = document.getElementById('fileButton')
    file = fileButton.files[0]
    EXIF.getData(file);

    if (checkFileExtension(file)) {
        getExif(file, function (exifData) {
          // Make sure file has exif data before proceding
          if (exifData) {
            file.dateTime = exifData.dateTime
            file.latitude = exifData.latitude
            file.longitude = exifData.longitude

            $('#fileNoGPSALert').hide()
            $('#uploadModal').modal('hide')
            $('#confirmDetailsModal').modal('show')

            // Add temporary marker to confirmMap Modal
            var marker = L.marker([file.latitude, file.longitude]).addTo(confirmMap)
            confirmMap.panTo(new L.LatLng(exifData.latitude, exifData.longitude))

            // Create filename for photo for storing/databasing
            fileName = exifData.dateTime.split(' ')[0] + '_' + exifData.dateTime.split(' ')[1] + '_' + exifData.latitude + '_' + exifData.longitude
            // Convert all '.'s to 'p's because they aren't allowed to be used in firebase names
            fileName = fileName.replace(/\./g, 'p')
          } else {
            $('#fileNoGPSALert').show()
          }
        })
    } else {
      $('#fileExtensionAlert').show()
    };
  };

  // Handle uploading of photo input
  $('#nextButton').click(function () {
    confirmDetails()
  })

  // Handle going back from confirmDetailsModal
  $('#backButton').click(function () {
    $('#confirmDetailsModal').modal('hide')
    $('#uploadModal').modal('show')
  })

  // Handle writing and saving photo to Firebase
  $('#saveButton').click(function () {
    if (typeof file !== 'undefined') {
      storage.child(`${fileName}`).put(file)
      incidentsRef.child(`${fileName}`).set({
        name: 'testname',
        dateTime: file.dateTime,
        latitude: file.latitude,
        longitude: file.longitude,
        licensePlate: document.getElementById('licensePlate').value,
        state: document.getElementById('stateSelector').value,
        comment: document.getElementById('pictureComment').value
      })
    }
    $('#confirmDetailsModal').modal('hide')
    $('#successfulUploadModal').modal('show')
    $('#fileButton').val('')
  })

  // Handle exiting successfulUploadModal
  $('#exitToMapButton').click(function () {
    $('#successfulUploadModal').modal('hide')
  })

  // Handle adding another claim from successfulUploadModal
  $('#anotherClaimButton').click(function () {
    $('#successfulUploadModal').modal('hide')
  })

  // Update leaflet markers from firebase in real time
  database.on('value', function(snapshot){
    // console.log(snapshot.child('incidents/').val());
    incidentMarkers = snapshot.child('incidents/').val();
    console.log(incidentMarkers)
    console.log(Object.keys(incidentMarkers).length)

    for (var i = 0; i < Object.keys(incidentMarkers).length; i++) {
			var marker = L.marker([incidentMarkers[Object.keys(incidentMarkers)[i]].latitude, incidentMarkers[Object.keys(incidentMarkers)[i]].longitude]).addTo(primaryMap);
		}
  })

})

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCs5jBiHX_nzPmzmOPlsA2lf9o6EdS9goo',
  authDomain: 'lane-claim.firebaseapp.com',
  databaseURL: 'https://lane-claim.firebaseio.com',
  projectId: 'lane-claim',
  storageBucket: 'lane-claim.appspot.com',
  messagingSenderId: '532354359258'
}

firebase.initializeApp(config)

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

  if (direction === 'S' || direction === 'W') {
    dd = dd * -1
  } // Don't do anything for N or E
  return dd
}

var primaryMap = L.map('primaryMap').setView([0, 0], 2)
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYWJhY2hhbnQiLCJhIjoiY2podmE4NGZlMDM5bjNwbWRhdTVmZGk0eiJ9.jZ_IKv4_49wLhqwuSlqvHA'
}).addTo(primaryMap)

var confirmMap = L.map('confirmMap').setView([0, 0], 20)
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYWJhY2hhbnQiLCJhIjoiY2podmE4NGZlMDM5bjNwbWRhdTVmZGk0eiJ9.jZ_IKv4_49wLhqwuSlqvHA'
}).addTo(confirmMap)

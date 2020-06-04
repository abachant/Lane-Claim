/* global $, firebase, EXIF, L */

$(document).ready(function () {
  var file
  var database = firebase.database().ref()
  var incidentsRef = database.child('incidents')
  var storage = firebase.storage().ref()
  var incidentMarkers


  /**
  * Retrieve latitude, longitude, and datetime of photo from its exif data
  */
  function getExif (file, callback) {
    EXIF.getData(file, function () {
      var allMetaData = EXIF.getAllTags(this)
      var gpsInfo = parseDMS(allMetaData)
      var exifInfo = false
      if (gpsInfo) {
        exifInfo = {
          latitude: gpsInfo.Latitude,
          longitude: gpsInfo.Longitude,
          dateTime: allMetaData.DateTime
        }
      }

      callback(exifInfo)
    })
  }

  /**
  * Have user confirm the file's info to be uploaded to firebase
  */
  function confirmDetails () {
    var fileButton = document.getElementById('fileButton')
    file = fileButton.files[0]
    if (file != undefined){
      EXIF.getData(file);
      $('#noFileAlert').hide()
      if (isFileExtensionJpeg(file)) {
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
              L.marker([file.latitude, file.longitude]).addTo(confirmMap)
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
      }
    } else {
      $('#noFileAlert').show()
    }
  }

  // Handle new claim submittal
  $('.newClaimButton').click( () => {
    $('#fileButton').val('')
    $('#fileNoGPSALert').hide()
    $('#fileExtensionAlert').hide()
    $('#noFileAlert').hide()
    $('#uploadModal').modal('show')
    $('#aboutModal').modal('hide')
    $('#successfulUploadModal').modal('hide')
  })

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
      storage.child(`${fileName}`).getDownloadURL().then(function(url) {
        // `url` is the download URL for 'storage.child(fileName).jpg'
        var downloadURL = url
        incidentsRef.child(`${fileName}`).set({
          name: fileName,
          imgDownloadURL: downloadURL,
          dateTime: file.dateTime,
          latitude: file.latitude,
          longitude: file.longitude,
          licensePlate: document.getElementById('licensePlate').value,
          state: document.getElementById('stateSelector').value,
          comment: document.getElementById('pictureComment').value
        })
      }).catch(function(error) {
        console.error(error)
      })
    }
    $('#confirmDetailsModal').modal('hide')
    $('#successfulUploadModal').modal('show')
    $('#fileButton').val('')
  })

  // Handle exiting a modal
  $('.exitToMapButton').click(function () {
    $('#successfulUploadModal').modal('hide')
    $('#aboutModal').modal('hide')
    $('#uploadModal').modal('hide')
  })

  // Handle showing aboutModal
  $('#aboutButton').click(function () {
    $('#aboutModal').modal('show')
  })

  // Update leaflet markers from firebase in real time
  database.on('value', function(snapshot){
    incidentMarkers = snapshot.child('incidents/').val();
    $('#reportTable').html(
      `<tr>
        <th>Datetime</th>
        <th>Location</th>
        <th>License Plate</th>
        <th>State</th>
      </tr>`)

    for (var i = 0; i < Object.keys(incidentMarkers).length; i++) {
      console.log(Object.keys(incidentMarkers)[i])

      // Create table entry for each incident
      $('#reportTable').append(
        `<tr>
          <td>${incidentMarkers[Object.keys(incidentMarkers)[i]].dateTime}</td>
          <td>${incidentMarkers[Object.keys(incidentMarkers)[i]].latitude}, ${incidentMarkers[Object.keys(incidentMarkers)[i]].longitude}</td>
          <td>${incidentMarkers[Object.keys(incidentMarkers)[i]].licensePlate}</td>
          <td>${incidentMarkers[Object.keys(incidentMarkers)[i]].state}</td>
        </tr>`)

      // Create marker for each incident and add it to primaryMap
			var marker = L.marker([incidentMarkers[Object.keys(incidentMarkers)[i]].latitude, incidentMarkers[Object.keys(incidentMarkers)[i]].longitude]).addTo(primaryMap);
      // Create popup of associated info for each incident
      marker.bindPopup(
        `<div class="markerPopup">
          <img src="${incidentMarkers[Object.keys(incidentMarkers)[i]].imgDownloadURL}" alt="Photo of parking incident" class="markerIncidentPhoto">
          <p>License Plate: ${incidentMarkers[Object.keys(incidentMarkers)[i]].licensePlate}</p>
          <p>License State: ${incidentMarkers[Object.keys(incidentMarkers)[i]].state}</p>
          <p>Comment: ${incidentMarkers[Object.keys(incidentMarkers)[i]].comment}</p>
        </div>`
      )
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


const leafletConfig = {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYWJhY2hhbnQiLCJhIjoiY2podmE4NGZlMDM5bjNwbWRhdTVmZGk0eiJ9.jZ_IKv4_49wLhqwuSlqvHA'
};

var primaryMap = L.map('primaryMap').setView([39.8283, -98.5795], 5)
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', leafletConfig).addTo(primaryMap)

primaryMap.locate({setView: true, maxZoom: 15});

var confirmMap = L.map('confirmMap').setView([0, 0], 20)
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', leafletConfig).addTo(confirmMap)
$(document).ready(function() {
  var progressBar = $("#progressBar");
  var file;

  function getExif(file, callback) {
    EXIF.getData(file, function() {
      var allMetaData = EXIF.getAllTags(this);
      var gpsInfo = parseDMS(allMetaData);
      var exifInfo = {
        latitude: gpsInfo.Latitude,
        longitude: gpsInfo.Longitude,
        dateTime: allMetaData.DateTime
      };

      callback(exifInfo);
    });
  };

  function confirmDetails() {
    var fileButton = document.getElementById('fileButton');
    file = fileButton.files[0];

    if (file) {
      getExif(file, function(exifData) {
        $('#uploadModal').modal('hide');
        $('#confirmDetailsModal').modal('show');

        file.dateTime = exifData.dateTime;
        file.latitude = exifData.latitude;
        file.longitude = exifData.longitude;

        // Add temporary marker to confirmMap Modal
        var marker = L.marker([file.latitude, file.longitude]).addTo(confirmMap);
        confirmMap.panTo(new L.LatLng(exifData.latitude, exifData.longitude));

        // Create filename for photo for storing/databasing
        fileName = exifData.dateTime.split(' ')[0] + '_' + exifData.dateTime.split(' ')[1] + '_' + exifData.latitude + '_' + exifData.longitude;
        fileName = fileName.replace(/\./g,'p');
      });
    };
  };

  // Handle uploading of photo input
  $('#nextButton').click(function() {
    confirmDetails();
  });

  $('#backButton').click(function() {
    $('#confirmDetailsModal').modal('hide');
    $('#uploadModal').modal('show');
  });

  // Handle writing and saving photo to Firebase
  $('#saveButton').click(function() {
    var storageRef = firebase.storage().ref(`photos/${fileName}`);
    if (typeof file !== "undefined") {
      storageRef.put(file);
      firebase.database().ref(`incidents/${fileName}`).set({
        name: 'testname',
        dateTime: file.dateTime,
        latitude: file.latitude,
        longitude: file.longitude,
        licensePlate: document.getElementById('licensePlate').value,
        state: document.getElementById('stateSelector').value,
        comment: document.getElementById('pictureComment').value
      });
    }
    $('#confirmDetailsModal').modal('hide');
    $('#progressModal').modal('show');
  });
});


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCs5jBiHX_nzPmzmOPlsA2lf9o6EdS9goo",
    authDomain: "lane-claim.firebaseapp.com",
    databaseURL: "https://lane-claim.firebaseio.com",
    projectId: "lane-claim",
    storageBucket: "lane-claim.appspot.com",
    messagingSenderId: "532354359258"
};
firebase.initializeApp(config);


function parseDMS(input) {
    var lat = convertDMSToDD(input.GPSLatitude[0], input.GPSLatitude[1], input.GPSLatitude[2], input.GPSLatitudeRef);
    var lng = convertDMSToDD(input.GPSLongitude[0], input.GPSLongitude[1], input.GPSLongitude[2], input.GPSLongitudeRef);

    return {
        Latitude : lat,
        Longitude: lng,
        Position : lat + ',' + lng
    }
}

function convertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}


var primaryMap = L.map('primaryMap').setView([0, 0], 2);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYWJhY2hhbnQiLCJhIjoiY2podmE4NGZlMDM5bjNwbWRhdTVmZGk0eiJ9.jZ_IKv4_49wLhqwuSlqvHA'
}).addTo(primaryMap);


var confirmMap = L.map('confirmMap').setView([0, 0], 20);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYWJhY2hhbnQiLCJhIjoiY2podmE4NGZlMDM5bjNwbWRhdTVmZGk0eiJ9.jZ_IKv4_49wLhqwuSlqvHA'
}).addTo(confirmMap);

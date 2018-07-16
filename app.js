$(document).ready(function() {
  var progressBar = $("#progressBar");

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
    var file = fileButton.files[0];

    if (file) {
      getExif(file, function(exifData) {
        $('#uploadModal').modal('hide');
        $('#confirmDetailsModal').modal('show');

        console.log(exifData.dateTime);
        $('#photoDate').val(exifData.dateTime);
        var marker = L.marker([exifData.latitude, exifData.longitude]).addTo(confirmMap);
        confirmMap.panTo(new L.LatLng(exifData.latitude, exifData.longitude));

        // Create filename for photo for storing/databasing
        var fileName = exifData.dateTime.split(' ')[0] + '_' + exifData.dateTime.split(' ')[1] + '_' + exifData.latitude + '_' + exifData.longitude;
        console.log(fileName);
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


//   add following code to 'enter' when details are correct
//   var storageRef = firebase.storage().ref('photos/' + file.name);
//
//   var task = storageRef.put(file);
//
//   task.on('state_changed',
//     function progress(snapshot) {
//       var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       uploader.value = percentage;
//     },
//
//     function error(err) {
//
//     },
//
//     function complete() {
//
//     }
//   )});
//
// function printPic() {
//   var allMetaDataSpan = document.getElementById("allMetaDataSpan");
//   allMetaDataSpan.innerHTML = "fuuuuug";
// };

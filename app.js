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

// window.onload=getExif;

var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');


// Handle uploading of photo input
fileButton.addEventListener('change', getExif());

function getExif() {
  var file = document.getElementById('fileButton').files[0];
  EXIF.getData(file, function() {
      var allMetaData = EXIF.getAllTags(this);
      // var allMetaDataSpan = document.getElementById("allMetaDataSpan");
      // allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
      // console.log(ConvertDMSToDD(allMetaData.GPSLongitude[0], allMetaData.GPSLongitude[1],allMetaData.GPSLongitude[2], ))
      var gpsInfo = ParseDMS(allMetaData);
      document.getElementById("latitude").value = gpsInfo.Latitude;
      document.getElementById("longitude").value = gpsInfo.Longitude;
  });
};

function ParseDMS(input) {
    var lat = ConvertDMSToDD(input.GPSLatitude[0], input.GPSLatitude[1], input.GPSLatitude[2], input.GPSLatitudeRef);
    var lng = ConvertDMSToDD(input.GPSLongitude[0], input.GPSLongitude[1], input.GPSLongitude[2], input.GPSLongitudeRef);

    return {
        Latitude : lat,
        Longitude: lng,
        Position : lat + ',' + lng
    }
}


function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}





  // add following code to 'enter' when details are correct
  // var storageRef = firebase.storage().ref('photos/' + file.name);
  //
  // var task = storageRef.put(file);

  // task.on('state_changed',
  //   function progress(snapshot) {
  //     var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     uploader.value = percentage;
  //   },
  //
  //   function error(err) {
  //
  //   },
  //
  //   function complete() {
  //
  //   }
  // )});

// function printPic() {
//   var allMetaDataSpan = document.getElementById("allMetaDataSpan");
//   allMetaDataSpan.innerHTML = "fuuuuug";
// };

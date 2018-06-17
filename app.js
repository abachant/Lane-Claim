$( document ).ready(function() {
  var progressBar = $("#progressBar");
  var fileButton = $("#fileButton");

  /*
  function getExif() {
    var file = fileButton.files[0];
    EXIF.getData(file, function() {
        var allMetaData = EXIF.getAllTags(this);
        // var allMetaDataSpan = document.getElementById("allMetaDataSpan");
        // allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
        // console.log(ConvertDMSToDD(allMetaData.GPSLongitude[0], allMetaData.GPSLongitude[1],allMetaData.GPSLongitude[2], ))
        var gpsInfo = ParseDMS(allMetaData);
        $("#latitude").value = gpsInfo.Latitude;
        $("#longitude").value = gpsInfo.Longitude;
    });
  };

  // Handle uploading of photo input
  fileButton.addEventListener('change', getExif());
  */
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

// window.onload=getExif;


function parseDMS(input) {
    var lat = ConvertDMSToDD(input.GPSLatitude[0], input.GPSLatitude[1], input.GPSLatitude[2], input.GPSLatitudeRef);
    var lng = ConvertDMSToDD(input.GPSLongitude[0], input.GPSLongitude[1], input.GPSLongitude[2], input.GPSLongitudeRef);

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

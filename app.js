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
fileButton.addEventListener('change', getExif();

function getExif() {
  var file = document.getElementById('fileButton').files[0];
  EXIF.getData(file, function() {
      var allMetaData = EXIF.getAllTags(this);
      var allMetaDataSpan = document.getElementById("allMetaDataSpan");
      allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
  });
};



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

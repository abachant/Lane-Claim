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

var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');

fileButton.addEventListener('change', function(e) {

  var file = e.target.files[0];

  var storageRef = firebase.storage().ref('photos/' + file.name);

  var task = storageRef.put(file);

  task.on('state_changed',
    function progress(snapshot) {
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploader.value = percentage;
    },

    function error(err) {

    },

    function complete() {

    }
  )
});

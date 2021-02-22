
var bounding = " ";

//Calls DetectFaces API and shows estimated ages of detected faces
function DetectFaces(imageData) {
  AWS.region = regionAWS;
  var rekognition = new AWS.Rekognition();
  var params = {
    Image: { /* required */
      Bytes: imageData
    }
  };





  rekognition.detectLabels(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      

     
      var table = "<div style='overflow:auto;'><table class='table-bordered table-striped justify-content-center' ><tr> \
      <th>HashTags</th><th>Confiabilidad</th> \
      </tr>";
      // Sacando datos ira
      table += "<tr><td  rowspan='2' class='personas'>" ;
      for (var i = 0; i < data.Labels.length; i++) {
        
        table += '#'+ data.Labels[i].Name.replace(' ','') +'<br>'


      }
      table += "</td><td>" ;
      for (var i = 0; i < data.Labels.length; i++) {
        
        table += Math.round(data.Labels[i].Confidence) +'<br>'
      }
      table += "</td></tr></table> </div>";
      document.getElementById("opResult").innerHTML = table;
      document.getElementById("cajas").innerHTML = bounding;
      

    }               
  });
}
//Loads selected image and unencodes image bytes for Rekognition DetectFaces API
function ProcessImage() {
  AnonLog();
  var control = document.getElementById("fileToUpload");
  var file = control.files[0];

  // Load base64 encoded image 
  var reader = new FileReader();
  reader.onload = (function (theFile) {
    return function (e) {
      var img = document.createElement('img');
      var image = null;
      img.src = e.target.result;
      var jpg = true;
      try {
        image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);

      } catch (e) {
        jpg = false;
      }
      if (jpg == false) {
        try {
          image = atob(e.target.result.split("data:image/png;base64,")[1]);
        } catch (e) {
          alert("Not an image file Rekognition can process");
          return;
        }
      }
      //unencode image bytes for Rekognition DetectFaces API 
      var length = image.length;
      imageBytes = new ArrayBuffer(length);
      var ua = new Uint8Array(imageBytes);
      for (var i = 0; i < length; i++) {
        ua[i] = image.charCodeAt(i);
      }
      //Call Rekognition  
      DetectFaces(imageBytes);
    };
  })(file);
  reader.readAsDataURL(file);
}
//Provides anonymous log on to AWS services
function AnonLog() {

  // Configure the credentials provider to use your identity pool
  AWS.config.region = regionAWS; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: poolidAWS,
  });
  // Make the call to obtain credentials
  AWS.config.credentials.get(function () {
    // Credentials will be available when this function is called.
    var accessKeyId = AWS.config.credentials.accessKeyId;
    var secretAccessKey = AWS.config.credentials.secretAccessKey;
    var sessionToken = AWS.config.credentials.sessionToken;
  });
}











  
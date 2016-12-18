(function() {
	"use strict";

   // gets users data (username, bio, follower counts, media, id, full name, profile pic)
   // function get_data() {
   //    $.ajax ({  
   //       type: "GET",
   //       dataType: "jsonp",
   //       cache: false,
   //       url: "https://api.instagram.com/v1/users/self/?access_token=" + access_token,
   //       success: function(data) {
   //                                                           // EVERYTHING WORKS UP UNTIL HERE
   //          var data_P = JSON.parse(data.responseText);
   //          console.log(data_P);
           
   //       }
   //    });
   // }

   var access_token = window.location.href.split("=")[1]; // 
   console.log(access_token);

   window.onload = function() {
      // gets a users access token, stores to access_token      
      document.getElementById("search").onclick = get_data;
   };

   function get_data() {
      var request = new XMLHttpRequest();
      request.onload = fetchInfo;
      request.open("GET", "https://api.instagram.com/v1/users/self/?access_token=" + access_token, 
               true);
      request.send();
   }

   function fetchInfo() {
      var data = JSON.parse(this.responseText);
      console.log("hello");
   }
})();
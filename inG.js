(function() {
   "use strict";

   window.onload = function() {
      document.getElementById("loadUser").onclick = getUserData;
      document.getElementById("loadMedia").onclick = getMedia1;
      document.getElementById("showRecent").onclick = showRecent;
   };

   // gets a users access token, stores to access_token      
   var access_token = window.location.href.split("=")[1];

   if (access_token != null) {
      console.log("Authentication complete");  
      console.log(access_token); // for debugging
   }

   // get recent media, only want this to run once
   var hasRun = false;

   // 2D array stores media data (link, likes, image or video, lowres.url)
   var media = [];
   
   // number of recent/top photos to display. User can change
   var recent = 5;
   var top = 3;

   // gets users data (username, bio, follower counts, media, id, full name, profile pic)
   function getUserData() {
      $.ajax ({  
         type: "GET",
         dataType: "jsonp",
         cache: false,
         url: "https://api.instagram.com/v1/users/self/?access_token=" + access_token,
         success: function(data) {
            console.log("sucessfully retrived user data");
            $('#name').text(data.data.username);
            $('#bio').text(data.data.bio);
            $('#realName').text(data.data.full_name);
            $("#pic").append("<div'><img src='" + data.data.profile_picture + "'></img></a></div>");
            document.getElementById("loadUser").style.display = 'none';
         }
      });
      return null;
   }
   
   // having issues with variable scopes
   function getMedia1() {
      media = getMedia();
      return null;
   } 

   // gets all photos from user, creates 2D array of media (link, likes, image or video, lowres.url)
   function getMedia() {
      if (!hasRun) {
         $.ajax ({  
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: "https://api.instagram.com/v1/users/self/media/recent/?access_token=" + access_token,
            success: function(data) {
               console.log("sucessfully retrived media");
               var totalLength = data.data.length;
               for (var i = 0; i < totalLength; i++) {
                  if (data.data[i].type === "video") {
                     media.push([data.data[i].link, data.data[i].likes["count"], "video", data.data[i].videos.low_resolution.url]);                 
                  } else { 
                     media.push([data.data[i].link, data.data[i].likes["count"], "image", data.data[i].images.low_resolution.url]);
                  }
               }
               // console.log(media); // debugging, everything is fine up to here
            }
         });
      }
      hasRun = true;
      return media;

   }
   
   // displays recent photos
   function showRecent() {
      // console.log(media); IT FINALLY WORKED OMG
      
      for (var i = 0; i < recent; i++) {
         if (media[i][2] === "video") {
            $("#recentpics").append("<div class='media'><a target='_blank' href='" + media[i][0] + "'><video controls loop autoplay class='media' src='" + media[i][3] + "'></video></a></div>");
         } else { 
            $("#recentpics").append("<div class='media'><a target='_blank' href='" + media[i][0] + "'><img src='" + media[i][3] + "'></img></a></div>");
         }
      }
      
   }
   
   // displays top photos
   function showTop() {
      // create new 2D array with index # and likes
      var items = []
      for (int i = 0; i < media.length; i++) {
         items[i][0] = i;
         items[i][1] = media[i][1];
      }
      console.log(items);

      // sort array by likes
      items.sort(function(first, second) {
          return second[1] - first[1];
      });
      console.log(items);

      items = items.slice(0, top);

      console.log("Top photo processing complete" + items);

      for (var i = 0; i < items.length; i++) {
         var index = items[i][0];
         if (media[index][2] === "video") {
            $("#topphoto").append("<div class='media'><a target='_blank' href='" + media[index][0] + "'><video controls loop autoplay class='media' src='" + media[index][3] + "'></video></a></div>");
         } else { 
            $("#topphoto").append("<div class='media'><a target='_blank' href='" + media[index][0] + "'><img src='" + media[index][3] + "'></img></a></div>");
         }
      }
   }
   
   // gets all users followers
   function getFollowers() {
      $.ajax ({  
         type: "GET",
         dataType: "jsonp",
         cache: false,
         url: "https://api.instagram.com/v1/users/self/followed-by?access_token=" + access_token,
         success: function(data) {
            console.log("sucessfully retrived followers");
            //$('#follower').text(data.data.username);
         }
      });
      return null;
   }


      /*
   // gets all photos from user, shows recent and top photos
   function getMedia() {
      if (!hasRun) {
         $.ajax ({  
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: "https://api.instagram.com/v1/users/self/media/recent/?access_token=" + access_token,
            success: function(data) {
               console.log("sucessfully retrived media");
               var totalLength = data.data.length;
               var dict = {};
               var recent = 5;
               var top = 3;
               // inserts photo index and #likes into a map, displays recent and top
               for (var i = 0; i < totalLength; i++) {
                  dict[i] = data.data[i].likes["count"];
                  if (i < recent) {
                     if (data.data[i].type === "video") {
                        $("#recentpics").append("<div class='media'><a target='_blank' href='" + data.data[i].link + "'><video controls loop autoplay class='media' src='" + data.data[i].videos.low_resolution.url + "'></video></a></div>");
                     } else { 
                        $("#recentpics").append("<div class='media'><a target='_blank' href='" + data.data[i].link + "'><img src='" + data.data[i].images.low_resolution.url + "'></img></a></div>");
                     }
                  }
               }
               // Create items array, sort, slice top three
               var items = Object.keys(dict).map(function(key) {
                   return [key, dict[key]];
               });

               items.sort(function(first, second) {
                   return second[1] - first[1];
               });

               items = items.slice(0, top);

               console.log("Top photo processing complete" + items);

               for (var i = 0; i < items.length; i++) {
                  var index = items[i][0];
                  if (data.data[index].type === "video") {
                     $("#topphoto").append("<div class='media'><a target='_blank' href='" + data.data[index].link + "'><video controls loop autoplay class='media' src='" + data.data[index].videos.low_resolution.url + "'></video></a></div>");
                  } else { 
                     $("#topphoto").append("<div class='media'><a target='_blank' href='" + data.data[index].link + "'><img src='" + data.data[index].images.low_resolution.url + "'></img></a></div>");
                  }
               }
               document.getElementById("loadMedia").style.display = 'none';
               document.getElementById("recent").innerHTML = "Recent Photos";
               document.getElementById("top").innerHTML = "Top " + top + " Photos";
            }
         });
      }
      hasRun = true;
      return null;

   }
   */

})();

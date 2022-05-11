$(document).ready(function() {
  function buildRequest(steam_interface,method,query) {
    // let url = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=440&count=3`
    let url = `https://api.steampowered.com/${steam_interface}/${method}/v2/?${query}`

    return url;
  }

  $.ajax({
    url: 'http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=50',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    type: "GET",
    dataType: "jsonp",
    data: {
    },
    success: function (result) {
      console.log(result);
    },
    error: function () {
      console.log("error");
    }
  });


})

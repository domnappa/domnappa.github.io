let notifier = new AWN({
  "position": "bottom-right"
});

$(document).ready(function() {
  let api_key = "9dad23fcdbe30ae17ead09ad9fa3cc40";
  let shorthand_days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  let longhand_days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

  let today = new Date();
  let geolocation_enabled = 'geolocation' in navigator;

  function findNth(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }

  function generateFutureForecast(position) {
    let request_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${api_key}&units=metric&exclude=current,hourly,minutely`;

    $.get(request_url, function(data) {
      let $forecast_container = $('.future');

      for(let i=1;i<6;i++) {
        let daily_data = data.daily[i];
        let name_of_day = shorthand_days[today.getDay()+i];
        console.log(daily_data);
        let html_output = `
        <div class="day-container">
          <div class="daily-date">${name_of_day}</div>
          <div class="weather-details">
            <img src="http://openweathermap.org/img/wn/${daily_data.weather[0].icon}@2x.png" />
            <div class="weather-desc">${daily_data.weather[0].description}</div>
          </div>
          <div class="cloud-coverage">${daily_data.clouds}%</div>
          <div class="temperature">
            <div class="min-temp">${Math.round(daily_data.temp.min)}°</div>
            <div class="max-temp">${Math.round(daily_data.temp.max)}°</div>
            <div class="humitidy">${daily_data.humidity}%</div>
          </div>
        </div>`;

        $forecast_container.append(html_output);
      }

      $forecast_container.addClass('shown');
    });
  }

  function initGeolocationData(position) {
    let request_url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${api_key}&units=metric`;
    $.get(request_url, function(data) {
      parseTodaysData(data);
      generateFutureForecast(position);
    });

  }

  function parseTodaysData(data) {
    console.log(data);
    let $today_container = $('.today');
    $today_container.empty();
    $('.no-content').removeClass('shown');
    let date_arr = today.toDateString().split(' ');

    let html_output = `
    <div class="day" style="display:none;">${longhand_days[today.getDay()] + ', ' + date_arr[1] + ' ' + date_arr[2] + findNth(today.getDate())}</div>
    <div class="location">${data.name}, ${regionNames.of(data.sys.country)}</div>
    <div class="cloud-coverage">Cloud Coverage: ${data.clouds.all}%</div>
    <div class="humitidy">Humidity: ${data.main.humidity}%</div>
    <div class="temperature">
      <div class="min-temp">${Math.round(data.main.temp_min)}°</div>
      <div class="current-temp">
        <div class="weather-icon"><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" /></div>
        <span class="temp">${Math.round(data.main.temp)}°</span>
      </div>
      <div class="max-temp">${Math.round(data.main.temp_max)}°</div>
    </div>
    <div class="weather-meta text-center">${data.weather[0].description}</div>`;

      $today_container.append(html_output);
  }

  function initInputLocationDate(location) {
    let city, country, request_url;
    if(location.includes(",")) {
      city = location.split(",")[0];
      country = location.split(",")[1];
      request_url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${api_key}&units=metric`;
    } else {
      request_url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${api_key}&units=metric`;
    }

    $.get(request_url, function(data) {
      parseTodaysData(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      notifier.alert(jqXHR.responseJSON.message);
    });
  }

  if(geolocation_enabled) {
    navigator.geolocation.getCurrentPosition(initGeolocationData)
  }

  $(".location-input input").on('keyup', function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        initInputLocationDate($(this).val());
      }
  });

})

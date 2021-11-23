$(document).ready(function() {
  let api_key = "9dad23fcdbe30ae17ead09ad9fa3cc40";
  let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
  let today = new Date();
  //let request_url = `https://api.openweathermap.org/data/2.5/weather?q=Brisbane,au&APPID=${api_key}`;
  let geolocation_enabled = 'geolocation' in navigator;

  function generateFutureForecast(position) {
    let request_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${api_key}&units=metric&exclude=current,hourly,minutely`;

    $.get(request_url, function(data) {
      let $forecast_container = $('.future');

      for(let i=1;i<6;i++) {
        let daily_data = data.daily[i];
        let name_of_day = days[today.getDay()+i];
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
    });
  }

  function initGeolocationData(position) {
    let request_url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${api_key}&units=metric`;
    $.get(request_url, function(data) {
      let $today_container = $('.today');

      let html_output = `
      <div class="day">${days[today.getDay()]}</div>
      <div class="cloud-coverage">${data.clouds.all}%</div>
      <div class="temperature">
        <div class="current-temp">${Math.round(data.main.temp)}°</div>
        <div class="min-temp">${Math.round(data.main.temp_min)}°</div>
        <div class="max-temp">${Math.round(data.main.temp_max)}°</div>
        <div class="humitidy">${data.main.humidity}%</div>
      </div>`;

        $today_container.append(html_output);

        generateFutureForecast(position);
    });

  }

  if(geolocation_enabled) {
    navigator.geolocation.getCurrentPosition(initGeolocationData)
  }

})

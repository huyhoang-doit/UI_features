var search = document.querySelector(".search");
var city = document.querySelector(".city");
var country = document.querySelector(".country");
var time = document.querySelector(".time");
var content = document.querySelector(".content");
var value = document.querySelector(".value");
var shortDesc = document.querySelector(".short-desc");
var visibility = document.querySelector(".visibility span");
var wind = document.querySelector(".wind span");
var sun = document.querySelector(".sun span");
var body = document.querySelector("body");

async function changeWeatherUI(locationSearch) {
  var location = locationSearch.trim();
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1c74b553eeedfd71338c5ddbc364e5ca`;
  var data = await fetch(apiURL).then((res) => res.json());
  if (data.cod == 200) {
    content.classList.remove("hide");

    city.innerText = data.name + ", ";
    country.innerText = data.sys.country;
    visibility.innerText = data.visibility + "(m)";
    wind.innerText = data.wind.speed + "(m/s)";
    sun.innerText = data.main.humidity + "(%)";
    shortDesc.innerText = data.weather[0] ? data.weather[0].main : "";
    time.innerText = new Date().toLocaleString("vi");
    var temp = data.main.temp - 272.15;
    value.innerText = Math.round(temp);
    if (temp <= 19) {
      body.setAttribute("class", "cold");
    } else if (temp > 19 && temp <= 22) {
      body.setAttribute("class", "cool");
    } else if (temp > 22 && temp <= 26) {
      body.setAttribute("class", "warm");
    } else if (temp > 26) {
      body.setAttribute("class", "hot");
    }
  } else {
    content.classList.add("hide");
  }
}

search.addEventListener("keydown", function (event) {
  if (event.code === "Enter") {
    changeWeatherUI(search.value.trim());
  }
});

changeWeatherUI("Ha Noi");

async function get_api_photo(max_sol, recursion = 0) {
  max_sol = await max_sol
  const url = getURL(max_sol);
  const response = await fetch(url);
  const data = await response.json();
  let photos = data["photos"];
  if (photos.length == 0 && recursion < 7) {
    get_api_photo(new Promise(resolve => resolve(max_sol - 1)), recursion + 1);
  }
  if (photos.length != 0){
    let image = photos[0];
    document.getElementById("image").src = image["img_src"];
    document.getElementById("caption").innerHTML = "Curiosity Rover Front Hazard Camera " + image["earth_date"];
  }
}

async function get_api_weather(url, sol) {
  const response = await fetch(url);
  const data = await response.json();
  const sol_ids = ["sol1", "sol2", "sol3", "sol4", "sol5", "sol6", "sol7"];
  let update_sol = sol_ids.indexOf(sol);
  for (let i = 0; i < 7; i++) {
    let sol = data["soles"][i];
    document.getElementById(sol_ids[i]).children[0].innerHTML = new String("Sol " + sol["sol"] + ": High: " + sol["max_temp"] + " °C,  Low: " + sol["min_temp"] + " °C");
  }
  update_more_info(data["soles"][update_sol]);
}

function update_more_info(solJSON) {
  const sol_header = document.getElementById("sol_header");
  const earth_date = document.getElementById("earth_date");
  const low = document.getElementById("low");
  const high = document.getElementById("high");
  const sunrise = document.getElementById("sunrise");
  const sunset = document.getElementById("sunset");
  const ground_temp = document.getElementById("ground_temp");
  const pressure = document.getElementById("pressure");

  sol_header.innerHTML = String("Sol " + solJSON["sol"] + ":");
  earth_date.innerHTML = String("Earth Date: " + solJSON["terrestrial_date"]);
  low.innerHTML = String("Low " + solJSON["min_temp"] + " °C");
  high.innerHTML = String("High: " + solJSON["max_temp"] + " °C");
  sunrise.innerHTML = String("Sunrise: " + solJSON["sunrise"]);
  sunset.innerHTML = String("Sunset: " + solJSON["sunset"]);
  let average_gts_temp = (parseFloat(solJSON["min_gts_temp"]) + parseFloat(solJSON["min_gts_temp"])) / 2;
  ground_temp.innerHTML = String("Average Ground Temperature: " + average_gts_temp + " °C");
  pressure.innerHTML = String("Pressure: " + solJSON["pressure"] + " Pa")
}

function getURL(sol = 1000, camera = "fhaz", key = "eu0Ae7poIwaSyzaO9knb6nbaNeyKJCyiROswlg8z") {
  return String("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=" + sol + "&camera=" + camera + "&api_key=" + key);
}

async function getMaxSol() {
  const response = await fetch(getURL());
  const data = await response.json();
  return data["photos"][0]["rover"]["max_sol"];
}
//{"id","terrestrial_date","sol","ls","season","min_temp","max_temp","pressure","pressure_string","abs_humidity","wind_speed","wind_direction","atmo_opacity","sunrise","sunset","local_uv_irradiance_index","min_gts_temp","max_gts_temp"}

get_api_photo(getMaxSol());

function select(sol) {
  let buttons = document.getElementsByClassName("sol");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.borderLeft = "";
  }
  document.getElementById(sol).style.borderLeft = "2px solid var(--action-color)";
  get_api_weather("https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json", sol);
}

select("sol1");
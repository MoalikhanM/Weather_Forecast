let forecast = {
  //apiKey can be received in https://home.openweathermap.org/api_keys -> copy and paste here
    //apiKey: "47bbf70b5aeb7eebf48a4215dc3ee692",
  City: function (city) {
    fetch(
      //"http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey
    ).then((response) => {
        if (!response.ok) {
          alert("No city found");
        }
        return response.json();
      }).then((data) => this.display(data));
  },
  display: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    

    document.querySelector(".city").innerText = "The Weather in " + name;

    let now = new Date();
    let date = document.querySelector('.date');
    date.innerText = dateBuilder(now);

    document.querySelector(".description").innerText = description;

    document.querySelector(".temp").innerText = temp + "°C";

    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";

    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";

    //icons to show the state of the weather
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";

    //always change background according to city name
    document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";

    document.querySelector(".weather").classList.remove("loading");
  },

  
  search: function () {
    this.City(document.querySelector(".search-bar").value);
  },
};

function dateBuilder (DateInput) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[DateInput.getDay()];
  let date = DateInput.getDate();
  let month = months[DateInput.getMonth()];
  let year = DateInput.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

document.querySelector(".search button").addEventListener("click", function() {
  forecast.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
      forecast.search();
    }
  });


const detectlocation = document.querySelector("button.detectlocation");
detectlocation.addEventListener("click", ()=>{
    if(navigator.geolocation){
      detectlocation.innerText = "Allow to detect location";
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
      detectlocation.innerText = "Did not support";
    }
});


function onSuccess(position){
  detectlocation.innerText = "Detecting location";
    let {latitude, longitude} = position.coords;
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=c3810003df4e40bc9d9284ce87ca2d31`)
    .then(response => response.json()).then(response =>{
        let allDetails = response.results[0].components;
        console.table(allDetails);
        let {county, country} = allDetails;
        detectlocation.innerText = `${county}, ${country}`;
    }).catch(()=>{
      detectlocation.innerText = "Went wrong";
    });
}


function onError(error){
    if(error.code == 1){
      detectlocation.innerText = "Denied the request";
    }else if(error.code == 2){
      detectlocation.innerText = "Location is unavailable";
    }else{
      detectlocation.innerText = "Went wrong";
    }
    detectlocation.setAttribute("disabled", "true");
}

/*
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(curLoc, errLoc);
    }
}
function curLoc(loc){
    latt = loc.coords.latitude;
    long = loc.coords.longitude;
    var lattlong = new google.maps.LatLng(latt, long);
    var Options = {
        zoom: 10,
        mapTypeControl: true,
        center: lattlong,
        navigationControlOptions: {style:google.maps.NavigationControlStyle.SMALL}
    }
    var geoloc = new google.maps.Map(document.getElementById("map"), Options);
    var markergeoloc = new google.maps.Marker({position:lattlong, map:geoloc});
}

function errLoc(err) {
    switch(err.code) {
        case err.PERMISSION_DENIED:
            result.innerHTML = "User did not give the permission to allow use of location services"
            break;
        case err.TIMEOUT:
            result.innerHTML = "The request to get user location is timed out"
            break;
    }
}*/

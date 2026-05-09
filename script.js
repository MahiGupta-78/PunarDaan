// DARK MODE

const darkBtn = document.getElementById("darkBtn");

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// COUNTERS

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

  counter.innerText = "0";

  const updateCounter = () => {

    const target = +counter.getAttribute("data-target");
    const current = +counter.innerText;

    const increment = target / 100;

    if(current < target){

      counter.innerText =
      `${Math.ceil(current + increment)}`;

      setTimeout(updateCounter,20);

    }else{
      counter.innerText = target;
    }

  };

  updateCounter();

});

// MAP

const map = L.map('map').setView([30.3165, 78.0322], 9);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
  attribution:'© OpenStreetMap'
}).addTo(map);

const ngos = [

{
  name:"Shri Shradhanand Bal Vanita Ashram",
  city:"Dehradun",
  coords:[30.3255,78.0436]
},

{
  name:"Apne Sapne NGO",
  city:"Dehradun",
  coords:[30.2900,78.0100]
},

{
  name:"Sri Ram Ashram",
  city:"Haridwar",
  coords:[29.9457,78.1642]
}

];

ngos.forEach(ngo => {

  L.marker(ngo.coords)
  .addTo(map)
  .bindPopup(`
    <b>${ngo.name}</b><br>
    ${ngo.city}
  `);

});
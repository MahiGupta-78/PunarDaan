const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

  counter.innerText = "0";

  const updateCounter = () => {

    const target = +counter.getAttribute("data-target");

    const current = +counter.innerText;

    const increment = target / 100;

    if(current < target){

      counter.innerText = `${Math.ceil(current + increment)}`;

      setTimeout(updateCounter,20);

    } else {

      counter.innerText = target;

    }

  };

  updateCounter();

});


// NGO SEARCH

const searchInput = document.getElementById("ngoSearch");

searchInput.addEventListener("keyup",()=>{

  const filter = searchInput.value.toLowerCase();

  const cards = document.querySelectorAll(".ngo-card");

  cards.forEach(card=>{

    const text = card.innerText.toLowerCase();

    if(text.includes(filter)){
      card.style.display="block";
    } else {
      card.style.display="none";
    }

  });

});


// NGO FORM

const ngoForm = document.getElementById("ngoForm");

const popup = document.getElementById("successPopup");

const closePopup = document.getElementById("closePopup");

ngoForm.addEventListener("submit",(e)=>{

  e.preventDefault();

  popup.style.display = "flex";

});


closePopup.addEventListener("click",()=>{

  popup.style.display = "none";

});


// DARK MODE

const darkBtn = document.getElementById("darkModeBtn");

darkBtn.addEventListener("click",()=>{

  document.body.classList.toggle("dark-mode");

});
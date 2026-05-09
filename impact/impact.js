const counters = document.querySelectorAll(".counter");

counters.forEach(counter=>{

  counter.innerText = "0";

  const updateCounter = ()=>{

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


// SCROLL ANIMATION

const cards = document.querySelectorAll(
  ".impact-card,.ai-card,.story-card"
);

window.addEventListener("scroll",()=>{

  cards.forEach(card=>{

    const cardTop = card.getBoundingClientRect().top;

    if(cardTop < window.innerHeight - 100){

      card.style.opacity = "1";

      card.style.transform = "translateY(0px)";

    }

  });

});


// INITIAL CARD STYLE

cards.forEach(card=>{

  card.style.opacity = "0";

  card.style.transform = "translateY(40px)";

  card.style.transition = "0.6s";

});


// BUTTON EFFECT

const buttons = document.querySelectorAll("button");

buttons.forEach(button=>{

  button.addEventListener("mouseenter",()=>{

    button.style.transform = "scale(1.05)";

  });

  button.addEventListener("mouseleave",()=>{

    button.style.transform = "scale(1)";

  });

});
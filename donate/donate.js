const donationCards = document.querySelectorAll(".donation-card");
const dynamicFields = document.getElementById("dynamicFields");
const formTitle = document.getElementById("formTitle");


// DONATION TYPE SWITCH

donationCards.forEach(card => {

  card.addEventListener("click", () => {

    const type = card.dataset.type;

    if(type === "food"){

      formTitle.innerText = "Food Donation Form";

      dynamicFields.innerHTML = `
        <div class="input-group">
          <label>Food Type</label>
          <input type="text" placeholder="Veg / Non Veg / Bakery">
        </div>

        <div class="input-group">
          <label>Quantity</label>
          <input type="number" placeholder="Enter quantity">
        </div>

        <div class="input-group">
          <label>Expiry Estimate</label>
          <input type="time">
        </div>
      `;
    }

    if(type === "blood"){

      formTitle.innerText = "Blood Donation Form";

      dynamicFields.innerHTML = `
        <div class="input-group">
          <label>Blood Group</label>
          <select>
            <option>A+</option>
            <option>B+</option>
            <option>O+</option>
            <option>AB+</option>
          </select>
        </div>

        <div class="input-group">
          <label>Last Donation Date</label>
          <input type="date">
        </div>
      `;
    }

    if(type === "books"){

      formTitle.innerText = "Book Donation Form";

      dynamicFields.innerHTML = `
        <div class="input-group">
          <label>Subject</label>
          <input type="text">
        </div>

        <div class="input-group">
          <label>Class</label>
          <input type="text">
        </div>

        <div class="input-group">
          <label>Language</label>
          <input type="text">
        </div>
      `;
    }

    if(type === "clothes"){

      formTitle.innerText = "Clothes Donation Form";

      dynamicFields.innerHTML = `
        <div class="input-group">
          <label>Clothing Type</label>
          <input type="text">
        </div>

        <div class="input-group">
          <label>Condition</label>
          <select>
            <option>New</option>
            <option>Reusable</option>
            <option>Recyclable</option>
          </select>
        </div>

        <div class="input-group">
          <label>Size</label>
          <input type="text">
        </div>
      `;
    }

  });

});


// COUNTER ANIMATION

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


// FORM SUBMISSION

const donationForm = document.getElementById("donationForm");

const popup = document.getElementById("successPopup");

const closePopup = document.getElementById("closePopup");

donationForm.addEventListener("submit",(e)=>{

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
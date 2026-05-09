// DARK MODE

const darkBtn = document.getElementById("darkBtn");

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// FORM SUBMIT

const form = document.getElementById("requestForm");

form.addEventListener("submit", (e) => {

  e.preventDefault();

  document.getElementById("successModal")
  .style.display = "flex";

  form.reset();

});

// CLOSE MODAL

function closeModal(){

  document.getElementById("successModal")
  .style.display = "none";

}
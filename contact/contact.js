const form = document.getElementById("contactForm");

form.addEventListener("submit", function(e){

  e.preventDefault();

  alert("Message Sent Successfully!");

  form.reset();

});
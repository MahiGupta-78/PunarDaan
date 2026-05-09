// IMAGE PREVIEW

const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");

imageUpload.addEventListener("change", function () {

  const file = this.files[0];

  if(file){

    const reader = new FileReader();

    preview.style.display = "block";

    reader.addEventListener("load", function(){
      preview.setAttribute("src", this.result);
    });

    reader.readAsDataURL(file);

  }

});

// FORM SUBMIT

const receiverForm = document.getElementById("receiverForm");

receiverForm.addEventListener("submit", function(e){

  e.preventDefault();

  const data = {

    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    city: document.getElementById("city").value,
    address: document.getElementById("address").value,
    helpType: document.getElementById("helpType").value,
    urgency: document.getElementById("urgency").value,
    family: document.getElementById("family").value

  };

  localStorage.setItem("receiverRequest", JSON.stringify(data));

  alert("✅ Your request has been submitted successfully!");

  receiverForm.reset();

  preview.style.display = "none";

});
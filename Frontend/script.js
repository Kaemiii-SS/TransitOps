const vehicleForm = document.getElementById("vehicleForm");

vehicleForm.addEventListener("submit", function(e) {
    e.preventDefault();   // Stops the form from submitting

    // Your code to save the vehicle goes here
});



const modal = document.getElementById("vehicleModal");

document.querySelector(".add-btn").onclick = () => {
    modal.style.display = "flex";
};

document.getElementById("closeModal").onclick = () => {
    modal.style.display = "none";
};

window.onclick = (e)=>{
    if(e.target===modal){
        modal.style.display="none";
    }
};
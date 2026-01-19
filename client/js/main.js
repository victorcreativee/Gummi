let ctabtn = document.querySelector(".cta-btn");
ctabtn.addEventListener("click", changeBgColor);

function showMessage() {
  console.log("Welcome to Gummi");
}
function changeBgColor() {
  ctabtn.textContent = "New life";
  ctabtn.style.backgroundColor = "Blue";
  ctabtn.style.color = "white";
  showMessage();
}

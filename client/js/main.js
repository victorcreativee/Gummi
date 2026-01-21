const whyGummi = [
  "Learn from people already doing the work",
  "Build real projects, not just theory",
  "Collaborate with professionals",
  "Grow skills into real opportunities",
];
let ctabtn = document.querySelector(".cta-btn");
const whyList = document.querySelector(".why-list");
const toggleBtn = document.querySelector("#toggle-btn");

let expanded = false;
toggleBtn.addEventListener("click", () => {
  whyList.innerHTML = "";

  if (expanded) {
    whyGummi.slice(0, 1).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      whyList.appendChild(li);
    });
    toggleBtn.textContent = "Show More";
  } else {
    whyGummi.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      whyList.appendChild(li);
    });
    toggleBtn.textContent = "Show less";
  }
  expanded = !expanded;
});

ctabtn.addEventListener("click", changeBgColor);

function showMessage() {
  console.log("Welcome to Gummi");
}
function changeBgColor() {
  ctabtn.textContent = "New life";
  ctabtn.style.backgroundColor = "rgb(256, 0, 241";
  ctabtn.style.color = "white";
  showMessage();
}

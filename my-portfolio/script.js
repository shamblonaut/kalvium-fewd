const form = document.getElementById("contact-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(event.target);
  alert(`Thank you for your message, ${data.get("name")}!`);
  form.reset();
});

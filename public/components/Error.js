export default function Error(err) {
  const error = document.querySelector(".error");
  if (err) {
    error.className = "error";
    error.classList.remove("hidden");
    error.textContent = err.message;
  } else {
    if (!error.className.includes("hidden")) {
      error.innerHTML = "";
      error.classList.add("hidden");
    }
  }
}
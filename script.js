function validatePassword() {
  var passwordInput = document.getElementById("password").value;
  var errorMessage = document.getElementById("errorMessage");

  // Replace this with your actual password or implement server-side validation
  var correctPassword = "secure123";

  if (passwordInput === correctPassword) {
    window.location.href = "securePage.html"; // Redirect to the secure page
  } else {
    errorMessage.classList.remove("hidden");
  }
}

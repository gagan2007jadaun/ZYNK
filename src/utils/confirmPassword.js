function confirmPassword() {
    const input = document.getElementById("passwordInput").value;
    const error = document.getElementById("errorMsg");

    const savedPassword = localStorage.getItem("zynkPassword");

    if (input === savedPassword) {
        // Mark session as verified
        sessionStorage.setItem("zynkVerified", "true");

        // Redirect to protected page
        window.location.href = "profile.html";
    } else {
        error.classList.remove("hidden");
    }
}

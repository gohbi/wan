function login() {
    const username = document.getElementById("username").value;
    if (username.trim() !== "") {
        localStorage.setItem("username", username);
        showHomePage();
    }
}

function showHomePage() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("home-container").style.display = "block";
    document.getElementById("user-name").innerText = localStorage.getItem("username") || "User";
}

// Auto-show home page if already logged in
window.onload = function() {
    if (localStorage.getItem("username")) {
        showHomePage();
    }
};

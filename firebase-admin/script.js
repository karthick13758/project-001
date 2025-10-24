import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAd6u6VGZEmo8rqpbpVMVqxajMyLTt67jA",
  authDomain: "admin-dashboard-60f1d.firebaseapp.com",
  projectId: "admin-dashboard-60f1d",
  storageBucket: "admin-dashboard-60f1d.appspot.com",
  messagingSenderId: "889491308009",
  appId: "1:889491308009:web:0e1b8761bec2c91938df78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorMsg = document.getElementById("errorMsg");

// Login
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    errorMsg.textContent = "Please enter email and password!";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html"; // go to dashboard
  } catch (error) {
    errorMsg.textContent = "Login failed: " + error.message;
  }
});

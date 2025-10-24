import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";



// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAd6u6VGZEmo8rqpbpVMVqxajMyLTt67jA",
  authDomain: "admin-dashboard-60f1d.firebaseapp.com",
  projectId: "admin-dashboard-60f1d",
  storageBucket: "admin-dashboard-60f1d.appspot.com",
  messagingSenderId: "889491308009",
  appId: "1:889491308009:web:0e1b8761bec2c91938df78"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to local Firestore emulator
//connectFirestoreEmulator(db, '127.0.0.1', 8080);

// 🔹 HTML elements
const categoryBody = document.getElementById("categoryBody");
const addCategoryBtn = document.getElementById("addCategoryBtn");

// 🔹 Protect dashboard
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "index.html";
});

// 🔹 Logout button
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// 🔹 Load all categories
async function loadCategories() {
  categoryBody.innerHTML = "";
  const snapshot = await getDocs(collection(db, "categories"));
  let index = 1;
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    createRow(docSnap.id, index++, data.id, data.name, data.desc);
  });
}

// 🔹 Create row
function createRow(docId, rowNumber, catId, catName, catDesc) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="rowNumber">${rowNumber}</td>
    <td>${catId}</td>
    <td class="nameCell">${catName}</td>
    <td class="descCell">${catDesc}</td>
    <td>
      <button class="editBtn">Edit</button>
      <button class="deleteBtn">Delete</button>
    </td>
  `;
  categoryBody.appendChild(row);

  const editBtn = row.querySelector(".editBtn");
  const deleteBtn = row.querySelector(".deleteBtn");

  // Edit
  editBtn.addEventListener("click", async () => {
    if (editBtn.textContent === "Edit") {
      row.querySelector(".nameCell").innerHTML = `<input type="text" value="${catName}">`;
      row.querySelector(".descCell").innerHTML = `<input type="text" value="${catDesc}">`;
      editBtn.textContent = "Save";
    } else {
      const newName = row.querySelector(".nameCell input").value.trim();
      const newDesc = row.querySelector(".descCell input").value.trim();
      if (!newName) return showPopup("⚠️ Name required!");

      await updateDoc(doc(db, "categories", docId), { name: newName, desc: newDesc });
      showPopup("✅ Category updated successfully!");

      row.querySelector(".nameCell").textContent = newName;
      row.querySelector(".descCell").textContent = newDesc;
      editBtn.textContent = "Edit";
    }
  });

  // Delete
  deleteBtn.addEventListener("click", async () => {
    await deleteDoc(doc(db, "categories", docId));
    row.remove();
    updateRowNumbers();
    showPopup("🗑️ Category deleted!");
  });
}

// 🔹 Update row numbers
function updateRowNumbers() {
  Array.from(categoryBody.children).forEach((r, i) => {
    r.querySelector(".rowNumber").textContent = i + 1;
  });
}

// 🔹 Add new category
addCategoryBtn.addEventListener("click", () => {
  const rowNumber = categoryBody.children.length + 1;
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="rowNumber">${rowNumber}</td>
    <td><input type="text" class="idInput" placeholder="Category ID"></td>
    <td><input type="text" class="nameInput" placeholder="Category Name"></td>
    <td><input type="text" class="descInput" placeholder="Description"></td>
    <td>
      <button class="saveBtn">Save</button>
      <button class="cancelBtn">Cancel</button>
    </td>
  `;
  categoryBody.appendChild(row);

  const saveBtn = row.querySelector(".saveBtn");
  const cancelBtn = row.querySelector(".cancelBtn");

  // ✅ Save button logic
  saveBtn.addEventListener("click", async () => {
    const id = row.querySelector(".idInput").value.trim();
    const name = row.querySelector(".nameInput").value.trim();
    const desc = row.querySelector(".descInput").value.trim();

    if (!id || !name) {
      showPopup("⚠️ Category ID and Name required!");
      return;
    }

    try {
      // ✅ Add to Firestore
      await addDoc(collection(db, "categories"), {
        id,
        name,
        desc,
        createdAt: new Date().toISOString(),
      });

      showPopup("✅ Category saved successfully!");
      await loadCategories(); // refresh table
    } catch (error) {
      console.error("Firestore error:", error);
      showPopup("❌ Error: " + error.message);
    }
  });

  // Cancel
  cancelBtn.addEventListener("click", () => {
    row.remove();
    updateRowNumbers();
  });
});


// 🔹 Popup alert function
function showPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.background = "#3498db";
  popup.style.color = "#fff";
  popup.style.padding = "10px 15px";
  popup.style.borderRadius = "5px";
  popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  popup.style.zIndex = "9999";
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

// 🔹 Initial load
loadCategories();

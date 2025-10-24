import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// 🔹 HTML elements
const categoryBody = document.getElementById("categoryBody");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const productBody = document.getElementById("productBody");
const addProductBtn = document.getElementById("addProductBtn");

// 🔹 Protect dashboard
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "index.html";
});

// 🔹 Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// ==================== CATEGORY FUNCTIONS ====================

// 🔹 Load all categories
async function loadCategories() {
  categoryBody.innerHTML = "";
  const snapshot = await getDocs(collection(db, "categories"));
  let index = 1;
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    createCategoryRow(docSnap.id, index++, data.id, data.name, data.desc);
  });
}

// 🔹 Create category row
function createCategoryRow(docId, rowNumber, catId, catName, catDesc) {
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

  // Edit category
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

  // Delete category
  deleteBtn.addEventListener("click", async () => {
    await deleteDoc(doc(db, "categories", docId));
    row.remove();
    updateRowNumbers(categoryBody);
    showPopup("🗑️ Category deleted!");
  });
}

// 🔹 Add new category
addCategoryBtn.addEventListener("click", () => {
  addRow(categoryBody, "Category");
});

// ==================== PRODUCT FUNCTIONS ====================

// 🔹 Load all products
async function loadProducts() {
  productBody.innerHTML = "";
  const snapshot = await getDocs(collection(db, "products"));
  let index = 1;
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    createProductRow(docSnap.id, index++, data.id, data.name, data.desc);
  });
}

// 🔹 Create product row
function createProductRow(docId, rowNumber, prodId, prodName, prodDesc) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="rowNumber">${rowNumber}</td>
    <td>${prodId}</td>
    <td class="nameCell">${prodName}</td>
    <td class="descCell">${prodDesc}</td>
    <td>
      <button class="editBtn">Edit</button>
      <button class="deleteBtn">Delete</button>
    </td>
  `;
  productBody.appendChild(row);

  const editBtn = row.querySelector(".editBtn");
  const deleteBtn = row.querySelector(".deleteBtn");

  // Edit product
  editBtn.addEventListener("click", async () => {
    if (editBtn.textContent === "Edit") {
      row.querySelector(".nameCell").innerHTML = `<input type="text" value="${prodName}">`;
      row.querySelector(".descCell").innerHTML = `<input type="text" value="${prodDesc}">`;
      editBtn.textContent = "Save";
    } else {
      const newName = row.querySelector(".nameCell input").value.trim();
      const newDesc = row.querySelector(".descCell input").value.trim();
      if (!newName) return showPopup("⚠️ Name required!");
      await updateDoc(doc(db, "products", docId), { name: newName, desc: newDesc });
      showPopup("✅ Product updated successfully!");
      row.querySelector(".nameCell").textContent = newName;
      row.querySelector(".descCell").textContent = newDesc;
      editBtn.textContent = "Edit";
    }
  });

  // Delete product
  deleteBtn.addEventListener("click", async () => {
    await deleteDoc(doc(db, "products", docId));
    row.remove();
    updateRowNumbers(productBody);
    showPopup("🗑️ Product deleted!");
  });
}

// 🔹 Add new product
addProductBtn.addEventListener("click", () => {
  addRow(productBody, "Product");
});

// ==================== COMMON FUNCTIONS ====================

// 🔹 Add new row (Category/Product)
function addRow(tableBody, type) {
  const rowNumber = tableBody.children.length + 1;
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="rowNumber">${rowNumber}</td>
    <td><input type="text" class="idInput" placeholder="${type} ID"></td>
    <td><input type="text" class="nameInput" placeholder="${type} Name"></td>
    <td><input type="text" class="descInput" placeholder="Description"></td>
    <td>
      <button class="saveBtn">Save</button>
      <button class="cancelBtn">Cancel</button>
    </td>
  `;
  tableBody.appendChild(row);

  const saveBtn = row.querySelector(".saveBtn");
  const cancelBtn = row.querySelector(".cancelBtn");

  saveBtn.addEventListener("click", async () => {
    const id = row.querySelector(".idInput").value.trim();
    const name = row.querySelector(".nameInput").value.trim();
    const desc = row.querySelector(".descInput").value.trim();

    if (!id || !name) {
      showPopup(`⚠️ ${type} ID and Name required!`);
      return;
    }

    try {
      await addDoc(collection(db, type.toLowerCase() + "s"), {
        id,
        name,
        desc,
        createdAt: new Date().toISOString(),
      });
      showPopup(`✅ ${type} saved successfully!`);
      if (type === "Category") loadCategories();
      else loadProducts();
    } catch (error) {
      console.error("Firestore error:", error);
      showPopup("❌ Error: " + error.message);
    }
  });

  cancelBtn.addEventListener("click", () => {
    row.remove();
    updateRowNumbers(tableBody);
  });
}

// 🔹 Update row numbers
function updateRowNumbers(tableBody) {
  Array.from(tableBody.children).forEach((r, i) => {
    r.querySelector(".rowNumber").textContent = i + 1;
  });
}

// 🔹 Popup function
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
loadProducts();

const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

let transactions = [];

// Fetch from MongoDB
async function fetchTransactions() {
  const res = await fetch("http://localhost:5000/api/transactions");
  transactions = await res.json();
  Init();
}

// Add transaction
async function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add text and amount");
    return;
  }

  const newTransaction = {
    text: text.value,
    amount: +amount.value,
  };

  const res = await fetch("http://localhost:5000/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTransaction),
  });

  const data = await res.json();
  transactions.push(data);
  addTransactionDOM(data);
  updateValues();

  text.value = "";
  amount.value = "";
}

// Delete transaction
async function removeTransaction(id) {
  await fetch(`http://localhost:5000/api/transactions/${id}`, {
    method: "DELETE",
  });

  transactions = transactions.filter((tx) => tx._id !== id);
  Init();
}

// DOM functions
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction('${transaction._id}')">x</button>
  `;

  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map((tx) => tx.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(a => a < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

form.addEventListener("submit", addTransaction);
fetchTransactions();

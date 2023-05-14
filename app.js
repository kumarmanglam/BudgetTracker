let datas = [];

function uniqueId(){
  return Date.now().toString();
}

function handleSubmit(event) {
  event.preventDefault(); // Prevent page reload\
  const type = document.getElementById("type").value;
  const desc = document.getElementById("desc").value;
  const modAmount = document.getElementById("amount").value;
  const amount = type === "income" ? +modAmount : -modAmount;
  if(modAmount != 0){
    const data = {
      "id":uniqueId(),
      "type":type,
      "desc":desc,
      "amount":amount
    }
    datas.push(data);
    displayRecordEl(data);
    updateStats();
    localStorage.setItem("record",JSON.stringify(datas));
  }
  else{
    alert("Enter Valid amount");
  }
}
function updateStats(){
  let balance = 0;
  let income = 0;
  let expense = 0;

  datas.forEach(data => {
    balance += data.amount;
    income += data.type === "income" ? data.amount : 0;
    expense += data.type === "expense" ? data.amount : 0;
  })
  const balanceStat = document.getElementById("balance-stat");
  const incomeStat = document.getElementById("income-stat");
  const expenseStat = document.getElementById("expense-stat");
  
  balanceStat.textContent = `₹${balance}`;
  incomeStat.textContent = `₹${income}`;
  expenseStat.textContent = `₹${expense}`;
}

/* <div class="record">
<p class="record-desc">dividend</p>
<p class="record-data" id="inc/exp-record-data-amount"><span>-</span>100</p>
<button class="record-delete">Delete</button>
<button class="record-edit">Edit</button>
</div> */

function createRecordEl(data){
  const recordEl = document.createElement("div");
  recordEl.classList.add("record");
  recordEl.setAttribute("data-id", data.id);
  const desc = document.createElement("p");
  desc.classList.add("record-desc");
  desc.textContent = data.desc;
  const recData = document.createElement("p")
  recData.classList.add("record-data");
  if(data.type === "income"){
    recData.setAttribute("id","inc-record-data-amount")
  }
  else{
    recData.setAttribute("id","exp-record-data-amount")
  }
  const span = document.createElement("span");
  span.textContent= data.type === "income" ? "+" : "-";
  recData.appendChild(span);
  recData.textContent += `₹${Math.abs(data.amount)}`;
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("record-delete");
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("onclick","handleDeleteClick(event)");

  recordEl.appendChild(desc);
  recordEl.appendChild(recData);
  recordEl.appendChild(deleteBtn);

  return recordEl;
}

function displayRecordEl(data){
  const recordEl = createRecordEl(data);
  if(data.type === "income"){
    const incTile = document.getElementById("inc-tile");
    incTile.appendChild(recordEl);
  }
  else{
    const expTile = document.getElementById("exp-tile");
    expTile.appendChild(recordEl);
  }
}

function handleDeleteClick(event) {
  const currRecord = event.currentTarget.parentElement;
  const recordId = currRecord.dataset.id;
  // Remove the record element from the DOM
  currRecord.remove();

  // Filter out the corresponding data object from the datas array
  datas = datas.filter(data => data.id !== recordId);

  // Update the stats and localStorage
  updateStats();
  localStorage.setItem("record", JSON.stringify(datas));
}

function init(){
  const storedData = localStorage.getItem('record');
  datas = storedData ? JSON.parse(storedData) : [];
  datas.forEach(data => {
    displayRecordEl(data);
  })
  updateStats();
}

function togglePlaceholder() {
  const typeSelect = document.getElementById("type");
  const descInput = document.getElementById("desc");

  if (typeSelect.value === "income") {
    descInput.placeholder = "Income Description";
  } else if (typeSelect.value === "expense") {
    descInput.placeholder = "Expense Description";
  }
}

init();
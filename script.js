class Applicant {
  constructor(name, age, savings) {
    this.name = name;
    this.age = age;
    this.savings = savings;
  }
}

// Load data local storage 
const storedApplicants = localStorage.getItem("applicants");
const applicants = storedApplicants ? JSON.parse(storedApplicants) : [];

function saveToLocalStorage() {
  localStorage.setItem("applicants", JSON.stringify(applicants));
}

function removeApplicant(index) {
  applicants.splice(index, 1);
  updateTable();
  saveToLocalStorage(); 
}

function showLoadingPopup() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "flex";
}

function hideLoadingPopup() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}

async function submitForm() {
  const nameInput = document.getElementById("name");
  const ageInput = document.getElementById("age");
  const savingsInput = document.getElementById("savings");

  const name = capitalizeFirstLetter(nameInput.value);
  const age = parseInt(ageInput.value, 10);
  const savings = parseInt(savingsInput.value.replace(/,/g, ''), 10);

  if (name.length < 10 || age < 25 || isNaN(age) || isNaN(savings) || savings < 100000 || savings > 1000000) {
    alert("Nama / Umur / Uang Sangu tidak sesuai persyaratan");
    return;
  }

  showLoadingPopup(); 

  // async while submitting
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    await delay(1000); // Simulate a 1-second delay
    const applicant = new Applicant(name, age, formatNumberWithCommas(savings));
    applicants.push(applicant);

    nameInput.value = '';
    ageInput.value = '';
    savingsInput.value = '';

    updateTable();
    saveToLocalStorage(); // Save data to local storage
  } finally {
    hideLoadingPopup(); // Hide loading 
  }
}

function updateTable() {
  const table = document.getElementById("applicantTable");
  table.innerHTML = "<tr><th>Nama</th><th>Umur</th><th>Uang Sangu (Rp)</th><th>Action</th></tr>";

  for (let i = 0; i < applicants.length; i++) {
    const applicant = applicants[i];
    const row = table.insertRow();
    row.insertCell(0).textContent = applicant.name;
    row.insertCell(1).textContent = applicant.age;
    row.insertCell(2).textContent = applicant.savings;

    // Add a red remove button to each data row
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-button"); // Add the remov button
    removeButton.addEventListener("click", () => removeApplicant(i));
    row.insertCell(3).appendChild(removeButton);
  }

  if (applicants.length > 0) {
    calculateAverage();
  } else {
    clearAverageInfo();
  }
}

function clearAverageInfo() {
  const averageInfo = document.getElementById("averageInfo");
  averageInfo.innerHTML = "";
}

function calculateAverage() {
  const totalAge = applicants.reduce((sum, applicant) => sum + applicant.age, 0);
  const totalSavings = applicants.reduce((sum, applicant) => sum + parseInt(applicant.savings.replace(/,/g, '')), 0);

  const averageAge = totalAge / applicants.length;
  const averageSavings = totalSavings / applicants.length;

  const averageInfo = document.getElementById("averageInfo");
  averageInfo.innerHTML = `Info: Rata-rata pendaftar memiliki uang sangu sebesar ${formatNumberWithCommas(averageSavings.toFixed())} dengan rata-rata umur ${averageAge.toFixed()}`;
}

function validateNameInput(input) {
  input.value = input.value.replace(/[^A-Za-z ]/g, '');
}

function capitalizeFirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Load table and average info on page load
updateTable();

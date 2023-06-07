const form = document.querySelector('form');
const weights = document.querySelector('#weights');
const modal = document.querySelector('.modal');
const modalForm = document.querySelector('.modal form');
const modalCloseBtn = document.querySelector('.modal .close');
let currentWeightId = null;

// Load weights from local storage
const loadWeights = () => {
  const savedWeights = JSON.parse(localStorage.getItem('weights')) || [];
  savedWeights.forEach(weight => addWeight(weight));
};

// Save weights to local storage
const saveWeights = () => {
  const weightElements = weights.querySelectorAll('tr');
  const savedWeights = Array.from(weightElements).map(row => ({
    id: row.dataset.id,
    date: row.querySelector('.date').textContent,
    weight: row.querySelector('.weight').textContent,
  }));
  localStorage.setItem('weights', JSON.stringify(savedWeights));
};

// Add weight to table
const addWeight = ({ id, date, weight }) => {
  const row = document.createElement('tr');
  row.dataset.id = id;
  row.innerHTML = `
    <td class="date">${date}</td>
    <td class="weight">${weight}</td>
    <td>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </td>
  `;
  weights.appendChild(row);
};

// Show modal dialog for editing weight
const showEditModal = (id, date, weight) => {
  currentWeightId = id;
  modalForm.date.value = date;
  modalForm.weight.value = weight;
  modal.style.display = 'block';
};

// Hide modal dialog
const hideModal = () => {
  modal.style.display = 'none';
  currentWeightId = null;
  modalForm.reset();
};

// Handle form submit
form.addEventListener('submit', event => {
  event.preventDefault();
  const id = Date.now().toString();
  const date = form.date.value;
  const weight = form.weight.value;
  addWeight({ id, date, weight });
  saveWeights();
  form.reset();
});

// Handle table button clicks
weights.addEventListener('click', event => {
  const row = event.target.closest('tr');
  if (event.target.classList.contains('edit-btn')) {
    const date = row.querySelector('.date').textContent;
    const weight = row.querySelector('.weight').textContent;
    showEditModal(row.dataset.id, date, weight);
  } else if (event.target.classList.contains('delete-btn')) {
    weights.removeChild(row);
    saveWeights();
  }
});

// Handle modal form submit
modalForm.addEventListener('submit', event => {
  event.preventDefault();
  const date = modalForm.date.value;
  const weight = modalForm.weight.value;
  const row = weights.querySelector(`tr[data-id="${currentWeightId}"]`);
  row.querySelector('.date').textContent = date;
  row.querySelector('.weight').textContent = weight;
  hideModal();
  saveWeights();
});

// Handle modal close button click
modalCloseBtn.addEventListener('click', hideModal);

// Load weights on page load
loadWeights();
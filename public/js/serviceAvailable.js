const token = localStorage.getItem('token');
const serviceSelect = document.getElementById('serviceSelect');
const tableBody = document.getElementById('availabilityTableBody');
const form = document.getElementById('availabilityForm');
const list = document.getElementById('availabilityList');
const submitAllBtn = document.getElementById('submitAllBtn');
let availabilityArray = [];
let selectedServiceId = null;
const user = JSON.parse(localStorage.getItem('user'));
const url='http://localhost:2000/api';
if (!token || !user || user.role !== 'admin') {
  alert("Access denied: Admins only");
  window.location.href = "/login.html";
}

// Add single slot to preview list
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const slot = {
    dayOfWeek: document.getElementById('dayOfWeek').value,
    startTime: document.getElementById('startTime').value,
    endTime: document.getElementById('endTime').value
  };

  availabilityArray.push(slot);
  form.reset();
  renderSlotList();
});

// Render the preview list
function renderSlotList() {
  list.innerHTML = '';
  availabilityArray.forEach((slot, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      ${slot.dayOfWeek}: ${slot.startTime} - ${slot.endTime}
      <button class="btn btn-sm btn-outline-danger" onclick="removeSlot(${index})">Remove</button>
    `;
    list.appendChild(li);
  });
}
// Remove slot by index
function removeSlot(index) {
  availabilityArray.splice(index, 1);
  renderSlotList();
}
// Submit all slots to backend
submitAllBtn.addEventListener('click', async () => {
  const serviceId = document.getElementById('serviceSelect').value;
  if (!serviceId || availabilityArray.length === 0) {
    alert("Select a service and add at least one slot.");
    return;
  }

  try {
    await axios.post(`${url}/services/${serviceId}/availability`, availabilityArray, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Availability saved!");
    availabilityArray = [];
    renderSlotList();
    fetchAvailability(); // reload table
  } catch (err) {
    alert("Failed to save slots.");
  }
});
// Fetch all slots
async function fetchAvailability() {
  const res = await axios.get(`${url}/services/${selectedServiceId}/availability`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  tableBody.innerHTML = '';
  res.data.availability.forEach(slot => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="form-control" value="${slot.dayOfWeek}" id="day-${slot.id}"></td>
      <td><input type="time" class="form-control" value="${slot.startTime}" id="start-${slot.id}"></td>
      <td><input type="time" class="form-control" value="${slot.endTime}" id="end-${slot.id}"></td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="updateSlot(${slot.id})">Update</button>
        <button class="btn btn-sm btn-danger ms-2" onclick="deleteSlot(${slot.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}
async function loadServices() {
  const res = await axios.get(`${url}/services`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  res.data.services.forEach(service => {
    const option = document.createElement('option');
    option.value = service.id;
    option.textContent = service.name;
    serviceSelect.appendChild(option);
  });
}

// On service change, fetch availability
serviceSelect.addEventListener('change', async (e) => {
  selectedServiceId = e.target.value;
  if (!selectedServiceId) return;
  await fetchAvailability();
});

// Update slot
async function updateSlot(id) {
  const day = document.getElementById(`day-${id}`).value;
  const start = document.getElementById(`start-${id}`).value;
  const end = document.getElementById(`end-${id}`).value;

  await axios.put(`${url}/availability/${id}`, {
    dayOfWeek: day,
    startTime: start,
    endTime: end
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
alert("Updated slot!");
  fetchAvailability();
}

// Delete slot
async function deleteSlot(id) {
  if (!confirm("Delete this availability slot?")) return;

  await axios.delete(`${url}/availability/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
form.reset();
  fetchAvailability();
}

document.addEventListener('DOMContentLoaded',loadServices()
);
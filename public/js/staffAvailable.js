const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
let selectedStaffId = null;
let availabilityArray = [];
const url='http://localhost:2000/api';
if (!token || !user || user.role !== 'admin') {
  alert("Access denied: Admins only");
  window.location.href = "/login.html";
}
const staffSelect = document.getElementById('StaffSelect');
const tableBody = document.getElementById('availabilityTableBody');
const form = document.getElementById('availabilityForm');
const list = document.getElementById('availabilityList');
const submitAllBtn = document.getElementById('submitAllBtn');

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
// Render preview list
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
function removeSlot(index) {
  availabilityArray.splice(index, 1);
  renderSlotList();
}

// Submit all slots
submitAllBtn.addEventListener('click', async () => {
  const staffId = staffSelect.value;
  if (!staffId || availabilityArray.length === 0) {
    alert("Select a staff member and add at least one slot.");
    return;
  }

  try {
    await axios.post(`${url}/staff/${staffId}/availability`, availabilityArray, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Availability saved!");
    availabilityArray = [];
    renderSlotList();
    fetchAvailability();
  } catch (err) {
    console.log(err);
    alert("Failed to save slots.");
  }
});

async function fetchAvailability() {
  const res = await axios.get(`${url}/staff/${selectedStaffId}/availability`, {
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
async function updateSlot(id) {
  const day = document.getElementById(`day-${id}`).value;
  const start = document.getElementById(`start-${id}`).value;
  const end = document.getElementById(`end-${id}`).value;

  await axios.put(`${url}/staff/availability/${id}`, {
    dayOfWeek: day,
    startTime: start,
    endTime: end
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  alert("Slot updated!");
  fetchAvailability();
}
async function deleteSlot(id) {
  if (!confirm("Delete this availability slot?")) return;

  await axios.delete(`${url}/staff/availability/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  form.reset();
  fetchAvailability();
}
async function loadStaffs() {
  const res = await axios.get(`${url}/staff`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  res.data.staff.forEach(staff => {
    const option = document.createElement('option');
    option.value = staff.id;
    option.textContent = staff.User.name;
    staffSelect.appendChild(option);
  });
}
staffSelect.addEventListener('change', async (e) => {
  selectedStaffId = e.target.value;
  if (!selectedStaffId) return;
  await fetchAvailability();
});

document.addEventListener('DOMContentLoaded',loadStaffs());
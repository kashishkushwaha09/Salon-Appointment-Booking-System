const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const url = 'http://localhost:2000/api';
const tableBody = document.getElementById('appointmentTableBody');
let storedAppointments = []; 
if (!token || !user || user.role !== 'customer') {
  alert("Access denied");
  window.location.href = "/login.html";
}

loadAppointments();

async function loadAppointments() {
  try {
    const res = await axios.get(`${url}/appointments/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = res.data.appointments;
    storedAppointments = res.data.appointments;
    tableBody.innerHTML = '';

    data.forEach(appt => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${appt.Service.name}</td>
        <td>${appt.Staff.User.name}</td>
        <td>${appt.date}</td>
        <td>${appt.startTime} - ${appt.endTime}</td>
        <td>${appt.status}</td>
        <td>
        ${appt.status === 'confirmed' ? 
    `<button class="btn btn-sm btn-warning me-2" onclick="openRescheduleModal(${appt.id})">Reschedule</button>` 
    : ''
  }
    <button class="btn btn-sm btn-danger" onclick="cancelAppointment(${appt.id})">Cancel</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load appointments");
  }
}
async function fetchAvailableSlots() {
  const date = document.getElementById('newDate').value;
  const serviceId = document.getElementById('rescheduleServiceId').value;
  const staffId = document.getElementById('rescheduleStaffId').value;
  const slotSelect = document.getElementById('slotSelect');

  if (!date || !serviceId) return;

  try {
    const res = await axios.get(`${url}/appointments/available-slots?serviceId=${serviceId}&date=${date}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    slotSelect.innerHTML = `<option value="">-- Select a Time Slot --</option>`;
    const staffSlot = res.data.find(s => s.staffId === Number(staffId));
    if (staffSlot) {
      staffSlot.availableSlots.forEach(time => {
        const opt = document.createElement('option');
        opt.value = time;
        opt.textContent = time;
        slotSelect.appendChild(opt);
      });
    } else {
      const opt = document.createElement('option');
      opt.textContent = 'No available slots';
      slotSelect.appendChild(opt);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to load available slots");
  }
}

// Cancel
async function cancelAppointment(id) {
  if (!confirm("Cancel this appointment?")) return;

  try {
    await axios.delete(`${url}/appointments/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Cancelled");
    loadAppointments();
  } catch (err) {
    alert("Error cancelling appointment");
  }
}

// Reschedule Modal
function openRescheduleModal(id) {
  const appointment = storedAppointments.find(a => a.id === id);
  document.getElementById('rescheduleId').value = id;
  document.getElementById('rescheduleStaffId').value = appointment.staffId;
  document.getElementById('rescheduleServiceId').value = appointment.serviceId;
  document.getElementById('slotSelect').innerHTML = `<option value="">-- Select a Time Slot --</option>`;
  new bootstrap.Modal(document.getElementById('rescheduleModal')).show();
}

// Reschedule Submit
document.getElementById('rescheduleForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('rescheduleId').value;
  const date = document.getElementById('newDate').value;
  const startTime = document.getElementById('slotSelect').value;
if (!startTime) {
    alert("Please select a valid time slot");
    return;
  }

  try {
    await axios.put(`${url}/appointments/${id}/reschedule`, { date, startTime }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Rescheduled successfully!");
    bootstrap.Modal.getInstance(document.getElementById('rescheduleModal')).hide();
    loadAppointments();
  } catch (err) {
    alert("Only confirmed appointments can be rescheduled");
  }
});

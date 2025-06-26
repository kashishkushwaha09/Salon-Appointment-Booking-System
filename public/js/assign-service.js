const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const url = 'http://localhost:2000/api';

const urlParams = new URLSearchParams(window.location.search);
const staffId = urlParams.get('staffId');

if (!token || !user || user.role !== 'admin') {
  alert("Access denied: Admin only.");
  window.location.href = '/login.html';
}

async function loadStaffAndServices() {
  try {
    const res = await axios.get(`${url}/staff/${staffId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const staff = res.data.staff;

    document.getElementById('staffName').textContent = staff.User.name;
    document.getElementById('staffEmail').textContent = staff.User.email;
    document.getElementById('specialization').textContent=staff.specializations;
    const availabilityList = document.getElementById('staffAvailability');
    staff.availability.forEach(slot => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `${slot.dayOfWeek}: ${slot.startTime} - ${slot.endTime}`;
      availabilityList.appendChild(li);
    });

    const servicesRes = await axios.get(`${url}/services`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const servicesList = document.getElementById('servicesList');
    for (const service of servicesRes.data.services) {
      const availRes = await axios.get(`${url}/services/${service.id}/availability`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const card = document.createElement('div');
      card.className = 'col';

      const availabilityHtml = availRes.data.availability.map(a =>
        `<li>${a.dayOfWeek}: ${a.startTime} - ${a.endTime}</li>`
      ).join('');

      card.innerHTML = `
        <div class="card shadow-sm h-100 p-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${service.id}" id="svc-${service.id}">
            <label class="form-check-label fw-bold" for="svc-${service.id}">
              ${service.name}
            </label>
          </div>
          <p class="mb-1"><strong>Duration:</strong> ${service.duration} mins</p>
          <p class="mb-1"><strong>Price:</strong> ₹${service.price}</p>
          <p class="mb-1"><strong>Description:</strong> ${service.description}</p>
          <p class="mb-1"><strong>Service Availability:</strong></p>
          <ul class="small">${availabilityHtml || '<li>No slots</li>'}</ul>
        </div>
      `;
      servicesList.appendChild(card);
    }

  } catch (err) {
    console.error(err);
    alert("Failed to load data");
  }
}

document.getElementById('assignBtn').addEventListener('click', async () => {
  const selected = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
    .map(cb => Number(cb.value));

  if (selected.length === 0) return alert("Please select at least one service.");

  try {
    await axios.post(`${url}/staff/${staffId}/assign-service`, {
      serviceIds: selected
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Services assigned successfully!");
    window.location.href = "/public/admin-staff.html";
  } catch (err) {
    console.error(err);
    alert("No valid services match staff's skill and schedule");
  }
});

async function loadStaffDetails() {

  const token = localStorage.getItem('token');

  try {
    const res = await axios.get(`${url}/staff/${staffId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
console.log(res);
    const staff = res.data.staff;
    const list = document.getElementById('assignedServices');
    list.innerHTML='';
    if (staff.Services.length === 0) {
      list.innerHTML = `<li class="list-group-item text-muted">No services assigned</li>`;
    } else {
      staff.Services.forEach(service => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
          <strong>${service.name}</strong> - ${service.duration} mins @ ₹${service.price}<br>
          ${service.description || ''}
        `;
        list.appendChild(li);
      });
    }

  } catch (err) {
    console.log(err);
    alert("Failed to load staff details");
  }
}
document.addEventListener("DOMContentLoaded", loadStaffDetails);

document.addEventListener('DOMContentLoaded',()=>{
    loadStaffAndServices();
    loadStaffDetails();
 });
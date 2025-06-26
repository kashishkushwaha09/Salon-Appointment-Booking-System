const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const url='http://localhost:2000/api';
if (!token || !user || user.role !== 'admin') {
  alert("Access denied: Admins only");
  window.location.href = "/login.html";
}

const form = document.getElementById('addServiceForm');
const tableBody = document.querySelector('#servicesTable tbody');
let editingServiceId = null; 
const cancelEditBtn = document.getElementById('cancelEditBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.name.value;
  const description = form.description.value;
  const duration = form.duration.value;
  const price = form.price.value;

  try {
      if (editingServiceId) {
      await axios.put(`${url}/services/${editingServiceId}`, { name, description, duration, price }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Service updated');
      editingServiceId = null;
      form.querySelector('button[type="submit"]').textContent = 'Add Service';
      cancelEditBtn.classList.add('d-none');
    } else{
       await axios.post(`${url}/services`, { name, description, duration, price }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Service added');
    }
   

    form.reset();
    loadServices();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to add");
  }
});

async function loadServices() {
  try {
    const res = await axios.get(`${url}/services`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    tableBody.innerHTML = '';
    res.data.services.forEach(service => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${service.name}</td>
        <td>${service.description}</td>
        <td>${service.duration} mins</td>
        <td>₹${service.price}</td>
        <td class="d-flex align-items-center gap-1">
          <button class="btn btn-sm btn-warning me-2" onclick="editService(${service.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteService(${service.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

  } catch (err) {
    alert("Error loading services");
  }
}
async function editService(id) {
  try {
    const res = await axios.get(`${url}/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const s = res.data.service;
    form.name.value = s.name;
    form.description.value = s.description;
    form.duration.value = s.duration;
    form.price.value = s.price;

    editingServiceId = id;
     showEditMode();
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    alert("Failed to fetch service data");
  }
}
function showEditMode() {
  form.querySelector('button[type="submit"]').textContent = 'Update Service';
  cancelEditBtn.classList.remove('d-none');
}
async function deleteService(id) {
 
  try {
    await axios.delete(`${url}/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Deleted!');
    form.reset();
    editingServiceId = null;
    form.querySelector('button[type="submit"]').textContent = 'Add Service';
    loadServices();
  } catch (err) {
    alert("Delete failed");
  }
}
cancelEditBtn.addEventListener('click', () => {
  editingServiceId = null;
  form.reset();
  form.querySelector('button[type="submit"]').textContent = 'Add Service';
  cancelEditBtn.classList.add('d-none');
});

document.addEventListener('DOMContentLoaded',loadServices);
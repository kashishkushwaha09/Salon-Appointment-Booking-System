const token = localStorage.getItem("token");
const form = document.getElementById("staffForm");
const staffList = document.getElementById("staffList");
const user = JSON.parse(localStorage.getItem('user'));
let editingStaffId = null;
const cancelEditBtn = document.getElementById('cancelEditBtn');
const url = 'http://localhost:2000/api';
if (!token || !user || user.role !== 'admin') {
    alert("Access denied: Admins only");
    window.location.href = "/login.html";
}
// Add staff
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;

    const staffData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        gender: form.gender.value,
        password: form.password.value,
        bio: form.bio.value,
        specializations: form.specializations.value,
    };
    console.log(staffData);
    try {
        if (editingStaffId) {
            await axios.put(`${url}/staff/${editingStaffId}`, staffData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Service updated');
            editingStaffId = null;
            form.querySelector('button[type="submit"]').textContent = 'Add staff';
            cancelEditBtn.classList.add('d-none');
        } else {
            await axios.post(`${url}/staff`, staffData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        form.reset();
        loadStaff();
    } catch (err) {
        console.log(err);
        alert("Error adding staff");
    }
});

// Load all staff
async function loadStaff() {
    try {
        const res = await axios.get(`${url}/staff`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data.staff);
        staffList.innerHTML = '';
        res.data.staff.forEach((s) => {
            const col = document.createElement("div");
            col.className = "col-md-4";

            col.innerHTML = `
        <div class="card p-3 shadow">
          <h5>${s.User.name}</h5>
          <p><strong>Email:</strong> ${s.User.email}</p>
          <p><strong>Phone:</strong> ${s.User.phone}</p>
          <p><strong>Gender:</strong> ${s.User.gender}</p>
          <p><strong>Specializations:</strong> ${s.specializations.join(", ")}</p>
          <p>${s.bio || ''}</p>
         <div class="d-flex justify-content-evenly mt-3">
            <button class="btn btn-sm btn-outline-primary" onclick="window.location.href='/assign-services.html?staffId=${s.id}'">Assign Services</button>
            <button class="btn btn-sm btn-warning" onclick="editStaff(${s.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteStaff(${s.id})">Delete</button>
          </div>
        </div>
      `;

            staffList.appendChild(col);
        });
    } catch (err) {
        console.error("Failed to load staff");
    }
}
loadStaff();
async function editStaff(id) {
    try {
        const res = await axios.get(`${url}/staff/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const s = res.data.staff;
        form.name.value = s.User.name;
        form.email.value = s.User.email;
        form.phone.value = s.User.phone;
        form.gender.value = s.User.gender;
        form.bio.value = s.bio;
        form.specializations.value = s.specializations;

        editingStaffId = id;
        showEditMode();
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        console.log(err);
        alert("Failed to fetch staff data");
    }
}
async function deleteStaff(id) {
 
  try {
    await axios.delete(`${url}/staff/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Deleted!');
    form.reset();
    editingStaffId = null;
    form.querySelector('button[type="submit"]').textContent = 'Add Staff';
    loadStaff();
  } catch (err) {
    console.log(err);
    alert("Delete failed");
  }
}
function showEditMode() {
    form.querySelector('button[type="submit"]').textContent = 'Update Staff';
    cancelEditBtn.classList.remove('d-none');
}
function openAssignServices(){

}
cancelEditBtn.addEventListener('click', () => {
    editingStaffId = null;
    form.reset();
    form.querySelector('button[type="submit"]').textContent = 'Add Staff';
    cancelEditBtn.classList.add('d-none');
});
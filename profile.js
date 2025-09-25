let userProfile = JSON.parse(localStorage.getItem("userProfile")) || {
  name: "Admin User",
  email: "admin@homemaster.com",
  phone: "+1 (555) 123-4567",
  role: "Manager",
  joined: "Jan 15, 2023",
  lastLogin: new Date().toLocaleString(),
  twoFA: false,
  passwordLastChanged: "3 months ago"
};

let quickStats = [
  { label: "Products Managed", value: "47" },
  { label: "Sales This Month", value: "₱12,458" },
  { label: "Tasks Completed", value: "28/32" }
];

let activityLog = [
  { icon: "fa-box", color: "purple", title: "Added new product", desc: "Added 'Premium Kitchen Set' to inventory", time: "2 hours ago" },
  { icon: "fa-chart-line", color: "green", title: "Updated sales report", desc: "Generated monthly sales summary", time: "Yesterday, 3:45 PM" },
  { icon: "fa-user-shield", color: "blue", title: "Password changed", desc: "Account password was updated", time: "1 week ago" }
];

document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  renderQuickStats();
  renderAccountInfo();
  renderActivityLog();
  updateTwoFAStatus();
});

function renderProfile() {
  document.getElementById('userName').textContent = userProfile.name;
  document.getElementById('userRole').textContent = userProfile.role;
  document.getElementById('profileName').textContent = userProfile.name;
  document.getElementById('profileRoleText').textContent = userProfile.role;
  document.getElementById('profileEmail').textContent = userProfile.email;
  document.getElementById('joinedDate').textContent = userProfile.joined;
  document.getElementById('lastLogin').textContent = userProfile.lastLogin;
  document.getElementById('passwordLastChanged').textContent = userProfile.passwordLastChanged;

  const initials = userProfile.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  const avatarText = document.getElementById('avatarText');
  if (avatarText) avatarText.textContent = initials;
}

function renderQuickStats() {
  const container = document.getElementById('quickStats');
  container.innerHTML = quickStats.map(stat => {
    return `
      <div class="stat-item">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>${stat.label}</span>
          <span style="font-weight:600;color:var(--primary)">${stat.value}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderAccountInfo() {
  const container = document.getElementById('accountInfo');
  const [firstName, ...rest] = userProfile.name.split(' ');
  const lastName = rest.join(' ');
  container.innerHTML = `
    <div class="info-item">
      <label>First Name</label>
      <div>${firstName || ''}</div>
    </div>
    <div class="info-item">
      <label>Last Name</label>
      <div>${lastName || ''}</div>
    </div>
    <div class="info-item">
      <label>Email Address</label>
      <div>${userProfile.email}</div>
    </div>
    <div class="info-item">
      <label>Phone Number</label>
      <div>${userProfile.phone || 'Not provided'}</div>
    </div>
    <div class="info-item full-width">
      <label>Department</label>
      <div>Inventory Management</div>
    </div>
  `;
}

function renderActivityLog() {
  const container = document.getElementById('activityLog');
  container.innerHTML = activityLog.map(act => {
    const bgClass = act.color ? `bg-${act.color}-100` : '';
    const textClass = act.color ? `text-${act.color}-600` : '';
    return `
      <div class="activity-item card" style="padding:.6rem">
        <div class="activity-icon ${bgClass}">
          <i class="fas ${act.icon} ${textClass}"></i>
        </div>
        <div class="activity-content">
          <h4>${act.title}</h4>
          <p>${act.desc}</p>
          <p style="font-size:.8rem;color:#9ca3af">${act.time}</p>
        </div>
      </div>
    `;
  }).join('');
}

function updateTwoFAStatus() {
  const btn = document.getElementById('twoFABtn');
  const desc = document.getElementById('twoFADesc');
  const statusEl = document.getElementById('status');
  if (!btn || !desc || !statusEl) return;

  if (userProfile.twoFA) {
    btn.textContent = 'Disable';
    desc.textContent = 'Two-factor authentication is enabled for added security.';
    btn.classList.remove('btn-primary'); btn.classList.add('btn-secondary');
    statusEl.textContent = 'Active with 2FA';
  } else {
    btn.textContent = 'Enable';
    desc.textContent = 'Add an extra layer of security';
    btn.classList.remove('btn-secondary'); btn.classList.add('btn-primary');
    statusEl.textContent = 'Active';
  }
}

function openEditModal() {
  document.getElementById('editName').value = userProfile.name;
  document.getElementById('editEmail').value = userProfile.email;
  document.getElementById('editPhone').value = userProfile.phone || '';
  document.getElementById('editRole').value = userProfile.role || '';
  document.getElementById('editModal').style.display = 'flex';
}
function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
  document.getElementById('editForm').reset();
}
function saveProfile() {
  const name = document.getElementById('editName').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  const phone = document.getElementById('editPhone').value.trim();

  if (!name || !email) { alert('Name and email are required!'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email address!'); return; }

  userProfile.name = name;
  userProfile.email = email;
  userProfile.phone = phone;
  userProfile.lastLogin = new Date().toLocaleString();
  localStorage.setItem("userProfile", JSON.stringify(userProfile));

  renderProfile();
  renderAccountInfo();
  closeEditModal();
  alert('Profile updated successfully!');
}

function openPasswordModal() {
  document.getElementById('passwordModal').style.display = 'flex';
  document.getElementById('passwordForm').reset();
}
function closePasswordModal() {
  document.getElementById('passwordModal').style.display = 'none';
}
function changePassword() {
  const currentPass = document.getElementById('currentPass').value;
  const newPass = document.getElementById('newPass').value;
  const confirmPass = document.getElementById('confirmPass').value;

  if (!currentPass || !newPass || !confirmPass) { alert('All password fields are required!'); return; }
  if (newPass.length < 6) { alert('New password must be at least 6 characters long!'); return; }
  if (newPass !== confirmPass) { alert('New passwords do not match!'); return; }

  userProfile.passwordLastChanged = 'Just now';
  userProfile.lastLogin = new Date().toLocaleString();
  localStorage.setItem("userProfile", JSON.stringify(userProfile));
  renderProfile();
  closePasswordModal();
  alert('Password updated successfully! (Demo: No real backend verification)');

  activityLog.unshift({
    icon: "fa-lock",
    color: "blue",
    title: "Password changed",
    desc: "Account password was successfully updated",
    time: "Just now"
  });
  renderActivityLog();
}

function toggle2FA() {
  userProfile.twoFA = !userProfile.twoFA;
  localStorage.setItem("userProfile", JSON.stringify(userProfile));
  updateTwoFAStatus();
  const action = userProfile.twoFA ? 'enabled' : 'disabled';
  alert(`Two-Factor Authentication ${action}!`);

  activityLog.unshift({
    icon: "fa-shield-alt",
    color: userProfile.twoFA ? "green" : "orange",
    title: `2FA ${action}`,
    desc: `Two-factor authentication was ${action} for your account`,
    time: "Just now"
  });
  renderActivityLog();
}

function viewAllActivity() {
  alert('View all activity would open here (e.g., redirect to full log page).');
}

function signOut() {
  if (confirm('Are you sure you want to sign out?')) {
    alert('Signed out successfully!');
    window.location.href = 'index.html';
  }
}

window.onclick = function(event) {
  const editModal = document.getElementById('editModal');
  const passwordModal = document.getElementById('passwordModal');
  if (event.target === editModal) closeEditModal();
  if (event.target === passwordModal) closePasswordModal();
};

import { API_BASE_URL } from './config.js';

const result = document.querySelector('#verifyResult');
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

if (!token) {
  result.innerHTML = '<p class="error">Missing token</p>';
} else {
  verifyToken(token);
}

async function verifyToken(value) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/forms/verify/${value}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invalid token');
    }

    const info = data.data;

    result.innerHTML = `
      <h2>✅ Document is valid</h2>
      <ul>
        <li><strong>Name:</strong> ${info.full_name}</li>
        <li><strong>Email:</strong> ${info.email}</li>
        <li><strong>Employee ID:</strong> ${info.employee_id}</li>
        <li><strong>Department:</strong> ${info.department}</li>
        <li><strong>Issue Date:</strong> ${info.issue_date}</li>
        <li><strong>Created At:</strong> ${new Date(info.created_at).toLocaleString()}</li>
      </ul>
    `;
  } catch (error) {
    result.innerHTML = `<p class="error">❌ ${error.message}</p>`;
  }
}

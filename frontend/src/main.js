import { API_BASE_URL } from './config.js';

const form = document.querySelector('#pdfForm');
const result = document.querySelector('#result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${API_BASE_URL}/api/forms/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.join(', ') || data.message || 'Failed to generate PDF');
    }

    result.classList.remove('hidden');
    result.innerHTML = `
      <h2>Success</h2>
      <p>PDF generated successfully.</p>
      <p><a href="${data.verifyUrl}" target="_blank" rel="noreferrer">Open Verify Page</a></p>
      <p><a href="${data.downloadUrl}">Download PDF</a></p>
    `;

    window.location.href = data.downloadUrl;
  } catch (error) {
    result.classList.remove('hidden');
    result.innerHTML = `<p class="error">${error.message}</p>`;
  }
});

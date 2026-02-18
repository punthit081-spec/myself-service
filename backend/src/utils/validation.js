const REQUIRED_FIELDS = [
  'fullName',
  'email',
  'employeeId',
  'department',
  'issueDate'
];

export function validatePayload(payload = {}) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!payload[field] || !String(payload[field]).trim()) {
      errors.push(`${field} is required`);
    }
  }

  if (payload.email && !/^\S+@\S+\.\S+$/.test(payload.email)) {
    errors.push('email format is invalid');
  }

  return errors;
}

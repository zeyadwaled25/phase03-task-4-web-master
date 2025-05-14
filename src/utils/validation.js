export function validateField(field, value) {
  if (field.required && (!value || value.toString().trim() === '')) {
    return `${field.label} is required.`;
  }
  if (field.minLength && value && value.length < field.minLength) {
    return `${field.label} must be at least ${field.minLength} characters.`;
  }
  if (field.maxLength && value && value.length > field.maxLength) {
    return `${field.label} must be at most ${field.maxLength} characters.`;
  }
  if (field.type === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
    return 'Please enter a valid email address.';
  }
  if (field.type === 'tel' && value && !/^\+?\d{10,15}$/.test(value)) {
    return 'Please enter a valid phone number (10-15 digits, optional +).';
  }
  if (field.type === 'url' && value && !/^https?:\/\/.+/.test(value)) {
    return 'Please enter a valid URL (starting with http:// or https://).';
  }
  if (field.type === 'number' && value) {
    const num = Number(value);
    if (isNaN(num)) return `${field.label} must be a number.`;
    if (field.min !== undefined && num < field.min) {
      return `${field.label} must be at least ${field.min}.`;
    }
    if (field.max !== undefined && num > field.max) {
      return `${field.label} must be at most ${field.max}.`;
    }
  }
  if (field.pattern && value && !field.pattern.test(value)) {
    if (field.name === 'zipCode') {
      return 'Zip Code must be 12345 or 12345-6789.';
    }
    if (field.name === 'email') {
      return 'Please enter a valid email address.';
    }
    if (field.name === 'phone' || field.name === 'emergencyContact') {
      return 'Please enter a valid phone number (10-15 digits, optional +).';
    }
    if (field.name === 'website') {
      return 'Please enter a valid URL (starting with http:// or https://).';
    }
    return `Invalid format for ${field.label}.`;
  }
  return '';
} 
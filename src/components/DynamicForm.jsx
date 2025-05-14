import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import Swal from 'sweetalert2';
import { fieldConfig } from '../config/fieldConfig';
import { validateField } from '../utils/validation';

export default function DynamicForm() {
  const [formValues, setFormValues] = useState(() => {
    const initial = {};
    fieldConfig.forEach(f => { initial[f.name] = ''; });
    return initial;
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e, field) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(field, value);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field) => {
    const { name } = field;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(field, formValues[name]);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    fieldConfig.forEach(field => {
      const error = validateField(field, formValues[field.name]);
      if (error) errors[field.name] = error;
    });
    setFormErrors(errors);
    setTouched(fieldConfig.reduce((acc, field) => ({ ...acc, [field.name]: true }), {}));

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      Swal.fire({
        title: 'Success!',
        text: 'Form submitted successfully! 🎉',
        icon: 'success',
        confirmButtonColor:'#1976d2'
      });
      setFormValues(fieldConfig.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {}));
      setFormErrors({});
      setTouched({});
      setIsSubmitting(false);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please fix the errors in the form',
        icon: 'error',
        confirmButtonColor: '#1976d2'
      });
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Evil Manager and the Long Form</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {fieldConfig.map(field => (
            <div key={field.name} className="form-field">
              {field.type === 'select' ? (
                <FormControl 
                  fullWidth 
                  error={touched[field.name] && !!formErrors[field.name]}
                  variant="outlined"
                >
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    value={formValues[field.name]}
                    onChange={e => handleChange(e, field)}
                    onBlur={() => handleBlur(field)}
                    label={field.label}
                  >
                    <MenuItem value="">
                      <em>Select {field.label}</em>
                    </MenuItem>
                    {field.options.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                  {touched[field.name] && formErrors[field.name] && (
                    <FormHelperText>{formErrors[field.name]}</FormHelperText>
                  )}
                </FormControl>
              ) : field.type === 'textarea' ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name={field.name}
                  label={field.label}
                  value={formValues[field.name]}
                  onChange={e => handleChange(e, field)}
                  onBlur={() => handleBlur(field)}
                  error={touched[field.name] && !!formErrors[field.name]}
                  helperText={touched[field.name] && formErrors[field.name]}
                  variant="outlined"
                  required={field.required}
                />
              ) : (
                <TextField
                  fullWidth
                  type={field.type}
                  name={field.name}
                  label={field.label}
                  value={formValues[field.name]}
                  onChange={e => handleChange(e, field)}
                  onBlur={() => handleBlur(field)}
                  error={touched[field.name] && !!formErrors[field.name]}
                  helperText={touched[field.name] && formErrors[field.name]}
                  variant="outlined"
                  required={field.required}
                  InputProps={{
                    startAdornment: field.type === 'tel' && (
                      <span className="text-gray-500 mr-2">+</span>
                    )
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? (
            <React.Fragment>
              <span className="loading-spinner"></span>
              Submitting...
            </React.Fragment>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </div>
  );
} 
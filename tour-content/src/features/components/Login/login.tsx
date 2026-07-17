import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { API_URL } from '../../../config';
import { LoginInputs } from './types';

export const Login = () => {
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

    const onSubmit = async (data: LoginInputs) => {
    setServerError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

        if(!response.ok) {
            throw new Error(responseData.message || 'Cos poszło nie tak :(')
        }

        localStorage.setItem('access_token', responseData.access_token);
        localStorage.setItem('user', JSON.stringify(responseData.user));

        alert('Zalogowano pomyślnie jako: ' + responseData.user.name)
    }
    catch (err: any) {
        setServerError(err.message)
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Logowanie (React Hook Form)</h2>
      
      {/* Błąd z backendu */}
      {serverError && <p style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>{serverError}</p>}

      {/* Formularz spięty z handleSubmit z biblioteki */}
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="text"
            // Rejestrujemy input i dodajemy reguły walidacji
            {...register('email', { 
              required: 'Email jest wymagany!',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Niepoprawny format adresu email!'
              }
            })}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderColor: errors.email ? 'red' : '#ccc' }}
          />
          {/* Błąd walidacji pola email */}
          {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Hasło:</label>
          <input
            type="password"
            {...register('password', { 
              required: 'Hasło jest wymagane!',
              minLength: { value: 6, message: 'Hasło musi mieć minimum 6 znaków' }
            })}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderColor: errors.password ? 'red' : '#ccc' }}
          />
          {/* Błąd walidacji pola hasło */}
          {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>
    </div>
  )
};

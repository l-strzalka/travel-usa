//TravelUSA\tour-content\src\admin-panel\resources\products\create.tsx
import { API_URL } from '@/App';
import React, { useState, useEffect } from 'react';
import { useForm } from '@refinedev/react-hook-form';
import slugify from 'slugify';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { resolveImageUrl } from '../../../utils/imageUrl';

// Interfejs reprezentujący struktę danych formularza
interface ProductFormInputs {
  id: number;
  name: string;
  slug: string
  price: number;
  description: string;
  location?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
}

export const ProductCreate: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    saveButtonProps,
    setValue, // Służy do programistycznego ustawiania wartości w formularzu
    watch, // Służy do nasłuchiwania zmian w polach na żywo (potrzebne do podglądu zdjęcia)
  } = useForm<ProductFormInputs>({
    refineCoreProps: {
      resource: 'products',
      redirect: 'list',
    },
  });

  // Definiuje stany lokalne dla procesu przesyłania pliku
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const currentName = watch('name');

  useEffect(() => {
  if (currentName) {
    const generatedSlug = slugify(currentName, { lower: true, strict: true });
    setValue('slug', generatedSlug, { shouldValidate: true, shouldDirty: true });
  }
}, [currentName, setValue]);

  // Obserwuje pole imageUrl w celu renderowania podglądu zdjęcia
  const currentImageUrl = watch('imageUrl');

  /**
   * Obsługa asynchronicznego przesyłania pliku na serwer NestJS.
   */
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileToUpload = files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload);

    setIsUploading(true);
    setUploadError(null);

    try {
      const token = localStorage.getItem('auth_token');

      // Wykorzystujemy adres backendu Nest z uwzględnieniem prefiksu api
      const response = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (response.data && response.data.url) {
        // Aktualizujemy wartość pola imageUrl w react-hook-form
        setValue('imageUrl', response.data.url, { shouldValidate: true });
      }
    } catch (err: any) {
      console.error('Błąd uploadu:', err);
      setUploadError(
        err.response?.data?.message ||
          'Wystąpił błąd podczas przesyłania pliku na serwer.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  // ROZWIĄZANIE DLA REACT 19: Odfiltrowujemy focusElementRef oraz ref z saveButtonProps
  const { focusElementRef, ref, ...safeSaveButtonProps } =
    saveButtonProps as any;

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant='h5' mb={3}>
        Nowa Wycieczka
      </Typography>
      <Box component='form' onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            {...register('name', {
              required: 'Nazwa jest wymagana',
            })}
            label='Nazwa wycieczki'
            error={!!errors.name}
            helperText={
              typeof errors.name?.message === 'string'
                ? errors.name.message
                : ''
            }
            fullWidth
          />
          <TextField
            {...register('price', {
              required: 'Cena jest wymagana',
              min: {
                value: 0,
                message: 'Cena nie może być ujemna',
              },
              setValueAs: (value) => {
                if (value === '' || value === null || value === undefined)
                  return undefined;
                const parsed = Number(value.toString().replace(',', '.'));
                return isNaN(parsed) ? undefined : parsed;
              },
            })}
            label='Cena (PLN)'
            type='text'
            error={!!errors.price}
            helperText={
              typeof errors.price?.message === 'string'
                ? errors.price.message
                : ''
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register('description', { required: 'Opis jest wymagany' })}
            label='Pełny opis wycieczki'
            multiline
            rows={4}
            error={!!errors.description}
            helperText={
              typeof errors.description?.message === 'string'
                ? errors.description.message
                : ''
            }
            fullWidth
          />
          <TextField
            {...register('location')}
            label='Lokalizacja (np. California, USA)'
            fullWidth
          />

          {/* --- SEKCJA MODUŁU MEDIA / UPLOADU --- */}
          <Box
            sx={{
              border: '1px dashed',
              borderColor: uploadError ? 'error.main' : 'grey.400',
              p: 3,
              borderRadius: 1,
              textAlign: 'center',
              backgroundColor: 'grey.50',
            }}
          >
            <Typography
              variant='subtitle2'
              mb={1.5}
              sx={{ fontWeight: 'medium' }}
            >
              Zdjęcie wyróżniające ofertę
            </Typography>

            <Button
              component='label'
              variant='outlined'
              startIcon={
                isUploading ? (
                  <CircularProgress size={20} />
                ) : (
                  <CloudUploadIcon />
                )
              }
              disabled={isUploading}
              sx={{ mb: 2 }}
            >
              {isUploading ? 'Wysyłanie...' : 'Wybierz plik'}
              <input
                type='file'
                hidden
                accept='image/*'
                onChange={handleFileUpload}
              />
            </Button>

            {uploadError && (
              <Typography
                color='error'
                variant='caption'
                display='block'
                mb={2}
              >
                {uploadError}
              </Typography>
            )}

            {/* Input tekstowy pozostaje zsynchronizowany w razie ręcznego wklejenia linku zewnętrznego */}
            <TextField
              {...register('imageUrl')}
              label='Wygenerowany URL zdjęcia'
              fullWidth
              InputLabelProps={{ shrink: true }}
              placeholder='Zostanie uzupełniony automatycznie po przesłaniu pliku'
            />

            {/* Podgląd grafiki w czasie rzeczywistym */}
            {currentImageUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={resolveImageUrl(currentImageUrl)}
                  alt='Podgląd wycieczki'
                  style={{
                    maxWidth: '100%',
                    maxHeight: '180px',
                    borderRadius: '4px',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}
          </Box>
          {/* --- KONIEC SEKCJI UPLOADU --- */}

          <Stack direction='row' spacing={2}>
            <TextField
              {...register('latitude', { valueAsNumber: true })}
              label='Szerokość geograficzna (GPS)'
              type='number'
              inputProps={{ step: 'any' }}
              fullWidth
            />
            <TextField
              {...register('longitude', { valueAsNumber: true })}
              label='Długość geograficzna (GPS)'
              type='number'
              inputProps={{ step: 'any' }}
              fullWidth
            />
          </Stack>

          <Button
            {...safeSaveButtonProps} // Przekazujemy bezpieczny, oczyszczony obiekt
            variant='contained'
            size='large'
            type='submit'
            fullWidth
            disabled={isUploading}
          >
            Zapisz wycieczkę w bazie danych
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

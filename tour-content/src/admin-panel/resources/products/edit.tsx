import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, FRONTEND_URL } from '@/App';
import { useForm } from '@refinedev/react-hook-form';
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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { resolveImageUrl } from '../../../utils/imageUrl';


// Interfejs reprezentujący strukturę danych formularza wycieczki
interface ProductFormInputs {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  location?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
}

// Spójne adresy URL zadeklarowane w jednym miejscu


export const ProductEdit: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    saveButtonProps,
    refineCore: { queryResult },
    setValue,
    watch,
  } = useForm<ProductFormInputs>({
    refineCoreProps: {
      resource: 'products',
      redirect: 'list',
    },
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const currentImageUrl = watch('imageUrl');


  // ... wewnątrz komponentu ProductEdit:

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
      // 1. Zmieniamy ścieżkę na zgodną z kontrolerem NestJS: /upload zamiast /api/upload
      // 2. Używamy axiosInstance, który sam doklei token JWT do nagłówków
      const response = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data && response.data.url) {
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

  // ROZWIĄZANIE DLA REACT 19: Usuwamy focusElementRef i ref z właściwości przycisku zapisu
  const { focusElementRef, ref, ...safeSaveButtonProps } =
    saveButtonProps as any;

  // Pobranie aktualnych danych wycieczki z queryResult
  const productId = queryResult?.data?.data?.id;
  const productSlug = queryResult?.data?.data?.slug;

  // POPRAWKA ŚCIEŻKI PODGLĄDU: Zgodnie z konfiguracją trasy w App.tsx -> /:slug
  const previewUrl = productSlug ? `${FRONTEND_URL}/${productSlug}` : null;

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      {/* Nagłówek z przyciskiem podglądu */}
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        mb={3}
      >
        <Typography variant='h5'>Edytuj wycieczkę #{productId}</Typography>
        {previewUrl && (
          <Button
            href={previewUrl}
            target='_blank'
            rel='noopener noreferrer'
            variant='outlined'
            color='primary'
            size='small'
            startIcon={<OpenInNewIcon />}
          >
            Zobacz ofertę
          </Button>
        )}
      </Stack>

      <Box component='form' onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            {...register('name', { required: 'Nazwa jest wymagana' })}
            label='Nazwa wycieczki'
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
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
            helperText={errors.description?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register('location')}
            label='Lokalizacja'
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {/* Sekcja uploadu mediów */}
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

            <TextField
              {...register('imageUrl')}
              label='Wygenerowany URL zdjęcia'
              fullWidth
              InputLabelProps={{ shrink: true }}
              placeholder='Zostanie uzupełniony automatycznie po przesłaniu pliku'
            />

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

          <Stack direction='row' spacing={2}>
            <TextField
              {...register('latitude', { valueAsNumber: true })}
              label='Szerokość GPS'
              type='number'
              inputProps={{ step: 'any' }}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              /
            </Typography>
            <TextField
              {...register('longitude', { valueAsNumber: true })}
              label='Długość GPS'
              type='number'
              inputProps={{ step: 'any' }}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Button
            {...safeSaveButtonProps}
            variant='contained'
            color='success'
            size='large'
            type='submit'
            fullWidth
            disabled={isUploading}
          >
            Zapisz wprowadzone zmiany
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

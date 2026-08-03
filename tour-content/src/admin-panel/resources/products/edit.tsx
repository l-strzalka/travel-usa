// TravelUSA\tour-content\src\admin-panel\resources\products\edit.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, FRONTEND_URL } from '@/App';
import { useForm } from '@refinedev/react-hook-form';
import { useFieldArray } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { resolveImageUrl } from '../../../utils/imageUrl';

interface RoutePointInput {
  id?: number;
  latitude: number;
  longitude: number;
  stopOrder: number;
  title?: string;
}

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
  routePoints?: RoutePointInput[];
}

const parseOptionalNumber = (value: any) => {
  if (value === '' || value === null || value === undefined) return undefined;
  const parsed = Number(value.toString().replace(',', '.'));
  return isNaN(parsed) ? undefined : parsed;
};

export const ProductEdit: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    saveButtonProps,
    refineCore: { queryResult, onFinish },
    setValue,
    watch,
    control,
  } = useForm<ProductFormInputs>({
    refineCoreProps: {
      resource: 'products',
      redirect: 'list',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'routePoints',
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const currentImageUrl = watch('imageUrl');

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

  const { focusElementRef, ref, ...safeSaveButtonProps } = saveButtonProps as any;

  const productId = queryResult?.data?.data?.id;
  const productSlug = queryResult?.data?.data?.slug;
  const previewUrl = productSlug ? `${FRONTEND_URL}/${productSlug}` : null;

  const handleFormSubmit = (values: ProductFormInputs) => {
    // 1. Kopia obiektów z formularza
    const payload: Record<string, any> = { ...values };

    // Usuwamy ID głównego wycieczki z body (NestJS przekazuje je w URL)
    delete payload.id;

    // 2. Oczyszczanie routePoints – wycinamy 'id' i 'productId', zostawiamy tylko akceptowane pola DTO
    if (Array.isArray(payload.routePoints)) {
      payload.routePoints = payload.routePoints.map((point, index) => {
        return {
          title: point.title || '',
          latitude: parseOptionalNumber(point.latitude) ?? 0,
          longitude: parseOptionalNumber(point.longitude) ?? 0,
          stopOrder: index + 1,
        };
      });
    }

    // 3. Usuwanie wartości undefined
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    onFinish(payload as ProductFormInputs);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
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

      <Box component='form' onSubmit={handleSubmit(handleFormSubmit)} noValidate>
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
              setValueAs: parseOptionalNumber,
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
              {...register('latitude', { setValueAs: parseOptionalNumber })}
              label='Szerokość GPS'
              type='text'
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              /
            </Typography>
            <TextField
              {...register('longitude', { setValueAs: parseOptionalNumber })}
              label='Długość GPS'
              type='text'
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Divider />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant='h6'>Punkty trasy (Przystanki na mapie)</Typography>
              <Button
                variant='outlined'
                startIcon={<AddIcon />}
                onClick={() =>
                  append({
                    latitude: 0,
                    longitude: 0,
                    stopOrder: fields.length + 1,
                    title: '',
                  })
                }
              >
                Dodaj przystanek
              </Button>
            </Box>

            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Paper key={field.id} variant='outlined' sx={{ p: 2 }}>
                  <Stack direction='row' spacing={2} alignItems='center'>
                    <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                      #{index + 1}
                    </Typography>
                    <TextField
                      {...register(`routePoints.${index}.title`)}
                      label='Nazwa przystanku'
                      size='small'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      {...register(`routePoints.${index}.latitude`, { setValueAs: parseOptionalNumber })}
                      label='Lat'
                      type='text'
                      size='small'
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      {...register(`routePoints.${index}.longitude`, { setValueAs: parseOptionalNumber })}
                      label='Lng'
                      type='text'
                      size='small'
                      InputLabelProps={{ shrink: true }}
                    />
                    <IconButton
                      color='error'
                      onClick={() => remove(index)}
                      size='small'
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>

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
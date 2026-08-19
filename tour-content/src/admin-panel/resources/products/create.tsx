import { API_URL } from '@/App';
import React, { useState } from 'react';
import { useForm } from '@refinedev/react-hook-form';
import { useSelect } from '@refinedev/core';
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { resolveImageUrl } from '../../../utils/imageUrl';

export interface RoutePointInput {
  id?: number;
  latitude: number;
  longitude: number;
  stopOrder: number;
  title?: string;
}

export interface ProductFormInputs {
  id?: number;
  name: string;
  slug?: string;
  price: number;
  description: string;
  categoryId: number;
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

export const ProductCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    saveButtonProps,
    setValue,
    watch,
    control,
    refineCore: { onFinish },
  } = useForm<ProductFormInputs>({
    refineCoreProps: {
      resource: 'products',
      redirect: 'list',
    },
    defaultValues: {
      routePoints: [],
    },
  });

  const { options: categoryOptions, queryResult: categoryQueryResult } = useSelect({
    resource: 'categories',
    optionLabel: 'name',
    optionValue: 'id',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'routePoints',
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const currentImageUrl = watch('imageUrl');
  const selectedCategoryId = watch('categoryId');

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

  const handleFormSubmit = (values: ProductFormInputs) => {
    const { id, slug, routePoints, categoryId, ...restValues } = values;

    const payload: Record<string, any> = {
      ...restValues,
      categoryId: parseOptionalNumber(categoryId),
    };

    if (Array.isArray(routePoints)) {
      payload.routePoints = routePoints.map((point, index) => ({
        title: point.title || '',
        latitude: parseOptionalNumber(point.latitude) ?? 0,
        longitude: parseOptionalNumber(point.longitude) ?? 0,
        stopOrder: index + 1,
      }));
    }

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key],
    );

    onFinish(payload as any);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant='h5' mb={3}>
        Nowa Wycieczka
      </Typography>
      <Box component='form' onSubmit={handleSubmit(handleFormSubmit)} noValidate>
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

          <FormControl fullWidth error={!!errors.categoryId}>
            <InputLabel id='category-select-label'>Kategoria</InputLabel>
            <Select
              labelId='category-select-label'
              label='Kategoria'
              value={selectedCategoryId || ''}
              onChange={(e) => setValue('categoryId', Number(e.target.value), { shouldValidate: true })}
            >
              {categoryQueryResult.isLoading ? (
                <MenuItem disabled>Ładowanie kategorii...</MenuItem>
              ) : (
                categoryOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.categoryId && (
              <FormHelperText>{errors.categoryId.message as string}</FormHelperText>
            )}
          </FormControl>

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
              label='Szerokość geograficzna (GPS)'
              type='text'
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              {...register('longitude', { setValueAs: parseOptionalNumber })}
              label='Długość geograficzna (GPS)'
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
                    />
                    <TextField
                      {...register(`routePoints.${index}.latitude`, { setValueAs: parseOptionalNumber })}
                      label='Lat'
                      type='text'
                      size='small'
                    />
                    <TextField
                      {...register(`routePoints.${index}.longitude`, { setValueAs: parseOptionalNumber })}
                      label='Lng'
                      type='text'
                      size='small'
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
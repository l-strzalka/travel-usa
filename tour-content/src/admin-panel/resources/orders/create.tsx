import React from 'react';
import { Create } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { useSelect } from '@refinedev/core';
import { useFieldArray } from 'react-hook-form';
import {
  Box,
  TextField,
  Grid,
  Button,
  IconButton,
  Typography,
  Paper,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface OrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

interface OrderFormValues {
  customerName: string;
  customerEmail: string;
  customerPhone: number;
  userId?: number;
  items: OrderItemInput[];
}

export const OrderCreate: React.FC = () => {
  const {
    saveButtonProps,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormValues>({
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: undefined,
      userId: undefined,
      items: [{ productId: 0, quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const { options: productOptions, query: productsQuery } = useSelect({
    resource: 'products',
    optionLabel: 'name',
    optionValue: 'id',
  });

  const productsData = productsQuery?.data?.data || [];
  const watchedItems = watch('items');

  const handleProductChange = (index: number, productId: number) => {
    const selectedProduct = productsData.find((p) => p.id === productId);
    setValue(`items.${index}.productId`, productId);
    if (selectedProduct) {
      setValue(`items.${index}.price`, Number(selectedProduct.price) || 0);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps} title="Utwórz nowe zamówienie">
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h6">Dane Klienta</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              {...register('customerName', {
                required: 'Nazwa zamawiającego jest wymagana',
              })}
              error={!!errors.customerName}
              helperText={errors.customerName?.message}
              margin="dense"
              fullWidth
              label="Imię i nazwisko / Klient"
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              {...register('customerEmail', {
                required: 'Adres email jest wymagany',
              })}
              error={!!errors.customerEmail}
              helperText={errors.customerEmail?.message}
              margin="dense"
              fullWidth
              label="Adres E-mail"
              type="email"
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              {...register('customerPhone', {
                required: 'Numer telefonu jest wymagany',
                valueAsNumber: true,
              })}
              error={!!errors.customerPhone}
              helperText={errors.customerPhone?.message}
              margin="dense"
              fullWidth
              label="Telefon kontaktowy"
              type="number"
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              {...register('userId', {
                setValueAs: (v) => (v === '' || isNaN(v) ? undefined : Number(v)),
              })}
              margin="dense"
              fullWidth
              label="ID Użytkownika (opcjonalnie)"
              type="number"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Pozycje zamówienia</Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => append({ productId: 0, quantity: 1, price: 0 })}
          >
            Dodaj produkt
          </Button>
        </Box>

        {fields.map((field, index) => {
          const currentProductId = watchedItems?.[index]?.productId || 0;

          return (
            <Paper key={field.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel id={`product-select-label-${index}`}>Wycieczka / Produkt</InputLabel>
                    <Select
                      labelId={`product-select-label-${index}`}
                      value={currentProductId || ''}
                      label="Wycieczka / Produkt"
                      onChange={(e) => handleProductChange(index, Number(e.target.value))}
                    >
                      {productOptions?.map((option) => (
                        <MenuItem key={option.value} value={Number(option.value)}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    {...register(`items.${index}.quantity` as const, {
                      valueAsNumber: true,
                      required: 'Ilość jest wymagana',
                      min: { value: 1, message: 'Minimum 1' },
                    })}
                    margin="dense"
                    fullWidth
                    label="Ilość"
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    {...register(`items.${index}.price` as const, {
                      valueAsNumber: true,
                      required: 'Cena jest wymagana',
                    })}
                    margin="dense"
                    fullWidth
                    label="Cena jednostkowa (PLN)"
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} sm={1} sx={{ textAlign: 'center' }}>
                  <IconButton
                    color="error"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </Box>
    </Create>
  );
};
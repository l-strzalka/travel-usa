// tour-content/src/admin-panel/resources/orders/edit.tsx

import { useEffect } from 'react';
import { useForm } from '@refinedev/react-hook-form';
import { useSelect, useParsed, useNavigation } from '@refinedev/core';
import { useFieldArray, Controller } from 'react-hook-form';
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
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { OrderStatus } from './list';

export interface OrderItemInput {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderEditFormValues {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: number;
  userId?: number;
  status?: OrderStatus;
  items?: OrderItemInput[];
}

export const OrderEdit = () => {
  const { id } = useParsed();
  const { show } = useNavigation();

  const {
    refineCore: { query: queryResult, onFinish },
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<OrderEditFormValues>({
    refineCoreProps: {
      resource: 'orders',
      action: 'edit',
      id: id ? String(id) : undefined,
      redirect: false,
    },
  });

  const orderData = queryResult?.data?.data;
  const isLoadingOrder = queryResult?.isLoading;

  useEffect(() => {
    if (orderData) {
      reset({
        customerName: orderData.customerName ?? '',
        customerEmail: orderData.customerEmail ?? '',
        customerPhone: orderData.customerPhone ? Number(orderData.customerPhone) : undefined,
        status: orderData.status ?? 'PENDING',
        items: orderData.items?.map((item: any) => ({
          id: item.id,
          productId: item.tourId || item.productId || item.product?.id || 0,
          quantity: item.quantity ?? 1,
          price: item.price ?? item.unitPrice ?? 0,
        })) ?? [],
      });
    }
  }, [orderData, reset]);

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
    const selectedProduct = productsData.find((p: any) => p.id === productId);
    setValue(`items.${index}.productId`, productId, { shouldDirty: true });
    if (selectedProduct) {
      setValue(`items.${index}.price`, Number(selectedProduct.price) || 0, { shouldDirty: true });
    }
  };

  const onSubmit = async (values: OrderEditFormValues) => {
    const payload: Partial<OrderEditFormValues> = {};

    if (values.customerName !== undefined) payload.customerName = values.customerName;
    if (values.customerEmail !== undefined) payload.customerEmail = values.customerEmail;
    if (values.customerPhone !== undefined) payload.customerPhone = values.customerPhone;
    if (values.status !== undefined) payload.status = values.status;
    if (values.items !== undefined) {
      payload.items = values.items.map((item) => ({
        ...(item.id ? { id: item.id } : {}),
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));
    }

    await onFinish(payload);
    if (id) {
      show('orders', String(id));
    }
  };

  if (isLoadingOrder) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, pb: 6 }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        noValidate
        autoComplete="off"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => show('orders', String(id))}
            variant="outlined"
          >
            Powrót do zamówienia
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={!isDirty || isSubmitting}
          >
            Zapisz zmiany
          </Button>
        </Box>

        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Edycja Zamówienia #{id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Controller
                name="status"
                control={control}
                defaultValue="PENDING"
                render={({ field }) => (
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="order-status-label">Status Zamówienia</InputLabel>
                    <Select
                      {...field}
                      labelId="order-status-label"
                      label="Status Zamówienia"
                      value={field.value ?? ''}
                    >
                      <MenuItem value="PENDING">PENDING (Oczekujące)</MenuItem>
                      <MenuItem value="CONFIRMED">CONFIRMED (Potwierdzone)</MenuItem>
                      <MenuItem value="PAID">PAID (Opłacone)</MenuItem>
                      <MenuItem value="CANCELLED">CANCELLED (Anulowane)</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                {...register('customerName')}
                margin="dense"
                fullWidth
                label="Imię i nazwisko / Klient"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                {...register('customerEmail')}
                margin="dense"
                fullWidth
                label="Adres E-mail"
                type="email"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                {...register('customerPhone', { valueAsNumber: true })}
                margin="dense"
                fullWidth
                label="Telefon"
                type="number"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Pozycje zamówienia
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => append({ productId: 0, quantity: 1, price: 0 })}
            >
              Dodaj pozycję
            </Button>
          </Box>

          {fields.map((field, index) => {
            const currentProductId = watchedItems?.[index]?.productId || 0;

            return (
              <Paper key={field.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <FormControl fullWidth margin="dense">
                      <InputLabel id={`edit-product-select-label-${index}`}>
                        Wycieczka / Produkt
                      </InputLabel>
                      <Select
                        labelId={`edit-product-select-label-${index}`}
                        value={currentProductId || ''}
                        label="Wycieczka / Produkt"
                        onChange={(e) => handleProductChange(index, Number(e.target.value))}
                      >
                        {productOptions?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
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
                      })}
                      margin="dense"
                      fullWidth
                      label="Ilość"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      {...register(`items.${index}.price` as const, {
                        valueAsNumber: true,
                      })}
                      margin="dense"
                      fullWidth
                      label="Cena jednostkowa (PLN)"
                      type="number"
                      InputLabelProps={{ shrink: true }}
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
        </Paper>
      </Box>
    </Box>
  );
};
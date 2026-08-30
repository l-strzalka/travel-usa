import { Edit } from '@refinedev/mui';
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

enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

interface OrderItemInput {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
}

interface OrderEditFormValues {
  customerName: string;
  customerEmail: string;
  customerPhone: number;
  userId?: number;
  status: OrderStatus;
  items: OrderItemInput[];
}

export const OrderEdit = () => {
  const {
    saveButtonProps,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderEditFormValues>();

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
  const watchedStatus = watch('status');

  const handleProductChange = (index: number, productId: number) => {
    const selectedProduct = productsData.find((p) => p.id === productId);
    setValue(`items.${index}.productId`, productId);
    if (selectedProduct) {
      setValue(`items.${index}.price`, Number(selectedProduct.price) || 0);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps} title='Edycja zamówienia'>
      <Box
        component='form'
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        noValidate
        autoComplete='off'
      >
        <Typography variant='h6'>Szczegóły Zamówienia</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth margin='dense'>
              <InputLabel id='order-status-label'>Status Zamówienia</InputLabel>
              <Select
                labelId='order-status-label'
                value={watchedStatus || OrderStatus.PENDING}
                label='Status Zamówienia'
                {...register('status')}
                onChange={(e) =>
                  setValue('status', e.target.value as OrderStatus)
                }
              >
                <MenuItem value={OrderStatus.PENDING}>
                  PENDING (Oczekujące)
                </MenuItem>
                <MenuItem value={OrderStatus.CONFIRMED}>
                  CONFIRMED (Potwierdzone)
                </MenuItem>
                <MenuItem value={OrderStatus.PAID}>PAID (Opłacone)</MenuItem>
                <MenuItem value={OrderStatus.CANCELLED}>
                  CANCELLED (Anulowane)
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              {...register('customerName')}
              margin='dense'
              fullWidth
              label='Imię i nazwisko / Klient'
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              {...register('customerEmail')}
              margin='dense'
              fullWidth
              label='Adres E-mail'
              type='email'
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              {...register('customerPhone', { valueAsNumber: true })}
              margin='dense'
              fullWidth
              label='Telefon'
              type='number'
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant='h6'>Pozycje zamówienia</Typography>
          <Button
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={() => append({ productId: 0, quantity: 1, price: 0 })}
          >
            Dodaj pozycję
          </Button>
        </Box>

        {fields.map((field, index) => {
          const currentProductId = watchedItems?.[index]?.productId || 0;

          return (
            <Paper key={field.id} variant='outlined' sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth margin='dense'>
                    <InputLabel id={`edit-product-select-label-${index}`}>
                      Wycieczka / Produkt
                    </InputLabel>
                    <Select
                      labelId={`edit-product-select-label-${index}`}
                      value={currentProductId || ''}
                      label='Wycieczka / Produkt'
                      onChange={(e) =>
                        handleProductChange(index, Number(e.target.value))
                      }
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
                    margin='dense'
                    fullWidth
                    label='Ilość'
                    type='number'
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    {...register(`items.${index}.price` as const, {
                      valueAsNumber: true,
                    })}
                    margin='dense'
                    fullWidth
                    label='Cena jednostkowa (PLN)'
                    type='number'
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={1} sx={{ textAlign: 'center' }}>
                  <IconButton
                    color='error'
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
    </Edit>
  );
};

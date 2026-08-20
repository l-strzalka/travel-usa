import { useForm } from '@refinedev/react-hook-form';
import {
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
} from '@mui/material';

export interface CategoryFormInputs {
  id?: number;
  name: string;
  description?: string;
}

export const CategoryCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    saveButtonProps,
    refineCore: { onFinish },
  } = useForm<CategoryFormInputs>({
    refineCoreProps: {
      resource: 'categories',
      redirect: 'list',
    },
  });

  const { focusElementRef, ref, ...safeSaveButtonProps } = saveButtonProps as any;

  const handleFormSubmit = (values: CategoryFormInputs) => {
    onFinish(values);
  };

  const isEdit = false;

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" mb={3}>
        {isEdit ? 'Edytuj Kategorię' : 'Nowa Kategoria'}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((values) => handleFormSubmit(values as CategoryFormInputs))}
        noValidate
      >
        <Stack spacing={3}>
          <TextField
            {...register('name', { required: 'Nazwa kategorii jest wymagana' })}
            label="Nazwa kategorii"
            error={!!errors.name}
            helperText={typeof errors.name?.message === 'string' ? errors.name.message : ''}
            fullWidth
          />

          <TextField
            {...register('description')}
            label="Opis kategorii (opcjonalnie)"
            multiline
            rows={3}
            fullWidth
          />

          <Button
            {...safeSaveButtonProps}
            variant="contained"
            size="large"
            type="submit"
            fullWidth
          >
            {isEdit ? 'Zapisz zmiany' : 'Dodaj kategorię'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};
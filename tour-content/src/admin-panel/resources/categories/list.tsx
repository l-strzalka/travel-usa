import { useDelete, useTable } from '@refinedev/core';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export interface CategoryRecord {
  id: number;
  name: string;
  description?: string;
  createAt: string;
}

export const CategoryList = () => {
  const navigate = useNavigate();
  const { tableQueryResult } = useTable<CategoryRecord>({
    resource: 'categories',
  });

  const { mutate: deleteCategory } = useDelete();

  const categories = tableQueryResult?.data?.data ?? [];
  const isLoading = tableQueryResult?.isLoading;

  const handleDelete = (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć tą kategorię?')) {
      deleteCategory({
        resource: 'categories',
        id,
      });
    }
  };
  return (
    <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h5'>Kategorie Wycieczek</Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/categories/create')}
        >
          Dodaj kategorię
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nazwa</TableCell>
                <TableCell>Opis</TableCell>
                <TableCell align='right'>Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align='center'>
                    Brak kategorii w bazie danych.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {category.name}
                    </TableCell>
                    <TableCell>{category.description || '-'}</TableCell>
                    <TableCell align='right'>
                      <Stack
                        direction='row'
                        spacing={1}
                        justifyContent='flex-end'
                      >
                        <IconButton
                          color='primary'
                          onClick={() =>
                            navigate(`/admin/categories/edit/${category.id}`)
                          }
                          size='small'
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color='error'
                          onClick={() => handleDelete(category.id)}
                          size='small'
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

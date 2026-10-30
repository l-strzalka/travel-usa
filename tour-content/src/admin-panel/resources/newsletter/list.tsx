import {
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDelete, useTable } from '@refinedev/core';
import { useNavigate } from 'react-router-dom';



interface newsletterRecord {
  id: number;
  email: string;
  status: string
}

export const NewsletterList = () => {
  const { tableQueryResult } = useTable<newsletterRecord>({
    resource: 'newsletter',
  });

  const { mutate: DeleteNewsletter } = useDelete();
  const navigate = useNavigate();

  const newsletter = tableQueryResult?.data?.data ?? [];
  const isLoading = tableQueryResult?.isLoading;

  const handleDelete = (id: number) => {
    if (window.confirm('Czy napewno chcesz usunąć pozycje z newslettera?')) {
      DeleteNewsletter({
        resource: 'newsletter',
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
        }}
      >
        <Typography variant='h5'>Lista Subskrypcji</Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/newsletter/create')}
        >
          Dodaj Subskrypcje
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
                        <TableCell>Adres Email</TableCell> 
                        <TableCell>Status</TableCell> 
                        <TableCell align='right'>Akcje</TableCell> 
                    </TableRow>
                </TableHead>
                <TableBody>
                   { newsletter.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} align='center'>
                            Brak subskrupcji w bazie
                        </TableCell>
                    </TableRow>
                   ) : (
                    newsletter.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.status || '-'}</TableCell>
                            <TableCell align='right'><Button onClick={()=> handleDelete(item.id)}>Usuń</Button></TableCell>
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

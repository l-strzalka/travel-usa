// tour-content/src/admin-panel/resources/orders/show.tsx

import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../../../config';
import { OrderStatus, OrdersLabel } from './list';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: 'success' | 'primary' | 'warning' | 'error' | 'default' }
> = {
  PAID: { label: 'Zapłacone', color: 'success' },
  CONFIRMED: { label: 'Potwierdzone', color: 'primary' },
  PENDING: { label: 'Oczekujące', color: 'warning' },
  CANCELLED: { label: 'Anulowane', color: 'error' },
};

const fetchOrderById = async (id: string): Promise<OrdersLabel> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Zamówienie #${id} nie zostało znalezione.`);
    }
    throw new Error('Nie udało się pobrać szczegółów zamówienia.');
  }

  return response.json();
};

const updateOrderStatus = async ({
  orderId,
  newStatus,
}: {
  orderId: number;
  newStatus: OrderStatus;
}) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    throw new Error('Nie udało się zaktualizować statusu zamówienia');
  }

  return response.json();
};

export const OrderShow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading, isError, error } = useQuery<OrdersLabel, Error>({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id!),
    enabled: Boolean(id),
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (err: Error) => {
      alert(err.message || 'Błąd podczas zmiany statusu');
    },
  });

  const handleStatusSelectChange = (event: SelectChangeEvent<OrderStatus>) => {
    if (!order) return;
    const newStatus = event.target.value as OrderStatus;
    updateStatusMutation.mutate({ orderId: order.id, newStatus });
  };

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Skeleton variant="rectangular" width={180} height={40} />
          <Skeleton variant="rectangular" width={140} height={40} />
        </Box>
        <Paper sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="80%" height={25} />
              <Skeleton variant="text" width="40%" height={25} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width="50%" height={30} />
              <Skeleton variant="text" width="70%" height={25} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }

  if (isError || !order) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, p: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/orders')}
          sx={{ mb: 2 }}
        >
          Powrót do listy zamówień
        </Button>
        <Alert severity="error">
          {error?.message || 'Wystąpił błąd podczas ładowania zamówienia'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, pb: 6 }}>
      {/* Pasek nawigacji i akcji w nagłówku */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/orders')}
          variant="outlined"
        >
          Powrót do zamówień
        </Button>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="status-select-label">Status zamówienia</InputLabel>
            <Select
              labelId="status-select-label"
              value={order.status}
              label="Status zamówienia"
              onChange={handleStatusSelectChange}
              disabled={updateStatusMutation.isPending}
            >
              {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((statusKey) => (
                <MenuItem key={statusKey} value={statusKey}>
                  {STATUS_CONFIG[statusKey].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {updateStatusMutation.isPending && <CircularProgress size={24} />}

          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/admin/orders/edit/${order.id}`)}
          >
            Edytuj
          </Button>
        </Box>
      </Box>

      {/* Karta główna ze szczegółami */}
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        {/* Nagłówek zamówienia */}
        <Box
          sx={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Zamówienie #{order.id}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
            >
              <CalendarTodayIcon fontSize="inherit" />
              Złożono: {new Date(order.createdAt).toLocaleString('pl-PL')}
            </Typography>
          </Box>
          <Chip
            label={STATUS_CONFIG[order.status]?.label || order.status}
            color={STATUS_CONFIG[order.status]?.color || 'default'}
            sx={{ fontSize: '0.9rem', px: 1, py: 2 }}
          />
        </Box>

        {/* Dane Klienta i Podsumowanie Finansowe */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <PersonIcon color="primary" /> Dane Zamawiającego
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" fontWeight="medium" sx={{ mb: 1 }}>
                  {order.customerName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
                >
                  <EmailIcon fontSize="small" /> {order.customerEmail}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <PhoneIcon fontSize="small" /> {order.customerPhone}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <ReceiptIcon color="primary" /> Podsumowanie Płatności
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Liczba pozycji:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {order.items?.length || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Metoda płatności:
                  </Typography>
                  <Typography variant="body2">Przelew / Bramka online</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Łączna kwota:
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    PLN {order.totalAmount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pozycje zamówienia */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Zamówione wycieczki i usługi
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell><b>#</b></TableCell>
                <TableCell><b>Wycieczka / Usługa</b></TableCell>
                <TableCell align="center"><b>Data wycieczki</b></TableCell>
                <TableCell align="right"><b>Cena jedn.</b></TableCell>
                <TableCell align="center"><b>Ilość</b></TableCell>
                <TableCell align="right"><b>Suma</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => {
                  const unitPrice = item.unitPrice ?? item.price ?? 0;
                  const itemTotal = item.totalAmount ?? unitPrice * item.quantity;

                  return (
                    <TableRow key={item.id || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {item.product?.name || `Wycieczka #${item.tourId}`}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {item.tourDate
                          ? new Date(item.tourDate).toLocaleDateString('pl-PL')
                          : 'Standardowa'}
                      </TableCell>
                      <TableCell align="right">PLN {unitPrice}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          PLN {itemTotal}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Brak przypisanych pozycji w tym zamówieniu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
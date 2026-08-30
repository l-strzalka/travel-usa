import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState, useEffect } from 'react';
import { API_URL } from '../../../config';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';

export interface OrderItem {
  price: number;
  id: number;
  tourId: number;
  product: {
    id?: number;
    name: string;
  };

  quantity: number;
  unitPrice: number;
  totalAmount: number;
  tourDate?: string | Date;
}

export interface OrdersLabel {
  id: number;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string | Date;
   name: string
}

const getStatusChip = (status: OrderStatus) => {
  switch (status) {
    case 'PAID':
      return <Chip label="Zapłacone" color="success" size="small" />;
    case 'CONFIRMED':
      return <Chip label="Potwierdzone" color="primary" size="small" />;
    case 'PENDING':
      return <Chip label="Oczekujące" color="warning" size="small" />;
    case 'CANCELLED':
      return <Chip label="Anulowane" color="error" size="small" />;
    default:
      return <Chip label={status} size="small" />;
  }
};


export const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders ] = useState<OrdersLabel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
          setLoading(true)
          const token = localStorage.getItem('auth_token');
          const response = await fetch(`${API_URL}/orders`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });

          if (!response.ok) {
            throw new Error('Nie udało się pobrać listy zamówień')
          }

          const data: OrdersLabel[] = await response.json();
          setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Wystąpił błąd podczas ładowania danych, spróbuj ponownie')
       
      } finally {
         setLoading(false);
      }

    }
    fetchOrders();
  },[])

  return (
    <Paper sx={{ p: 3, maxWidth: 1100, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Najnowsze zamówienia
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/orders/create')}
        >
          Dodaj zamówienie
        </Button>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Klient</b></TableCell>
              <TableCell><b>Pozycje / Wycieczki</b></TableCell>
              <TableCell><b>Data</b></TableCell>
              <TableCell align="right"><b>Suma</b></TableCell>
              <TableCell align="center"><b>Status</b></TableCell>
              <TableCell align="center"><b>Akcje</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Brak zamówień do wyświetlenia.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const mainItem = order.items[0];
                const extraItemsCount = order.items.length - 1;

                return (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {order.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {order.customerEmail}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customerPhone}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {mainItem ? (
                        <>
                          <Typography variant="body2">{mainItem.product.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sztuk: {mainItem.quantity}
                            {mainItem.tourDate && ` | Data: ${new Date(mainItem.tourDate).toLocaleDateString('pl-PL')}`}
                          </Typography>
                          {extraItemsCount > 0 && (
                            <Typography variant="caption" color="primary" display="block">
                              + {extraItemsCount} inne pozycje
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary">Brak pozycji</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                       {`PLN ${mainItem.price}`}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {getStatusChip(order.status)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Zobacz szczegóły">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
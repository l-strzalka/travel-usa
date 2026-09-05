// tour-content/src/admin-panel/resources/orders/list.tsx

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
  Menu,
  MenuItem,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import { useState, MouseEvent, ChangeEvent } from 'react';
import { useQuery, useMutation, useQueryClient,} from '@tanstack/react-query';
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
  name: string;
}

export interface PaginatedOrdersResponse {
  data: OrdersLabel[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const STATUS_CONFIG: Record<OrderStatus, { 
  label: string; 
  color: 'success' | 'primary' | 'warning' | 'error' | 'default' 
}> = {
  PAID: { label: 'Zapłacone', color: 'success' },
  CONFIRMED: { label: 'Potwierdzone', color: 'primary' },
  PENDING: { label: 'Oczekujące', color: 'warning' },
  CANCELLED: { label: 'Anulowane', color: 'error' },
};

const getStatusChip = (status: OrderStatus) => {
  const config = STATUS_CONFIG[status] || { label: status, color: 'default' };
  return <Chip label={config.label} color={config.color} size="small" />;
};

const fetchOrders = async (page: number, limit: number): Promise<PaginatedOrdersResponse> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_URL}/orders?page=${page}&limit=${limit}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać listy zamówień');
  }

  return response.json();
};

const updateOrderStatus = async ({ orderId, newStatus }: { orderId: number; newStatus: OrderStatus }) => {
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
    throw new Error('Nie udało się zaktualizować statusu');
  }

  return response.json();
};

export const OrderList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Stany paginacji (MUI używa indeksowania od 0, backend od 1)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Stan dla menu kontekstowego
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrdersLabel | null>(null);

  const isMenuOpen = Boolean(anchorEl);

  // 1. Pobieranie zpaginowanych danych z TanStack Query
  const { data, isLoading, isError, error } = useQuery<PaginatedOrdersResponse, Error>({
    queryKey: ['orders', page + 1, rowsPerPage],
    queryFn: () => fetchOrders(page + 1, rowsPerPage),
  });

  const orders = data?.data || [];
  const totalCount = data?.meta.total || 0;

  // 2. Mutacja do zmiany statusu
  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (err: Error) => {
      alert(err.message || 'Błąd podczas zmiany statusu');
    },
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenMenu = (event: MouseEvent<HTMLElement>, order: OrdersLabel) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;

    const orderId = selectedOrder.id;
    handleCloseMenu();

    updateStatusMutation.mutate({ orderId, newStatus });
  };

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

      {isError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error?.message || 'Wystąpił błąd podczas ładowania danych'}
        </Typography>
      )}

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Klient</b></TableCell>
              <TableCell><b>Pozycje / Wycieczki</b></TableCell>
              <TableCell><b>Data Zamówienia</b></TableCell>
              <TableCell align="right"><b>Suma</b></TableCell>
              <TableCell align="center"><b>Status</b></TableCell>
              <TableCell align="center"><b>Akcje</b></TableCell>
              <TableCell align="center"><b>Więcej</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Brak zamówień do wyświetlenia.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const mainItem = order.items?.[0];
                const extraItemsCount = order.items ? order.items.length - 1 : 0;
                
                const isUpdating = 
                  updateStatusMutation.isPending && 
                  updateStatusMutation.variables?.orderId === order.id;

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
                          <Typography variant="body2">{mainItem.product?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sztuk: {mainItem.quantity}
                            {mainItem.tourDate && ` | Data: ${new Date(mainItem.tourDate).toLocaleDateString('pl-PL')}`}
                          </Typography>
                          {extraItemsCount > 0 && (
                            <Typography variant="caption" color="error" display="block">
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
                        {`PLN ${order.totalAmount}`}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      {isUpdating ? <CircularProgress size={20} /> : getStatusChip(order.status)}
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

                    <TableCell align="center">
                      <Tooltip title="Więcej opcji">
                        <IconButton
                          disabled={isUpdating}
                          onClick={(e) => handleOpenMenu(e, order)}
                        >
                          <MoreVertIcon />
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Wierszy na stronę:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} z ${count !== -1 ? count : `więcej niż ${to}`}`}
      />

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>
          Zmień status:
        </Typography>
        
        {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((statusKey) => {
          const config = STATUS_CONFIG[statusKey];
          const isCurrentStatus = selectedOrder?.status === statusKey;

          return (
            <MenuItem
              key={statusKey}
              selected={isCurrentStatus}
              disabled={isCurrentStatus}
              onClick={() => handleStatusChange(statusKey)}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" color={config.color !== 'default' ? config.color : undefined} />
              </ListItemIcon>
              <ListItemText>{config.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Paper>
  );
};
import React from 'react';
import { useDataGrid, List, EditButton, DeleteButton } from '@refinedev/mui';
import { Avatar, Box, Typography, IconButton, Tooltip, Chip } from '@mui/material';
import LandscapeIcon from '@mui/icons-material/Landscape';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FRONTEND_URL } from '../../../config';

interface ICategory {
  id: number;
  name: string;
}

interface IProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  imageUrl?: string | null;
  location?: string | null;
  category?: ICategory;
}

export const ProductList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IProduct>({
    syncWithLocation: true,
  });

  const columns = React.useMemo<GridColDef<IProduct>[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        type: 'number',
        width: 70,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'imageUrl',
        headerName: 'Miniaturka',
        width: 100,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          const src = params.value;
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Avatar
                src={src || undefined}
                alt={params.row.name}
                variant='rounded'
                sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: 'grey.200',
                  border: '1px solid',
                  borderColor: 'grey.300',
                }}
              >
                <LandscapeIcon sx={{ color: 'grey.500' }} />
              </Avatar>
            </Box>
          );
        },
      },
      {
        field: 'name',
        headerName: 'Nazwa wycieczki',
        flex: 1,
        minWidth: 180,
        renderCell: (params) => (
          <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'category',
        headerName: 'Kategoria',
        width: 150,
        valueGetter: (value, row) => row?.category?.name || '—',
        renderCell: (params) => (
          <Chip label={params.row?.category?.name || 'Ogólna'} size='small' variant='outlined' />
        ),
      },
      {
        field: 'location',
        headerName: 'Lokalizacja',
        width: 160,
        renderCell: (params) => params.value || '—',
      },
      {
        field: 'price',
        headerName: 'Cena (PLN)',
        type: 'number',
        width: 110,
        align: 'right',
        headerAlign: 'right',
        valueFormatter: (value) => {
          const actualValue =
            typeof value === 'object' && value !== null && 'value' in value
              ? (value as any).value
              : value;

          if (
            actualValue === null ||
            actualValue === undefined ||
            actualValue === ''
          ) {
            return '—';
          }

          const num = Number(actualValue);
          return isNaN(num) ? '—' : `${num.toFixed(2)} zł`;
        },
      },
      {
        field: 'preview',
        headerName: 'Podgląd',
        width: 90,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          const previewUrl = `${FRONTEND_URL}/${params.row.slug}`;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Tooltip title="Otwórz ofertę w nowej karcie">
                <IconButton
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  size="small"
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
      {
        field: 'actions',
        headerName: 'Akcje',
        width: 150,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <EditButton hideText size='small' recordItemId={params.row.id} />
            <DeleteButton hideText size='small' recordItemId={params.row.id} />
          </Box>
        ),
      },
    ],
    [],
  );

  return (
    <List title='Lista Dostępnych Wycieczek'>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        rowHeight={60}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'grey.200',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid',
            borderColor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
          },
        }}
      />
    </List>
  );
};
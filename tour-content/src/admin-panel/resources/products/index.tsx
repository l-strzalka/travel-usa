import React from "react";
import { 
    List, 
    useDataGrid, 
    EditButton, 
    ShowButton, 
    DeleteButton,
    Create,
    Edit,
    Show,
    DateField
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useForm } from "@refinedev/react-hook-form";
import { 
    Box, 
    TextField, 
    Typography, 
    Stack, 
    Grid2 as Grid 
} from "@mui/material";

// Ścisłe typowanie interfejsu zgodnie z modelem z schema.prisma
export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string | null;
    location?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt: string;
}

/* =========================================================================
   1. LISTA PRODUKTÓW (DataGrid z automatyczną paginacją i sortowaniem REST)
   ========================================================================= */
export const ProductList: React.FC = () => {
    // useDataGrid automatycznie mapuje zapytania do Data Providera (NestJS)
    const { dataGridProps } = useDataGrid<IProduct>({
        syncWithLocation: true,
    });

    const columns = React.useMemo<GridColDef<IProduct>[]>(
        () => [
            { field: "id", headerName: "ID", width: 70, type: "number" },
            { field: "name", headerName: "Nazwa Oferty", flex: 1, minWidth: 200 },
            {
                field: "price",
                headerName: "Cena",
                width: 130,
                type: "number",
                valueFormatter: (value) => {
                    if (value == null) return "";
                    return new Intl.NumberFormat("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                    }).format(value);
                },
            },
            { field: "location", headerName: "Lokalizacja", width: 150 },
            {
                field: "createdAt",
                headerName: "Utworzono",
                width: 160,
                renderCell: function render({ value }) {
                    return <DateField value={value} format="LLL" />;
                },
            },
            {
                field: "actions",
                headerName: "Akcje",
                sortable: false,
                width: 150,
                renderCell: function render({ row }) {
                    return (
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}>
                            <EditButton hideText size="small" recordItemId={row.id} />
                            <ShowButton hideText size="small" recordItemId={row.id} />
                            <DeleteButton hideText size="small" recordItemId={row.id} />
                        </Box>
                    );
                },
            },
        ],
        [],
    );

    return (
        <List title="Zarządzanie Ofertami Wycieczek">
            <DataGrid {...dataGridProps} columns={columns} autoHeight rowsPerPageOptions={[10, 20, 50]} />
        </List>
    );
};

/* =========================================================================
   2. KREACJA - DODAWANIE NOWEJ OFERTY (Zintegrowane z React Hook Form)
   ========================================================================= */
export const ProductCreate: React.FC = () => {
    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IProduct>();

    return (
        <Create isLoading={formLoading} saveButtonProps={{ onClick: handleSubmit(onFinish) }} title="Dodaj nową wycieczkę">
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <TextField
                            {...register("name", { required: "Nazwa oferty jest wymagana" })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            label="Nazwa wycieczki"
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            {...register("price", { 
                                required: "Cena jest wymagana",
                                valueAsNumber: true,
                                validate: (val) => val >= 0 || "Cena nie może być ujemna"
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                            label="Cena (PLN)"
                            type="number"
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            {...register("description", { required: "Opis wycieczki jest wymagany" })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            label="Pełny opis planu podróży"
                            multiline
                            rows={4}
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            {...register("imageUrl")}
                            label="URL Zdjęcia głównego"
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            {...register("location")}
                            label="Lokalizacja docelowa (np. Kalifornia, USA)"
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            {...register("latitude", { valueAsNumber: true })}
                            label="Szerokość geograficzna (GPS)"
                            type="number"
                            inputProps={{ step: "any" }}
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            {...register("longitude", { valueAsNumber: true })}
                            label="Długość geograficzna (GPS)"
                            type="number"
                            inputProps={{ step: "any" }}
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Create>
    );
};

/* =========================================================================
   3. EDYCJA ISTNIEJĄCEJ OFERTY
   ========================================================================= */
export const ProductEdit: React.FC = () => {
    const {
        refineCore: { onFinish, formLoading, queryResult },
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IProduct>();

    const productData = queryResult?.data?.data;

    return (
        <Edit 
            isLoading={formLoading} 
            saveButtonProps={{ onClick: handleSubmit(onFinish) }} 
            title={`Edycja Oferty #${productData?.id}`}
        >
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <TextField
                            {...register("name", { required: "Nazwa oferty jest wymagana" })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            label="Nazwa wycieczki"
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            {...register("price", { 
                                required: "Cena jest wymagana",
                                valueAsNumber: true,
                                validate: (val) => val >= 0 || "Cena nie może być ujemna"
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                            label="Cena (PLN)"
                            type="number"
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            {...register("description", { required: "Opis wycieczki jest wymagany" })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            label="Pełny opis planu podróży"
                            multiline
                            rows={4}
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            {...register("imageUrl")}
                            label="URL Zdjęcia głównego"
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            {...register("location")}
                            label="Lokalizacja docelowa"
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            {...register("latitude", { valueAsNumber: true })}
                            label="Szerokość geograficzna (GPS)"
                            type="number"
                            inputProps={{ step: "any" }}
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            {...register("longitude", { valueAsNumber: true })}
                            label="Długość geograficzna (GPS)"
                            type="number"
                            inputProps={{ step: "any" }}
                            fullWidth
                            slotProps={{ label: { shrink: true } }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Edit>
    );
};

/* =========================================================================
   4. PODGLĄD SZCZEGÓŁÓW OFERTY WYCIECZKI
   ========================================================================= */
export const ProductShow: React.FC = () => {
    const { refineCore: { queryResult } } = useForm<IProduct>();
    const { data, isLoading } = queryResult ?? {};
    const record = data?.data;

    return (
        <Show isLoading={isLoading} title={`Podgląd Oferty #${record?.id}`}>
            <Stack gap={2}>
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">Nazwa wycieczki:</Typography>
                    <Typography variant="body1">{record?.name}</Typography>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">Lokalizacja:</Typography>
                    <Typography variant="body1">{record?.location || "Brak zdefiniowanej lokalizacji"}</Typography>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">Cena:</Typography>
                    <Typography variant="body1">
                        {record?.price != null 
                            ? new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(record.price)
                            : ""
                        }
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">Opis szczegółowy:</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>{record?.description}</Typography>
                </Box>
                {(record?.latitude || record?.longitude) && (
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="bold">Współrzędne GPS:</Typography>
                        <Typography variant="body1">Lat: {record?.latitude}, Lng: {record?.longitude}</Typography>
                    </Box>
                )}
                {record?.imageUrl && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mb: 1 }}>Zdjęcie podglądowe:</Typography>
                        <Box 
                            component="img" 
                            src={record.imageUrl} 
                            alt={record.name} 
                            sx={{ maxWidth: "100%", maxHeight: 350, borderRadius: 2, boxShadow: 1 }} 
                        />
                    </Box>
                )}
            </Stack>
        </Show>
    );
};
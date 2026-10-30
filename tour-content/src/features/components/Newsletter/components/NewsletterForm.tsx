import {
  Box,
  TextField,
  FormControlLabel,
  Typography,
  Button,
  Checkbox,
  Alert,
} from '@mui/material';
import { useForm, FieldError } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { API_URL } from '@/config';
import { useMutation, useQueryClient } from '@tanstack/react-query';

//Walidacja zod

const emailRegex =
  /^(?=.{1,254}$)(?=.{1,64}@)(?!\.)(?!.*\.\.)([\p{L}0-9_'+\-\.]*)[\p{L}0-9_+-]@([\p{L}0-9][\p{L}0-9\-]*\.)+[\p{L}]{2,}$/iu;

export const NewsletterSchema = z.object({
  email: z.string().email({ pattern: emailRegex }),
  marketingConsent: z.boolean().refine((val) => val === true, {
    message: 'Musisz wyrazić zgodę na przetwarzanie danych',
  }),
});
console.log(
  NewsletterSchema.parse({
    email: 'żółw.krakow@domena.pl',
    marketingConsent: true,
  }),
);

type Newsletter = z.infer<typeof NewsletterSchema>;

//OBSŁUGA BŁĘDÓW

export const ErrorMessage = ({
  fieldError,
}: {
  fieldError: FieldError | undefined;
}) => {
  if (!fieldError) {
    return null;
  }
  return <Alert sx={{ color: '#962929' }}>{fieldError.message}</Alert>;
};

export const NewsletterForm = () => {
  // OBSŁUGA WYSYŁANIA FORMULARZA

  const pushEmail = async (newsletter: Newsletter) => {
    const response = await axios.post(
      `${API_URL}/newsletter/subscribe`,
      newsletter,
    );

    return response.data;
  };
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: pushEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter'] });
    },
  });

  //FUNKCJA OBSŁUGI FORMULARZA => USEFORM
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Newsletter>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: { email: '', marketingConsent: false },
  });

  //OBSŁUGA WYSŁANIA FORMULARZA

  const onSubmit = (data: Newsletter) => {
    mutate(data);
  };

  if (isSuccess) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography
          sx={{ color: 'green', fontWeight: 600, fontSize: '1.1rem' }}
        >
          Formularz wysłano pomyślnie. Sprawdź swoją skrzynkę e-mail i potwierdź
          zaproszenie do Newslettera.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component='section'
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '450px',
        // Słoneczne, rajskie tło z Bahamów/Hawajów z lekkim przyciemnieniem dla kontrastu
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 16,
        px: 2,
        mb: 10,
      }}
    >
      {/* Kontener karty formularza */}
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(6px)',
          p: { xs: 3, sm: 4, md: 5 },
          width: '100%',
          maxWidth: 520,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 0 0 8px #c9b175;',
        }}
      >
        {isSuccess ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography
              sx={{ color: 'green', fontWeight: 600, fontSize: '1.1rem' }}
            >
              Formularz wysłano pomyślnie. Sprawdź swoją skrzynkę e-mail i
              potwierdź zapis do newslettera.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography
              variant='h6'
              component='h2'
              align='center'
              sx={{
                mb: 3,
                fontWeight: 500,
                color: 'text.primary',
                letterSpacing: 1,
              }}
            >
              NEWSLETTER
            </Typography>

            <Typography
              variant='h5'
              component='h3'
              align='center'
              sx={{
                ml: 3,
                mr: 3,
                mb: 3,
                fontWeight: 500,
                color: 'text.primary',
              }}
            >
              Najlepsze okazje i inspirujące historie z Ameryki
            </Typography>

            <Box
              component='form'
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ width: '100%', maxWidth: 375 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label='Adres e-mail'
                  type='email'
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                />
                <ErrorMessage fieldError={errors.email} />

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Checkbox
                    {...register('marketingConsent')}
                    sx={{ color: '#e57373', p: 0 }}
                  />

                  <Typography
                    component='span'
                    sx={{
                      color: '#333333',
                      fontSize: '0.7rem',
                      cursor: 'default',
                      textAlign: 'start',
                    }}
                  >
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu
                    dystrybucji Newslettera. Szczegóły Polityki Prywatności
                    dotyczące Newslettera, w tym informację o przysługujących Ci
                    uprawnieniach znajdziesz tutaj.
                  </Typography>
                </Box>

                <ErrorMessage fieldError={errors.marketingConsent} />
              </Box>

              <Button
                type='submit'
                variant='contained'
                disabled={isPending}
                fullWidth
                sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
              >
                {isPending ? 'Wysyłanie...' : 'Wyślij'}
              </Button>

              {isError && (
                <Alert severity='error' sx={{ mt: 2 }}>
                  {axios.isAxiosError(error)
                    ? error.response?.data?.message ||
                      'Wystąpił błąd podczas wysyłania danych.'
                    : 'Wystąpił nieznany błąd.'}
                </Alert>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

import React, { useState } from "react";
import { useLogin } from "@refinedev/core";
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Alert
} from "@mui/material";

type LoginVariables = {
 email: string;
  password: string;
};

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Hook z Refine przekazuje wywołanie bezpośrednio do metody login() w naszym authProvider
  const { mutate: login, isLoading, error } = useLogin<LoginVariables>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && password) {
      login({ email, password });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Card variant="outlined" sx={{ width: "100%", padding: 2 }}>
          <CardContent>
            <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
              Panel Logowania Biura
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
              Zaloguj się na konto administratora, aby zarządzać ofertami USA.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error.message || "Błąd autoryzacji"}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Adres E-mail"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Hasło"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2, padding: "10px 0" }}
              >
                {isLoading ? "Logowanie..." : "Zaloguj się"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
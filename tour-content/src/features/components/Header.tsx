import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "../../sass/main.scss";

export interface HeaderProps {
  /**
   * home - przeźroczysty nagłówek, który po przewinięciu zmienia tło na #1976d2
   * static - nagłówek ze stałym tłem #1976d2
   */
  variant?: "home" | "static";
}

const NAV_ITEMS = [
  { label: "Strona Główna", path: "/" },
  { label: "Eksploruj", path: "/explore" },
  { label: "Planner", path: "/planner" },
  { label: "Zaloguj", path: "/login" },
];

export const Header: React.FC<HeaderProps> = ({ variant = "static" }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // MUI Hook wykrywający skrolowanie (uruchamia się po 20px)
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 20,
  });

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // Kalkulacja logiki wariantu strony głównej i statycznej
  const isTransparent = variant === "home" && !trigger;
  const TEXT_COLOR = "#d49800"; 

  return (
    <>
      <AppBar
        position="fixed"
        elevation={isTransparent ? 0 : 4}
        sx={{
          backgroundColor: isTransparent ? "transparent" : "#1976d2",
          transition: (theme) =>
            theme.transitions.create(["background-color", "box-shadow", "padding"], {
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            
            {/* LOGO */}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: TEXT_COLOR,
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              USA Escape
            </Typography>

            {/* NAWIGACJA - WIDOK DESKTOP */}
            <Box
              sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}
              component="nav"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      color: TEXT_COLOR,
                      fontWeight: isActive ? 700 : 500,
                      borderBottom: isActive ? `2px solid ${TEXT_COLOR}` : "2px solid transparent",
                      borderRadius: 0,
                      px: 2,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "rgba(212, 152, 0, 0.1)", // Delikatny hover w kolorze #d49800
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            {/* PRZYCISK MENU - WIDOK MOBILE */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ color: TEXT_COLOR,}}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* MENU BOCZNE - WIDOK MOBILE (DRAWER) */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Poprawia wydajność na mobile
        PaperProps={{
          sx: { width: 280, color: "#fff", backgroundColor: "#1976d2" },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          
          {/* HEADER MENU MOBILNEGO */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ color: TEXT_COLOR }}>
              USA Escape
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* LISTA LINKÓW MOBILNYCH */}
          <List sx={{ pt: 1 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to={item.path}
                    onClick={handleDrawerToggle}
                    selected={isActive}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "rgba(212, 152, 0, 0.08)",
                        borderLeft: `4px solid ${TEXT_COLOR}`,
                        "& .MuiListItemText-primary": {
                          color: TEXT_COLOR,
                          fontWeight: "bold",
                        },
                      },
                    }}
                  >
                    <ListItemText 
                      primary={item.label} 
                      sx={{ color: isActive ? TEXT_COLOR : "inherit" }} 
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
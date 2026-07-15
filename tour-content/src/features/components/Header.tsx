import '../../sass/main.scss'
// import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [animateStatic, setAnimateStatic] = useState(true);
  const topRef = useRef(null);

  useEffect(() => { 
    const observer = new IntersectionObserver(
         ([entry]) => { 
            const sticky = !entry.isIntersecting; 
            setIsSticky(sticky); 
            if (sticky) { 
                setAnimateStatic(false); 
            } 
        }, 
        { root: null, 
            threshold: 0, } ); 
            if (topRef.current) { 
                observer.observe(topRef.current); 
            } return () => { 
                if (topRef.current) { 
                    observer.unobserve(topRef.current); 
                } 
            }; 
        }, []); 
        
        const className = [ "navbar", isSticky ? "sticky" : "static", 
            !isSticky && animateStatic ? "static-animate" : "", ].join(" ");   

  return (
        <>
            <div ref={topRef} style={{ height: "1px" }} />
            <nav className={className}>
                <header id="navbar-trl">

                    <Toolbar className="toolbar-trl">
                        <ToggleButtonGroup>
                        <ToggleButton size="small">
                            <MenuIcon fontSize="small" />
                        </ToggleButton>
                        </ToggleButtonGroup>
                    </Toolbar>

                    <Typography variant={"h6"}>
                        Dziki Zachód
                    </Typography>

                    <div id="menu-trl">
                        <Link to="/">Strona Główna</Link>
                        <Link to="/explore">Eksploruj</Link>
                        <Link to="/planner">Planner</Link>
                    </div>

                </header>
            </nav>
        </>
  );
};

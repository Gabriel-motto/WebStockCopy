import "./App.css";
import { useEffect, useState } from "react";
import Sidebar, { CollapsedSidebar } from "./components/sidebar/Sidebar.jsx";
import Router from "./Router.jsx";
import { ROUTES } from "./utils/consts";
import {
    checkSupabaseConnection,
    isSupabaseConfigured,
} from "./utils/supabase";

function ConnectionStatus() {
    const [status, setStatus] = useState(
        isSupabaseConfigured ? "checking" : "config",
    );

    useEffect(() => {
        if (!isSupabaseConfigured) return;
        checkSupabaseConnection().then((result) => {
            if (!result.ok) console.warn("Supabase no disponible:", result.error);
            setStatus(result.ok ? "ok" : "error");
        });
    }, []);

    if (status === "config") {
        return (
            <div className="app-status app-status-error">
                <strong>Base de datos no configurada.</strong>
                <span>
                    Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en esta
                    compilación, así que no se pueden cargar los datos.
                </span>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="app-status app-status-error">
                <strong>No se puede conectar con la base de datos.</strong>
                <span>
                    El proyecto de Supabase con los datos de ejemplo puede
                    estar en pausa. Los datos no se mostrarán hasta que vuelva
                    a estar disponible.
                </span>
            </div>
        );
    }

    return null;
}

function App() {
    return (
        <div className="page-container">
            <div className="header">
                <img
                    src={`${import.meta.env.BASE_URL}assets/ExampleLogo.png`}
                    alt="Example Logo"
                    className="header-logo"
                />

                <div className="burger-menu">
                    <CollapsedSidebar />
                </div>
            </div>
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="main-panel">
                {isSupabaseConfigured && <Router routes={ROUTES} />}
            </div>
            <div className="main-footer">
                Created by Gabriel Motto
            </div>
            <ConnectionStatus />
        </div>
    );
}

export default App;

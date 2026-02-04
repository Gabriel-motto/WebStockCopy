import "./App.css";
import Header from "./components/header/Header.jsx";
import Sidebar, { CollapsedSidebar } from "./components/sidebar/Sidebar.jsx";
import Router from "./Router.jsx";
import { ROUTES } from "./utils/consts";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
    return (
        <>
            <div className="page-container">
                <div className="header">
                    <img
                        src="src/assets/ExampleLogo.png"
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
                    <Router routes={ROUTES} />
                </div>
                <div className="main-footer">
                    Created by Gabriel Motto
                </div>
            </div>
            <Analytics />
            <SpeedInsights />
        </>
    );
}

export default App;

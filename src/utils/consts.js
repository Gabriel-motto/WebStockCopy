export const EVENTS = {
    PUSHSTATE: 'pushstate',
    POPSTATE: 'popstate'
}


import HomePage from "../pages/Home/Home.jsx";
import MachinesPage from "../pages/Machines/Machines.jsx";
import PiecesPage from "../pages/Pieces/Pieces.jsx";
import SummaryPage from "../pages/Summary.jsx";
export const ROUTES = [
    {
        path: "/",
        Component: HomePage
    },
    {
        path: "/machines",
        Component: MachinesPage
    },
    {
        path: "/machines/:name",
        Component: MachinesPage
    },
    {
        path: "/pieces",
        Component: PiecesPage
    },
    {
        path: "/pieces/:name",
        Component: PiecesPage
    },
    {
        path: "/summary",
        Component: SummaryPage
    },
]

export const COLOR = {
    PRIMARYCOLOR: "#60A5FA",
    SECONDARYCOLOR: "#1F2937",
    BACKGROUNDCOLOR: "#4B5563",
    TEXTCOLOR: "#F9FAFB",
}

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
    CORPYELLOW: "#FBBA00",
    CORPBLUE: "#1A2B42",
}

import { Component } from "react";

// Keeps a page crash (e.g. missing data when the DB is unreachable)
// from blanking the whole app.
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="page-error">
                    <strong>No se pudo mostrar esta página.</strong>
                    <span>
                        Puede que los datos no estén disponibles en este
                        momento. Prueba a recargar o vuelve más tarde.
                    </span>
                </div>
            );
        }
        return this.props.children;
    }
}

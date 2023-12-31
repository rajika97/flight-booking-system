import "./App.css";
import { LoginPage } from "./pages/login";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/home";
import { FlightsPage } from "./pages/flight";
import { ReservationsPage } from "./pages/reservation";
import { ManagementPage } from "./pages/manage";
import Unauthrorized from "./pages/unauthorized";
import PageNotFound from "./pages/404";
import { AuthContextProvider } from "./auth/auth-context";
import AuthenticatedComponent from "./auth/authenticated-route";

function App() {
    return (
        <AuthContextProvider>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route
                        path="home"
                        element={
                            <AuthenticatedComponent>
                                <HomePage />
                            </AuthenticatedComponent>
                        }
                    >
                        <Route path="flights" element={<FlightsPage />} />
                        <Route
                            path="reservations"
                            element={<ReservationsPage />}
                        />
                        <Route path="manage" element={<ManagementPage />} />
                    </Route>
                    <Route path="/unauthorized" element={<Unauthrorized />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </div>
        </AuthContextProvider>
    );
}

export default App;

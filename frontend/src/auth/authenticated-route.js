import { Navigate } from "react-router-dom"
import { useAuthContext } from "./auth-context"
import { Spin } from "antd";

const AuthenticatedComponent = (props) => {
    const {
        children,
    } = props;

    const { isAuthenticated, isLoading } = useAuthContext();

    const LoadingSpinner = () => {
        return (
            <div className="loading-container">
                <Spin size="large" />
                <p>Loading... Please wait.</p>
            </div>
        )
    }
    
    if (isLoading) {
        return LoadingSpinner();
    }

    if (isAuthenticated) {
        
        return (
            <>
                { children }
            </>
        );
    }

    return <Navigate to="/unauthorized" />;
}

export default AuthenticatedComponent;

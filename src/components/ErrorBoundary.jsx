import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorBoundary = ({ children }) => {
  const navigate = useNavigate();

  const handleError = (error) => {
    console.error("Erreur non gérée :", error);
    navigate("/login"); // Rediriger vers la page de connexion
  };

  return (
    <React.Fragment>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { onError: handleError });
      })}
    </React.Fragment>
  );
};

export default ErrorBoundary;
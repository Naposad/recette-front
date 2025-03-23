import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import du fichier CSS

const Navbar = () => {
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = !!localStorage.getItem("access_token");

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/"); // Rediriger vers la page de connexion
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        MyRecipes
      </Link>{" "}
      {/* Ajout d'un logo */}
      <div>
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/ingredients">Ingredients</Link>
        <Link to="/shopping-list/all">Shopping List</Link>

        {/* Afficher "Login" et "Register" si l'utilisateur n'est pas connecté */}
        {!isAuthenticated && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {/* Afficher "Logout" si l'utilisateur est connecté */}
        {isAuthenticated && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Importez le fichier CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // État de chargement
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple des champs
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    setIsLoading(true); // Activer l'état de chargement
    setError(''); // Réinitialiser les erreurs

    try {
      const response = await axios.post('http://localhost:5000/login/', {
        email,
        mot_de_passe: password, // Utilisez le nom de champ attendu par le backend
      });

      // Stocker les tokens dans le localStorage
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      // Afficher un message de succès et rediriger
      alert('Connexion réussie !');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);

      // Gestion des erreurs
      if (error.response) {
        // Erreur renvoyée par le backend
        setError(error.response.data.message || 'Identifiants incorrects. Veuillez réessayer.');
      } else if (error.request) {
        // Erreur de réseau (pas de réponse du serveur)
        setError('Problème de réseau. Veuillez réessayer.');
      } else {
        // Autres erreurs
        setError('Une erreur s\'est produite. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false); // Désactiver l'état de chargement
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
      <p className="register-link">
        Vous n'avez pas de compte ? <Link to="/register">Inscrivez-vous ici</Link>.
      </p>
    </div>
  );
};

export default Login;
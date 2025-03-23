import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateIngredient.css'; // Importez le fichier CSS

const CreateIngredient = () => {
  const [nom, setNom] = useState('');
  const [uniteMesure, setUniteMesure] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const ingredientData = {
      nom,
      unite_mesure: uniteMesure,
      prix_unitaire: prixUnitaire,
    };

    try {
      // Envoyer les données au backend
      await axios.post('http://localhost:5000/ingredients/', ingredientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Rediriger vers la page des ingrédients après la création
      navigate('/ingredients');
    } catch (error) {
      console.error('Failed to create ingredient', error);
      setError('Erreur lors de la création de l\'ingrédient. Veuillez réessayer.');

      // Gérer les erreurs d'authentification
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/login');
      }
    }
  };

  return (
    <div className="create-ingredient-container">
      <h1>Créer un Ingrédient</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom de l'ingrédient :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Unité de mesure :</label>
          <input
            type="text"
            value={uniteMesure}
            onChange={(e) => setUniteMesure(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prix unitaire :</label>
          <input
            type="number"
            value={prixUnitaire}
            onChange={(e) => setPrixUnitaire(e.target.value)}
            required
          />
        </div>
        <button type="submit">Créer l'ingrédient</button>
      </form>
    </div>
  );
};

export default CreateIngredient;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditRecipe.css'; // Importez le fichier CSS

const EditIngredient = () => {
  const { id } = useParams(); // Récupère l'ID de l'ingrédient depuis l'URL
  const [nom, setNom] = useState('');
  const [unite_mesure, setUnite_mesure] = useState('');
  const [prix_unitaire, setPrix_unitaire] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fonction pour rafraîchir le token d'accès
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      localStorage.removeItem('access_token');
      navigate('/login');
      return null;
    }

    try {
      const response = await axios.post('http://localhost:5000/refresh-token/', {
        refresh_token: refreshToken,
      });
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      return access_token;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token :', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
      return null;
    }
  };

  // Récupérer les détails de l'ingrédient
  useEffect(() => {
    const fetchIngredient = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Récupérer les détails de l'ingrédient
        const response = await axios.get(`http://localhost:5000/ingredients/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const ingredient = response.data;

        // Pré-remplir les champs du formulaire
        setNom(ingredient.nom);
        setUnite_mesure(ingredient.unite_mesure);
        setPrix_unitaire(ingredient.prix_unitaire);
      } catch (error) {
        console.error('Failed to fetch ingredient', error);

        // Gérer les erreurs d'authentification
        if (error.response && error.response.status === 401) {
          // Essayer de rafraîchir le token
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retenter la requête avec le nouveau token
            const response = await axios.get(`http://localhost:5000/ingredients/${id}/`, {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            const ingredient = response.data;
            setNom(ingredient.nom);
            setUnite_mesure(ingredient.unite_mesure);
            setPrix_unitaire(ingredient.prix_unitaire);
          }
        } else {
          setError('Erreur lors de la récupération des détails de l\'ingrédient.');
        }
      }
    };

    fetchIngredient();
  }, [id, navigate]);

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!nom || !unite_mesure || !prix_unitaire) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const ingredientData = {
      nom,
      unite_mesure,
      prix_unitaire: parseFloat(prix_unitaire), // Convertir en nombre
    };

    try {
      // Envoyer une requête PUT pour mettre à jour l'ingrédient
      await axios.put(`http://localhost:5000/ingredients/${id}/`, ingredientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Afficher un message de succès
      setSuccess('Ingrédient mis à jour avec succès !');
      setError('');

      // Rediriger vers la liste des ingrédients après 2 secondes
      setTimeout(() => {
        navigate('/ingredients');
      }, 2000);
    } catch (error) {
      console.error('Failed to update ingredient', error);

      // Gérer les erreurs d'authentification
      if (error.response && error.response.status === 401) {
        // Essayer de rafraîchir le token
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Retenter la requête avec le nouveau token
          await axios.put(`http://localhost:5000/ingredients/${id}/`, ingredientData, {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          setSuccess('Ingrédient mis à jour avec succès !');
          setError('');
          setTimeout(() => {
            navigate('/ingredients');
          }, 2000);
        }
      } else {
        setError('Erreur lors de la mise à jour de l\'ingrédient. Veuillez réessayer.');
      }
    }
  };

  return (
    <div className="edit-recipe-container">
      <h1>Modifier l'ingrédient</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
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
            value={unite_mesure}
            onChange={(e) => setUnite_mesure(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prix unitaire :</label>
          <input
            type="number"
            value={prix_unitaire}
            onChange={(e) => setPrix_unitaire(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Mettre à jour l'ingrédient
        </button>
      </form>
    </div>
  );
};

export default EditIngredient;
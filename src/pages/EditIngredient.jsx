import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditRecipe.css'; // Importez le fichier CSS

const EditIngredient = () => {
  const { id } = useParams(); // Récupère l'ID de la recette depuis l'URL
  const [nom, setNom] = useState('');
  const [unite_mesure, setUnite_mesure] = useState('');
  const [prix_unitaire, setPrix_unitaire] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Récupérer les détails de la recette
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
        console.error('Failed to fetch recipe or ingredients', error);
      }
    };

    fetchRecipe();
  });

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    alert('token'+token);
    if (!token) {
      navigate('/login');
      return;
    }

    const recipeData = {
      nom,
      prix_unitaire,
      unite_mesure,
    };

    try {
      // Envoyer une requête PUT pour mettre à jour la recette
      await axios.put(`http://localhost:5000/ingredients/${id}/`, recipeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/ingredients'); // Rediriger vers la liste des recettes après la mise à jour
    } catch (error) {
      console.error('Failed to update ingredient', error);
    }
  };

  return (
    <div className="edit-recipe-container">
      <h1>Modifier l' ingredient</h1>
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
            type='text'
            value={unite_mesure}
            onChange={(e) => setUnite_mesure(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prix unitaire :
          </label>
          <input
            type="number"
            value={prix_unitaire}
            onChange={(e) => setPrix_unitaire(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Mettre à jour l'ingredient
        </button>
      </form>
    </div>
  );
};

export default EditIngredient;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Fichier CSS pour styliser les cartes

const Home = () => {
  const [publicRecipes, setPublicRecipes] = useState([]); // Liste des recettes publiques
  const navigate = useNavigate();

  // Récupérer les recettes publiques depuis le backend
  useEffect(() => {
    const fetchPublicRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/recipe/public/');        setPublicRecipes(response.data);
      } catch (error) {
        console.error('Failed to fetch public recipes', error);
      }
    };

    fetchPublicRecipes();
  }, []);

  // Rediriger vers la page de détails de la recette
  const handleRecipeClick = (id) => {
    navigate(`/recipe-detail/${id}`);
  };

  return (
    <div className="home">
      <h1>Recettes Publiques</h1>
      <div className="recipe-grid">
        {publicRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipe-card"
            onClick={() => handleRecipeClick(recipe.id)}
          >
            <h2>{recipe.titre}</h2>
            <p><strong>Temps de préparation :</strong> {recipe.temps_preparation} minutes</p>
            <p><strong>Temps de cuisson :</strong> {recipe.temps_cuisson} minutes</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
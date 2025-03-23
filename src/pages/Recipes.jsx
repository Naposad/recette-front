import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Recipes.css'; // Importez le fichier CSS

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  // Récupérer les recettes de l'utilisateur
  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/recipe/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecipes(response.data);
      } catch (error) {
        console.error('Failed to fetch recipes', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      }
    };

    fetchRecipes();
  }, [navigate]);

  // Supprimer une recette
  const handleDeleteRecipe = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/recipe/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecipes(recipes.filter(recipe => recipe.id !== id)); // Mettre à jour la liste des recettes
    } catch (error) {
      console.error('Failed to delete recipe', error);
    }
  };

  return (
    <div className="recipes-container">
      <div className='containerglobal'>
        <h1>Mes Recettes</h1>
        <Link to='/create-recipe'>
          <button className='moncontainer'>creer recette</button>
        </Link>
      </div>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h2>{recipe.titre}</h2>
            <h5>Temps de préparation :{recipe.temps_preparation}</h5>

            <button
              className="edit-button"
              onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
            >
              Modifier
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteRecipe(recipe.id)}
            >
              Supprimer
            </button>
            <button
              className="detail-button"
              onClick={() => navigate(`/recipe-detail/${recipe.id}`)}
            >
              Detail 
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recipes;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Ingredients.css'; // Importez le fichier CSS

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]); // Liste des ingrédients
  const navigate = useNavigate();

  // Récupérer les ingrédients de l'utilisateur
  useEffect(() => {
    const fetchIngredients = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/ingredients/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIngredients(response.data);
      } catch (error) {
        console.error('Failed to fetch ingredients', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      }
    };

    fetchIngredients();
  }, [navigate]);

  // Supprimer un ingrédient
  const handleDeleteIngredient = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/ingredients/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIngredients(ingredients.filter(ing => ing.id !== id));
    } catch (error) {
      console.error('Failed to delete ingredient', error);
    }
  };

  return (
    <div className="ingredients-container">
      <h1>Gestion des Ingrédients</h1>

      {/* Bouton pour créer un nouvel ingrédient */}
      <Link to="/create-ingredient">
        <button className="create-button">Créer un nouvel ingrédient</button>
      </Link>

      {/* Liste des ingrédients */}
      <h2>Mes Ingrédients</h2>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            <span>{ingredient.nom} - {ingredient.unite_mesure} - {ingredient.prix_unitaire} €</span>
            <Link to={'/edit-ingredient/'+ingredient.id}>
            <button
              className="edit-button"
            >
              Modifier
            </button>
            </Link>
            <button
              className="delete-button"
              onClick={() => handleDeleteIngredient(ingredient.id)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ingredients;
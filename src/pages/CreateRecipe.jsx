import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateRecipe.css'; // Importez le fichier CSS

const CreateRecipe = () => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [tempsPreparation, setTempsPreparation] = useState('');
  const [tempsCuisson, setTempsCuisson] = useState('');
  const [estPublique, setEstPublique] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [userIngredients, setUserIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ ingredient_id: '', quantite: '', unite_mesure: '' });
  const navigate = useNavigate();

  // Récupérer les ingrédients de l'utilisateur
  useEffect(() => {
    const fetchUserIngredients = async () => {
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
        setUserIngredients(response.data);
      } catch (error) {
        console.error('Failed to fetch user ingredients', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      }
    };

    fetchUserIngredients();
  }, [navigate]);

  // Mettre à jour l'unité de mesure lorsque l'ingrédient est sélectionné
  const handleIngredientChange = (e) => {
    const selectedIngredientId = e.target.value;
    const selectedIngredient = userIngredients.find(ing => ing.id === parseInt(selectedIngredientId));

    setNewIngredient({
      ...newIngredient,
      ingredient_id: selectedIngredientId,
      unite_mesure: selectedIngredient ? selectedIngredient.unite_mesure : '',
    });
  };

  // Gérer l'ajout d'un ingrédient à la liste
  const handleAddIngredient = () => {
    if (newIngredient.ingredient_id && newIngredient.quantite && newIngredient.unite_mesure) {
      const selectedIngredient = userIngredients.find(ing => ing.id === parseInt(newIngredient.ingredient_id));
      setIngredients([...ingredients, { ...selectedIngredient, quantite: newIngredient.quantite, unite_mesure: newIngredient.unite_mesure }]);
      setNewIngredient({ ingredient_id: '', quantite: '', unite_mesure: '' });
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const recipeData = {
      titre,
      description,
      temps_preparation: tempsPreparation,
      temps_cuisson: tempsCuisson,
      est_publique: estPublique,
      ingredients: ingredients.map(ing => ({
        ingredient_id: ing.id,
        nom: ing.nom,
        quantite: ing.quantite,
        unite_mesure: ing.unite_mesure,
      })),
    };

    try {
      const response = await axios.post('http://localhost:5000/recipe/', recipeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/recipes');
    } catch (error) {
      console.error('Failed to create recipe', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  return (
    <div className="create-recipe-container">
      <h1>Créer une Recette</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre:</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Temps de préparation (minutes):</label>
          <input
            type="number"
            value={tempsPreparation}
            onChange={(e) => setTempsPreparation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Temps de cuisson (minutes):</label>
          <input
            type="number"
            value={tempsCuisson}
            onChange={(e) => setTempsCuisson(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            Recette publique :
            <input
              type="checkbox"
              checked={estPublique}
              onChange={(e) => setEstPublique(e.target.checked)}
            />
          </label>
        </div>

        <div className="ingredient-section">
          <h3>Ingrédients</h3>
          <div className="ingredient-form">
            <select
              value={newIngredient.ingredient_id}
              onChange={handleIngredientChange}
            >
              <option value="">Sélectionner un ingrédient</option>
              {userIngredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.nom}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantité"
              value={newIngredient.quantite}
              onChange={(e) => setNewIngredient({ ...newIngredient, quantite: e.target.value })}
            />
            <input
              type="text"
              placeholder="Unité de mesure"
              value={newIngredient.unite_mesure}
              onChange={(e) => setNewIngredient({ ...newIngredient, unite_mesure: e.target.value })}
              readOnly
            />
            <button type="button" onClick={handleAddIngredient}>
              Ajouter un ingrédient
            </button>
          </div>
          <div className="create-ingredient-link">
            <a href="/create-ingredient">Créer un nouvel ingrédient</a>
          </div>
        </div>

        <div className="added-ingredients">
          <h4>Ingrédients ajoutés :</h4>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.nom} - {ingredient.quantite} {ingredient.unite_mesure}
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="submit-button">
          Créer la recette
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipeDetails.css'; // Fichier CSS pour styliser la page de détails

const RecipeDetails = () => {
    const { id } = useParams(); // Récupère l'ID de la recette depuis l'URL
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Récupérer les détails de la recette
    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                // Récupérer le token depuis le localStorage
                const token = localStorage.getItem('access_token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Ajouter le token dans l'en-tête de la requête
                const response = await axios.get(`http://localhost:5000/recipe-detail/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setRecipe(response.data);
            } catch (error) {
                console.error('Failed to fetch recipe details', error);
                setError(error.response?.data?.message || 'Une erreur s\'est produite lors de la récupération des détails de la recette.');
            }
        };

        fetchRecipeDetails();
    }, [id, navigate]);

    // Fonction pour générer la liste de courses
    const handleGenerateShoppingList = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/list-course/',
                { recette_id: id, inventaire_id: 1 }, // Remplacez 1 par l'ID de l'inventaire approprié
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.ingredients_manquants) {
                // Rediriger vers la page de la liste de courses avec les données
                navigate('/shopping-list', { state: { shoppingList: response.data.ingredients_manquants } });
            } else {
                alert(response.data.message); // Afficher un message si tous les ingrédients sont disponibles
            }
        } catch (error) {
            console.error('Failed to generate shopping list', error);
            setError('Erreur lors de la génération de la liste de courses.');
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!recipe) {
        return <div>Chargement en cours...</div>;
    }

    return (
        <div className="recipe-details">
            <h1>{recipe.titre}</h1>
            <p>{recipe.description}</p>
            <p><strong>Temps de préparation :</strong> {recipe.temps_preparation} minutes</p>
            <p><strong>Temps de cuisson :</strong> {recipe.temps_cuisson} minutes</p>
            <h2>Ingrédients :</h2>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.nom} - {ingredient.quantite} {ingredient.unite_mesure}
                    </li>
                ))}
            </ul>

            {/* Bouton pour générer la liste de courses */}
            <button onClick={handleGenerateShoppingList} className="generate-list-button">
                Générer la liste de courses
            </button>
        </div>
    );
};

export default RecipeDetails;
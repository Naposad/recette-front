import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ShoppingListDetails.css'; // Fichier CSS pour styliser la page

const ShoppingListDetails = () => {
  const { listId } = useParams(); // Récupérer l'ID de la liste de courses depuis l'URL
  const [shoppingList, setShoppingList] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Récupérer les détails de la liste de courses
  useEffect(() => {
    const fetchShoppingListDetails = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/shopping-list/details/${listId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setShoppingList(response.data);
      } catch (error) {
        console.error('Failed to fetch shopping list details', error);
        setError('Erreur lors de la récupération des détails de la liste de courses.');
      }
    };

    fetchShoppingListDetails();
  }, [listId, navigate]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!shoppingList) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className="shopping-list-details-container">
      <h1>Détails de la Liste de Courses</h1>
      <p>Liste générée le {new Date(shoppingList.date_creation).toLocaleDateString()}</p>
      <ul>
        {shoppingList.items.map((item, index) => (
          <li key={index}>
            {item.nom} - {item.quantite} {item.unite_mesure}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/shopping-list/all')}>Retour à la liste</button>
    </div>
  );
};

export default ShoppingListDetails;
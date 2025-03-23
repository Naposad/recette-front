import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AllShoppingLists.css'; // Fichier CSS pour styliser la page

const AllShoppingLists = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Récupérer toutes les listes de courses
  useEffect(() => {
    const fetchShoppingLists = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/shopping-list/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setShoppingLists(response.data.shopping_lists);
      } catch (error) {
        console.error('Failed to fetch shopping lists', error);
        setError('Erreur lors de la récupération des listes de courses.');
      }
    };

    fetchShoppingLists();
  }, [navigate]);

  // Rediriger vers les détails d'une liste de courses
  const handleViewDetails = (listId) => {
    navigate(`/shopping-list/details/${listId}`);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="all-shopping-lists-container">
      <h1>Mes Listes de Courses</h1>
      {shoppingLists.length > 0 ? (
        <ul>
          {shoppingLists.map((list) => (
            <li key={list.id} className="shopping-list-item">
              <div>
                <h3>Liste du {new Date(list.date_creation).toLocaleDateString()}</h3>
                <p>{list.nombre_ingredients} ingrédients</p>
              </div>
              <button onClick={() => handleViewDetails(list.id)}>Voir les détails</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune liste de courses générée.</p>
      )}
    </div>
  );
};

export default AllShoppingLists;
import React from 'react';
import { useLocation } from 'react-router-dom';
import './ShoppingListPage.css'; // Fichier CSS pour styliser la page

const ShoppingListPage = () => {
  const location = useLocation();
  const shoppingList = location.state?.shoppingList || [];

  return (
    <div className="shopping-list-container">
      <h1>Liste de Courses</h1>
      {shoppingList.length > 0 ? (
        <ul>
          {shoppingList.map((item, index) => (
            <li key={index}>
              {item.nom} - Quantité à acheter: {item.quantite_a_acheter} {item.unite_mesure}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun ingrédient manquant. Vous avez tout ce qu'il vous faut !</p>
      )}
    </div>
  );
};

export default ShoppingListPage;
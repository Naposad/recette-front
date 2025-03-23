import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./components/Navbar";
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import CreateRecipe from './pages/CreateRecipe';
import Ingredients from './pages/Ingredient';
import CreateIngredient from './pages/CreateIngredient';
import EditRecipe from "./pages/EditRecipe";
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import ShoppingListPage from './components/ShoppingListPage';
import AllShoppingLists from './components/AllShoppingLists';
import ShoppingListDetails from './components/ShoppingListDetails';
import EditIngredient from './pages/EditIngredient';

const App = () => {
  const navigate = useNavigate();

  // Fonction pour rafraîchir l'access token
  const refreshAccessToken = async () => {
    const access_token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken && access_token) {
      navigate('/login');  // Rediriger vers la page de connexion si aucun refresh token n'est disponible
      return;
    }
      const Body = {
        "refresh_token": refreshToken
      }
    try {
      const response = await axios.post('http://127.0.0.1:5000/refresh-token/', Body);
      const { access_token } = response.data
      localStorage.setItem('access_token', access_token);  // Mettre à jour l'access token
      return access_token;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token :', error);
      //localStorage.removeItem('access_token');
      //localStorage.removeItem('refresh_token');
      navigate('/login');  // Rediriger vers la page de connexion en cas d'erreur
      return null;
    }
  };

  // Intercepteur pour rafraîchir le token
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Si l'erreur est due à un token expiré (statut 401) et que la requête n'a pas déjà été retentée
        if (error.response.status === 500 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Rafraîchir l'access token
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Mettre à jour l'en-tête d'autorisation avec le nouveau token
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            alert(originalRequest.headers['Authorization']);
            return axios(originalRequest);  // Retenter la requête avec le nouveau token
          }
        }

        return Promise.reject(error);
      }
    );

    // Intercepteur pour ajouter l'access token aux requêtes sortantes
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    });

    // Nettoyer les intercepteurs lors du démontage du composant
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipe-detail/:id" element={<RecipeDetails />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />
        <Route path="/shopping-list/all" element={<AllShoppingLists />} />
        <Route path="/shopping-list/details/:listId" element={<ShoppingListDetails />} />
        <Route path="/create-recipe" element={<CreateRecipe />} />
        <Route path="/create-ingredient" element={<CreateIngredient />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        <Route path="/edit-ingredient/:id" element={<EditIngredient />} />

      </Routes>
    </div>
  );
};

export default App;
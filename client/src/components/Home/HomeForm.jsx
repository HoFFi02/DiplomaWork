import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/home.css';
import '../../css/tables.css';
import '../../css/modal.css';
import DaysTable from './Day/DaysTable';
import RecipeAddForm from './Recipe/RecipeAddForm';
import RecipesTable from './Recipe/RecipesTable';
import { useTranslation } from 'react-i18next';
import API_URL from '../../hooks/url';

function HomeForm({ user, isMobile}) {
  const [days, setDays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);

  const { t, i18n} = useTranslation();
  const language = i18n.language;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get(`${API_URL}/api/products?language=${language}`);
        setProducts(productsRes.data);  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [language]);
  
  if (!user) {
    return <div>Brak danych użytkownika</div>;
  }
  const handleAddRecipe = async (newRecipe) => {
    try {
      await axios.post(`${API_URL}/api/recipes?language=${language}`, newRecipe);
      setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };
  return (

    <div className="main-table-container">
      <div className="days-table">
        <h2>{t('daysPlan')}</h2>
        <DaysTable days={days} userId={user.id_user} isMobile={isMobile}/>
      </div>
      <div className="recipes-table">
        <h2>{t('recipes')}</h2>
        <div className="add-button-container">
    <button className="add-button" onClick={() => setShowForm(true)}>
      {t('addRecipe')}
    </button>
  </div>
      <RecipeAddForm
        showForm={showForm}
        setShowForm={setShowForm}
        onSubmit={handleAddRecipe}
        products={products}
      />
        <RecipesTable />
      </div>
    </div>
  );
}

export default HomeForm;
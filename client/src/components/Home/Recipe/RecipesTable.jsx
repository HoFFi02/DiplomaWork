import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Recipe from './Recipe';
import API_URL from '../../../hooks/url';
import { useTranslation } from 'react-i18next';

const RecipesTable = () => {
  const [recipes, setRecipes] = useState([]);
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipesRes = await axios.get(`${API_URL}/api/recipes?language=${language}`);
        setRecipes(recipesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [language]);

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>{t('recipeName')}</th>
            <th>
              {t('ingredients')}
            </th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe, index) => (
            <Recipe key={recipe.id_recipe || index + 1} recipe={recipe} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipesTable;

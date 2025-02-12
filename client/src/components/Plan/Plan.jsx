import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../../hooks/url';
import { useTranslation } from 'react-i18next';

const MEAL_IDS = { breakfast: 1, lunch: 2, dinner: 3 };

function Plan({ day, userId, onClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  
  const { t, i18n} = useTranslation();
  const language = i18n.language;
 

  const handleShowButtonClick = async (mealType) => {
    const recipeId = day[`${mealType}_recipe_id`];
    if (!recipeId) return; 

    try {
      const response = await axios.get(`${API_URL}/api/recipes/${recipeId}?language=${language}`);
      setRecipeDetails(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Błąd podczas pobierania szczegółów przepisu:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRecipeDetails(null);
  };

  const deleteFromShoppingList = async (number_of_day, recipe_id_recipe) => {
    try {
      await axios.post(
        `${API_URL}/api/shopping_list/delete/${userId}`,
        { number_of_day, recipe_id_recipe },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Błąd podczas aktualizacji listy zakupów:', error);
    }
  };

  const handleDeleteButtonClick = async (mealType, recipeId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/days/delete/${userId}?language=${language}`,
        {
          recipe_id_recipe: recipeId,
          number_of_day: day.number_of_day,
          month: day.month,
          year: day.year,
          meal_id_meal: MEAL_IDS[mealType],
          user_id: userId,
        },
        { withCredentials: true }
      );
      onClick(response.data.updatedDay);
      await deleteFromShoppingList(day.number_of_day, recipeId);
    } catch (error) {
      console.error('Błąd podczas usuwania przepisu: ', error);
    }
  };

  const isPastDay = () => {
    const today = new Date();
    const dayDate = new Date(day.year, day.month - 1, day.number_of_day + 1);
    return dayDate < today;
  };

  const rowClass = isPastDay() ? 'past-day' : '';

  const renderMealCell = (mealType) => {
    const recipeName = day[`${mealType}_recipe_name`];
    const recipeId = day[`${mealType}_recipe_id`];
    return (
      <td className={`meal-cell ${rowClass}`}>
        <div className="meal-content">
          {recipeName || '-'}
          {recipeName && ( 
            <div className="plan-button-container">
              <button className="show-button" onClick={() => handleShowButtonClick(mealType)}>
              </button>
              <button
                className="trash-button"
                onClick={() => handleDeleteButtonClick(mealType, recipeId)}
              >
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </div>
          )}
        </div>
      </td>
    );
  };

  return (
    <>
      <tr className={rowClass}>
        <td className={rowClass}>{day.number_of_day}</td>
        {renderMealCell('breakfast')}
        {renderMealCell('lunch')}
        {renderMealCell('dinner')}
      </tr>

      {isModalOpen && recipeDetails && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{recipeDetails.name}</h2>
            <h3>{t('preparationSteps')+ ':'}</h3>
            <ul>
      {recipeDetails.preparation.split('|').map((step, index) => (
        <li key={index}>{step}</li>
      ))}
    </ul>
            <h3>{t('ingredients')+":"}</h3>
            <ul>
              {recipeDetails.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </li>
              ))}
            </ul>
            <div className='close-button-container'>
            <button className='close-button' onClick={handleCloseModal}>{t('close')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Plan;


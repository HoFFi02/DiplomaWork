import React from 'react';
import axios from 'axios';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../../hooks/ItemTypes';
import API_URL from '../../../hooks/url';
import { useTranslation } from 'react-i18next';

const MEAL_IDS = {
  breakfast: 1,
  lunch: 2,
  dinner: 3,
};

function Day({ day, onDrop, userId, onClick }) {
  const {i18n} = useTranslation();
  const language = i18n.language;
  const [{ canDrop, isOver }, dropBreakfast] = useDrop({
    accept: ItemTypes.RECIPE,
    drop: (item) => handleDrop(item.id, 'breakfast'),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [{ isOverLunch }, dropLunch] = useDrop({
    accept: ItemTypes.RECIPE,
    drop: (item) => handleDrop(item.id, 'lunch'),
    collect: (monitor) => ({
      isOverLunch: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [{ isOverDinner }, dropDinner] = useDrop({
    accept: ItemTypes.RECIPE,
    drop: (item) => handleDrop(item.id, 'dinner'),
    collect: (monitor) => ({
      isOverDinner: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleDrop = async (recipeId, mealType) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/days/${userId}?language=${language}`,
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
      console.log('API Response:', response.data);
      onDrop(response.data.updatedDay);
      await updateShoppingList(day.number_of_day, MEAL_IDS[mealType]);
    } catch (error) {
      console.error('Błąd podczas aktualizacji dnia:', error);
    }
  };

  const updateShoppingList = async (number_of_day, meal_id_meal) => {
    try {
      await axios.post(
        `${API_URL}/api/shopping_list/${userId}?language=${language}`,
        { number_of_day, month: day.month, meal_id_meal },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Błąd podczas aktualizacji listy zakupów:', error);
    }
  };

  const deleteFromShoppingList = async (number_of_day, recipe_id_recipe) => {
    try {
      await axios.post(
        `${API_URL}/api/shopping_list/delete/${userId}?language=${language}`,
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
      console.error('Błąd podczas usuwania przepisu:', error);
    }
  };

  const isPastDay = () => {
    const today = new Date();
    const dayDate = new Date(day.year, day.month - 1, day.number_of_day + 1);
    return dayDate < today;
  };

  const rowClass = isPastDay() ? 'past-day' : '';

  const renderMealCell = (mealType, recipeName, recipeId, dropRef, isOver) => (
      <div className="meal-content">
        {recipeName || '-'}
        {recipeId && ( 
          <button className="trash-button" onClick={() => handleDeleteButtonClick(mealType, recipeId)}>
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        )}
      </div>
  );

  return (
    <tr className={rowClass}>
      <td className={rowClass}>{day.number_of_day}</td>
      <td ref={dropBreakfast} className={`meal-cell ${rowClass}`} style={{ backgroundColor: isOver && canDrop ? 'lightgreen' : 'white' }}>
        {renderMealCell('breakfast', day.breakfast_recipe_name, day.breakfast_recipe_id, dropBreakfast, isOver)}
      </td>
      <td ref={dropLunch} className={`meal-cell ${rowClass}`} style={{ backgroundColor: isOverLunch && canDrop ? 'lightgreen' : 'white' }}>
        {renderMealCell('lunch', day.lunch_recipe_name, day.lunch_recipe_id, dropLunch, isOverLunch)}
      </td>
      <td ref={dropDinner} className={`meal-cell ${rowClass}`} style={{ backgroundColor: isOverDinner && canDrop ? 'lightgreen' : 'white' }}>
        {renderMealCell('dinner', day.dinner_recipe_name, day.dinner_recipe_id, dropDinner, isOverDinner)}
      </td>
    </tr>
  );
}

export default Day;

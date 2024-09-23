import React from 'react';
import axios from 'axios';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../../hooks/ItemTypes';


const MEAL_IDS = {
  breakfast: 1,
  lunch: 2,
  dinner: 3,
};

function Day({ day, onDrop, userId, onClick }) {
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
      console.log(`Przepis ${recipeId} zostanie dodany do posiłku ${mealType} na dzień ${day.number_of_day}`);
      
      const response = await axios.put(`http://localhost:5000/api/days/${day.number_of_day}`, {
        recipe_id_recipe: recipeId,
        number_of_day: day.number_of_day,
        meal_id_meal: MEAL_IDS[mealType],
        user_id: userId,
      });
      
      console.log('Updated day:', response.data.updatedDay);
      
      
      onDrop(response.data.updatedDay);
      
      await updateShoppingList(day.number_of_day, MEAL_IDS[mealType]);

    } catch (error) {
      console.error('Błąd podczas aktualizacji dnia:', error);
    }
  };

  const updateShoppingList = async (number_of_day, meal_id_meal) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/shopping_list/${userId}`, {
        number_of_day,
        meal_id_meal,
      });
      
      console.log('Lista zakupów zaktualizowana pomyślnie');
    } catch (error) {
      console.error('Błąd podczas aktualizacji listy zakupów:', error);
    }
  };
  const deleteFromShoppingList = async (number_of_day) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/shopping_list/delete/${userId}`, {
        number_of_day,
      });
      
      console.log('Lista zakupów zaktualizowana pomyślnie');
    } catch (error) {
      console.error('Błąd podczas aktualizacji listy zakupów:', error);
    }
  };
  

  const handleDeleteButtonClick = async (mealType, recipeId) => {
    console.log(`Button clicked for ${mealType} on day ${day.number_of_day}`);
    // Add your button click logic here
    try{
        const response = await axios.put(`http://localhost:5000/api/days/delete/${day.number_of_day}`, {
          recipe_id_recipe: recipeId,
          number_of_day: day.number_of_day,
          meal_id_meal: MEAL_IDS[mealType],
          user_id: userId,
        });
        onClick(response.data.updatedDay);
        await deleteFromShoppingList(day.number_of_day);
        console.log('Response:', response.data);
    }catch (error){
      console.error('Błąd podczas usuwania przepisu: ', error);
    }
  };

  return (
    <tr>
      <td>{day.number_of_day}</td>
      <td ref={dropBreakfast} className="meal-cell" style={{ backgroundColor: isOver && canDrop ? 'lightgreen' : 'white' }}>
        <div className="meal-content">
          {day.breakfast_recipe_name || '-'}
          <button className="button" onClick={() => handleDeleteButtonClick('breakfast', day.breakfast_recipe_id)}>
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </div>
      </td>
      <td ref={dropLunch} className="meal-cell" style={{ backgroundColor: isOverLunch && canDrop ? 'lightgreen' : 'white' }}>
        <div className="meal-content">
          {day.lunch_recipe_name || '-'}
          <button className="button" onClick={() => handleDeleteButtonClick('lunch', day.lunch_recipe_id)}>
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </div>
      </td>
      <td ref={dropDinner} className="meal-cell" style={{ backgroundColor: isOverDinner && canDrop ? 'lightgreen' : 'white' }}>
        <div className="meal-content">
          {day.dinner_recipe_name || '-'}
          <button className="button" onClick={() => handleDeleteButtonClick('dinner', day.dinner_recipe_id)}>
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default Day;

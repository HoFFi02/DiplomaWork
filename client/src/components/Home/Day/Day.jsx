import React from 'react';
import axios from 'axios';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../../hooks/ItemTypes'; // Plik zawierający stałe dla typów elementów

const MEAL_IDS = {
  breakfast: 1,
  lunch: 2,
  dinner: 3,
};

function Day({ day, onDrop, userId }) { // Przekazujemy userId jako props
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
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [{ isOverDinner }, dropDinner] = useDrop({
    accept: ItemTypes.RECIPE,
    drop: (item) => handleDrop(item.id, 'dinner'),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleDrop = async (recipeId, mealType) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/days/${day.number_of_day}`, {
        recipe_id_recipe: recipeId,
        number_of_day: day.number_of_day,
        meal_id_meal: MEAL_IDS[mealType], // Użyj odpowiedniego meal_id_meal
        user_id: userId,
      });
      console.log("aaaaaaaaaaaaaaaaaa"+response.data);
      console.log("aaaaaaaaaaaaaaaaaa"+response.data.updatedDay);
      console.log("aaaaaaaaaaaaaaaaaa"+response);
      onDrop(response.data.updatedDay); // Przekazujemy zaktualizowany dzień
    } catch (error) {
      console.error('Błąd podczas aktualizacji dnia:', error);
    }
  };

  return (
    <tr>
      <td>{day.number_of_day}</td>
      <td ref={dropBreakfast} style={{ backgroundColor: isOver && canDrop ? 'lightgreen' : 'white' }}>
        {day.breakfast_recipe_name || '-'}
      </td>
      <td ref={dropLunch} style={{ backgroundColor: isOverLunch ? 'lightgreen' : 'white' }}>
        {day.lunch_recipe_name || '-'}
      </td>
      <td ref={dropDinner} style={{ backgroundColor: isOverDinner ? 'lightgreen' : 'white' }}>
        {day.dinner_recipe_name || '-'}
      </td>
    </tr>
  );
}

export default Day;

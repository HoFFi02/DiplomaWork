import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../../../hooks/ItemTypes';

const Recipe = ({ recipe }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.RECIPE,
    item: { id: recipe.id_recipe, name: recipe.recipe_name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <tr ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <td>{recipe.name}</td>
      <td>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index}>
            {ingredient.name} ({ingredient.amount} {ingredient.unit})
          </div>
        ))}
      </td>
    </tr>
  );
};

export default Recipe;

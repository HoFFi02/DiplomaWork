import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../../../hooks/ItemTypes'; // Stworzony plik ItemTypes.js zawierający stałe dla typów elementów

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


const RecipesTable = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recipes');
        setRecipes(response.data); // Dane są już w formacie, który potrzebujemy
      } catch (error) {
        console.error('Błąd podczas pobierania przepisów:', error);
      }
    };

    fetchRecipes();
  }, []);

  if (recipes.length === 0) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nazwa Przepisu</th>
            <th>Składniki</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <Recipe key={recipe.id_recipe} recipe={recipe} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipesTable;


import React, { useState } from 'react';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';

const RecipeForm = ({ showForm, setShowForm, onSubmit, products }) => {
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    preparation: '',
    steps: [],
    ingredients: [],
  });
  const [ingredientInput, setIngredientInput] = useState({ product: '', amount: '' });
  const [stepInput, setStepInput] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { t } = useTranslation();

  const handleAddStep = () => {
    if (stepInput.trim()) {
      setNewRecipe((prevRecipe) => ({
        ...prevRecipe,
        steps: [...prevRecipe.steps, `${prevRecipe.steps.length + 1}. ${stepInput.trim()}`], 
      }));
      setStepInput('');
    }
  };

  const handleDeleteStep = (index) => {
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      steps: prevRecipe.steps
        .filter((_, i) => i !== index)
        .map((step, i) => {
          const match = step.match(/^\d+\.\s(.*)/); 
        const stepText = match ? match[1] : step; 
        return `${i + 1}. ${stepText}`;
        }),
      }));
  };
  const handleProductSearch = (value) => {
    setIngredientInput((prev) => ({ ...prev, product: value }));
    const searchText = value.toLowerCase();
    if (searchText.length > 0) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchText)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleAddIngredient = () => {
    const selectedProduct = products.find(
      (product) => product.name === ingredientInput.product
    );

    if (selectedProduct && ingredientInput.amount) {
      setNewRecipe((prevRecipe) => ({
        ...prevRecipe,
        ingredients: [
          ...prevRecipe.ingredients,
          {
            productId: selectedProduct.id_product, 
            product: selectedProduct.name,
            amount: ingredientInput.amount,
            unit: selectedProduct.unit,
          },
        ],
      }));

      setIngredientInput({ product: '', amount: '' });
      setFilteredProducts([]);
    }
  };

  const handleRecipeChange = (field, value) => {
    setNewRecipe((prevRecipe) => ({ ...prevRecipe, [field]: value }));
  };


  const handleSuggestionClick = (product) => {
    setIngredientInput({ ...ingredientInput, product: product.name });
    setFilteredProducts([]); 
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const recipeToSubmit = {
      ...newRecipe,
      preparation: newRecipe.steps.join('|'), 
    };
    onSubmit(recipeToSubmit);
    setNewRecipe({ name: '', preparation: '', steps: [], ingredients: [] });
    setShowForm(false);
  };

  return (
    <Modal isOpen={showForm} onRequestClose={() => setShowForm(false)} ariaHideApp={false} className="modal">
      <form onSubmit={handleFormSubmit} className="recipe-form">
        <h2>{t('addNewRecipe')}</h2>
        <label>
          {t('recipeName')}:
          <input
            type="text"
            value={newRecipe.name}
            onChange={(e) => handleRecipeChange('name', e.target.value)}
            required
          />
        </label>
        <label>
          {t('preparationSteps')}:
          <div className="steps-form">
            <input
              type="text"
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              placeholder={t('addStep')}
            />
            <button type="button" onClick={handleAddStep} disabled={!stepInput.trim()}>
              {t('addStep')}
            </button>
          </div>
          <ul>
  {newRecipe.steps.map((step, index) => (
    <li key={index} className="step-item">
      <span className="step-text">{step}</span>
      <button className="delete-preparation-step-button" type="button" onClick={() => handleDeleteStep(index)}>
        {t('delete')}
      </button>
    </li>
  ))}
</ul>
        </label>
        <h3>{t('ingredients')}</h3>
        <div className="ingredient-form">
          <input
            type="text"
            placeholder={t('searchProduct')}
            value={ingredientInput.product}
            onChange={(e) => handleProductSearch(e.target.value)}
          />
          {filteredProducts.length > 0 && (
            <ul className="product-suggestions">
              {filteredProducts.map((product) => (
                <li
                  key={product.id_product}
                  onClick={() => handleSuggestionClick(product)} 
                  style={{ cursor: 'pointer' }}
                >
                  {product.name} ({product.unit})
                </li>
              ))}
            </ul>
          )}
          <input
            type="number"
            value={ingredientInput.amount}
            onChange={(e) => setIngredientInput({ ...ingredientInput, amount: e.target.value })}
            placeholder={t('amount')}
            required={ingredientInput.product !== ''} 
            />
            <button
            className='add-form-button'
             type='button'
            onClick={handleAddIngredient}
            disabled={!ingredientInput.product || !ingredientInput.amount} 
            >
            {t('addIngredient')}
          </button>
        </div>
        <ul>
          {newRecipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.product} - {ingredient.amount} {ingredient.unit}
            </li>
          ))}
        </ul>
        <div className='form-button-container'>
        <button className = "submit-button" type="submit">{t('submit')}</button>
        <button className='cancel-button' type="button" onClick={() => setShowForm(false)}>
          {t('cancel')}
        </button>
        </div>
      </form>
    </Modal>
  );
};

export default RecipeForm;

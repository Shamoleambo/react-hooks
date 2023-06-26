import React, { useState, useCallback } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

function Ingredients() {
  const [ingredients, setIngredients] = useState([])

  function addIngredientHandler(ingredient) {
    fetch(
      'https://react-hooks-eb96c-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        setIngredients((prevState) => [
          ...prevState,
          { id: responseData.name, ...ingredient }
        ])
      })
  }

  function removeIngredientHandler(id) {
    setIngredients((prevState) =>
      prevState.filter((ingredient) => ingredient.id !== id)
    )
  }

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients)
  }, [])

  return (
    <div className='App'>
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  )
}

export default Ingredients

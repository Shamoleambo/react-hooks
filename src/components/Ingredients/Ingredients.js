import React, { useState } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

function Ingredients() {
  const [ingredients, setIngredients] = useState([])

  function addIngredientHandler(ingredient) {
    setIngredients((prevState) => [
      ...prevState,
      { id: Math.random().toString(), ...ingredient }
    ])
  }

  function removeIngredientHandler(id) {
    setIngredients((prevState) =>
      prevState.filter((ingredient) => ingredient.id !== id)
    )
  }

  return (
    <div className='App'>
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  )
}

export default Ingredients

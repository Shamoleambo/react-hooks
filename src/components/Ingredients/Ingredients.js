import React, { useState } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

function Ingredients() {
  const [ingredients, setIngredients] = useState([])

  function addIngredientHandler(ingredient) {
    setIngredients((prevState) => [
      ...prevState,
      { id: Math.random.toString(), ...ingredient }
    ])
  }

  return (
    <div className='App'>
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={() => null} />
      </section>
    </div>
  )
}

export default Ingredients

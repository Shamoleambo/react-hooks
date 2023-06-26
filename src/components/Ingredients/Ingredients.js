import React, { useState, useEffect } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

function Ingredients() {
  const [ingredients, setIngredients] = useState([])

  useEffect(() => {
    fetch(
      'https://react-hooks-eb96c-default-rtdb.firebaseio.com/ingredients.json'
    )
      .then((response) => response.json())
      .then((responseData) => {
        const loadedIngredients = []
        for (let key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          })
        }

        setIngredients(loadedIngredients)
      })
  }, [])

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

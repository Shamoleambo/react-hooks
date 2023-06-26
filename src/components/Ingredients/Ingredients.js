import React, { useState, useCallback } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'
import ErrorModal from '../UI/ErrorModal'

function Ingredients() {
  const [ingredients, setIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  function addIngredientHandler(ingredient) {
    setIsLoading(true)
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
        setIsLoading(false)
        setIngredients((prevState) => [
          ...prevState,
          { id: responseData.name, ...ingredient }
        ])
      })
  }

  function removeIngredientHandler(id) {
    setIsLoading(true)
    fetch(
      `https://react-hooks-eb96c-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: 'DELETE'
      }
    )
      .then((response) => {
        setIsLoading(false)
        setIngredients((prevState) =>
          prevState.filter((ingredient) => ingredient.id !== id)
        )
      })
      .catch((error) => {
        setError('Something went wrong!')
      })
  }

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients)
  }, [])

  const clearError = () => {
    setError(null)
    setIsLoading(false)
  }

  return (
    <div className='App'>
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

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

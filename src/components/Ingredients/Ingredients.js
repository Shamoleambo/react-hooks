import React, { useReducer, useState, useCallback } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'
import ErrorModal from '../UI/ErrorModal'

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(
        (ingredient) => ingredient.id !== action.ingredientId
      )
    default:
      throw new Error('Should not get here')
  }
}

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
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
        dispatch({
          type: 'ADD',
          ingredient: { id: responseData.name, ...ingredient }
        })
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
        dispatch({ type: 'DELETE', ingredientId: id })
      })

      .catch((error) => {
        setError('Something went wrong!')
      })
  }

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients })
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

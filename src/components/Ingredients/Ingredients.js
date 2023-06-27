import React, { useReducer, useCallback, useMemo } from 'react'

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

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { ...httpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errorData }
    case 'CLEAR':
      return { ...httpState, error: null }
    default:
      throw new Error("Shouldn't be reached")
  }
}

const Ingredients = React.memo(() => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttpState] = useReducer(httpReducer, {
    loading: false,
    error: null
  })

  const addIngredientHandler = useCallback((ingredient) => {
    dispatchHttpState({ type: 'SEND' })
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
        dispatchHttpState({ type: 'RESPONSE' })
        dispatch({
          type: 'ADD',
          ingredient: { id: responseData.name, ...ingredient }
        })
      })
  }, [])

  const removeIngredientHandler = useCallback((id) => {
    dispatchHttpState({ type: 'SEND' })
    fetch(
      `https://react-hooks-eb96c-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: 'DELETE'
      }
    )
      .then((response) => {
        dispatchHttpState({ type: 'RESPONSE' })
        dispatch({ type: 'DELETE', ingredientId: id })
      })

      .catch((error) => {
        dispatchHttpState({ type: 'ERROR', errorData: 'Something went wrong' })
      })
  }, [])

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients })
  }, [])

  const clearError = useCallback(() => {
    dispatchHttpState({ type: 'CLEAR' })
  }, [])

  const ingredientsList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    )
  }, [ingredients, removeIngredientHandler])

  return (
    <div className='App'>
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientsList}
      </section>
    </div>
  )
})

export default Ingredients

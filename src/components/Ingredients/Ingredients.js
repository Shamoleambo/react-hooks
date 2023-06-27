import React, { useEffect, useReducer, useCallback, useMemo } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'
import ErrorModal from '../UI/ErrorModal'
import useHttp from '../../hooks/http'

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

const Ingredients = React.memo(() => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  const { isLoading, data, error, extra, identifier, sendRequest, clear } =
    useHttp()

  useEffect(() => {
    if (!isLoading && identifier === 'DELETE') {
      dispatch({ type: 'DELETE', ingredientId: extra })
    } else if (!isLoading && !error && identifier === 'ADD') {
      dispatch({ type: 'ADD', ingredient: { id: data.name, ...extra } })
    }
  }, [data, extra, identifier, isLoading, error])

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        'https://react-hooks-eb96c-default-rtdb.firebaseio.com/ingredients.json',
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD'
      )
    },
    [sendRequest]
  )

  const removeIngredientHandler = useCallback(
    (id) => {
      sendRequest(
        `https://react-hooks-eb96c-default-rtdb.firebaseio.com/ingredients/${id}.json`,
        'DELETE',
        null,
        id,
        'DELETE'
      )
    },
    [sendRequest]
  )

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients })
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
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientsList}
      </section>
    </div>
  )
})

export default Ingredients

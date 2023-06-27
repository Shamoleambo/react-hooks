import React, { useState, useEffect, useRef } from 'react'

import Card from '../UI/Card'
import ErrorModal from '../UI/ErrorModal'
import './Search.css'
import useHttp from '../../hooks/http'

const Search = React.memo(({ onLoadIngredients }) => {
  const [filter, setFilter] = useState('')
  const filterInput = useRef()
  const { isLoading, data, error, sendRequest, clear } = useHttp()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter === filterInput.current.value) {
        const query =
          filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`

        sendRequest(
          `https://react-hooks-eb96c-default-rtdb.firebaseio.com/ingredients.json${query}`,
          'GET'
        )
      }
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [filter, filterInput, sendRequest])

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = []

      for (let key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        })
      }

      onLoadIngredients(loadedIngredients)
    }
  }, [data, isLoading, error, onLoadIngredients])

  return (
    <section className='search'>
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            type='text'
            onChange={(event) => setFilter(event.target.value)}
            ref={filterInput}
          />
        </div>
      </Card>
    </section>
  )
})

export default Search

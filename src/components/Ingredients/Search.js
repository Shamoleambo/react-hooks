import React, { useState, useEffect } from 'react'

import Card from '../UI/Card'
import './Search.css'

const Search = React.memo(({ onLoadIngredients }) => {
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const query =
      filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`
    fetch(
      `https://react-hooks-eb96c-default-rtdb.firebaseio.com/ingredients.json${query}`
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
        onLoadIngredients(loadedIngredients)
      })
  }, [filter, onLoadIngredients])

  return (
    <section className='search'>
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          <input
            type='text'
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  )
})

export default Search

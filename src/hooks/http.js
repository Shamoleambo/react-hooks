import { useReducer, useCallback } from 'react'

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null, data: null }
    case 'RESPONSE':
      return { ...httpState, loading: false, data: action.responseData }
    case 'ERROR':
      return { loading: false, error: action.errorData }
    case 'CLEAR':
      return { ...httpState, error: null }
    default:
      throw new Error("Shouldn't be reached")
  }
}

const useHttp = () => {
  const [httpState, dispatchHttpState] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null
  })

  const sendRequest = useCallback((url, method, body) => {
    dispatchHttpState({ type: 'SEND' })
    fetch(url, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatchHttpState({ type: 'RESPONSE', responseData })
      })
      .catch((error) => {
        dispatchHttpState({ type: 'ERROR', errorData: 'Something went wrong' })
      })
  }, [])

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest
  }
}

export default useHttp

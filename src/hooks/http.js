import { useReducer, useCallback } from 'react'

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
}

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      }
    case 'RESPONSE':
      return {
        ...httpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      }
    case 'ERROR':
      return { loading: false, error: action.errorData }
    case 'CLEAR':
      return initialState
    default:
      throw new Error("Shouldn't be reached")
  }
}

const useHttp = () => {
  const [httpState, dispatchHttpState] = useReducer(httpReducer, initialState)

  const clear = useCallback(() => dispatchHttpState({ type: 'CLEAR' }), [])

  const sendRequest = useCallback((url, method, body, reqExtra, identifier) => {
    dispatchHttpState({ type: 'SEND', identifier })
    fetch(url, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatchHttpState({ type: 'RESPONSE', responseData, extra: reqExtra })
      })
      .catch((error) => {
        dispatchHttpState({ type: 'ERROR', errorData: 'Something went wrong' })
      })
  }, [])

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    extra: httpState.extra,
    identifier: httpState.identifier,
    sendRequest,
    clear
  }
}

export default useHttp

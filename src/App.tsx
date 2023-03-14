import * as React from 'react'
import axios from 'axios'
import styles from "./App.module.css"

import { List } from "./List"
import { SearchForm } from "./SearchForm"

const title: string = "My First React App"
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

export enum Action {
  STORIES_FETCH_INIT,
  STORIES_FETCH_SUCCESS,
  STORIES_FETCH_FAILURE,
  REMOVE_STORY
}

export type Story = {
  title: string
  url: string
  author: string
  num_comments: number,
  points: number,
  objectID: number
}

export type ReducerAction = {
  type: Action
  payload?: any
}

const App = () => {
  console.log('Loading App...')

  const useStorageState = (
    key: string,
    initialState: string
    ): [string, (newValue: string) => void] => {
    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialState
    )

    React.useEffect(() => {localStorage.setItem(key, value)}, [value, key])

    return [value, setValue]
  }

  const [searchTerm, setSearchTerm] = useStorageState('search', '')
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)

  function handleSearchSubmit (event: React.FormEvent<HTMLFormElement>) {
    setUrl(`${API_ENDPOINT}${searchTerm}`)

    event.preventDefault()
  }

  function handleSearchInput (event: React.ChangeEvent<HTMLInputElement>) {
      setSearchTerm(event.target.value)
  }
  
  type storyState = {
    data: Story[]
    isError: boolean
    isLoading: boolean
  }

  const storiesReducer = (state:storyState, action: ReducerAction) => {
    switch (action.type) {
      case Action.STORIES_FETCH_INIT:
        return {
          ...state,
          isLoading: true,
          isError: false
        }
      case Action.STORIES_FETCH_SUCCESS:
        return {
          ...state,
          data: action.payload,
          isLoading: false,
          isError: false
        }
      case Action.STORIES_FETCH_FAILURE:
        return {
          ...state,
          isLoading: false,
          isError: true
        }
      case Action.REMOVE_STORY:
        return {
          ...state,
          data: state.data.filter((story) => story.objectID !== action.payload),
          isLoading: false,
          isError: false
          }
      default:
        throw new Error('Unrecognized action.')
    }
  }

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false}
  )

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: Action.STORIES_FETCH_INIT})

    try {
      const result = await axios.get(url)
    
      dispatchStories({
          type: Action.STORIES_FETCH_SUCCESS,
          payload: result.data.hits
      })
    } catch {
      dispatchStories ({ type: Action.STORIES_FETCH_FAILURE})
    }}, [url])
    
  React.useEffect(() => { handleFetchStories() }, [handleFetchStories])

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>
      {stories.isLoading ? <p>Loading...</p> : ''}
      {stories.isError ? <p>ERROR LOADING DATA</p> : ''}
      <SearchForm
       searchTerm={searchTerm}
       handleSearchSubmit={handleSearchSubmit}
       onSearchInput={handleSearchInput}
       buttonClass={styles.buttonLarge}
      />
      <List list={stories.data} dispatchStories={dispatchStories}/> 
    </div>
  )
}



export default App



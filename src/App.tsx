import * as React from 'react'
import axios from 'axios'
import styles from "./App.module.css"

import { List } from "./List"
import { SearchForm } from "./SearchForm"

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

export enum Action {
  STORIES_FETCH_INIT,
  STORIES_FETCH_SUCCESS,
  STORIES_FETCH_FAILURE,
  LOAD_PREVIOUS_STORIES,
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

type StoryState = {
  data: Story[]
  isError: boolean
  isLoading: boolean
}

const storiesReducer = (state:StoryState, action: ReducerAction) => {
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
    case Action.LOAD_PREVIOUS_STORIES:
        console.log(action)
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
        data: state.data.filter((story) => story.objectID !== action.payload.objectID),
        isLoading: false,
        isError: false
        }
    default:
      throw new Error('Unrecognized action.')
  }
}

const getSumComments = (stories: Story[]) => {
  return stories.reduce((result, value) => result + value.num_comments, 0
  )
}

const App = () => {
  const useStorageState = (
    key: string,
    initialState: string
    ): [string, (newValue: string) => void] => {
    const isMounted = React.useRef(false)

    console.log('------')
    console.log('Rendering App')

    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialState
    )

    React.useEffect(() => {
      if (!isMounted.current) {
        isMounted.current = true
      } else {
        localStorage.setItem(key, value)
      }
    }, [value, key])

    return [value, setValue]
  }

  type PreviousSearch = {
    term: string,
    result: StoryState
  }

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React')
  const [lastSearches, setLastSearchTerms] = React.useState<PreviousSearch[]>([])
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false}
  )

  function handleSearchSubmit (event: React.FormEvent<HTMLFormElement>) {
    setUrl(`${API_ENDPOINT}${searchTerm}`)

    console.log(`searchTerm=${ searchTerm }`)

    event.preventDefault()
    
  }

  function handleSearchInput (event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event)
    setSearchTerm(event.target.value)
  }
  

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: Action.STORIES_FETCH_INIT})

    try {
      const result = await axios.get(url)
    
      dispatchStories({
          type: Action.STORIES_FETCH_SUCCESS,
          payload: result.data.hits
      })

      const newSearchTerms = [...lastSearches]
      newSearchTerms.unshift({
        term: searchTerm,
        result: result.data.hits
      })

      if (newSearchTerms.length === 6) {
        newSearchTerms.pop()
      }

      setLastSearchTerms(newSearchTerms)
      console.log(lastSearches)


    } catch {
      dispatchStories ({ type: Action.STORIES_FETCH_FAILURE})
    }}, [url])
    
  React.useEffect(() => { handleFetchStories() }, [handleFetchStories])

  function onLoadPreviousSearch (term, result) {
    setSearchTerm(term)
    dispatchStories({
      type: Action.LOAD_PREVIOUS_STORIES,
      payload: result
    })
  }

  const PreviousSearchButton = ({ term, result }) => {
    return <button onClick={() => onLoadPreviousSearch(term, result)}>{term}</button>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories with {getSumComments(stories.data)} comments.</h1>
      {stories.isLoading ? <p>Loading...</p> : ''}
      {stories.isError ? <p>ERROR LOADING DATA</p> : ''}
      <SearchForm
        searchTerm={searchTerm}
        onSearchSubmit={handleSearchSubmit}
        onSearchInput={handleSearchInput}
        buttonClass={styles.buttonLarge}
      />
      {lastSearches.map(PreviousSearchButton)}
      <List list={stories.data} dispatchStories={dispatchStories}/> 
    </div>
  )
}



export default App

export { storiesReducer }



import * as React from 'react'
import styles from "./App.module.css"
import { InputWithLabel } from './InputWithLabel'

type SearchParams = {
    searchTerm: string,
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
    buttonClass: string
  }
  
  const SearchForm: React.FC<SearchParams> = ({
    searchTerm,
    onSearchSubmit,
    onSearchInput,
    buttonClass,
  }: SearchParams) => (
    <form onSubmit={onSearchSubmit} className={styles.searchForm}>
      <InputWithLabel
        id='search'
        onInputChange={onSearchInput}
        isFocused
        value={searchTerm}> 
        <strong>Search:</strong>
      </InputWithLabel>
      <button type="submit" disabled={!searchTerm} className={`${styles.button} ${buttonClass}`}>
          Submit
      </button>
    </form>
  )

  export { SearchForm }
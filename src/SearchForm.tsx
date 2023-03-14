import * as React from 'react'
import styles from "./App.module.css"
import { InputWithLabel } from './InputWithLabel'

type SearchParams = {
    searchTerm: string,
    handleSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
    buttonClass: string
  }
  
  export const SearchForm: React.FC<SearchParams> = ({
    searchTerm,
    handleSearchSubmit,
    onSearchInput,
    buttonClass,
  }: SearchParams) => (
    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
      <InputWithLabel
        id='search'
        onInputChange={onSearchInput}
        isFocused
        value={searchTerm}> 
        Search:
      </InputWithLabel>
      <button type="submit" disabled={!searchTerm} className={`${styles.button} ${buttonClass}`}>
          Submit
      </button>
    </form>
  )
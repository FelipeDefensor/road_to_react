import * as React from 'react'
import { sortBy } from 'lodash'

import styles from "./App.module.css"
import { Story, Action, ReducerAction } from "./App"


export enum SORT_FIELD {
  TITLE = 'title',
  AUTHOR = 'author',
  COMMENTS = 'num_comments',
  POINTS = 'points',
  NONE = 'none',
}

const SORTS = {
  'none': (list: Story[]) => list,
  'title': (list: Story[]) => sortBy(list, 'title'),
  'author': (list: Story[]) => sortBy(list, 'author'),
  'num_comments': (list: Story[]) => sortBy(list, 'num_comments').reverse(),
  'points': (list: Story[]) => sortBy(list, 'points').reverse(),
};

const List = ({ list, dispatchStories }: {
  list: Story[],
  dispatchStories: (action: ReducerAction) => void 
  }) =>  {

  console.log('Rendering List')

  const [sort, setSort] = React.useState<keyof typeof SORTS>('none');
  const [isSortReversed, setReverseSort] = React.useState(false)  

  const handleRemoveItem = (story: Story ) => {
    dispatchStories({type: Action.REMOVE_STORY, payload: story})
  }
  
  const handleSortChange = (field: SORT_FIELD) => {
      if (field === sort) {
        setReverseSort(!isSortReversed)
      } else {
        setReverseSort(false)
        setSort(field)
      }
      console.log(isSortReversed)
    }
  

  function itemFromStory (story: Story) {
    return (   
    <Item key={story.objectID} story={story} onRemoveItem={handleRemoveItem}/>
  )}

  const sortFunction = SORTS[sort];
  const sortedList = isSortReversed ? sortFunction(list).reverse() : sortFunction(list);

  const getReversedIndicator = (reverse: Boolean) => {
    return !reverse ? '↑' : '↓'
  }

  return ( 
    <>
    <ul>
      <li style={{ display: 'flex' }}>
        <span style={{ width: '40%'}}>
          <button onClick={() => handleSortChange(SORT_FIELD.TITLE)} className={styles.sortHeader}>
            Title {sort === SORT_FIELD.TITLE && getReversedIndicator(isSortReversed)}
          </button>
        </span>
        <span style={{ width: '30%'}}>
          <button onClick={() => handleSortChange(SORT_FIELD.AUTHOR)} className={styles.sortHeader}>
            Author {sort === SORT_FIELD.AUTHOR && getReversedIndicator(isSortReversed)}
          </button>
        </span>
        <span style={{ width: '10%'}}>
          <button onClick={() => handleSortChange(SORT_FIELD.COMMENTS)} className={styles.sortHeader}>
            Comments {sort === SORT_FIELD.COMMENTS && getReversedIndicator(!isSortReversed)}
          </button>
        </span>
        <span style={{ width: '10%'}}>
          <button onClick={() => handleSortChange(SORT_FIELD.POINTS)} className={styles.sortHeader}>
            Points {sort === SORT_FIELD.POINTS && getReversedIndicator(!isSortReversed)}
          </button>
        </span>
        <span style={{ width: '10%'}}>
          Actions
        </span>
      </li>      
      {sortedList.map(itemFromStory)}
    </ul>
    </>
  )
  }


const Item = ({
story,
onRemoveItem
}: { 
story: Story,
onRemoveItem: (story: Story) => void
}): JSX.Element => {

const { title, url, author, num_comments, points } = story

return (
  <li className={styles.item}>
    <span style={{ width: '40%'}}>
      <a href={url}>{title}</a>
    </span>
    <span style={{ width: '30%'}}>Author: {author}</span>
    <span style={{ width: '10%'}}>Comments: {num_comments}</span>
    <span style={{ width: '10%'}}>Points: {points}</span>
    <span style={{ width: '10%'}}>
      <button onClick={() => onRemoveItem(story)} className={`${styles.button} ${styles.buttonSmall}`}>Dismiss</button>
    </span>
  </li>
  )
}


export { List, Item }
  
  
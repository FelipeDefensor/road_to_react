import * as React from 'react'
import styles from "./App.module.css"
import { Story, Action, ReducerAction } from "./App"


export const List = ({ list, dispatchStories }: { list: Story[], dispatchStories: (action: ReducerAction) => void }) =>  {
    console.log('Loading List...')
  
    const handleRemoveItem = (id: number ) => {
      dispatchStories({
        type: Action.REMOVE_STORY,
        payload: id
  })}  
  
    function itemFromStory (story: Story) {
      return (
      <Item key={story.objectID} story={story} onRemoveItem={handleRemoveItem}/>
    )}
    
    return <ul>{list.map(itemFromStory)}</ul>
  }
  
  const Item = ({
     story,
     onRemoveItem
    }:{ 
    story: Story,
    onRemoveItem: (id: number) => void
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
          <button onClick={() => onRemoveItem(story.objectID)} className={`${styles.button} ${styles.buttonSmall}`}>X</button>
        </span>
      </li>
      )
  }
  
  
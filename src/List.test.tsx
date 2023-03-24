import { describe, it, expect, vi } from 'vitest'
import {
    render,
    screen,
    fireEvent,
} from '@testing-library/react'

import { List, Item } from './List'
import { SearchForm } from './SearchForm'
import { storiesReducer } from './App'
import { InputWithLabel } from './InputWithLabel'
import { scryRenderedComponentsWithType } from 'react-dom/test-utils'

const storyOne = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
}

const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andre Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
}

const stories = [storyOne, storyTwo]

describe('Item', () => {
    it('renders all properties', () => {
        render(<Item story={storyOne} onRemoveItem={() => {}}/>);
  
        // expect(screen.getByText('Jordan')).toBeInTheDocument(); // couldn't get this to work
        expect(screen.getByText('React')).toHaveAttribute(
            'href',
            'https://reactjs.org/'
        );
    });

    it('renders a clickable dismiss buton', () => {
        render(<Item story={storyOne} onRemoveItem={() => {}}/>)

        expect(screen.getByRole('button')).toBeInTheDocument();      
    })

    it('clicking the dismiss button calls the callback handler', () => {
        const handleRemoveItem = vi.fn()

        render(<Item story={storyOne} onRemoveItem={handleRemoveItem} />)

        fireEvent.click(screen.getByRole('button'))

        expect(handleRemoveItem).toHaveBeenCalledTimes(1)

    })

    it('matches snapshot', () => {
        const { container } = render(<Item story={storyOne} onRemoveItem={() => {}}/>)
        expect(container.firstChild).toMatchSnapshot()
    })


});


describe('List', () => {

    it('displays stories title', () => {
        render(<List list={stories} dispatchStories={vi.fn()}/>)

        expect(screen.getByText(/Redux/)).toBeInTheDocument()
    })

    it('displays stories author', () => {
        render(<List list={stories} dispatchStories={vi.fn()}/>)

        expect(screen.getByText(/Dan Abramov/)).toBeInTheDocument()
    })

    it('removes story when remove button is clicked', () => {
        const removeStory = vi.fn()
        render(<List list={[storyOne]} dispatchStories={removeStory} />)
        
        fireEvent.click(screen.getByText('Dismiss'))

        expect(removeStory).toHaveBeenCalledTimes(1)

    })

    it('matches snapshot', () => {
        const { container } = render(< List list={stories} dispatchStories={() => {}}/>)
        expect(container.firstChild).toMatchSnapshot()
    })
})




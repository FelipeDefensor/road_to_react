import { describe, it, expect, vi } from 'vitest'
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from '@testing-library/react'
import axios from 'axios'

import App, {
    storiesReducer,
    Action
} from './App'

vi.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

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

describe('storiesReducer', () => {
    it('removes a story from all stories', () => {
        const action = { type: Action.REMOVE_STORY, payload: storyOne }
        const state = { data: stories, isLoading: false, isError: false }

        const newState = storiesReducer(state, action)

        const expectedState = {
            data: [storyTwo],
            isLoading: false,
            isError: false
        }

        expect(newState).toStrictEqual(expectedState)
    })

    it('succesfully fetch stories', () => {
        const action = { type: Action.STORIES_FETCH_SUCCESS, payload: stories}
        const state = { data: [], isLoading: false, isError: true}

        const newState = storiesReducer(state, action)

        const expectedState = {
            data: stories,
            isLoading: false,
            isError: false,
        }

        expect(newState).toStrictEqual(expectedState)
    })

    it('fail in fetching stories'), () => {
        const action = { type: Action.STORIES_FETCH_FAILURE, payload: [] }
        const state =  { data: [], isLoading: false, isError: true }

        const newState = storiesReducer(state, action)

        const expectedState = {
            data: [],
            isLoading: false,
            isError: true,
        }

        expect(newState).toStrictEqual(expectedState)
    }

    it('searches for specific stories', async () => {
        const reactPromise = Promise.resolve({
          data: {
            hits: stories,
          },
        });
    
        const anotherStory = {
          title: 'JavaScript',
          url: 'https://en.wikipedia.org/wiki/JavaScript',
          author: 'Brendan Eich',
          num_comments: 15,
          points: 10,
          objectID: 3,
        };
    
        const javascriptPromise = Promise.resolve({
          data: {
            hits: [anotherStory],
          },
        });
    
        mockedAxios.get.mockImplementation((url) => {
          if (url.includes('React')) {
            return reactPromise;
          }
    
          if (url.includes('JavaScript')) {
            return javascriptPromise;
          }
    
          throw Error();
        })


        // Initial render

        render(<App />)

        // First Data Fetching

        await waitFor(async () => await reactPromise)

        expect(screen.queryByDisplayValue(/React/)).toBeInTheDocument()
        expect(screen.queryByDisplayValue(/JavaScript/)).toBeNull()

        expect(screen.queryByText(/Jordan Walke/)).toBeInTheDocument()
        expect(
            screen.queryByText(/Dan Abramov/)
        ).toBeInTheDocument()
        expect(screen.queryByText(/Brendan Eich/)).toBeNull()

        // User Interaction -> Search

        fireEvent.change(screen.queryByDisplayValue(/React/) as HTMLElement, {
            target: {
                value: 'JavaScript'
            }
        })

        expect(screen.queryByDisplayValue(/React/)).toBeNull()
        expect(
            screen.queryByDisplayValue(/JavaScript/)
        ).toBeInTheDocument()

        fireEvent.submit(screen.queryByText(/Submit/) as HTMLElement)

        // Second data fecthing

        await waitFor(async () => await javascriptPromise)

        expect(screen.queryByText(/Jordan Walke/)).toBeNull()
        expect(
            screen.queryByText(/Dan Abramov/)
        ).toBeNull()
        expect(screen.queryByText(/Brendan Eich/)).toBeInTheDocument()
        
    })
})
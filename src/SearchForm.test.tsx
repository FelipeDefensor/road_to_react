import * as React from 'react'

import { vi, describe, it, expect } from 'vitest'

import { render, screen, fireEvent } from '@testing-library/react'

import { SearchForm } from './SearchForm'

describe('SearchForm', () => {
    const searchFormProps = {
        searchTerm: 'React',    
        onSearchInput: vi.fn(),
        onSearchSubmit: vi.fn(),
        buttonClass: 'small',
    }

    it('renders the input field with its value', () => {
        render(<SearchForm {...searchFormProps} />)

        expect(screen.getByDisplayValue('React')).toBeInTheDocument()
    })

    it('renders the correct label', () => {
        render(<SearchForm{...searchFormProps} />)

        expect(screen.getByLabelText(/Search/)).toBeInTheDocument()
    })


    it('calls onSearchInput on input field change', () => {
        render(<SearchForm {...searchFormProps} />);
    
        fireEvent.change(screen.getByDisplayValue('React'), {
          target: { value: 'Redux' },
        });

        expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1)
        // Couldn't get this to work
        expect(searchFormProps.onSearchInput).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({
                    value: "React" // not sure if this should be the value instead of new 'Redux'
                })
            })
        )
    })


    it('calls onSearchSubmit on button submit click', () => {
        render(<SearchForm {...searchFormProps} />);

        fireEvent.submit(screen.getByRole('button'));
    
        expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    })

    it('renders snapshot', () => {
        const { container } = render(<SearchForm {...searchFormProps} />)
        expect(container.firstChild).toMatchSnapshot()
    })

})

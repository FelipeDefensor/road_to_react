import * as React from 'react'

import { vi, describe, it, expect } from 'vitest'

import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { InputWithLabel } from './InputWithLabel'

describe('InputWithLabel', () => {

    const inputWithLabelProps = {
        id: 'test',
        value: 'initial',
        onInputChange: vi.fn(),
        children: <p>Dummy child</p>
    }


    it ('initial value is set correctly', () => {
        render(<InputWithLabel {...inputWithLabelProps }/>)

        expect(screen.getByDisplayValue(/initial/)).toBeInTheDocument()
    })

    it('displays children', () => {
        render(<InputWithLabel {...inputWithLabelProps}/>)

        expect(screen.getByText('Dummy child')).toBeInTheDocument()

        screen.debug()

    })

    it('calls onInputChange when input changes', async () => {
        render(<InputWithLabel {...inputWithLabelProps}/>)

        fireEvent.change(screen.getByRole('textbox'), {target:{value:'new value'}})


        expect(inputWithLabelProps.onInputChange).toBeCalledTimes(1)
        expect(inputWithLabelProps.onInputChange).toHaveBeenCalledWith(
        expect.objectContaining({
            target: expect.objectContaining({
                value: "initial" // not sure if this should be the value instead of 'new value'
            })
        })) 
    })

    it('matches snapshot', () => {
        const { container } = render(< InputWithLabel {...inputWithLabelProps} />)
        expect(container.firstChild).toMatchSnapshot()
    })
})
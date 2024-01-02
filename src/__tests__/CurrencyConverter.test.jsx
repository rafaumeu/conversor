import CurrencyConverter from '../components/CurrencyConverter'
import React from 'react'
import '@testing-library/react'
import { render } from '@testing-library/react'

describe('Currency rendered', () => {
  it('should ', () => {
    const { getByText } = render(<CurrencyConverter />)
    const currencyConverterElement = getByText('CurrencyConverter')
    expect(currencyConverterElement).toBeInTheDocument()
  })
})

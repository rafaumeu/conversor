import CurrencyConverter from '../components/CurrencyConverter'
import React from 'react'
import { render, screen } from '@testing-library/react'

describe('Currency rendered', () => {
  it('should render application ', () => {
    const { getByText } = render(<CurrencyConverter />)
    const currencyConverterElement = getByText('Conversor de Moedas')
    expect(currencyConverterElement).toBeInTheDocument()
  })

  it('renders CurrencyConverter component with required elements', () => {
    render(<CurrencyConverter />)

    // Verifica se elementos importantes estão presentes
    expect(screen.getByText('Conversor de Moedas')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite o valor...')).toBeInTheDocument()
    expect(screen.getByText('Selecione as Moedas')).toBeInTheDocument()
    expect(screen.getByText('para')).toBeInTheDocument()
    expect(screen.getByText('BRL USD')).toBeInTheDocument()
    expect(screen.getByText('20 BRL valem 5 USD')).toBeInTheDocument()
  })
})

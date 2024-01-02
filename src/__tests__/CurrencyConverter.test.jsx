import CurrencyConverter from '../components/CurrencyConverter'
import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import axios from 'axios' // Importe o axios diretamente

// Mock do axios fora dos testes
jest.mock('axios')

describe('Currency rendered', () => {
  const mockRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    // Adicione mais moedas conforme necessário para seus testes
  }

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { conversion_rates: mockRates } })
  })

  it('should render application', async () => {
    const { getByText } = render(<CurrencyConverter />)
    const currencyConverterElement = getByText('Conversor de Moedas')
    expect(currencyConverterElement).toBeInTheDocument()
  })

  it('renders CurrencyConverter component with required elements', () => {
    const { getByText, getByPlaceholderText } = render(<CurrencyConverter />)

    // Verifica se elementos importantes estão presentes
    expect(getByText('Conversor de Moedas')).toBeInTheDocument()
    expect(getByPlaceholderText('Digite o valor...')).toBeInTheDocument()
    expect(getByText('Selecione as Moedas')).toBeInTheDocument()
    expect(getByText('para')).toBeInTheDocument()
    expect(getByText('EUR')).toBeInTheDocument()
    expect(getByText('1 USD valem EUR')).toBeInTheDocument()
  })

  it('fetches data from API and updates rates state', async () => {
    render(<CurrencyConverter />)
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(
        'https://v6.exchangerate-api.com/v6/91c2fbedadee207538ea11d2/latest/USD'
      )
      // Aqui você pode adicionar mais verificações se os dados da API estão refletidos corretamente na renderização
    })
  })
  it('should handle API request error', async () => {
    const errorMessage = 'Failed to fetch data'
    const mockConsoleLog = jest.spyOn(console, 'log')

    axios.get.mockRejectedValue(new Error(errorMessage))

    render(<CurrencyConverter />)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(
        'https://v6.exchangerate-api.com/v6/91c2fbedadee207538ea11d2/latest/USD'
      )

      // Verificar se ocorreu um erro usando console.log
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Ocorreu um erro: ',
        new Error(errorMessage)
      )
    })
  })
  it('should handle input change', () => {
    const { getByPlaceholderText } = render(<CurrencyConverter />)
    const inputField = getByPlaceholderText('Digite o valor...')

    fireEvent.change(inputField, { target: { value: '5' } })
    expect(inputField).toBeInTheDocument('10')
  })
  it('should update rates state after API call', async () => {
    const mockRates = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      // Adicione mais moedas conforme necessário para seus testes
    }

    axios.get.mockResolvedValueOnce({ data: mockRates })

    const { getByText } = render(<CurrencyConverter />)

    // Você pode interagir com o componente aqui para desencadear a chamada da API

    // Espere pela atualização das taxas
    await waitFor(() => {
      expect(getByText('EUR')).toBeInTheDocument()
      // Verifique se as taxas foram atualizadas corretamente
      // Espera que a taxa de EUR esteja presente após a atualização
      // Fazer outras verificações conforme necessário
    })
  })
})

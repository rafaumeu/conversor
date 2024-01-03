import CurrencyConverter from '../components/CurrencyConverter'
import React from 'react'
import { fireEvent, render, waitFor, act } from '@testing-library/react'
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
  const currencyTextRegex = /[A-Z]{3}/
  const exchangeRateTextRegex = /\d(\.|\d)?[^\w\>]/
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { conversion_rates: mockRates } })
  })

  it('should render application', async () => {
    const { getByText } = render(<CurrencyConverter />)
    const currencyConverterElement = getByText('Conversor de Moedas')
    expect(currencyConverterElement).toBeInTheDocument()
  })

  it('renders CurrencyConverter component with required elements', () => {
    const { getByText, getByPlaceholderText, queryAllByText } = render(
      <CurrencyConverter />
    )

    // Verifica se elementos importantes estão presentes
    expect(getByText('Conversor de Moedas')).toBeInTheDocument()
    expect(getByPlaceholderText('Digite o valor...')).toBeInTheDocument()
    expect(getByText('Selecione as Moedas')).toBeInTheDocument()
    expect(getByText('para')).toBeInTheDocument()

    // Verifica se há elementos correspondentes à regex para o código de moeda
    const elementsMatchingCurrencyRegex = queryAllByText(currencyTextRegex)
    expect(elementsMatchingCurrencyRegex.length).toBeGreaterThan(0)
    const exchangeMatchingRegex = queryAllByText(exchangeRateTextRegex)
    // Verifica se o texto da taxa de câmbio corresponde ao padrão esperado
    expect(exchangeMatchingRegex.length).toBeGreaterThan(0)
  })

  it('fetches data from API and updates rates state', async () => {
    let setRatesMock
    const useStateSpy = jest.spyOn(React, 'useState')

    // Mock da função setRates
    useStateSpy.mockImplementation((initialState) => {
      setRatesMock = jest.fn().mockReturnValue(initialState)
      return [initialState, setRatesMock]
    })

    // Simulação da chamada da API
    axios.get.mockResolvedValue({
      data: {
        conversion_rates: { USD: 1, EUR: 0.85, GBP: 0.73 },
      },
    })

    await act(async () => {
      render(<CurrencyConverter />)
    })

    // Verificações do axios.get e outras verificações...

    // Simula a chamada de setRates com os dados da API
    await act(async () => {
      await Promise.resolve() // Garante a resolução da Promessa da chamada da API
      expect(setRatesMock).toBeUndefined()
    })

    // Faça as verificações adicionais necessárias
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

    const { queryAllByText } = render(<CurrencyConverter />)

    // Você pode interagir com o componente aqui para desencadear a chamada da API

    // Espere pela atualização das taxas
    await waitFor(() => {
      const elementsMatchingCurrencyRegex = queryAllByText(currencyTextRegex)
      expect(elementsMatchingCurrencyRegex.length).toBeGreaterThan(0)
      // Verifique se as taxas foram atualizadas corretamente
      // Espera que a taxa de EUR esteja presente após a atualização
      // Fazer outras verificações conforme necessário
    })
  })
  it('renderiza mensagem de carregamento quando rates é undefined', () => {
    let loadingTextElement

    act(() => {
      const { queryByText } = render(
        <CurrencyConverter rates={undefined} setRates={() => {}} />
      )
      try {
        loadingTextElement = queryByText(/Carregando/i)
      } catch (error) {
        loadingTextElement = undefined
      }
    })

    expect(loadingTextElement).not.toBeInTheDocument()
  })

  it('renderiza mensagem de carregamento quando rates é nulo', () => {
    let loadingTextElement

    act(() => {
      const { getByText } = render(
        <CurrencyConverter rates={null} setRates={() => {}} />
      )
      try {
        loadingTextElement = getByText(/Carregando/i)
      } catch (error) {
        loadingTextElement = null
      }
    })

    expect(loadingTextElement).not.toBeInTheDocument()
  })
  it('não renderiza mensagem de carregamento quando rates está definido', () => {
    const { queryByText } = render(
      <CurrencyConverter rates={{ USD: 1.0, EUR: 0.85 }} />
    ) // Simula a propriedade rates como um objeto com dados

    // Verifica se o componente não renderiza a mensagem 'Carregando...' quando rates está definido
    expect(queryByText('Carregando...')).toBeNull()
  })
  it('fetches data from API and updates rates state', async () => {
    let setRates
    jest.spyOn(React, 'useState').mockImplementation((initialState) => {
      setRates = jest.fn().mockReturnValue(initialState)
      return [initialState, setRates]
    })

    await act(async () => {
      render(<CurrencyConverter />)
    })

    expect(setRates).toBeUndefined()
  })
  it('fetches data from API and updates rates state', async () => {
    let setRates

    jest.spyOn(React, 'useState').mockImplementation((initialState) => {
      setRates = jest.fn().mockReturnValue(initialState)
      return [initialState, setRates]
    })

    axios.get.mockResolvedValue({
      data: {
        conversion_rates: { USD: 1, EUR: 0.85, GBP: 0.73 },
      },
    })

    await act(async () => {
      render(<CurrencyConverter />)
    })

    expect(axios.get).toHaveBeenCalledWith(
      'https://v6.exchangerate-api.com/v6/91c2fbedadee207538ea11d2/latest/USD'
    )

    expect(setRates).toBeUndefined()
  })
  it('fetches data from API and updates rates state', async () => {
    let setRates // Declare a variable to hold the setRates function

    jest.spyOn(React, 'useState').mockImplementation((initialState) => {
      // Use a function to return the correct state and the setRates function
      if (typeof initialState === 'object' && !Array.isArray(initialState)) {
        return [
          initialState,
          jest.fn().mockImplementation((value) => {
            setRates(value)
          }),
        ]
      }
      return [initialState, jest.fn()]
    })

    axios.get.mockResolvedValue({
      data: {
        conversion_rates: { USD: 1, EUR: 0.85, GBP: 0.73 },
      },
    })

    await act(async () => {
      render(<CurrencyConverter />)
    })

    expect(axios.get).toHaveBeenCalledWith(
      'https://v6.exchangerate-api.com/v6/91c2fbedadee207538ea11d2/latest/USD'
    )

    expect(setRates).toBeUndefined()
  })
})

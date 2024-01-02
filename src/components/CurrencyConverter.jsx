import './CurrencyConverter.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
const CurrencyConverter = () => {
  const [rates, setRates] = useState({})
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [amount, setAmount] = useState(1)
  const [convertedAmount, setConvertedAmount] = useState(null)

  useEffect(() => {
    axios
      .get(
        'https://v6.exchangerate-api.com/v6/91c2fbedadee207538ea11d2/latest/USD'
      )
      .then((response) => {
        setRates(response.data.conversion_rates || {}) // Set rates to an empty object if response data is null or undefined
      })
      .catch((error) => {
        console.log('Ocorreu um erro: ', error)
      })
  }, [])
  return (
    <div className='converter'>
      <h2>Conversor de Moedas</h2>
      <input
        type='number'
        placeholder='Digite o valor...'
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value)
        }}
      />
      <span>Selecione as Moedas</span>
      <select value={fromCurrency}>
        {Object.keys(rates).map((currency) => (
          <option value={currency} key={currency}>
            {currency}
          </option>
        ))}
      </select>
      <span>para</span>
      <select value={toCurrency}>
        {Object.keys(rates).map((currency) => (
          <option value={currency} key={currency}>
            {currency}
          </option>
        ))}
      </select>
      <h3>
        {convertedAmount} {toCurrency}
      </h3>
      <p>
        {amount} {fromCurrency} valem {convertedAmount} {toCurrency}
      </p>
    </div>
  )
}

export default CurrencyConverter

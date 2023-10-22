import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = type => {
  const [value, setValue] = useState('')

  const onChange = event => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange,
  }
}

const useCountry = name => {
  const [country, setCountry] = useState(null)
  const allCountries = useAllCountries()
  console.log(allCountries)
  useEffect(() => {
    const filtered = allCountries.allNames.filter(country => country.match(name))
    if(filtered.length === 1 ) {
      const index = allCountries.allNames.findIndex(name => name === filtered[0])
      setCountry({data: allCountries.allCountries[index], found:true})
    }
    console.log(filtered, name)
  }, [name])

  return country
}

const useAllCountries = () => {
  const [allCountries, setAllCountries] = useState([])
  const [allNames, setAllNames] = useState([])
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => setAllCountries(res.data))
  }, [])

  useEffect(() => {
    setAllNames(allCountries.map(country => country.name.common.toLowerCase()))
    console.log(allNames)
  }, [allCountries])

  return { allCountries, allNames }
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return <div>not found...</div>
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img
        src={country.data.flags.png}
        height='100'
        alt={`flag of ${country.data.name}`}
      />
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = e => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App

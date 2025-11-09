import { useMemo, useState } from 'react'
import countryCodes from '../../data/countryCodes.json'

const COUNTRY_OPTIONS = countryCodes.map((country) => ({
  ...country,
  label: `${country.flag ? `${country.flag} ` : ''}${country.name} (${country.dialCode})`,
}))

export default function PhoneInput({
  value,
  onChange,
  label = 'Mobile phone',
  required = false,
  name = 'phone',
}) {
  const [selectedCountry, setSelectedCountry] = useState(() => COUNTRY_OPTIONS.find((c) => value?.startsWith(c.dialCode)) || COUNTRY_OPTIONS[0])
  const [localNumber, setLocalNumber] = useState(() => {
    if (!value || !selectedCountry) return ''
    return value.replace(selectedCountry.dialCode, '').trim()
  })

  function handleCountryChange(e) {
    const code = e.target.value
    const nextCountry = COUNTRY_OPTIONS.find((c) => c.dialCode === code) || COUNTRY_OPTIONS[0]
    setSelectedCountry(nextCountry)
    const digits = localNumber.replace(/\D/g, '')
    onChange?.(`${nextCountry.dialCode}${digits}`)
  }

  function handleNumberChange(e) {
    const raw = e.target.value
    const digits = raw.replace(/[^\d\s\-()+]/g, '')
    setLocalNumber(digits)
    const numberDigits = digits.replace(/\D/g, '')
    if (selectedCountry) {
      onChange?.(`${selectedCountry.dialCode}${numberDigits}`)
    } else {
      onChange?.(numberDigits)
    }
  }

  const placeholder = useMemo(() => {
    if (!selectedCountry) return '123 456 789'
    return `e.g., ${selectedCountry.example || '123 456 789'}`
  }, [selectedCountry])

  return (
    <label className="block text-sm text-gray-700">
      <span className="mb-1 block font-medium">{label}{required && ' *'}</span>
      <div className="flex rounded-md border border-gray-300 focus-within:border-gray-400 focus-within:ring-0">
        <select
          className="w-32 rounded-l-md border-r border-gray-200 bg-gray-50 px-2 py-2 text-sm outline-none"
          value={selectedCountry?.dialCode || ''}
          onChange={handleCountryChange}
          name={`${name}Country`}
        >
          {COUNTRY_OPTIONS.map((country) => (
            <option key={country.code} value={country.dialCode}>
              {country.flag} {country.dialCode}
            </option>
          ))}
        </select>
        <input
          type="tel"
          className="flex-1 rounded-r-md px-3 py-2 text-sm outline-none"
          value={localNumber}
          onChange={handleNumberChange}
          placeholder={placeholder}
          name={name}
          required={required}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">Include only digits from your phone number.</p>
    </label>
  )
}

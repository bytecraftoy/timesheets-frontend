import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders timesheets title', () => {
  render(<App />)
  const title = screen.getByText('Timesheets')
  expect(title).toBeInTheDocument()
})

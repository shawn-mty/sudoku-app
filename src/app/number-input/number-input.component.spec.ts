import { render, screen } from '@testing-library/angular'
import { NumberInputComponent } from './number-input.component'
import userEvent from '@testing-library/user-event'
const { getByRole } = screen

describe('GameStartComponent', () => {
  it('should render buttons correctly', async () => {
    await render(NumberInputComponent)

    expect(getByRole('button', { name: /Normal/i })).toBeVisible()
    expect(getByRole('button', { name: /Candidate/i })).toBeVisible()

    for (let i = 1; i <= 9; i++) {
      expect(getByRole('button', { name: i.toString() })).toBeVisible()
    }
  })

  it('should change to primary gray when choosing between normal and candidate buttons', async () => {
    await render(NumberInputComponent)

    const selectedButtonClass = 'bg-gray-900'
    const normalButton = getByRole('button', { name: /Normal/i })
    const candidateButton = getByRole('button', { name: /Candidate/i })

    expect(normalButton).toHaveClass(selectedButtonClass)
    expect(candidateButton).not.toHaveClass(selectedButtonClass)

    await userEvent.click(candidateButton)
    expect(normalButton).not.toHaveClass(selectedButtonClass)
    expect(candidateButton).toHaveClass(selectedButtonClass)
  })
})

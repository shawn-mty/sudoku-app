import { render, screen } from '@testing-library/angular'
import { GameStartComponent } from './game-start.component'
const { getByRole } = screen

describe('GameStartComponent', () => {
  it('should render buttons and content', async () => {
    await render(GameStartComponent)

    expect(getByRole('heading', { name: /Sudoku/i })).toBeVisible()
    expect(getByRole('heading', { name: /Select Difficulty/i })).toBeVisible()
    expect(getByRole('button', { name: /Easy/i })).toBeVisible()
    expect(getByRole('button', { name: /Medium/i })).toBeVisible()
    expect(getByRole('button', { name: /Hard/i })).toBeVisible()
    expect(getByRole('button', { name: /Random/i })).toBeVisible()
  })
})

import { render, screen } from '@testing-library/angular'
import { GameActionsComponent } from './game-actions.component'
const { getByRole } = screen

describe('GameActionsComponent', () => {
  it('should render buttons', async () => {
    await render(GameActionsComponent)

    expect(getByRole('button', { name: /Validate/i })).toBeVisible()
    expect(getByRole('button', { name: /Auto Solve/i })).toBeVisible()
  })
})

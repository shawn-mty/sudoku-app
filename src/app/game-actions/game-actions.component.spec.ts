import { render, screen } from '@testing-library/angular'
import { GameActionsComponent } from './game-actions.component'
const { getByRole } = screen

describe('GameActionsComponent', () => {
  it('should render buttons', async () => {
    const { fixture } = await render(GameActionsComponent)

    fixture.componentInstance.hasGameStarted = true
    fixture.detectChanges()

    expect(getByRole('button', { name: /Validate/i })).toBeVisible()
    expect(getByRole('button', { name: /Auto Solver/i })).toBeVisible()
  })
})

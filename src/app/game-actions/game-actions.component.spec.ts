import { render, screen } from '@testing-library/angular'
import { GameActionsComponent } from './game-actions.component'
const { getByRole, findByRole } = screen

describe('GameActionsComponent', () => {
  it('should render buttons', async () => {
    const { fixture } = await render(GameActionsComponent)

    fixture.componentInstance.hasGameStarted = true
    fixture.detectChanges()

    expect(await findByRole('button', { name: /Auto Solver/i })).toBeVisible()
    expect(getByRole('button', { name: /Validate/i })).toBeVisible()
    expect(getByRole('button', { name: /Reset Board/i })).toBeVisible()
  })
})

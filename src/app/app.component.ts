import { Component, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GameBoardComponent } from './game-board/game-board.component'
import { NumberInputComponent } from './number-input/number-input.component'
import { GameStartComponent } from './game-start/game-start.component'
import { GameActionsComponent } from './game-actions/game-actions.component'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    GameBoardComponent,
    NumberInputComponent,
    GameStartComponent,
    GameActionsComponent,
    CommonModule,
  ],
})
export class AppComponent {
  @ViewChild(GameBoardComponent) GameBoard!: GameBoardComponent
  hasChosenDifficulty = false

  onNumberSelected(selectedNumber: SelectedNumber): void {
    if (selectedNumber.mode === 'normal') {
      this.GameBoard.updateCellWithSelectedNumber(selectedNumber.number)
    } else if (selectedNumber.mode === 'candidate') {
      this.GameBoard.updateCellWithSelectedCandidateNumber(selectedNumber.number.toString())
    }
  }

  resetCellCandidateNumbers(): void {
    this.GameBoard.resetCellCandidateNumbers()
  }

  resetCellNumber(): void {
    this.GameBoard.resetCellNumber()
  }

  fetchPuzzle(difficulty: Difficulty): void {
    this.hasChosenDifficulty = true
    this.GameBoard.fetchPuzzle(difficulty)
  }

  validate(): void {
    this.GameBoard.validate()
  }

  autoSolve(): void {
    this.GameBoard.autoSolve()
  }
}

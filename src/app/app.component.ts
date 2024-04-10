import { Component, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GameBoardComponent } from '@/game-board/game-board.component'
import { NumberInputComponent } from './number-input/number-input.component'
import { GameStartComponent } from './game-start/game-start.component'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [GameBoardComponent, NumberInputComponent, GameStartComponent, CommonModule],
})
export class AppComponent {
  @ViewChild(GameBoardComponent) GameBoard!: GameBoardComponent
  hasChosenDifficulty = false

  onNumberSelected(selectedNumber: SelectedNumber): void {
    this.GameBoard.updateCellWithSelectedNumber(selectedNumber.number)
  }

  onCandidateNumberSelected(selectedNumber: SelectedCandidateNumber): void {
    this.GameBoard.updateCellWithSelectedCandidateNumber(selectedNumber.number)
  }

  resetCellCandidateNumbers(): void {
    this.GameBoard.resetCellCandidateNumbers()
  }

  resetCellNumber(): void {
    this.GameBoard.resetCellNumber()
  }

  fetchBoard(difficulty: Difficulty): void {
    this.hasChosenDifficulty = true
    this.GameBoard.fetchBoard(difficulty)
  }
}

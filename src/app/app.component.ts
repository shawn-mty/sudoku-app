import { Component, ViewChild } from '@angular/core'
import { GameBoardComponent } from './game-board/game-board.component'
import { NumberInputComponent } from './number-input/number-input.component'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [GameBoardComponent, NumberInputComponent],
})
export class AppComponent {
  @ViewChild(GameBoardComponent) GameBoard!: GameBoardComponent

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
}

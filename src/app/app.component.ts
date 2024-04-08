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
  currentSelectedNumber: number | null = null
  currentSelectedCandidateNumber: string | null = null

  onNumberSelected(selectedNumber: SelectedNumber): void {

    if (selectedNumber.mode === 'normal') {
      this.currentSelectedNumber = selectedNumber.number
      this.currentSelectedCandidateNumber = null
    } else if (selectedNumber.mode === 'candidate') {
      this.currentSelectedCandidateNumber = selectedNumber.number.toString()
      this.currentSelectedNumber = null
    }
  }

  resetCellCandidateNumbers(): void {
    this.GameBoard.resetCellCandidateNumbers()
  }
}

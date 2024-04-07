import { Component } from '@angular/core'
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
  currentSelectedNumber: number | null = null
  currentSelectedCanadidateNumber: number | null = null

  onNumberSelected(selectedNumber: SelectedNumber): void {
    console.log('Number selected:', selectedNumber.number, 'Mode:', selectedNumber.mode)
    if (selectedNumber.mode === 'normal') {
      this.currentSelectedNumber = selectedNumber.number
      this.currentSelectedCanadidateNumber = null
    } else if (selectedNumber.mode === 'candidate') {
      this.currentSelectedCanadidateNumber = selectedNumber.number
      this.currentSelectedNumber = null
    }
  }
}

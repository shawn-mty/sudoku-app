import { Component, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'

type InputMode = 'normal' | 'candidate'

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class NumberInputComponent {
  @Output() numberSelected = new EventEmitter<SelectedNumber>()
  @Output() candidateNumberSelected = new EventEmitter<SelectedCandidateNumber>()
  @Output() resetCellCandidateNumbers = new EventEmitter<void>()
  @Output() resetCellNumber = new EventEmitter<void>()
  selectedMode: InputMode = 'normal'
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  setMode(mode: InputMode): void {
    this.selectedMode = mode
  }

  selectNumber(number: number): void {
    if (this.selectedMode === 'normal') {
      this.numberSelected.emit({ number, mode: this.selectedMode })
    } else if (this.selectedMode === 'candidate') {
      this.candidateNumberSelected.emit({ number: number.toString(), mode: this.selectedMode })
    }
  }

  reset(): void {
    if (this.selectedMode === 'normal') {
      this.resetCellNumber.emit()
    } else if (this.selectedMode === 'candidate') {
      this.resetCellCandidateNumbers.emit()
    }
  }
}

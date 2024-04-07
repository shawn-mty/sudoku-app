import { Component, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'

type InputMode = 'normal' | 'candidate'

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class NumberInputComponent {
  @Output() numberSelected = new EventEmitter<{ number: number; mode: InputMode }>()
  mode: InputMode = 'normal'
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  setMode(mode: InputMode): void {
    this.mode = mode
  }

  selectNumber(number: number): void {
    this.numberSelected.emit({ number: number, mode: this.mode })
  }
}

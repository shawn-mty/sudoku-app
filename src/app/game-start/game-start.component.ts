import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Output } from '@angular/core'

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-game-start',
  templateUrl: './game-start.component.html',
  styleUrls: ['./game-start.component.scss'],
})
export class GameStartComponent {
  @Output() difficultySelected = new EventEmitter<Difficulty>()

  selectDifficulty(difficulty: Difficulty) {
    this.difficultySelected.emit(difficulty)
  }
}

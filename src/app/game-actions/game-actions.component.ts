import { Component, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-game-actions',
  imports: [CommonModule],
  templateUrl: './game-actions.component.html',
  standalone: true,
})
export class GameActionsComponent {
  @Output() validate = new EventEmitter<void>()
  @Output() solve = new EventEmitter<void>()
}

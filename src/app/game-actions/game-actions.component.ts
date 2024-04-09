import { Component, EventEmitter, Output, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-game-actions',
  imports: [CommonModule],
  templateUrl: './game-actions.component.html',
  standalone: true,
})
export class GameActionsComponent {
  @Input() status: Status = 'unsolved'
  @Output() validate = new EventEmitter<void>()
  @Output() solve = new EventEmitter<void>()
  @Output() resetBoard = new EventEmitter<void>()
}

import { Component, EventEmitter, Output, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoadingSpinnerComponent } from '@/loading-spinner/loading-spinner.component'

@Component({
  selector: 'app-game-actions',
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './game-actions.component.html',
  standalone: true,
})
export class GameActionsComponent {
  @Input() hasGameStarted: boolean = false
  @Input() isValidating: boolean = false
  @Input() isSolving: boolean = false
  @Output() validate = new EventEmitter<void>()
  @Output() solve = new EventEmitter<void>()
  @Output() resetBoard = new EventEmitter<void>()
}

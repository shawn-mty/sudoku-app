import { Component } from '@angular/core'
import { GameBoardComponent } from './game-board/game-board.component'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [GameBoardComponent],
})
export class AppComponent {
  title = 'sudoku-app'

  
}

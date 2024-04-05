import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NgIf, NgFor, NgClass } from '@angular/common'

@Component({
  selector: 'app-game-board',
  standalone: true,
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  imports: [NgIf, NgFor, NgClass],
})
export class GameBoardComponent implements OnInit {
  puzzle: number[][] = []
  loading: boolean = false

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPuzzle()
  }

  fetchPuzzle(): void {
    this.loading = true
    this.http
      .get<any>('https://sugoku.onrender.com/board?difficulty=easy')
      .subscribe((response) => {
        this.puzzle = response.board
        this.loading = false
      })
  }

  cellClicked(rowIndex: number, cellIndex: number): void {
    console.log(`Cell clicked: Row ${rowIndex}, Column ${cellIndex}`)
    // Here, you can add logic to manipulate the cell or perform other actions
  }
}

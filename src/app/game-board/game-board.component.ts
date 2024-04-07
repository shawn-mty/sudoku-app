import { Component, OnInit, Input } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-game-board',
  standalone: true,
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  imports: [CommonModule],
})
export class GameBoardComponent implements OnInit {
  @Input() selectedNumber: SelectedNumber | null = null

  selectedRowIndex: number | null = null
  selectedCellIndex: number | null = null
  board: number[][] = []
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
        this.board = response.board
        this.loading = false
      })
  }

  selectCell(number: number): void {
    if (this.selectedRowIndex !== null && this.selectedCellIndex !== null) {
      this.board[this.selectedRowIndex][this.selectedCellIndex] = number
    }
  }

  cellClicked(rowIndex: number, cellIndex: number): void {
    this.selectedRowIndex = rowIndex
    this.selectedCellIndex = cellIndex
    console.log(`Cell clicked: Row ${rowIndex}, Column ${cellIndex}`)
  }

  validatePuzzle(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })

    const body = new URLSearchParams()
    body.set('board', JSON.stringify(this.board))

    this.http
      .post<any>('https://sugoku.onrender.com/validate', body.toString(), { headers })
      .subscribe({
        next: (response) => {
          console.log(response)

          if (response.status === 'solved') {
            console.log('Puzzle is correctly solved!')
          } else {
            console.log('Puzzle is not solved correctly. Status:', response.status)
          }
        },
        error: (err) => {
          console.error('Validation error:', err)
        },
      })
  }
}

import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonModule } from '@angular/common'

type Candidate = {
  [K in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9]: boolean
}

@Component({
  selector: 'app-game-board',
  standalone: true,
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  imports: [CommonModule],
})
export class GameBoardComponent implements OnInit, OnChanges {
  @Input() selectedNumber: number | null = null

  selectedRowIndex: number | null = null
  selectedCellIndex: number | null = null
  board: number[][] = []
  candidateBoard: Candidate[][] = []
  loading: boolean = false

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPuzzle()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedNumber']) {
      this.updateCellWithSelectedNumber()
      this.selectedCellIndex = null
      this.selectedRowIndex = null
    }
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

  cellClicked(rowIndex: number, cellIndex: number): void {
    this.selectedRowIndex = rowIndex
    this.selectedCellIndex = cellIndex
    this.updateCellWithSelectedNumber()
  }

  updateCellWithSelectedNumber(): void {
    if (
      this.selectedRowIndex !== null &&
      this.selectedCellIndex !== null &&
      this.selectedNumber !== null
    ) {
      this.board[this.selectedRowIndex][this.selectedCellIndex] = this.selectedNumber
      console.log(
        `Updated Row ${this.selectedRowIndex}, Column ${this.selectedCellIndex} with ${this.selectedNumber}`,
      )
    }
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

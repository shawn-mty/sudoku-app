import { Component } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonModule } from '@angular/common'

type CandidateNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type CandidateCell = {
  [K in CandidateNumber]: boolean
}
type Board = Array<Array<number>>
export type BoardResponse = {
  board: Board
}

type ValidateStatus = 'solved' | 'unsolved' | 'broken'
type ValidateResponse = {
  status: ValidateStatus
}
type SolveResponse = {
  difficulty: Difficulty
  solution: Board
  status: 'solved' | 'broken' | 'unsolvable'
}

type Status = 'unsolved' | 'solved' | 'broken' | 'unsolvable'

@Component({
  selector: 'app-game-board',
  standalone: true,
  templateUrl: './game-board.component.html',
  imports: [CommonModule],
})
export class GameBoardComponent {
  candidateNumbers: CandidateNumber[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  selectedRowIndex: number | null = null
  selectedColIndex: number | null = null
  board: Board = []
  originalBoard: Board = []
  candidateBoard: CandidateCell[][] = []
  loading: boolean = false
  status: Status = 'unsolved'

  get computedStatus() {
    switch (this.status) {
      case 'solved':
        return 'Congrats, you win!'
      case 'unsolved':
        return "Let's go!"
      case 'broken':
        return 'Not quite, keep it up!'
      case 'unsolvable':
        return 'Try resetting the board and starting over'
    }
  }

  constructor(private http: HttpClient) {}

  resetCellCandidateNumbers(): void {
    if (this.selectedRowIndex !== null && this.selectedColIndex !== null) {
      const cell = this.candidateBoard[this.selectedRowIndex][this.selectedColIndex]
      Object.keys(cell).forEach((key) => {
        cell[key as CandidateNumber] = false
      })
    }
  }

  resetCellNumber() {
    if (this.selectedRowIndex !== null && this.selectedColIndex !== null) {
      this.board[this.selectedRowIndex][this.selectedColIndex] = 0
    }
  }

  resetBoard() {
    this.board = this.originalBoard.map((innerArray: number[]) => [...innerArray])
    this.status = 'unsolved'
  }

  fetchPuzzle(difficulty: Difficulty): void {
    this.loading = true
    this.http
      .get<BoardResponse>(`https://sugoku.onrender.com/board?difficulty=${difficulty}`)
      .subscribe((response) => {
        this.board = response.board
        this.originalBoard = response.board.map((innerArray: number[]) => [...innerArray])

        this.initializeCandidateBoard()
        this.loading = false
      })
  }

  cellClicked(rowIndex: number, colIndex: number): void {
    if (rowIndex !== null && colIndex !== null && this.originalBoard[rowIndex][colIndex] !== 0) {
      return
    }

    this.selectedRowIndex = rowIndex
    this.selectedColIndex = colIndex
  }

  initializeCandidateBoard(): void {
    this.candidateBoard = Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => ({
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            8: false,
            9: false,
          })),
      )
  }

  updateCellWithSelectedCandidateNumber(selectedCandidateNumber: string): void {
    if (this.selectedRowIndex !== null && this.selectedColIndex !== null) {
      const currentCandidateCell = this.candidateBoard[this.selectedRowIndex][
        this.selectedColIndex
      ] as CandidateCell
      currentCandidateCell[selectedCandidateNumber as CandidateNumber] = true
    }
  }

  updateCellWithSelectedNumber(selectedNumber: number): void {
    if (
      this.selectedRowIndex !== null &&
      this.selectedColIndex !== null &&
      selectedNumber !== null
    ) {
      this.board[this.selectedRowIndex][this.selectedColIndex] = selectedNumber

      if (this.isBoardFull()) {
        this.validate()
      }
    }
  }

  isBoardFull(): boolean {
    return this.board.every((row) => row.every((cell) => cell !== 0))
  }

  validate(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })

    const body = new URLSearchParams()
    body.set('board', JSON.stringify(this.board))

    this.http
      .post<ValidateResponse>('https://sugoku.onrender.com/validate', body.toString(), { headers })
      .subscribe({
        next: (response) => {
          this.status = response.status
        },
        error: (err) => {
          console.error('Validation error:', err)
        },
      })
  }

  autoSolve(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })

    const body = new URLSearchParams()
    body.set('board', JSON.stringify(this.originalBoard))

    this.http
      .post<SolveResponse>('https://sugoku.onrender.com/solve', body.toString(), { headers })
      .subscribe({
        next: (response) => {
          this.board = response.solution
          this.status = response.status
        },
        error: (err) => {
          console.error('Auto solve error:', err)
        },
      })
  }
}

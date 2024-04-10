import { Component } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { GameActionsComponent } from '@/game-actions/game-actions.component'

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

@Component({
  selector: 'app-game-board',
  standalone: true,
  templateUrl: './game-board.component.html',
  imports: [CommonModule, GameActionsComponent],
})
export class GameBoardComponent {
  candidateNumbers: CandidateNumber[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  selectedRowIndex: number | null = null
  selectedColIndex: number | null = null
  board: Board = []
  originalBoard: Board = []
  candidateBoard: CandidateCell[][] = []
  isLoading = false
  isValidating = false
  isSolving = false
  status: Status = 'unsolved'
  isStatusBouncing = false

  get computedStatus() {
    switch (this.status) {
      case 'solved':
        return 'Congrats, you win!'
      case 'unsolved':
        return 'Everything is right so far...'
      case 'broken':
        return 'At least one number broke along the way'
      case 'unsolvable':
        return 'Something broke, reset the board and trying again'
    }
  }

  get hasGameStarted() {
    return this.hasBoardFilledAtAll() && this.status !== 'solved'
  }

  constructor(private http: HttpClient) {}

  resetBoard() {
    this.board = this.originalBoard.map((innerArray: number[]) => [...innerArray])
    this.initializeCandidateBoard()
    this.unselectCell()
    this.status = 'unsolved'
  }

  fetchBoard(difficulty: Difficulty): void {
    this.isLoading = true
    this.http
      .get<BoardResponse>(`https://sugoku.onrender.com/board?difficulty=${difficulty}`)
      .subscribe((response) => {
        this.board = response.board
        this.originalBoard = response.board.map((innerArray: number[]) => [...innerArray])

        this.initializeCandidateBoard()
        this.isLoading = false
      })
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

  isCellSelected(): this is { selectedRowIndex: number; selectedColIndex: number } {
    return this.selectedRowIndex !== null && this.selectedColIndex !== null
  }

  resetCellCandidateNumbers(): void {
    if (!this.isCellSelected()) return

    const cell = this.candidateBoard[this.selectedRowIndex][this.selectedColIndex]
    Object.keys(cell).forEach((key) => {
      cell[key as CandidateNumber] = false
    })
  }

  resetCellNumber() {
    if (!this.isCellSelected()) return

    this.board[this.selectedRowIndex][this.selectedColIndex] = 0
  }

  cellClicked(rowIndex: number, colIndex: number): void {
    if (
      (rowIndex !== null && colIndex !== null && this.originalBoard[rowIndex][colIndex] !== 0) ||
      this.isBoardFull()
    ) {
      return
    }

    this.selectedRowIndex = rowIndex
    this.selectedColIndex = colIndex
  }

  unselectCell(): void {
    this.selectedRowIndex = null
    this.selectedColIndex = null
  }

  updateCellWithSelectedCandidateNumber(selectedCandidateNumber: string): void {
    if (!this.isCellSelected()) return

    const currentCandidateCell = this.candidateBoard[this.selectedRowIndex][
      this.selectedColIndex
    ] as CandidateCell
    currentCandidateCell[selectedCandidateNumber as CandidateNumber] = true
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

  bounceStatus(): void {
    this.isStatusBouncing = true
    setTimeout(() => {
      this.isStatusBouncing = false
    }, 500)
  }

  validate(): void {
    this.isValidating = true

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
          if (
            (response.status === 'unsolved' && this.status === 'unsolved') ||
            response.status === 'solved'
          ) {
            this.bounceStatus()
          }
          this.isValidating = false
        },
        error: (err) => {
          console.error('Validation error:', err)
        },
      })
  }

  hasBoardFilledAtAll(): boolean {
    const countNonZeroes = (array: number[][]) => {
      let nonZeroCount = 0
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
          if (array[i][j] !== 0) {
            nonZeroCount++
          }
        }
      }
      return nonZeroCount
    }

    return countNonZeroes(this.board) > countNonZeroes(this.originalBoard)
  }

  autoSolve(): void {
    this.isSolving = true
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })

    const body = new URLSearchParams()
    body.set('board', JSON.stringify(this.board))

    this.http
      .post<SolveResponse>('https://sugoku.onrender.com/solve', body.toString(), { headers })
      .subscribe({
        next: (response) => {
          this.board = response.solution
          this.status = response.status

          if (this.status === 'solved') {
            this.bounceStatus()
            this.unselectCell()
          }

          this.isSolving = false
        },
        error: (err) => {
          console.error('Auto solve error:', err)
        },
      })
  }
}

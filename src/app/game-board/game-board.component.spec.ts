import { render, screen } from '@testing-library/angular'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { userEvent } from '@testing-library/user-event'
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing'
import { GameBoardComponent } from '@/game-board/game-board.component'
const { findByTestId, findAllByText, getAllByText, findAllByTestId, getByText } = screen
import { dummyBoard, dummySolvedResponse } from '@/testData'

describe('Gameboard Tests', () => {
  let httpMock: HttpTestingController
  let boardRequest: TestRequest
  let gameBoardComponent: GameBoardComponent
  let gameBoardFixture: ComponentFixture<GameBoardComponent>

  beforeEach(async () => {
    const { fixture } = await render(GameBoardComponent, {
      imports: [HttpClientTestingModule],
    })

    httpMock = TestBed.inject(HttpTestingController)
    gameBoardFixture = fixture
    gameBoardComponent = gameBoardFixture.componentInstance
    await gameBoardComponent.fetchBoard('medium')
    gameBoardFixture.detectChanges()

    boardRequest = httpMock.expectOne('https://sugoku.onrender.com/board?difficulty=medium')
    boardRequest.flush({
      board: dummyBoard,
    })
  })

  it('should render gameboard cells correctly', async () => {
    expect((await findAllByText('1')).length).toBe(3)
    expect(getAllByText('2').length).toBe(7)
    expect(getAllByText('3').length).toBe(3)
    expect(getAllByText('4').length).toBe(4)
    expect(getAllByText('5').length).toBe(4)
    expect(getAllByText('6').length).toBe(2)
    expect(getAllByText('7').length).toBe(5)
    expect(getAllByText('8').length).toBe(2)
    expect(getAllByText('9').length).toBe(5)

    gameBoardComponent.board = dummySolvedResponse.solution
    gameBoardFixture.detectChanges()

    for (let i = 1; i <= 9; i++) {
      expect(getAllByText(i.toString()).length).toBe(9)
    }
  })

  it('should display all candidate numbers correctly', async () => {
    const candidateNumbers = await findAllByTestId('candidate-number')

    const numberOfEmptyCells = dummyBoard.flat().filter((cell) => cell === 0).length
    expect(candidateNumbers.length).toBe(numberOfEmptyCells * 9)
  })

  it('should display loading cells and not actual board when loading', async () => {
    gameBoardComponent.isLoading = true
    gameBoardFixture.detectChanges()

    const loadingCells = await findAllByTestId('loading-cell')
    expect(loadingCells.length).toBe(81)
    expect(loadingCells[0]).toHaveClass('animate-pulse')
    expect(getByText('Loading...')).toBeVisible()
  })

  it('should highlight correct cell when clicked', async () => {
    const originalBoardCell = await findByTestId('cell-8-8')
    const emptyCell = await findByTestId('cell-8-7')

    expect(emptyCell).toHaveClass('bg-gray-950')
    await userEvent.click(emptyCell)
    expect(emptyCell).toHaveClass('bg-gray-800')

    expect(originalBoardCell).toHaveClass('bg-gray-950')
    await userEvent.click(originalBoardCell)
    expect(originalBoardCell).not.toHaveClass('bg-gray-800')
  })
})

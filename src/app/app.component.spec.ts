import { render, screen, within } from '@testing-library/angular'
import { TestBed } from '@angular/core/testing'
import { userEvent } from '@testing-library/user-event'
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing'

import { AppComponent } from './app.component'
const { queryByTestId, findByTestId, getByTestId, findByText, getByText, queryByRole, findByRole } =
  screen
import { dummyBoard, dummySolvedResponse } from '@/testData'

describe('AppComponent Integration Tests', () => {
  let httpMock: HttpTestingController
  let boardRequest: TestRequest

  beforeEach(async () => {
    await render(AppComponent, {
      imports: [HttpClientTestingModule],
    })

    httpMock = TestBed.inject(HttpTestingController)
    const button = await findByText(/Easy/i)
    await userEvent.click(button)

    boardRequest = httpMock.expectOne('https://sugoku.onrender.com/board?difficulty=easy')
    expect(boardRequest.request.method).toEqual('GET')

    boardRequest.flush({
      board: dummyBoard,
    })
  })

  const insertNormalNumber = async (gameBoard: HTMLElement, testId: string, number: string) => {
    await userEvent.click(within(gameBoard).getByTestId(testId))

    const numberInput = await findByTestId('number-input')
    await userEvent.click(within(numberInput).getByText(/Normal/i))
    const numberButton = within(numberInput).getByText(number)
    await userEvent.click(numberButton)
  }

  const insertCandidateNumbers = async (cell: Element, num1: string, num2: string) => {
    await userEvent.click(cell)

    const numberInput = await findByTestId('number-input')
    await userEvent.click(within(numberInput).getByText(/Candidate/i))
    await userEvent.click(within(numberInput).getByText(num1))
    await userEvent.click(within(numberInput).getByText(num2))
  }

  it('should render the game board and number input components after difficulty chosen', async () => {
    expect(queryByTestId('game-start')).toBeNull()

    const gameBoard = await findByTestId('game-board')
    expect(within(gameBoard).getAllByText('6').length).toBe(2)

    const numberInput = getByTestId('number-input')
    expect(within(numberInput).getByText(/Candidate/i)).toBeVisible()
    expect(within(numberInput).getByText(/Normal/i)).toBeVisible()

    const gameActions = getByTestId('game-actions')
    expect(within(gameActions).getByText(/Reset/i)).toBeVisible()
    expect(within(gameActions).getByText(/Auto Solver/i)).toBeVisible()
  })

  it('should update a selected square with a normal number', async () => {
    const gameBoard = await findByTestId('game-board')
    await insertNormalNumber(gameBoard, 'cell-0-1', '5')

    const numberText = within(within(gameBoard).getByTestId('cell-0-1')).getByText('5')
    expect(numberText).toBeVisible()
  })

  it('should update a selected square with multiple candidate numbers', async () => {
    const cell = await findByTestId('cell-0-2')
    await insertCandidateNumbers(cell, '3', '7')

    expect(cell.textContent).toContain('3')
    expect(cell.textContent).toContain('7')
  })

  it('should overwrite candidate numbers in a selected square with a normal number', async () => {
    const cellTestId = 'cell-0-5'
    const candidateNum1 = '4'
    const candidateNum2 = '5'
    const normalNum = '9'
    const cell = await findByTestId(cellTestId)
    const gameBoard = getByTestId('game-board')

    await insertCandidateNumbers(cell, candidateNum1, candidateNum2)
    expect(cell.textContent).toContain(candidateNum1)
    expect(cell.textContent).toContain(candidateNum2)

    await insertNormalNumber(gameBoard, cellTestId, normalNum)
    const numberText = within(within(gameBoard).getByTestId(cellTestId)).getByText(normalNum)
    expect(numberText).toBeVisible()

    expect(within(cell).queryByText(candidateNum1)).toBeNull()
    expect(within(cell).queryByText(candidateNum2)).toBeNull()
  })

  it('should reset a normal number in a square cell that is not part of the original board', async () => {
    const normalNum = '8'
    const cellTestId = 'cell-0-8'
    const originalBoardCellTestId = 'cell-0-0'
    const gameBoard = await findByTestId('game-board')
    const cell = getByTestId(cellTestId)
    const originalBoardCell = getByTestId(originalBoardCellTestId)
    const numberInput = getByTestId('number-input')

    await insertNormalNumber(gameBoard, originalBoardCellTestId, normalNum)
    expect(within(originalBoardCell).queryByText(normalNum)).toBeNull()

    await insertNormalNumber(gameBoard, cellTestId, normalNum)
    const numberText = within(within(gameBoard).getByTestId(cellTestId)).getByText(normalNum)
    expect(numberText).toBeVisible()

    await userEvent.click(within(numberInput).getByText(/Reset/i))
    expect(within(cell).queryByText(normalNum)).toBeNull()
  })

  it('should reset candidate numbers in a square cell that is not part of the original board', async () => {
    const cellTestId = 'cell-0-4'
    const gameBoard = await findByTestId('game-board')
    const numberInput = getByTestId('number-input')
    const candidateNum1 = '1'
    const candidateNum2 = '2'

    const cell = await within(gameBoard).findByTestId(cellTestId)
    await insertCandidateNumbers(cell, candidateNum1, candidateNum2)
    expect(cell.textContent).toContain(candidateNum1)
    expect(cell.textContent).toContain(candidateNum2)

    await userEvent.click(within(numberInput).getByText(/Reset/i))
    expect(within(cell).queryByText(candidateNum1)).toBeNull()
    expect(within(cell).queryByText(candidateNum2)).toBeNull()
  })

  it("should validate the board and display a 'solved' status", async () => {
    const unsolvedStatus = 'Everything is right so far...'

    expect(await findByText(unsolvedStatus)).toBeVisible()

    const validateButton = await findByText(/Validate/i)
    await userEvent.click(validateButton)
    const validationRequest = httpMock.expectOne('https://sugoku.onrender.com/validate')
    validationRequest.flush({ status: 'unsolved' })
    expect(validationRequest.request.method).toEqual('POST')

    expect(await findByText(unsolvedStatus)).toBeVisible()

    await userEvent.click(getByText(/Auto Solver/i))
    const solveRequest = httpMock.expectOne('https://sugoku.onrender.com/solve')
    solveRequest.flush(dummySolvedResponse)
    expect(solveRequest.request.method).toEqual('POST')

    await userEvent.click(validateButton)
    const successfulValidationRequest = httpMock.expectOne('https://sugoku.onrender.com/validate')
    successfulValidationRequest.flush({ status: 'solved' })
    expect(successfulValidationRequest.request.method).toEqual('POST')

    const winningMessage = await screen.findByText('Congrats, you win!')
    expect(winningMessage).toBeVisible()
  })

  it('should show broken state when there are incorrect cells and we validate', async () => {
    const brokenStatus = 'At least one number broke along the way'

    const gameBoard = await findByTestId('game-board')
    await insertNormalNumber(gameBoard, 'cell-7-6', '8')

    await userEvent.click(getByText(/Validate/i))
    const validationRequest = httpMock.expectOne('https://sugoku.onrender.com/validate')
    validationRequest.flush({ status: 'broken' })
    expect(validationRequest.request.method).toEqual('POST')

    expect(await findByText(brokenStatus)).toBeVisible()
  })

  it('should show unsolvable state if the board has incorrect cells and we click autosolve', async () => {
    const unsolvableStatus = 'Something broke, reset the board and try again'

    const gameBoard = await findByTestId('game-board')
    await insertNormalNumber(gameBoard, 'cell-7-8', '2')

    await userEvent.click(getByText(/Auto Solver/i))
    const solveRequest = httpMock.expectOne('https://sugoku.onrender.com/solve')
    solveRequest.flush({ status: 'unsolvable' })
    expect(solveRequest.request.method).toEqual('POST')

    expect(await findByText(unsolvableStatus)).toBeVisible()
  })

  it('should reset the board when the reset button is clicked', async () => {
    const gameBoard = await findByTestId('game-board')
    const gameActions = getByTestId('game-actions')

    for (let i = 1; i <= 3; i++) {
      await insertNormalNumber(gameBoard, `cell-3-${i}`, '1')
    }

    const cell = await findByTestId('cell-3-1')
    expect(await within(cell).findByText('1')).toBeVisible()

    await userEvent.click(within(gameActions).getByText(/Reset/i))

    for (let i = 1; i <= 3; i++) {
      const cell = await findByTestId(`cell-3-${i}`)
      expect(cell.textContent).toBe('')
    }
  })

  it("doesn't show validate button until board has been filled a little", async () => {
    const gameBoard = await findByTestId('game-board')
    const cellTestId = 'cell-6-4'

    expect(queryByRole('button', { name: /Validate/i })).toBeNull()

    await insertNormalNumber(gameBoard, cellTestId, '1')

    expect(within(getByTestId(cellTestId)).getByText('1')).toBeVisible()

    await new Promise((resolve) => setTimeout(resolve, 1000))
    const validateButton = await findByRole('button', { name: /Validate/i })
    expect(validateButton).toBeVisible()
  })
})

import { render, fireEvent, screen, within } from '@testing-library/angular'
import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { AppComponent } from './app.component'
import { GameBoardComponent } from './game-board/game-board.component'
import { NumberInputComponent } from './number-input/number-input.component'
import { GameStartComponent } from './game-start/game-start.component'
const { queryByTestId, findByTestId, getByTestId } = screen

describe('AppComponent Integration Tests', () => {
  let httpMock: HttpTestingController

  beforeEach(async () => {
    await render(AppComponent, {
      imports: [
        GameBoardComponent,
        NumberInputComponent,
        GameStartComponent,
        HttpClientTestingModule,
      ],
    })
    httpMock = TestBed.inject(HttpTestingController)
  })

  it('should reflect the chosen difficulty in the API call and render the game board and number input components after game start', async () => {
    const button = await screen.findByText(/Easy/i)
    fireEvent.click(button)

    const req = httpMock.expectOne('https://sugoku.onrender.com/board?difficulty=easy')
    expect(req.request.method).toEqual('GET')
    req.flush({
      board: [
        [6, 0, 0, 0, 0, 0, 4, 7, 0],
        [1, 0, 3, 4, 0, 8, 0, 0, 9],
        [0, 7, 0, 0, 6, 0, 0, 2, 0],
        [2, 0, 0, 0, 3, 5, 0, 0, 0],
        [0, 0, 0, 0, 9, 0, 2, 0, 0],
        [7, 0, 9, 0, 2, 4, 0, 5, 0],
        [0, 3, 1, 7, 0, 0, 9, 0, 2],
        [8, 0, 2, 0, 5, 0, 0, 4, 0],
        [9, 0, 7, 2, 0, 1, 0, 0, 5],
      ],
    })

    expect(queryByTestId('game-start')).toBeNull()

    const gameBoard = await findByTestId('game-board')
    expect(within(gameBoard).getAllByText('6').length).toBe(2)
    expect(within(gameBoard).getAllByText('9').length).toBe(5)

    const numberInput = getByTestId('number-input')
    expect(within(numberInput).getByText(/Candidate/i)).toBeVisible()
    expect(within(numberInput).getByText(/Normal/i)).toBeVisible()

    const gameActions = await findByTestId('game-actions')
    expect(within(gameActions).getByText(/Validate/i)).toBeVisible()
    expect(within(gameActions).getByText(/Auto Solve/i)).toBeVisible()
  })
})

/*
Dummyboard validated

{
  "status": "solved"
}

*/

/*
The dummyboard solved

{
  "difficulty": "easy",
  "solution": [
    [
      6,
      9,
      5,
      3,
      1,
      2,
      4,
      7,
      8
    ],
    [
      1,
      2,
      3,
      4,
      7,
      8,
      5,
      6,
      9
    ],
    [
      4,
      7,
      8,
      5,
      6,
      9,
      1,
      2,
      3
    ],
    [
      2,
      1,
      4,
      6,
      3,
      5,
      8,
      9,
      7
    ],
    [
      3,
      5,
      6,
      8,
      9,
      7,
      2,
      1,
      4
    ],
    [
      7,
      8,
      9,
      1,
      2,
      4,
      3,
      5,
      6
    ],
    [
      5,
      3,
      1,
      7,
      4,
      6,
      9,
      8,
      2
    ],
    [
      8,
      6,
      2,
      9,
      5,
      3,
      7,
      4,
      1
    ],
    [
      9,
      4,
      7,
      2,
      8,
      1,
      6,
      3,
      5
    ]
  ],
  "status": "solved"
}
*/

// import { TestBed } from '@angular/core/testing'
// import { AppComponent } from './app.component'

// describe('AppComponent', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [AppComponent],
//     }).compileComponents()
//   })

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(AppComponent)
//     const app = fixture.componentInstance
//     expect(app).toBeTruthy()
//   })

//   it(`should have the 'sudoku-app' title`, () => {
//     const fixture = TestBed.createComponent(AppComponent)
//     const app = fixture.componentInstance
//     expect(app.title).toEqual('sudoku-app')
//   })

//   it('should render title', () => {
//     const fixture = TestBed.createComponent(AppComponent)
//     fixture.detectChanges()
//     const compiled = fixture.nativeElement as HTMLElement
//     expect(compiled.querySelector('h1')?.textContent).toContain('Hello, sudoku-app')
//   })
// })

declare global {
  type SelectedNumber = {
    number: number
    mode: string
  }
  type SelectedCandidateNumber = {
    number: string
    mode: string
  }

  type Difficulty = 'easy' | 'medium' | 'hard' | 'random'

  type Status = 'unsolved' | 'solved' | 'broken' | 'unsolvable'
}

export {}

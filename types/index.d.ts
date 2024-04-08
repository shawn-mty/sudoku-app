declare global {
  type SelectedNumber = {
    number: number
    mode: string
  }

  type Difficulty = 'easy' | 'medium' | 'hard' | 'random'
}

export {}

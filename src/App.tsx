import QuestionCard from './components/QuestionCard'
import { GlobalStyle, Wrapper } from './App.styles'
import React, { useState } from 'react'
import {
  fetchQuestions,
  Difficulty,
  QuestionState,
  AnswerObject,
} from './API/API'

const TOTAL_QUESTIONS = 10

function App() {
  //Components states management
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [questionNumber, setQuestionNumber] = useState(0)
  const [userAnswered, setUserAnswered] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  // event handlers
  const startQuiz = async () => {
    setLoading(true)
    setGameOver(false)
    const fetchedQuestions = await fetchQuestions(
      TOTAL_QUESTIONS,
      Difficulty.HARD
    )
    setQuestions(fetchedQuestions)
    setScore(0)
    setUserAnswered([])
    setQuestionNumber(0)
    setLoading(false)
  }
  const nextQuestion = async () => {
    const nextQuestion: number = questionNumber + 1
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setQuestionNumber(nextQuestion)
    }
  }
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value
      const result = questions[questionNumber].correct_answer === answer
      if (result) setScore((item) => item + 1)

      const answerObject: any = {
        question: questions[questionNumber].question,
        answer,
        result,
        correctAnswer: questions[questionNumber].correct_answer,
      }
      setUserAnswered((item) => [...item, answerObject])
    }
  }

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>Quiz</h1>
        {gameOver || userAnswered.length === TOTAL_QUESTIONS ? (
          <button className='start-btn' onClick={startQuiz}>
            Start Quiz
          </button>
        ) : null}
        {!gameOver ? <p className='score'>Score: {score} </p> : null}
        {loading ? <p>Loading...</p> : null}
        {!loading && !gameOver ? (
          <QuestionCard
            questionNumber={questionNumber + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[questionNumber].question}
            answers={questions[questionNumber].answers}
            userAnswer={userAnswered ? userAnswered[questionNumber] : undefined}
            callback={checkAnswer}
          />
        ) : null}
        {!gameOver &&
        !loading &&
        userAnswered.length === questionNumber + 1 &&
        questionNumber !== TOTAL_QUESTIONS - 1 ? (
          <button className='next-btn' onClick={nextQuestion}>
            Next
          </button>
        ) : null}
      </Wrapper>
    </>
  )
}

export default App

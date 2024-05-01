import React from 'react'
import Question from './Question'
import Answer from './Answer'
import {nanoid} from 'nanoid'

export default function Game(){

    const [gameStarted, setGameStarted] = React.useState(false)
    const [questionsArray, setQuestionsArray] = React.useState([])
    const [answersChecked, setAnswersChecked] = React.useState(false);


    React.useEffect(() => {
        if (gameStarted) {
            getQuestions();
        }
    }, [gameStarted])

    function startGame(){
        setGameStarted(!gameStarted)
    }

    function shuffleAnswers(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const randomNumber = Math.floor(Math.random() * (i + 1));
            [array[i], array[randomNumber]] = [array[randomNumber], array[i]];
        }
        return array;
    }

    function getQuestions(){
        fetch('https://opentdb.com/api.php?amount=10&type=multiple')
            .then(res => res.json())
            .then(data => {
                const newArray = []
                for(let i = 0; i < 10; i++){
                    const answers = [data.results[i].correct_answer, ...data.results[i].incorrect_answers];
                    const shuffledAnswers = shuffleAnswers(answers);
                    const arrayObjectItem = {
                        question: decodeURIComponent(data.results[i].question),
                        correctAnswer: data.results[i].correct_answer,
                        incorrectAnswers: data.results[i].incorrect_answers,
                        answerArray: shuffledAnswers,
                        key: nanoid(),
                        selectedIndex: null,
                        isAnswered: false,
                        isCorrect: false,
                        isChecked: false
                    }
                    newArray.push(arrayObjectItem)
                }
                setQuestionsArray(newArray)
            })
    }

    function clickAnswer(questionKey, selectedIndex, event) {
        const updatedQuestionsArray = questionsArray.map(question => {
            if (question.key === questionKey) {
                return {
                    ...question,
                    selectedIndex,
                    isAnswered: true,
                };
            }
            return question;
        });
        setQuestionsArray(updatedQuestionsArray);
    }

    function checkAnswers(){
        const updatedQuestionsArray = questionsArray.map(question => {
            const isCorrect = question.selectedAnswer === question.correctAnswer;
            return {
                ...question,
                isCorrect,
                isChecked: true,
            };
        });
        setQuestionsArray(updatedQuestionsArray);
        setAnswersChecked(true);
    }

    function returnHome(){
        setGameStarted(false);
        setQuestionsArray([]);
        setAnswersChecked(false);
    }

    const questionElements = questionsArray.map(item => (
        <div className='question-container' key={item.key}>
            <div className='question-container-contents'>
                <Question  question={item.question}/>
                <div className='answer-container'>
                    {item.answerArray.map((answer, index) => (
                        <Answer
                            key={index}
                            id={item.key}
                            isChecked={item.isChecked}
                            clickAnswer={clickAnswer}
                            selectedIndex={item.selectedIndex}
                            answer={answer}
                            correctAnswer={item.correctAnswer}
                            isSelected={item.selectedIndex === index}
                            isCorrect={item.correctAnswer === answer}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    ))

    return (
        <div className='game'>
            {gameStarted && questionsArray.length > 0 && (
                <div className='play-game'>
                    {questionElements}
                    <div className='button-container'>
                        {answersChecked ? <button onClick={returnHome}>Return to Home Screen</button> : <button onClick={checkAnswers}>Check Answers</button>}
                    </div>
                </div>
            )}

            {!gameStarted && !answersChecked && (
                <div className='start-game'>
                    <h1 className='game-title'>Trivia Game</h1>
                    <p className='game-description'>Test Your Knowledge and Luck</p>
                    <button onClick={startGame}>Start Game</button>
                </div>
            )}
        </div>
    );
}
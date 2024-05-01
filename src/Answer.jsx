import React from 'react'

export default function Answer(props){

    let answerClass = ''
    if (props.isChecked) {
        if (props.isCorrect) {
            answerClass = 'correct-answer';
        } else if (props.isSelected) {
            answerClass = 'incorrect-answer';
        } else {
            answerClass = 'unselected-answer';
        }
    } else if (props.isSelected && !props.isAnswered) {
        answerClass = 'selected-answer';
    }

    return (
        <div className='answer'>
            <p
                id={props.id}
                className={`answer-text ${answerClass}`}
                onClick={() => props.clickAnswer(props.id, props.index)}
                dangerouslySetInnerHTML={{ __html: props.answer }}
            />
        </div>
    )
}

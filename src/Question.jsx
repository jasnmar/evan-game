import React from 'react';

export default function Question(props) {
    return <h1 className='question-text' dangerouslySetInnerHTML={{ __html: props.question }} />
}

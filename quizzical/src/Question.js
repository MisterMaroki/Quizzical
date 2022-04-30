import React, { useEffect, useRef, useState } from 'react';

import { Button, ButtonGroup } from '@mui/material';

var he = require('he');
const Question = ({ question, isEvaluated }) => {
	const [selectedAnswer, setSelectedAnswer] = useState([]);
	//in order to avoid shuffling every time this is re-rendered we will shuffle only once when we initialise state for each question
	const [answers, setAnswers] = useState([
		question.correct_answer,
		...question.incorrect_answers,
	]);
	const answerBtn = useRef(null);
	const handleAnswer = (answer) => {
		if (!isEvaluated) {
			setSelectedAnswer(he.decode(answer));
		}
	};

	useEffect(() => {
		//an array containing the correct answer, then all others
		setAnswers(() => {
			var x = [question.correct_answer, ...question.incorrect_answers];

			let random = Math.floor(Math.random() * 3);
			for (let i = 0; i < random; i++) {
				x.push(x.shift());
			}
			return x;
		});
	}, [question.correct_answer, question.incorrect_answers]);

	const answerElements = answers?.map((answer) => (
		<Button
			disabled={
				isEvaluated &&
				!document.getElementById(answer).classList.contains('selected')
			}
			variant="outlined"
			key={answer}
			id={answer}
			ref={answerBtn}
			className={`answer ${
				isEvaluated &&
				(selectedAnswer === answer
					? answer === question.correct_answer
						? 'correct selected'
						: 'incorrect selected'
					: answer === question.correct_answer
					? 'correct'
					: '')
			} ${selectedAnswer === answer ? 'selected' : ''}`}
			onClick={() => handleAnswer(answer)}
		>
			{he.decode(answer)}
		</Button>
	));

	return (
		<div className="question" key={question.id}>
			<h3 key={question.question}>{he.decode(question.question)}</h3>
			<ButtonGroup key={question.toString()} className="answers">
				{answerElements}
			</ButtonGroup>
		</div>
	);
};

export default Question;
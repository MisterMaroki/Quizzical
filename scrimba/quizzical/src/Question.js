import React, { useEffect, useState } from 'react';
var he = require('he');

const Question = ({
	data,
	isEvaluated,
	allAnswers,
	correctAnswersTally,
	setCorrectAnswersTally,
}) => {
	const [isAnswered, setIsAnswered] = useState(false);
	const [selectedAnswer, setSelectedAnswer] = useState([]);

	//in order to avoid shuffling every time this is re-rendered we will shuffle only once when we initialise state for each question
	const [answers, setAnswers] = useState(() => {
		let randomIndex = Math.floor(Math.random() * allAnswers.length);
		for (let i = 0; i < randomIndex; i++) {
			allAnswers.push(allAnswers.shift());
		}
		return allAnswers;
	});

	const handleAnswer = (answer) => {
		if (!isEvaluated) {
			setIsAnswered(true);
			setSelectedAnswer(answer);
		} else {
			answer.correct &&
				answer.answer !== selectedAnswer &&
				setCorrectAnswersTally(() => correctAnswersTally + 1);
		}
	};

	const answerElements = answers?.map((answer) => (
		<button
			key={answer.answer}
			className={`answer ${
				isEvaluated &&
				(selectedAnswer.answer === answer.answer
					? answer.correct
						? 'correct selected'
						: 'selected wrong'
					: answer.correct
					? 'correct'
					: '')
			} ${selectedAnswer.answer === answer.answer ? 'selected' : ''}`}
			onClick={() => handleAnswer(answer)}
		>
			{he.decode(answer.answer)}
		</button>
	));

	return (
		<div className="question">
			<h3 key={data.question}>{he.decode(data.question)}</h3>
			<div className="answers">{answerElements}</div>
		</div>
	);
};

export default Question;

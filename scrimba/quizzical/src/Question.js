import React, { useEffect, useState } from 'react';
var he = require('he');
// 0:
// category: "Entertainment: Video Games"
// correct_answer: "30"
// difficulty: "medium"
// incorrect_answers: (3) ['5', '60', '15']
// question: "By how many minutes are you late to work in &quot;Half-Life&quot;?"
// type: "multiple"

const Question = (props) => {
	const { correct_answer, question } = props.data;

	const [isAnswered, setIsAnswered] = useState(false);
	const [selectedAnswer, setSelectedAnswer] = useState([]);

	//in order to avoid shuffling every time this is re-rendered we will shuffle only once when we initialise state for each question
	const [answers, setAnswers] = useState(() => {
		let randomIndex = Math.floor(Math.random() * props.allAnswers.length);
		for (let i = 0; i < randomIndex; i++) {
			props.allAnswers.push(props.allAnswers.shift());
		}
		return props.allAnswers;
	});

	const handleAnswer = (answer) => {
		if (!props.isEvaluated) {
			setIsAnswered(true);
			setSelectedAnswer(answer);

			answer.correct &&
				answer.answer !== selectedAnswer &&
				props.setCorrectAnswersTally(() => props.correctAnswersTally + 1);
		}
	};

	const answerElements = answers?.map((answer) => (
		<button
			key={answer.answer}
			className={`answer ${
				props.isEvaluated &&
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
			<h3 key={question}>{he.decode(question)}</h3>
			<div className="answers">{answerElements}</div>
		</div>
	);
};

export default Question;

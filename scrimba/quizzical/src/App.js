import { useState } from 'react';
import './App.css';
import Question from './Question';

// 0:
// category: "Entertainment: Video Games"
// correct_answer: "30"
// difficulty: "medium"
// incorrect_answers: (3) ['5', '60', '15']
// question: "By how many minutes are you late to work in &quot;Half-Life&quot;?"
// type: "multiple"

function App() {
	const [started, setStarted] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [isEvaluated, setIsEvaluated] = useState(false);
	const [correctAnswersTally, setCorrectAnswersTally] = useState(0);

	const getNewQuestions = async () => {
		const res = await fetch('https://opentdb.com/api.php?amount=5');
		const data = await res.json();

		setQuestions(data.results);
	};

	const startGame = async () => {
		if (!started) {
			await getNewQuestions();
			setStarted(true);
		}
	};

	const checkAnswers = () => {
		setIsEvaluated(true);
	};

	//map over questions in state to generate a Question for each
	const questionElements = questions.map((question) => (
		<Question
			//all question data
			data={question}
			//whether they have been submitted
			isEvaluated={isEvaluated}
			//an array containing the correct answer, then all others
			allAnswers={[question.correct_answer, ...question.incorrect_answers].map(
				(answer) =>
					answer === question.correct_answer
						? { answer: answer, correct: true }
						: { answer: answer, correct: false }
			)}
			//need to be able
			correctAnswersTally={correctAnswersTally}
			setCorrectAnswersTally={setCorrectAnswersTally}
		/>
	));

	return (
		<div className="App">
			{!started && (
				<div className="app__flex start-screen">
					<h2 className="quiz-start-header">Quizzical</h2>
					<p>Play as fast as you can to beat the others!</p>
					<button onClick={startGame}>Start quiz</button>
				</div>
			)}
			{started && (
				<div className="questions">
					{questionElements}
					<button onClick={checkAnswers}>Check Answers</button>
					{isEvaluated && <p>{correctAnswersTally}</p>}
				</div>
			)}
		</div>
	);
}

export default App;

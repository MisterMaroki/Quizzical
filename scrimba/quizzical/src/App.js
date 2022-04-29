import { useEffect, useState } from 'react';
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
	const [currentPage, setCurrentPage] = useState(1);

	const [isRestarted, setIsRestarted] = useState(false);
	const getNewQuestions = async () => {
		const res = await fetch(`https://opentdb.com/api.php?amount=20`);
		const data = await res.json();
		setQuestions(() => data.results);
	};

	const startGame = async () => {
		setIsEvaluated(false);
		getNewQuestions();
		setStarted(true);
		setIsRestarted(false);
	};
	useEffect(() => {
		countSelected();
	}, [isEvaluated]);

	const countSelected = () => {
		const howManySelected =
			document.querySelectorAll('.selected.correct').length;
		setCorrectAnswersTally(howManySelected);
	};

	const submitAnswers = () => {
		setIsEvaluated(true);
	};

	const restart = () => {
		setIsEvaluated(false);
		setIsRestarted(true);
		setCorrectAnswersTally(0);

		startGame();
	};

	useEffect(() => {
		if (isRestarted) {
			setCurrentPage(1);
			setIsRestarted(false);
		}
	}, [isRestarted]);

	//map over questions in state to generate a Question for each
	const questionElements = questions
		?.slice(currentPage * 5 - 5, currentPage * 5)
		.map((question) => (
			<Question
				//all question data
				question={question}
				//whether they have been submitted
				isEvaluated={isEvaluated}
				isRestarted={isRestarted}
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
					<div className="bottom">
						<button onClick={isEvaluated ? restart : submitAnswers}>
							{isEvaluated ? 'Play Again' : 'Check Answers'}
						</button>
						{isEvaluated && (
							<p>{`You answered ${correctAnswersTally}/5 correct!`}</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;

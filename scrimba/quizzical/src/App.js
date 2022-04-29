import Select from 'react-select';
import { Button, ButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import { Rings } from 'react-loader-spinner';
import Confetti from 'react-confetti';

import './App.css';
import Question from './Question';

function App() {
	const [started, setStarted] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [isEvaluated, setIsEvaluated] = useState(false);
	const [correctAnswersTally, setCorrectAnswersTally] = useState(0);
	const [inOptions, setInOptions] = useState(false);
	const [difficulty, setDifficulty] = useState('easy');
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(9);
	const [selectedType, setSelectedType] = useState('multiple');
	const [isLoading, setIsLoading] = useState(false);

	const getNewQuestions = async () => {
		const res = await fetch(
			`https://opentdb.com/api.php?amount=20&difficulty=${difficulty}&type=${selectedType}&category=${selectedCategory}`
		);
		const data = await res.json();
		setQuestions(() => data.results);
		setIsLoading(false);
	};
	const getCategories = async () => {
		const res = await fetch('https://opentdb.com/api_category.php');
		const data = await res.json();
		setCategories(data.trivia_categories);
	};

	const startGame = async () => {
		setIsLoading(true);
		setInOptions(false);
		setIsEvaluated(false);
		getNewQuestions();
		setStarted(true);
	};
	useEffect(() => {
		getCategories();
	}, []);
	useEffect(() => {
		countSelected();
	}, [isEvaluated]);

	const goToOptions = () => {
		setStarted(false);
		setInOptions(true);
	};

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
		setCorrectAnswersTally(0);

		startGame();
	};

	const handleDifficulty = (e) => {
		setDifficulty(e.target.value);
	};
	const handleCategory = (e) => {
		setSelectedCategory(e.value);
	};
	const handleType = (e) => {
		setSelectedType(e.target.value);
	};

	//map over questions in state to generate a Question for each
	const questionElements = questions?.slice(0, 5).map((question) => (
		<Question
			//all question data
			question={question}
			//whether they have been submitted
			isEvaluated={isEvaluated}
		/>
	));

	const options = categories.map((cat) =>
		cat.name ? { value: cat.id, label: cat.name } : {}
	);

	return (
		<div className="App questions">
			{isLoading && <Rings color="#e2d784" height={80} width={80} />}
			{!started && !inOptions && !isLoading && (
				<div className="app__flex start-screen">
					<Rings color="#e2d784" height={80} width={80} />
					<h2 className="quiz-start-header">Quizzical</h2>
					<p>Play as fast as you can to beat the others!</p>
					<button onClick={() => setInOptions(true)}>Start quiz</button>
				</div>
			)}
			{!started && inOptions && !isLoading && (
				<div className="app__flex start-screen">
					<div className="question">
						<h3>Choose your difficulty</h3>
						<ButtonGroup className="answers">
							<Button
								className={difficulty === 'easy' ? 'selected answer' : 'answer'}
								variant="outlined"
								value="easy"
								onClick={(e) => {
									handleDifficulty(e);
								}}
							>
								Easy
							</Button>
							<Button
								className={
									difficulty === 'medium' ? 'selected answer' : 'answer'
								}
								value="medium"
								variant="outlined"
								onClick={(e) => {
									handleDifficulty(e);
								}}
							>
								Medium
							</Button>
							<Button
								className={difficulty === 'hard' ? 'selected answer' : 'answer'}
								value="hard"
								variant="outlined"
								onClick={(e) => {
									handleDifficulty(e);
								}}
							>
								Hard
							</Button>
						</ButtonGroup>
					</div>
					<div className="question">
						<h3>Choose question type</h3>

						<ButtonGroup className="answers">
							<Button
								className={
									selectedType === 'multiple' ? 'selected answer' : 'answer'
								}
								variant="outlined"
								value="multiple"
								onClick={(e) => {
									handleType(e);
								}}
							>
								Multiple Choice
							</Button>
							<Button
								className={
									selectedType === 'boolean' ? 'selected answer' : 'answer'
								}
								variant="outlined"
								value="boolean"
								onClick={(e) => {
									handleType(e);
								}}
							>
								True/False
							</Button>
						</ButtonGroup>
					</div>
					<div className="question">
						<h3>Choose category(optional)</h3>

						<Select
							options={options}
							value={selectedCategory}
							onChange={handleCategory}
							style={{ maxHeight: 10 }}
						/>
					</div>
					<button onClick={() => startGame()}>Start quiz</button>
				</div>
			)}
			{started && !inOptions && !isLoading && (
				<div className="questions">
					{questionElements}
					<div className="bottom">
						<button onClick={isEvaluated ? restart : submitAnswers}>
							{isEvaluated ? 'Play Again' : 'Check Answers'}
						</button>
						<button onClick={goToOptions}>Settings</button>
						{isEvaluated && (
							<p>{`You answered ${correctAnswersTally}/5 correct!`}</p>
						)}
						{isEvaluated && correctAnswersTally >= 4 && <Confetti />}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;

import Select from 'react-select';
import { Button, ButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import { Rings } from 'react-loader-spinner';
import Confetti from 'react-confetti';
import SettingsIcon from '@mui/icons-material/Settings';
import styled from 'styled-components';

import './App.css';
import Question from './Question';
import { Dropdown, DropdownButton } from 'react-bootstrap';

function App() {
	const [started, setStarted] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [isEvaluated, setIsEvaluated] = useState(false);
	const [correctAnswersTally, setCorrectAnswersTally] = useState(0);
	const [inOptions, setInOptions] = useState(false);
	const [difficulty, setDifficulty] = useState('easy');
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState({ id: 9 });
	const [selectedType, setSelectedType] = useState('multiple');
	const [isLoading, setIsLoading] = useState(false);
	const [dropDownOpen, setDropDownOpen] = useState(false);

	const getNewQuestions = async () => {
		const res = await fetch(
			`https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=${selectedType}&category=${selectedCategory.id}`
		);
		const data = await res.json();
		if (data.results.length !== 0) {
			setQuestions(() => data.results);
			setIsLoading(false);
		} else {
			const response = await fetch(
				`https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&category=${selectedCategory.id}`
			);
			const data = await response.json();
			if (data.results.length !== 0) {
				setQuestions(() => data.results);
				setIsLoading(false);
			} else {
				const response = await fetch(
					`https://opentdb.com/api.php?amount=5&category=${selectedCategory.id}`
				);
				const data = await response.json();
				setQuestions(() => data.results);
				setIsLoading(false);
			}
		}
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
		setSelectedCategory({ id: e.target.id, name: e.target.name });
	};
	const handleType = (e) => {
		setSelectedType(e.target.value);
	};

	//map over questions in state to generate a Question for each
	const questionElements = questions?.map((question) => (
		<Question
			//all question data
			question={question}
			//whether they have been submitted
			isEvaluated={isEvaluated}
		/>
	));

	const dropItems = categories.map((cat) => (
		<Dropdown.Item
			value={cat.id}
			name={cat.name}
			id={cat.id}
			key={cat.id}
			onClick={(e) => handleCategory(e)}
		>
			{cat.name}
		</Dropdown.Item>
	));

	return (
		<div className="App questions">
			{isLoading && <Rings color="#e2d784" height={80} width={80} />}
			{!started && !inOptions && !isLoading && (
				<div className="start-screen">
					<Rings color="#e2d784" height={80} width={80} />
					<h2 className="quiz-start-header">Quizzical</h2>
					<p>Play as fast as you can to beat the others!</p>
					<button onClick={() => setInOptions(true)}>Start quiz</button>
				</div>
			)}
			{!started && inOptions && !isLoading && (
				<div className="start-screen">
					<div className="question">
						<h3>Choose your difficulty</h3>
						<ButtonGroup className="answers">
							{['Easy', 'Medium', 'Hard'].map((a) => (
								<Button
									className={difficulty === a ? 'selected answer' : 'answer'}
									variant="outlined"
									value={a}
									onClick={(e) => {
										handleDifficulty(e);
									}}
								>
									{a}
								</Button>
							))}
						</ButtonGroup>
					</div>
					<div className="question">
						<h3>Choose question type</h3>

						<ButtonGroup className="answers">
							{[
								{ type: 'multiple', nice: 'Mutliple Choice' },
								{ type: 'boolean', nice: 'True / False' },
							].map((type) => (
								<Button
									className={
										selectedType === type.type ? 'selected answer' : 'answer'
									}
									variant="outlined"
									value={type.type}
									onClick={(e) => {
										handleType(e);
									}}
								>
									{type.nice}
								</Button>
							))}
						</ButtonGroup>
					</div>
					<div className="question">
						<h3>Choose category(optional)</h3>

						<div className="app__flex">
							<DropdownButton
								id="dropdown-categories"
								className="bottomBtn"
								title="Categories"
								onClick={() => setDropDownOpen(!dropDownOpen)}
							>
								{dropItems}
							</DropdownButton>
							{selectedCategory.name && (
								<p>Current category: {selectedCategory.name}</p>
							)}
						</div>
					</div>
					<button onClick={() => startGame()}>Start quiz</button>
				</div>
			)}
			{started && !inOptions && !isLoading && (
				<div className="questions">
					{questionElements}
					<div className="bottom">
						<Button
							key="start"
							className="bottomBtn"
							onClick={isEvaluated ? restart : submitAnswers}
						>
							{isEvaluated ? 'Play Again' : 'Check Answers'}
						</Button>
						<Button key="finish" className="bottomBtn" onClick={goToOptions}>
							<SettingsIcon />
						</Button>
						{isEvaluated && (
							<p>{`You answered ${correctAnswersTally}/5 correct!`}</p>
						)}
						{isEvaluated && correctAnswersTally >= 0 && <Confetti recycle />}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;

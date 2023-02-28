const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');
const submitBtn = document.querySelector('#submitBtn')

let currentQuestion = {}
let acceptingAnswers = true
export let score = 0
let questionCounter = 0
let availableQuestions = []

let questions = [
    {
        question: 'Which of the following statements is used to create an empty set in Python?',
        choice1: '( )',
        choice2: '[ ] ',
        choice3: '{ }',
        choice4: 'set()',
        answer: 4,
    },
    {
        question: 'What arithmetic operators cannot be used with strings in Python?',
        choice1: '*',
        choice2: '-',
        choice3: '+',
        choice4: 'All of the mentioned',
        answer: 2,
    },
    {
        question: 'Which of the following is not a core data type in Python programming?',
        choice1: 'Tuples',
        choice2: 'Lists',
        choice3: 'Class',
        choice4: 'Dictionary',
        answer: 3,
    },
    {
        question: 'What is the order of precedence in python?',
        choice1: 'Exponential, Parentheses, Multiplication, Division, Addition, Subtraction',
        choice2: 'Exponential, Parentheses, Division, Multiplication, Addition, Subtraction',
        choice3: 'Parentheses, Exponential, Multiplication, Division, Subtraction, Addition',
        choice4: 'Parentheses, Exponential, Multiplication, Division, Addition, Subtraction',
        answer: 4,
    },
    {
        question: 'Which module in the python standard library parses options received from the command line?',
        choice1: 'getarg',
        choice2: 'getopt',
        choice3: 'main',
        choice4: 'os',
        answer: 2,
    },
    {
        question: 'Which of the following is not javascript data types?',
        choice1: 'Null type',
        choice2: 'Undefined type',
        choice3: 'Number type',
        choice4: 'All of the mentioned',
        answer: 4,
    },
    {
        question: 'Where is Client-side JavaScript code is embedded within HTML documents?',
        choice1: 'A URL that uses the special javascript:code',
        choice2: 'A URL that uses the special javascript:protocol',
        choice3: 'A URL that uses the special javascript:encoding',
        choice4: 'A URL that uses the special javascript:stack',
        answer: 2,
    },
    {
        question: 'Which of the following object is the main entry point to all client-side JavaScript features and APIs?',
        choice1: 'Position',
        choice2: 'Window',
        choice3: 'Standard',
        choice4: 'Location',
        answer: 2,
    },
    {
        question: 'Which of the following scoping type does JavaScript use?',
        choice1: 'Sequential',
        choice2: 'Segmental',
        choice3: 'Lexical',
        choice4: 'Literal',
        answer: 3,
    },
    {
        question: 'Why event handlers is needed in JS?',
        choice1: 'Allows JavaScript code to alter the behaviour of windows',
        choice2: 'Adds innerHTML page to the code',
        choice3: 'Change the server location',
        choice4: 'Performs handling of exceptions and occurrences',
        answer: 1,
    },
    {
        question: 'How to define a function in PHP?',
        choice1: 'functionName(parameters) {function body}',
        choice2: 'function {function body}',
        choice3: 'function functionName(parameters) {function body}',
        choice4: 'data type functionName(parameters) {function body}',
        answer: 3,
    },
    {
        question: 'Which of the following web servers are required to run the PHP script?',
        choice1: 'Apache and PHP',
        choice2: 'IIS',
        choice3: 'XAMPP',
        choice4: 'Any of the mentioned',
        answer: 2,
    },
    {
        question: 'Which of the looping statements is/are supported by PHP?',
        choice1: 'for loop, while loop, foreach loop',
        choice2: 'while loop, do-while loop',
        choice3: 'do-while loop, for loop, foreach loop',
        choice4: 'all are supported',
        answer: 4,
    },
    {
        question: 'If $a = 12 what will be returned when ($a == 12) ? 5 : 1 is executed?',
        choice1: '1',
        choice2: '5',
        choice3: '12',
        choice4: 'Error',
        answer: 2,
    },
    {
        question: 'The developers of PHP deprecated the safe mode feature as of which PHP version?',
        choice1: 'PHP 5.3.1',
        choice2: 'PHP 5.3.0',
        choice3: 'PHP 5.1.0',
        choice4: 'PHP 5.2.0',
        answer: 2,
    },
]

const SCORE_POINTS = 1
const MAX_QUESTIONS = 3

const startGame = () => {
    availableQuestions = [...questions]
    getNewQuestion()
}

const getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)
        return 
    }

    questionCounter++
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`
    
    const questionsIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionsIndex]
    question.innerText = currentQuestion.question

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
    })

    availableQuestions.splice(questionsIndex, 1)

    acceptingAnswers = true
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return

        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if(classToApply === 'correct') {
            incrementScore(SCORE_POINTS)
        }

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()

        }, 1000)
    })
})

const incrementScore = num => {
    score +=num
    scoreText.innerText = score
}

startGame()
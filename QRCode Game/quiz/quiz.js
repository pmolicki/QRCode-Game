const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');

let currentQuestion = {}
let acceptingAnswers = true
score = 0
let questionCounter = 0
let availableQuestions = []

let questions = [
    {
        question: 'How do you supply data to an already running Generator?',
        choice1: 'By calling the Generator’s reset method, supplying the data & starting the data flow again.',
        choice2: 'By passing the data as a parameter to the Generator’s next method call.',
        choice3: 'By calling the Generator’s update method with the data.',
        choice4: 'There is no way to supply data to a running Generator.',
        answer: 2,
    },
    {
        question: 'How can you create a custom iterable object?',
        choice1: 'You need to implement the Symbol.iterator yourself on the respective object and assign a generator function.',
        choice2: 'All objects are iterable by default, so you can use the for.. of loop.',
        choice3: 'You cannot create custom iterable objects, only built-in objects like Array, Set, and Map are iterable.',
        choice4: 'You inherit the prototype of a built in.',
        answer: 1,
    },
    {
        question: 'If a component is in the ../myComps/ folder instead of being in the ../components/ folder, can it be used? ',
        choice1: 'No, a "Component not found" error will be thrown.',
        choice2: 'Yes, the name of the folder does not matter.',
        choice3: 'No, a "myComps is an invalid directory" error will be thrown.',
        choice4: 'No, a "Component needs to be in the components directory" error will be thrown.',
        answer: 3,
    },
]

const SCORE_POINTS = 1
const MAX_QUESTIONS = 3

startGame = () => {
    questionCounter = 0
    score = 0
    availableQuestions = [...questions]
    getNewQuestion()
}

getNewQuestion = () => {
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

incrementScore = num => {
    score +=num
    scoreText.innerText = score
}

startGame()
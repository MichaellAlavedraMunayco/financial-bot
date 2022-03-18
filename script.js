const transactionsUl = document.querySelector(".transactions");
const incomeDisplay = document.querySelector("#more-money");
const expenseDisplay = document.querySelector("#less-money");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const addTransactionIntoDom = ({ amount, name, id }) => {
	// If amount < 0 operator = -, if amount > 0 operator = +
	const operator = amount < 0 ? '-' : '+';
	const CSSClass = amount < 0 ? 'minus' : 'plus';
	const amountWithoutOperator = Math.abs(amount);
	const li = document.createElement('li');

	li.classList.add(CSSClass);
	li.innerHTML = `<span onClick="removeTransaction(${id})">${name}</span> <span>${operator} S/ ${amountWithoutOperator}</span>`;

	transactionsUl.append(li)
}

// Catch the information saved in localStorage
const localStorageTransaction = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransaction : [];

const removeTransaction = ID => {
	// Remove the clicked ID

	if (confirm(`Eliminar la transacción ${ID}?`)) {
		transactions = transactions.filter(transaction => transaction.id !== ID);
		updateLocalStorage();
		init();
	}
}

const getExpenses = transactionsAmounts =>
	// Value < 0 = negative income
	Math.abs(transactionsAmounts
		.filter(value => value < 0)
		.reduce((accumulator, value) => accumulator + value, 0))
		.toFixed(2);

const getIncome = transactionsAmounts =>
	// Value > 0 = positive income
	transactionsAmounts
		.filter(value => value > 0)
		.reduce((accumulator, value) => accumulator + value, 0)
		.toFixed(2);

const getTotal = transactionsAmounts =>
	transactionsAmounts
		.reduce((accumulator, transaction) => accumulator + transaction, 0)
		.toFixed(2);

const updateBalanceValues = () => {
	const transactionsAmounts = transactions.map(({ amount }) => amount);

	const total = getTotal(transactionsAmounts);
	const income = getIncome(transactionsAmounts);
	const expense = getExpenses(transactionsAmounts);

	// Display
	balanceDisplay.textContent = `S/ ${total}`;
	incomeDisplay.textContent = `S/ ${income}`;
	expenseDisplay.textContent = `S/ ${expense}`;
}

const init = () => {
	transactionsUl.innerHTML = '';
	transactions.forEach(addTransactionIntoDom);
	updateBalanceValues();
}

// Generate a random id between 0 and 1000.
const generateID = () => Math.round(Math.random() * 1000);

const cleanInputs = () => {
	inputTransactionName.value = "";
	inputTransactionAmount.value = "";
};

const addToTransactionsArray = (transactionName, transactionAmount) => {
	// Make the transaction and make the amount be a number
	transactions.push({
		id: generateID(),
		name: transactionName,
		amount: Number(transactionAmount)
	});
}

const handleFormSubmit = event => {
	event.preventDefault();

	const transactionName = inputTransactionName.value.trim();
	const transactionAmount = inputTransactionAmount.value.trim();
	// Check if the name or the amount have a value
	const isSomeInputEmpty = transactionName === "" || transactionAmount === "";


	if (isSomeInputEmpty) {
		alert("Debe ingresar el concepto y el valor");
		return;
	};

	addToTransactionsArray(transactionName, transactionAmount);
	init();
	updateLocalStorage();
	cleanInputs();
};

form.addEventListener('submit', handleFormSubmit);

// Save the information in localStorage
const updateLocalStorage = () => {
	localStorage.setItem('transactions', JSON.stringify(transactions));
};

init();
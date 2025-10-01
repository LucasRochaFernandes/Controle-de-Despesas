// --- Seleção de Elementos do DOM ---
const totalDisplay = document.getElementById("total-display");
const transactionList = document.getElementById("transaction-list");
const form = document.getElementById("form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");

// --- Lógica de Dados ---

// Carrega as transações do Local Storage ou inicia um array vazio
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// --- Funções ---

// Função para salvar as transações no Local Storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Função para gerar um ID aleatório
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Função para adicionar uma transação na lista do DOM
function addTransactionDOM(transaction) {
  // Cria o item da lista (li)
  const item = document.createElement("li");

  // Define o conteúdo HTML do item, incluindo a descrição, valor e botão de deletar
  item.innerHTML = `
        ${transaction.description} 
        <span>R$ ${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${
          transaction.id
        })">x</button>
    `;

  // Adiciona o novo item à lista no HTML
  transactionList.appendChild(item);
}

// Função para atualizar o valor total das despesas
function updateTotal() {
  // Cria um array apenas com os valores das transações
  const amounts = transactions.map((transaction) => transaction.amount);

  // Soma todos os valores do array e formata para duas casas decimais
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  // Atualiza o texto do elemento no DOM
  totalDisplay.textContent = `R$ ${total}`;
}

// Função para remover uma transação pelo ID
function removeTransaction(id) {
  // Filtra o array, mantendo apenas as transações com ID diferente do que foi passado
  transactions = transactions.filter((transaction) => transaction.id !== id);

  // Atualiza o Local Storage com o novo array
  updateLocalStorage();

  // Reinicia a aplicação para refletir a mudança na tela
  init();
}

// Função principal que adiciona a transação
function addTransaction(event) {
  event.preventDefault(); // Impede que o formulário seja enviado e a página recarregue

  // Validação simples dos campos
  if (descriptionInput.value.trim() === "" || amountInput.value.trim() === "") {
    alert("Por favor, preencha a descrição e o valor.");
    return;
  }

  // Cria o objeto da nova transação
  const transaction = {
    id: generateID(),
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value), // Converte o valor para número
  };

  // Adiciona a nova transação ao array 'transactions'
  transactions.push(transaction);

  // Adiciona a nova transação na tela
  addTransactionDOM(transaction);

  // Atualiza o valor total
  updateTotal();

  // Salva no Local Storage
  updateLocalStorage();

  // Limpa os campos do formulário
  descriptionInput.value = "";
  amountInput.value = "";
  descriptionInput.focus(); // Coloca o foco de volta no campo de descrição
}

// Função de inicialização
function init() {
  transactionList.innerHTML = ""; // Limpa a lista na tela antes de carregar
  transactions.forEach(addTransactionDOM); // Adiciona cada transação do array ao DOM
  updateTotal(); // Calcula o total inicial
}

// --- Event Listeners ---
form.addEventListener("submit", addTransaction);

// Inicia a aplicação
init();

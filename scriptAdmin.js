window.onload = function () {
  fetch("/api/transactions?limit=5") // Busca apenas as últimas 5 transações (altere conforme necessário)
    .then((response) => response.json())
    .then((transactions) => {
      const lastTransactionsList = document.getElementById("lastTransactions");
      lastTransactionsList.innerHTML = "";

      transactions.forEach((transaction) => {
        const { days, hours } = calculateTimeToPay(transaction.date);
        const transactionItem = document.createElement("li");
        transactionItem.textContent = `Faltam ${days} dias e ${hours} horas para pagar ${
          transaction.description
        } com valor de R$ ${transaction.value.toFixed(2)}.`;
        lastTransactionsList.appendChild(transactionItem);
      });

      // Abrir o modal automaticamente após carregar as transações
      openTransactionModal();
    })
    .catch((error) => console.error("Erro:", error));
};

// Função para calcular os dias e horas restantes para pagar uma transação
function calculateTimeToPay(transactionDate) {
  const currentDate = new Date(); // Isso cria um objeto de data e hora local
  const transactionDateObj = new Date(transactionDate); // Isso cria um objeto de data e hora a partir da data da transação
  // Converter para o fuso horário de Brasília (UTC-03:00)
  currentDate.setUTCHours(currentDate.getUTCHours() - 3);
  // Calcular a diferença em horas
  const differenceInTime = transactionDateObj.getTime() - currentDate.getTime();
  const differenceInHours = Math.floor(differenceInTime / (1000 * 3600)); // Diferença em horas
  const days = Math.floor(differenceInHours / 24);
  const hours = differenceInHours % 24;
  return { days, hours };
}

function openTransactionModal() {
  const modal = document.getElementById("transactionModal");
  modal.style.display = "block";
}

function closeTransactionModal() {
  const modal = document.getElementById("transactionModal");
  modal.style.display = "none";
}

function submitTransaction() {
  const description = document.getElementById("description").value;
  const value = parseFloat(document.getElementById("value").value);
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;

  if (!isValidDateFormat(date)) {
    alert("Por favor, insira uma data no formato DD/MM/YYYY.");
    return;
  }

  if (!description || isNaN(value) || !type) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const transaction = { description, value, type, date: formatDate(date) };

  fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Erro ao adicionar transação");
    })
    .then((data) => {
      if (data.success) {
        updateTransactionTable();
        updateTotals();
      } else {
        alert("Erro ao adicionar transação. Por favor, tente novamente.");
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Erro ao adicionar transação. Por favor, tente novamente.");
    });
}

function isValidDateFormat(dateString) {
  const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
  return pattern.test(dateString);
}

function updateTransactionTable() {
  fetch("/api/transactions")
    .then((response) => response.json())
    .then((transactions) => {
      const tableBody = document.getElementById("transactionBody");
      tableBody.innerHTML = "";

      transactions.forEach((transaction) => {
        const newRow = document.createElement("tr");

        // Campo: Descrição
        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = transaction.description;

        // Campo: Valor
        const valueCell = document.createElement("td");
        valueCell.textContent = transaction.value.toFixed(2);

        // Campo: Data
        const dateCell = document.createElement("td");
        dateCell.textContent = formatDate(transaction.date); // Supondo que formatDate está definido corretamente

        // Campo: Tipo
        const typeCell = document.createElement("td");
        typeCell.textContent =
          transaction.type === "entry" ? "Entrada" : "Saída";

        // Botões: Editar, Salvar, Excluir
        const actionCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.addEventListener("click", () => {
          // Torna os campos editáveis
          descriptionInput.disabled = false;
          valueInput.disabled = false;
          dateInput.disabled = false;
          typeSelect.disabled = false;

          // Substitui o botão "Editar" por um botão "Salvar"
          editButton.style.display = "none";
          saveButton.style.display = "inline-block";
        });

        const saveButton = document.createElement("button");
        saveButton.textContent = "Salvar";
        saveButton.style.display = "none";
        saveButton.addEventListener("click", () => {
          const updatedTransaction = {
            description: descriptionInput.value,
            value: parseFloat(valueInput.value),
            type: typeSelect.value,
            date: formatDate(dateInput.value),
          };

          updateTransactionHandler(transaction._id, updatedTransaction);

          // Torna os campos não editáveis novamente
          descriptionInput.disabled = true;
          valueInput.disabled = true;
          dateInput.disabled = true;
          typeSelect.disabled = true;

          // Substitui o botão "Salvar" por um botão "Editar"
          saveButton.style.display = "none";
          editButton.style.display = "inline-block";
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", async () => {
        deleteTransactionHandler(transaction._id);
});

        // Campos de entrada editáveis
        const descriptionInput = document.createElement("input");
        descriptionInput.type = "text";
        descriptionInput.value = transaction.description;
        descriptionInput.disabled = true; // Começa desabilitado até clicar em Editar
        descriptionCell.appendChild(descriptionInput);

        const valueInput = document.createElement("input");
        valueInput.type = "number";
        valueInput.step = "0.01";
        valueInput.value = transaction.value.toFixed(2);
        valueInput.disabled = true; // Começa desabilitado até clicar em Editar
        valueCell.appendChild(valueInput);

        const dateInput = document.createElement("input");
        dateInput.type = "text";
        dateInput.value = formatDate(transaction.date); // Supondo que formatDate está definido corretamente
        dateInput.disabled = true; // Começa desabilitado até clicar em Editar
        dateCell.appendChild(dateInput);

        const typeSelect = document.createElement("select");
        typeSelect.disabled = true; // Começa desabilitado até clicar em Editar
        const entryOption = document.createElement("option");
        entryOption.value = "entry";
        entryOption.textContent = "Entrada";
        const exitOption = document.createElement("option");
        exitOption.value = "exit";
        exitOption.textContent = "Saída";
        typeSelect.appendChild(entryOption);
        typeSelect.appendChild(exitOption);
        typeSelect.value = transaction.type;
        typeCell.appendChild(typeSelect);

        actionCell.appendChild(editButton);
        actionCell.appendChild(saveButton);
        actionCell.appendChild(deleteButton);

        // Adiciona as células à nova linha
        newRow.appendChild(descriptionCell);
        newRow.appendChild(valueCell);
        newRow.appendChild(dateCell);
        newRow.appendChild(typeCell);
        newRow.appendChild(actionCell);

        // Adiciona a linha à tabela
        tableBody.appendChild(newRow);
      });
    })
    .catch((error) => console.error("Erro:", error));
}

function updateTransactionHandler(transactionId, updatedTransaction) {
  // Implemente a lógica para enviar uma requisição PUT para atualizar a transação com ID transactionId
  // Exemplo de fetch:
  fetch(`/api/transactions/${transactionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTransaction),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao atualizar transação");
      }
      // Atualizar a tabela após o sucesso
      updateTransactionTable();
      updateTotals();
    })
    .catch((error) => console.error("Erro:", error));
}

function deleteTransactionHandler(transactionId) {
  // Implemente a lógica para enviar uma requisição DELETE para excluir a transação com ID transactionId
  // Exemplo de fetch:
  fetch(`/api/transactions/${transactionId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao excluir transação");
      }
      // Atualizar a tabela após o sucesso
      updateTransactionTable();
      updateTotals();
    })
    .catch((error) => console.error("Erro:", error));
}

function openModal() {
  const modal = document.getElementById("userModal");
  modal.style.display = "block";
  fetchUsers(); // Chamar a função para buscar os usuários quando o modal é aberto
}

function closeModal() {
  const modal = document.getElementById("userModal");
  modal.style.display = "none";
}
function fetchUsers() {
  fetch("/user/users")
    .then((response) => response.json())
    .then((users) => {
      const userList = document.getElementById("userList");
      userList.innerHTML = "";

      users.forEach((user) => {
        const listItem = document.createElement("li");

        // Username
        const usernameLabel = document.createElement("span");
        usernameLabel.textContent = `Username: ${user.username}`;
        listItem.appendChild(usernameLabel);

        // Nível do usuário
        const levelLabel = document.createElement("span");
        levelLabel.textContent = `Nível: ${user.level}`;
        listItem.appendChild(levelLabel);

        // Seleção para o novo nível (ON/OFF)
        const newLevelSelect = document.createElement("select");
        const onOption = document.createElement("option");
        onOption.value = "ON";
        onOption.textContent = "ON";
        const offOption = document.createElement("option");
        offOption.value = "OFF";
        offOption.textContent = "OFF";
        newLevelSelect.appendChild(onOption);
        newLevelSelect.appendChild(offOption);
        newLevelSelect.value = user.level;
        listItem.appendChild(newLevelSelect);

        // Botão para alterar o nível
        const changeLevelButton = document.createElement("button");
        changeLevelButton.textContent = "Alterar Nível";
        changeLevelButton.addEventListener("click", () => {
          updateUserLevel(user._id, newLevelSelect.value); // Aqui você usa user._id
        });
        listItem.appendChild(changeLevelButton);

        userList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Erro:", error));
}
function updateUserLevel(userId, newLevel) {
  fetch(`/user/update-level/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ level: newLevel }),
  })
    .then((response) => {
      if (response.ok) {
        // Se a atualização for bem-sucedida, recarregue a lista de usuários
        fetchUsers();
      } else {
        throw new Error("Erro ao atualizar nível do usuário");
      }
    })
    .catch((error) => console.error("Erro:", error));
}

function formatDate(dateString) {
  // Verificar se a data está no formato correto (DD/MM/YYYY)
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!datePattern.test(dateString)) {
    // Se a data não estiver no formato correto, retornar a data original
    return dateString;
  }

  // Se a data estiver no formato correto, realizar a formatação
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

function submitAccount() {
  const accountName = document.getElementById("accountName").value;
  const bank = document.getElementById("bank").value;
  const accountNumber = document.getElementById("accountNumber").value;
  const balanceInput = document.getElementById("balance").value;
  const balance = parseFloat(balanceInput.replace(/\./g, "").replace(",", ".")); // Formata o saldo para o formato correto

  if (!accountName || !bank || !accountNumber || isNaN(balance)) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const account = { accountName, bank, accountNumber, balance };

  fetch("/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Erro ao cadastrar conta");
    })
    .then((data) => {
      if (data.success) {
        document.getElementById("accountName").value = "";
        document.getElementById("bank").value = "";
        document.getElementById("accountNumber").value = "";
        document.getElementById("balance").value = "";
        updateAccountTable();
      } else {
        alert("Erro ao cadastrar conta. Por favor, tente novamente.");
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Erro ao cadastrar conta. Por favor, tente novamente.");
    });
}
function deleteAccountHandler(accountId) {
  fetch(`/accounts/${accountId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Erro ao excluir conta");
    })
    .then((data) => {
      if (data.success) {
        // Se a conta for excluída com sucesso, atualize a tabela de contas
        updateAccountTable();
      } else {
        // Se houver algum erro, exiba uma mensagem de erro
        alert("Erro ao excluir conta. Por favor, tente novamente.");
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Erro ao excluir conta. Por favor, tente novamente.");
    });
}

function updateAccountTable() {
  fetch("/accounts")
    .then((response) => response.json())
    .then((accounts) => {
      const tableBody = document.getElementById("accountBody");
      tableBody.innerHTML = ""; // Limpar o conteúdo atual da tabela

      accounts.forEach((account) => {
        const newRow = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = account.accountName;

        const bankCell = document.createElement("td");
        bankCell.textContent = account.bank;

        const numberCell = document.createElement("td");
        numberCell.textContent = account.accountNumber;

        const balanceCell = document.createElement("td");
        balanceCell.textContent = account.balance.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", () =>{
            if (confirm("Tem certeza que deseja excluir esta conta?")) {
                deleteAccountHandler(account._id);
              }
        }
        ); 
        deleteCell.appendChild(deleteButton);

        newRow.appendChild(nameCell);
        newRow.appendChild(bankCell);
        newRow.appendChild(numberCell);
        newRow.appendChild(balanceCell);
        newRow.appendChild(deleteCell);

        tableBody.appendChild(newRow);
      });
    })
    .catch((error) => console.error("Erro:", error));
}

function updateTotals() {
    fetch("/api/transactions")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar transações");
        }
        return response.json();
      })
      .then((transactions) => {
        let entryTotal = 0;
        let exitTotal = 0;
  
        transactions.forEach((transaction) => {
          if (transaction.type === "entry") {
            entryTotal += transaction.value;
          } else if (transaction.type === "exit") {
            exitTotal += transaction.value;
          }
        });
  
        const totalEntryElement = document.getElementById("entryTotal");
        totalEntryElement.textContent = entryTotal.toFixed(2);
  
        const totalExitElement = document.getElementById("exitTotal");
        totalExitElement.textContent = exitTotal.toFixed(2);
  
        const total = entryTotal - exitTotal;
        const totalElement = document.getElementById("total");
        totalElement.textContent = total.toFixed(2);
      })
      .catch((error) => {
        console.error("Erro ao atualizar totais:", error);
        // Limpar os valores se ocorrer um erro
        const totalEntryElement = document.getElementById("entryTotal");
        totalEntryElement.textContent = "0.00";
  
        const totalExitElement = document.getElementById("exitTotal");
        totalExitElement.textContent = "0.00";
  
        const totalElement = document.getElementById("total");
        totalElement.textContent = "0.00";
      });
  }
  

updateTransactionTable();
updateAccountTable();
updateTotals();

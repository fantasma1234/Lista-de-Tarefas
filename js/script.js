// Seleção de elementos
const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const searchInput = document.querySelector("#search-input")
const eraseBtn = document.querySelector("#erase-button")
const filterBtn = document.querySelector("#filter-select")

let oldInputValue //serve para guarda o valor antigo

//Funções
const saveTodo = (text, done = 0, save = 1) => { //função para salavr o todo

    const todo = document.createElement("div") //cria um elemento html, nesse caso uma div
    todo.classList.add("todo") //adiciona uma classe ao elemento criado, nesse caso a classe todo

    const todoTitle = document.createElement("h3") //cria um elemento html, nesse caso um h3
    todoTitle.innerText = text //muda o texto do elemento criado
    todo.appendChild(todoTitle) //faz com que o todoTitle, que nesse caso é o h3, fique dentro da div criada

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)

    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("remove-todo")
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)

    //Utilizando dados da localStorage
    if (done) {
        todo.classList.add("done")
    }

    if (save) {
        saveTodoLocalStorage({text, done: 0})
    }

    todoList.appendChild(todo)

    todoInput.value = "" //apaga o valor do input apos enviado
    todoInput.focus()//foca no input apos enviado
}

const toggleForms = () => {
    editForm.classList.toggle("hide") //mostra e esconde a parte de edição
    todoForm.classList.toggle("hide") //escode a parte de adicionar
    todoList.classList.toggle("hide") //escode as outras tarefas
}

const updateTodo = (text) => {

    const todos = document.querySelectorAll(".todo")//seleciona todos os todo

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3")

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text

            //Utilizando dados da localStorage
            updateTodoLocalStorage(oldInputValue, text)
        }
    })
}

const getSearchedTodos = (search) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) =>{
        const todoTitle = todo.querySelector("h3").innerText.toLowerCase()

        todo.style.display = "flex"

        console.log(todoTitle)

        if (!todoTitle.includes(search.toLowerCase())) {
            todo.style.display = "none"
        }
    })
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex"))
            break
        case "done":
            todos.forEach((todo) =>
            todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none"))
            break
        case "todo":
            todos.forEach((todo) =>
            !todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none"))
            break
        default:
            break
    }
}

// Eventos
todoForm.addEventListener("submit", (e) => { //addEventListener adiciona um evento

    e.preventDefault() //<-- previne que seja mandado uma tarefa vazia

    const inputValue = todoInput.value //estou atribuindo a variavel inputValue o valor de todoInput. Faço isso usando a propriedade value

    if (inputValue) {
        saveTodo(inputValue)
        //chamada da função
    }
})

document.addEventListener("click", (e) => {

    const targetEl = e.target
    const parentEl = targetEl.closest("div") //com isso eu seleciono o elemento pai mais próximo
    let todoTitle //vai armazenar o titulo da tarefa, como ele está sendo inicializado com let ele pode ser referenciado fora desse evento

    if (parentEl && parentEl.querySelector("h3")) { //todoTitle só vai ter o valor do titulo se parentEl existe e se ele tiver a tag h3
        todoTitle = parentEl.querySelector("h3").innerText || ""
    }
    
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done") //com o toggle ele faz a troca, ou seja, eu marca e desmarca

        updateTodoStatusLocalStorage(todoTitle)
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove()

        removeTodoLocalStorage(todoTitle)
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms()

        editInput.value = todoTitle
        oldInputValue = todoTitle
    }
})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault()

    toggleForms()
})

editForm.addEventListener("submit", (e) => {

    e.preventDefault()

    const editInputValue = editInput.value

    if (editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms()
})

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value

    getSearchedTodos(search)
})

eraseBtn.addEventListener("click", (e) => {
    
    e.preventDefault()

    searchInput.value = ""

    searchInput.dispatchEvent(new Event("keyup"))
})

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value
  
    filterTodos(filterValue)
  })

// Local Storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
  
    return todos;
  };
  
  const loadTodos = () => {
    const todos = getTodosLocalStorage();
  
    todos.forEach((todo) => {
      saveTodo(todo.text, todo.done, 0);
    });
  };
  
  const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
  
    todos.push(todo);
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    const filteredTodos = todos.filter((todo) => todo.text != todoText);
  
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  };
  
  const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoText ? (todo.done = !todo.done) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoOldText ? (todo.text = todoNewText) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  loadTodos();
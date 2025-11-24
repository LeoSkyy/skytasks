const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const taskPriority = document.getElementById('task-priority');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const clearBtn = document.getElementById('clear-completed');
const filterAll = document.getElementById('filter-all');
const filterPending = document.getElementById('filter-pending');
const filterCompleted = document.getElementById('filter-completed');

// Flatpickr
flatpickr("#task-date", { dateFormat: "d/m/Y", minDate: "today" });

// Carregar tarefas
document.addEventListener('DOMContentLoaded', loadTasks);

// Adicionar tarefa
addTaskBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  const date = taskDate.value;
  const priority = taskPriority.value;
  if(text) {
    addTask(text, date, priority);
    taskInput.value = '';
    taskDate.value = '';
    taskPriority.value = 'Baixa';
  }
});

// Enter adiciona tarefa
taskInput.addEventListener('keypress', (e) => { if(e.key==='Enter') addTaskBtn.click(); });

// Função adicionar
function addTask(text, date="", priority="Baixa", completed=false){
  const li = document.createElement('li');
  li.innerHTML = `<span class="task-text">${text}</span>
                  <span class="task-date">${date}</span>
                  <span class="task-priority ${priority.toLowerCase()}">${priority}</span>`;
  if(completed) li.classList.add('completed');

  // Notificação se data hoje
  const today = new Date().toLocaleDateString('pt-BR');
  if(date === today && !completed) alert(`Tarefa para hoje: ${text}`);

  // Deletar
  const delBtn = document.createElement('button');
  delBtn.textContent='X';
  delBtn.classList.add('delete-btn');
  li.appendChild(delBtn);
  delBtn.addEventListener('click', ()=>{
    li.classList.add('removing');
    setTimeout(()=>{ li.remove(); saveTasks(); }, 300);
  });

  // Concluir tarefa
  li.addEventListener('click', e=>{
    if(e.target!==delBtn){ li.classList.toggle('completed'); saveTasks(); }
  });

  // Editar tarefa
  li.querySelector('.task-text').addEventListener('dblclick', ()=>{
    const newText = prompt('Edite a tarefa:', li.querySelector('.task-text').textContent);
    if(newText) li.querySelector('.task-text').textContent=newText;
    saveTasks();
  });

  taskList.appendChild(li);
  saveTasks();
}

// Salvar tarefas
function saveTasks(){
  const tasks=[];
  taskList.querySelectorAll('li').forEach(li=>{
    const text=li.querySelector('.task-text').textContent;
    const date=li.querySelector('.task-date').textContent;
    const priority=li.querySelector('.task-priority').textContent;
    const completed=li.classList.contains('completed');
    tasks.push({text,date,priority,completed});
  });
  localStorage.setItem('tasks',JSON.stringify(tasks));
}

// Carregar
function loadTasks(){
  const tasks=JSON.parse(localStorage.getItem('tasks'))||[];
  tasks.forEach(t=>addTask(t.text,t.date,t.priority,t.completed));
}

// Limpar concluídas
clearBtn.addEventListener('click', ()=>{
  taskList.querySelectorAll('li.completed').forEach(li=>li.remove());
  saveTasks();
});

// Filtros
filterAll.addEventListener('click', ()=>filterTasks('all'));
filterPending.addEventListener('click', ()=>filterTasks('pending'));
filterCompleted.addEventListener('click', ()=>filterTasks('completed'));

function filterTasks(filter){
  taskList.querySelectorAll('li').forEach(li=>{
    switch(filter){
      case 'all': li.style.display='flex'; break;
      case 'pending': li.style.display=li.classList.contains('completed')?'none':'flex'; break;
      case 'completed': li.style.display=li.classList.contains('completed')?'flex':'none'; break;
    }
  });
}

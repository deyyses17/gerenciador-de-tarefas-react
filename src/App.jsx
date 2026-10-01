import { useEffect, useState } from "react";
import AddTask from "./components/AddTask";
import Tasks from "./components/tasks";
import {v4} from "uuid";
import Title from "./components/Title";

function App(){
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem("tasks")) || []);

  //aqui usei o localstorage pra persistir um dado que tá no state, ou seja, as tasks nao vão ser perdidas se o user atualizar a pagina
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
 }, [tasks]);

  //quando criamos um useeffect, e passamos uma lista vazia como segundo parametro, essa função só é executada uma vez, que é a primeira vez do usuário na aplicação
  useEffect(() => {
  const fetchTasks = async () => {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10",
        {
        method: "GET",
        }
      );
    const data = await response.json();
    setTasks(data); //armazenas os dados no stateeeee
  };

  fetchTasks();
}, []);

  function onTaskClick(taskId){
    const newTasks = tasks.map(task =>{
      //precisa atualizar tarefa
      if(task.id == taskId){
        //mudar o estado da tarefa; completa ou incompleta
        return {...task, isCompleted: !task.isCompleted }
      }

      //nao preciso atualizar a tarefa
      return task;
    });
    setTasks(newTasks);
  }

  function onDeleteTaskClick(taskId){
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
  }

  function onAddTaskSubmit(title, description){
    const newTask = {
      id: v4(),
      title,
      description,
      isCompleted: false //por padrao
    };

    setTasks([...tasks, newTask]) //atualização da lista: todas as tarefas anteriores MAIS essa nova tarefa recebida pelo input
  }

  return(
    <div className="w-screen h-screen bg-slate-500 flex justify-center p-6">
      <div className="w-[500px] space-y-4">
        <Title>Gerenciador de Tarefas</Title>
        <AddTask onAddTaskSubmit={onAddTaskSubmit} />
        <Tasks 
          tasks={tasks} 
          onTaskClick={onTaskClick} 
          onDeleteTaskClick={onDeleteTaskClick}
        />
      </div>
    </div>
  );
}

export default App;
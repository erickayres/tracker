let dtStart;
let dtEnd;
let seconds = 0;
let minutes = 0;
let hours   = 0;
let cron;
let runningTime;

let content     = document.getElementById("content")
let btAdicionar = document.getElementById("btAdicionar")
let btLimpar    = document.getElementById("btLimpar")
let btExcluir   = document.getElementById("btExcluir")
let btStart     = document.getElementById('btStart')
let btPause     = document.getElementById('btPause')
let btDone      = document.getElementById('btDone')
let btDownload  = document.getElementById('btDownload')

let id = parseInt(localStorage.getItem('id')||0);
let tasks = JSON.parse(localStorage.getItem('tasks'))||[];
//let id = 0;

btStart.addEventListener('click', start);
btPause.addEventListener('click', ()=>{pause(false)});
btDone.addEventListener('click', done);
btExcluir.addEventListener('click', deleteCard);
btLimpar.addEventListener("click", clearForm);
btDownload.addEventListener('click', downloadData);

btAdicionar.addEventListener("click", ()=>{

  if (!validateForm()) return false;

  let chamado = addCard(getChamado());

  tasks.push(chamado);

  localStorage.setItem('id', id);
  localStorage.setItem('tasks',JSON.stringify(tasks));

});

//Adiciona os cards de tarefas quando a página carregar.
  tasks.forEach(task => {
    addCard(task);
  });

function addCard(chamado){
  let card = document.createElement('div');
  let author = document.createElement('p');
  let explanation = document.createElement('p');
  let footer = document.createElement('p');
  let icon  = document.createElement('div');

  card.className = 'card';
  card.classList.add ('n'+chamado.nivel);
  if (chamado.resolvido) {card.classList.add('solved')};
  card.setAttribute('id', 'card-'+chamado.id);
  card.addEventListener('click', loadForm);

  author.className = 'author';
  author.innerText = '#'+ chamado.id + ' - ' + chamado.solicitante;

  explanation.className = 'explanation';
  explanation.innerText = chamado.problema;

  footer.className = 'footer';
  footer.innerHTML = '<span class="data">' + chamado.data + '</span> - ' + chamado.hora;

  icon.className = 'icon';
  if (chamado.categoria == 'Hardware')
    icon.innerHTML = '<i class="fa-solid fa-microchip"></i>'
  else
    icon.innerHTML = '<i class="fa-solid fa-code"></i>';

  card.appendChild(author);
  card.appendChild(document.createElement('hr'));
  card.appendChild(explanation);
  card.appendChild(footer);
  card.appendChild(icon);
  content.appendChild(card);

  return chamado;
}

function getChamado(){
  let chamado = new Object();
  let data = new Date();
  id++;
  chamado.solicitante  = document.getElementById('solicitante').value;
  chamado.problema     = document.getElementById('task').value;
  chamado.nivel        = document.getElementById('level').value;
  chamado.categoria    = document.getElementById('categoria').value;
  chamado.subcategoria = document.getElementById('subcategoria').value;
  chamado.solution     = document.getElementById('solution').value;
  chamado.data         = data.toLocaleDateString();
  chamado.hora         = data.toLocaleTimeString();
  chamado.id           = id;
  chamado.tempo        = document.getElementById('time').value;
  chamado.resolvido    = false; 
  

   clearForm();
  return chamado;
}

function clearForm(){
  document.getElementById('solicitante').value = '';
  document.getElementById('task').value = '';
  document.getElementById('level').value = '';
  document.getElementById('categoria').value = '';
  document.getElementById('subcategoria').value = '';
  document.getElementById('solution').value = '';
  document.getElementById('item').value = '';
  document.getElementById('time').value = '';

  document.getElementById('seconds').innerText = returnTime(0);
  document.getElementById('minutes').innerText = returnTime(0);
  document.getElementById('hours').innerText   = returnTime(0);

  document.getElementById('solicitante').focus();

  btExcluir.disabled = true;
  btPause.disabled   = true;
  btStart.disabled   = false;

  clearInterval(cron);
  
  
  return 
}

function validateForm(){
  
  if (document.getElementById('solicitante').value == ''){
    alert('Campo SOLICITANTE não pode ser vazio. Preencha-o!');
    document.getElementById('solicitante').focus();
    return false;
  }

  if (document.getElementById('task').value == ''){
    alert('Campo PROBLEMA não pode ser vazio. Preencha-o!');
    document.getElementById('task').focus();
    return false;
  }

  if (document.getElementById('level').value == ''){
    alert('Campo NÍVEL não pode ser vazio. Preencha-o!');
    document.getElementById('level').focus();
    return false;
  }

  if (document.getElementById('categoria').value == ''){
    alert('Campo CATEGORIA não pode ser vazio. Preencha-o!');
    document.getElementById('categoria').focus();
    return false;
  }

  if (document.getElementById('subcategoria').value == ''){
    alert('Campo SUBCATEGORIA não pode ser vazio. Preencha-o!');
    document.getElementById('subcategoria').focus();
    return false;
  }

  return true;
}

function loadForm(){

  if (!btPause.disabled){
    (this.classList[2] == 'solved') ? pause(true) : pause(false);
  }

  let keySearch = this.id.split('-')[1]; 
  let runningTime =new Date(0)
  let chamado = tasks.find(task => task.id == keySearch);

  document.getElementById('solicitante').value = chamado.solicitante ;
  document.getElementById('task').value = chamado.problema;
  document.getElementById('level').value = chamado.nivel;
  document.getElementById('categoria').value = chamado.categoria;    
  document.getElementById('subcategoria').value = chamado.subcategoria;
  document.getElementById('solution').value = chamado.solution;
  document.getElementById('item').value = chamado.id;
  document.getElementById('time').value = chamado.tempo;

  runningTime.setTime(chamado.tempo);

  document.getElementById('seconds').innerText = returnTime(runningTime.getUTCSeconds());
  document.getElementById('minutes').innerText = returnTime(runningTime.getUTCMinutes());
  document.getElementById('hours').innerText   = returnTime(runningTime.getUTCHours());
  
  btExcluir.disabled = false;
  btStart.disabled   = chamado.resolvido;
  btDone.disabled    = chamado.resolvido;
  btPause.disabled   = true;
}

function deleteCard(){
  let item = document.getElementById('item').value

  if (item != '' && confirm(`Deseja realmente excluir o card #${item}`)) 
  {
    let node = document.getElementById('card-'+item)
    
    if(node.parentNode){
      node.parentNode.removeChild(node);

      //localiza o item a ser removido
      let index = tasks.indexOf(tasks.find(task => task.id == item));
      
      //remove o item
      tasks.splice(index, 1);

      localStorage.setItem('tasks', JSON.stringify(tasks));

      clearForm();
    }
  }
}

function timer(){
  let dtDiff = 0;
  dtEnd = new Date();

  dtDiff = new Date(dtEnd - dtStart);
  dtDiff.setTime(dtDiff.getTime() + runningTime.getTime());

  seconds = dtDiff.getUTCSeconds();
  minutes = dtDiff.getUTCMinutes();
  hours   = dtDiff.getUTCHours();
  
  document.getElementById('seconds').innerText = returnTime(seconds);
  document.getElementById('minutes').innerText = returnTime(minutes);
  document.getElementById('hours').innerText   = returnTime(hours);
}

function start(){
  
  if (!validateForm()) return false;

  runningTime = new Date(0);
  runningTime.setTime(document.getElementById('time').value)

  dtStart = new Date();
  cron = setInterval( ()=>{timer();}, 1000);

  btStart.disabled = true;
  btPause.disabled = false;
  btDone.disabled = false;
}

function pause(finished){

  runningTime.setUTCSeconds(seconds);
  runningTime.setUTCMinutes(minutes);
  runningTime.setUTCHours(hours);
  document.getElementById('time').value = runningTime.getTime()
  clearInterval(cron);
  updateData(finished)

  btPause.disabled = true;
  btStart.disabled = false;
}

function done(){

  if(document.getElementById('solution').value == ''){
    alert('Só está pronto se houver solução. Preencha-a!');
    return false;
  }

  pause(true);
  clearForm();
}

function returnTime(input){
  return input > 9? input : `0${input}`;
}

function updateData(solved){
  let item = document.getElementById('item').value;
  let chamado = new Object();
  let data = new Date();

  if (item == 0){
    id++;
    chamado.solicitante  = document.getElementById('solicitante').value;
    chamado.problema     = document.getElementById('task').value;
    chamado.nivel        = document.getElementById('level').value;
    chamado.categoria    = document.getElementById('categoria').value;
    chamado.subcategoria = document.getElementById('subcategoria').value;
    chamado.solution     = document.getElementById('solution').value;
    chamado.data         = data.toLocaleDateString();
    chamado.hora         = data.toLocaleTimeString();
    chamado.id           = id;
    chamado.tempo        = document.getElementById('time').value;
    chamado.resolvido    = solved; 
    chamado.datafim      = data.toLocaleDateString();
    chamado.horafim      = data.toLocaleTimeString();

    addCard(chamado);
    tasks.push(chamado);
    localStorage.setItem('id', id);
    localStorage.setItem('tasks', JSON.stringify(tasks));

  }else{
    let index = tasks.indexOf(tasks.find(task => task.id == item));
    tasks[index].solicitante  = document.getElementById('solicitante').value;
    tasks[index].problema     = document.getElementById('task').value;
    tasks[index].nivel        = document.getElementById('level').value;
    tasks[index].categoria    = document.getElementById('categoria').value;
    tasks[index].subcategoria = document.getElementById('subcategoria').value;
    tasks[index].solution     = document.getElementById('solution').value;
    tasks[index].tempo        = document.getElementById('time').value;
    tasks[index].resolvido    = solved;
    tasks[index].datafim      = data.toLocaleDateString();
    tasks[index].horafim      = data.toLocaleTimeString();

    if(solved){
      document.getElementById('card-'+item).classList.add('solved');
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

}

function downloadData(){
  console.log('Download Data pressed!')

  let csv = 'Técnico; Data; Hora; Solicitante; Título; Categoria; SubCategoria; Urgência; Solução; Duração; Resolvido; \n'
  let tarefas = JSON.parse(localStorage.getItem('tasks'));
  let duracao = new Date();
  let duracaoString = "";

  tarefas.forEach((tarefa)=>{
    duracao.setTime(tarefa.tempo);
    duracaoString = returnTime(duracao.getUTCHours()) + ":";
    duracaoString += returnTime(duracao.getUTCMinutes()) + ":";
    duracaoString += returnTime(duracao.getUTCSeconds());

    csv += '"Erick Ayres";';
    csv += tarefa.data+';';
    csv += tarefa.hora+';';
    csv += '"'+ tarefa.solicitante  +'";';
    csv += '"'+ tarefa.problema     +'";';
    csv += '"'+ tarefa.categoria    +'";';
    csv += '"'+ tarefa.subcategoria +'";';
    csv += tarefa.nivel + ';';
    csv += '"'+ tarefa.solution     +'";';
    csv += duracaoString +';';
    csv += tarefa.resolvido?'Sim':'Não';
    csv += tarefa.resolvido?tarefa.datafim:'';
    csv += tarefa.resolvido?tarefa.horafim:'';
    csv += '\n';
  })

  var hiddenElement      = document.createElement('a');
  hiddenElement.href     = 'data:text/csv;charset=UTF-8,'+encodeURI(csv);
  hiddenElement.target   = '_blank';
  hiddenElement.download = 'taskticking.csv';
  hiddenElement.click();
}
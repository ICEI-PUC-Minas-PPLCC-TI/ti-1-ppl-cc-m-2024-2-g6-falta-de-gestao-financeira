const categoryImagens = {
    1: 'assets/img/icon/icones/compra.png',
    2: 'assets/img/icon/icones/casa.png',
    3: 'assets/img/icon/icones/casa.png',
    6: 'assets/img/icon/icones/salario.png',
  }
  
  export async function loadAllRegisters(useFilter, text) {
    const res = await fetch("/entries");
  
    if (!res.ok) {
      console.error("Erro ao carregar registros");
      return null;
    }
  
    let registers = await res.json();
  
    const divContaner = document.getElementById('elements');
  
    registers = useFilter ? registers.filter(element => element.label.toLowerCase().includes(text.toLowerCase())) :  registers
  
    registers.forEach(element => {
  
      const div = document.createElement('div');
      div.className = "container2";
  
      const img = document.createElement('img');
  
      //Ajustar a constante lÃ¡ em cima para receber todas as imagens
      //img.src = categoryImagens[element.categoryId]
      img.src = "/assets/img/icon/selectable/briefcase.svg"
      
      const spanTitle = document.createElement('span');
  
      spanTitle.innerHTML = element.label
      spanTitle.className = 'info'
  
      const valueTitle = document.createElement('span');
  
      const valueStyled = element.type === 'expense' ? 'red' : 'green'
  
      valueTitle.innerHTML = decimalFormat(element.value)
      valueTitle.className = 'value'
      valueTitle.style = `color: ${valueStyled}`
  
      div.appendChild(img)
      div.appendChild(spanTitle)
      div.appendChild(valueTitle)
  
      divContaner.appendChild(div)
  
    });
  
    const total = registers.reduce((memo, currenc) => {
      memo =  currenc.type ===  'expense' ? memo - currenc.value : memo + currenc.value
      return memo
    }, 0);
  
    const divTotal = document.getElementById('total');
  
    divTotal.innerHTML = decimalFormat(total);
    divTotal.style = total > 0 ? 'color: green' : "color: red";
  
  
    const previousMonth = document.getElementById('previousMonth');
    const currentMonth = document.getElementById('currentMonth');
  
    //colocar os valores aqui
  
  }
  
  const decimalFormat = (value) =>  new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  
  
  function myFunction(val) {
    alert("The input value has changed. The new value is: " + val);
  }
  
  
  const pesquisar = document.getElementById('pesquisar');
  
  pesquisar.addEventListener("input", (e) => {
    const elementsToRemove = document.getElementsByClassName('container2')
    while(elementsToRemove.length > 0) {
      elementsToRemove[0].parentNode.removeChild(elementsToRemove[0]);
    }
  
    loadAllRegisters(true, e.target.value)
  }, false);
  
  
  loadAllRegisters();

class Nota {
    constructor(title, priority = "normal", completed = false, date = Date.now()) {
        this.title = title;
        this.priority = priority;
        this.date = date;
        this.completed = completed
    }

    getTitle(){
        return this.title;
    }

    getPriority(){
        return this.priority;
    }

    getDate(){
        return this.date;
    }

    getCompleted(){
        return this.completed;
    }
}

// Comprobamos si existe notas en LocalStorage.
if(localStorage.notas != null){
    var notas = JSON.parse(localStorage.getItem('notas'))
}else{
    var notas = [];
}


$(document).ready(function() {
    if(localStorage.getItem('notas') != null) {
        writeLocalStorage();
    }

    var noCompletadas = 0;

    // Detectar tecla Enter
    $("input").keyup(function(e) {
        if (e.keyCode == 13) {
            if($("input").val() != ''){
                nuevaNota();
                noCompletadas++;
                $("#pendientes").text(`${noCompletadas} pendientes de un total de ${notas.length}`);
            }else{
                $("#errorText").text("No dejes el campo de texto vacío.")
                setTimeout(function(){$("#errorText").text(" ")}, 2000);
            }
        }
    });

    // Eliminar nota.
    $("#container").on("click", ".fa-square-minus", function() {
        var index = $(this).parent().parent().index();
        notas.splice(index, 1);
        $(this).parent().parent().slideUp();
        // $(this).parent().parent().remove();
        localStorage.notas = JSON.stringify(notas);
        noCompletadas--;
        $("#pendientes").text(`${noCompletadas} pendientes de un total de ${notas.length}`);
    });

    // Marcar la nota como completada.
    $("#container").on("click", ".fa-circle", function() {
        $(this).toggleClass("fa-circle fa-check-circle");
        $(this).siblings("h2").toggleClass("checked");
        var index = $(this).parent().parent().index();
        notas[index].completed = true;
        localStorage.notas = JSON.stringify(notas);
        noCompletadas --;
        $("#pendientes").text(`${noCompletadas} pendientes de un total de ${notas.length}`);
    });

    // Desmarcar nota como completada.
    $("#container").on("click", ".fa-check-circle", function() {
        $(this).toggleClass("fa-check-circle fa-circle");
        $(this).siblings("h2").removeClass("checked");
        var index = $(this).parent().parent().index();
        notas[index].completed = false;
        localStorage.notas = JSON.stringify(notas);
        noCompletadas ++;
        $("#pendientes").text(`${noCompletadas} pendientes de un total de ${notas.length}`);
    });

    // Borrar notas completadas.
    $("#deleteAll").click(function() {
        $(".fa-check-circle").parent().parent().slideUp();
        let nuevaLista = [];
        for(nota of notas){
            if(!nota.completed){
                nuevaLista.push(nota)
            }
        }
        localStorage.notas = JSON.stringify(nuevaLista);
    });

    $("h2:not(.checked)").each(function() {
        noCompletadas++;
    });
    
    $("#pendientes").text(`${noCompletadas} pendientes de un total de ${notas.length}`);

    // Cambiar la prioridad del nota
    $("#container").on("click", "#low", function() {
        $(this).toggleClass("not_marked marked");
        $(this).siblings().removeClass("marked");
        $(this).siblings().addClass("not_marked");
        var index = $(this).parent().parent().index();
        notas[index].priority = "low";
        notas = ordenarArray(notas);
        localStorage.notas = JSON.stringify(notas);
        writeLocalStorage();
    });

    $("#container").on("click", "#normal", function() {
        $(this).toggleClass("not_marked marked");
        $(this).siblings().removeClass("marked");
        $(this).siblings().addClass("not_marked");
        var index = $(this).parent().parent().index();
        notas[index].priority = "normal";
        notas = ordenarArray(notas);
        localStorage.notas = JSON.stringify(notas);
        writeLocalStorage();
    });

    $("#container").on("click", "#high", function() {
        $(this).toggleClass("not_marked marked");
        $(this).siblings().removeClass("marked");
        $(this).siblings().addClass("not_marked");
        var index = $(this).parent().parent().index();
        notas[index].priority = "high";
        notas = ordenarArray(notas);
        localStorage.notas = JSON.stringify(notas);
        writeLocalStorage();
    });
});

// FUNCIÓN PARA CREAR UNA NOTA NUEVA
function nuevaNota(){
    var inputValue = $('#notaInput').val();
    var container = $('#container');
    var miNota = new Nota(inputValue);

    var newNota = $(`<div class='singleNota'>
                        <div class='nota--text'>
                            <i class='fa-regular fa-circle'></i>
                            <h2>${miNota.getTitle()}</h2>
                            <i class='fa-solid fa-square-minus'></i>
                        </div>
                        <div class='nota--data'>
                            <p>Prioridad</p>
                            <button id='low' class="not_marked">
                                <i class='fa-solid fa-arrow-down'></i>Low
                            </button>
                            <button id='normal' class="marked">Normal</button>
                            <button id='high' class="not_marked">
                                <i class='fa-solid fa-arrow-up'></i>High
                            </button>
                            <i class='fa-regular fa-clock'></i>
                            <p>Añadido hace ${Math.floor(((Date.now() - miNota.date)/1000)/60)} minutos.</p>
                        </div>
                    </div>`);

    container.append(newNota);
    $('#notaInput').val('');
    notas.push(miNota);
    localStorage.notas = JSON.stringify(notas);
}

// FUNCIÓN PARA ESCRIBIR LAS NOTAS ALMACENADAS EN EL LOCALSTORAGE
function writeLocalStorage(){
    var notas = JSON.parse(localStorage.getItem('notas'));
    var container = $('#container');
    container.html(" ");
    for (let i = 0; i < notas.length; i++) {
        var miNota = new Nota(notas[i].title, notas[i].priority, notas[i].completed, notas[i].date);
        if(miNota.getCompleted() == false){
            if(miNota.getPriority() == "low"){
                var newNota = $(`<div class='singleNota'>
                                    <div class='nota--text'>
                                        <i class='fa-regular fa-circle'></i>
                                        <h2>${miNota.getTitle()}</h2>
                                        <i class='fa-solid fa-square-minus'></i>
                                    </div>
                                    <div class='nota--data'>
                                        <p>Prioridad</p><button id='low' class="marked">
                                        <i class='fa-solid fa-arrow-down'></i>Low
                                        </button><button id='normal' class="not_marked">Normal</button>
                                        <button id='high' class="not_marked">
                                        <i class='fa-solid fa-arrow-up'></i>High
                                        </button><i class='fa-regular fa-clock'></i>
                                        <p>Añadido hace ${Math.floor(((Date.now() - miNota.date)/1000)/60)} minutos.</p>
                                    </div>
                                </div>`);
            } else if(miNota.getPriority() == "normal"){
                var newNota = $(`<div class='singleNota'><div class='nota--text'><i class='fa-regular fa-circle'></i><h2>${miNota.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='nota--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='normal' class="marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - miNota.date)/1000)/60)} minutos.</p></div></div>`);
            } else if(miNota.getPriority() == "high"){
                var newNota = $(`<div class='singleNota'><div class='nota--text'><i class='fa-regular fa-circle'></i><h2>${miNota.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='nota--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='normal' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - miNota.date)/1000)/60)} minutos.</p></div></div>`);
            }
        }else{
            if(miNota.getPriority() == "low"){
                var newNota = $(`<div class='singleNota'><div class='nota--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${miNota.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='nota--data'><p>Prioridad</p><button id='low' class="marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='normal' class="not_marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - miNota.date)/1000)/60)} minutos.</p></div></div>`);
            } else if(miNota.getPriority() == "normal"){
                var newNota = $(`<div class='singleNota'><div class='nota--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${miNota.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='nota--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='normal' class="marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - miNota.date)/1000)/60)} minutos.</p></div></div>`);
            } else if(miNota.getPriority() == "high"){
                var newNota = $(`<div class='singleNota'><div class='nota--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${miNota.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='nota--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='normal' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - miNota.date)/1000)/60)} minutos.</p></div></div>`);
            }
        }
        container.append(newNota);
    }
}


function ordenarArray(array){
    let arrayOrdenado = array.sort((notaA, notaB)=>{
        if(notaA.priority == notaB.priority){
            return 0;
        }else if(notaB.priority == "high"){
            return 1;
        }else if((notaB.priority == "normal") && (notaA.priority == "low")){
            return 1;
        }else if((notaA.priority == "high") && (notaB.priority != "high")){
            return -1;
        }else if((notaA.priority == "normal") && (notaB.priority == "low")){
            return -1;
        }
    });

    return arrayOrdenado;
}
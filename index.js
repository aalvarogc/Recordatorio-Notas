class Nota {
    constructor(title, priority = "normal", completed = false) {
        this.title = title;
        this.priority = priority;
        this.date = Date.now();
        this.completed = completed
    }

    getTitle() {
        return this.title;
    }

    getPriority() {
        return this.priority;
    }

    getDate() {
        return Math.round((Date.now() - this.date) / 1000 / 60);
    }

    getCompleted() {
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

    var completadas = 0;

    // Detectar tecla Enter
    $("input").keyup(function(e) {
        if (e.keyCode == 13) {
            addToContainer();
            completadas++;
            $("#pendientes").text(`${completadas} pendientes de un total de ${notas.length}`);
        }
    });

    // Eliminar nota
    $("#container").on("click", ".fa-square-minus", function() {
        $(this).parent().parent().remove();
        notas.splice($(this).parent().parent().index(), 1);
        localStorage.notas = JSON.stringify(notas);
        completadas--;
        $("#pendientes").text(`${completadas} pendientes de un total de ${notas.length}`);
    });


    // Marcar la nota como completada.
    $("#container").on("click", ".fa-circle", function() {
        $(this).toggleClass("fa-circle fa-check-circle");
        $(this).siblings("h2").toggleClass("checked");
        var index = $(this).parent().parent().index();
        notas[index].completed = true;
        localStorage.notas = JSON.stringify(notas);
        completadas --;
        $("#pendientes").text(`${completadas} pendientes de un total de ${notas.length}`);
    });

    // Desmarcar nota como completada.
    $("#container").on("click", ".fa-check-circle", function() {
        $(this).toggleClass("fa-check-circle fa-circle");
        $(this).siblings("h2").removeClass("checked");
        var index = $(this).parent().parent().index();
        notas[index].completed = false;
        localStorage.notas = JSON.stringify(notas);
        completadas ++;
        $("#pendientes").text(`${completadas} pendientes de un total de ${notas.length}`);
    });

    // Borrar notas completadas.
    $("#deleteAll").click(function() {
        $(".fa-check-circle").parent().parent().remove();
        for (var i = 0; i < notas.length; i++) {
            if (notas[i].completed) {
                notas.splice(i, 1);
            }
        }
        localStorage.notas = JSON.stringify(notas);
    });

    $("h2:not(.checked)").each(function() {
        completadas++;
    });
    
    $("#pendientes").text(`${completadas} pendientes de un total de ${notas.length}`);

    // Cambiar la prioridad del nota
    $("#container").on("click", "#low", function() {
        $(this).toggleClass("not_marked marked");
        $(this).siblings().removeClass("marked");
        $(this).siblings().addClass("not_marked");
        var index = $(this).parent().parent().index();
        notas[index].priority = "low";
        localStorage.notas = JSON.stringify(notas);
    });

    $("#container").on("click", "#normal", function() {
        $(this).toggleClass("not_marked marked");
        $(this).siblings().removeClass("marked");
        $(this).siblings().addClass("not_marked");
        var index = $(this).parent().parent().index();
        notas[index].priority = "normal";
        localStorage.notas = JSON.stringify(notas);
    });

    $("#container").on("click", "#high", function() {
        $(this).toggleClass("not_marked marked");
        $(this).siblings().removeClass("marked");
        $(this).siblings().addClass("not_marked");
        var index = $(this).parent().parent().index();
        notas[index].priority = "high";
        localStorage.notas = JSON.stringify(notas);
    });
});


function addToContainer(){
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
                            <p>Añadido hace ${miNota.getDate()} minutos.</p>
                        </div>
                    </div>`);

    if(inputValue != ''){
        container.append(newNota);
        $('#notaInput').val('');
        notas.push(miNota);
        localStorage.notas = JSON.stringify(notas);
    }else{
        $("#notaInput").attr("placeholder", "No puedes añadir un nota vacío");
    }
}


function writeLocalStorage() {
    var notas = JSON.parse(localStorage.getItem('notas'));
    var container = $('#container');
    for (let i = 0; i < notas.length; i++) {
        var miNota = new Nota(notas[i].title, notas[i].priority, notas[i].completed);
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
                                        <p>Añadido hace ${miNota.getDate()} minutos.</p>
                                    </div>
                                </div>`);
            } else if(miNota.getPriority() == "normal"){
                var newNota = $(`<div class='singleNota'><div class='nota--text'><i class='fa-regular fa-circle'></i><h2>${miNota.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='nota--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='normal' class="marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${miNota.getDate()} minutos.</p></div></div>`);
            } else if(miNota.getPriority() == "high"){
                var newNota = $(`<div class='singleNota'><div class='nota--text'><i class='fa-regular fa-circle'></i><h2>${miNota.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='nota--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='normal' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${miNota.getDate()} minutos.</p></div></div>`);
            }
        }else{
            if(miNota.getPriority() == "low"){
                var newNota = $(`<div class='singleNota'><div class='nota--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${miNota.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='nota--data'><p>Prioridad</p><button id='low' class="marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='normal' class="not_marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${miNota.getDate()} minutos.</p></div></div>`);
            } else if(miNota.getPriority() == "normal"){
                var newNota = $(`<div class='singleNota'><div class='nota--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${miNota.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='nota--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='normal' class="marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${miNota.getDate()} minutos.</p></div></div>`);
            } else if(miNota.getPriority() == "high"){
                var newNota = $(`<div class='singleNota'><div class='nota--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${miNota.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='nota--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='normal' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${miNota.getDate()} minutos.</p></div></div>`);
            }
        }
        container.append(newNota);
    }
}
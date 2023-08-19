var tablero = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
var ranking = []
var partidaGuardadas = []


turno1 = 1;
turno2 = 2;
turnoActual = turno1;
tiempoXjugador = 10;
segundoInicio = tiempoXjugador;
pausa = false;
Terminada = false;

function iniciarpartida() {
  globalThis.namej1 = ""
  globalThis.namej2 = ""

  namej1 = document.getElementById("jugador1").value;
  namej2 = document.getElementById("jugador2").value;

  if (namej1 == "" && namej2 == "") {
    alert("Ingrese los juagadores")
  } else {

    document.getElementById("J1").innerText = namej1;
    document.getElementById("J2").innerText = namej2;

    for (var index = 0; index < 7; index++) {
      id = "c" + index;
      document.getElementById(id).style.display = "none";
    }
    document.getElementById("jugador1").value = "";
    document.getElementById("jugador2").value = "";

    mostrar('comenzandoP')
    cargarT()
    comenzando()
  }

}

//comienza los contadores de la partida
var regresiva = 3;

function comenzando() {

  document.getElementById('regresiva').innerHTML = regresiva;

  if (regresiva == 0) {

    ocultartodo()
    document.getElementById("juego").style.display = "inline"
    document.getElementById("botonespartida").style.display = "inline"


    Terminada = false
    if (localStorage.length != 0) {
      document.getElementById("J1").innerText = namej1;
      document.getElementById("J2").innerText = namej2;
      cargarT()
    }
    cronometro()
    Temporizador()
    pause(0)
    regresiva = 3;
  } else {
    regresiva -= 1;
    pause(1)
    setTimeout(comenzando, 1E3);
  }
}

//colocar la ficha en el tablero

function PosicionarFicha(columna) {

  for (var fil = 5; fil > -1; fil--) {
    if (tablero[fil][columna] == 0) {

      //guardar ficha en el arreglo
      tablero[fil][columna] = turnoActual;

      //mostrar en la tabla
      cargarT()
      cambiarTurno()
      segundoInicio = tiempoXjugador
      break
    }
  }

  var ganador = verGanador()

  if (ganador == turno1) {
    pause(1)
    mov = MovimientosGanador(turno1)
    datos = { 'Nombre': namej1, 'Movimientos': mov };
    ranking.push(datos);
    TablaRanking()
    winner(turno1)
    mostrar('winner')
  }
  else if (ganador == turno2) {
    pause(1)
    mov = MovimientosGanador(turno2)
    datos = { 'Nombre': namej2, 'Movimientos': mov };
    ranking.push(datos);
    TablaRanking()
    winner(turno2)
    mostrar('winner')
  }
  else {

    //Vemos si hay empate
    var hayEmpate = true;
    for (var i = 0; i < 7; i++)
      if (lugaresVacios(i) != -1) {
        hayEmpate = false;
        break;
      }
    if (hayEmpate) {
      alert("Empate");

      //Si hay empate reiniciar la partida.
    }


  }
}

//Cambiar turno

function cambiarTurno() {
  if (turnoActual == turno1) {
    turnoActual = turno2;
  } else {
    turnoActual = turno1;
  }
}

//Temporizador

function Temporizador() {

  if (turnoActual == turno1) {
    document.getElementById('JugadorN1').style.background = 'red';
    document.getElementById('JugadorN2').style.background = 'white';
    document.getElementById('temporizador2').innerHTML = 00;
    document.getElementById('temporizador1').innerHTML = segundoInicio;
  } else {
    document.getElementById('JugadorN2').style.background = 'yellow';
    document.getElementById('JugadorN1').style.background = 'white';
    document.getElementById('temporizador1').innerHTML = 00;
    document.getElementById('temporizador2').innerHTML = segundoInicio;
  }

  if (Terminada == false) {
    if (pausa == false) {
      if (segundoInicio == 0) {

        // Turno terminado sin colocar ficha
        if (turnoActual == turno1) {
          document.getElementById('temporizador1').innerHTML = "Turno perdido.";
        } else {
          document.getElementById('temporizador2').innerHTML = "Turno perdido.";
        }

        //reiniciar reloj
        segundoInicio = tiempoXjugador;

        //columna random para tirar ficha
        columna = Math.floor(Math.random() * (7 - 0) + 0);
        PosicionarFicha(columna)

        setTimeout(Temporizador, 1000);
      } else {
        segundoInicio -= 1;
        setTimeout(Temporizador, 1000);
      }
    } else {
      setTimeout(Temporizador, 1000);
    }
  }


}

//pausar el juego

function pause(respuesta) {
  if (respuesta == 0) {
    pausa = false
    document.getElementById("p2").style.display = "none"
    document.getElementById("p1").style.display = "inline"
    for (var index = 0; index < 7; index++) {
      id = "c" + index;
      document.getElementById(id).style.display = "block";
    }
  } else {
    pausa = true
    document.getElementById("p1").style.display = "none"
    document.getElementById("p2").style.display = "inline"
    for (var index = 0; index < 7; index++) {
      id = "c" + index;
      document.getElementById(id).style.display = "none";
    }
  }
}

//buscar 4 fichas en linea

function verGanador() {
  //buscar en horizontal de abajo para arriba
  for (var fila = 5; fila >= 0; fila--) {
    var t1 = 0, t2 = 0;

    for (var col = 0; col < 7; col++) {
      if (tablero[fila][col] == 0) {
        t1 = 0;
        t2 = 0;
      }
      else if (tablero[fila][col] == 1) {
        t1++;
        t2 = 0;
        if (t1 == 4) {
          return turno1;
        }
      }
      else {
        t1 = 0;
        t2++;
        if (t2 == 4) {
          return turno2;
        }
      }

    }

  }

  //buscar en vertical de abajo para arriba
  for (var col = 0; col < 7; col++) {
    var t1 = 0, t2 = 0;

    for (var fila = 5; fila >= 0; fila--) {
      if (tablero[fila][col] == 0) {
        t1 = 0;
        t2 = 0;
      }
      else if (tablero[fila][col] == 1) {
        t1++;
        t2 = 0;
        if (t1 == 4) {
          return turno1;
        }
      }
      else {
        t1 = 0;
        t2++;
        if (t2 == 4) {
          return turno2;
        }
      }

    }

  }

  //buscar en diagonal de izquiera a derecha
  for (var i = -(7 + 4); i < 7; i++) {
    var t1 = 0;
    var t2 = 0;
    for (var f = 0; f < 6; f++) {
      var c = i + f;
      if ((c < 0) || (c >= 7))
        continue;
      if (tablero[f][c] == 0) {
        t1 = 0;
        t2 = 0;
      }
      else if (tablero[f][c] == 1) {
        t1++;
        t2 = 0;
        if (t1 == 4)
          return turno1;
      }
      else {
        t1 = 0;
        t2++;
        if (t2 == 4)
          return turno2;
      }
    }
  }

  //buscar en diagonal de derecha a izquierda
  for (var i = 0; i < 7 + 4; i++) {
    var t1 = 0;
    var t2 = 0;
    for (var f = 0; f < 6; f++) {
      var c = i - f;
      if ((c < 0) || (c >= 7))
        continue;
      if (tablero[f][c] == 0) {
        t1 = 0;
        t2 = 0;
      }
      else if (tablero[f][c] == 1) {
        t1++;
        t2 = 0;
        if (t1 == 4)
          return turno1;
      }
      else {
        t1 = 0;
        t2++;
        if (t2 == 4)
          return turno2;
      }
    }
  }
  return undefined;
}

//buscar si hay lugares vacios
function lugaresVacios(columna) {
  var i = 5;
  while (i >= 0) {
    if (tablero[i][columna] == 0)
      return i;
    i--;
  }
  //console.log("Columna Llena");
  return -1;
}

//Cronometro de la partida
var hora = 0, min = 0, seg = 0;
function cronometro() {

  if (Terminada == false) {
    if (pausa == false) {
      if (seg == 60) {
        min++
        seg = 0
        if (min == 60) {
          hora++;
          min = 0;
        }
        result = AgregarUnCero(hora) + ":" + AgregarUnCero(min) + ":" + AgregarUnCero(seg);
        document.getElementById("crono").innerText = result;
        setTimeout(cronometro, 1000);
      } else {
        seg++;
        result = AgregarUnCero(hora) + ":" + AgregarUnCero(min) + ":" + AgregarUnCero(seg);
        document.getElementById("crono").innerText = result;
        setTimeout(cronometro, 1000);
      }
    } else {
      setTimeout(cronometro, 1000);
    }
  }
}

//Funcion que pone un 0 delante de un valor si es necesario
function AgregarUnCero(Time) {
  return (Time < 10) ? "0" + Time : + Time;
}

//CARGAR LA TABLA
function cargarT() {
  for (var fila = 0; fila < 6; fila++) {
    for (var col = 0; col < 7; col++) {
      if (tablero[fila][col] == 1) {
        document.getElementById("TB_juego").rows[fila + 1].cells[col].innerHTML = "<img src='FichaRoja.png' alt='jugador1' width='75' height='75'>"
      } else if (tablero[fila][col] == 2) {
        document.getElementById("TB_juego").rows[fila + 1].cells[col].innerHTML = "<img src='FichaAmarilla.png' alt='jugador2' width='75' height='75'>"
      } else {
        document.getElementById("TB_juego").rows[fila + 1].cells[col].innerHTML = "<img src='FichaBlanca.png' alt='vacio' width='75' height='75'>"
      }
    }
  }
}

//contar movimientos del ganador
function MovimientosGanador(turnoGanador) {
  var movimientos = 0;

  for (var fila = 0; fila < 6; fila++) {
    for (var col = 0; col < 7; col++) {
      if (tablero[fila][col] == turnoGanador) {
        movimientos++;
      }
    }
  }
  return movimientos;
}

//reinicia la partida
function reiniciar() {
  tablero = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
  hora = 0;
  min = 0;
  seg = 0;
  segundoInicio = tiempoXjugador;
  if (turnoActual == turno2) {
    turnoActual = turno1;
  }
  Terminada = true
  document.getElementById("crono").innerText = "00:00:00"
  mostrar('comenzandoP')
  cargarT()
  comenzando()
}

//guardar una partida
function guardar() {
  var fechaHoy = new Date(), index;
  fecha = fechaHoy.getDay() + "/" + fechaHoy.getMonth() + "/" + fechaHoy.getFullYear() + " " + AgregarUnCero(fechaHoy.getHours()) + ":" + AgregarUnCero(fechaHoy.getMinutes());
  nombreP = namej1 + " VS " + namej2;

  //guardando datos de la partida.
  if (partidaGuardadas.length != 0) {
    for (var i = 0; i < partidaGuardadas.length; i++) {
      if (partidaGuardadas[i].Nombre == nombreP) {
        index = i;
      }
    }


    if (partidaGuardadas[index].Nombre == nombreP) {
      datos = { 'Nombre': nombreP, 'Fecha': fecha, 'Tablero': tablero, 'Jugador1': namej1, 'Jugador2': namej2, 'Turno': turnoActual, 'Cronometro': { 'hora': hora, 'min': min, 'seg': seg } };
      partidaGuardadas[index] = datos;
    } else {
      datos = { 'Nombre': nombreP, 'Fecha': fecha, 'Tablero': tablero, 'Jugador1': namej1, 'Jugador2': namej2, 'Turno': turnoActual, 'Cronometro': { 'hora': hora, 'min': min, 'seg': seg } };
      partidaGuardadas.push(datos);
    }

    //guardar los datos de forma local
    storage = JSON.stringify(partidaGuardadas);
    localStorage.setItem("reanudar", storage);
  } else {

    datos = { 'Nombre': nombreP, 'Fecha': fecha, 'Tablero': tablero, 'Jugador1': namej1, 'Jugador2': namej2, 'Turno': turnoActual, 'Cronometro': { 'hora': hora, 'min': min, 'seg': seg } };
    partidaGuardadas.push(datos);

    storage = JSON.stringify(partidaGuardadas);
    localStorage.setItem("reanudar", storage);
  }


  cargarTJugadas()

  //preguntar si salir o continuar la partida
  salir()
}

//Terminar la partida que se esta jugando
function salir() {
  pause(1);
  var statusConfirm = confirm("¿Desea terminar la partida?");
  if (statusConfirm == true) {
    tablero = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
    hora = 0;
    min = 0;
    seg = 0;
    segundoInicio = tiempoXjugador;
    if (turnoActual == turno2) {
      turnoActual = turno1;
    }
    namej1 = "";
    namej2 = "";

    Terminada = true
    ocultartodo()
    mostrar('Principal')
  } else {
    pause(0);
  }


}

//cargar la tabla de las partidas guardadas
function cargarTJugadas() {
  var fila, cell1, cell2, cell3;
  document.getElementById("partidasJugadas").innerHTML = "";
  for (var i = 0; i < partidaGuardadas.length; i++) {
    if (partidaGuardadas[i] != null) {
      fila = document.getElementById("partidasJugadas").insertRow();
      cell1 = fila.insertCell();
      cell2 = fila.insertCell();
      cell3 = fila.insertCell();
      cell1.innerText = partidaGuardadas[i].Nombre
      cell2.innerText = partidaGuardadas[i].Fecha
      cell3.innerHTML = "<button id='reanudar2' onclick='reanudar(" + i + ")'><img src='reanudar.png'>Reanudar</button>"
    }
  }
}

function reanudar(fila) {

  tableroG = JSON.stringify(partidaGuardadas[fila].Tablero);
  nom1G = JSON.stringify(partidaGuardadas[fila].Jugador1);
  nom2G = JSON.stringify(partidaGuardadas[fila].Jugador2);
  trunoG = JSON.stringify(partidaGuardadas[fila].Turno);
  horaG = JSON.stringify(partidaGuardadas[fila].Cronometro.hora);
  minG = JSON.stringify(partidaGuardadas[fila].Cronometro.min);
  segG = JSON.stringify(partidaGuardadas[fila].Cronometro.seg);

  tablero = JSON.parse(tableroG);
  namej1 = JSON.parse(nom1G);
  namej2 = JSON.parse(nom2G);
  turnoActual = JSON.parse(trunoG);
  hora = JSON.parse(horaG);
  min = JSON.parse(minG);
  seg = JSON.parse(segG);

  mostrar('comenzandoP')
  comenzando()
}

function ocultartodo() {
  document.getElementById("DatosJugadores").style.display = "none";
  //document.getElementById("Principal").style.display = "none";
  document.getElementById("comenzandoP").style.display = "none";
  document.getElementById("juego").style.display = "none";
  document.getElementById("botonespartida").style.display = "none";
  document.getElementById("cargarPartidas").style.display = "none";
  document.getElementById("winner").style.display = "none";
  document.getElementById("rankingTabla").style.display = "none";
  document.getElementById("manualUser").style.display = "none";
}

function mostrar(idmenu) {
  ocultartodo();
  if (idmenu == 'Principal') {
    document.getElementById(idmenu).style.display = "inline";
    document.getElementById("botonesPrincipal").style.display = "inline";
  } else {
    document.getElementById("botonesPrincipal").style.display = "none";
    document.getElementById(idmenu).style.display = "inline";
  }

}

function winner(turno) {
  if (turno == turno1) {
    document.getElementById("ganador").style.background = 'red';
    document.getElementById("ganador").innerHTML = namej1;
  } else if (turno == turno2) {
    document.getElementById("ganador").style.background = 'yellow';
    document.getElementById("ganador").innerHTML = namej2;
  } else {
    document.getElementById("ganador").style.background = 'white';
    document.getElementById("titulog").innerHTML = "No hay ningun ganador";
    document.getElementById("ganador").innerHTML = "";
  }
}


function TablaRanking() {
  if (ranking != null) {
    var cambios, aux;


    do {
      cambios = 0;
      for (var index = 0; index < ranking.length; index++) {
        if (ranking[index + 1] != null) {
          if (ranking[index].Movimientos > ranking[index + 1].Movimientos) {
            aux = ranking[index];
            ranking[index] = ranking[index + 1];
            ranking[index + 1] = aux;
            cambios++;
          }
        } else {
          break
        }
      }
    } while (cambios > 0);

    storage = JSON.stringify(ranking);
    localStorage.setItem("ranking", storage);

    //para mostrar en la tabala
    var fila, cell1, cell2, cell3;
    document.getElementById("rankingGanadores").innerHTML = "";
    for (var i = 0; i < ranking.length; i++) {
      if (ranking[i] != null) {
        fila = document.getElementById("rankingGanadores").insertRow();
        cell1 = fila.insertCell();
        cell2 = fila.insertCell();
        cell3 = fila.insertCell();
        cell1.innerText = i + 1;
        cell2.innerText = ranking[i].Nombre;
        cell3.innerText = ranking[i].Movimientos;
      }
    }
  }
}

function recargarDatos() {

  if (localStorage.length != 0) {
    partidas_guardadas = JSON.parse(localStorage.getItem("reanudar"))
    ranking_juegos = JSON.parse(localStorage.getItem("ranking"))
    if (partidas_guardadas != null) {
      partidaGuardadas = partidas_guardadas;
      cargarTJugadas();
    }
    if (ranking_juegos != null) {
      ranking = ranking_juegos;
      TablaRanking()
    }
  }

}
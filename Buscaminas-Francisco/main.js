/**
 *
 *
 * Interfaz gráfica del buscaminas con JQuery
 *
 * @author Francisco Ramírez Ruiz
 * @version 1.0
 *
 */

let $buscaminasInterfaz;
let $fila;
let $columna;
let cronometro;

let initInterfaz = function () {
   $("#botonesDificultad").change(buscaminasGui.iniciarJuego);
   $buscaminasInterfaz = $("#buscaminasInterfaz");
   $("#record").change(buscaminasGui.partidas);
}

let buscaminasGui = {
   iniciarJuego() {
      buscaminas.pedirNivel($(this).val());
      $(this).css("display", "none");
      buscaminas.init();
      buscaminasGui.generarTableroGui();
      buscaminasGui.mostrarCronometro();
      buscaminasGui.eliminarMenuContextual();
      $("#banderas").text(" " + buscaminas.banderas);
      buscaminasGui.partidas(); //Muestro el número de victorias.
   },

   /**
    * Elimino el menú contextual del tablero de buscaminas.
    */
   eliminarMenuContextual() {
      $buscaminasInterfaz.contextmenu(function (event) {
         event.preventDefault();
      })
   },

   /**
    * Devuelvo un color aleatorio
    */
   coloresAleatorios() {
      let letters = '0123456789ABCDEF';
      let color = '#';
      for (var i = 0; i < 6; i++) {
         color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
   },

   /**
    * Genero el tablero con display grid.
    */
   generarTableroGui() {

      $buscaminasInterfaz.css({
         "display": "grid",
         "grid-template-columns": "repeat(" + buscaminas.columnas + " ,1fr)",
         "width": "100%"
      });

      for (let i = 0; i < buscaminas.filas; i++) {
         for (let j = 0; j < buscaminas.columnas; j++) {

            let $input = $(`<input type='text' id='${i}-${j}' readOnly></input>`);
            $buscaminasInterfaz.append($input);

         }
      }
      $input = $("input");
      //Acción picar === buttons0 / default
      $input.click(function () {
         buscaminasGui.picar($(this));

      })
      //Acción marcar === buttons2
      $input.mousedown(function (event) {
         buscaminasGui.marcar(event, $(this));
      })
      //Acción despejar === buttons3 o buttons4
      $input.mousedown(function (event) {
         buscaminasGui.despejar(event, $(this));
      })
   },

   /**
    * Permite picar en el tablero
    * @param {*} id
    */
   picar(id) {
      buscaminasGui.filaColumna(id);

      try {
         if (buscaminas.tableroJugable[$fila][$columna] === "🏴")
            return true; //Salgo si es una bandera.
         else {
            buscaminas.picar($fila, $columna);
            buscaminasGui.actualizarTablero();
         }
      } catch (error) {
         $("#tiempo").text();
         $("span").text(error.message);
         buscaminasGui.descubrirMinas();
      }
   },

   /**
    * Permite marcar en el tablero
    * @param {*} event 
    * @param {*} id 
    */
   marcar(event, id) {
      buscaminasGui.filaColumna(id);
      let $id = $("#" + $fila + "-" + $columna);

      if(buscaminas.tableroCasillaPulsada[$fila][$columna] !== "c-pulsada"){

      
      try {
         //Selecciono el botón derecho para marcar en el tablero
         if (event.buttons === 2) {
            buscaminas.marcar($fila, $columna);
            if (buscaminas.tableroJugable[$fila][$columna] === "🏴") {
               console.log("Coloco bandera");
               $("#banderas").text(" " + buscaminas.banderas);
               $id.css({
                  "background-color": "yellow",
                  "transition-duration": "1s"
               })
            } else {
               $("#banderas").text(" " + buscaminas.banderas);
               $id.css({
                  "background-color": "rgb(145, 57, 153)",
                  "transition-duration": "1s"
               })
            }
         }
      } catch (error) {
         $("span").text(error.message);
      }
      }else{
            console.log("nope")
      }
   },

   /**
    * Permite despejear en el tablero
    * @param {*} event 
    * @param {*} id 
    */
   despejar(event, id) {
      buscaminasGui.filaColumna(id);
      let $id = $("#" + $fila + "-" + $columna);

      try {
         //Selecciono botón izquierdo y derecho para despejar en el tablero
         if (event.buttons === 3 || event.buttons === 4) {
            console.log("boton 4");
            buscaminas.despejar($fila, $columna);
            buscaminasGui.actualizarTablero();
         }
      } catch (error) {
         $("span").text(error.message);
         buscaminasGui.descubrirMinas();
      }
   },

   /**
    * Descrubo las minas con un efecto de 
    * transición sumandole a un contador.
    */
   descubrirMinas() {
      let contador = 0;
      for (let i = 0; i < buscaminas.filas; i++) {
         for (let j = 0; j < buscaminas.columnas; j++) {
            contador += 0.25;

            let $id = $("#" + i + "-" + j)
            $id.prop("disabled", true); //Coloco disable a los inputs.
            $id.prop("click", null).off("click"); //Elimino la acción

            if (buscaminas.tableroDescubierto[i][j] === "x") {
               //Si gano EFECTO
               if (buscaminas.banderaGanado) {
                  $id.css({
                     "background-color": buscaminasGui.getRandomColor,
                     "transition-duration": "0" + contador + "s",
                     "opacity": ".9",
                     "animation-duration": "5s",
                     "animation-name": "agrandar",

                  });
                  //Si pierdo efecto.
               } else {
                  $id.css({
                     "background-color": "red",
                     "transition-duration": "0" + contador + "s",
                     "animation-duration": "1s",
                     "animation-iteration-count": "infinite", 
                     "animation-direction": "reverse",
                     "position": "relative",
                     "animation-name": "direction",
                  });
               }

            }
         }
      }
      buscaminasGui.partidas(); //Si he ganado aumento el contador.
      //Al perder, muestro enlace para jugar de nuevo.
      buscaminasGui.recargarPagina();

   },

   /**
    * Actualizo el tablero con un efecto de transform y 
    * duration.
    */
   actualizarTablero() {
      let contador = 0.01;
      for (const coordenada of buscaminas.casillaPulsada) {
         contador += 0.20;

         //Split para obtener por separado el id.
         let i = coordenada.split("-")[0];
         let j = coordenada.split("-")[1];

         let $valor = $("#" + i + "-" + j)
         // $valor.prop("disabled", true); //deshabilito los botones
         //$valor.off(); //Desactivo todo los valores de valor

         //Asignar los valores menos en el 0.
         if (buscaminas.tableroJugable[i][j] === 0)
            $valor.val("");
         else
            $valor.val(buscaminas.tableroJugable[i][j]);
         $valor.css({
            "background-color": "rgb(5, 121, 254)",
            "transform": "rotate(-360deg)",
            "transition-duration": "0" + contador + "s"
         });
      }
   },

   /**
    * Muestro el cronometro de la partida.
    */
   mostrarCronometro() {

      let horas = 0;
      let minutos = 0;
      let segundos = 0;

      let cronometro = setInterval(function () {
         if (!buscaminas.banderaFinalizar && !buscaminas.banderaGanado) {
            //Si llega a 60 segundos coloco 1 minuto
            if (segundos == 59) {
               segundos = -1;
               minutos = parseInt(minutos) + 1;
            }
            //Si llega a 60 minutos coloco 1 hora
            if (minutos == 59) {
               minutos = -1;
               horas = parseInt(horas) + 1;
            }
            //Parseo los segundos y le añado 1
            segundos = (parseInt(segundos) + 1);
            minutos = minutos;
            horas = horas;

            $("#tiempo").text(horas + ":" + minutos + ":" + segundos);
         } else
            clearInterval(cronometro);
      }, 1000);

   },

   /**
    * Creo un contador con localStorage usando:
    * getItem
    * setItem
    */
   partidas() {

      let contador = localStorage.getItem("partidas");

      contador = (contador === null) ? 0 : parseInt(contador);
      $("#record").text(contador);

      if (buscaminas.banderaGanado)
         localStorage.setItem("partidas", ++contador);
      else
         localStorage.setItem("partidas", contador);
   },

   /**
    * Obtengo filas y columnas.
    * 
    * @param {*} id 
    */
   filaColumna(id) {
      $fila = parseInt(id.prop("id").split("-")[0]);
      $columna = parseInt(id.prop("id").split("-")[1]);
   },

   /**
    * Recarga la página al perder la partida.
    */
   recargarPagina() {
      $('#reiniciar').click(function () {
         location.reload();
      });
   },
}

$(initInterfaz);
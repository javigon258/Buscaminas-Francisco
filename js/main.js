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
      buscaminasGui.recargarPagina();//Permite reiniciar juego
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
         buscaminasGui.descubrirMinas(id);
         buscaminasGui.actualizarTablero();
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

      if (buscaminas.tableroCasillaPulsada[$fila][$columna] !== "c-pulsada") {

         try {
            //Selecciono el botón derecho para marcar en el tablero
            if (event.buttons === 2) {
               buscaminas.marcar($fila, $columna);
               if (buscaminas.tableroJugable[$fila][$columna] === "🏴") {
                  $("#banderas").text(" " + buscaminas.banderas);
                  $id.css("background-color", "yellow")
                     .fadeOut("slow", "linear", function () {
                        $(this).fadeIn(700);
                     });
               } else {
                  $("#banderas").text(" " + buscaminas.banderas);
                  $id.css("background-color", "rgb(145, 57, 153)")
                     .fadeOut("fast", function () {
                        $(this).fadeIn(200);
                     });

               }
            }
         } catch (error) {
            $("span").text(error.message);
         }
      }
   },

   /**
    * Permite despejear en el tablero
    * @param {*} event 
    * @param {*} id 
    */
   despejar(event, id) {
      buscaminasGui.filaColumna(id);

      try {
         //Selecciono botón izquierdo y derecho para despejar en el tablero
         if (event.buttons === 3 || event.buttons === 4) {
            buscaminas.despejar($fila, $columna);
            buscaminasGui.actualizarTablero();
            if (buscaminas.casillaContigua.size > 0) {
               for (const coordenada of buscaminas.casillaContigua) {
                  $("#" + coordenada).css({
                     "background-color": "rgb(145, 57, 153)"
                  }).fadeOut("slow", function () {
                     $("#" + coordenada).fadeIn("slow");
                  });
               }
            }
         }
      } catch (error) {
         $("span").text(error.message);
         buscaminasGui.descubrirMinas($(""));
         buscaminasGui.actualizarTablero();
      }
   },

   /**
    * Descrubo las minas con un efecto de 
    * transición sumandole a un contador.
    */
   descubrirMinas(id) {
      //Muestro la primera casilla
      if (!buscaminas.banderaGanado) {
         id.animate({
            backgroundColor: "red",
            height: "41px",
            width: "41px"
         }, 1000);
      } else {
         id.css("background-color", "rgb(5, 121, 254)");
      }

      let contador = 0;
      $.each(buscaminas.arrayMinas, (key, value) => {
         contador+=250;
         let $id = $("#" + value.i + "-" + value.j)

         //Si gano.
         if (buscaminas.banderaGanado) {
            $id.delay(contador).fadeTo("slow", 0.9, function () {
               setInterval(function () {
                  $id.animate({
                     backgroundColor: '#32BE13',
                     height: "41px",
                     width: "41px"
                  }, 1000);
               });
               setInterval(function () {
                  $id.animate({
                     backgroundColor: '#56E537',
                  }, 1000);
               });
            });
            $("input").animate({
               color: "green"
            }, 1);

            //Si pierdo efecto.
         } else {

            $("input").prop("disabled", true); //Coloco disable a los inputs.
            $("input").prop("click", null).off("click"); //Elimino la acción
            $id.delay(contador).animate({
               backgroundColor: "red",
               height: "41px",
               width: "41px",
            }, 1500);
            $("input").animate({
               color: "red"
            }, 1);
         }
      })
      buscaminasGui.partidas(); //Si he ganado aumento el contador.
   },

   /**
    * Actualizo el tablero con un efecto de transform y 
    * duration.
    */
   actualizarTablero() {

      let contador = 0;
      for (const coordenada of buscaminas.casillaPulsada) {
         contador+= 125;
         //Split para obtener por separado el id.
         let i = coordenada.split("-")[0];
         let j = coordenada.split("-")[1];

         let $valor = $("#" + i + "-" + j)

         //Asignar los valores menos en el 0.
         if (buscaminas.tableroJugable[i][j] === 0)
            $valor.val("");
         else
            $valor.val(buscaminas.tableroJugable[i][j]);

         $valor.delay(contador).animate({
            "backgroundColor":"rgb(5, 121, 254)",
         },1);
         if(contador >= 1500)
            contador = 125;
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
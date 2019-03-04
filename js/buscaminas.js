/**
 * Juega al buscaminas y analiza en qué consiste el juego:

 * Según el nivel que elijas, tu campo de minas tiene unas dimensiones con un número de minas concreto.
 * Al iniciar todo el campo está cubierto. Se pueden realizar las siguientes acciones:
 *Si es una mina se pierde el juego. 
 *Si no lo es te indica el número de minas que hay alrededor (1, 2... 8). En caso de no haber ninguna mina alrededor, el juego despeja las casillas colindantes de forma recurrente.
 *Botón derecho: Se marca/desmarca una mina con bandera.
  * Si la casilla no tiene bandera, entonces se marca.
  * Si la casilla sí tiene bandera, entonces de desmarca.
 *Botón izquierdo y derecho: Se intenta destapar aquellas casillas de alrededor a una ya destapada-
 *Si están marcadas las minas de alrededor de forma correcta, se despejan las casillas de alrededor.
 *Si falta alguna mina por marcar, se indican las casillas mediante un parpadeo.
 *Al iniciarse el juego se pone en marcha el temporizador. En caso de superarse el récord, el juego te lo indica.
 *Al iniciarse el juego aparece un contador con las minas del campo. Conforme se marca/desmarca una mina, el contador se actualiza.
 *Aprende a jugar para implementarlo mediante JavaScript. 
 *
 *Sigue los siguientes pasos:
 *
 *Utilizando closures, créate un objeto buscaminas al que puedas invocar los siguientes métodos (el resto quedará privado):
 *buscaminas .init(): genera un campo de minas nuevo y lo muestra por consola.
 *buscaminas .mostrar(): muestra el campo de minas por consola.
 *buscaminas .picar(x, y): pica en la casilla (x, y) y muestra el campo de minas actualizado. 
 *En caso de picar una minas se indica que se ha perdido el juego. 
 *En caso de no quedar casillas por levantar se indica que se ha ganado el juego.
 *buscaminas .marcar(x, y): marca con una bandera la casilla (x, y) y muestra el campo de minas actualizado.
 *buscaminas .despejar(x, y): intenta destapar las casillas colindantes, sólo si el número de banderas se corresponden con las que indica la casilla. Entonces muestra el campo de minas actualizado.
 *En caso de estar las banderas equivocadas se indica que se ha perdido el juego.
 *Después se generará el entorno gráfico. Pero eso no entra en esta entrega.
 *Botón izquierdo del ratón: se levanta la casilla. 

 * @author Francisco Ramírez Ruiz
 * @version 1.0
 */

//Objeto literal
let buscaminasObjeto = {
    //Tableros
    tableroDescubierto: [],
    tableroDescubiertoCopia: [], //Necesario para las minas
    tableroJugable: [],
    tableroCasillaPulsada: [],

    //Valores numéricos 
    filas: 0,
    columnas: 0,
    minas: 0,
    banderas: 0,

    //Banderas
    banderaGanado: false,
    banderaFinalizar: false,

    nivel: "",
    casillaContigua: new Set(),
    casillaPulsada: new Set(),
    arrayMinas: [],

    //----------------------------------------------MÉTODOS OBLIGATORIOS------------------------------------

    /**
     * Funcionalidad del buscaminas
     * 
     * 1º método obligatorio
     */
    init() {
        buscaminas.pedirNivel();
        buscaminas.generarTableros();
        buscaminas.generaMinas();
        buscaminas.descubrirNumeros();
        buscaminas.mostrar();
    },

    /**
     * Muestra el campo de minas por consola.
     * 
     * 2º Método obligatorio
     */
    mostrar() {
        console.clear();
        //Muestro el tablero mostrando las minas para las pruebas.
        console.table(buscaminas.tableroDescubierto);
        console.log(buscaminas.arrayMinas)
    },

    /**
     * Pica en la casilla (x, y) y muestra el campo de minas actualizado. 
     * 
     * 3º Método obligatorio.
     * 
     * @param {*} x Representa las filas
     * @param {*} y Representa las columnas
     */
    picar(x, y) {
        //En caso de picar una minas se indica que se ha perdido el juego. 
        if (buscaminas.tableroDescubierto[x][y] === "x") {
            buscaminas.banderaFinalizar = true;
            throw new Error("Boooooooom!!!");
        }
        //Si se ha ganado la partida o se ha perdido return true.
        //Se acaba el juego.
        if (buscaminas.banderaGanado || buscaminas.banderaFinalizar)
            return true;

        buscaminas.descrubirCeros(x, y);
        buscaminas.tableroCasillaPulsada[x][y] = "c-pulsada";
        buscaminas.casillaPulsada.add(x + "-" + y);
        buscaminas.actualizaTablero();
        buscaminas.mostrar();
        //En caso de no quedar casillas por levantar se indica que se ha ganado el juego.
        buscaminas.compruebaVictoria();
    },

    /**
     * Marca con una bandera la casilla (x, y) y muestra el campo de minas actualizado.
     * 
     * 4º Método obligatorio.
     * 
     * @param {*} x Representa las filas
     * @param {*} y Representa las columnas
     */
    marcar(x, y) {
        //Sino hay bandera y no está descubierta, coloco bandera
        if (!buscaminas.banderaFinalizar && !buscaminas.banderaGanado && buscaminas.tableroCasillaPulsada[x][y] !== "c-pulsada" &&
            buscaminas.tableroJugable[x][y] !== "🏴") {

            //Si en el contador de banderas hay mas de 0 coloco una y elimino una al contador.
            if (buscaminas.banderas > 0) {
                buscaminas.tableroJugable[x][y] = "🏴";
                buscaminas.banderas--;
                buscaminas.mostrar();
            }
            //Si la casilla es distinto de pulsada y posee bandera, coloco el cuadro.
        } else if (buscaminas.tableroCasillaPulsada[x][y] !== "c-pulsada" &&
            buscaminas.tableroJugable[x][y] === "🏴") {
            buscaminas.tableroJugable[x][y] = "❑";
            buscaminas.banderas++;
            buscaminas.mostrar();

        }
    },

    /**
     * 5º Método obligatorio.
     * 
     * Botón izquierdo y derecho: Se intenta destapar aquellas casillas de alrededor a una ya destapada-
     * Si están marcadas las minas de alrededor de forma correcta, se despejan las casillas de alrededor.
     * Si falta alguna mina por marcar, se indican las casillas mediante un parpadeo.
     * 
     */
    despejar(x, y) {

        //Limpio el mapeado de las casillas contiguas ( papardeo )
        buscaminas.casillaContigua.clear();

        if (buscaminas.banderasCercanas(x, y) === buscaminas.tableroDescubierto[x][y]) {

            if (x > 0 && y > 0) {
                if (buscaminas.tableroJugable[x - 1][y - 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x - 1][y - 1] !== "c-pulsada")
                    buscaminas.picar(x - 1, y - 1);
            }

            if (y > 0) {
                if (buscaminas.tableroJugable[x][y - 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x][y - 1] !== "c-pulsada")
                    buscaminas.picar(x, y - 1);
            }

            if (y > 0 && x < buscaminas.filas - 1) {
                if (buscaminas.tableroJugable[x + 1][y - 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x + 1][y - 1] !== "c-pulsada")
                    buscaminas.picar(x + 1, y - 1);
            }

            if (x > 0) {
                if (buscaminas.tableroJugable[x - 1][y] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x - 1][y] !== "c-pulsada")
                    buscaminas.picar(x - 1, y);
            }

            if (x < buscaminas.filas - 1) {
                if (buscaminas.tableroJugable[x + 1][y] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x + 1][y] !== "c-pulsada")
                    buscaminas.picar(x + 1, y);
            }

            if (y < buscaminas.columnas - 1) {
                if (buscaminas.tableroJugable[x][y + 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x][y + 1] !== "c-pulsada")
                    buscaminas.picar(x, y + 1);
            }

            if (x < buscaminas.filas - 1 && y < buscaminas.columnas - 1) {
                if (buscaminas.tableroJugable[x + 1][y + 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x + 1][y + 1] !== "c-pulsada")
                    buscaminas.picar(x + 1, y + 1);
            }

            if (x > 0 && y < buscaminas.columnas - 1) {
                if (buscaminas.tableroJugable[x - 1][y + 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x - 1][y + 1] !== "c-pulsada")
                    buscaminas.picar(x - 1, y + 1);
            }
            //AÑADO AL MAP LAS CASILLAS CONTIGUAS
        } else {

            if (x > 0 && y > 0) {
                if (buscaminas.tableroJugable[x - 1][y - 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x - 1][y - 1] !== "c-pulsada")
                    buscaminas.casillaContigua.add((x - 1) + "-" + (y - 1));
            }

            if (y > 0) {
                if (buscaminas.tableroJugable[x][y - 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x][y - 1] !== "c-pulsada")
                    buscaminas.casillaContigua.add((x) + "-" + (y - 1));
            }

            if (y > 0 && x < buscaminas.filas - 1) {
                if (buscaminas.tableroJugable[x + 1][y - 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x + 1][y - 1] !== "c-pulsada")
                    buscaminas.casillaContigua.add((x + 1) + "-" + (y - 1));
            }

            if (x > 0) {
                if (buscaminas.tableroJugable[x - 1][y] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x - 1][y] !== "c-pulsada")
                    buscaminas.casillaContigua.add((x - 1) + "-" + (y));
            }

            if (x < buscaminas.filas - 1) {
                if (buscaminas.tableroJugable[x + 1][y] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x + 1][y] !== "c-pulsada")
                    buscaminas.casillaContigua.add((x + 1) + "-" + (y));
            }

            if (y < buscaminas.columnas - 1) {
                if (buscaminas.tableroJugable[x][y + 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x][y + 1] !== "c-pulsada")
                    buscaminas.casillaContigua.add((x) + "-" + (y + 1));
            }

            if (x < buscaminas.filas - 1 && y < buscaminas.columnas - 1) {
                if (buscaminas.tableroJugable[x + 1][y + 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x + 1][y + 1] !== "c-pulsada")
                    buscaminas.casillaContigua.add((x + 1) + "-" + (y + 1));
            }

            if (x > 0 && y < buscaminas.columnas - 1) {
                if (buscaminas.tableroJugable[x - 1][y + 1] !== "🏴" &&
                    buscaminas.tableroCasillaPulsada[x - 1][y + 1] !== "c-pulsada")
                    buscaminas.casillaContigua.add((x - 1) + "-" + (y + 1));
            }
        }
    },

    //------------------------------------COMPROBACIONES DE VICTORIA---------------------------------------

    /**
     * Se obtiene la cantidad de casillas pulsadas por
     * el usuario y se devuelven
     */
    casillasPulsadas() {
        let contador = 0;
        for (let i = 0; i < buscaminas.filas; i++) {
            for (let j = 0; j < buscaminas.columnas; j++) {
                if (buscaminas.tableroCasillaPulsada[i][j] === "c-pulsada") {
                    contador++;
                }

            }
        }
        return contador;
    },

    /**
     * Se obtiene la cantidad de casillas que necesita el
     * usuario para ganar y se devuelven
     */
    casillasPulsadasVictoria() {
        let contador = 0;
        for (let i = 0; i < buscaminas.filas; i++) {
            for (let j = 0; j < buscaminas.columnas; j++) {
                if (buscaminas.tableroDescubierto[i][j] !== "x")
                    contador++;
            }
        }
        return contador;
    },

    /**
     * Determina si has ganado la partida
     */
    compruebaVictoria() {
        //Capturo el mensaje de victoria en un error
        if (buscaminas.casillasPulsadas() === buscaminas.casillasPulsadasVictoria()) {
            buscaminas.banderaGanado = true;
            throw new Error("Ganador.");
        }

    },
    //--------------------------------COMUNICACIÓN CON EL USUARIO----------------------------------

    /**
     * Pide al usuario el nivel de la partida
     */
    pedirNivel(nivel) {
        switch (nivel) {
            case "medio":
                buscaminas.banderas = 40;
                buscaminas.filas = 16;
                buscaminas.columnas = 16;
                buscaminas.minas = 40;
                break;
            case "dificil":
                buscaminas.banderas = 99;
                buscaminas.filas = 16;
                buscaminas.columnas = 30;
                buscaminas.minas = 99;
                break;
            default:
                buscaminas.banderas = 10;
                buscaminas.filas = 8;
                buscaminas.columnas = 8;
                buscaminas.minas = 10;
                break;
        }
    },
    //----------------------------------GENERAR COMPONENTES BUSCAMINAS--------------------------------
    /**
     * Se generan los 4 tableros existentes:
     * tableroDescubierto[]; Se muestra el tablero con sus minas
     * tableroJugable[]; Se muestra el tablero visible al usuario (Jugable)
     * tableroDescubiertoCopia[]; Se muestra el tablero (necesario para minas)
     * tableroCasillaPulsada[]; Se muestra el tablero con las casillas pulsadas
     */
    generarTableros() {
        for (let i = 0; i < buscaminas.filas; i++) {
            buscaminas.tableroDescubierto[i] = [];
            buscaminas.tableroJugable[i] = [];
            buscaminas.tableroDescubiertoCopia[i] = [];
            buscaminas.tableroCasillaPulsada[i] = [];
            for (let j = 0; j < buscaminas.columnas; j++) {
                //Relleno de 0 todos, menos el jugable, el usuario no puede verlo
                buscaminas.tableroDescubierto[i][j] = 0;
                buscaminas.tableroJugable[i][j] = "❑";
                buscaminas.tableroDescubiertoCopia[i][j] = 0;
                buscaminas.tableroCasillaPulsada[i][j] = 0;
            }
        }
    },

    /**
     * Se generan y se seleccionan las minas de forma
     * aleatoria en el tablero
     */
    generaMinas() {
        for (let i = 0; i < buscaminas.minas; i++) {
            let fila = Math.floor(Math.random() * (buscaminas.filas - 1 - 0)) + 0;
            let columna = Math.floor(Math.random() * (buscaminas.columnas - 1 - 0)) + 0;

            while (buscaminas.tableroDescubierto[fila][columna] === "x") {
                fila = Math.floor(Math.random() * (buscaminas.filas - 1 - 0)) + 0;
                columna = Math.floor(Math.random() * (buscaminas.columnas - 1 - 0)) + 0;
            }
            buscaminas.tableroDescubierto[fila][columna] = "x";
            buscaminas.tableroDescubiertoCopia[fila][columna] = "x";
            buscaminas.arrayMinas.push({
                "i": fila,
                "j": columna
            });

        }
        //console.log(buscaminas.arrayMinas);
    },

    //------------------------------------DESCUBRIR----------------------------------------

    /**
     * Coloca los números alrededor de las minas del tablero
     * Se usa para que no se descubran mas 0 de los convenientes
     * ni respectivas minas.
     */
    descubrirNumeros() {
        // Recorro el tablero
        for (let i = 0; i < buscaminas.filas; i++) {
            for (let j = 0; j < buscaminas.columnas; j++) {
                //Si el tablero tiene una mina
                if (buscaminas.tableroDescubierto[i][j] === "x") {
                    if (i == 0 && j == 0)
                        buscaminas.cuentaMinas(i, j, i + 1, j + 1);
                    else if (i == 0 && (j > 0 && j < buscaminas.minas - 1))
                        buscaminas.cuentaMinas(i, j - 1, i + 1, j + 1);
                    else if (i == 0 && j == buscaminas.minas - 1)
                        buscaminas.cuentaMinas(i, j - 1, i + 1, j);
                    else if (j == buscaminas.minas - 1 && (i > 0 && i < buscaminas.minas - 1))
                        buscaminas.cuentaMinas(i - 1, j - 1, i + 1, j);
                    else if (i == buscaminas.minas - 1 && j == buscaminas.minas - 1)
                        buscaminas.cuentaMinas(i - 1, j - 1, i, j);
                    else if (i == buscaminas.minas - 1 && (j > 0 && j < buscaminas.minas - 1))
                        buscaminas.cuentaMinas(i - 1, j - 1, i, j + 1);
                    else if (i == buscaminas.minas - 1 && j == 0)
                        buscaminas.cuentaMinas(i - 1, j, i, j + 1);
                    else if (j == 0 && (i > 0 && i < buscaminas.minas - 1))
                        buscaminas.cuentaMinas(i - 1, j, i + 1, j + 1);
                    else
                        buscaminas.cuentaMinas(i - 1, j - 1, i + 1, j + 1);

                }
            }
        }
    },

    /**
     * Se descubren los 0, una vez pulsado uno.
     * Realizado de forma recursiva.
     * 
     * @param {*} x Representa la fila
     * @param {*} y Representa la columna
     */
    descrubirCeros(x, y) {
        if (buscaminas.tableroDescubiertoCopia[x][y] === 0) {
            buscaminas.tableroDescubiertoCopia[x][y] = -1;
            if (buscaminas.tableroDescubierto[x][y] === 0) {
                for (let j = Math.max(x - 1, 0); j <= Math.min(x + 1, buscaminas.filas - 1); j++)
                    for (let k = Math.max(y - 1, 0); k <= Math.min(y + 1, buscaminas.columnas - 1); k++) {
                        buscaminas.tableroCasillaPulsada[j][k] = "c-pulsada";
                        buscaminas.casillaPulsada.add(j + "-" + k);
                        buscaminas.descrubirCeros(j, k);
                    }
            }
        }
    },

    /**
     * Cuenta las minas necesarias
     * 
     * @param {*} inicioX Fila
     * @param {*} inicioY Columna
     * @param {*} finalX Fila
     * @param {*} finalY Columna
     */
    cuentaMinas(inicioX, inicioY, finalX, finalY) {
        for (let i = inicioX; i <= finalX; i++) {
            for (let j = inicioY; j <= finalY; j++) {
                if (buscaminas.tableroDescubierto[i][j] !== "x") {
                    if (buscaminas.tableroDescubierto[i][j] === 0) {
                        buscaminas.tableroDescubierto[i][j] = 0 + 1;
                        buscaminas.tableroDescubiertoCopia[i][j] = 0 + 1;
                    } else {
                        buscaminas.tableroDescubierto[i][j] = parseInt(buscaminas.tableroDescubierto[i][j]) + 1;
                        buscaminas.tableroDescubiertoCopia[i][j] = parseInt(buscaminas.tableroDescubierto[i][j]);
                    }
                }
            }
        }
    },
    /**
     * Devuelve las banderas
     * de las casillas que son colindantes.
     * 
     * @param {*} x fila
     * @param {*} y columna
     */
    banderasCercanas(x, y) {
        let nBanderas = 0;
        if (buscaminas.tableroCasillaPulsada[x][y] === "c-pulsada") {
            if (x > 0 && y > 0) {
                if (buscaminas.tableroJugable[x - 1][y - 1] === "🏴")
                    nBanderas++;
            }

            if (y > 0) {
                if (buscaminas.tableroJugable[x][y - 1] === "🏴")
                    nBanderas++;
            }

            if (y > 0 && x < buscaminas.filas - 1) {
                if (buscaminas.tableroJugable[x + 1][y - 1] === "🏴")
                    nBanderas++;
            }

            if (x > 0) {
                if (buscaminas.tableroJugable[x - 1][y] === "🏴")
                    nBanderas++;
            }

            if (x < buscaminas.filas - 1) {
                if (buscaminas.tableroJugable[x + 1][y] === "🏴")
                    nBanderas++;
            }

            if (y < buscaminas.columnas - 1) {
                if (buscaminas.tableroJugable[x][y + 1] === "🏴")
                    nBanderas++;
            }

            if (x < buscaminas.filas - 1 && y < buscaminas.columnas - 1) {
                if (buscaminas.tableroJugable[x + 1][y + 1] === "🏴")
                    nBanderas++;
            }

            if (x > 0 && y < buscaminas.columnas - 1) {
                if (buscaminas.tableroJugable[x - 1][y + 1] === "🏴")
                    nBanderas++;
            }
        }
        return nBanderas;
    },

    /**
     * El tablero se actualiza, llamado en picar();
     * 
     */
    actualizaTablero() {
        for (let i = 0; i < buscaminas.filas; i++) {
            for (let j = 0; j < buscaminas.columnas; j++) {
                if (buscaminas.tableroCasillaPulsada[i][j] === "c-pulsada")
                    buscaminas.tableroJugable[i][j] = buscaminas.tableroDescubierto[i][j];

            }
        }
    }
};
buscaminas = (function () {
    return buscaminasObjeto;
})();
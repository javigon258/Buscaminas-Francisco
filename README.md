# Buscaminas JQuery - Francisco Ramírez Ruiz

Proyecto desarrollado en la asignatura de cliente

https://iesgrancapitan-dwec.github.io/Buscaminas-Francisco/

## Efectos realizados con JQuery

Códigos de los efectos realizados en el proyecto, todos ellos han sido creados con JQuery

### Click (picar en el campo)

[Picar en el campo](https://github.com/Ramirez9/Ramirez9.github.io/blob/424212af200fd1d07f42cf5485e7e4efd4b1f1d7/cliente/Tema-7/BuscaminasJQuery/js/main.js#L246-L248)

```
$valor.delay(contador).animate({
"backgroundColor":"rgb(5, 121, 254)",
},1);
```

### Click derecho (marcar bandera en el campo o despejar)

[Marcar banderas](https://github.com/Ramirez9/Ramirez9.github.io/blob/424212af200fd1d07f42cf5485e7e4efd4b1f1d7/cliente/Tema-7/BuscaminasJQuery/js/main.js#L115-L128)

```
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
```

### Click con ambos botones (dar pistas con los alrededores)

[Despejar](https://github.com/Ramirez9/Ramirez9.github.io/blob/424212af200fd1d07f42cf5485e7e4efd4b1f1d7/cliente/Tema-7/BuscaminasJQuery/js/main.js#L150-L157)

```
for (const coordenada of buscaminas.casillaContigua) {
    $("#" + coordenada).css({
        "background-color": "rgb(145, 57, 153)"
    }).fadeOut("slow", function () {
        $("#" + coordenada).fadeIn("slow");
    });
}
```

### Ganar

[Ganar Partida](https://github.com/Ramirez9/Ramirez9.github.io/blob/424212af200fd1d07f42cf5485e7e4efd4b1f1d7/cliente/Tema-7/BuscaminasJQuery/js/main.js#L188-L205)

```
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
```

### Perder

[Perder partida](https://github.com/Ramirez9/Ramirez9.github.io/blob/424212af200fd1d07f42cf5485e7e4efd4b1f1d7/cliente/Tema-7/BuscaminasJQuery/js/main.js#L208-L220)

```
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
```

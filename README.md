# Tarea 3 - Grupo 9

## Descripción

Para la creación ddel algoritmo  nos basamos en uno encontrado en internet.

Para compilar el código para usarlo en WebAssembly hay que usar:

```
make emcc
```

Si se quiere compilar el programa para C se debe usar:

```
make c
```

## Ejecución

Para correr el programa se debe levantar un servidor con python de la forma:

```
python -m http.server
```

Con esto se abre el puerto 8000 con los archivos en el link: `localhost:8000/index.html`.

Dentro de la vista se ve un lugar para poner el input, el cuál debe ser el arreglo de números separados por coma.

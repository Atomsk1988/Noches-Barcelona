Noches-Barcelona (alfa)
================
App para inscripcion de listas de discotecas.

VERSION ALFA 1.0:
Funcionalidad basica sin conectividad a base de datos
Uso de componentes basicos de jquery mobile asi como navegacion basica y carga dinamica de datos.

Fecha de inicio: 01/08/2012

Librerias/frameworks usados:
-Jquery
-Jquery mobile
-Normalize(.css)

TO DO:
-Conectividad a base de datos(Versión a.1.2)(seguramente un archivo php que escupira los dos JSON)(BACKEND en proceso de creacion).
  Seria buena idea que los json llevaran un timestamp con la ultima fecha de actualizacion y que solo fueran 
  descargados si esta fuera superior a la del mobil.
  
  Los logos de las discotecas suelen ser inferiores a los 2kb, hay una manera de convertir pequeñas imagenes en strings(INDAGAR)
  
  Los flyers de las discotecas pueden ser guardados en local storage y ser eliminados despues de la fecha de la fiesta. 
  Las imagenes se pueden gzipear, no?

-Codigo de identificacion del distribuidor(Versión a.1.3): Necesitamos una manera de diferenciar en cada inscripcion a una 
fiesta, si esta fue realizada desde una app adquirida desde el market o por uno de los multiples RRPP que se 
dedicarán a distribuirla. La solucion mas mala pasa por solicitar en una configuracion inicial despues de la instalacion
un CODIGO. Aunque, seria buena idea que los RRPP pudieran distribuir sus apps con su codigo integrado y que esa 
funcionalidad fuera invisible al usuario, su uso es a nivel de empresa, por lo tanto no es necesario implicar al usuario
en ese proceso.(Se puede distribuir una app para android siendo esta gratuita sin usar el market?)

-CIERRE DE LA VERSION ALFA
  

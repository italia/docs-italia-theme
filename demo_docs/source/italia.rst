Documento di test con Docs Italia
====================================

Questo è un documento di test.

Indice dei contenuti
--------------------

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim
purus mauris. Nam vitae semper eros. Curabitur luctus nisl neque, vitae
vehicula eros consectetur eu. Curabitur orci lacus, vehicula eu lacinia
sit amet, ornare condimentum ligula. Pellentesque at nibh non purus
porttitor scelerisque vitae sed purus. Etiam enim tellus, pellentesque
at interdum eget, euismod ut nisl. Nam consectetur nunc sapien, sit amet
molestie metus malesuada nec.

Nunc varius ultrices felis, eget efficitur sapien pulvinar sed. Morbi
semper iaculis pulvinar. Donec sapien purus, commodo in aliquam quis,
ullamcorper vitae diam. Donec a nibh suscipit, semper ante non,
consectetur nunc. Phasellus non feugiat ante. Quisque nec ante eu purus
ornare dignissim. Nunc viverra, sapien ut sagittis bibendum, ante elit
eleifend nisl, vitae semper purus odio sed erat. Maecenas a orci nulla.
Mauris consectetur ligula justo, eu sagittis nisl accumsan ac. Phasellus
lacus velit, convallis vel venenatis ac, posuere quis erat. Phasellus
commodo lectus sit amet risus elementum porttitor. In pharetra est ut
eros sagittis feugiat. Cras nec suscipit odio. Duis in orci sed ante
convallis varius.

Etiam eleifend felis quis arcu finibus malesuada. Nulla cursus ex a odio
suscipit, ac cursus quam consectetur. Aenean feugiat magna ut turpis
venenatis, sed malesuada massa commodo. Nulla hendrerit in libero quis
vestibulum. Proin pulvinar tellus eu bibendum consectetur. Suspendisse
sodales ipsum sed neque commodo mollis. Nunc accumsan, odio nec
consequat elementum, nisl ex faucibus odio, a pharetra leo lacus iaculis
ante. Nulla lacinia suscipit risus, et dapibus dui mattis ac.

.. warning::
   Attenzione! Lingua sconosciuta

.. note::
   Questa è una nota

.. important::

   Questo invece è importante

.. admonition:: Nota importante

   Questa è una nota personalizzata.

.. _fig1:
.. figure:: _static/image.png
   :scale: 50

   Questa è la didascalia alla figura.


Questo testo continua dopo l'immagine :numref:`fig1`, cui fa riferimento.

.. _tab1:

.. table:: Titolo della tabella

   +--------+-----------+-----------------------+
   | numero | oggetto   | nome del protagonista |
   +========+===========+=======================+
   | 1      | mela      | Biancaneve            |
   +--------+-----------+-----------------------+
   | 2      | scarpetta | Cenerentola           |
   +--------+-----------+-----------------------+


Questa invece è una tabella, cui posso fare riferimento (vedi :numref:`Tabella %s <tab1>`).


.. tabularcolumns:: |p{1cm}|p{7cm}|

.. csv-table:: Lorem Ipsum
   :file: lorem-tab.csv
   :header-rows: 1
   :class: longtable
   :widths: 1 1



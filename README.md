# Indrapose IHM POC
## Overview
![gif](ReadmePic/overview.gif)

## objectifs

 L'objectif de cette application est de vérifier la faisabilité de passer par une app SDK pour l'IHM pour la nouvelle version d'Indrapose. L'utilisateur génère un script G-code qui sera interprété par [node-Red](https://community.boschrexroth.com/ctrlx-automation-how-tos-qmglrz33/post/how-to-use-g-code-ui-on-ctrlx-core-ViG9UrH7C4zAZuk) 
 Au final, l'idée ne sera pas gardée mais elle met en lumière comment générer des fichiers dans l'app data.
 La structure reprend l'application [Sample-Web ](https://github.com/Felix-73/CTRLX-SDK-APP-Sample-Web)

## Comment build 
- Git clone 
- ```chmod 755 -R *```
* ```./build-snap-amd64.sh``` ou ```./build-snap-arm64.sh```

## Comment debug
- ```python3 -m venv .venv```
- ```. .venv/bin/activate```
- ```pip install -r requierements.txt```
- ```cd Flask```
- ```flask run```

## Liens utiles 
[Cours sur flask Openclassrooms](https://openclassrooms.com/fr/courses/4425066-concevez-un-site-avec-flask)

[Video sur snapcraft](https://www.youtube.com/watch?v=BEp_l2oUcD8)

[Utiliser l'app data du ctrlx](https://boschrexroth.github.io/ctrlx-automation-sdk/persistdata.html#2-get-access-to-the-solutions-storage)

[Prendre une pause](https://pointerpointer.com/)


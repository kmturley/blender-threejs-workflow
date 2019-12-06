# blender-threejs-workflow

Example Blender to Three.js workflow using gltf format using:

* ThreeJS 0.110.x
* Webpack 4.41.x
* Babel 7.7.x
* Tween.js 18.4.x


## Installation

Install dependencies using:

    npm install


## Usage

Run the dev server using:

    npm start

Then view the local server at:

    http://localhost:8080


## Exporting models

Ensure you are using Blender 2.8.1 which has GLTF exporting built-in:

    https://www.blender.org/download/

Create a scene and import your model using:

    File > Import > Choose the format

Check your materials are supported by GLFT:

    Select an object > Bottom right > Material

Replace material is necessary using:

    Remove Material Slot > New > Principled BSDF > Base Color change to Image Texture

Export the file using:

    File > Export > glTF

Ensure the options are selected:

    Transform -> +Y Up
    Animations -> Always sample animations

Test your exported animation in a viewer:

    https://gltf-viewer.donmccurdy.com/


## Directory structure

    /                                 --> Project root
    /src                              --> Frontend sources files
    /src-blender                      --> Blender example project


## Contact

For more information please contact kmturley

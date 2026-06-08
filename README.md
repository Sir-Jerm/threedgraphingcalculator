# 3d Graphing Calculator 

-----------
### Website: https://sir-jerm.github.io/threedgraphingcalculator/

-----------

- Able to visualize Parametric Surfaces and Curves, Vector Fields, and Bivariate (two inputs) Functions.
- It can change Metric Functions into non-Euclidean Spaces.
- Moveable Camera with WASD and Rotations (Click and move cursor)

Bivariate Function:

<img width="597" height="515" alt="Screenshot 2026-05-29 213015" src="https://github.com/user-attachments/assets/50302187-90c8-4708-ad4f-55150ff34978" />

Parametric Surface:

<img width="556" height="662" alt="Screenshot 2026-05-29 213151" src="https://github.com/user-attachments/assets/d703decf-fdaa-4c87-af44-07f38f8ac82f" />

Vector Fields:

<img width="632" height="682" alt="Screenshot 2026-05-29 213359" src="https://github.com/user-attachments/assets/08cb0dfc-9145-4f7f-bd53-d45f698a7172" />

Custom Metric Functions:

<img width="497" height="535" alt="Screenshot 2026-06-08 172812" src="https://github.com/user-attachments/assets/f4c6e513-2c0f-4498-98f6-e82f4b007ee5" />

-----------

main/

|--js/

  |--calculator.js
  
  |--metric.js
  
  |--points.js
  
  |--lines.js
  
  |--triangles.js
  
  |--shapes.js
  
  etc
  
|--main.js

|--index.html

etc

-----------

- Changes metrics into any given the formula using (x1,y1,z1) variables and (x2,y2,z2) variables.
- Able to graph regular 3d equations put in the form x+y=z.
- Able to graph parametric surfaces you must use two variables (x and y) and put it in the form x+y,x-y,x.
- To graph parametric curves you must use one variable (t) and put in the form t,t+5,-t.
- Both parametric features use the range 0-6.28.

-----------

- Vector fields must be graphed in point form (x-y+z,y+x+z,x-z+y) and can use three variables

-----------

### Custom Rendering Pipeline

Points are projected from 3D to 2D using a manual perspective function:

- Each point is transformed using a **custom distance metric** (Euclidean or non-Euclidean)
- 3D coordinates are converted to 2D canvas pixels with a perspective scale
- Point radius decreases with distance to simulate depth
- Points are stored globally for easy updates and rendering

----------

### Desmos Examples

Desmos websites:

- For Metric Function: https://www.desmos.com/calculator/r6gg89pz9l
- For Vector Scaling: https://www.desmos.com/calculator/t4mcxzfy2i
- For Perspective Rendering: https://www.desmos.com/calculator/ajuuhjxbe8

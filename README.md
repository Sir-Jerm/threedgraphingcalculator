# 3d-graphing-calculator
- Its a 3d graphing calculator capable of wireframe or mesh renderings. 
- Additionally, this can also graph parametric surfaces, parametric curves, and vector fields.
- It can change Metric Functions into non-Euclidean Spaces.

-----------

- Changes metrics into any given the form (x1,y1,z1) and (x2,y2,z2).
- To graph its regular 3d equations put in the form x+y=z.
- To graph parametric surfaces you must use two variables (x and y) and put it in the form x+y,x-y,x.
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

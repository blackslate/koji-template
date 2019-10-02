/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/*
  global
  GameObject
  cameraMovementSpeed
*/

class MovingEntity extends GameObject {
  update = () => {
    // Move the enemy forward!
    this.body.position.y -= cameraMovementSpeed
  }
}

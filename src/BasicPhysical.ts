/* eslint-disable require-jsdoc */
// Physical version 1.4.130828
// physical is an orientation and a position
// as well as rotation and movement

// TODO change the rotation movement speeds from x,y,z to forward, backward,left,right, etc
// // really front/back up/down lateral(surely we don't want crippled things )
// // // this also requires rethinking the movement; because moveforward/backward won't cancel anymore
// TODO: scaling
// TODO: tilt
// TODO: Children
// TODO: acceleration

import AlphaQuaternion from "./Quaternion";
import AlphaRMatrix4 from "./RMatrix4";
import AlphaVector from "./Vector";
import { quaternionFromAxisAndAngle } from "./Quaternion";
import Physical from "./Physical";

// -----------------------------------
// ------------ USAGE ----------------
// -----------------------------------

// local p = Physical();

// p:setPosition(x,y,z);
// p:changePosition(x,y,z); // adds to current global position
// p:rotate( angle, x, y, z ) // rotates at its current position, using p's x,y,z axes

// glMultMatrix( p() ) // applying the above

// -----------------------------------
// --------- BETTER USAGE ------------
// -----------------------------------
// speeds only apply to functions taking an elapsed parameter

// p:SetRotationSpeeds( x, y, z ) // radians / second per second per axis
// SetRotationSpeed( speed ) // sets all axes the same
// p:setSpeeds(x,y,z) // ( movement speeds ) units / second per axis

// p:yawLeft( elapsed ) // p:yawRight( elapsed )
// p:pitchUp( elapsed ) // p:pitchDown( elapsed )
// p:rollLeft( elapsed ) // p:rollRight( elapsed )

// instantly update your global position when you call these
// p:WarpForward( distance ) // p:WarpBackward( distance )
// p:WarpLeft( distance ) // p:WarpRight( distance )
// p:WarpUp( distance ) // p:WarpDown( distance )

// velocity is applied whenever you call p:applyVelocity() or p:GetMatrix()
// velocity will adjust your current position by the velocity;
// p:SetVelocity(x,y,z);

// a simpler way to use velocity is to use these:
// it will be automatically calculated using our set speeds;

// p:moveForward( elapsed ) // p:moveBackward( elapsed )
// p:moveLeft( elapsed ) // p:moveRight( elapsed )
// p:moveUp( elapsed ) // p:moveDown( elapsed )

// XXX: for some reason I have to inverse quaterions for physical
// not for the camera. I do not understand why.

export enum PhysicalMatrixMode {
  TRANSLATE_ROTATE_SCALE,
  SCALE_ROTATE_TRANSLATE,
  ROTATE_TRANSLATE_SCALE,
}

export default class BasicPhysical implements Physical {
  modelMode: PhysicalMatrixMode;
  orientation: AlphaQuaternion;
  position: AlphaVector;
  modelMatrix: AlphaRMatrix4;
  viewMatrix: AlphaRMatrix4;
  modelDirty: boolean;
  velocity: AlphaVector;
  rotationSpeed: AlphaVector;
  speed: AlphaVector;
  scale: AlphaVector;
  parent: Physical;

  constructor(parent: Physical) {
    this.modelMode = PhysicalMatrixMode.TRANSLATE_ROTATE_SCALE;
    this.orientation = new AlphaQuaternion();
    this.position = new AlphaVector();
    this.modelMatrix = new AlphaRMatrix4();
    this.viewMatrix = new AlphaRMatrix4();
    this.modelDirty = false; // whether or not the matrix needs to be updated;
    this.velocity = new AlphaVector();
    this.rotationSpeed = new AlphaVector(1, 1, 1);
    this.speed = new AlphaVector(5, 5, 5);
    this.scale = new AlphaVector(1, 1, 1);
    this.setParent(parent);
  }

  toJSON() {
    return {
      position: this.position.toJSON(),
      orientation: this.orientation.toJSON(),
    };
  }

  setOrientation(...args: any) {
    this.orientation.set(...args);
    this.modelDirty = true;
  }

  /*
   * returns as Quaternion
   */
  getOrientation() {
    return this.orientation;
  }

  /*
   * in radians / second
   */
  setRotationSpeeds(...args: any) {
    this.rotationSpeed.set(...args);
  }

  setRotationSpeed(...args: any) {
    this.setRotationSpeeds(...args);
  }

  getRotationSpeeds() {
    return this.rotationSpeed;
  }

  rotate(angle: number, x: number, y: number, z: number) {
    // if you aren't rotating about an angle, then you aren't rotating
    if (angle == 0) {
      return;
    }
    const q = quaternionFromAxisAndAngle(x, y, z, angle);
    this.orientation.multiply(q);
    this.modelDirty = true;
  }

  rotateGlobal(angle: number, x: number, y: number, z: number) {
    // if you aren't rotating about an angle, then you aren't rotating
    if (angle == 0) {
      return;
    }
    const q = quaternionFromAxisAndAngle(x, y, z, angle);
    this.orientation.set(q.multiply(this.orientation));
    this.modelDirty = true;
  }

  /*
   * these rotations take place at the speeds set by rotationSpeed
   */
  yawLeft(elapsed: number) {
    const angle = elapsed * this.rotationSpeed[1];
    this.rotate(angle, 0, 1, 0);
  }

  yawRight(elapsed: number) {
    const angle = elapsed * this.rotationSpeed[1];
    this.rotate(-angle, 0, 1, 0);
  }

  pitchUp(elapsed: number) {
    const angle = elapsed * this.rotationSpeed[0];
    this.rotate(angle, 1, 0, 0);
  }

  pitchDown(elapsed: number) {
    const angle = elapsed * this.rotationSpeed[0];
    this.rotate(-angle, 1, 0, 0);
  }

  rollLeft(elapsed: number) {
    const angle = elapsed * this.rotationSpeed[2];
    this.rotate(angle, 0, 0, 1);
  }

  rollRight(elapsed: number) {
    const angle = elapsed * this.rotationSpeed[2];
    this.rotate(-angle, 0, 0, 1);
  }

  turn(angle: number) {
    // if you aren't rotating about an angle, then you aren't rotating
    if (angle == 0) {
      return;
    }

    const q = new AlphaQuaternion();
    q.fromAxisAndAngle(0, 1, 0, angle);
    this.setOrientation(q.multiply(this.getOrientation()));
  }

  turnLeft(elapsed: number) {
    const angle = elapsed * this.rotationSpeed[1];
    this.turn(angle);
  }

  turnRight(elapsed: number) {
    const angle = elapsed * this.rotationSpeed[1];
    this.turn(-angle);
  }

  // -------------------------------------
  // ------------ POSITION ---------------
  // -------------------------------------

  /*
   * send as x,y,z
   */
  setPosition(...args: any) {
    if (Number.isNaN(this.position[0])) {
      throw new Error("Position became NaN.");
    }
    this.position.set.call(this.position, ...args);
    this.modelDirty = true;
  }

  /*
   * return as Vector
   */
  getPosition() {
    return this.position;
  }

  changePosition(...args: any) {
    if (Number.isNaN(this.position[0])) {
      throw new Error("Position became NaN!");
    }
    this.position.add.call(this.position, ...args);
    this.modelDirty = true;
  }

  // ------------------------------------------
  // -----------  MOVEMENT --------------------
  // ------------------------------------------
  // movement is relative to the physical

  /*
   * convertes the local x,y,z vector to the global position vector
   */
  warp(...args: any) {
    let x;
    let y;
    let z;
    if (args.length > 1) {
      x = args[0];
      y = args[1];
      z = args[2];
    } else {
      x = args[0][0];
      y = args[0][1];
      z = args[0][2];
    }
    if (x == 0 && y == 0 && z == 0) {
      return;
    }

    // Quaternions don't work correctly if they aren't normalized
    this.orientation.normalize();

    // get our new position; if we started at 0,0,0
    const d = this.orientation.rotatedVector(x, y, z);

    // add it to our current position to get our new position
    // console.log("Warping vec" + d);
    this.changePosition(d);
  }

  // these movement commands MOVE the physical
  // the physical's position is updated in the call
  // use the Move commands for player-commanded movement
  warpForward(distance: number) {
    this.warp(0, 0, -distance);
  }

  warpBackward(distance: number) {
    this.warp(0, 0, distance);
  }

  warpLeft(distance: number) {
    this.warp(-distance, 0, 0);
  }

  warpRight(distance: number) {
    this.warp(distance, 0, 0);
  }

  warpUp(distance: number) {
    this.warp(0, distance, 0);
  }

  warpDown(distance: number) {
    this.warp(0, -distance, 0);
  }

  // ------------------------------------------
  // -----------  VELOCITY --------------------
  // ------------------------------------------

  // speed is in units per second
  setSpeeds(...args: any) {
    this.speed.set.call(this.speed, ...args);
  }

  getSpeeds() {
    return this.speed;
  }

  setSpeed(speed: number) {
    4;
    return this.setSpeeds(speed, speed, speed);
  }

  setVelocity(...args: any) {
    this.velocity.set.call(this.velocity, ...args);
  }

  getVelocity() {
    return this.velocity;
  }

  addVelocity(...args: any) {
    this.velocity.add.call(this.velocity, ...args);
    this.modelDirty = true;
  }

  // Move commands adjust the velocity
  // using the set speed
  moveForward(elapsed: number) {
    const distance = elapsed * this.speed[2];
    this.addVelocity(0, 0, -distance);
  }

  moveBackward(elapsed: number) {
    const distance = elapsed * this.speed[2];
    this.addVelocity(0, 0, distance);
  }

  moveLeft(elapsed: number) {
    const distance = elapsed * this.speed[0];
    this.addVelocity(-distance, 0, 0);
  }

  moveRight(elapsed: number) {
    const distance = elapsed * this.speed[0];
    this.addVelocity(distance, 0, 0);
  }

  moveUp(elapsed: number) {
    const distance = elapsed * this.speed[1];
    this.addVelocity(0, distance, 0);
  }

  moveDown(elapsed: number) {
    const distance = elapsed * this.speed[1];
    this.addVelocity(0, -distance, 0);
  }

  // calculates our new position using our current velocity
  // and then resets the velocity
  applyVelocity() {
    this.warp(this.velocity);
    this.velocity.set(0, 0, 0);
  }

  // ------------------------------------------
  // --------------  PARENTING ----------------
  // ------------------------------------------

  // in order to be a good lineage:
  // a camera must be reached
  // // therefore it must not infinitely loop
  isGoodLineageFor(prospectiveChild: Physical): boolean {
    const parent = this.getParent();

    // no parent = no lineage
    if (!parent) {
      return false;
    } else if (parent == prospectiveChild) {
      // the initator already has this physical as an ancestor
      // setting this as a parent would make an infinite loop
      return false;
      // note that we don't check self == prospectiveChild
      // that would throw an error if you tried to reparent to the same parent
      // it's assumed that if its a parent now, its still a good parent;
    }

    return parent.isGoodLineageFor(prospectiveChild);
  }

  setParent(parent: Physical) {
    if (!parent) {
      throw new Error(
        "A Physical must have a parent. set it to the camera for a default"
      );
    }

    if (!parent.isGoodLineageFor(this)) {
      throw new Error(
        "Setting this is a parent would result in a lineage that never reaches the camera"
      );
    }
    this.parent = parent;
  }

  getParent() {
    return this.parent;
  }

  // ------------------------------------------
  // -----------  MODELVIEW MATRIX ------------
  // ------------------------------------------

  setScale(...args: number[]) {
    this.scale.set(...args);
    this.modelDirty = true;
  }

  getScale() {
    return this.scale;
  }

  // combine our position and orientation into a matrix;
  getModelMatrix() {
    const x = this.velocity[0];
    const y = this.velocity[1];
    const z = this.velocity[2];
    if (x != 0 || y != 0 || z != 0) {
      this.applyVelocity();
    }

    // if w == 1 then a 4d vector is a position
    // if w == 0 then a 4d vector is a direction
    if (this.modelDirty) {
      // this.modelMatrix = rotation * translation;
      // this.modelMatrix.FromQuaternionAtVector(self.orientation, self.position);
      const m = this.modelMatrix;
      // this.modelMatrix = rotate * translate * identity
      m.identity();

      switch (this.modelMode) {
        case PhysicalMatrixMode.TRANSLATE_ROTATE_SCALE:
          m.translate(this.position);
          m.rotate(this.orientation);
          m.scale(this.scale);
          break;
        case PhysicalMatrixMode.SCALE_ROTATE_TRANSLATE:
          m.scale(this.scale);
          m.rotate(this.orientation);
          m.translate(this.position);
          break;
        case PhysicalMatrixMode.ROTATE_TRANSLATE_SCALE:
          m.rotate(this.orientation);
          m.translate(this.position);
          m.scale(this.scale);
          break;
        default:
          throw new Error(
            "Model mode must be an expected value: " + this.modelMode
          );
      }

      this.modelDirty = false;
    }

    return this.modelMatrix;
  }

  // when fully returned it looks like this
  // A -> B -> CAM -> A -> B
  // Mults as A * B * (CAM * A * B):inverse()

  // in order for this to work properly make sure that the camera's
  // getViewMatrix() is called before any physicals
  // otherwise the physical's will be outdated
  // this is to prevent having to retrace the camera's lineage more than once

  // this would be a good thing to do for any matrix that has many descendants
  // say a ship with lots of npcs / players on it

  // but this would require a proper ordering of physicals
  // which isn't feasible atm
  // physicals would need to know who is the child of who.
  // something like:
  /*
          camera:CalculateViewMatrix();
          while SomePhysicalsNotCalculated do
                  for all physicalsNotCalculated do
                          if parentPhysicalCalculated then
                                  physical:CalculateViewMatrix()
                          end
                  end
          end
  */

  // a more feasible method would be to
  // to have a bunch of children known by the physical
  // then we simply chain down the list starting at the camera;
  // this is a far better solution.
  /*
          function CalculateViewMatrices()
                  self:CalculateViewMatrix(); -- for myself
                  for each child in children do
                          child:CalculateViewMatrices() -- for my children
                  end
          end
  */
  // it starts with a simple camera:CalculateViewMatrices();
  // I will return to this.

  getViewMatrix(...args: any) {
    // if this was just called then we need to set who sent it
    let requestor;
    if (args.length == 0) {
      requestor = this;
    } else {
      requestor = args[0];
    }

    if (this.parent && this.parent != requestor) {
      this.viewMatrix = this.getModelMatrix().multiplied(
        this.parent.getViewMatrix(requestor)
      );
      return this.viewMatrix;
    } else {
      return this.getModelMatrix().inversed();
    }
  }

  getWorldPositionByViewMatrix() {
    return new AlphaRMatrix4([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      this.position[0],
      this.position[1],
      this.position[2],
      1,
    ]).multiply(this.getViewMatrix().inverse());
  }

  // legacy code; left in case I try this again
  // it does not work correctly, in all cases
  getWorldPosition(requestor: Physical): AlphaVector {
    const parent = this.parent;
    if (parent && parent != requestor) {
      const rot = parent.getWorldOrientation(requestor);
      const pos = rot.rotatedVector(this.position);
      return pos.add(parent.getWorldPosition(requestor));
    }
    return this.position;
  }

  // legacy code; left in case I try this again
  // it DOES work
  getWorldOrientation(requestor: Physical): AlphaQuaternion {
    const parent = this.parent;
    if (parent && parent != requestor) {
      return parent.getWorldOrientation(requestor).multiplied(this.orientation);
    }
    return this.orientation;
  }
}

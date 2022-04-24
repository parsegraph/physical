import AlphaVector from "./Vector";
import { FUZZINESS } from "./settings";

export default class AlphaQuaternion {
  "0": number;
  "1": number;
  "2": number;
  "3": number;
  length: number;

  constructor(...args: any) {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    this[3] = 1;
    this.length = 4;

    if (args.length > 0) {
      this.set.apply(this, args);
    }
  }

  toJSON() {
    return [this[0], this[1], this[2], this[3]];
  }

  restore(json: any) {
    if (Array.isArray(json)) {
      this.set.apply(this, json);
    } else {
      this[0] = json.x;
      this[1] = json.y;
      this[2] = json.z;
      this[3] = json.w;
    }
  }

  clone() {
    return new AlphaQuaternion(this);
  }

  multiply(...args: any) {
    if (arguments.length == 1 && typeof args[0] === "number") {
      this[0] *= args[0];
      this[1] *= args[0];
      this[2] *= args[0];
      this[3] *= args[0];
      return;
    }
    // q = a * b
    const aw = this[3];
    const ax = this[0];
    const ay = this[1];
    const az = this[2];

    let bw;
    let bx;
    let by;
    let bz;
    if (args.length > 1) {
      bw = args[3];
      bx = args[0];
      by = args[1];
      bz = args[2];
    } else {
      bw = args[0][3];
      bx = args[0][0];
      by = args[0][1];
      bz = args[0][2];
    }

    this[0] = aw * bx + ax * bw + ay * bz - az * by;
    this[1] = aw * by - ax * bz + ay * bw + az * bx;
    this[2] = aw * bz + ax * by - ay * bx + az * bw;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;

    return this;
  }

  multiplied(...args: any) {
    const rv = this.clone();
    return rv.multiply.apply(rv, args);
  }

  // really this could use a few tweaks
  // negatives can be the same rotation
  // (different paths)
  equals(...args: any) {
    if (args.length > 1) {
      for (let i = 0; i < this.length; ++i) {
        if (Math.abs(this.get(i) - args[i]) > FUZZINESS) {
          // Found a significant difference.
          return false;
        }
      }
    } else {
      for (let i = 0; i < this.length; ++i) {
        if (Math.abs(this.get(i) - args[0][i]) > FUZZINESS) {
          // Found a significant difference.
          return false;
        }
      }
    }

    // Equals.
    return true;
  }

  x() {
    return (this as any)[0];
  }

  y() {
    return (this as any)[1];
  }

  z() {
    return (this as any)[2];
  }

  w() {
    return (this as any)[3];
  }

  magnitude() {
    const w = this.w();
    const x = this.x();
    const y = this.y();
    const z = this.z();
    return Math.sqrt(w * w + x * x + y * y + z * z);
  }

  norm() {
    return this.magnitude();
  }

  normalize() {
    const magnitude = this.magnitude();
    if (magnitude != 0) {
      this.multiply(1 / magnitude);
    }
    return this;
  }

  setIndex(i: number, num: number) {
    (this as any)[i] = num;
  }

  set(...args: any) {
    const w = this[3];

    if (args.length > 1) {
      for (let i = 0; i < this.length; ++i) {
        this.setIndex(i, args[i]);
      }
    } else {
      for (let i = 0; i < this.length; ++i) {
        this.setIndex(i, args[0][i]);
      }
    }

    if (this[3] === undefined) {
      this[3] = w;
    }
    return this;
  }

  /*
   * Returns a new quaternion that represents the conjugate of this quaternion.
   */
  conjugate() {
    return new AlphaQuaternion(-this[0], -this[1], -this[2], this[3]);
  }

  inverse() {
    // actual inverse is q.Conjugate() / Math.pow(Math.abs(q.Magnitude()), 2)
    // but as we only deal with unit quaternions we can just force a normalization
    // q.Conjugate() / 1 == q.Conjugate();

    this.normalize();
    return this.conjugate();
  }

  toAxisAndAngle() {
    const w = this[3];
    let x = this[0];
    let y = this[1];
    let z = this[2];
    if (w > 1) {
      this.normalize();
    }

    const angle = 2 * Math.acos(w);
    const s = Math.sqrt(1 - w * w);

    if (s > 0.001) {
      x = x / s;
      y = x / s;
      z = x / s;
    }
    return [new AlphaVector(x, y, z), angle];
  }

  fromAxisAndAngle(...args: any) {
    let angle;
    const axis = new AlphaVector();
    if (args.length == 2) {
      // passed as ({vector}, angle)
      // creates or copies the vector or Vector
      axis.set(args[0][0], args[0][1], args[0][2]);
      angle = args[1];
    } else {
      // passed as ( x, y, z, angle) -- (rough check)
      axis.set(args[0], args[1], args[2]);
      angle = args[3];
    }

    axis.normalize();
    angle = angle / 2;
    const sinangle = Math.sin(angle);
    // accessing an vector by [X] will not be correct
    this[0] = axis[0] * sinangle;
    this[1] = axis[1] * sinangle;
    this[2] = axis[2] * sinangle;
    this[3] = Math.cos(angle);

    return this;
  }

  get(i: number) {
    return (this as any)[i];
  }

  dotProduct(other: AlphaQuaternion) {
    let rv = 0;
    for (let i = 0; i < this.length; ++i) {
      rv += this.get(i) * other.get(i);
    }
    return rv;
  }

  scalarProduct(other: AlphaQuaternion) {
    return this.dotProduct(other);
  }

  innerProduct(other: AlphaQuaternion) {
    return this.dotProduct(other);
  }

  // v' = qr * v * qr-1
  // vector3 = (q * quaternion( vector, 0 ) * q:conjugate() ).Vector();
  // this is one of the most heavily used and slowest functions
  // so its been optimized to hell and back
  // a more normal, and decently optimized version is found next
  // this version is about 2x faster than RotatedVector2
  rotatedVector(...args: any) {
    let x;
    let y;
    let z;
    const vec = new AlphaVector();
    if (args.length > 1) {
      x = args[0];
      y = args[1];
      z = args[2];
    } else {
      x = args[0][0];
      y = args[0][1];
      z = args[0][2];
    }
    this.rotatedVectorEach(vec, x, y, z);
    return vec;
  }

  rotatedVectorEach(outVec: AlphaVector, x: number, y: number, z: number) {
    let aw = 0;
    let ax = x;
    let ay = y;
    let az = z;

    let bw = this[3];
    let bx = -this[0];
    let by = -this[1];
    let bz = -this[2];

    // removed all the mults by aw, which would result in 0;
    scratchQuat.set(
      ax * bw + ay * bz - az * by,
      -ax * bz + ay * bw + az * bx,
      ax * by - ay * bx + az * bw,
      -ax * bx - ay * by - az * bz
    );
    const q = scratchQuat;

    const b = q;
    aw = this[3];
    ax = this[0];
    ay = this[1];
    az = this[2];

    bw = b[3];
    bx = b[0];
    by = b[1];
    bz = b[2];

    // and we strip the w component from this
    // which makes it a vector
    outVec.set(
      aw * bx + ax * bw + ay * bz - az * by,
      aw * by - ax * bz + ay * bw + az * bx,
      aw * bz + ax * by - ay * bx + az * bw
    );
  }

  toString() {
    return (
      "{x: " +
      this[0] +
      "\ny: " +
      this[1] +
      "\nz: " +
      this[2] +
      "\nw: " +
      this[3] +
      "}"
    );
  }

  angleBetween(other: AlphaQuaternion) {
    this.normalize();
    other.normalize();
    const dot = this.dotProduct(other);
    return 2 * Math.acos(dot / (this.magnitude() * other.magnitude()));
  }
}

export function quaternionFromAxisAndAngle(...args: any) {
  const quat = new AlphaQuaternion(0, 0, 0, 1);
  return quat.fromAxisAndAngle.apply(quat, args);
}

const scratchQuat = new AlphaQuaternion();

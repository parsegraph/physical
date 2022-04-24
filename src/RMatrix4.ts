import { FUZZINESS } from "./settings";
import AlphaQuaternion from "./Quaternion";
import AlphaVector from "./Vector";

/*
 * Constructs a Matrix.
 *
    // using quaternions for a Vector4
    let r1 = new AlphaQuaternion(this[0], this[1], this[2], this[3]);
    let r2 = new AlphaQuaternion(this[4], this[5], this[6], this[7]);
    let r3 = new AlphaQuaternion(this[8], this[9], this[10], this[11]);
    let r4 = new AlphaQuaternion(this[12], this[13], this[14], this[15]);
*/
export default class AlphaRMatrix4 {
  "0": number;
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
  "6": number;
  "7": number;
  "8": number;
  "9": number;
  "10": number;
  "11": number;
  "12": number;
  "13": number;
  "14": number;
  "15": number;
  "16": number;
  length: number;
  constructor(...args: any) {
    this.length = 16;
    if (args.length == 0) {
      this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    } else {
      this.set.apply(this, args);
    }
  }

  restore(json: any) {
    this.set.apply(this, json);
  }

  toJSON() {
    return this.toArray();
  }

  toDom(reference?: AlphaRMatrix4) {
    const tableDom = document.createElement("table");

    for (let i = 0; i < 4; ++i) {
      const rowDom = document.createElement("tr");
      tableDom.appendChild(rowDom);
      for (let j = 0; j < 4; ++j) {
        const cellDom = document.createElement("td");
        cellDom.style.padding = "3px";
        cellDom.style.textAlign = "center";

        if (reference) {
          const refValue = reference.get(4 * i + j);
          const givenValue = this.get(4 * i + j);

          if (Math.abs(givenValue - refValue) > FUZZINESS) {
            cellDom.style.color = "black";
            cellDom.style.backgroundColor = "red";
            cellDom.appendChild(
              document.createTextNode(givenValue + " (not " + refValue + ")")
            );
          } else {
            cellDom.style.backgroundColor = "green";
            cellDom.style.color = "white";
            cellDom.appendChild(document.createTextNode(this.get(4 * i + j)));
          }
        } else {
          cellDom.appendChild(document.createTextNode(this.get(4 * i + j)));
        }
        rowDom.appendChild(cellDom);
      }
    }

    return tableDom;
  }

  setIndex(i: number, val: number) {
    (this as any)[i] = val;
  }

  set(...args: any) {
    if (args.length == 1) {
      // All components passed in a single argument.
      for (let i = 0; i < this.length; ++i) {
        this.setIndex(i, args[0][i]);
      }
    } else {
      // Each component passed individually.
      for (let i = 0; i < this.length; ++i) {
        this.setIndex(i, args[i]);
      }
    }

    return this;
  }

  get(i: number) {
    return (this as any)[i];
  }

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

  clone() {
    return new AlphaRMatrix4(this);
  }

  multiply(other: AlphaRMatrix4 | number) {
    if (typeof other == "number") {
      // multiply by the scalar value.
      const s = other as number;
      return this.set(
        s * this[0],
        s * this[1],
        s * this[2],
        s * this[3],
        s * this[4],
        s * this[5],
        s * this[6],
        s * this[7],
        s * this[8],
        s * this[9],
        s * this[10],
        s * this[11],
        s * this[12],
        s * this[13],
        s * this[14],
        s * this[15]
      );
    }

    // using quaternions for a Vector4
    r1.set(this[0], this[1], this[2], this[3]);
    r2.set(this[4], this[5], this[6], this[7]);
    r3.set(this[8], this[9], this[10], this[11]);
    r4.set(this[12], this[13], this[14], this[15]);
    c1.set(other[0], other[4], other[8], other[12]);
    c2.set(other[1], other[5], other[9], other[13]);
    c3.set(other[2], other[6], other[10], other[14]);
    c4.set(other[3], other[7], other[11], other[15]);

    return this.set(
      r1.dotProduct(c1),
      r1.dotProduct(c2),
      r1.dotProduct(c3),
      r1.dotProduct(c4),
      r2.dotProduct(c1),
      r2.dotProduct(c2),
      r2.dotProduct(c3),
      r2.dotProduct(c4),
      r3.dotProduct(c1),
      r3.dotProduct(c2),
      r3.dotProduct(c3),
      r3.dotProduct(c4),
      r4.dotProduct(c1),
      r4.dotProduct(c2),
      r4.dotProduct(c3),
      r4.dotProduct(c4)
    );
  }

  transform(...args: any[]) {
    let x;
    let y;
    let z;
    let w;
    if (args.length == 1) {
      x = args[0][0];
      y = args[0][1];
      z = args[0][2];
      w = args[0][3];
    } else if (args.length === 2) {
      // Vector, w
      x = args[0][0];
      y = args[0][1];
      z = args[0][2];
      w = args[1];
    } else {
      x = args[0];
      y = args[1];
      z = args[2];
      w = args[3];
    }
    if (w === undefined) {
      // console.log("X1", this[0], x, this[0] * x);
      // console.log("X2", this[1], y, this[1] * y);
      // console.log("X3", this[2], z, this[2] * z);
      // console.log("X4", this[3]);
      // console.log("X", this[0] * x + this[1] * y + this[2] * z + this[3]);
      // console.log("Y", this[4] * x + this[5] * y + this[6] * z + this[7]);
      // console.log("Z", this[8] * x + this[9] * y + this[10] * z + this[11]);
      return new AlphaVector(
        this[0] * x + this[1] * y + this[2] * z + this[3],
        this[4] * x + this[5] * y + this[6] * z + this[7],
        this[8] * x + this[9] * y + this[10] * z + this[11]
      );
    }

    return new AlphaQuaternion(
      this[0] * x + this[1] * y + this[2] * z + this[3] * w,
      this[4] * x + this[5] * y + this[6] * z + this[7] * w,
      this[8] * x + this[9] * y + this[10] * z + this[11] * w,
      this[12] * x + this[13] * y + this[14] * z + this[15] * w
    );
  }

  multiplied(...args: any) {
    const rv = this.clone();
    return rv.multiply.apply(rv, args);
  }

  identity() {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }

  scale(...args: any) {
    // Retrieve arguments.
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

    // Create the matrix.
    const m = new AlphaRMatrix4();
    m[0] = x;
    m[5] = y;
    m[10] = z;

    // multiply in this order.
    m.multiply(this);
    this.set(m);

    return this;
  }

  translate(...args: any) {
    // Retrieve arguments.
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

    // Create the matrix.
    const m = new AlphaRMatrix4();
    m[12] = x;
    m[13] = y;
    m[14] = z;

    m.multiply(this);
    this.set(m);

    return this;
  }

  rotate(...args: any) {
    // Retrieve arguments.
    let x;
    let y;
    let z;
    let w;
    if (args.length > 1) {
      x = args[0];
      y = args[1];
      z = args[2];
      w = args[3];
    } else {
      x = args[0][0];
      y = args[0][1];
      z = args[0][2];
      w = args[0][3];
    }
    if (!w) {
      w = 0;
    }

    // Create the matrix.
    const r = alphaGetScratchMatrix();
    const x2 = x * x;
    const y2 = y * y;
    const z2 = z * z;
    const xy = x * y;
    const xz = x * z;
    const yz = y * z;
    const wx = w * x;
    const wy = w * y;
    const wz = w * z;
    r[0] = 1 - 2 * (y2 + z2);
    r[1] = 2 * (xy + wz);
    r[2] = 2 * (xz - wy);
    r[4] = 2 * (xy - wz);
    r[5] = 1 - 2 * (x2 + z2);
    r[6] = 2 * (yz + wx);
    r[8] = 2 * (xz + wy);
    r[9] = 2 * (yz - wx);
    r[10] = 1 - 2 * (x2 + y2);

    // multiply in this order.
    r.multiply(this);
    this.set(r);

    return this;
  }

  transpose() {
    return this.set(
      this[0],
      this[4],
      this[8],
      this[12],
      this[1],
      this[5],
      this[9],
      this[13],
      this[2],
      this[6],
      this[10],
      this[14],
      this[3],
      this[7],
      this[11],
      this[15]
    );
  }

  toString() {
    const line = function (a: number, b: number, c: number, d: number) {
      return [a, b, c, d].join(", ");
    };

    return (
      "[" +
      [
        line(this[0], this[1], this[2], this[3]),
        line(this[4], this[5], this[6], this[7]),
        line(this[8], this[9], this[10], this[11]),
        line(this[12], this[13], this[14], this[15]),
      ].join(",\n") +
      "]"
    );
  }

  fromEuler(...args: any) {
    // Retrieve arguments.
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

    const sx = Math.sin(x);
    const cx = Math.cos(x);
    // let sy = Math.sin(y);
    const sy = Math.cos(y);
    const sz = Math.sin(z);
    const cz = Math.cos(z);

    this.set(
      sy * cx,
      sx,
      -sy * cx,
      0,
      -sy * sx * cz + sy * sz,
      cx * cz,
      sy * sx * cz + sy * sz,
      0,
      sy * sx * sz + sy * cz,
      -cx * sz,
      -sy * sx * sz + sy * cz,
      0,
      0,
      0,
      0,
      1
    );

    return this;
  }

  fromQuaternion(...args: any) {
    // Retrieve arguments.
    let x;
    let y;
    let z;
    let w;
    if (args.length > 1) {
      x = args[0];
      y = args[1];
      z = args[2];
      w = args[3];
    } else {
      x = args[0][0];
      y = args[0][1];
      z = args[0][2];
      w = args[0][3];
    }
    if (!w) {
      w = 0;
    }

    const x2 = x * x;
    const y2 = y * y;
    const z2 = z * z;
    const xy = x * y;
    const xz = x * z;
    const yz = y * z;
    const wx = w * x;
    const wy = w * y;
    const wz = w * z;

    return this.set(
      1 - 2 * (y2 + z2),
      2 * (xy + wz),
      2 * (xz - wy),
      0,
      2 * (xy - wz),
      1 - 2 * (x2 + z2),
      2 * (yz + wx),
      0,
      2 * (xz + wy),
      2 * (yz - wx),
      1 - 2 * (x2 + y2),
      0,
      0,
      0,
      0,
      1
    );
  }

  // equivalent to rotationMatrix * translationMatrix;
  fromQuaternionAtVector(vector: AlphaVector, quat: AlphaQuaternion) {
    this.fromQuaternion(quat);
    this[12] = vector[0];
    this[13] = vector[1];
    this[14] = vector[2];

    return this;
  }

  // equivalent to
  // translationMatrix * rotationMatrix
  // the 4th value in this matrix multplication always end up as 0
  fromVectorAroundQuaternion(vector: AlphaVector, quat: AlphaQuaternion) {
    // set our 3x3 rotation matrix
    this.fromQuaternion(quat);

    // set our critical rows and columns
    const r4 = new AlphaQuaternion(vector[0], vector[1], vector[2], 1);
    const c1 = new AlphaQuaternion(this[0], this[4], this[8]);
    const c2 = new AlphaQuaternion(this[1], this[5], this[9]);
    const c3 = new AlphaQuaternion(this[2], this[6], this[10]);

    this[12] = r4.dotProduct(c1);
    this[13] = r4.dotProduct(c2);
    this[14] = r4.dotProduct(c3);
    console.log(this);

    return this;
  }

  fromVectorAroundQuaternionAtVector(
    position: AlphaVector,
    rotation: AlphaQuaternion,
    offset: any
  ) {
    // rotation * translation;
    this.fromQuaternionAtVector(offset, rotation);

    // set our critical rows and columns
    const r4 = new AlphaQuaternion(position[0], position[1], position[2], 1);
    const c1 = new AlphaQuaternion(this[0], this[4], this[8], this[12]);
    const c2 = new AlphaQuaternion(this[1], this[5], this[9], this[13]);
    const c3 = new AlphaQuaternion(this[2], this[6], this[10], this[14]);

    this[12] = r4.dotProduct(c1);
    this[13] = r4.dotProduct(c2);
    this[14] = r4.dotProduct(c3);

    return this;
  }

  inverse() {
    const inv = this.inversed();
    return this.set(inv);
  }

  inversed() {
    const inv = new AlphaRMatrix4();

    // code was lifted from MESA 3D
    inv[0] =
      this[5] * this[10] * this[15] -
      this[5] * this[11] * this[14] -
      this[9] * this[6] * this[15] +
      this[9] * this[7] * this[14] +
      this[13] * this[6] * this[11] -
      this[13] * this[7] * this[10];

    inv[4] =
      -this[4] * this[10] * this[15] +
      this[4] * this[11] * this[14] +
      this[8] * this[6] * this[15] -
      this[8] * this[7] * this[14] -
      this[12] * this[6] * this[11] +
      this[12] * this[7] * this[10];

    inv[8] =
      this[4] * this[9] * this[15] -
      this[4] * this[11] * this[13] -
      this[8] * this[5] * this[15] +
      this[8] * this[7] * this[13] +
      this[12] * this[5] * this[11] -
      this[12] * this[7] * this[9];

    inv[12] =
      -this[4] * this[9] * this[14] +
      this[4] * this[10] * this[13] +
      this[8] * this[5] * this[14] -
      this[8] * this[6] * this[13] -
      this[12] * this[5] * this[10] +
      this[12] * this[6] * this[9];

    inv[1] =
      -this[1] * this[10] * this[15] +
      this[1] * this[11] * this[14] +
      this[9] * this[2] * this[15] -
      this[9] * this[3] * this[14] -
      this[13] * this[2] * this[11] +
      this[13] * this[3] * this[10];

    inv[5] =
      this[0] * this[10] * this[15] -
      this[0] * this[11] * this[14] -
      this[8] * this[2] * this[15] +
      this[8] * this[3] * this[14] +
      this[12] * this[2] * this[11] -
      this[12] * this[3] * this[10];

    inv[9] =
      -this[0] * this[9] * this[15] +
      this[0] * this[11] * this[13] +
      this[8] * this[1] * this[15] -
      this[8] * this[3] * this[13] -
      this[12] * this[1] * this[11] +
      this[12] * this[3] * this[9];

    inv[13] =
      this[0] * this[9] * this[14] -
      this[0] * this[10] * this[13] -
      this[8] * this[1] * this[14] +
      this[8] * this[2] * this[13] +
      this[12] * this[1] * this[10] -
      this[12] * this[2] * this[9];

    inv[2] =
      this[1] * this[6] * this[15] -
      this[1] * this[7] * this[14] -
      this[5] * this[2] * this[15] +
      this[5] * this[3] * this[14] +
      this[13] * this[2] * this[7] -
      this[13] * this[3] * this[6];

    inv[6] =
      -this[0] * this[6] * this[15] +
      this[0] * this[7] * this[14] +
      this[4] * this[2] * this[15] -
      this[4] * this[3] * this[14] -
      this[12] * this[2] * this[7] +
      this[12] * this[3] * this[6];

    inv[10] =
      this[0] * this[5] * this[15] -
      this[0] * this[7] * this[13] -
      this[4] * this[1] * this[15] +
      this[4] * this[3] * this[13] +
      this[12] * this[1] * this[7] -
      this[12] * this[3] * this[5];

    inv[14] =
      -this[0] * this[5] * this[14] +
      this[0] * this[6] * this[13] +
      this[4] * this[1] * this[14] -
      this[4] * this[2] * this[13] -
      this[12] * this[1] * this[6] +
      this[12] * this[2] * this[5];

    inv[3] =
      -this[1] * this[6] * this[11] +
      this[1] * this[7] * this[10] +
      this[5] * this[2] * this[11] -
      this[5] * this[3] * this[10] -
      this[9] * this[2] * this[7] +
      this[9] * this[3] * this[6];

    inv[7] =
      this[0] * this[6] * this[11] -
      this[0] * this[7] * this[10] -
      this[4] * this[2] * this[11] +
      this[4] * this[3] * this[10] +
      this[8] * this[2] * this[7] -
      this[8] * this[3] * this[6];

    inv[11] =
      -this[0] * this[5] * this[11] +
      this[0] * this[7] * this[9] +
      this[4] * this[1] * this[11] -
      this[4] * this[3] * this[9] -
      this[8] * this[1] * this[7] +
      this[8] * this[3] * this[5];

    inv[15] =
      this[0] * this[5] * this[10] -
      this[0] * this[6] * this[9] -
      this[4] * this[1] * this[10] +
      this[4] * this[2] * this[9] +
      this[8] * this[1] * this[6] -
      this[8] * this[2] * this[5];

    let det =
      this[0] * inv[0] +
      this[1] * inv[4] +
      this[2] * inv[8] +
      this[3] * inv[12];

    if (det == 0) {
      throw new Error("Determinate in Matrix.inverse cannot be 0");
    }
    det = 1.0 / det;

    for (let i = 0; i < inv.length; ++i) {
      (inv as any)[i] = (inv as any)[i] * det;
    }

    return inv;
  }

  toArray() {
    return [
      this[0],
      this[1],
      this[2],
      this[3],
      this[4],
      this[5],
      this[6],
      this[7],
      this[8],
      this[9],
      this[10],
      this[11],
      this[12],
      this[13],
      this[14],
      this[15],
    ];
  }
}

let alphaRMatrix4Scratch: AlphaRMatrix4 = null;

export function alphaRMatrix4FromVectorAroundQuaternionAtVector(...args: any) {
  const m = new AlphaRMatrix4();
  return m.fromVectorAroundQuaternionAtVector.apply(m, args);
}

export function alphaGetScratchMatrix() {
  if (!alphaRMatrix4Scratch) {
    alphaRMatrix4Scratch = new AlphaRMatrix4();
  } else {
    alphaRMatrix4Scratch.identity();
  }
  return alphaRMatrix4Scratch;
}

export function alphaRMatrix4FromEuler(...args: any) {
  const m = new AlphaRMatrix4();
  return m.fromEuler.apply(m, args);
}

export function alphaRMatrix4FromQuaternion(...args: any) {
  const m = new AlphaRMatrix4();
  return m.fromQuaternion.apply(m, args);
}

export function alphaRMatrix4FromQuaternionAtVector(...args: any) {
  const m = new AlphaRMatrix4();
  return m.fromQuaternionAtVector.apply(m, args);
}

export function alphaRMatrix4FromVectorAroundQuaternion(...args: any) {
  const m = new AlphaRMatrix4();
  return m.fromVectorAroundQuaternion.apply(m, args);
}

const r1 = new AlphaQuaternion();
const r2 = new AlphaQuaternion();
const r3 = new AlphaQuaternion();
const r4 = new AlphaQuaternion();
const c1 = new AlphaQuaternion();
const c2 = new AlphaQuaternion();
const c3 = new AlphaQuaternion();
const c4 = new AlphaQuaternion();

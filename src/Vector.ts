import { FUZZINESS } from "./settings";

export default class AlphaVector {
  "0": number;
  "1": number;
  "2": number;
  length: number;

  constructor(...args: any) {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    this.length = 3;

    if (args.length > 0) {
      this.set.apply(this, args);
    }
  }

  toJSON() {
    return [this[0], this[1], this[2]];
  }

  restore(json: any) {
    if (Array.isArray(json)) {
      this.set.apply(this, json);
    } else {
      this[0] = json.x;
      this[1] = json.y;
      this[2] = json.z;
    }
  }

  add(...args: any) {
    if (args.length > 1) {
      this[0] += args[0];
      this[1] += args[1];
      this[2] += args[2];
    } else {
      this[0] += args[0][0];
      this[1] += args[0][1];
      this[2] += args[0][2];
    }
    return this;
  }

  added(...args: any) {
    const rv = this.clone();
    return rv.add.apply(rv, args);
  }

  clone() {
    return new AlphaVector(this);
  }

  multiply(...args: any) {
    if (args.length > 1) {
      this[0] *= args[0];
      this[1] *= args[1];
      this[2] *= args[2];
    } else if (typeof args[0] == "number") {
      this[0] *= args[0];
      this[1] *= args[0];
      this[2] *= args[0];
    } else {
      this[0] *= args[0][0];
      this[1] *= args[0][1];
      this[2] *= args[0][2];
    }
    return this;
  }

  multiplied(...args: any) {
    const rv = this.clone();
    return rv.multiply.apply(rv, args);
  }

  divide(...args: any) {
    if (args.length > 1) {
      this[0] /= args[0];
      this[1] /= args[1];
      this[2] /= args[2];
    } else if (typeof args[0] == "number") {
      this[0] /= args[0];
      this[1] /= args[0];
      this[2] /= args[0];
    } else {
      this[0] /= args[0][0];
      this[1] /= args[0][1];
      this[2] /= args[0][2];
    }
    return this;
  }

  divided(...args: any) {
    const rv = this.clone();
    return rv.divide.apply(rv, args);
  }

  get(i: number) {
    return (this as any)[i];
  }

  equals(...args: any) {
    if (args.length > 1) {
      // .Equals(x, y, z)
      for (let i = 0; i < this.length; ++i) {
        if (Math.abs(this.get(i) - args[i]) > FUZZINESS) {
          // Found a significant difference.
          return false;
        }
      }
    } else {
      // .Equals(new AlphaVector(x, y, z));
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

  setIndex(i: number, val: number) {
    (this as any)[i] = val;
  }

  set(...args: any) {
    if (args.length > 1) {
      for (let i = 0; i < this.length; ++i) {
        this.setIndex(i, args[i]);
      }
    } else {
      for (let i = 0; i < this.length; ++i) {
        this.setIndex(i, args[0][i]);
      }
    }
    if (typeof this[0] != "number") {
      throw new Error("All components must be numbers");
    }
    if (typeof this[1] != "number") {
      throw new Error("All components must be numbers");
    }
    if (typeof this[2] != "number") {
      throw new Error("All components must be numbers");
    }
    return this;
  }

  normalize() {
    const magnitude = this.magnitude();
    if (magnitude != 0) {
      this.divide(magnitude);
    }

    return this;
  }

  normalized() {
    return this.clone().normalize();
  }

  magnitude() {
    return Math.sqrt(this.dotProduct(this));
  }

  dotProduct(other: AlphaVector) {
    return this[0] * other[0] + this[1] * other[1] + this[2] * other[2];
  }

  innerProduct(other: AlphaVector) {
    return this.dotProduct(other);
  }

  scalarProduct(other: AlphaVector) {
    return this.dotProduct(other);
  }

  angleBetween(other: AlphaVector) {
    const dot = this.dotProduct(other);
    return Math.acos(dot / (this.magnitude() * other.magnitude()));
  }

  toString() {
    if (typeof this[0] != "number") {
      throw new Error("All components must be numbers");
    }
    if (typeof this[1] != "number") {
      throw new Error("All components must be numbers");
    }
    if (typeof this[2] != "number") {
      throw new Error("All components must be numbers");
    }
    return "[" + this[0] + ", " + this[1] + ", " + this[2] + "]";
  }
}

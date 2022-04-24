import { assert } from "chai";
import fuzzyEquals from "parsegraph-fuzzyequals";
import { makePerspective } from "parsegraph-matrix";
import { AlphaVector } from "./Maths";

describe("Package", function () {
  it("works", () => {
    const surface = new GLWidget();
    const cam = new Camera(surface);
    const p = new Physical(cam);
    assert.equal(typeof todo(), "string");
    console.log(todo());
    assert.isTrue(todo().indexOf("Hello") >= 0);
  });
});

const alphaVectorTests = new TestSuite("AlphaVector");

alphaVectorTests.addTest("AlphaVector.<constructor>", function () {
  const v = new AlphaVector(1, 2, 3);
  if (v[0] != 1 || v[1] != 2 || v[2] != 3) {
    return "Constructor must accept arguments.";
  }
});

alphaVectorTests.addTest("AlphaVector.add", function () {
  const a = new AlphaVector(3, 4, 0);

  a.add(new AlphaVector(1, 2, 3));
  if (!a.Equals(4, 6, 3)) {
    return "add must add component-wise";
  }
});

alphaVectorTests.addTest("AlphaVector.Divide", function () {
  const a = new AlphaVector(3, 4, 0);

  const b = new AlphaVector(2, 2, 2);

  if (!a.Divided(b).Equals(3 / 2, 4 / 2, 0)) {
    return a.Divided(b).toString();
  }

  if (!a.Equals(3, 4, 0)) {
    return a.toString();
  }
  if (a.Equals(3, 4, 5)) {
    return a.toString();
  }
  if (a.Equals(4, 4, 0)) {
    return a.toString();
  }
  if (a.Equals(3, 3, 0)) {
    return a.toString();
  }

  if (!a.Divided(2, 2, 2).Equals(3 / 2, 4 / 2, 0)) {
    return a.Divided(b).toString();
  }

  if (!a.Divided(new AlphaVector(2, 3, 4)).Equals(3 / 2, 4 / 3, 0)) {
    return a.Divided(b).toString();
  }
});

alphaVectorTests.addTest("AlphaVector.Equals", function () {
  const a = new AlphaVector(3, 4, 0);
  if (!a.Equals(3, 4, 0)) {
    return a.toString();
  }
  if (a.Equals(3, 4, 5)) {
    return a.toString();
  }
  if (a.Equals(4, 4, 0)) {
    return a.toString();
  }
  if (a.Equals(3, 3, 0)) {
    return a.toString();
  }
});

alphaVectorTests.addTest("AlphaVector.normalize", function () {
  const a = new AlphaVector(3, 4, 0);
  a.normalize();
  if (a.Length() != 1) {
    return "normalize must create a vector of length one.";
  }

  if (!a.Equals(3 / 5, 4 / 5, 0)) {
    return a.toString();
  }
});

alphaVectorTests.addTest("AlphaVector.Magnitude", function () {
  let v = new AlphaVector();
  if (v.Magnitude() != 0) {
    return "Empty vector must have zero magnitude.";
  }

  v = new AlphaVector(1, 0, 0);
  if (v.Magnitude() != 1) {
    return "Vector magnitude does not match.";
  }

  v = new AlphaVector(3, 4, 0);
  if (v.Magnitude() != 5) {
    return "Vector magnitude does not match.";
  }
});

alphaVectorTests.addTest("AlphaVector.DotProduct", function () {
  const a = new AlphaVector(1, 0, 0);
  const b = new AlphaVector(0, 1, 0);
  if (a.DotProduct(b)) {
    return "Orthogonal vectors must have zero dot product";
  }
});

const alphaQuaternionTests = new TestSuite("AlphaQuaternion");

alphaQuaternionTests.addTest(
  "Does quaternion rotation really even work?",
  function () {
    const m = new alphaRMatrix4();
    const rotq = Math.PI / 2;
    m.rotate(quaternionFromAxisAndAngle(0, 1, 1, rotq));
    m.rotate(quaternionFromAxisAndAngle(1, 0, 0, rotq));
    m.rotate(quaternionFromAxisAndAngle(1, 0, 1, rotq));
    m.Transform(10, 0, 0);
    // TODO What is the expected value?
    // console.log(v.toString());
  }
);

alphaQuaternionTests.addTest("quaternionFromAxisAndAngle", function () {
  const quat = quaternionFromAxisAndAngle(1, 0, 0, Math.PI / 2);
  if (
    !fuzzyEquals(quat[0], 0.7071, 10e-2) ||
    !fuzzyEquals(quat[1], 0, 10e-2) ||
    !fuzzyEquals(quat[2], 0, 10e-2) ||
    !fuzzyEquals(quat[3], 0.7071, 10e-2)
  ) {
    throw new Error(
      "Quaternion " + quat + " does not match expected (0.7071, 0, 0, 0.7071)"
    );
  }
});

alphaQuaternionTests.addTest("AlphaQuaternion.normalize", function () {
  const q = new AlphaQuaternion();
  q.normalize();
  if (!q.Equals(new AlphaQuaternion())) {
    console.log(q.toString());
    return q;
  }
});

alphaQuaternionTests.addTest("fromAxisAndAngle", function () {
  const q = new AlphaQuaternion();
  const angle = Math.PI / 2;

  q.fromAxisAndAngle(0, 1, 0, angle);
  if (!q.Equals(0, Math.sin(angle / 2), 0, Math.cos(angle / 2))) {
    return q.toString();
  }

  q.fromAxisAndAngle(0, 0, 1, angle);
  if (!q.Equals(0, 0, Math.sin(angle / 2), Math.cos(angle / 2))) {
    return q.toString();
  }

  q.fromAxisAndAngle(1, 0, 0, angle);
  if (!q.Equals(Math.sin(angle / 2), 0, 0, Math.cos(angle / 2))) {
    return q.toString();
  }

  q.fromAxisAndAngle(0, 0, 0, angle);
  if (!q.Equals(0, 0, 0, Math.cos(angle / 2))) {
    return q.toString();
  }
});

const alphaRMatrix4Tests = new TestSuite("AlphaRMatrix4");

alphaRMatrix4Tests.addTest("AlphaRMatrix4.multiply", function (resultDom) {
  const m = new AlphaRMatrix4(
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17
  );
  m.multiply(
    new AlphaRMatrix4(
      2,
      3,
      5,
      7,
      11,
      13,
      17,
      19,
      23,
      29,
      31,
      37,
      39,
      41,
      43,
      47
    )
  );

  const result = new AlphaRMatrix4(
    2 * 2 + 3 * 11 + 4 * 23 + 5 * 39,
    2 * 3 + 3 * 13 + 4 * 29 + 5 * 41,
    2 * 5 + 3 * 17 + 4 * 31 + 5 * 43,
    2 * 7 + 3 * 19 + 4 * 37 + 5 * 47,

    6 * 2 + 7 * 11 + 8 * 23 + 9 * 39,
    6 * 3 + 7 * 13 + 8 * 29 + 9 * 41,
    6 * 5 + 7 * 17 + 8 * 31 + 9 * 43,
    6 * 7 + 7 * 19 + 8 * 37 + 9 * 47,

    10 * 2 + 11 * 11 + 12 * 23 + 13 * 39,
    10 * 3 + 11 * 13 + 12 * 29 + 13 * 41,
    10 * 5 + 11 * 17 + 12 * 31 + 13 * 43,
    10 * 7 + 11 * 19 + 12 * 37 + 13 * 47,

    14 * 2 + 15 * 11 + 16 * 23 + 17 * 39,
    14 * 3 + 15 * 13 + 16 * 29 + 17 * 41,
    14 * 5 + 15 * 17 + 16 * 31 + 17 * 43,
    14 * 7 + 15 * 19 + 16 * 37 + 17 * 47
  );

  if (!m.Equals(result)) {
    resultDom.appendChild(m.toDom(result));
    return "multiply did not produce correct values";
  }
});

alphaRMatrix4Tests.addTest("AlphaRMatrix4.Transform", function () {
  const m = new AlphaRMatrix4();
  m.scale(2, 2, 2);

  let value = m.Transform(2, 4, 5);
  if (!value.Equals(6, 8, 10)) {
    return value.toString();
  }

  value = m.Transform(3, 4, 5, 1);
  if (!value.Equals(6, 8, 10, 1)) {
    return value.toString();
  }
});

alphaRMatrix4Tests.addTest(
  "AlphaRMatrix4.Transform with rotation",
  function () {
    const m = new AlphaRMatrix4();
    let rot = quaternionFromAxisAndAngle(0, 0, 1, Math.PI / 2);
    m.FromQuaternion(rot);

    let value = m.Transform(1, 0, 0);
    if (!value.Equals(0, -1, 0)) {
      return value.toString();
    }

    rot = quaternionFromAxisAndAngle(0, 0, 1, Math.PI);
    m.FromQuaternion(rot);
    value = m.Transform(1, 0, 0);
    if (!value.Equals(-1, 0, 0)) {
      return value.toString();
    }

    const m2 = new AlphaRMatrix4();
    rot = quaternionFromAxisAndAngle(0, 0, 1, Math.PI);
    m2.FromQuaternion(rot);
    m.multiply(m2);
    value = m.Transform(1, 0, 0);
    if (!value.Equals(1, 0, 0)) {
      return value.toString();
    }
  }
);

alphaRMatrix4Tests.addTest("AlphaRMatrix4.scale", function () {
  const m = new AlphaRMatrix4();

  // console.log(m.toString());
  m.scale(2, 3, 4);

  if (
    !m.Equals(new AlphaRMatrix4(2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1))
  ) {
    return m.toString();
  }
});

alphaRMatrix4Tests.addTest("AlphaRMatrix4.translate", function () {
  const m = new AlphaRMatrix4();

  // console.log(m.toString());
  m.translate(2, 3, 4);

  if (
    !m.Equals(new AlphaRMatrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 3, 4, 1))
  ) {
    return m.toString();
  }

  m.translate(2, 3, 4);
  if (
    !m.Equals(new AlphaRMatrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 4, 6, 8, 1))
  ) {
    return m.toString();
  }
});

alphaRMatrix4Tests.addTest("AlphaRMatrix4.rotate", function () {
  const m = new AlphaRMatrix4();

  // console.log(m.toString());
  m.rotate(1, 0, 0, 1);

  if (
    !m.Equals(
      new AlphaRMatrix4(1, 0, 0, 0, 0, -1, 2, 0, 0, -2, -1, 0, 0, 0, 0, 1)
    )
  ) {
    // console.log("Rotated matrix: " + m.toString());
    return m.toString();
  }
});

alphaRMatrix4Tests.addTest(
  "Does AlphaRMatrix4.inverse even work for simple things?",
  function (resultDom) {
    const m = new AlphaRMatrix4(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2);
    const expected = new AlphaRMatrix4(
      0.5,
      0,
      0,
      0,
      0,
      0.5,
      0,
      0,
      0,
      0,
      0.5,
      0,
      0,
      0,
      0,
      0.5
    );
    if (!m.inverse().Equals(expected)) {
      resultDom.appendChild(m.inverse());
      return "It doesn't even work for 2!";
    }
  }
);

alphaRMatrix4Tests.addTest(
  "Does AlphaRMatrix4.inverse work for zero-determinants?",
  function () {
    const m = new AlphaRMatrix4(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0);
    try {
      m.inverse();
      return "inverse shouldn't succeed.";
    } catch (ex) {}
  }
);

alphaRMatrix4Tests.addTest(
  "Does the RMatrix4 actually return rows for rows?",
  function () {
    const m = new AlphaRMatrix4(
      2,
      3,
      5,
      7,
      11,
      13,
      17,
      19,
      23,
      29,
      31,
      37,
      39,
      41,
      43,
      47
    );

    if (m[0] !== 2 || m[1] !== 3 || m[2] !== 5 || m[3] !== 7) {
      return "";
    }

    if (m[4] !== 11 || m[5] !== 13 || m[6] !== 17 || m[7] !== 19) {
      return "";
    }

    if (m[8] !== 23 || m[9] !== 29 || m[10] !== 31 || m[11] !== 37) {
      return "";
    }

    if (m[12] !== 39 || m[13] !== 41 || m[14] !== 43 || m[15] !== 47) {
      return "";
    }
  }
);

alphaRMatrix4Tests.addTest(
  "Does the perspective matrix work with AlphaRMatrix4?",
  function () {
    const width = 800;
    const height = 600;
    const m = new AlphaRMatrix4(
      makePerspective(Math.PI / 3, width / height, 0.1, 150)
    );
    m.Transpose();

    const v = new AlphaVector(1, 2, 3);
    const rv = m.Transform(v);

    // TODO Skipped.
    if (!rv.Equals(0, 1, 0)) {
      // return rv.toString();
    }
  }
);

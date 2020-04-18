// element-wise combination of 2 vectors into 1.
const zip = (v1, v2) => {
    return v1.map((_, i) => [v1[i], v2[i]]);
}

// returns an array of [s, s+1, ..., e-1]
const range = (s, e) => {
    return (new Array(e - s)).fill(0).map((_, i) => i + s);
}

// returns the sum of the given array of numbers.
const sum = (v) => {
    return v.reduce((p, c) => p + c, 0);
}

const isCreatedFrom = (obj, constructor) => {
    return obj && typeof obj == 'object' && obj.constructor === constructor;
}

const throwIfNaN = (v) => {
    if (isNaN(v)) {
        throw `Expected a number but got: ${v}`;
    }
}

// returns a memoized version of the given function f.
// Note that f is expected to have zero parameter.
const memoize = (f) => {
    var memoized_value = null;
    return () => {
        if (memoized_value == null) {
            memoized_value = f();
        }
        return memoized_value; 
    };
}

// Vector class that provides basic vector related operations.
// For sample usage, see test_Vector().
function Vector() {
    // ensure that all parameters are numbers.
    if (arguments.length == 0) {
        throw `Vector(${arguments}): expected at least 1 argument.`;
    }
    for (var i = 0; i < arguments.length; i++) {
        if (isNaN(arguments[i])) {
            throw `Vector(${arguments}): expected numbers but got: ${arguments[i]}`;
        }
    }

    const floatEquals = (a, b) => Math.abs(a - b) < 1e-16;
    const throwIfNotVector = (v) => {
        if (!isCreatedFrom(v, Vector)) {
            throw `Expected a vector but got: ${v}`;
        }
    }
    const throwIfNotSameDimension = (v) => {
        if (v.dim() != this.dim()) {
            throw `Expected vector dimension equals to ${this.dim()} but got ${v.dim()}`;
        }
    }
    const elementWiseOperation = (v1, v2, operator) => {
        return zip(v1._values, v2._values).map((z) => operator(z[0], z[1]));
    }


    this._values = [...arguments];

    this.dim = function() {
        return this._values.length;
    }

    this.toString = function() {
        return '[' + this._values + ']';
    }

    this.magnitude = function() {
        return Math.sqrt(this._values.reduce(
            (total, current) => { return total + current * current }, 0));
    }

    this.normalize = function() {
        const mag = this.magnitude();
        const new_values = this._values.map((v) => v / mag);
        return new Vector(...new_values);
    }

    this.equals = function(v) {
        throwIfNotVector(v);
        if (this.dim() != v.dim()) {
            return false;
        }
        return elementWiseOperation(this, v, floatEquals).reduce(
            (p, c) => p && c);
    }

    this.add = function(v) {
        throwIfNotVector(v);
        throwIfNotSameDimension(v);
        const new_values = elementWiseOperation(this, v, (a, b) => a + b);
        return new Vector(...new_values);
    }

    this.sub = function(v) {
        throwIfNotVector(v);
        throwIfNotSameDimension(v);
        const new_values = elementWiseOperation(this, v, (a, b) => a - b);
        return new Vector(...new_values);
    }

    this.scale = function(lambda) {
        throwIfNaN(lambda);
        const new_values = this._values.map((v) => v * lambda);
        return new Vector(...new_values);
    }

    this.dot = function(v) {
        throwIfNotVector(v);
        throwIfNotSameDimension(v);
        return sum(elementWiseOperation(this, v, (a, b) => a * b));
    }

    this.elements = () => this._values;
}
Vector.Zero = (n) => {
    const zeros = (new Array(n)).fill(0);
    return new Vector(...zeros);
};

function test_Vector(output_div_id) {
    var test_suit = new TestSuit('VectorTest', output_div_id);

    var v1 = new Vector(1, 2);
    var v2 = new Vector(1, 1);

    const vectorEquals = (v1, v2) => v1.equals(v2);

    test_suit.expectTrue('test_equals', v1.equals(v1));
    test_suit.expectFalse('test_not_equals', v1.equals(v2));
    test_suit.expectEquals('test_dim', v1.dim(), 2);
    test_suit.expectEquals('test_toString', v1.toString(), '[1,2]');
    test_suit.expectEquals('test_magnitude', v1.magnitude(), Math.sqrt(5));
    test_suit.expectTrue('test_normalize', v2.normalize(), 
        new Vector(1.0 / Math.sqrt(2), 1.0 / Math.sqrt(2)), vectorEquals);
    test_suit.expectEquals('test_add', v1.add(v2), 
        new Vector(2, 3), vectorEquals);
    test_suit.expectEquals('test_sub', v1.sub(v2), 
        new Vector(0, 1), vectorEquals);
    test_suit.expectEquals('test_scale', v1.scale(10), 
        new Vector(10, 20), vectorEquals);
    test_suit.expectEquals("test_dot_product", v1.dot(v2), 3);
    test_suit.expectEquals('test_elements', v1.elements()[0], 1);
    test_suit.expectEquals('test_zero', Vector.Zero(3), new Vector(0, 0, 0), 
        vectorEquals);
}

function Matrix() {
    // ensure the parameters passed are sane.
    if (arguments.length == 0) {
        throw `Matrix(${arguments}): expected at least 1 argument.`;
    }
    var expected_cols = 0;
    for (var i = 0; i < arguments.length; i++) {
        const row = arguments[i];
        if (!isCreatedFrom(row, Array)) {
            throw `Matrix(${arguments}): expected argument ${i} to be array but got: ${row}`;
        }
        if (i == 0) {
            expected_cols = row.length;
        } else if (row.length != expected_cols) {
            throw `Matrix(${arguments}): expected argument ${i} to have ${expected_cols} 
                but got ${row.length}`;
        }
        row.forEach((v, j) => {
            if (isNaN(v)) {
                throw `Matrix(${arguments}): expected number but got ${v} at (${i}, ${j})`;
            }
        });
    }
    const num_rows = arguments.length;
    const num_cols = expected_cols;
    const values = range(0, num_rows).map((i) => arguments[i]);
    const equalsInSize = (m) => m.rows() == num_rows && m.cols() == num_cols;
    const throwIfNotMatix = (m) => {
        if (!isCreatedFrom(m, Matrix)) {
            throw "Expected matrix but got: ${m}";
        }
    }
    const throwIfNotVector = (v) => {
        if (!isCreatedFrom(v, Vector)) {
            throw `Expected vector but got: ${v}`
        }
    }
    const throwIfNotEqualsInSize = (m) => {
        if (!equalsInSize(m)) {
            throw `Expected matrix to be of size ${num_rows} by ${num_cols}
                    but got ${m.rows()} by ${m.cols()}`;
        }
    }

    this.rowVectors = memoize(() => {
        return range(0, num_rows).map((i) => new Vector(...values[i]));
    })

    this.colVectors = memoize(() => {
        return range(0, num_cols).map((i) => {
            const col_values = range(0, num_rows).map((j) => values[j][i]);
            return new Vector(...col_values);
        });
    })

    this.rows = () => num_rows;

    this.cols = () => num_cols;

    this.equals = function(m) {
        throwIfNotMatix(m);
        if (!equalsInSize(m)) {
            return false;
        }
        var is_equal = true;
        zip(this.rowVectors(), m.rowVectors()).forEach((z) => {
            if (!z[0].equals(z[1])) {
                is_equal = false;
            }
        });
        return is_equal;
    }

    const rowWiseOperation = (m1, m2, vector_op) => {
        const new_values = zip(m1.rowVectors(), m2.rowVectors()).map((z) => {
            const s = vector_op(z[0], z[1]);
            return s._values;
        });
        return new Matrix(...new_values);
    }

    this.add = function(m) {
        throwIfNotMatix(m);
        throwIfNotEqualsInSize(m);
        return rowWiseOperation(this, m, (v1, v2) => v1.add(v2));
    }
    
    this.sub = function(m) {
        throwIfNotMatix(m);
        throwIfNotEqualsInSize(m);
        return rowWiseOperation(this, m, (v1, v2) => v1.sub(v2));
    }

    // matrix-matrix multiplication.
    this._mmul = function(m) {
        throwIfNotMatix(m);
        if (this.rows() != m.cols()) {
            throw `Cannot multiply a matrix of ${this.rows()} x ${this.cols()}
                with a matrix of ${m.rows()} x ${m.cols()}`;
        }
        const m_rows = m.rowVectors();
        const new_rows = this.rowVectors().map((r) => {
            return (r.elements().map((e, i) => m_rows[i].scale(e)).reduce(
                (p, v) => p.add(v))).elements();
        });
        return new Matrix(...new_rows);
    }

    // matrix-vector multiplication.
    this._vmul  = function(v) {
        throwIfNotVector(v);
        if (this.cols() != v.dim()) {
            throw `Cannot multiple a matrix of ${this.cols()} columns with a 
                vector of size ${v.dim()}`;
        }
        const new_values = this.rowVectors().map((mv) => mv.dot(v));
        return new Vector(...new_values);
    }

    // matrix-vector, matrix-matrix multiplication.
    this.mul = function(a) {
        if (isCreatedFrom(a, Vector)) {
            return this._vmul(a);
        }
        if (isCreatedFrom(a, Matrix)) {
            return this._mmul(a);
        }
        throw `Cannot multiplu matrix with ${a}`
    }

    this.scale = function(lambda) {
        throwIfNaN(lambda);
        const new_values = values.map((r) => (r.map((v) => v * lambda)));
        return new Matrix(...new_values);
    }

    this.transpose = function() {
        const new_values = range(0, num_cols).map((r) => {
            return range(0, num_rows).map((c) => values[c][r]); });
        return new Matrix(...new_values);
    }

    this.toString = function() {
        return '' + values.map((r) => '[' + r + ']');
    }
}
Matrix.Identity = (n) => {
    const values = range(0, n).map((i) => {
        return range(0, n).map((j) =>  i == j ? 1 : 0);
    });
    return new Matrix(...values);
}
Matrix.Rotation2D = (theta) => {
    return new Matrix(
        [Math.cos(theta), -Math.sin(theta)],
        [Math.sin(theta), Math.cos(theta)]
    );
}

function test_Matrix(output_div_id) {
    const matrixEquals = (m1, m2) => m1.equals(m2);
    const vectorEquals = (v1, v2) => v1.equals(v2);
    const test_suit = new TestSuit('MatrixTest', output_div_id);

    const m1 = new Matrix([1, 2], [3, 4]);
    const m2 = new Matrix([4, 5], [6, 7]);
    const v1 = new Vector(2, 1);

    test_suit.expectEquals('test_rows', m1.rows(), 2);
    test_suit.expectEquals('test_cols', m1.cols(), 2);
    test_suit.expectTrue('test_equals', m1.equals(m1));
    test_suit.expectFalse('test_not_equals', m1.equals(m2));
    test_suit.expectEquals('test_row_vectors_1', m1.rowVectors()[0], 
        new Vector(1, 2), vectorEquals);
    test_suit.expectEquals('test_row_vectors_2', m1.rowVectors()[1], 
        new Vector(3, 4), vectorEquals);
    test_suit.expectEquals('test_col_vectors_1', m1.colVectors()[0],
        new Vector(1, 3), vectorEquals);
    test_suit.expectEquals('test_col_vectors_1', m1.colVectors()[1],
        new Vector(2, 4), vectorEquals);
    test_suit.expectEquals('test_add', m1.add(m2), new Matrix([5, 7], [9, 11]),
        matrixEquals);
    test_suit.expectEquals('test_sub', m1.sub(m2),
        new Matrix([-3, -3], [-3, -3]), matrixEquals);
    test_suit.expectEquals('test_matrix_vector_multiplication', 
        m1.mul(v1), new Vector(4, 10), vectorEquals);
    test_suit.expectEquals('test_matrix_matrix_multiplication', 
        m1.mul(m2), new Matrix([16, 19], [36, 43]), matrixEquals);
    test_suit.expectEquals('test_identity', Matrix.Identity(3),
        new Matrix([1, 0, 0], [0, 1, 0], [0, 0, 1]), matrixEquals);
    test_suit.expectEquals('test_scalar_multiplication', 
        Matrix.Identity(3).scale(10), 
        new Matrix([10, 0, 0], [0, 10, 0], [0, 0, 10]), matrixEquals);
    test_suit.expectEquals('test_transpose', 
        (new Matrix([1, 2, 3], [4, 5, 6])).transpose(),
        new Matrix([1, 4], [2, 5], [3, 6]), matrixEquals);
    test_suit.expectEquals("test_2d_rotation", Matrix.Rotation2D(Math.PI / 2), 
        new Matrix([0, -1], [1, 0]), matrixEquals);
}


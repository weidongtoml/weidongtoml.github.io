// 2D matrix, vector operations.
var A2D = (function(){
    var vector2d_tag = 'vector2d';
    var matrix2d_tag = 'matrix2d';

    var floatEquals = function(a, b) {
        return Math.abs(a - b) < 1e-16; 
    }

    var throwIfTrue = function(predicate, value, property_name, value_name) {
        if (predicate(value)) {
            throw value_name + ' is not a ' + property_name;
        }
    };
    
    var throwIfFalse = function(predicate, value, property_name, value_name) {
        var neg_predicate = function(v) {
            return !predicate(v);
        }
        throwIfTrue(neg_predicate, value, property_name, value_name);
    };
    
    var throwIfNotVector = function(v, name) {
        throwIfFalse(isVector, v, name, '2D vector');
    };

    var throwIfNotNumber = function(v, name) {
        throwIfTrue(isNaN, v, name, 'number');
    }

    var throwIfParamsAreNotVector = function(v1, v2) {
        throwIfNotVector(v1, 'v1');
        throwIfNotVector(v2, 'v2');
    };

    var createVector = function(x, y) {
        return {
            'tag': vector2d_tag,
            'values': [x, y]
        };
    };

    var vectorX = function(v) {
        throwIfNotVector(v, 'v');
        return v.values[0];
    };

    var vectorY = function(v) {
        throwIfNotVector(v, 'v');
        return v.values[1];
    };

    var isVector = function(maybe_v) {
        return (maybe_v.hasOwnProperty('tag') 
                && maybe_v['tag'] == vector2d_tag);
    };

    var vectorEquals = function(v1, v2) {
        if (!isVector(v1) || !isVector(v2)) {
            return false;
        }
        return (floatEquals(v1.values[0], v2.values[0]) &&
            floatEquals(v1.values[1],v2.values[1]));
    };

    var vectorDot = function(v1, v2) {
        throwIfParamsAreNotVector(v1, v2);
        return v1.values[0] * v2.values[0] + v1.values[1] * v2.values[1];
    };

    var vectorScale = function(v, lambda) {
        throwIfNotVector(v, 'v');
        throwIfNotNumber(lambda, 'lambda');
        var vec = v.values;
        return createVector(
            vec[0] * lambda,
            vec[1] * lambda
        );
    }

    var vectorAdd = function(v1, v2) {
        throwIfParamsAreNotVector(v1, v2);
        var vec1 = v1.values;
        var vec2 = v2.values;
        return createVector(
            vec1[0] + vec2[0],
            vec1[1] + vec2[1],
        );
    };

    var vectorSub = function(v1, v2) {
        return vectorAdd(v1, scale(v2, -1));
    }

    var vectorMagnitude = function(v) {
        return Math.sqrt(vectorDot(v, v));
    }

    var vectorNorm = function(v) {
        throwIfNotVector(v);
        var norm = vectorMagnitude(v);
        return vectorScale(v, 1.0 / norm);
    };

    var vectorToString = function(v) {
        throwIfNotVector(v, 'v');
        return "[" + v.values + "]";
    };

    var createMatrix = function(a, b, c, d) {
        return {
            'tag': matrix2d_tag,
            'values': [[a, b], [c, d]]
        };
    };

    var isMatrix = function(maybe_m) {
        return (maybe_m.hasOwnProperty('tag') 
                && maybe_m['tag'] == matrix2d_tag);
    };

    var isIndexOutOfRange = function(idx) {
        return idx != 0 && idx != 1;
    }

    var throwIfNotMatrix = function(m, name) {
        throwIfFalse(isMatrix, m, name, '2D matrix');
    };

    var throwIfParamsAreNotMatrix = function(m1, m2) {
        throwIfNotMatrix(m1, 'm1');
        throwIfNotMatrix(m2, 'm2');
    };

    var throwIfIndexOutOfRange = function(i, name) {
        throwIfTrue(isIndexOutOfRange, i, name, ' in range');
    };

    var matrixRow = function(m, i) {
        throwIfFalse(isMatrix, m, name, '2D matrix');
        throwIfIndexOutOfRange(i, 'i');
        return createVector(m.values[i][0], m.values[i][1]);
    };

    var matrixCol = function(m, i) {
        throwIfFalse(isMatrix, m, name, '2D matrix');
        throwIfIndexOutOfRange(i, 'i');
        return createVector(m.values[0][i], m.values[1][i]);
    };

    var matrixAdd = function(m1, m2) {
        throwIfParamsAreNotMatrix(m1, m2);
        var m1_vals = m1.values;
        var m2_vals = m2.values;
        return createMatrix(
            m1_vals[0][0] + m2_vals[0][0], m1_vals[0][1] + m2_vals[0][1],
            m1_vals[1][0] + m2_vals[1][0], m1_vals[1][1] + m2_vals[1][1]
        );
    };

    var matrixScale = function(m, lambda) {
        throwIfNotMatrix(m, 'm');
        throwIfNotNumber(lambda, 'lambda');
        var vals = m.values;
        return createMatrix(
            vals[0][0] * lambda, vals[0][1] * lambda,
            vals[1][0] * lambda, vals[1][1] * lambda,
        );
    };

    var matrixSub = function(m1, m2) {
        throwIfParamsAreNotMatrix(m1, m2);
        return matrixAdd(m1, matrixScale(m2, -1));
    };

    var matrixTranspose = function(m) {
        throwIfNotMatrix(m, 'm');
        var vals = m.values;
        return createMatrix(
            vals[1][0], vals[0][0],
            vals[1][1], vals[0][1],
        );
    };

    var matrixMul = function(m1, m2) {
        throwIfParamsAreNotMatrix(m1, m2);
        return createMatrix(
            vectorDot(matrixRow(m1, 0), matrixCol(m2, 0)), 
            vectorDot(matrixRow(m1, 0), matrixCol(m2, 1)),
            vectorDot(matrixRow(m1, 1), matrixCol(m2, 0)),
            vectorDot(matrixRow(m1, 1), matrixCol(m2, 1)),
        );
    };

    var matrixInv = function(m) {
        throwIfNotMatrix(m, 'm');
        var a = m.values[0][0];
        var b = m.values[0][1];
        var c = m.values[1][0];
        var d = m.values[1][1];
        return matrixScale(createMatrix(d, -b, -c, a), 1.0 / (a*d - b*c));
    };

    var createRotationMatrix = function(theta) {
        return createMatrix(
            Math.cos(theta), -Math.sin(theta),
            Math.sin(theta), Math.cos(theta)
        );
    };

    var matrixEquals = function(m1, m2) {
        if (!isMatrix(m1) || !isMatrix(m2)) {
            return false;
        }
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                if (!floatEquals(m1.values[i][j], m2.values[i][j])) {
                    return false;
                }
            }
        }
        return true;
    };

    var matrixToString = function(m) {
        throwIfNotMatrix(m);
        return "[" + m.values[0] + ";" + m.values[1] + "]";
    };

    var add = function(a, b) {
        if (a['tag'] != b['tag']) {
            throw 'Parameters are not of the same type';
        }
        if (isVector(a)) {
            return vectorAdd(a, b);
        }
        if (isMatrix(a)) {
            return matrixAdd(a, b);
        }
        throw 'Unknown object: ', a['tag'];
    };

    var sub = function(a, b) {
        if (a['tag'] != b['tag']) {
            throw 'Parameters are not of the same type';
        }
        if (isVector(a)) {
            return vectorSub(a, b);
        }
        if (isMatrix(a)) {
            return matrixSub(a, b);
        }
        throw 'Unknown object: ', a['tag'];
    }

    var scale = function(a, lambda) {
        throwIfNotNumber(lambda);
        if (isVector(a)) {
            return vectorScale(a, lambda);
        }
        if (isMatrix(a)) {
            return matrixScale(a, lambda);
        }
    };

    var matrixVectorMul = function(m, v) {
        return createVector(
            vectorDot(matrixRow(m, 0), v),
            vectorDot(matrixRow(m, 1), v));
    };

    var mul = function(a, b) {
        if (!isMatrix(a) || (!isVector(b) && !isMatrix(b))) {
            throw "Supports only matrix-vector, or matric-matrix multiplication only.";
        }
        if (isMatrix(b)) {
            return matrixMul(a, b);
        }
        return matrixVectorMul(a, b);
    };

    var equals = function(a, b) {
        if (isMatrix(a) && isMatrix(b)) {
            return matrixEquals(a, b);
        }
        if (isVector(a) && isVector(b)) {
            return vectorEquals(a, b);
        }
        return false;
    }

    var toString = function(a) {
        if (isMatrix(a)) {
            return matrixToString(a);
        }
        if (isVector(a)) {
            return vectorToString(a);
        }
        throw "a is not a 2D vector nor matrix.";
    }

    return {
        'Vector': createVector,
        'Matrix': createMatrix,
        'RotationMatrix': createRotationMatrix,
        'dot': vectorDot,
        'add': add,
        'sub': sub,
        'scale': scale,
        'mul': mul,
        'equals': equals,
        'toString': toString,
        'row': matrixRow,
        'col': matrixCol,
        'inv': matrixInv,
        'trans': matrixTranspose,
        'x': vectorX,
        'y': vectorY,
        'I': createMatrix(1, 0, 0, 1),
        'Zero': createVector(0, 0),
        'norm': vectorNorm,
        'mag': vectorMagnitude
    };
})();

var A2D_unittest_run = function() {
    var expectEquals = function(test_name, a, b) {
        if (a == b || A2D.equals(a, b)) {
            console.log(test_name + " passed.");
            return;
        } 
        throw (test_name + " failed." + " Got " + A2D.toString(a) + 
                ", instead of " + A2D.toString(b));
    }

    var expectNotEquals = function(test_name, a, b) {
        if (a == b || A2D.equals(a, b)) {
            throw (test_name + " failed." + " Got " + A2D.toString(a) + 
                    ", instead of " + A2D.toString(b));
        }
        console.log(test_name + " passed.");
    }

    var v1 = A2D.Vector(1, 2);
    var v2 = A2D.Vector(3, 4);
    expectNotEquals("vector2D equals", v1, v2);
    expectEquals("vector2D addition", A2D.add(v1, v2), A2D.Vector(4, 6));
    expectEquals("vector2d subtraction", A2D.sub(v1, v2), A2D.Vector(-2, -2));
    expectEquals("vector2d scalar multiplication", 
        A2D.scale(v1, 10), A2D.Vector(10, 20));
    expectEquals("vector2d dot product", A2D.dot(v1, v2), 11);
    expectEquals("vetor2d x", A2D.x(v1), 1);
    expectEquals("vetor2d y", A2D.y(v1), 2);
    expectEquals('vector2d zero vector', A2D.Zero, A2D.Vector(0, 0));
    expectEquals('vector2d magnitude', A2D.mag(v1), Math.sqrt(5));
    expectEquals("vector2d norm", A2D.norm(A2D.Vector(1, 1)), 
        A2D.Vector(1.0 / Math.sqrt(2), 1.0 / Math.sqrt(2)));

    var m1 = A2D.Matrix(1, 2, 3, 4);
    var m2 = A2D.Matrix(4, 5, 6, 7);
    expectNotEquals("matrix2D equals", m1, m2);
    expectEquals("matrix2D addition", A2D.add(m1, m2), A2D.Matrix(5, 7, 9, 11));
    expectEquals("matrix2D subtraction", A2D.sub(m1, m2), 
        A2D.Matrix(-3, -3, -3, -3));
    expectEquals("matrix2D scalar multiplication", A2D.scale(m1, 10),
        A2D.Matrix(10, 20, 30, 40));
    expectEquals("matrix2D row 0 access", A2D.row(m1, 0), A2D.Vector(1, 2));
    expectEquals("matrix2D row 1 access", A2D.row(m1, 1), A2D.Vector(3, 4));
    expectEquals("matrix2D col 0 access", A2D.col(m1, 0), A2D.Vector(1, 3));
    expectEquals("matrix2D col 1 access", A2D.col(m1, 1), A2D.Vector(2, 4));
    expectEquals("matrix2D multiplication", A2D.mul(m1, m2),
        A2D.Matrix(16, 19, 36, 43));
    expectEquals("matrix2D vector2D multiplication", A2D.mul(m1, v1),
        A2D.Vector(5, 11));
    expectEquals("matrix2D inverse", A2D.mul(m1, A2D.inv(m1)), A2D.I);
    expectEquals("matrix2D transpose", A2D.trans(m1), A2D.Matrix(3, 1, 4, 2));
    expectEquals("matrix2D rotation", A2D.RotationMatrix(Math.PI / 2), 
        A2D.Matrix(0, -1, 1, 0));
};

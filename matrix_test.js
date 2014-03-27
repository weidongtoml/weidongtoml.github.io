/**
 * matrix_test.js: unit tests for Matrix object
 */
test( "Matrix Creation", function() {
	var null_matrix = new Matrix(3, 4);
	equal(null_matrix.getRows(), 3);
	equal(null_matrix.getCols(), 4);
	for (var i = 0; i < 3; ++i) {
		for (var j = 0; j < 4; ++j) {
			equal(null_matrix.getVal(i,j), 0.0);
		}
	}
	
	var diagonal_matrix = new Matrix(2, 2, [[1,0],[0,2]]);
	equal(diagonal_matrix.getVal(0, 1), diagonal_matrix.getVal(1, 0));
	equal(diagonal_matrix.getVal(0, 0), 1);
	equal(diagonal_matrix.getVal(1, 1), 2);
	
	var identity_matrix = Matrix.Identity(4);
	for (var i = 0; i < 4; ++i) {
		for (var j = 0; j < 4; ++j) {
			if (i === j) {
				equal(identity_matrix.getVal(i, j), 1);
			} else {
				equal(identity_matrix.getVal(i, j), 0);
			}
		}
	}
	
	var zero_matrix = Matrix.Zero(5);
	for (var i = 0; i < 5; ++i) {
		for (var j = 0; j < 5; ++j) {
			equal(zero_matrix.getVal(i, j), 0);
		}
	}
	throws(function() {
		new Matrix(10, -1);
	}, "Invalid dimension");
});

test( "Matrix Clone", function() {
	var a_matrix = new Matrix(3, 3, [[1,0,1],[0,1,0],[2,2,2]]);
	var a_matrix_clone = a_matrix.getClone();
	notEqual(a_matrix, a_matrix_clone);
	deepEqual(a_matrix, a_matrix_clone);
});

test( "Matrix Addition", function() {
	var matrix_a = new Matrix(3, 3, [[1, 1, 1], [2, 2, 2], [3, 3, 3]]);
	var matrix_b = new Matrix(3, 3, [[0, 1, 0], [0, 2, 0], [0, 3, 0]]);
	var matrix_sum = new Matrix(3, 3, [[1, 2, 1], [2, 4, 2], [3, 6, 3]]);
	var matrix_a_clone = matrix_a.getClone();
	//destructive add
	matrix_a.add(matrix_b);
	deepEqual(matrix_a, matrix_sum);
	notDeepEqual(matrix_a, matrix_a_clone);
	
	var null_matrix = Matrix.Zero(3);
	matrix_a.add(null_matrix);
	deepEqual(matrix_a, matrix_sum);
	
	//Not destructive add
	var old_a_clone = matrix_a_clone.getClone();
	var sum = Matrix.add(matrix_a_clone, matrix_b);
	deepEqual(sum, matrix_sum);
	deepEqual(old_a_clone, matrix_a_clone);
	
	//Incompetable matrix
	throws( function() {
		Matrix.add(matrix_a, Matrix.Identity(4));
	}, "Incompetable matrix addition");
});

test( "Matrix Subtraction", function() {
	var matrix_a = new Matrix(3, 3, [[1, 1, 1], [2, 2, 2], [3, 3, 3]]);
	var matrix_b = new Matrix(3, 3, [[0, 1, 0], [0, 2, 0], [0, 3, 0]]);
	var matrix_diff = new Matrix(3, 3, [[1, 0, 1], [2, 0, 2], [3, 0, 3]]);
	var matrix_a_clone = matrix_a.getClone();
	//Destructive subtract
	matrix_a.subtract(matrix_b);
	deepEqual(matrix_a, matrix_diff);
	notDeepEqual(matrix_a, matrix_a_clone);
	
	var null_matrix = Matrix.Zero(3);
	matrix_a.subtract(null_matrix);
	deepEqual(matrix_a, matrix_diff);
	
	//Non-destructive subtract
	var old_a_clone = matrix_a_clone.getClone();
	var diff = Matrix.subtract(matrix_a_clone, matrix_b);
	deepEqual(diff, matrix_diff);
	deepEqual(old_a_clone, matrix_a_clone);
	
	//Incompetable matrix
	throws( function() {
		Matrix.subtract(matrix_a, Matrix.Identity(4));
	}, "Incompetable matrix subtraction");
});

test( "Matrix Scalar Multiply", function() {
	var matrix_a = new Matrix(3, 3, [[1, 1, 1], [2, 2, 2], [3, 3, 3]]);
	var scalar = -2;
	var matrix_b = new Matrix(3, 3, [[-2, -2, -2], [-4, -4, -4], [-6, -6, -6]]);
	matrix_a.scalarMultiply(scalar);
	deepEqual(matrix_a, matrix_b);
	
	var null_matrix = Matrix.Zero(3);
	matrix_a.scalarMultiply(0);
	deepEqual(matrix_a, null_matrix);
});

test( "Matrix Mutiplication", function() {
	var matrix_a = new Matrix(2, 3, [[1, 2, 3], [4, 5, 6]]);
	var matrix_b = new Matrix(3, 2, [[1, 2], [1, 2], [1, 2]]);
	var matrix_product = new Matrix(2, 2, [[6, 12],[15, 30]]);
	matrix_a.multiply(matrix_b);
	deepEqual(matrix_a, matrix_product);
	
	var identity = Matrix.Identity(2);
	matrix_a.multiply(identity);
	deepEqual(matrix_a, matrix_product);
	
	var null_matrix = Matrix.Zero(2);
	matrix_a.multiply(null_matrix);
	deepEqual(matrix_a, null_matrix);
	
	//Incompetable matrix
	throws( function() {
		Matrix.multiply(matrix_a, Matrix.Identity(4));
	}, "Incompetable matrix multiplication");
});

test ( "Matrix Transponse", function() {
	var matrix_a = new Matrix(2, 3, [[1, 2, 3], [4, 5, 6]]);
	var matrix_a_t = new Matrix(3, 2, [[1, 4], [2, 5], [3, 6]]);
	matrix_a.transpose();
	deepEqual(matrix_a, matrix_a_t);
	
	var identity_matrix = Matrix.Identity(3);
	identity_matrix.transpose();
	deepEqual(identity_matrix, Matrix.Identity(3));
});

test ( "Matrix Trace", function() {
	var matrix_a = new Matrix(3, 3, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
	equal(Matrix.trace(matrix_a), 15);
	
	var matrix_b = new Matrix(2, 3, [[1, 2, 3], [4, 5, 6]]);
	equal(Matrix.trace(matrix_b), 6);
	
	var matrix_c = new Matrix(3, 2, [[1, 2], [3, 4], [5, 6]]);
	equal(Matrix.trace(matrix_c), 5);
	
	equal(Matrix.trace(Matrix.Identity(6)), 6);
	equal(Matrix.trace(Matrix.Zero(10)), 0);
});

test ( "Matrix norms", function() {
	var matrix_a = new Matrix(3, 3, 
		[[3, 5, 7],
		 [2, 6, 4],
		 [0, 2, 8]]);
	equal(Matrix.norm(matrix_a, Infinity), 15);
	equal(Matrix.norm(matrix_a, 1), 19);
	equal(Matrix.norm(matrix_a, 2), 14.38749456993816);
});

test( "Matrix LUP Decomposition", function() {
	var matrix_a = new Matrix(4, 4, 
		[[ 2,  0,   2, 0.6],
		 [ 3,  3,   4,  -2], 
		 [ 5,  5,   4,   2],
		 [-1, -2, 3.4,  -1]]);
	var matrix_l = new Matrix(4, 4,
		[[   1,   0,   0,  0],
		 [ 0.4,   1,   0,  0],
		 [-0.2, 0.5,   1,  0],
		 [ 0.6,   0, 0.4,  1]]);
	var matrix_u = new Matrix(4, 4,
	    [[ 5,   5,   4,    2],
		 [ 0,  -2, 0.4, -0.2],
		 [ 0,   0,   4, -0.5],
		 [ 0,   0,   0,   -3]]);
	var matrix_p = new Matrix(4, 4,
		[[ 0, 0, 1, 0],
		 [ 1, 0, 0, 0],
		 [ 0, 0, 0, 1],
		 [ 0, 1, 0, 0]]);
	var result = Matrix.LUPDecomposition(matrix_a);
	ok (Matrix.subtract(result.L, matrix_l).norm(2) < 0.00001);
	ok (Matrix.subtract(result.U, matrix_u).norm(2) < 0.00001);
	deepEqual(result.P, matrix_p);
});

test( "Matrix Append Column", function() {
	var a = (new Matrix(1, 3, [[1, 2, 3]])).transpose();
	var b = (new Matrix(1, 3, [[4, 5, 6]])).transpose();
	var ab = new Matrix(3, 2, [[1, 4], [2, 5], [3, 6]]);
	var bab = new Matrix(3, 3, [[4, 1, 4], [5, 2, 5], [6, 3, 6]]);
	
	a.appendColumn(b);
	deepEqual(a, ab);
	
	b.appendColumn(a);
	deepEqual(b, bab);
	
});

test( "Matrix LUP Solve", function() {
	var L = new Matrix(3, 3, 
		[[  1,   0,   0],
		 [0.2,   1,   0],
		 [0.6, 0.5,   1]]);
	var U = new Matrix(3, 3,
		[[  5,   6,    3],
		 [  0, 0.8, -0.6],
		 [  0,   0,  2.5]]);
	var P = new Matrix(3, 3, 
		[[0, 0, 1],
		 [1, 0, 0],
		 [0, 1, 0]]);
	var b = (new Matrix(1, 3, [[3, 7, 8]])).transpose();
	var x = (new Matrix(1, 3, [[-1.4, 2.2, 0.6]])).transpose();
	
	var result = Matrix.LUPSolve(L, U, P, b);
	ok(Matrix.subtract(result, x).norm(2) < 0.00001);
});

test( "Matrix Inverse", function() {
	var a = new Matrix(3, 3, 
		[[4, 1, 1],
		 [2, 1, -1],
		 [1, 1, 1]]);
	var a_inverse = (new Matrix(3, 3,
		[[ 2,  0, -2],
		 [-3,  3,  6],
		 [ 1, -3,  2]])).scalarMultiply(1.0/6);
	var result = Matrix.inverse(a);
	ok(Matrix.subtract(result, a_inverse).norm(2) < 0.000001)
	
	var b = new Matrix(3, 3,
		[[4, -5, 6],
		 [8, -6, 7],
		 [12, -7, 12]]);
	var b_inverse = (new Matrix(3, 3, 
		[[-23,  18,  1],
		 [-12, -24, 20],
		 [ 16, -32, 16]])).scalarMultiply(1.0/64);
	var b_inv = Matrix.inverse(b);
	ok (Matrix.subtract(b_inv, b_inverse).norm(2) < 0.00001);
	
	//Incompetable matrix
	throws( function() {
		Matrix.Inverse(new Matrix(3, 4));
	}, "Incompetable matrix inversion");
	//Non-invertible matrix
	throws( function() {
		Matrix.Inverse(new Matrix(3, 3));
	}, "Non-invertible matrix");
});
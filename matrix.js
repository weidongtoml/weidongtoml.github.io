/**
 * Matrix - A JavaScript Implementation of common Matrix operations
 *
 * Copyright 2013 Weidong Liang
 * Released under the MIT license.
 */
var Matrix = function(n_rows, n_cols, matrix) {
	if (n_rows < 0 || n_cols < 0) {
		throw new Error("Matrix Creation Error, invalid dimension [" + n_cols + "," + n_rows + "]");
	}
	this.rows = n_rows;
	this.cols = n_cols;
	this.matrix = [];
	for (var i = 0; i < n_rows; ++i) {
		this.matrix[i] = [];
		for (var j = 0; j < n_cols; ++j) {
			if (typeof matrix !== 'undefined') {
				this.matrix[i][j] = matrix[i][j];
			} else {
				this.matrix[i][j] = 0.0;
			}
		}
	}
	return this;
};

Matrix.Identity = function(size) {
	var identity = new Matrix(size, size);
	for (var i = 0; i < size; ++i) {
		identity.matrix[i][i] = 1;
	}
	return identity;
};

Matrix.Zero = function(size) {
	return new Matrix(size, size);
};

Matrix.prototype.toString = function() {
	var str = '';
	str += "[";
	for (var i = 0; i < this.rows; ++i) {
		str += " ["
		for (var j = 0; j < this.cols; ++j) {
			str += this.matrix[i][j] + " ";
		}
		str += "]\n"
	}
	str += "]";
	return str;
};

Matrix.prototype.isSquare = function() {
	return this.rows === this.cols;
};

Matrix.prototype.getClone = function() {
	return new Matrix(this.rows, this.cols, this.matrix);
};

Matrix.prototype.getRows = function() {
	return this.rows;
};

Matrix.prototype.getCols = function() {
	return this.cols;
};

Matrix.prototype.getVal = function(row, col) {
	if (row > this.rows || col > this.col) {
		throw new Error("Matrix access error, matrix is " + this.rows + " by " + this.cols + ", "+
			"but attempt to access [" + row + "," + col +"]");
	}
	return this.matrix[row][col];
};

Matrix.prototype.applyToElement = function(operation, operand) {
	for (var i = 0; i < this.rows; ++i) {
		for (var j = 0; j < this.cols; ++j) {
			this.matrix[i][j] = operation(this.matrix, i, j, operand);
		}
	}
	return this;
};

Matrix.prototype.isSameDimension = function(matrix) {
	return this.rows == matrix.rows && this.cols == matrix.cols;
};

Matrix.prototype.add = function(matrix) {
	if (!this.isSameDimension(matrix)) {
		throw new Error("Matrix addition error, expected " + this.rows + " by " + this.cols + 
		" matrix but got: " + matrix.rows + " by " + matrix.cols);
	}
	return this.applyToElement(function(matrix_a, i, j, matrix_b){
		return matrix_a[i][j] + matrix_b[i][j];
		}, matrix.matrix);
};

Matrix.prototype.subtract = function(matrix) {
	if (!this.isSameDimension(matrix)) {
		throw new Error("Matrix subtraction error, expected " + this.rows + " by " + this.cols + 
		" matrix but got: " + matrix.rows + " by " + matrix.cols);
	}
	return this.applyToElement(function(matrix_a, i, j, matrix_b){
		return matrix_a[i][j] - matrix_b[i][j];
		}, matrix.matrix);
};

Matrix.prototype.scalarMultiply = function(scalar) {
	return this.applyToElement(function(a, i, j, b) {
		return a[i][j] * b;
	}, scalar);
	return this;
};

Matrix.prototype.multiply = function(matrix) {
	if (this.cols != matrix.rows) {
		throw new Error("Matrix multiplication error, expected operand matrix to have " + this.cols + " rows, "+
			"but got " + matrix.rows + " instead");
	}
	var result = new Matrix(this.rows, matrix.cols);
	for (var i = 0; i < this.rows; ++i) {
		for (var j = 0; j < matrix.cols; ++j) {
			for (var k = 0; k < this.cols; ++k) {
				result.matrix[i][j] += this.matrix[i][k]* matrix.matrix[k][j];
			}
		}
	}
	this.matrix = result.matrix;
	this.rows = result.rows;
	this.cols = result.cols;
	return this;
};

Matrix.prototype.transpose = function() {
	var r = this.rows;
	var c = this.cols;
	var m = [];
	for (var j = 0; j < c; ++j) {
		m[j] = [];
		for (var i = 0; i < r; ++i) {
			m[j][i] = this.matrix[i][j];
		}
	}
	this.rows = c;
	this.cols = r;
	this.matrix = m;
	return this;
};

Matrix.prototype.appendColumn = function(matrix) {
	if (matrix.rows !== this.rows) {
		throw new Error("Matrix appendColumn: incompetible matrix parameter");
	}
	for (var r = 0; r < this.rows; ++r) {
		for (var c = 0, n = this.cols; c < matrix.cols; ++c, ++n) {			
			this.matrix[r][n] = matrix.matrix[r][c];
		}
	}
	this.cols += matrix.cols;
	return this;
}

Matrix.trace = function(matrix) {
	var n = Math.min(matrix.rows, matrix.cols);
	var trace = 0;
	for (var i = 0; i < n; ++i) {
		trace += matrix.matrix[i][i];
	}
	return trace;
};

Matrix.norm = function(matrix, level) {
	var norm = 0;
	switch (level) {
		case Infinity:
			//maximum absolute row sum
			for (var r = 0; r < matrix.rows; ++r) {
				var abs_row_sum = 0;
				for (var c = 0; c < matrix.cols; ++c) {
					abs_row_sum += Math.abs(matrix.matrix[r][c]);
				}
				norm = Math.max(norm, abs_row_sum);
			}
		break;
		case 1:
			//maximum absolute col sum
			for (var c = 0; c < matrix.cols; ++c) {
				var abs_col_sum = 0;
				for (var r = 0; r < matrix.rows; ++r) {
					abs_col_sum += Math.abs(matrix.matrix[r][c]);
				}
				norm = Math.max(norm, abs_col_sum);
			}
		break;
		case 2:
			var s = 0;
			for (var r = 0; r < matrix.rows; ++r) {
				for (var c = 0; c < matrix.cols; ++c) {
					s += Math.pow(matrix.matrix[r][c],2);
				}
			}
			norm = Math.sqrt(s);
		break;
		default:
			throw new Error("Matrix " + level + " level Norm not implemented.");
		break;
	};
	return norm;
};

Matrix.prototype.inverse = function() {
	//To find the inverse of A, solve for AX = I
	//we can break down I as (e0, e1, .., eN) and X as (x0, x1, .., xN) column vectors
	//then solve for Ax_i = e_i
	var LUP = Matrix.LUPDecomposition(this);
	var inverse = null;
	var n = this.rows;
	for (var i = 0; i < n; ++i) {
		var e_i = new Matrix(n, 1);
		e_i.matrix[i][0] = 1;
		var x_i = Matrix.LUPSolve(LUP.L, LUP.U, LUP.P, e_i);
		if (inverse === null) {
			inverse = x_i;
		} else {
			inverse.appendColumn(x_i);
		}
	}
	return inverse;
};

Matrix.prototype.norm = function(level) {
	return Matrix.norm(this, level);
};

Matrix.add = function(a, b) {
	var c = a.getClone();
	return c.add(b);
};

Matrix.subtract = function(a, b) {
	var c = a.getClone();
	return c.subtract(b);
};

Matrix.scalarMultiply = function(a, k) {
	var c = a.getClone();
	return c.scalarMultiply(k);
};

Matrix.multiply = function(a, b) {
	var c = a.getClone();
	return c.multiply(b);
};

Matrix.transpose = function(a, b) {
	var c = a.getClone();
	return c.transpose();
};

Matrix.LUPDecomposition = function(matrix) {
	if (matrix.rows !== matrix.cols) {
		throw new Error("Matrix LUP Decomposition error, expected square matrix");
	}
	var n = matrix.rows;
	//initialize P, here we use vector pi[i]=j to represent P[i][j] = 1
	var pi = [];
	for (var i = 0; i < n; ++i) {
		pi[i] = i;
	}
	//do LU decomposition in place of the clone
	var matrix_clone = matrix.getClone();
	var matrix_c = matrix_clone.matrix;
	for (var col = 0; col < n; ++col) {
		//Use the row with the largest absolute value
		//After the P transformation, matrix_c[col][col] shouldn't be zero
		var pivote_val = Math.abs(matrix_c[col][col]);
		var pivote_row = col;
		for (var r_in_col = col+1; r_in_col < n; ++r_in_col) {
			var abs_val = Math.abs(matrix_c[r_in_col][col])
			if (abs_val > pivote_val) {
				pivote_val = abs_val;
				pivote_row = r_in_col;
			}
		}
		if (pivote_val === 0) {
			throw new Error("Matrix LUP Decomposition error: non inveritble matrix.");
		}
		if (pivote_row !== col) {
			//swap p[pivote_row] and pi[col]
			var tmp = pi[col];
			pi[col] = pi[pivote_row];
			pi[pivote_row] = tmp;
			//swap matrix_c's pivote_row with matrix_c's col row
			for (var c = 0; c < n; ++c) {
				var t = matrix_c[col][c];
				matrix_c[col][c] = matrix_c[pivote_row][c];
				matrix_c[pivote_row][c] = t;
			}
		}
		//update v <- v/a[k][k]
		for (var r_in_col = col+1; r_in_col < n; ++r_in_col) {
			matrix_c[r_in_col][col] /= matrix_c[col][col];
		}
		//update Schur's Complement of A' <- A' - v^T/a[k][k]
		for (var r_in_a_prime = col+1; r_in_a_prime < n; ++r_in_a_prime) {
			for (var c_in_a_prime = col+1; c_in_a_prime < n; ++c_in_a_prime) {
				matrix_c[r_in_a_prime][c_in_a_prime] -= matrix_c[r_in_a_prime][col]*matrix_c[col][c_in_a_prime];
			}
		}
	}
	//Extract result
	var P = Matrix.Zero(n);
	for (var i = 0; i < n; ++i) {
		P.matrix[i][pi[i]] = 1;
	}
	var L = Matrix.Identity(n);
	for (var i = 0; i < n; ++i) {
		for (var j = 0; j < i; ++j) {
			L.matrix[i][j] = matrix_c[i][j];
		}
	}
	var U = Matrix.Zero(n);
	for (var i = 0; i < n; ++i) {
		for (var j = i; j < n; ++j) {
			U.matrix[i][j] = matrix_c[i][j];
		}
	}
	return {'P': P, 'L': L, 'U': U};
};

Matrix.LUPSolve = function(L, U, P, b) {
	//For the equation LUx = Pb, solve for x
	//First solve for Ly = Pb, using fotward substitution
	//	y[i] = Pb[i] - sum{L[i][j]*y[j], j = 1..(i-1)}
	//Then solve for Ux = y, using backward substitution
	//	x[i] = (y[i] - sum{U[i][j]*x[j],j=i+1..n}/U[i][i])
	if (!(L.rows === U.rows && U.rows === P.rows && P.rows == b.rows &&
		L.isSquare() && U.isSquare() && P.isSquare() && b.cols === 1)) {
		throw new Error("Matrix LUP Solve parameter dimension error.");
	}		
	var Pb = Matrix.multiply(P, b);
	var n = L.rows;
	var y = [];
	for (var i = 0; i < n; ++i) {
		var upper_product_sum = 0;
		for (var j = 0; j < i; ++j) {
			upper_product_sum += L.matrix[i][j]*y[j];
		}
		y[i] = Pb.matrix[i][0] - upper_product_sum;
	}
	var x = [];
	for (var i = n-1; i >= 0; --i) {
		var lower_product_sum = 0;
		for (var j = i+1; j < n; ++j) {
			lower_product_sum += U.matrix[i][j] * x[j];
		}
		x[i] = (y[i] - lower_product_sum) / U.matrix[i][i];
	}
	return (new Matrix(1, n, [x])).transpose();
};

Matrix.inverse = function(matrix) {
	var clone = matrix.getClone();
	return clone.inverse();
};

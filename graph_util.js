var convertToCoordinates = function(X, Y) {
	if (X.length != Y.length) {
		throw "Error: expected to array to of the same size, but got: " + X.length + " and " + Y.length + "instead";
	}
	var Z = [];
	for (var i = 0; i < X.length; ++i) {
		Z[i] = [X[i], Y[i]];
	}
	return Z;
};
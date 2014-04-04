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

// Creates a histogram from the given sampler by sampling num_samples of samples from
// the sampler, and allocate each sample into one of the num_buckets buckets; after
// all the samples are drawn, the frequencies of all the buckets will be normalzed.
var CreateHistogramFromSampler = function(sampler, num_samples, num_buckets) {
	var histogram = [];
	for (var i = 0; i < num_buckets; ++i) {
		histogram[i] = 0;
	}
	var num_samples_drawn = 0;
	while (num_samples_drawn++ < num_samples) {
		var sample = sampler();
		var bucket_index = Math.floor(sample) % num_samples;
		histogram[bucket_index]++;
	}
	for (var i = 0; i < num_buckets; ++i) {
		histogram[i] /= num_samples;
	}
	return histogram;
}


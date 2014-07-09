var $RND = {
	// Return a uniform random number generator
	uniform_rng: function() {
		return Math.random;
	},
	// Return a Gaussian Random Generator
	gaussian_rng: function(mean, stddev) {
		var mu = mean;
		var sigma = stddev;
		var uni_rng = this.uniform_rng();
        // Use the Box-Muller method for generating a random number from standard normal distribution
        // then transform it to get the required result.
		return function () {
			var u = uni_rng();
			var v = uni_rng();
			var z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0*Math.PI*v);
			return z * sigma + mu;
		};
	},
	// Return the Guassian Probability Density Function
	gaussian_pdf: function(mean, stddev) {
		var mu = mean;
		var sigma = stddev;
		var norm_factor = 1.0 / (sigma * Math.sqrt(2 * Math.PI));
		var z_factor = 2.0 * sigma * sigma;
		return function(x) {
			return  norm_factor * Math.exp(-(x - mu) * (x - mu) / z_factor);
		};
	},
};
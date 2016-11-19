
function getGenderAndAge(data) {
	return new Promise(function(resolve, reject) {
		if (data.images[0].faces) {
			resolve(data.images[0].faces
                    .map(function(face) {
                        var age = Math.round((face.age.min + face.age.max) / 2);
                        var gender = face.gender.gender;
                        return ({
                            age: age,
                            gender: gender
                        })
                    })[0]);
		}
		else {
			resolve({});
		}
	});
}

exports.getGenderAndAge = getGenderAndAge;
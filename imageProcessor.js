
function getInfo(data) {
	return new Promise(function(resolve, reject) {
		if (data.images[0].faces) {
			result = data.images[0].faces
							.map(function(face) {
								var age = Math.round((face.age.min + face.age.max) / 2);
								var gender = face.gender.gender;
								return ({
									age: age,
									gender: gender
								})
							})[0];
			link = getLink(result);
			result.link = link;
			resolve(result);
		}
		else {
			resolve({});
		}
	});
}

function getLink(data) {

	const prefix = './videos/';

	let averageAge = data.age;
	let gender = data.gender; // either MALE or FEMALE
	let isMale = gender === 'MALE';

	if (averageAge < 18) {
		return prefix + 'game.mp4';
	} else if (averageAge >= 18 && averageAge < 55) {
		if (isMale)
			return prefix + 'car.mp4';
		else
			return prefix + 'fashion.mp4';
	} else {
		return prefix + 'retirement.mp4';
	}

}

exports.getInfo = getInfo;
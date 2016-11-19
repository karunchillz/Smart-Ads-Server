// Returns a file path from local for appropriate advertisement
// Input: JSON Object from IBM IoT
// Output: path to the advertisement video
function getLink(data) {

	const prefix = './videos/';

	let face = data.result.images[0].faces[0];
	let averageAge = (face.age.min + face.age.max) / 2;
	let gender = face.gender.gender; // either MALE or FEMALE
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


exports.getLink = getLink;
const ACTIVATION_GROUPS = 4;
const ACTIVATION_GROUP_LENGTH = 4;
const ACTIVATION_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function parseNbDelay(rawValue) {
	const parsed = Number(rawValue);
	return Number.isFinite(parsed) ? parsed : 0;
}

export function isSubscriptionExpired(rawNbDelay) {
	return parseNbDelay(rawNbDelay) < 0;
}

function randomInt(max) {
	if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
		const array = new Uint32Array(1);
		window.crypto.getRandomValues(array);
		return array[0] % max;
	}

	return Math.floor(Math.random() * max);
}

export function generateActivationKey() {
	const groups = [];

	for (let i = 0; i < ACTIVATION_GROUPS; i += 1) {
		let group = '';
		for (let j = 0; j < ACTIVATION_GROUP_LENGTH; j += 1) {
			group += ACTIVATION_ALPHABET[randomInt(ACTIVATION_ALPHABET.length)];
		}
		groups.push(group);
	}

	return groups.join('-');
}

export function normalizeActivationKey(value) {
	return (value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/(.{4})/g, '$1-').replace(/-$/, '');
}

export function isActivationKeyFormatValid(value) {
	return /^[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$/.test(value || '');
}

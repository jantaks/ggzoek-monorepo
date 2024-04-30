export enum Status {
	REDIRECT,
	SUCCESS,
	ERROR

}

export function status(result: { status: number }) {
	if (result.status >= 300 && result.status < 400) {
		return Status.REDIRECT;
	}
	if (result.status >= 200 && result.status < 300) {
		return Status.SUCCESS;
	}
	if (result.status >= 400) {
		return Status.ERROR;
	}
}

export function makeEnhanced(data: FormData) {
	data.delete('next');
	data.append('enhanced', 'true');
}

export async function enhancedFormdata(data: FormData) {
	const enhancedString = data.get('enhanced') as string;
	let enhanced = false;
	if (enhancedString !== null) {
		enhanced = JSON.parse(enhancedString);
	}
	const next = data.get('next')?.toString() || '/';
	return { enhanced, next };
}
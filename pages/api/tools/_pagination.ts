export type Metadata = {
	currentPage: number;
	pageCount: number;
	pageSize: number;
};
export const calculateOffset = (
	currentPage: string,
	pageLimit: number
): number => {
	const offset =
		Math.max(0, currentPage ? Number(currentPage) : 0) * pageLimit;
	return offset;
};

export const paginate = (
	currentPage: string,
	count: number,
	rows: any[],
	pageLimit: number
): Metadata => {
	return {
		currentPage: Math.max(0, Number(currentPage) || 0),
		pageCount: Math.ceil(count / Number(pageLimit)),
		pageSize: rows.length,
	};
};

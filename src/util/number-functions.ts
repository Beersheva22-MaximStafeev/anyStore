export function getAllSum(data: {sum: number}[]): number {
    return Math.trunc(data.reduce((sum, cur) => sum + cur.sum, 0) * 100) / 100;
}

export function getSum(data: {price: number, count: number}) {
    return Math.round(data.count * data.price * 100) / 100;
}
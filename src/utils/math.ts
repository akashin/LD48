export function randomInt(max: integer): integer {
    return Math.floor(Math.random() * max);
}

export function randomIntInRange(min: integer, max: integer): integer {
    return min + randomInt(max - min);
}


// MATH HELPER - - - - - -
export const getRandomIntInRange = ({ min = 0, max = 1 }) => {
    const _min = Math.ceil(min);
    const _max = Math.floor(max + 1);
    const randomInt = Math.floor(Math.random() * (_max - _min) + _min);
    return randomInt;
};

export const getDistanceToFrom = (to, from) => Math.sqrt(
    (to.x - from.x) * (to.x - from.x) + (to.y - from.y) * (to.y - from.y)
);

export const getNormVecFromDestAndOrigin = (destXY, originXY) => {
    const distance = getDistanceToFrom(destXY, originXY);
    const normVec = !!distance ? {
        x: (destXY.x - originXY.x) / distance,
        y: (destXY.y - originXY.y) / distance
    } : { x: 0, y: 0 };
    return normVec;
};

// export const getDotProduct = (from, to) => {
//     const components = Object.keys(from);
//     return components.reduce((acc, k) => acc + from[k] * to[k], 0);
// };


export const getDotProduct2D = (from, to) => {
    return (from.x * to.x) + (from.y * to.y);
};

// export const getDotProductND = (from, to) => {
//     const keys = Object.keys(from);
//     return keys.reduce((acc, k) => acc + from[k] * (to[k] || 0), 0);
// };
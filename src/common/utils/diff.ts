/**
 * This function is used to compare two objects and return the difference between them
 * @param rawObj the object that is used as the base object
 * @param newObj the object that you want to compare with the base object
 * @param dist the object that will store the different values in newObj compared to rawObj
 * @param keys the keys of the object that you want to compare
 * @returns a boolean value, true if the rawObj and newObj are different, false otherwise
 */
export function diff<T, K extends (keyof T)[]>(
    rawObj: T,
    newObj: { [k in K[number]]-?: T[K[number]] },
    dist: { [k in K[number]]?: T[K[number]] },
    keys: K,
): boolean {
    let isNotEqual = false;

    for (const key of keys) {
        if (!checkIsEqual(rawObj[key], newObj[key])) {
            dist[key] = newObj[key];
            isNotEqual = true;
        }
    }

    return isNotEqual;
}

function checkIsEqual(a: unknown, b: unknown): boolean {
    if (typeof a !== typeof b) {
        return false;
    }

    // basic types: string, number, boolean, undefined, symbol, bigint, null
    if (a === b) {
        return true;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        for (let i = 0; i < a.length; i++) {
            if (!checkIsEqual(a[i], b[i])) {
                return false;
            }
        }

        return true;
    }

    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }

    // typeof null is object, so we need to check null first
    if (a === null || b === null) {
        // if a and b are not both null, they are already return true in the previous condition
        return false;
    }

    // a and b are both not null, we can safely cast them to object
    if (typeof a === "object" && typeof b === "object") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return a.id !== undefined && a.id === b.id;
    }

    return false;
}

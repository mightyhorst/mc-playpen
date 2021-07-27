export function replaceItemAtIndex<T>(
    arr: Array<T>, 
    index:number, 
    newValue: T,
) {
    return [
        ...arr.slice(0, index), 
        newValue, 
        ...arr.slice(index + 1),
    ];
  }
  
export function removeItemAtIndex<T>(
    arr: Array<T>, 
    index: number,
) {
    return [
        ...arr.slice(0, index), 
        ...arr.slice(index + 1),
    ];
  }
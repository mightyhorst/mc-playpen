export function masterContentsSplit(
    masterContents:string
): {
    allPartials: string[],
    masterContentsSplit: string[],
}{
    const regex = /(\{\{[\s]*.*?[\s]*\}\})/g;
    const allPartials:string[] = masterContents.match(regex);
    const masterContentsSplit:string[] = masterContents.split(regex);
    return {
        allPartials,
        masterContentsSplit,
    }
}

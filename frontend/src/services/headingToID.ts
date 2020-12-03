export function headingToID (heading: string): string {
    return heading.toLowerCase().replace(/\s/g, '-');
}

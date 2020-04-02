
export interface Query {

    x: number;
    y: number;
    r: number;
    result: boolean;

    created: Date;
    elapsed: number;
}

export function parseQuery(json: any): Query {
    return { ...json, created: new Date(json.created) };
}

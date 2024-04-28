/* tslint:disable */
/* eslint-disable */
/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * 
 * @export
 */
export const ResponseFormat = {
    Json: 'json',
    Text: 'text',
    Xml: 'xml'
} as const;
export type ResponseFormat = typeof ResponseFormat[keyof typeof ResponseFormat];


export function instanceOfResponseFormat(value: any): boolean {
    return Object.values(ResponseFormat).includes(value);
}

export function ResponseFormatFromJSON(json: any): ResponseFormat {
    return ResponseFormatFromJSONTyped(json, false);
}

export function ResponseFormatFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseFormat {
    return json as ResponseFormat;
}

export function ResponseFormatToJSON(value?: ResponseFormat | null): any {
    return value as any;
}


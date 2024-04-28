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

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ProviderInfo
 */
export interface ProviderInfo {
    /**
     * 
     * @type {string}
     * @memberof ProviderInfo
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof ProviderInfo
     */
    driver: string;
    /**
     * 
     * @type {string}
     * @memberof ProviderInfo
     */
    params: string;
    /**
     * 
     * @type {string}
     * @memberof ProviderInfo
     */
    name: string;
    /**
     * 
     * @type {boolean}
     * @memberof ProviderInfo
     */
    _default: boolean;
}

/**
 * Check if a given object implements the ProviderInfo interface.
 */
export function instanceOfProviderInfo(value: object): boolean {
    if (!('id' in value)) return false;
    if (!('driver' in value)) return false;
    if (!('params' in value)) return false;
    if (!('name' in value)) return false;
    if (!('_default' in value)) return false;
    return true;
}

export function ProviderInfoFromJSON(json: any): ProviderInfo {
    return ProviderInfoFromJSONTyped(json, false);
}

export function ProviderInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProviderInfo {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'driver': json['driver'],
        'params': json['params'],
        'name': json['name'],
        '_default': json['default'],
    };
}

export function ProviderInfoToJSON(value?: ProviderInfo | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': value['id'],
        'driver': value['driver'],
        'params': value['params'],
        'name': value['name'],
        'default': value['_default'],
    };
}


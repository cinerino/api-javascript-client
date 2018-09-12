/**
 * API client for javascript
 */
import { factory, service, transporters } from './abstract';
import { ImplicitGrantClient, IOptions as IImplicitGrantClientOptions } from './auth/implicitGrantClient';

/**
 * factory
 * All object interfaces are here.
 * 全てのオブジェクトのインターフェースはここに含まれます。
 */
export import factory = factory;
export import service = service;
export import transporters = transporters;
export type IImplicitGrantClient = ImplicitGrantClient;
/**
 * create OAuth2 client instance using implicit grant
 * @param options implicit grant configurations
 */
export function createAuthInstance(options: IImplicitGrantClientOptions) {
    return new ImplicitGrantClient(options);
}

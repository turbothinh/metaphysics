import config from "config"

import convection from "lib/apis/convection"
import delta from "lib/apis/delta"
import diffusion from "lib/apis/diffusion"
import galaxy from "lib/apis/galaxy"
import gravity from "lib/apis/gravity"
import impulse from "lib/apis/impulse"
import positron from "lib/apis/positron"

import {
  StaticPathLoader,
  DynamicPathLoader,
  PathGenerator,
} from "./loader_interface"

import { apiLoaderWithAuthenticationFactory } from "lib/loaders/api/loader_with_authentication_factory"
import { apiLoaderWithoutAuthenticationFactory } from "lib/loaders/api/loader_without_authentication_factory"

export type API = (
  path: string,
  token: string | null,
  apiOptions: any
) => Promise<any>

export interface APIOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
}

export interface LoaderFactory {
  <T = any>(
    path: string,
    globalParams?: any,
    pathAPIOptions?: APIOptions
  ): StaticPathLoader<T>
  <T = any, P = string>(
    path: PathGenerator<P>,
    globalParams?: any,
    pathAPIOptions?: APIOptions
  ): DynamicPathLoader<T, P>
  <T = any>(
    path: string,
    globalParams: any,
    pathAPIOptions: { headers: false } & APIOptions
  ): StaticPathLoader<T>
  <T = any, P = string>(
    path: PathGenerator<P>,
    globalParams: any,
    pathAPIOptions: { headers: false } & APIOptions
  ): DynamicPathLoader<T, P>
  <T = any>(
    path: string,
    globalParams: any,
    pathAPIOptions: { headers: true } & APIOptions
  ): StaticPathLoader<{ body: T; headers: any }>
  <T = any, P = string>(
    path: PathGenerator<P>,
    globalParams: any,
    pathAPIOptions: { headers: true } & APIOptions
  ): DynamicPathLoader<{ body: T; headers: any }, P>
}

export default opts => ({
  // Unauthenticated loaders

  /**
   * The Delta loaders produced by this factory _will_ cache all responses to memcache.
   */
  deltaLoaderWithoutAuthenticationFactory: apiLoaderWithoutAuthenticationFactory(
    delta,
    "delta",
    {
      requestIDs: opts.requestIDs,
      userAgent: opts.userAgent,
    }
  ),

  /**
   * The Diffusion loaders produced by this factory _will_ cache all responses to memcache.
   */
  diffusionLoaderWithoutAuthenticationFactory: apiLoaderWithoutAuthenticationFactory(
    diffusion,
    "diffusion",
    {
      requestIDs: opts.requestIDs,
      userAgent: opts.userAgent,
      requestThrottleMs: config.DIFFUSION_REQUEST_THROTTLE_MS,
    }
  ),

  /**
   * The Galaxy loaders produced by this factory _will_ cache all responses to memcache.
   *
   * Do **not** use it for authenticated requests!
   */
  galaxyLoaderWithoutAuthenticationFactory: apiLoaderWithoutAuthenticationFactory(
    galaxy,
    "galaxy",
    {
      requestIDs: opts.requestIDs,
      userAgent: opts.userAgent,
    }
  ),

  /**
   * The Gravity loaders produced by this factory _will_ cache all responses to memcache.
   *
   * Do **not** use it for authenticated requests!
   */
  gravityLoaderWithoutAuthenticationFactory: apiLoaderWithoutAuthenticationFactory(
    gravity,
    "gravity",
    {
      requestIDs: opts.requestIDs,
      userAgent: opts.userAgent,
    }
  ),

  /**
   * The Positron loaders produced by this factory _will_ cache all responses to memcache.
   *
   * Do **not** use it for authenticated requests!
   */
  positronLoaderWithoutAuthenticationFactory: apiLoaderWithoutAuthenticationFactory(
    positron,
    "positron",
    {
      requestIDs: opts.requestIDs,
      userAgent: opts.userAgent,
    }
  ),

  // Authenticated loaders

  /**
   * The Convection loaders produced by this factory _will_ cache responses for the duration of query execution but do
   * **not** cache to memcache.
   *
   * Use this for authenticated requests.
   */
  convectionLoaderWithAuthenticationFactory: apiLoaderWithAuthenticationFactory(
    convection,
    "convection",
    {
      requestIDs: opts.requestIDs,
      userAgent: opts.userAgent,
    }
  ),

  /**
   * The Gravity loaders produced by this factory _will_ cache responses for the duration of query execution but do
   * **not** cache to memcache.
   *
   * Use this for authenticated requests.
   */
  gravityLoaderWithAuthenticationFactory: apiLoaderWithAuthenticationFactory(
    gravity,
    "gravity",
    {
      requestIDs: opts.requestIDs,
      userAgent: opts.userAgent,
    }
  ),

  /**
   * The Impulse loaders produced by this factory _will_ cache responses for the duration of query execution but do
   * **not** cache to memcache.
   *
   * Use this for authenticated requests.
   */
  impulseLoaderWithAuthenticationFactory: apiLoaderWithAuthenticationFactory(
    impulse,
    "impulse",
    {
      requestIDs: opts.requestIDs,
      userAgent: opts.userAgent,
    }
  ),
})

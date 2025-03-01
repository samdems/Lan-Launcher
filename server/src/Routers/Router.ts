import { Router as ExpressRouter } from "express";
import { Controller } from "../Controllers/Controller.js";
import { jwt, makeGuard } from "../Middleware/guard.js";
import { AllRoles } from "../roles.js";

type routerHandlerGet = "list" | "read";
type routerHandlerPost = "create";
type routerHandlerPut = "update";
type routerHandlerDelete = "delete";
type HTTPMethods = "get" | "post" | "put" | "delete" | "all";

export default class Router<T extends Controller> {
  private router: ExpressRouter;
  private objects: Record<string, T> = {};
  private name: string;
  private guard: boolean = false;
  private hasGuard: boolean = false;
  private guardName: AllRoles | null = null;

  constructor(name: string, router: ExpressRouter) {
    this.name = name;
    this.router = router;
  }

  private makeOrFindObject<T extends Controller>(ObjectClass: new () => T) {
    if (!(ObjectClass.prototype instanceof Controller)) {
      throw new Error(`ObjectClass must be a subclass of Controller`);
    }

    const objName = ObjectClass.name;

    if (!this.objects[objName]) {
      this.objects[objName] = new ObjectClass() as any;
    }

    return this.objects[objName];
  }

  private registerRoute<T extends Controller>(
    path: string,
    object: new () => T,
    requestHandler: string,
    method: HTTPMethods,
  ) {
    const obj = this.makeOrFindObject<T>(object);
    if (this.hasGuard && this.guardName) {
      const guard = makeGuard(this.guardName, requestHandler);
      // @ts-ignore
      this.router[method](path, guard, obj[requestHandler].bind(obj));
      return;
    }
    // @ts-ignore
    this.router[method](path, obj[requestHandler].bind(obj));
  }

  public withGuard(guardName: AllRoles) {
    this.router.use(jwt);
    this.hasGuard = true;
    this.guardName = guardName;
    return this;
  }

  public get<T extends Controller>(
    path: string,
    object: new () => T,
    requestHandler: routerHandlerGet,
  ) {
    this.registerRoute(path, object, requestHandler, "get");
    return this;
  }

  public post<T extends Controller>(
    path: string,
    object: new () => T,
    requestHandler: routerHandlerPost,
  ) {
    this.registerRoute(path, object, requestHandler, "post");
    return this;
  }

  public put<T extends Controller>(
    path: string,
    object: new () => T,
    requestHandler: routerHandlerPut,
  ) {
    this.registerRoute(path, object, requestHandler, "put");
    return this;
  }

  public delete<T extends Controller>(
    path: string,
    object: new () => T,
    requestHandler: routerHandlerDelete,
  ) {
    this.registerRoute(path, object, requestHandler, "delete");
    return this;
  }

  public all<T extends Controller>(
    path: string,
    object: new () => T,
    requestHandler: string,
  ) {
    this.registerRoute(path, object, requestHandler, "all");
    return this;
  }
}

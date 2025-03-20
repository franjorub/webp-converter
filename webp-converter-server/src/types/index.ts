export interface ExpressRouterLayer {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
  name?: string;
  handle: {
    stack?: ExpressRouterLayer[];
  };
  regexp: {
    source: string;
  };
}

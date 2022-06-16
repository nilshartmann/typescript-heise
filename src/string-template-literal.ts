export default undefined;

type Endpoint = {
  url: string;
  method: "GET" | "POST";
};

type K = keyof Endpoint;
const x: K = "method";
type Z = `${Capitalize<K>}`;
const yyyyy: Z = "method";

type Keys = keyof endpoints;
const aaa: Keys = "fasdfasdf";

type EndpointConfig = Record<string, Endpoint>;

const endpoints = {
  getPost: {
    url: "https://myapp.de/api/posts",
    method: "GET",
  },

  updateUser: {
    url: "https://myapp.de/api/users",
    method: "POST",
  },
} as const;

type EndpointName = "getPost";
type FunctionName = `use${Capitalize<EndpointName>}`;
type QueryFn<T> = T extends string ? `use${Capitalize<T>}Query` : never;
type QueryFunctions = QueryFn<keyof typeof endpoints>;
const useGetPost: FunctionName = "useGetPost"; // OK
const getPost: FunctionName = "getPost"; // ERROR

// getPosts => GetPosts
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Ausgelassen, implementierung für Beispiel irrelevant */
declare function createApiHook(endpoint: Endpoint): Function;

type Api<E extends EndpointConfig> = {
  [K in keyof E as QueryFn<K>]: Function;
};

function createApi<E extends EndpointConfig>(endpoints: E): Api<E> {
  const result: Record<string, Function> = {};
  Object.keys(endpoints).forEach((name) => {
    // name ist z.B. getPost, updateUser, ...
    const endpointFn = endpoints[name];
    const hookFunctionName = `use${capitalize(name)}`;
    result[hookFunctionName] = createApiHook(endpointFn);
  });

  return result as any;
}

const hooks = createApi(endpoints);
hooks.useGetPostQuery();
hooks.useRemoveUserQuery();

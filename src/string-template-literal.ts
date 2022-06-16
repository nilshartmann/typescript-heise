export default undefined;

type Endpoint = {
  url: string;
  method: "GET" | "POST";
};

type EndpointConfig = Record<string, Endpoint>;

const endpoints: EndpointConfig = {
  getPost: {
    url: "https://myapp.de/api/posts",
    method: "GET",
  },

  updateUser: {
    url: "https://myapp.de/api/users",
    method: "POST",
  },
};

type EndpointName = "getPost";
type FunctionName = `use${Capitalize<EndpointName>}`;

const useGetPost: FunctionName = "useGetPost"; // OK
const getPost: FunctionName = "getPost"; // ERROR

// getPosts => GetPosts
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Ausgelassen, implementierung für Beispiel irrelevant */
declare function createHook(endpoint: Endpoint): Function;

type Hooks<E extends EndpointConfig> = {
  [K in keyof E as K extends string ? `use${Capitalize<K>}` : never]: Function;
};

function createHooks<E extends EndpointConfig>(endpoints: E): Hooks<E> {
  const result: Record<string, Function> = {};
  Object.keys(endpoints).forEach((name) => {
    // name ist z.B. getPost, updateUser, ...
    const endpointFn = endpoints[name];
    const hookFunctionName = `use${capitalize(name)}`;
    result[hookFunctionName] = createHook(endpointFn);
  });

  return result as any;
}

const hooks = createHooks(endpoints);
hooks.useGetPost();

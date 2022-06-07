export default undefined;

type Endpoint = {
  url: string;
  method: "GET" | "POST";
};
const endpoints = {
  getPost: {
    url: "...",
    method: "GET",
  },

  updateUser: {
    url: "...",
    method: "POST",
  },
} as const;

// getPosts => GetPosts
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Ausgelassen, implementierung für Beispiel irrelevant */
declare function createHook(endpoint: Endpoint): Function;

type Hooks<E extends Record<string, Endpoint>> = {
  [K in keyof E as K extends string ? `use${Capitalize<K>}` : K]: Function;
};

function createHooks<E extends Record<string, Endpoint>>(
  endpoints: E
): Hooks<E> {
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

export default undefined;

// type F<X extends (...args: any[]) => void> = X;
// type F<X extends (...args: any[]) => void> =
// X extends (...args: [infer Z, infer Y]) => void ? Z|Y : never

// type F<X extends (...args: any[]) => any> = X extends (
//   ...args: infer Params
// ) => any
//   ? Params
//   : never;

function add(a: number, b: number) {
  return a + b;
}

function traceAdd(a: number, b: number) {
  const result = add(a, b);

  return { result, params: { a, b }, description: "add" };
}

type TraceFn = () => {
  description: string;
};

type TraceFunction<F extends (...args: any) => any> = F extends (
  ...args: any
) => infer Result
  ? TraceFn
  : TraceFn;

// type TraceFunction<F extends (...args: any) => any>
// = F extends (...args: infer Args) => infer Result
// ? (...args: Args) => {
//   result: Result,
//   params: Args,
//   description: string
// }:never

function makeTraceable<FN extends (...args: any) => any>(
  description: string,
  fn: FN
): TraceFunction<FN> {
  // GEHT ?!??!?!
  const y: TraceFunction<(a: string) => string> = () => ({
    description: "fsfasf",
  });

  // GEHT NICHT....
  const theFunction: TraceFunction<FN> = () => {
    // const result = fn(...arguments) as ReturnType<F>

    return {
      description,
    };
  };

  return theFunction;
}

const x = makeTraceable("add", add);
x(2, 3);

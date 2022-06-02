export default undefined;

// https://www.youtube.com/watch?v=3Fxoxg_FMpg

type Message<Payload extends object> = {
  body: Payload;
};

type MessagePayloadType<M extends Message<object>> = M extends Message<infer X>
  ? X
  : unknown;

type Person = {
  lastname: string;
  age: number;
};

// ---------------------------------------------------------

type Left<X extends string> = X extends `${infer L}:${string}` ? L : unknown;
type Right<X extends string> = X extends `${string}:${infer R}` ? R : unknown;

const Teams = "Hamburger SV:FC St. Pauli";

type HSV = Left<typeof Teams>; // "Hamburger SV"
type StPauli = Right<typeof Teams>; // "FC St. Pauli"

const Musician = "Syd Barret";
type No = Left<typeof Musician>;

// ---------------------------------------------------------

// ---------------------------------------------------------

// ARGUMENTATION, warum wir das hier so machen, wie wir es machen:
//   - weil wir Schritt-für-Schritt vorgehen können
//   - wir können viele Dinge zeigen:
//      - conditional types
//      - filtern mit never
//      - array to union
//      - string template literal
//      - ...
//   Muss also nicht die beste Implementierung sein, aber zum
//    zeigen gut geeignet

type PersonMessage = Message<Person>;

type PersonPayloadType = MessagePayloadType<PersonMessage>;

const userIdPath = "/pages/blog/:user/:id";
type UserIdPath = Path<typeof userIdPath>;

// type Path = { user: string, id: string }

type Path<
  S extends string,
  Result extends string[] = []
> = S extends `${infer Z}/${infer Y}`
  ? Path<Y, [...Result, Z]>
  : [...Result, S];

// ????
type ArrayToUnion<ARR_T extends Readonly<unknown[]>> = ARR_T[number];

type Filter<X extends string> = X extends `:${infer Y}` ? Y : never;

type ToObject<X extends string> = {
  [Key in X]: string;
};

type Params<R extends string> = ToObject<Filter<ArrayToUnion<Path<R>>>>;

// type UserRoute = Route<Z>;

function registerRoute<R extends string>(
  route: R,
  onRequest: (params: Params<R>) => void
) {
  // @ts-ignore
  return {};
}

registerRoute("/pages/blog/:user/:postId", (params) => {
  params.postId;
  params.sss; // ERROR
});

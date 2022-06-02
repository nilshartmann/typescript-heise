export default undefined;

// Herleitung: "infer", um Typ-Argumente von Generics zu bekommen

type Message<Payload extends object> = {
  body: Payload;
};

type MessagePayloadType<M extends Message<object>> = M extends Message<infer X>
  ? X
  : unknown;

type PersonMessage = Message<{
  lastname: string;
  age: number;
}>;

type PersonPayloadType = MessagePayloadType<PersonMessage>;

const personPayload: PersonPayloadType = {
  age: 32, // OK
  lastname: "Smith", // OK
  city: "Hamburg", // ERROR ✅
};

// ---------------------------------------------------------

// Herleitung: "Pattern Matching" mit String Literal Types

type Left<X extends string> = X extends `${infer L}:${string}` ? L : never;
type Right<X extends string> = X extends `${string}:${infer R}` ? R : never;

const Teams = "Hamburger SV:FC St. Pauli";

type HomeTeam = Left<typeof Teams>; // "Hamburger SV"
type AwayTeam = Right<typeof Teams>; // "FC St. Pauli"

const hsv: HomeTeam = "Hamburger SV"; // OK ✅
const scp: AwayTeam = "FC St. Pauli"; // OK ✅
const s04: HomeTeam = "Schalke 04"; // ERROR ✅

const Musician = "Syd Barret";
type No = Left<typeof Musician>; // never  ✅
const crazyDiamond: No = ""; // ERROR: never  ✅

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

type Path<
  S extends string,
  Result extends string[] = []
> = S extends `${infer Z}/${infer Y}`
  ? Path<Y, [...Result, Z]>
  : [...Result, S];

// ????
type ArrayToUnion<AnArray extends unknown[]> = AnArray[number];

type Abc = ArrayToUnion<["a", "b", "c"]>;

type Filter<X extends string> = X extends `:${infer Y}` ? Y : never;

type ToObject<X extends string> = {
  [Key in X]: string;
};

type Params<R extends string> = ToObject<Filter<ArrayToUnion<Path<R>>>>;

type IsEmptyObject<O extends object> = keyof O extends []
  ? (keyof O)[number] extends never
    ? true
    : false
  : false;

type A = IsEmptyObject<{}>; // true
type B = IsEmptyObject<{ b: null }>; // false
type C = IsEmptyObject<{ c: undefined }>; // false
type D = IsEmptyObject<{ c: never }>; // false

// DAS ZIEL:

// - wir haben eine Funktion, mit der wir eine Route (String)
//   übergeben können
//   - In der Route könenn Parameter definiert sein (/:abc)
//   - als Callback-Funktion wird eine Funktion übergbeen,
//     die zur Laufzeit die geparsten Werte übergeben bekommt
//   - da Werte aus URL kommen, ist der Typ jeweils string
// - wenn keine Url, soll Callback-Funktion keinen Parameter haben

function registerRoute<R extends string>(
  route: R,
  onRequest: IsEmptyObject<Params<R>> extends true
    ? () => void
    : (params: Params<R>) => void
) {}

registerRoute("/pages/blog/:user/:postId", (params) => {
  params.postId.toUpperCase(); // OK ✅
  params.user.toUpperCase(); // OK ✅
  params.sss; // ERROR ✅
});

// keine Parameter
registerRoute("/pages/blog", () => {});

registerRoute(":songId", (p) => {
  p.songId.toUpperCase(); // OK ✅
});

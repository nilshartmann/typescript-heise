export default undefined;

// DAS ZIEL:

// - wir haben eine Funktion ("registerRoute"), der wir als 1. Parameter eine Route (String)
//   übergeben können
//   - In der Route könenn Parameter definiert sein (/:abc)
// - als zweiter Parameter, eine Callback-Funktion mit null oder einem Parameter,
//     der Parameter sind die zur Laufzeit geparsten Werte als Objekt
//   - da Werte aus URL kommen, ist der Typ jeweils string
//   - wenn keine Params in der URL, soll Callback-Funktion keinen Parameter haben
//
// registerRoute("/user/:userId",
//               params => params.userId.toUpperCase() // params: { userId: string }
// );
// registerRoute("/about", () => console.log("hallo") ); // keine Parameter

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Herleitung: "infer", um Typ-Argumente von Generics zu bekommen

// an Redux orientieren ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️
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
// type Rene<X> = X extends boolean ? string : number;

// type Farbe = "rot" | "gruen"
// type HintergrundOderVordergrund = "hg" | "vg"

// type AlleFarben = `on${Capitalize<Farbe>} ${HintergrundOderVordergrund}`

// function addListener<O extends object>(o: O) {

// }

// Herleitung: "Pattern Matching" mit String Literal Types

type Left<X extends string> = X extends `${infer L}:${string}` ? L : never;
type Right<X extends string> = X extends `${string}:${infer R}`
  ? R | null
  : never;

// const teams = "Hamburger SV:FC St. Pauli" ;

// function match(x: "Hamburger SV:FC St. Pauli") {

// }

// match("Hamburger SV:FC St. Pauli");
// match(teams);

type HomeTeam = Left<typeof teams>; // "Hamburger SV"
type AwayTeam = Right<typeof teams>; // "FC St. Pauli"

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

type P = Path<"/abc/def/:userId">;
type U = ArrayToUnion<P>;

// ????
// type ArrayToUnion<AnArray extends unknown[]> = AnArray[number]; // any
type ArrayToUnion<AnArray extends any[]> = AnArray[any]; // any

type Abc = ArrayToUnion<["a", "b", "c"]>;
const aa: Abc = "a"; // OK
const bb: Abc = "b"; // OK
const xx: Abc = "x"; // ERROR ✅

type Filter<X extends string> = X extends `:${infer Y}` ? Y : never;

type ToObjectWithStrings<X extends object> = {
  [M in keyof X]: `M`;
};

type F = "a" | "c";
type Person = { lastname: string };
type OO = ToObjectWithStrings<Person>;

type Params<R extends string> = ToObjectWithStrings<
  Filter<ArrayToUnion<Path<R>>>
>;

type IsEmptyObject<O extends object> = keyof O extends []
  ? (keyof O)[number] extends never
    ? true
    : false
  : false;

type A = IsEmptyObject<{}>; // true
type B = IsEmptyObject<{ b: null }>; // false
type C = IsEmptyObject<{ c: undefined }>; // false
type D = IsEmptyObject<{ c: never }>; // false

// ERGEBNIS: ------------------- - - >

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

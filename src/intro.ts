export default undefined;

type Color = "black" | "white" | "blue";
type Variant = "light" | "dark";
type Colors = `${Variant} ${Color}`; // "black light" | "black dark" | "white light" ...

function print(s: string, color: Colors) {}

print("gut", "light black"); // OK
print("geht nicht", "black"); // ERROR

const name = "Klaus";
const greeting = `Hello ${name}`;

type Name = "Klaus";
type Greeting = `Hello, ${Name}`;

const greetKlaus: Greeting = "Hello, Klaus"; // Passt
const greetSusi: Greeting = "Hello, Susi"; // Fehler: Type '"Hello, Susi"' is not assignable to type '"Hello, Klaus"'

type Names = "Klaus" | "Susi";
type G = `Hello, ${Names}`;

type Suffix = "em" | "rem" | "px";
type CSS = `${number}${Suffix}`;

const x: CSS = "4px";
const y: CSS = "4"; // ERROR
const z: CSS = "apx"; // ERROR

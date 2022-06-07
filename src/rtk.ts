export default undefined;

type PayloadAction<PL> = {
  type: string;
  payload: PL;
};

// Ausgangspunkt:

// In der Anwendung gibt es diverse handler-Funktionen, die beliebige Actions verarbeiten können.
//  Konvention: sie haben einen Parameter, der eine Action darstellt
// In Redux sind diese Action-Handler (sog. reducer-Funktionen) noch etwas komplexer und
//  außerdem in einem Objekt gehalten. Hier geben wir sie der einfachheithalber explizit an
// In Redux werden die Action-Objekte, die übergeben in der Regel nicht selbst erzeugt,
//  sondern mittels einer Factory-Funktion ("actionCreator").
//  Diese Funktion bekommt im einfachsten Fall den gewünschten Payload übergeben
//  und liefert eine Action zurück (mit type und payload)
//  Damit diese Funktionen nicht explizit geschrieben werden müssen, gibt es eine Hilfsfunktion
//   (in Redux createSlice)

// Payload einer fachlichen Action
type IncrementActionPayload = {
  value: number;
};

const reducers = {
  increment(action: PayloadAction<IncrementActionPayload>) {
    action.payload.value.toFixed(); // OK, toFixed auf number definiert
    action.payload.vlue; // ERROR: value gibts nicht
  },
  reset() {
    // no payload at all
  },
};

type GetActionParamFromHandlerFunction<HF> = HF extends (
  action: infer Action
) => any
  ? Action
  : never;

type GetPayloadFromAction<A> = A extends { payload: infer PayloadType }
  ? PayloadType
  : never;

type GetPayloadFromHandlerFunction<HF> = GetPayloadFromAction<
  GetActionParamFromHandlerFunction<HF>
>;

// Ergebnis-Objekt aus der makeActionCreator-Funktion, wenn das Action
//  Objekt ein payload-Property erwartet
type ActionCreatorWithPayload<T extends string, PL> = (pl: PL) => {
  type: T;
  payload: PL;
};

// Action-Creator ohne Payload
type ActionCreatorWithoutPayload<T extends string> = () => { type: T };

// Ergebnis von makeActionCreator
// type ActionCreatorFunction<
//   T extends string,
//   HF extends Function
// > = GetPayloadFromHandlerFunction<HF> extends never
//   ? ActionCreatorWithoutPayload<T>
//   : ActionCreatorWithPayload<T, GetPayloadFromHandlerFunction<HF>>;

// https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919 🤯
// In RTK (createAction.d.ts):  ([E] extends [never] ? "..." : "..."
type IsNeverType<T> = [T] extends [never] ? true : false;

type ActionCreatorFunction2<T extends string, PL> = IsNeverType<PL> extends true
  ? ActionCreatorWithoutPayload<T>
  : ActionCreatorWithPayload<T, PL>;

function makeActionCreator<T extends string, HF extends Function>(
  type: T,
  _fn: HF
): ActionCreatorFunction2<T, GetPayloadFromHandlerFunction<HF>> {
  const actionCreator = (...args: any[]) => {
    return {
      type,
      payload: args[0],
    };
  };

  return actionCreator;
}

// ------------------------------------------------------------
// VERWENDUNG 1 "Einfache Form":
// ------------------------------------------------------------
const incrementActionCreator = makeActionCreator(
  "increment",
  reducers.increment
);

const incrementAction = incrementActionCreator({
  value: 7,
});
incrementAction.type === "increment"; // OK
incrementAction.type === "decrement"; // ERROR
incrementAction.payload.value = 99; // OK
incrementAction.payload.value = ""; // ERROR Keine Zahl

const resetActionCreator = makeActionCreator("reset", reducers.reset);
const resetAction = resetActionCreator();
resetAction.type === "reset"; // OK
resetAction.type === "clear"; // ERROR
resetAction.payload; // ERROR kein Payload

// ------------------------------------------------------------
// VERWENDUNG 1 "Redux Toolkit":
// ------------------------------------------------------------
// im "echten" Redux Toolkit: die MakeActionCreator-Aufrufe sind im Redux-Framework,
//  der Verwender übergibt sein Slice mit den Reducern (hier nur Reducer bzw. handler)
//  und kommt dann liste mit Action-Creator-Funktionen zurück

type Actions<H extends Record<string, Function>> = {
  [actionName in keyof H]: ActionCreatorFunction2<
    actionName extends string ? actionName : "",
    GetPayloadFromHandlerFunction<H[actionName]>
  >;
};

function createActions<HS extends Record<string, Function>>(
  handlers: HS
): Actions<HS> {
  const result: Record<string, Function> = {};
  Object.keys(handlers).forEach((actionName) => {
    const handlerFunction = handlers[actionName];

    result[actionName] = makeActionCreator(actionName, handlerFunction);
  });

  return result as any;
}

// in redux: createSlice
const x = createActions(reducers);

const incrementAction2 = x.increment({
  value: 7,
});
incrementAction2.type === "increment"; // OK
incrementAction2.type === "decrement"; // ERROR
incrementAction2.payload.value = 99; // OK
incrementAction2.payload.value = ""; // ERROR Keine Zahl
x.increment({ minus: 1 }); // ERROR invalid payload
x.increment(); // ERROR  no payload at all

const resetAction2 = x.reset();
resetAction2.type === "reset"; // OK
resetAction2.type === "clear"; // ERROR
resetAction2.payload; // ERROR kein Payload

const noWay = x.noway(); // keine Action

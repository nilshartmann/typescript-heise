import { createAction } from "@reduxjs/toolkit";

function prepareIncrementAction(value = 0) {
  return {
    payload: {
      value,
    },
  } as const;
}

const createIncrementAction = createAction<{ value: number }>(
  "increment",
  prepareIncrementAction
);

const result = createIncrementAction({
  value: 23,
});

result.payload.value;

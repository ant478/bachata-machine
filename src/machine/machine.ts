import { createMachine, assign } from 'xstate';
import { decorateWithActions } from './local_utils';
import { MOVE_ID, COMMAND_ID } from './constants';
import { TRANSITIONS_CONFIG, INITIAL_STATE } from './config';
import { MoveId } from './types';

export type Context = {
    history: {
        moveId: MoveId;
        to: string;
    }[];
};

export const machine = createMachine(
    {
        id: 'bachata_machine',
        initial: INITIAL_STATE,
        context: {
            history: [{ moveId: MOVE_ID.BASIC, to: INITIAL_STATE }],
        } as Context,
        states: decorateWithActions(
            Object.entries(TRANSITIONS_CONFIG).reduce(
                (acc, [stateId, stateTransitions]) => ({
                    ...acc,
                    [stateId]: { on: stateTransitions },
                }),
                {}
            ),
            ['pushToHistory']
        ),
        on: {
            [COMMAND_ID.UNDO]: {
                guard: ({ context }) => context.history.length >= 2,
                actions: [
                    assign({
                        history: ({ context }) => context.history.slice(0, -1),
                    }),
                    ({ context, self }) => self.send({ type: `command:goto:${context.history.at(-1).to}` }),
                ],
            },
            // Yes, I know. This is awful. It had to be done.
            ...Object.keys(TRANSITIONS_CONFIG).reduce(
                (acc, state) => ({
                    ...acc,
                    [`command:goto:${state}`]: `.${state}`,
                }),
                {}
            ),
        },
    },
    {
        actions: {
            pushToHistory: assign({
                history: ({ context, event, self }) => {
                    if (!Object.values(MOVE_ID).includes(event.type as any)) return;

                    const state = self.getSnapshot().value as string;
                    const moveId = event.type as MoveId;
                    const to = TRANSITIONS_CONFIG[state][moveId];

                    return [...context.history, { moveId, to }];
                },
            }),
        },
    }
);

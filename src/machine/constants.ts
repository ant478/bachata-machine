import { throwIfHasDuplicates } from './local_utils';

export const COUNT = {
    RIGHT: 1,
    LEFT: 5,
} as const;

export const POSITION_ID = {
    OPEN: 'open',
    CLOSED_HALF: 'closed_half',
    CLOSED_FULL: 'closed_full',
    HANDSHAKE: 'handshake',
    HANDSHAKE_REVERSED: 'handshake_reversed',
    CROSSED_HANDS_RIGHT: 'crossed_hands_right',
    CROSSED_HANDS_LEFT: 'crossed_hands_left',
    HAMMERLOCK_RIGHT: 'hammerlock_right',
    HAMMERLOCK_LEFT: 'hammerlock_left',
    HAMMERLOCK_RIGHT_SELF: 'hammerlock_right_self',
    HAMMERLOCK_LEFT_SELF: 'hammerlock_left_self',
    WALK: 'walk',
    WALK_FINISH: 'walk_finish',
    CUDDLING: 'cuddling',
} as const;

export const COMMAND_ID = {
    UNDO: 'command:undo',
} as const;

export const MOVE_ID = {
    BASIC: 'basic',
    STRAIGHT_TURN: 'straight_turn',
    STRAIGHT_TURN_SELF: 'straight_turn_self',
    TWO_HAND_TURN: 'two_hand_turn',
    HAMMERLOCK_TURN: 'hammerlock_turn',
    HAMMERLOCK_TURN_SELF: 'hammerlock_turn_self',
    HAMMERUNLOCK_TURN: 'hammerunlock_turn',
    HAMMERUNLOCK_TURN_SELF: 'hammerunlock_turn_self',
    DEAD_TURN: 'dead_turn',
    WALK_ENTRY: 'walk_entry',
    WALK_EXIT_SIMPLE: 'walk_exit_simple',
    WALK_EXIT_WIDE: 'walk_exit_wide',
    CUDDLING_ENTRY: 'cuddling_entry',
    CUDDLING_EXIT: 'cuddling_exit',
    CROSS_BODY_LEAD: 'cross_body_lead',
    ABDOMINAL_TOUCH_TURN_SELF: 'abdominal_touch_turn_self',
    CLOSE_IN_TURN: 'close_in_turn',
    STEP_AWAY: 'step_away',
    CARESS: 'caress',
    CARESS_SELF: 'caress_self',
    SLIDE: 'slide',
} as const;

if (process.env.NODE_ENV === 'development') {
    throwIfHasDuplicates(Object.values(POSITION_ID));
    throwIfHasDuplicates([...Object.values(MOVE_ID), Object.values(COMMAND_ID)]);
}

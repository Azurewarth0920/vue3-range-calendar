# Events

Kinds of events are emitted from calendar component, you can use them to custom the behavior of the parent component.

## update:start
- Type: `string`

When start point is chosen, the start string will be emitted. The format of the payload will be followed with [deserializer](/options.html#deserializer).

It is also used v-model's two-way binding.

## update:end
- Type: `string`

When end point is chosen, the end string will be emitted. The format of the payload will be followed with [deserializer](/options.html#deserializer).

It is also used v-model's two-way binding.

## update:passive-start
- Type: `string`

Same with `update:start`, but this event will be only emitted when the `option.passive` is set to `true`.

## update:end
- Type: `string`

Same with `update:end`, but this event will be only emitted when the `option.passive` is set to `true`.

## hover-cell
- Type: `string`

When a cell is hovered, the payload of the cell will be emitted. The format of the payload will be followed with [deserializer](/options.html#deserializer).

## switch-next
- Type: `{ year: number, month: number }`

When the calendar is switched to next period, this event will be emitted, with the payload of month, year of next period.

## switch-prev
- Type: `{ year: number, month: number }`

When the calendar is switched to previous period, this event will be emitted, with the payload of month, year of previous period.

## switch-type
- Type: `{ type: 'date' | 'week' | 'month' | 'year', payload: { year: number, month: number }}`

When the calendar is switched to a different type (by clicking the button in the header, or clicking the cell), this event will be emitted.

The target type will be emitted, and if the type is switching from the bigger range to smaller range (Eg. `year` -> `month`, `month` -> `week`), the payload of chosen cell will be also emitted.

## apply

In passive mode, when apply button is clicked, this event will be emitted, at the same time, `update:start` and `update:end` will be also emitted with **chosen** value.

## cancel

In passive mode, when cancel button is clicked, this event will be emitted, at the same time, `update:start` and `update:end` will be also emitted with **origin** value.
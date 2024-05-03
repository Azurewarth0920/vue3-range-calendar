# Options

## type
- Type: `type: 'date' | 'week' | 'month' | 'year'`
- [Example](/example.html#_3-type)
- Default: `'date'`

The select type of calendar, `date`, `week`, `month`, `year` modes can be selected.

## attachElement
- Type: `attachElement: Ref<HTMLElement>`
- [Example](/example.html#_2-attach-element)

The element that the calendar will be attached to, the default direction will be `bottom`.
<br>
After passing the attachElement to the option, the calendar will be set to `position: absolute`.

## attachDirection
- Type: `attachDirection: 'top' | 'left' | 'bottom' | 'right'`
- [Example](/example.html#_2-attach-element)
- Default: `'bottom'`

The direction that element will be placed when attached to other element.

## fixedSpan
- Type: `fixedSpan: number`
- [Example](/example.html#_4-fixed-span)

Fix the selecting span to the provided value when selecting the range.

* This option will be ignored when type is set to `'week'`, because the week is already a kind of span.

## minSpan
- Type: `minSpan: number`
- [Example](/example.html#_5-min-span-and-max-span)

The minium span when selecting the range.

## maxSpan
- Type: `maxSpan: number`
- [Example](/example.html#_5-min-span-and-max-span)

The maximum span when selecting the range.

## preset
- Type: `{ text: string, ({ start, end }: { start: Date; end: Date }) => { start: Date, end: Date }[]`
- [Example](/example.html#_10-preset)

The preset range of calendar, passing the configuration functions to define preset range.

## unavailable
- Type: `unavailable?: { from?: Date; to?: Date }[]`
- [Example](/example.html#_6-unavailable)

To set the unavailable cells in the calendar.

## passive
- Type: `passive?: true | { applyText?: string; cancelText?: string }`
- [Example](/example.html#_7-passive-mode)

The passive mode, value will be emitted to the parent component after apply button is clicked.

## singleSelect
- Type: `singleSelect?: true`
- [Example](/example.html#_9-single-select-mode)

Set the calender to single select mode, instead of selecting range of date.

## formatters
- Type:
formatters?: {
  date?: (payload: { date: number; month: number; year: number; position: string; day: string }) => string
  month?: (payload: { month: number; year: number }) => string
  year?: (payload: { year: number }) => string
}

The formatters for the cell in each mode, you can customize the content by passing the custom function to the formatters.

## formatters
- Type:
formatters?: {
  date?: (payload: { date: number; month: number; year: number; position: string; day: string }) => string
  month?: (payload: { month: number; year: number }) => string
  year?: (payload: { year: number }) => string
}

The formatters for the cell in each mode, you can customize the content by passing the custom function to the formatters.

## serializer
- Type: `serializer: (dateString: string) => Date`

The serializer for define that how will the calendar parse the date string passing through v-model.
It should receive string and return date object.

## deserializer
- Type: `deserializer:(dateObj: Date) => string`

The deserializer for define that how will the calendar emit the select result to the parent component.
It should receive date object and return string.

## timeSelection
- Type: `timeSelection?: true`
- [Example](/example.html#_8-time-selecting)

Time selection will be enabled if this option is set to `true`

## timeOptions
- Type: 
```TypeScript
timeOptions?: {
  tick?: number
  singleSelect?: false
  span?: {
    from?: {
      hour?: number
      minute?: number
    }
    to?: {
      hour: number
      minute: number
    }
  }
}
```
- Default: `timeOptions: { tick: 10 }`

The options for customizing time selection.
- tick:
  - Use minute as unit to set the tick of the time.
- singleSelect:
  - To select a time point instead of time range. (it is available only when the calender itself is set to singleSelect)
- span:
  - The selectable range of time.

## weekOffset
- Type: `weekOffset: number`

Week starts from Sunday default but you let the week start from other weekday by modifying weekOffset.  
Eg. `weekOffset: 1` -> starts from Monday

## weekSpan
- Type: `weekSpan: { from: number, to: number }`

Set fixed week span in week selecting mode. (* Only available in week selecting mode.)  
Eg. `weekSpan: { from: 2, to: 4 }` -> in week selecting mode, only Wed, Thu, Fri can be selected. (In the condition that week starts from Sunday)

## count
- Type: `count: number`
- Default: `2`

Set the number of displayed calendar at same time.

## count
- Type: `locale: localeString`
- Default: `'en'`

Set the language of the calendar, used for name of weekday.

import { computed, defineComponent, PropType } from 'vue'
import { MINUTES_AN_HOUR } from '../constants'

export default defineComponent({
  props: {
    span: {
      type: Object as PropType<{
        from?: {
          hour?: number
          minute?: number
        }
        to?: {
          hour: number
          minute: number
        }
      }>,
      default: null,
    },
    tick: {
      type: Number,
      default: 1,
    },
    isRange: {
      type: Boolean,
      default: false,
    },
    isSameDay: {
      type: Boolean,
      required: true,
    },
    from: {
      type: String,
      default: null,
    },
    to: {
      type: String,
      default: null,
    },
  },
  emits: ['update:from', 'update:to'],
  setup(props, { emit }) {
    const from = computed({
      get: () => {
        const [hour, minute] = props.from?.split(':') ?? []
        return {
          hour: parseInt(hour || '0', 10),
          minute: parseInt(minute || '0', 10),
        }
      },
      set: ({ hour, minute }: { hour?: number; minute?: number }) => {
        emit('update:from', `${hour}:${minute}`)
      },
    })

    const to = computed({
      get: () => {
        const [hour, minute] = props.to?.split(':') ?? []
        return {
          hour: parseInt(hour || '0', 10),
          minute: parseInt(minute || '0', 10),
        }
      },
      set: ({ hour, minute }: { hour: number; minute: number }) => {
        emit('update:to', `${hour}:${minute}`)
      },
    })

    const fromMinute = computed({
      get: () => from.value.minute,
      set: (minute: number) => {
        from.value = { ...from.value, minute }
      },
    })

    const fromHour = computed({
      get: () => from.value.hour,
      set: (hour: number) => {
        from.value = { ...from.value, hour }
      },
    })
    const toMinute = computed({
      get: () => to.value.minute,
      set: (minute: number) => {
        to.value = { ...to.value, minute }
      },
    })
    const toHour = computed({
      get: () => to.value.hour,
      set: (hour: number) => {
        to.value = { ...to.value, hour }
      },
    })

    const fromSet = computed(() => {
      const spanFromHour = props.span?.from?.hour ?? 0
      const preset = [...Array(Math.floor(MINUTES_AN_HOUR / props.tick))].map(
        (_, i) => i * props.tick
      )

      return {
        hours: [...Array(24 - spanFromHour)].map((_, i) => spanFromHour + i),
        minutes: preset.length
          ? from.value.hour === spanFromHour
            ? preset.filter(minute => minute >= (props.span?.from?.minute ?? 0))
            : preset
          : [],
      }
    })

    const toSet = computed(() => {
      const spanToHour = props.span?.from?.hour ?? 0
      const offsetHour = props.isSameDay ? from.value.hour : 0
      const offsetMinutes =
        props.isSameDay && from.value.hour === to.value.hour
          ? from.value.minute
          : 0

      console.log(offsetMinutes)

      const preset = [...Array(Math.floor(MINUTES_AN_HOUR / props.tick))]
        .map((_, i) => i * props.tick)
        .filter(tick => tick >= offsetMinutes)

      return {
        hours: [...Array(24 - spanToHour - offsetHour)].map(
          (_, i) => offsetHour + i
        ),
        minutes: preset.length
          ? to.value.hour === spanToHour
            ? preset.filter(tick => (props.span?.to?.minute ?? 60) >= tick)
            : preset
          : [],
      }
    })

    return () => (
      <>
        <select v-model={fromHour.value} name="from-hour">
          {fromSet.value.hours.map(hour => (
            <option value={hour}>{hour}</option>
          ))}
        </select>
        <span>:</span>
        <select v-model={fromMinute.value} name="from-minutes">
          {fromSet.value.minutes.map(minute => (
            <option value={minute}>{minute}</option>
          ))}
        </select>
        <br />
        <select v-model={toHour.value} name="to-hour">
          {toSet.value.hours.map(hour => (
            <option value={hour}>{hour}</option>
          ))}
        </select>
        <span>:</span>
        <select v-model={toMinute.value} name="to-minutes">
          {toSet.value.minutes.map(minute => (
            <option value={minute}>{minute}</option>
          ))}
        </select>
      </>
    )
  },
})

import { FC, memo } from 'react'
import rangeMap from '@lib/range-map'
import { Star } from '@components/icons'
import cn from 'clsx'

export interface RatingProps {
  value: number,
  classes?: string,
}

const Quantity: FC<RatingProps> = ({ value = 5, classes= 'py-6' }) => (
  <div className={cn('flex flex-row text-accent-9', classes)}>
    {rangeMap(5, (i) => (
      <span
        key={`star_${i}`}
        className={cn('inline-block ml-1 ', {
          'text-accent-5': i >= Math.floor(value),
        })}
      >
        <Star />
      </span>
    ))}
  </div>
)

export default memo(Quantity)

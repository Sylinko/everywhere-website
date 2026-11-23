import type { ComponentProps } from 'react';

type Props = ComponentProps<'img'> & { priority?: boolean; fill?: boolean };

export function Image({ priority, fill, style, ...props }: Props) {
  return (
    <img
      loading={priority || props.fetchPriority === 'high' ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
      style={
        fill
          ? {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              ...style,
            }
          : style
      }
    />
  );
}
export default Image;

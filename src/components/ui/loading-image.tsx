import { useCallback, useState, type ComponentProps } from 'react';
import { L } from '@/localization/elements';
import { cn } from '@/lib/utils';
import './loading-image.css';

type Props = Omit<ComponentProps<'img'>, 'ref'>;

function ImageState({ className, onLoad, onError, ...props }: Props) {
  const [pending, setPending] = useState(true);
  const imageRef = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete) setPending(false);
  }, []);
  return <L.img
    {...props}
    className={cn(className, pending && 'hotel-image-loading')}
    aria-busy={pending}
    ref={imageRef}
    onLoad={(event) => { setPending(false); onLoad?.(event); }}
    onError={(event) => { setPending(false); onError?.(event); }}
  />;
}

// Keep the native image and its dimensions so cards and carousels do not shift.
export function LoadingImage(props: Props) {
  return <ImageState key={props.src} {...props} />;
}

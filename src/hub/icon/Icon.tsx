import {ArrowRight} from '@/hub/icon/paths/arrow-right';
import {ArrowUpRight} from '@/hub/icon/paths/arrow-up-right';
import {Github} from '@/hub/icon/paths/github';

/*
 * Types.
 */

type IconType = 'go' | 'external-link' | 'github';

type IconSize = 'sm' | 'md';

type IconProps = {
  type: IconType;
  size: IconSize;
  className?: string;
};

/*
 * Constants.
 */

/** Nucleo Micro draws on a 20px grid, so the viewBox matches it one to one. */
const GRID_PX = 20;

const SIZE_PX_MAP: Record<IconSize, number> = {
  sm: 16,
  md: 20
};

/*
 * Component.
 */

/**
 * Renders a licensed Nucleo icon by its hub role. Each path module is named after its Nucleo label so a
 * swap maps straight back to the library. Decorative by contract: the surrounding control carries the
 * accessible name.
 */
export function Icon({type, size, className}: IconProps) {
  const sizePx = SIZE_PX_MAP[size];

  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      height={sizePx}
      viewBox={`0 0 ${GRID_PX} ${GRID_PX}`}
      width={sizePx}
    >
      {renderPaths(type)}
    </svg>
  );
}

/*
 * Helpers.
 */

function renderPaths(type: IconType) {
  switch (type) {
    case 'go':
      return <ArrowRight />;
    case 'external-link':
      return <ArrowUpRight />;
    case 'github':
      return <Github />;
    default:
      throw new Error(`Unknown icon type: ${String(type)}`);
  }
}

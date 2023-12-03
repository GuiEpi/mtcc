export function LightBlurryBlob(props: {
  width: number | string;
  height: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
}) {
  const { width, height, top, right, bottom, left } = props;

  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        bottom,
        left,
        filter: `blur(120px)`,
        transform: `translate(-50%, 0)`,
      }}
    >
      <svg
        viewBox="0 0 900 900"
        preserveAspectRatio="none"
        width={width}
        height={height}
      >
        <g transform="translate(375.26202449907515 463.0883080270246)">
          <path
            fill="#873db1"
            d="M285.6 -265.9C379.4 -191.9 470.9 -95.9 474 3.1C477.1 102.1 391.6 204.1 297.9 262.6C204.1 321.1 102.1 336.1 -12.5 348.6C-127 361 -254.1 371.1 -301 312.6C-347.8 254.1 -314.6 127 -290.5 24C-266.5 -79 -251.7 -157.9 -204.8 -231.9C-157.9 -305.9 -79 -375 8.5 -383.4C95.9 -391.9 191.9 -339.9 285.6 -265.9"
          />
        </g>
      </svg>
    </div>
  );
}

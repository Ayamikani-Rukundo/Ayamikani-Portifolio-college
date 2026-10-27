export default function OpeningLoader() {
  return (
    <div className="opening-loader" role="status" aria-live="polite">
      <div className="loader-corner loader-corner-top">
        <span>✳</span>
        <span>01 / 04</span>
      </div>
      <div className="loader-orbit" aria-hidden="true">
        <i className="loader-disc disc-one" />
        <i className="loader-disc disc-two" />
        <i className="loader-disc disc-three" />
        <i className="loader-disc disc-four" />
        <i className="loader-disc disc-five" />
        <i className="loader-disc disc-six" />
        <i className="loader-core" />
      </div>
      <div className="loader-caption">
        <span className="loader-kicker">A little patience. A lot of possibility.</span>
        <strong>Ayamikani’s portfolio</strong>
        <span className="sr-only">Loading</span>
        <span className="loader-status"><i /> Loading the good things</span>
      </div>
      <div className="loader-corner loader-corner-bottom">
        <span>RWANDA</span>
        <span>✦ &nbsp; MAKE / LEARN / SHARE</span>
      </div>
    </div>
  );
}

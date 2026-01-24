import c from "./mainCard.module.css";

interface MainCardProps {
  codeLoaded: boolean;
  slugLoaded: boolean;
  audioLoaded: boolean;
  isLoaded: boolean;
  isPlaying: boolean;
  buttonText: string;
  onPlayClick: () => void;
}

function MainCard({
  codeLoaded,
  slugLoaded,
  audioLoaded,
  isLoaded,
  isPlaying,
  buttonText,
  onPlayClick,
}: MainCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayClick();
  };

  return (
    <div className={`${c.loading} ${isPlaying ? c.hidden : ""}`}>
      <div className={c.box}>
        <h1 className={c.title}>Polyop - Slug Chug</h1>
        <p>Presented in Berlin @ Deadline Demoparty 2025</p>
        <p className={c.credits}>
          visuals: wanze, music: jacknode, slug model: ls3dfx
        </p>
        <p className={c.portraitWarning}>
          Rotate your device for the best experience
        </p>

        <button
          className={`${c.playButton} ${isLoaded ? c.loaded : ""}`}
          onClick={handleClick}
        >
          <span>{buttonText}</span>
        </button>

        <ul className={c.statusList}>
          <li className={`${c.statusItem} ${codeLoaded ? c.loaded : ""}`}>
            Code
          </li>
          <li className={`${c.statusItem} ${slugLoaded ? c.loaded : ""}`}>
            Slug
          </li>
          <li className={`${c.statusItem} ${audioLoaded ? c.loaded : ""}`}>
            Audio
          </li>
        </ul>

        <p className={c.cta}>
          Head to <a href="http://polyop.uk">polyop.uk</a> for more sluggy fun
          <br /> or get the track on{" "}
          <a href="https://polyop.bandcamp.com/track/slug-chug-2">Bandcamp</a>
        </p>
      </div>
    </div>
  );
}

export default MainCard;

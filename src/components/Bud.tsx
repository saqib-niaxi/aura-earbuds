// CSS-drawn earbud. Colours come from the --body/--hi/--shade/--tip variables on .page.
export default function Bud() {
  return (
    <div className="bud" aria-hidden="true">
      <div className="tip" />
      <div className="stem" />
      <div className="head" />
      <div className="sensor" />
      <div className="mic" />
    </div>
  )
}

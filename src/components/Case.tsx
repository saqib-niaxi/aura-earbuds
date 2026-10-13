import Bud from './Bud'

// Charging case. The lid and the two rising buds are animated by the Reveal section.
export default function Case() {
  return (
    <div className="case" aria-hidden="true">
      <div className="well" />
      <div className="rise rise-l"><div className="rise-tilt"><Bud /></div></div>
      <div className="rise rise-r"><div className="rise-tilt"><Bud /></div></div>
      <div className="base" />
      <div className="lid" />
      <div className="led" />
    </div>
  )
}

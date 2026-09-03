/**
 * Building elevations for the estate map, drawn like the little houses on an
 * old illustrated county map. Every icon has its origin at ground centre and
 * is sized in viewBox units (the map is 720 x 900). Colors come from the
 * --m-* variables set on .estate-map so they follow the map's palette.
 */

const ink = { stroke: "var(--m-ink)", strokeOpacity: 0.6, strokeWidth: 0.7 } as const;

export function Manor() {
  return (
    <g>
      <ellipse cx="2" cy="2" rx="38" ry="5" fill="var(--m-shadow)" />
      {/* body */}
      <rect x="-30" y="-40" width="60" height="40" fill="var(--m-house)" {...ink} />
      {/* low hip roof and rooftop balustrade */}
      <path d="M-33 -40 L-27 -46 L27 -46 L33 -40 Z" fill="var(--m-roof)" />
      <line x1="-27" y1="-50" x2="27" y2="-50" {...ink} />
      {[-24, -18, -12, -6, 0, 6, 12, 18, 24].map((x) => (
        <rect key={x} x={x - 0.6} y="-50" width="1.2" height="4" fill="var(--m-house)" {...ink} strokeWidth="0.35" />
      ))}
      {/* chimneys */}
      <rect x="-23" y="-53" width="4.5" height="7" fill="var(--m-house)" {...ink} strokeWidth="0.5" />
      <rect x="18.5" y="-53" width="4.5" height="7" fill="var(--m-house)" {...ink} strokeWidth="0.5" />
      {/* windows with green shutters, two storeys */}
      {[-22, -11, 11, 22].map((x) =>
        [-35, -19].map((y) => (
          <g key={`${x}-${y}`}>
            <rect x={x - 3.6} y={y} width="1.5" height="8" fill="var(--m-roof)" />
            <rect x={x + 2.1} y={y} width="1.5" height="8" fill="var(--m-roof)" />
            <rect x={x - 2} y={y} width="4" height="8" fill="#cfe0e3" {...ink} strokeWidth="0.4" />
            <line x1={x} y1={y} x2={x} y2={y + 8} {...ink} strokeWidth="0.3" />
          </g>
        ))
      )}
      {/* front door with fanlight */}
      <rect x="-3" y="-15" width="6" height="15" fill="var(--m-house)" {...ink} />
      <path d="M-3 -15 A3 3 0 0 1 3 -15" fill="#cfe0e3" {...ink} strokeWidth="0.4" />
      <line x1="0" y1="-15" x2="0" y2="0" {...ink} strokeWidth="0.3" />
      {/* two-storey portico: entablature, columns, balcony rail */}
      <rect x="-15" y="-44" width="30" height="3.5" fill="var(--m-house)" {...ink} />
      {[-12.5, -4.2, 4.2, 12.5].map((x) => (
        <rect key={x} x={x - 1.1} y="-40.5" width="2.2" height="40.5" fill="var(--m-house)" {...ink} strokeWidth="0.5" />
      ))}
      <line x1="-15" y1="-21" x2="15" y2="-21" {...ink} />
      {[-10, -8, -6, 6, 8, 10].map((x) => (
        <line key={x} x1={x} y1="-21" x2={x} y2="-17" {...ink} strokeWidth="0.4" />
      ))}
      {/* steps and boxwoods */}
      <rect x="-9" y="0" width="18" height="2.2" fill="var(--m-line)" />
      <circle cx="-22" cy="0.5" r="3.2" fill="var(--m-tree2)" />
      <circle cx="-15" cy="1" r="2.4" fill="var(--m-tree)" />
      <circle cx="22" cy="0.5" r="3.2" fill="var(--m-tree2)" />
      <circle cx="15" cy="1" r="2.4" fill="var(--m-tree)" />
    </g>
  );
}

export function Pool() {
  return (
    <g>
      <rect x="-14" y="-8" width="28" height="15" rx="2.5" fill="var(--m-water)" stroke="var(--m-water2)" strokeWidth="1.2" />
      <path d="M-9 -3 C-6 -5 -3 -5 0 -3 M2 2 C5 0 8 0 11 2" fill="none" stroke="var(--m-house)" strokeWidth="0.8" strokeOpacity="0.9" />
      {[-9, -2, 5].map((x) => (
        <rect key={x} x={x} y="9" width="5" height="2.4" rx="0.6" fill="var(--m-house)" {...ink} strokeWidth="0.3" />
      ))}
    </g>
  );
}

export function Tent() {
  const pole = { stroke: "#8b6b3d", strokeWidth: 1.1, strokeLinecap: "round" } as const;
  return (
    <g>
      <ellipse cx="2" cy="2" rx="44" ry="5" fill="var(--m-shadow)" />
      {/* poles first, then the sailcloth over them */}
      <line x1="-18" y1="-46" x2="-18" y2="0" {...pole} />
      <line x1="18" y1="-46" x2="18" y2="0" {...pole} />
      <line x1="-38" y1="-14" x2="-38" y2="0" {...pole} />
      <line x1="38" y1="-14" x2="38" y2="0" {...pole} />
      <line x1="-38" y1="-13" x2="-47" y2="2" {...pole} strokeWidth="0.6" />
      <line x1="38" y1="-13" x2="47" y2="2" {...pole} strokeWidth="0.6" />
      {/* tables and string lights under the canopy */}
      {[-28, -10, 8, 26].map((x) => (
        <ellipse key={x} cx={x} cy="-3" rx="3.4" ry="1.8" fill="var(--m-field2)" {...ink} strokeWidth="0.3" />
      ))}
      <path d="M-36 -12 Q-18 -6 0 -12 Q18 -6 36 -12" fill="none" stroke="#e0b963" strokeWidth="0.7" strokeDasharray="0.8 2.4" />
      {/* canopy: two peaks, concave sailcloth edges, scalloped valance */}
      <path
        d="M-40 -13 C-31 -15 -24 -24 -18 -44 C-12 -24 -5 -15 0 -13 C5 -15 12 -24 18 -44 C24 -24 31 -15 40 -13 L40 -9 Q36 -6 32 -9 Q28 -6 24 -9 Q20 -6 16 -9 Q12 -6 8 -9 Q4 -6 0 -9 Q-4 -6 -8 -9 Q-12 -6 -16 -9 Q-20 -6 -24 -9 Q-28 -6 -32 -9 Q-36 -6 -40 -9 Z"
        fill="var(--m-house)"
        stroke="#966b22"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path d="M-18 -44 C-12 -24 -5 -15 0 -13 L0 -9 L-6 -9 C-9 -16 -14 -26 -18 -44 Z" fill="var(--m-ink)" fillOpacity="0.06" />
      <path d="M18 -44 C24 -24 31 -15 40 -13 L40 -9 L30 -9 C27 -16 22 -26 18 -44 Z" fill="var(--m-ink)" fillOpacity="0.06" />
      {/* pole tips and pennants */}
      <line x1="-18" y1="-44" x2="-18" y2="-50" {...pole} strokeWidth="0.8" />
      <line x1="18" y1="-44" x2="18" y2="-50" {...pole} strokeWidth="0.8" />
      <path d="M-18 -50 L-11 -48 L-18 -46 Z" fill="#b5583f" />
      <path d="M18 -50 L25 -48 L18 -46 Z" fill="#b5583f" />
    </g>
  );
}

export function Cabin() {
  return (
    <g>
      <ellipse cx="1" cy="2" rx="26" ry="4" fill="var(--m-shadow)" />
      {/* log walls with white chinking */}
      <rect x="-19" y="-27" width="38" height="27" fill="var(--m-cabin)" {...ink} />
      {[-24, -21, -18, -15, -12, -9, -6, -3].map((y) => (
        <line key={y} x1="-19" y1={y} x2="19" y2={y} stroke="#fbfaf7" strokeOpacity="0.6" strokeWidth="0.7" />
      ))}
      {/* green standing-seam roof and brick chimney */}
      <rect x="11" y="-41" width="4.5" height="9" fill="#a2543a" {...ink} strokeWidth="0.4" />
      <path d="M-23 -27 L-16 -36 L16 -36 L23 -27 Z" fill="var(--m-roof)" {...ink} strokeWidth="0.5" />
      {[-12, -6, 0, 6, 12].map((x) => (
        <line key={x} x1={x - 1.5} y1="-35.5" x2={x} y2="-27.5" stroke="#fbfaf7" strokeOpacity="0.35" strokeWidth="0.5" />
      ))}
      {/* upstairs windows */}
      {[-11, 7].map((x) => (
        <rect key={x} x={x} y="-24" width="5" height="5.5" fill="#cfe0e3" stroke="#fbfaf7" strokeWidth="0.8" />
      ))}
      {/* porch: door and window behind, then roof, posts, rail */}
      <rect x="-3" y="-13" width="6" height="13" fill="var(--m-ink)" fillOpacity="0.7" />
      <rect x="7" y="-13" width="5" height="5.5" fill="#cfe0e3" stroke="#fbfaf7" strokeWidth="0.8" />
      <rect x="-21" y="-16" width="42" height="2.6" fill="var(--m-roof)" {...ink} strokeWidth="0.4" />
      {[-18, -9, 9, 18].map((x) => (
        <rect key={x} x={x - 0.7} y="-13.4" width="1.4" height="13.4" fill="#e8dcc2" {...ink} strokeWidth="0.3" />
      ))}
      <line x1="-18" y1="-5" x2="-4" y2="-5" stroke="#e8dcc2" strokeWidth="0.9" />
      <line x1="4" y1="-5" x2="18" y2="-5" stroke="#e8dcc2" strokeWidth="0.9" />
      <rect x="-5" y="0" width="10" height="1.8" fill="var(--m-line)" />
    </g>
  );
}

export function Barn() {
  return (
    <g>
      <ellipse cx="2" cy="2" rx="32" ry="4.5" fill="var(--m-shadow)" />
      {/* black board walls, green gable roof, cupola */}
      <rect x="-26" y="-26" width="52" height="26" fill="var(--m-barn)" />
      {[-20, -14, -8, 8, 14, 20].map((x) => (
        <line key={x} x1={x} y1="-26" x2={x} y2="0" stroke="#fbfaf7" strokeOpacity="0.08" strokeWidth="0.6" />
      ))}
      <path d="M-29 -26 L0 -42 L29 -26 Z" fill="var(--m-roof)" {...ink} strokeWidth="0.5" />
      <path d="M-29 -26 L0 -42 L29 -26" fill="none" stroke="var(--m-barn)" strokeWidth="1.2" />
      <rect x="-3" y="-48" width="6" height="6" fill="var(--m-barn)" />
      <path d="M-4.5 -48 L0 -51.5 L4.5 -48 Z" fill="var(--m-roof)" />
      {/* hayloft door and the big white X doors */}
      <rect x="-4" y="-35" width="8" height="6.5" fill="var(--m-house)" />
      <path d="M-4 -35 L4 -28.5 M4 -35 L-4 -28.5" stroke="var(--m-roof)" strokeWidth="0.7" />
      <rect x="-11" y="-20" width="22" height="20" fill="var(--m-house)" />
      <path d="M-11 -20 L0 -10 L-11 0 M11 -20 L0 -10 L11 0 M0 -20 L0 0" stroke="var(--m-roof)" strokeWidth="0.9" fill="none" />
      <path d="M-11 -20 L11 -20" stroke="var(--m-roof)" strokeWidth="0.9" />
      {/* barn lamp and boxwoods */}
      <circle cx="0" cy="-22.5" r="1.6" fill="#e0b963" />
      <circle cx="-20" cy="0.5" r="3" fill="var(--m-tree2)" />
      <circle cx="20" cy="0.5" r="3" fill="var(--m-tree2)" />
    </g>
  );
}

export function Stables() {
  return (
    <g>
      <ellipse cx="2" cy="2" rx="40" ry="4.5" fill="var(--m-shadow)" />
      {/* long low stable block, green roof with overhang, cupola */}
      <rect x="-34" y="-18" width="68" height="18" fill="var(--m-barn)" fillOpacity="0.9" />
      <path d="M-38 -18 L-30 -27 L30 -27 L38 -18 Z" fill="var(--m-roof)" {...ink} strokeWidth="0.5" />
      <rect x="-2.5" y="-32" width="5" height="5" fill="var(--m-barn)" />
      <path d="M-4 -32 L0 -35 L4 -32 Z" fill="var(--m-roof)" />
      {/* six dutch stall doors, tops open */}
      {[-27, -16, -5, 6, 17, 28].map((x) => (
        <g key={x}>
          <rect x={x - 3.5} y="-14" width="7" height="14" fill="var(--m-house)" />
          <rect x={x - 3.5} y="-14" width="7" height="6" fill="var(--m-ink)" fillOpacity="0.55" />
          <path d={`M${x - 3.5} -8 L${x + 3.5} -8`} stroke="var(--m-roof)" strokeWidth="0.7" />
          <path d={`M${x - 3.5} -8 L${x + 3.5} 0 M${x + 3.5} -8 L${x - 3.5} 0`} stroke="var(--m-roof)" strokeWidth="0.5" />
        </g>
      ))}
      {/* a horse looking out of the second stall */}
      <path d="M-18 -13 c1.5-1.5 3.5-1.5 4.5 0 l0.5 2 -1 1 -3 0 -1.5-1.5z" fill="var(--m-tree3)" />
      {/* round pen and a bit of fence */}
      <ellipse cx="-56" cy="-2" rx="14" ry="6" fill="none" stroke="var(--m-fence)" strokeWidth="1.1" strokeDasharray="2 2.6" />
      <path d="M42 -6 L66 -8" stroke="var(--m-fence)" strokeWidth="1" />
      <path d="M42 -1 L66 -3" stroke="var(--m-fence)" strokeWidth="1" />
      {[42, 50, 58, 66].map((x) => (
        <line key={x} x1={x} y1="-9" x2={x} y2="1" stroke="var(--m-fence)" strokeWidth="1.2" />
      ))}
    </g>
  );
}

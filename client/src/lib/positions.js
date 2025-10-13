export const soccerPositions = {
  goalkeeper: [{ code: 'GK', label: 'Goalkeeper' }],
  defenders: [
    { code: 'CB', label: 'Centre Back' },
    { code: 'LB', label: 'Left Back' },
    { code: 'RB', label: 'Right Back' },
    { code: 'LWB', label: 'Left Wing Back' },
    { code: 'RWB', label: 'Right Wing Back' },
  ],
  midfielders: [
    { code: 'CDM', label: 'Defensive Midfielder' },
    { code: 'CM', label: 'Central Midfielder' },
    { code: 'CAM', label: 'Attacking Midfielder' },
    { code: 'LM', label: 'Left Midfielder' },
    { code: 'RM', label: 'Right Midfielder' },
  ],
  forwards: [
    { code: 'LW', label: 'Left Winger' },
    { code: 'RW', label: 'Right Winger' },
    { code: 'LF', label: 'Left Forward' },
    { code: 'RF', label: 'Right Forward' },
    { code: 'CF', label: 'Centre Forward' },
    { code: 'ST', label: 'Striker' },
  ],
}

export const soccerPositionCodes = Object.values(soccerPositions)
  .flat()
  .map((pos) => pos.code)

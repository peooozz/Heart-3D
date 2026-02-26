export interface HeartRegion {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  geometry: 'sphere' | 'cylinder' | 'ellipsoid';
  functions: string[];
  facts: string[];
  disorders: string[];
  description: string;
  isInner?: boolean;
}

const MUSCLE_COLOR = '#475569'; // slate-600
const AORTA_COLOR = '#64748b'; // slate-500
const VEIN_COLOR = '#94a3b8'; // slate-400
const FAT_COLOR = '#cbd5e1'; // slate-300

export const HEART_REGIONS: HeartRegion[] = [
  {
    id: 'left_ventricle',
    name: 'Left Ventricle',
    color: MUSCLE_COLOR,
    position: [1.361, -0.539, 0.088],
    scale: [0.9, 1.2, 0.9],
    rotation: [0.2, 0, 0.3],
    geometry: 'ellipsoid',
    description: 'The thickest of the heart\'s chambers and is responsible for pumping oxygenated blood to tissues all over the body.',
    functions: ['Pumps oxygenated blood to the body', 'Maintains systemic blood pressure'],
    facts: ['It has the thickest walls of all chambers.', 'It pumps at high pressure to reach the entire body.'],
    disorders: ['Left ventricular hypertrophy', 'Heart failure']
  },
  {
    id: 'right_ventricle',
    name: 'Right Ventricle',
    color: MUSCLE_COLOR,
    position: [-0.245, -0.587, 1.065],
    scale: [0.8, 1.0, 0.8],
    rotation: [0.1, 0, -0.2],
    geometry: 'ellipsoid',
    description: 'The chamber that pumps deoxygenated blood to the lungs.',
    functions: ['Pumps deoxygenated blood to the lungs via the pulmonary artery'],
    facts: ['Its walls are thinner than the left ventricle.', 'It pumps blood at a lower pressure.'],
    disorders: ['Right ventricular failure', 'Arrhythmogenic right ventricular dysplasia']
  },
  {
    id: 'left_atrium',
    name: 'Left Atrium',
    color: MUSCLE_COLOR,
    position: [0.405, 0.350, -0.252],
    scale: [0.6, 0.5, 0.6],
    geometry: 'sphere',
    description: 'Receives oxygenated blood from the lungs and pumps it into the left ventricle.',
    functions: ['Receives oxygenated blood from pulmonary veins', 'Pumps blood to left ventricle'],
    facts: ['It is located on the posterior aspect of the heart.', 'The walls are relatively thin.'],
    disorders: ['Atrial fibrillation', 'Mitral valve stenosis']
  },
  {
    id: 'right_atrium',
    name: 'Right Atrium',
    color: MUSCLE_COLOR,
    position: [-0.154, 1.788, -0.376],
    scale: [0.6, 0.5, 0.6],
    geometry: 'sphere',
    description: 'Receives deoxygenated blood from the body through the vena cava and pumps it into the right ventricle.',
    functions: ['Receives deoxygenated blood from the body', 'Pumps blood to right ventricle', 'Contains the SA node (pacemaker)'],
    facts: ['Contains the sinoatrial (SA) node, the natural pacemaker.', 'Receives blood from three veins.'],
    disorders: ['Atrial flutter', 'Tricuspid regurgitation']
  },
  {
    id: 'aorta',
    name: 'Aorta',
    color: AORTA_COLOR,
    position: [-0.213, 1.080, 0.001],
    scale: [0.4, 0.8, 0.4],
    rotation: [0, 0, 0.2],
    geometry: 'cylinder',
    description: 'The largest artery in the body. It carries oxygen-rich blood from the left ventricle to the rest of the body.',
    functions: ['Distributes oxygenated blood to all parts of the body'],
    facts: ['It is roughly the diameter of a garden hose.', 'The wall is very elastic to handle high pressure.'],
    disorders: ['Aortic aneurysm', 'Aortic dissection']
  },
  {
    id: 'pulmonary_artery',
    name: 'Pulmonary Artery',
    color: VEIN_COLOR,
    position: [-0.893, 1.215, -0.176],
    scale: [0.35, 0.7, 0.35],
    rotation: [0.3, 0, -0.4],
    geometry: 'cylinder',
    description: 'Carries deoxygenated blood from the right ventricle to the lungs.',
    functions: ['Transports oxygen-depleted blood to the lungs for oxygenation'],
    facts: ['It is the only artery that carries deoxygenated blood.', 'It branches into the left and right pulmonary arteries.'],
    disorders: ['Pulmonary hypertension', 'Pulmonary embolism']
  },
  {
    id: 'superior_vena_cava',
    name: 'Superior Vena Cava',
    color: VEIN_COLOR,
    position: [-1.131, 0.615, -0.377],
    scale: [0.3, 0.6, 0.3],
    rotation: [0, 0, 0],
    geometry: 'cylinder',
    description: 'A large vein carrying deoxygenated blood from the upper body to the right atrium.',
    functions: ['Returns deoxygenated blood from the upper half of the body to the heart'],
    facts: ['It is one of the two major veins returning blood to the heart.', 'It lacks valves.'],
    disorders: ['Superior vena cava syndrome']
  }
];

export const DID_YOU_KNOW_FACTS = [
  'The human heart beats approximately 100,000 times a day.',
  'Your heart pumps about 2,000 gallons of blood every day.',
  'An adult heart is roughly the size of two hands clasped together.',
  'The heart can continue beating out of the body if it has enough oxygen.',
  'The right side of your heart pumps blood into your lungs.',
  'The left side of your heart pumps blood to the rest of your body.',
  'Your system of blood vessels is over 60,000 miles long.'
];

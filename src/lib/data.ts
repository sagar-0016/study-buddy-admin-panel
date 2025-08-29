import type { Syllabus, ChartData, BarChartData, RevisionTopic, Question, BrainstormingTopic, Lecture, Doubt, TechnicalHelp, ScheduleTask } from './types';

export const syllabusData: Syllabus = {
  physics: {
    label: 'Physics',
    chapters: [
      {
        title: 'Mechanics',
        topics: [
          { name: 'Physics and Measurement', weightage: 3, unit: 'Mechanics' },
          { name: 'Kinematics', weightage: 5, unit: 'Mechanics' },
          { name: 'Laws of Motion', weightage: 4, unit: 'Mechanics' },
          { name: 'Work, Energy and Power', weightage: 4, unit: 'Mechanics' },
          { name: 'Rotational Motion', weightage: 5, unit: 'Mechanics' },
          { name: 'Gravitation', weightage: 3, unit: 'Mechanics' },
          { name: 'Properties of Solids and Liquids', weightage: 2, unit: 'Mechanics' },
        ],
      },
      {
        title: 'Thermodynamics',
        topics: [
          { name: 'Thermodynamics', weightage: 5, unit: 'Thermodynamics' },
          { name: 'Kinetic Theory of Gases', weightage: 2, unit: 'Thermodynamics' },
        ],
      },
      {
        title: 'Oscillations & Waves',
        topics: [{ name: 'Oscillations and Waves', weightage: 4, unit: 'Oscillations & Waves' }],
      },
      {
        title: 'Electrostatics & Magnetism',
        topics: [
            { name: 'Electrostatics', weightage: 5, unit: 'Electrostatics & Magnetism' },
            { name: 'Current Electricity', weightage: 5, unit: 'Electrostatics & Magnetism' },
            { name: 'Capacitors', weightage: 3, unit: 'Electrostatics & Magnetism' },
            { name: 'Magnetic Effect of Current', weightage: 4, unit: 'Electrostatics & Magnetism' },
            { name: 'Magnetism', weightage: 2, unit: 'Electrostatics & Magnetism' },
            { name: 'Electromagnetic Induction', weightage: 4, unit: 'Electrostatics & Magnetism' },
            { name: 'Alternating Current', weightage: 3, unit: 'Electrostatics & Magnetism' },
        ]
      },
      {
        title: 'Optics & Modern Physics',
        topics: [
            { name: 'Geometrical Optics', weightage: 4, unit: 'Optics & Modern Physics' },
            { name: 'Electromagnetic Waves', weightage: 2, unit: 'Optics & Modern Physics' },
            { name: 'Waves Optics', weightage: 3, unit: 'Optics & Modern Physics' },
            { name: 'Modern Physics', weightage: 5, unit: 'Optics & Modern Physics' },
            { name: 'Errors and Instruments', weightage: 1, unit: 'Optics & Modern Physics' },
            { name: 'Semiconductors', weightage: 3, unit: 'Optics & Modern Physics' }
        ]
      }
    ],
  },
  chemistry: {
    label: 'Chemistry',
    chapters: [
      {
        title: 'Physical Chemistry I',
        topics: [
          { name: 'Some Basic Concepts in Chemistry', weightage: 3, unit: 'Physical Chemistry I' },
          { name: 'States of Matter', weightage: 2, unit: 'Physical Chemistry I' },
          { name: 'Atomic Structure', weightage: 4, unit: 'Physical Chemistry I' },
          { name: 'Chemical Bonding and Molecular Structure', weightage: 5, unit: 'Physical Chemistry I' },
          { name: 'Chemical Thermodynamics', weightage: 4, unit: 'Physical Chemistry I' },
          { name: 'Solutions', weightage: 3, unit: 'Physical Chemistry I' },
          { name: 'Equilibrium', weightage: 4, unit: 'Physical Chemistry I' },
          { name: 'Redox Reactions and Electrochemistry', weightage: 2, unit: 'Physical Chemistry I' },
          { name: 'Chemical Kinetics', weightage: 3, unit: 'Physical Chemistry I' },
        ],
      },
       {
        title: 'Physical Chemistry II',
        topics: [
          { name: 'Liquid Solution', weightage: 4, unit: 'Physical Chemistry II' },
          { name: 'Electrochemistry', weightage: 4, unit: 'Physical Chemistry II' },
          { name: 'Solid State', weightage: 2, unit: 'Physical Chemistry II' },
          { name: 'Surface Chemistry', weightage: 1, unit: 'Physical Chemistry II' },
          { name: 'Chemical Kinetics', weightage: 3, unit: 'Physical Chemistry II' },
        ],
      },
      {
        title: 'Inorganic Chemistry',
        topics: [
          { name: 'Classification of Elements and Periodicity in Properties', weightage: 3, unit: 'Inorganic Chemistry' },
          { name: 'Hydrogen', weightage: 1, unit: 'Inorganic Chemistry' },
          { name: 's-Block Elements', weightage: 2, unit: 'Inorganic Chemistry' },
          { name: 'p-Block Elements', weightage: 5, unit: 'Inorganic Chemistry' },
          { name: 'd and f-Block Elements', weightage: 4, unit: 'Inorganic Chemistry' },
          { name: 'Coordination Compounds', weightage: 5, unit: 'Inorganic Chemistry' },
          { name: 'Environmental Chemistry', weightage: 1, unit: 'Inorganic Chemistry' },
          { name: 'General Principles and Processes of Isolation of Metals (Metallurgy)', weightage: 2, unit: 'Inorganic Chemistry' },
          { name: 'Qualitative Analysis (SALT ANALYSIS)', weightage: 3, unit: 'Inorganic Chemistry' },
        ],
      },
      {
        title: 'Organic Chemistry',
        topics: [
          { name: 'Purification and Characterization of Organic Compounds', weightage: 1, unit: 'Organic Chemistry' },
          { name: 'Some Basic Principles of Organic Chemistry', weightage: 5, unit: 'Organic Chemistry' },
          { name: 'Hydrocarbons', weightage: 4, unit: 'Organic Chemistry' },
          { name: 'Organic Compounds Containing Halogens (Haloalkanes, Grignard\'s Reagent, Reduction, Oxidation)', weightage: 3, unit: 'Organic Chemistry' },
          { name: 'Organic Compounds Containing Oxygen (Alcohols and Ethers)', weightage: 4, unit: 'Organic Chemistry' },
          { name: 'Organic Compounds Containing Nitrogen (Aromatic Compound, Carbonyl Compound, Carboxylic Acid and Derivatives)', weightage: 4, unit: 'Organic Chemistry' },
          { name: 'Biomolecules', weightage: 2, unit: 'Organic Chemistry' },
          { name: 'Polymers', weightage: 2, unit: 'Organic Chemistry' },
          { name: 'Chemistry in Everyday Life', weightage: 1, unit: 'Organic Chemistry' },
          { name: 'Principles Related to Practical Chemistry (POC)', weightage: 1, unit: 'Organic Chemistry' },
          { name: 'Reaction Mechanism', weightage: 5, unit: 'Organic Chemistry' },
        ],
      },
    ],
  },
  maths: {
    label: 'Maths',
    chapters: [
      {
        title: 'Algebra',
        topics: [
          { name: 'Sets, Relations and Functions', weightage: 3, unit: 'Algebra' },
          { name: 'Complex Numbers and Quadratic Equations', weightage: 4, unit: 'Algebra' },
          { name: 'Matrices and Determinants', weightage: 4, unit: 'Algebra' },
          { name: 'Permutations and Combinations', weightage: 3, unit: 'Algebra' },
          { name: 'Mathematical Induction', weightage: 1, unit: 'Algebra' },
          { name: 'Binomial Theorem and its Simple Applications', weightage: 3, unit: 'Algebra' },
          { name: 'Sequences and Series', weightage: 4, unit: 'Algebra' },
        ],
      },
       {
        title: 'Calculus',
        topics: [
          { name: 'Limits, Continuity and Differentiability', weightage: 5, unit: 'Calculus' },
          { name: 'Integral Calculus (Indefinite & Definite Integration)', weightage: 5, unit: 'Calculus' },
          { name: 'Differential Equations', weightage: 4, unit: 'Calculus' },
          { name: 'Methods of Differentiation', weightage: 3, unit: 'Calculus' },
          { name: 'Tangent and Normal', weightage: 2, unit: 'Calculus' },
          { name: 'Monotonicity', weightage: 2, unit: 'Calculus' },
          { name: 'Maxima and Minima', weightage: 3, unit: 'Calculus' },
          { name: 'Area Under The Curve', weightage: 3, unit: 'Calculus' },
        ],
      },
       {
        title: 'Coordinate Geometry',
        topics: [
          { name: 'Straight Lines', weightage: 4, unit: 'Coordinate Geometry' },
          { name: 'Circles', weightage: 3, unit: 'Coordinate Geometry' },
          { name: 'Conic Sections', weightage: 5, unit: 'Coordinate Geometry' },
          { name: 'Three Dimensional Geometry', weightage: 4, unit: 'Coordinate Geometry' },
          { name: 'Vector Algebra', weightage: 4, unit: 'Coordinate Geometry' },
        ],
      },
      {
        title: 'Trigonometry & Probability',
        topics: [
          { name: 'Trigonometrical Ratios and Identities', weightage: 2, unit: 'Trigonometry & Probability' },
          { name: 'Trigonometric Equations', weightage: 3, unit: 'Trigonometry & Probability' },
          { name: 'Inverse Trigonometric Functions', weightage: 2, unit: 'Trigonometry & Probability' },
          { name: 'Heights and Distances', weightage: 1, unit: 'Trigonometry & Probability' },
          { name: 'Statistics and Probability', weightage: 4, unit: 'Trigonometry & Probability' },
          { name: 'Mathematical Reasoning', weightage: 1, unit: 'Trigonometry & Probability' },
        ],
      },
      {
        title: 'Advanced Topics',
        topics: [
            { name: 'Relation, Function, Inverse Trigonometric Function', weightage: 3, unit: 'Advanced Topics' },
            { name: 'Matrices', weightage: 4, unit: 'Advanced Topics' },
            { name: 'Probability', weightage: 4, unit: 'Advanced Topics' },
            { name: 'Complex Numbers', weightage: 4, unit: 'Advanced Topics' }
        ]
      }
    ],
  },
};

export const progressChartData: ChartData = [
  { month: 'Jan', completed: 10 },
  { month: 'Feb', completed: 25 },
  { month: 'Mar', completed: 45 },
  { month: 'Apr', completed: 60 },
  { month: 'May', completed: 75 },
  { month: 'Jun', completed: 85 },
];

export const quizScoresData: BarChartData = [
    { subject: 'Physics', score: 75 },
    { subject: 'Chemistry', score: 82 },
    { subject: 'Maths', score: 68 },
];

export const completionData: ChartData = [
  { subject: 'Physics', value: 60, fill: "var(--color-chart-1)" },
  { subject: 'Chemistry', value: 80, fill: "var(--color-chart-2)" },
  { subject: 'Maths', value: 45, fill: "var(--color-chart-3)" },
];

export const quizHistoryForFeedback = `
- Topic: Kinematics, Score: 65%
- Topic: Chemical Bonding, Score: 85%
- Topic: Quadratic Equations, Score: 90%
- Topic: Thermodynamics, Score: 55%
- Topic: Organic Chemistry - Basic Principles, Score: 70%
- Topic: Integrals, Score: 95%
- Topic: Rotational Motion, Score: 60%
`;

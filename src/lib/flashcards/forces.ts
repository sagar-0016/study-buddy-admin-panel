
import type { Flashcard } from '@/lib/types';

export const forcesFlashcards: Flashcard[] = [
    {
      id: 1,
      question:
        "A block is on a rough horizontal surface and a force is applied at an angle. Why might the block not move even if F > μN?",
      answer:
        "The normal force changes due to the vertical component of F; μN is not constant.",
    },
    {
      id: 2,
      question:
        "In a two-block system with tension, why is acceleration not the same when surfaces have friction?",
      answer:
        "Friction introduces different net forces; both blocks respond differently unless they are constrained.",
    },
    {
      id: 3,
      question:
        "A block is placed on a wedge and the wedge is accelerated horizontally. What condition makes the block stationary relative to the wedge?",
      answer: "a = g·tanθ, where θ is the angle of the wedge.",
    },
    {
      id: 4,
      question:
        "In an elevator accelerating upward, what is the normal reaction on a person?",
      answer: "N = m(g + a); apparent weight increases.",
    },
    {
      id: 5,
      question: "Why is pseudo force applied in non-inertial frames?",
      answer:
        "To make Newton's Second Law applicable from a non-inertial frame of reference.",
    },
    {
      id: 6,
      question:
        "If a body is in equilibrium under three forces, what must be true geometrically?",
      answer:
        "The forces must be concurrent and form a closed triangle (Lami’s Theorem).",
    },
    {
      id: 7,
      question:
        "What is the net force on a block sliding down a rough incline at constant speed?",
      answer: "Zero, as kinetic friction balances component of gravity.",
    },
    {
      id: 8,
      question:
        "Two blocks A and B are connected by a string over a pulley, A on a table. Why does friction not always act opposite to motion?",
      answer: "Friction always opposes *relative* motion, not net motion.",
    },
    {
      id: 9,
      question:
        "Block A is on B, and B is on a smooth surface. A force is applied on B. Why might A slide on B?",
      answer:
        "If force exceeds limiting friction between A and B, relative motion begins.",
    },
    {
      id: 10,
      question:
        "A car takes a turn on a level road. What is the source of centripetal force?",
      answer: "Static friction between tyres and road.",
    },
    {
      id: 11,
      question:
        "In a pulley system with friction on a table, how does friction affect tension?",
      answer:
        "It reduces the net force needed to move the block, thus reducing tension on that side.",
    },
    {
      id: 12,
      question:
        "Block A is stacked on block B. B is pulled. What must be true to avoid slipping of A?",
      answer:
        "Friction between A and B must provide enough acceleration: f ≤ μN and a ≤ μg.",
    },
    {
      id: 13,
      question:
        "When can normal reaction be zero even when the object is in contact?",
      answer:
        "If the surface accelerates downward faster than g or if the object is in a pseudo-free fall.",
    },
    {
      id: 14,
      question:
        "A block is kept against a wall and a horizontal force is applied. What keeps the block from falling?",
      answer:
        "Static friction acting vertically upward counters gravity; normal reaction is due to applied force.",
    },
    {
      id: 15,
      question:
        "In a system with two pulleys and three masses, how do you approach finding accelerations?",
      answer:
        "Use constraints from strings and apply Newton’s Second Law for each mass separately.",
    },
    {
      id: 16,
      question:
        "What causes pseudo force in a non-inertial frame, and what is its direction?",
      answer:
        "It arises from acceleration of the frame and acts opposite to that acceleration on every mass.",
    },
    {
      id: 17,
      question: "Why is kinetic friction independent of velocity?",
      answer:
        "Because kinetic friction depends only on the nature of surfaces and normal force, not speed.",
    },
    {
      id: 18,
      question:
        "A block is projected up a rough incline. Where does friction act?",
      answer: "Down the incline, opposing upward motion of the block.",
    },
    {
      id: 19,
      question:
        "A block is sliding down a rough incline. Where does friction act?",
      answer: "Up the incline, opposing the motion.",
    },
    {
      id: 20,
      question:
        "Two blocks are connected on an incline by a string. How does friction influence motion?",
      answer:
        "It alters net force on each block and may affect whether motion occurs or remains static.",
    },
    {
      id: 21,
      question:
        "A coin placed on a rotating disc flies off tangentially. Why?",
      answer:
        "No sufficient static friction to provide required centripetal force, so it moves tangentially.",
    },
    {
      id: 22,
      question: "Can friction do positive work?",
      answer:
        "Yes, in cases like walking, where friction enables forward motion.",
    },
    {
      id: 23,
      question:
        "In circular motion on a banked road, what happens if there's no friction?",
      answer:
        "Banking alone provides the necessary centripetal force at one particular speed.",
    },
    {
      id: 24,
      question:
        "Block on wedge problem: What does it mean if normal reaction becomes zero?",
      answer:
        "The body is losing contact with the surface—possibly airborne.",
    },
    {
      id: 25,
      question: "Can friction ever increase acceleration?",
      answer:
        "Yes, in rolling without slipping or when a block pushes another, friction can help transmit force.",
    },
    {
      id: 26,
      question:
        "On an incline, a body is at rest. What direction does static friction act?",
      answer: "Up the incline, opposing tendency to slide down.",
    },
    {
      id: 27,
      question:
        "Two masses on opposite sides of pulley, one on a rough surface. How to approach acceleration?",
      answer:
        "Draw FBDs, apply Newton's law including friction, and use tension + constraint equations.",
    },
    {
      id: 28,
      question:
        "A rope pulls a block at an angle θ with friction. Why does friction sometimes increase with θ?",
      answer:
        "Vertical component of tension reduces normal reaction, affecting friction magnitude.",
    },
    {
      id: 29,
      question: "When can the frictional force be zero despite contact?",
      answer:
        "If there’s no relative tendency of motion and no external force along the surface.",
    },
    {
      id: 30,
      question:
        "What is the key assumption in frictional force calculations in JEE problems?",
      answer:
        "That limiting friction is not exceeded unless explicitly stated; static friction ≤ μN.",
    },
    {
      id: 31,
      question:
        "Block A is on a smooth wedge. Wedge is accelerated horizontally. What must be the minimum acceleration to keep A stuck to the wedge?",
      answer: "a_min = g·tanθ",
    },
    {
      id: 32,
      question:
        "What is the common error when analyzing tension in a frictional pulley system?",
      answer:
        "Assuming tension is equal on both sides even when friction or mass of pulley exists.",
    },
    {
      id: 33,
      question:
        "How do you determine direction of friction in rolling without slipping?",
      answer:
        "Use torque and net acceleration; friction opposes relative slipping, not motion.",
    },
    {
      id: 34,
      question:
        "A man stands in an accelerating lift. What is his apparent weight if the lift accelerates downward?",
      answer: "Apparent weight = m(g - a)",
    },
    {
      id: 35,
      question:
        "What is the force required to keep a block pressed against a vertical wall using only horizontal force?",
      answer: "F ≥ mg/μ (where μ is coefficient of static friction)",
    },
    {
      id: 36,
      question:
        "A block is at rest inside a lift accelerating downward. What direction is the pseudo force?",
      answer: "Upward, opposite to lift's acceleration.",
    },
    {
      id: 37,
      question:
        "Why can friction be treated as an internal constraint in certain systems?",
      answer:
        "Because it enforces rolling/no-slipping without appearing as an external work-producing force.",
    },
    {
      id: 38,
      question:
        "How does tension transmit force in multi-block systems with friction?",
      answer:
        "It acts like a force chain, distributing net applied force minus friction among blocks.",
    },
    {
      id: 39,
      question:
        "What determines whether an object remains stationary on a moving surface?",
      answer:
        "Whether pseudo force can be balanced by maximum static friction.",
    },
    {
      id: 40,
      question:
        "How does friction act in circular motion on a banked surface when car speed is below ideal?",
      answer: "Up the incline, providing additional centripetal force.",
    },
    {
      id: 41,
      question:
        "When does kinetic friction exceed static friction in a problem setup?",
      answer:
        "It never does; static friction is always ≥ kinetic friction. If it seems otherwise, recheck assumptions.",
    },
    {
      id: 42,
      question:
        "In solving pulley-block systems, why must constraint equations be used?",
      answer:
        "They link the accelerations of different masses due to connected motion.",
    },
    {
      id: 43,
      question:
        "How to decide direction of pseudo force in inclined plane inside accelerating lift?",
      answer:
        "Same direction as the opposite of acceleration of the lift, resolve pseudo force along incline.",
    },
    {
      id: 44,
      question:
        "Block pushed up a rough incline with force at angle. Why can friction reverse during motion?",
      answer:
        "As direction of relative motion changes (up vs. down), so does friction.",
    },
    {
      id: 45,
      question: "What makes friction a non-conservative force?",
      answer:
        "Work done by friction depends on path and always results in mechanical energy loss.",
    },
    {
      id: 46,
      question: "Is the work done by tension always positive in a system?",
      answer:
        "No, depends on direction of displacement; in pulleys, it can be negative for one mass.",
    },
    {
      id: 47,
      question:
        "In a block-on-block system, what happens if the lower block is given a jerk?",
      answer:
        "The upper block may lag momentarily, leading to slipping if friction is insufficient.",
    },
    {
      id: 48,
      question:
        "How does friction influence equilibrium of L-shaped or extended objects?",
      answer:
        "It provides torque in addition to force balance, crucial in rotational equilibrium.",
    },
    {
      id: 49,
      question:
        "Why is it wrong to apply Newton's third law between friction and normal force?",
      answer:
        "They are different components of the contact force and act on the same body.",
    },
    {
      id: 50,
      question:
        "What causes a sudden change in frictional force during rolling to sliding transition?",
      answer:
        "Loss of static contact means kinetic friction takes over, causing sharp deceleration.",
    },
    {
      id: 51,
      question:
        "In vertical circular motion, what is the minimum speed required at the top of the loop for a body to stay in contact?",
      answer: "v_min = √(gR), where R is radius of the loop.",
    },
    {
      id: 52,
      question:
        "What happens to tension at the top of vertical circular motion at minimum speed?",
      answer:
        "It becomes zero; normal force just vanishes to maintain contact.",
    },
    {
      id: 53,
      question:
        "A block slides off a moving wedge. Why is acceleration of the block not equal to g sinθ?",
      answer:
        "Because the wedge is also accelerating; relative motion changes net effective acceleration.",
    },
    {
      id: 54,
      question:
        "In variable mass systems (like a leaking cart), does Newton's second law still hold as F = ma?",
      answer: "No, use F = d(mv)/dt = m·a + v·dm/dt",
    },
    {
      id: 55,
      question:
        "Why is friction not necessarily present even if surfaces are rough?",
      answer:
        "Friction only acts if there's a tendency of relative motion.",
    },
    {
      id: 56,
      question:
        "In a problem with multiple contact surfaces, how do you decide direction of contact force?",
      answer:
        "Use FBDs and check which way motion or pseudo force tries to push each body.",
    },
    {
      id: 57,
      question:
        "What concept helps simplify pulley systems on inclined planes with friction?",
      answer:
        "Use net effective force along incline and constraint acceleration relationships.",
    },
    {
      id: 58,
      question:
        "A monkey climbs a rope attached to a pulley. What additional concept must be considered?",
      answer:
        "Variable tension due to monkey’s acceleration and motion relative to the rope.",
    },
    {
      id: 59,
      question:
        "A mass hangs from a pulley system in a lift. How does lift’s motion affect tension?",
      answer:
        "Upward acceleration increases tension, downward decreases it.",
    },
    {
      id: 60,
      question: "Why do problems often neglect mass of pulley or string?",
      answer:
        "To keep tension same throughout and avoid rotational dynamics.",
    },
    {
      id: 61,
      question: "Can friction act perpendicular to motion?",
      answer:
        "Yes, in circular motion it acts radially inward (centripetal).",
    },
    {
      id: 62,
      question: "What makes static friction a variable force?",
      answer:
        "It adjusts to oppose relative motion, up to a maximum limit (μN).",
    },
    {
      id: 63,
      question:
        "What happens if net external force is zero but internal tension exists?",
      answer:
        "System may remain at rest or move uniformly; internal forces don't affect CM motion.",
    },
    {
      id: 64,
      question:
        "A block is pushed against a rough wall with variable force. How does friction vary?",
      answer:
        "Friction increases until limiting value is reached, then block slips.",
    },
    {
      id: 65,
      question:
        "How does rope tension distribute in pulleys when the rope is non-massless?",
      answer:
        "Tension becomes unequal across the rope due to internal mass segments.",
    },
    {
      id: 66,
      question: "Is normal reaction always perpendicular to surface?",
      answer: "Yes, by definition of contact force components.",
    },
    {
      id: 67,
      question: "Can the friction force be more than μN in any situation?",
      answer: "No, static friction ≤ μN; kinetic friction = μkN always.",
    },
    {
      id: 68,
      question:
        "What is the condition for zero acceleration in multi-body horizontal systems with friction?",
      answer: "Net applied force = total frictional resistance.",
    },
    {
      id: 69,
      question:
        "In vertical pulley problems with unequal masses, what causes motion?",
      answer: "Difference in weights creates net unbalanced force.",
    },
    {
      id: 70,
      question:
        "Why can’t you apply Newton’s third law between components of same force (like friction and normal)?",
      answer:
        "They are orthogonal components of the same contact force, not a third-law pair.",
    },
    {
      id: 71,
      question:
        "In a two-body system, why is internal friction irrelevant for center of mass acceleration?",
      answer:
        "Internal forces cancel out when applying Newton’s second law to the system as a whole.",
    },
    {
      id: 72,
      question:
        "Why does a body experience backward pseudo force in a forward-accelerating car?",
      answer:
        "Because the car is a non-inertial frame; pseudo force acts opposite to its acceleration.",
    },
    {
      id: 73,
      question:
        "A small block is placed on a larger block. The system accelerates. What determines the friction direction on the smaller block?",
      answer:
        "Relative tendency — friction acts to make small block follow large block (forward).",
    },
    {
      id: 74,
      question:
        "What is the maximum acceleration of a block so that another block on top doesn't slip?",
      answer:
        "a ≤ μg, where μ is coefficient of friction between surfaces.",
    },
    {
      id: 75,
      question:
        "What happens to normal force when a block is on a rough incline and an external force pushes it into the plane?",
      answer:
        "Normal force increases, increasing maximum static friction possible.",
    },
    {
      id: 76,
      question:
        "Is tension always equal in a single massless pulley system?",
      answer:
        "Only if pulley is ideal (massless and frictionless); otherwise, tension differs.",
    },
    {
      id: 77,
      question:
        "Can a block remain stationary on a wedge placed in a horizontally accelerating truck?",
      answer:
        "Yes, if horizontal pseudo force balances component of gravity: a = g·tanθ.",
    },
    {
      id: 78,
      question:
        "Why must friction be considered even when there's no actual motion?",
      answer:
        "To oppose *tendency* of motion — key idea in static friction.",
    },
    {
      id: 79,
      question:
        "How do you identify if a block will slip in multi-surface systems?",
      answer:
        "Compare required frictional force (from equations) to limiting friction (μN).",
    },
    {
      id: 80,
      question:
        "A particle inside a rotating ring remains stuck. What provides centripetal force?",
      answer:
        "Friction between the ring and particle acts radially inward.",
    },
    {
      id: 81,
      question:
        "If friction is limiting and object moves at constant speed, is net force zero?",
      answer: "Yes; applied force is exactly balancing kinetic friction.",
    },
    {
      id: 82,
      question: "Why do light pulleys simplify tension analysis?",
      answer:
        "They ensure equal tension on both sides of the pulley, allowing easier equations.",
    },
    {
      id: 83,
      question: "Can pseudo force be greater than real forces in a system?",
      answer:
        "Yes, especially when analyzing from a strongly accelerating non-inertial frame.",
    },
    {
      id: 84,
      question:
        "Two blocks on each other on an incline are tied with a string. What determines tension?",
      answer:
        "Tension adjusts to balance differential tendencies due to gravity and friction.",
    },
    {
      id: 85,
      question:
        "A block is attached to a spring on a rough surface. What role does friction play in SHM?",
      answer:
        "It can limit or prevent oscillations if it exceeds spring restoring force.",
    },
    {
      id: 86,
      question:
        "What causes loss of contact at the top of vertical circular motion?",
      answer:
        "If centripetal force is less than mg, normal force becomes negative, i.e., no contact.",
    },
    {
      id: 87,
      question:
        "Why is constraint motion key in multi-body friction problems?",
      answer:
        "It provides relations between accelerations which reduce variables in equations.",
    },
    {
      id: 88,
      question:
        "In a block-and-wedge system, why is wedge acceleration sometimes independent of mass?",
      answer:
        "Due to symmetry and conservation of horizontal momentum in frictionless setups.",
    },
    {
      id: 89,
      question:
        "What is the cause of reaction forces in Newton's Third Law pair?",
      answer:
        "They arise due to mutual interactions and exist simultaneously, regardless of motion.",
    },
    {
      id: 90,
      question:
        "Why do students often misapply F = ma in non-inertial frames?",
      answer:
        "Because they forget to add pseudo force for frame acceleration; F = ma only holds in inertial frames.",
    },
    {
      id: 91,
      question:
        "Two blocks are pushed by a force F. Which block experiences more friction if they have different masses but same surface?",
      answer: "The heavier block, as friction = μN = μmg.",
    },
    {
      id: 92,
      question:
        "Why does a block-on-block system sometimes experience unequal acceleration despite being in contact?",
      answer:
        "Relative motion occurs due to insufficient friction or external constraint differences.",
    },
    {
      id: 93,
      question:
        "What happens to impulse when a block hits a rough wall and rebounds?",
      answer:
        "Normal impulse changes momentum; frictional impulse changes angular motion if rotation exists.",
    },
    {
      id: 94,
      question:
        "What indicates a violation of Newton's Third Law in a student’s solution?",
      answer:
        "If action and reaction are shown acting on same body or producing unequal results.",
    },
    {
      id: 95,
      question:
        "Block on rough surface is pulled by string. What force determines the direction of acceleration?",
      answer:
        "Net force = T - friction. Direction depends on whether T > μN or not.",
    },
    {
      id: 96,
      question:
        "Why can't you directly compare magnitudes of contact forces without full FBD?",
      answer:
        "Forces can have multiple components (normal and friction), and direction changes the net effect.",
    },
    {
      id: 97,
      question:
        "What is a common error while analyzing ring-pulley systems in circular motion?",
      answer:
        "Ignoring centripetal acceleration requirement for the rotating mass or misapplying radial force balance.",
    },
    {
      id: 98,
      question:
        "In block-pulley-wedge systems, what introduces complexity in normal forces?",
      answer:
        "Incline angles change reaction directions; tension and pseudo force affect net perpendicular contact.",
    },
    {
      id: 99,
      question:
        "Why does a block placed near edge of a plank slip when plank accelerates suddenly?",
      answer:
        "Friction isn't sufficient to match plank's acceleration — relative motion begins.",
    },
    {
      id: 100,
      question:
        "How do you handle frame shift in problems with moving platforms?",
      answer:
        "Apply pseudo force in non-inertial frame or solve in inertial frame with constraint accelerations.",
    },
    {
      id: 101,
      question:
        "A solid sphere rolls down an incline. Why is friction necessary even if there’s no slipping?",
      answer:
        "Static friction provides torque for rolling motion; without it, the sphere would slide.",
    },
    {
      id: 102,
      question:
        "How do you decide direction of friction in rolling objects on an incline?",
      answer:
        "If object accelerates more than required for pure rolling, friction acts opposite to motion; otherwise, along motion.",
    },
    {
      id: 103,
      question:
        "In ladder problems, what conditions must be satisfied to ensure equilibrium?",
      answer:
        "Balance of horizontal forces, vertical forces, and torque (∑Fx = 0, ∑Fy = 0, ∑τ = 0).",
    },
    {
      id: 104,
      question:
        "A ladder leans against a smooth wall. What provides horizontal equilibrium?",
      answer: "Friction at the base of the ladder.",
    },
    {
      id: 105,
      question:
        "In conical pendulum, what provides the required centripetal force?",
      answer: "The horizontal component of the tension in the string.",
    },
    {
      id: 106,
      question:
        "Can D'Alembert’s principle be used for non-inertial frames?",
      answer:
        "Yes, by treating pseudo force as real, allowing F - ma = 0 (dynamic equilibrium).",
    },
    {
      id: 107,
      question:
        "If coefficient of friction varies with position (μ = kx), how does motion change?",
      answer:
        "The resistive force becomes position dependent, complicating force equations and trajectory.",
    },
    {
      id: 108,
      question:
        "Two masses hang over a pulley, one on a platform in a lift. How is acceleration affected?",
      answer:
        "Lift's acceleration modifies normal force, altering net force on one side of the system.",
    },
    {
      id: 109,
      question:
        "A disc is spinning on a rough surface. What causes it to stop spinning?",
      answer:
        "Kinetic friction exerts torque opposite to spin, dissipating rotational energy.",
    },
    {
      id: 110,
      question: "Can static friction do work in a rolling object?",
      answer:
        "Yes, relative to ground it does work; but at point of contact, it doesn’t do work.",
    },
    {
      id: 111,
      question:
        "A block rests on a rotating disc. What condition ensures the block doesn't slip?",
      answer:
        "Friction must be ≥ required centripetal force: μmg ≥ mω²r ⇒ ω² ≤ μg/r.",
    },
    {
      id: 112,
      question:
        "In a rotating frame, what pseudo force acts on a particle?",
      answer: "Centrifugal force: mω²r outward from axis of rotation.",
    },
    {
      id: 113,
      question: "What is Coriolis force and when is it significant?",
      answer:
        "F_cor = 2mv × ω, significant in rotating frames (Earth), affects path curvature.",
    },
    {
      id: 114,
      question:
        "A rod leans on a wall and starts to slip. What causes the top end to lose contact first?",
      answer:
        "Reduction of normal force at the wall to zero due to torque imbalance and gravity.",
    },
    {
      id: 115,
      question:
        "Block placed inside a hemispherical shell starts slipping at certain angle. What gives the angle?",
      answer:
        "Set mg sinθ = μ mg cosθ ⇒ tanθ = μ; gives limiting angle of contact.",
    },
    {
      id: 116,
      question:
        "A body is in circular motion with constant speed. Is there any net force? Work done?",
      answer:
        "Yes, net centripetal force acts. But work done = 0 since force ⊥ displacement at all times.",
    },
    {
      id: 117,
      question: "What causes overestimation of friction in wedge problems?",
      answer:
        "Neglecting pseudo force when solving from non-inertial frame of the wedge.",
    },
    {
      id: 118,
      question: "What happens if pulley has mass but no friction at axle?",
      answer:
        "Tension differs on both sides, and rotational motion must be included.",
    },
    {
      id: 119,
      question: "Can static friction act downward on a surface?",
      answer:
        "Yes, e.g., in vertical wall problems where friction balances upward applied forces.",
    },
    {
      id: 120,
      question:
        "What does zero net torque imply in equilibrium conditions?",
      answer:
        "Either system is at rest or rotating with constant angular velocity.",
    },
    {
      id: 121,
      question:
        "In a multi-pulley Atwood machine, what must be conserved for accurate tension analysis?",
      answer:
        "Constraint relations (via string lengths) and total mechanical energy if frictionless.",
    },
    {
      id: 122,
      question: "Why does tension vary in a compound pulley with mass?",
      answer:
        "Because the pulley has rotational inertia, causing unequal tension on either side.",
    },
    {
      id: 123,
      question:
        "In a system of three blocks in contact on a table, how to find force on the middle block?",
      answer:
        "Use FBD of individual blocks; middle block experiences forces from both neighbors via friction/contact.",
    },
    {
      id: 124,
      question:
        "How does the presence of friction alter the net normal force in wedge problems?",
      answer:
        "Friction has vertical component (when not horizontal surface), modifying N due to its vector direction.",
    },
    {
      id: 125,
      question:
        "What’s the effect of adding a massless rod between two blocks pushed from one side?",
      answer:
        "It transmits compressive force; constraints must match displacements on both sides.",
    },
    {
      id: 126,
      question:
        "How do you deal with friction in pulley-on-incline questions?",
      answer:
        "Account for rolling/rotational dynamics of pulley and friction direction due to tendency of slipping.",
    },
    {
      id: 127,
      question:
        "Why do normal forces sometimes appear greater than weight in horizontal systems?",
      answer:
        "Because frictional interaction or external vertical forces (like pseudo forces) modify net vertical balance.",
    },
    {
      id: 128,
      question:
        "Block A over B, B on surface. Force applied on B. What limits block A from slipping?",
      answer:
        "Static friction between A and B must be enough to accelerate A with B.",
    },
    {
      id: 129,
      question:
        "When is it valid to treat multiple objects as one system for Newton’s Second Law?",
      answer:
        "When internal forces (tension/friction) are not of interest or do not affect net external force analysis.",
    },
    {
      id: 130,
      question:
        "Why does adding mass on a plank reduce its tendency to slip on a wedge?",
      answer:
        "More mass increases normal force ⇒ higher limiting static friction ⇒ more resistance to slipping.",
    },
  ];
